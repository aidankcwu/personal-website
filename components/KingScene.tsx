'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { kingState } from './kingState'

const MODEL_URL = '/models/king.glb'

const FOV = 32
const CAM = new THREE.Vector3(0, 0.6, 6)

/** World units spanning the viewport height at the origin plane. */
const VIS_H = 2 * CAM.length() * Math.tan((FOV / 2) * (Math.PI / 180))

/** King height, parked and on the board, as a fraction of viewport height. */
const PARK_HEIGHT = VIS_H * 0.36
const BOARD_HEIGHT = VIS_H * 0.13

const SQUARE = BOARD_HEIGHT / 1.4
const THICKNESS = SQUARE * 0.2

/** Board centre, below the viewport centre. */
const BOARD_Y = -VIS_H * 0.19
/**
 * Tilt of the board's top face away from the camera, in radians. Small values
 * lay the board flatter, which foreshortens it into a slim strip and brings its
 * front edge into view — the 3D read comes from the perspective, not from
 * turning the face toward the viewer.
 */
const BOARD_TILT = 0.42

/** Spin rate below which the king starts righting itself for the landing. */
const SETTLE_FROM = 0.75

/** Matches the original: rotation about a slightly off-vertical axis. */
const SPIN_AXIS = new THREE.Vector3(0.18, 1, 0.07).normalize()

const LIGHT_WALNUT = '#c69a6a'
const DARK_WALNUT = '#4a3323'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/**
 * Walnut board top, drawn procedurally so there's no texture asset to ship.
 * Grain runs the length of the board and crosses the square seams, the way a
 * glued-up panel would, rather than restarting per square.
 */
function makeBoardTexture(count: number) {
  const SQ = 256
  const canvas = document.createElement('canvas')
  canvas.width = SQ * count
  canvas.height = SQ
  const ctx = canvas.getContext('2d')!
  const { width: W, height: H } = canvas

  for (let i = 0; i < count; i++) {
    ctx.fillStyle = i % 2 === 0 ? LIGHT_WALNUT : DARK_WALNUT
    ctx.fillRect(i * SQ, 0, SQ, SQ)
  }

  for (let i = 0; i < 300; i++) {
    const y = Math.random() * H
    const amp = 1.5 + Math.random() * 6
    const freq = 0.004 + Math.random() * 0.012
    const phase = Math.random() * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 8; x <= W; x += 8) {
      ctx.lineTo(x, y + Math.sin(x * freq + phase) * amp)
    }
    ctx.strokeStyle =
      Math.random() > 0.35
        ? `rgba(38,20,8,${0.03 + Math.random() * 0.11})`
        : `rgba(255,238,214,${0.02 + Math.random() * 0.07})`
    ctx.lineWidth = 0.5 + Math.random() * 2
    ctx.stroke()
  }

  // Seams between squares.
  ctx.fillStyle = 'rgba(28,15,7,0.34)'
  for (let i = 1; i < count; i++) ctx.fillRect(i * SQ - 1, 0, 2, H)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

/** Lets the orchestrator drive rendering while the king is on screen. */
function Invalidator() {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    kingState.invalidate = invalidate
    return () => {
      kingState.invalidate = undefined
    }
  }, [invalidate])
  return null
}

function Scene({ count }: { count: number }) {
  const { scene: gltf } = useGLTF(MODEL_URL)

  const placeRef = useRef<THREE.Group>(null)
  const spinRef = useRef<THREE.Group>(null)
  const boardRef = useRef<THREE.Group>(null)
  const angleRef = useRef(0)
  const squareRef = useRef(new THREE.Vector3())
  const settled = useRef(false)

  const built = useMemo(() => {
    gltf.updateMatrixWorld(true)

    // Bake each mesh's world transform into a cloned geometry so everything
    // below lives in one flat coordinate space.
    const geos: THREE.BufferGeometry[] = []
    gltf.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.isMesh && mesh.geometry) {
        geos.push(mesh.geometry.clone().applyMatrix4(mesh.matrixWorld))
      }
    })

    const bounds = new THREE.Box3()
    geos.forEach((g) => {
      g.computeBoundingBox()
      if (g.boundingBox) bounds.union(g.boundingBox)
    })
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())

    // DoubleSide because the model's face winding is inconsistent.
    const kingMaterial = new THREE.MeshPhysicalMaterial({
      color: '#f1efec',
      metalness: 0,
      roughness: 0.32,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      reflectivity: 0.35,
      side: THREE.DoubleSide,
    })

    // Two nested nodes on purpose. A node's own position is applied after its
    // own scale, so setting both here would leave the recentring offset
    // unscaled; keeping them on separate nodes makes the order explicit.
    // Inner: model centred on its bounding box. Outer: normalised to unit
    // height, so an ancestor's scale reads directly as the king's height in
    // world units and the spin axis runs through the middle of the piece.
    const centred = new THREE.Group()
    geos.forEach((geo) => centred.add(new THREE.Mesh(geo, kingMaterial)))
    centred.position.set(-center.x, -center.y, -center.z)

    const king = new THREE.Group()
    king.add(centred)
    king.scale.setScalar(1 / (size.y || 1))

    const topMaterial = new THREE.MeshStandardMaterial({
      map: makeBoardTexture(count),
      roughness: 0.5,
      metalness: 0,
      transparent: true,
    })
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: DARK_WALNUT,
      roughness: 0.6,
      metalness: 0,
      transparent: true,
    })
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(SQUARE * count, THICKNESS, SQUARE),
      // BoxGeometry material order: +X, -X, +Y, -Y, +Z, -Z.
      [edgeMaterial, edgeMaterial, topMaterial, edgeMaterial, edgeMaterial, edgeMaterial],
    )

    return { king, board }
  }, [gltf, count])

  useFrame((_, delta) => {
    const place = placeRef.current
    const spin = spinRef.current
    const boardGroup = boardRef.current
    if (!place || !spin || !boardGroup) return

    const landed = kingState.landed
    const spinRate = 1 - landed

    if (kingState.still) {
      spin.rotation.set(0, 0, 0)
    } else {
      angleRef.current += delta * 0.42 * spinRate
      // Once the landing starts, the king eases toward the nearest full turn
      // so it arrives upright and facing the viewer rather than frozen
      // mid-rotation. The threshold is high — settling begins early in the
      // descent — because a piece still tilted off-axis on its way down reads
      // as falling rather than being placed.
      if (spinRate < SETTLE_FROM) {
        const turn = Math.PI * 2
        const nearest = Math.round(angleRef.current / turn) * turn
        angleRef.current +=
          (nearest - angleRef.current) * (1 - spinRate / SETTLE_FROM) * 0.14
      }
      spin.setRotationFromAxisAngle(SPIN_AXIS, angleRef.current)
    }

    // Board fades and settles in over the back half of the landing. The
    // materials are read back off the mesh rather than captured from the memo,
    // which keeps this loop from mutating a value the render produced.
    const reveal = smoothstep(0.45, 1, landed)
    const boardMesh = boardGroup.children[0] as THREE.Mesh | undefined
    const boardMaterials = boardMesh?.material as THREE.Material[] | undefined
    if (boardMaterials) {
      // Slot 2 is the textured top; every other slot shares one edge material.
      boardMaterials[2].opacity = reveal
      boardMaterials[0].opacity = reveal
    }
    boardGroup.visible = reveal > 0.001
    boardGroup.scale.setScalar(0.92 + reveal * 0.08)

    const height = PARK_HEIGHT + (BOARD_HEIGHT - PARK_HEIGHT) * landed
    place.scale.setScalar(height)

    // Base of the active square, on the board's tilted top face. Worked out
    // directly rather than via localToWorld so it doesn't depend on when the
    // group's world matrix was last refreshed.
    const lift = THICKNESS / 2
    const s = boardGroup.scale.x
    const squareTarget = squareRef.current
    const targetX = (kingState.index - (count - 1) / 2) * SQUARE * s
    const targetY = BOARD_Y + lift * Math.cos(BOARD_TILT) * s
    const targetZ = lift * Math.sin(BOARD_TILT) * s

    if (!settled.current || kingState.still) {
      squareTarget.set(targetX, targetY, targetZ)
      settled.current = true
    } else {
      // Only the square-to-square step is eased. The landing itself is left
      // driven straight off scroll so it can't lag behind the wheel.
      squareTarget.x += (targetX - squareTarget.x) * 0.25
      squareTarget.y += (targetY - squareTarget.y) * 0.25
      squareTarget.z += (targetZ - squareTarget.z) * 0.25
    }

    kingState.hop *= Math.pow(0.86, delta * 60)
    const arc = kingState.still ? 0 : Math.sin(kingState.hop * Math.PI) * SQUARE * 0.9

    // Tip the king back by the same angle the board is tipped. Without this
    // the board is drawn as if seen from above while the king is drawn from
    // eye level, and the king reads as a flat cutout on a 3D board. Ramped
    // with the landing, so it stays head-on while parked and only takes on the
    // board's angle on the way down.
    const tip = BOARD_TILT * landed
    place.rotation.x = tip

    // Parked: tracks its slot on the way in, then holds dead centre. The
    // orchestrator has already done the clamping; this is just the conversion
    // from viewport fractions to world units.
    const parkedY = kingState.parkOffset * VIS_H - PARK_HEIGHT / 2
    const baseY = parkedY + (squareTarget.y + arc - parkedY) * landed

    // This group's origin is the king's middle, so the offset from base to
    // middle has to follow the tip — otherwise leaning it back slides the base
    // off its square.
    const half = height / 2
    place.position.set(
      squareTarget.x * landed,
      baseY + half * Math.cos(tip),
      squareTarget.z * landed + half * Math.sin(tip),
    )
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <hemisphereLight args={['#ffffff', '#d8d2c8', 0.5]} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <directionalLight position={[-4, 2, 3]} intensity={0.4} />

      <group ref={boardRef} position={[0, BOARD_Y, 0]} rotation={[BOARD_TILT, 0, 0]}>
        <primitive object={built.board} />
      </group>

      <group ref={placeRef}>
        <group ref={spinRef}>
          <primitive object={built.king} />
        </group>
      </group>
    </>
  )
}

export default function KingScene({ count }: { count: number }) {
  return (
    <Canvas
      camera={{ position: CAM.toArray(), fov: FOV }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Invalidator />
      <Scene count={count} />
    </Canvas>
  )
}

useGLTF.preload(MODEL_URL)
