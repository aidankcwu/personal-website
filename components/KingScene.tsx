'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { RoomEnvironment } from 'three-stdlib'
import { kingState } from './kingState'

const MODEL_URL = '/models/king.glb'

const FOV = 32
const CAM = new THREE.Vector3(0, 0.6, 6)

/** World units spanning the viewport height at the origin plane. */
const VIS_H = 2 * CAM.length() * Math.tan((FOV / 2) * (Math.PI / 180))

/** King height, parked and on the board, as a fraction of viewport height. */
const PARK_HEIGHT = VIS_H * 0.45
const BOARD_HEIGHT = VIS_H * 0.13

const SQUARE = BOARD_HEIGHT / 1.4
const THICKNESS = SQUARE * 0.2

/** Board centre, below the viewport centre. */
const BOARD_Y = -VIS_H * 0.26
/**
 * Tilt of the board's top face away from the camera, in radians. Small values
 * lay the board flatter, which foreshortens it into a slim strip and brings its
 * front edge into view — the 3D read comes from the perspective, not from
 * turning the face toward the viewer.
 */
const BOARD_TILT = 0.42

/** Spin rate below which the king starts righting itself for the landing. */
const SETTLE_FROM = 0.75

/** Drift speed, in rad/s, once you stop scrolling. */
const IDLE_SPEED = 0.32
/** Rotation per unit of scroll speed — rad/s per px/s. */
const SCROLL_GAIN = 0.0045
/** Ceiling on spin, or a fast flick turns the king into a blur. */
const MAX_SPIN = 9
/** Scroll speed, px/s, at which scroll fully takes over from the idle drift. */
const ACTIVITY_FULL = 260
/** How quickly the spin eases toward its target speed. Lower is heavier. */
const SPIN_DECAY = 7
/** Below this scroll speed the drift direction is left alone. */
const DRIFT_FLIP_AT = 60

/** Matches the original: rotation about a slightly off-vertical axis. */
const SPIN_AXIS = new THREE.Vector3(0.18, 1, 0.07).normalize()

const LIGHT_WALNUT = '#c69a6a'
const DARK_WALNUT = '#4a3323'

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
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

/**
 * Soft ellipse used as the king's contact shadow. Not a real shadow pass: the
 * king has stopped rotating by the time it lands, so a static falloff is
 * indistinguishable from one and costs nothing per frame.
 */
function makeShadowTexture() {
  const S = 128
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  // Weighted to keep real density out past the king's base — the piece hides
  // everything directly beneath it at this viewing angle, so a tight shadow is
  // a shadow you never see.
  gradient.addColorStop(0, 'rgba(0,0,0,0.55)')
  gradient.addColorStop(0.45, 'rgba(0,0,0,0.44)')
  gradient.addColorStop(0.75, 'rgba(0,0,0,0.16)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, S, S)
  return new THREE.CanvasTexture(canvas)
}

/**
 * Generates a small studio environment in memory and hands it to the scene.
 * The king's clearcoat needs something to reflect — without this its specular
 * has no source and the material reads as flat plastic. Built procedurally
 * rather than loading an HDR so there's no asset and no CDN request.
 */
function StudioEnvironment() {
  const gl = useThree((s) => s.gl)

  const texture = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const target = pmrem.fromScene(RoomEnvironment(), 0.04)
    pmrem.dispose()
    return target.texture
  }, [gl])

  useEffect(() => () => texture.dispose(), [texture])

  // Attached declaratively rather than assigned to scene.environment, which
  // would be mutating a value a hook handed back.
  return <primitive attach="environment" object={texture} />
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
  const shadowRef = useRef<THREE.Mesh>(null)
  const parkShadowRef = useRef<THREE.Mesh>(null)
  const basePoint = useRef(new THREE.Vector3())
  const corner = useRef(new THREE.Vector3())
  const angleRef = useRef(0)
  const spinSpeed = useRef(IDLE_SPEED)
  const driftSign = useRef(1)
  const easedIndex = useRef(0)
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
      envMapIntensity: 0.55,
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
      envMapIntensity: 0.3,
      transparent: true,
    })
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: DARK_WALNUT,
      roughness: 0.6,
      metalness: 0,
      envMapIntensity: 0.3,
      transparent: true,
    })
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(SQUARE * count, THICKNESS, SQUARE),
      // BoxGeometry material order: +X, -X, +Y, -Y, +Z, -Z.
      [edgeMaterial, edgeMaterial, topMaterial, edgeMaterial, edgeMaterial, edgeMaterial],
    )

    // Laid flat on the board's top face. Lives in board space so it inherits
    // the tip for free.
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: makeShadowTexture(),
        transparent: true,
        depthWrite: false,
        // Sits a hair above the board's top face. At this camera distance that
        // gap is under the depth buffer's precision, so without a polygon
        // offset the shadow's fragments lose the depth test and it renders as
        // nothing at all.
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
        opacity: 0,
      }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.renderOrder = 1

    // Shadow for the parked king, where there is no board to cast onto.
    // Deliberately NOT laid flat: the camera sits almost level with the parked
    // king, so a horizontal plane would be edge-on and collapse to nothing. A
    // camera-facing ellipse tucked under the base reads as a soft pool instead.
    const parkShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: makeShadowTexture(),
        transparent: true,
        depthWrite: false,
        opacity: 0,
      }),
    )
    parkShadow.renderOrder = -1

    return { king, board, shadow, parkShadow }
  }, [gltf, count])

  useFrame((state, delta) => {
    const place = placeRef.current
    const spin = spinRef.current
    const boardGroup = boardRef.current
    if (!place || !spin || !boardGroup) return

    const landed = kingState.landed
    const spinRate = 1 - landed

    if (kingState.still) {
      spin.rotation.set(0, 0, 0)
    } else {
      const velocity = kingState.scrollVelocity

      // Whichever way you last pushed it is the way it keeps drifting. Only
      // meaningful scroll updates this, so coasting to a stop doesn't flip the
      // direction on noise near zero.
      if (Math.abs(velocity) > DRIFT_FLIP_AT) {
        driftSign.current = Math.sign(velocity)
      }

      // Crossfade, not sum. Adding a constant idle speed to a signed scroll
      // speed makes them cancel whenever you scroll against the drift, so
      // scrolling one way feels strong and the other way feels dead. Fading
      // the idle out while you scroll keeps both directions symmetrical.
      const activity = smoothstep(0, ACTIVITY_FULL, Math.abs(velocity))
      const idle = IDLE_SPEED * driftSign.current
      const driven = clamp(velocity * SCROLL_GAIN, -MAX_SPIN, MAX_SPIN)
      const targetSpeed = idle * (1 - activity) + driven * activity

      // Flywheel, so the king carries a little momentum rather than snapping
      // between speeds. Exponential to stay frame-rate independent.
      spinSpeed.current +=
        (targetSpeed - spinSpeed.current) * (1 - Math.exp(-SPIN_DECAY * delta))

      // Scaled by spinRate so the spin winds down as the king lands, instead
      // of fighting the settle below at the moment it's trying to come to rest.
      angleRef.current += spinSpeed.current * delta * spinRate

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

    // Eased as a fractional square index in board space rather than as world
    // coordinates, so the king and its shadow are both derived from one number
    // and cannot drift apart. Only the square-to-square step is eased; the
    // landing is left driven straight off scroll so it can't lag the wheel.
    if (!settled.current || kingState.still) {
      easedIndex.current = kingState.index
      settled.current = true
    } else {
      easedIndex.current += (kingState.index - easedIndex.current) * 0.25
    }

    const lift = THICKNESS / 2
    const s = boardGroup.scale.x
    const localX = (easedIndex.current - (count - 1) / 2) * SQUARE

    // Base of the active square, on the board's tipped top face. Worked out
    // directly rather than via localToWorld so it doesn't depend on when the
    // group's world matrix was last refreshed.
    const squareX = localX * s
    const squareY = BOARD_Y + lift * Math.cos(BOARD_TILT) * s
    const squareZ = lift * Math.sin(BOARD_TILT) * s

    kingState.hop *= Math.pow(0.86, delta * 60)
    const hopLift = kingState.still ? 0 : Math.sin(kingState.hop * Math.PI)
    const arc = hopLift * SQUARE * 0.9

    // Contact shadow tightens and darkens as the king settles, and spreads and
    // lightens as it lifts — the cue that reads as leaving the surface rather
    // than sliding along it.
    const shadow = shadowRef.current
    if (shadow) {
      shadow.position.set(localX, lift + SQUARE * 0.02, 0)
      // Capped at one square: the board is exactly one square deep, so
      // anything wider hangs off the edge as a smudge floating in mid-air.
      const spread = SQUARE * (1 + hopLift * 0.12)
      shadow.scale.set(spread, spread, 1)
      ;(shadow.material as THREE.Material).opacity = reveal * (1 - hopLift * 0.6)
    }

    // Parked shadow. Fades out before the board shadow fades in, so the two
    // never overlap and the handover reads as one shadow following the king
    // down rather than two crossfading.
    const parkShadow = parkShadowRef.current
    if (parkShadow) {
      const strength = 1 - smoothstep(0, 0.45, landed)
      ;(parkShadow.material as THREE.Material).opacity = strength * 0.85
      parkShadow.visible = strength > 0.001
      parkShadow.scale.set(height * 0.62, height * 0.15, 1)
    }

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
    const baseY = parkedY + (squareY + arc - parkedY) * landed

    // This group's origin is the king's middle, so the offset from base to
    // middle has to follow the tip — otherwise leaning it back slides the base
    // off its square.
    const half = height / 2
    place.position.set(
      squareX * landed,
      baseY + half * Math.cos(tip),
      squareZ * landed + half * Math.sin(tip),
    )

    // Tracks the base of the piece rather than the centre of its group. The
    // spin axis is deliberately off-vertical, so the foot swings through a
    // cone while the group's centre stays put — anchoring the shadow to the
    // centre leaves it sitting beside the king instead of under it.
    if (parkShadow) {
      place.updateMatrixWorld()
      const foot = basePoint.current.set(0, -0.5, 0).applyQuaternion(spin.quaternion)
      place.localToWorld(foot)
      parkShadow.position.set(foot.x, foot.y + height * 0.03, foot.z - height * 0.12)
    }

    // Screen-space box per square, so the DOM can lay a real button over each
    // one. Projected here because only the scene knows where the board ended
    // up, and the matrix is refreshed first because the scale above was set
    // this frame and would otherwise still be a frame behind.
    kingState.boardReveal = reveal
    if (reveal > 0.01) {
      const { camera, size } = state
      boardGroup.updateMatrixWorld()
      const half = SQUARE / 2
      for (let i = 0; i < count; i++) {
        const cx = (i - (count - 1) / 2) * SQUARE
        let minX = Infinity
        let maxX = -Infinity
        let minY = Infinity
        let maxY = -Infinity
        for (let c = 0; c < 4; c++) {
          const v = corner.current.set(
            cx + (c & 1 ? half : -half),
            lift,
            c & 2 ? half : -half,
          )
          boardGroup.localToWorld(v).project(camera)
          const px = (v.x * 0.5 + 0.5) * size.width
          const py = (-v.y * 0.5 + 0.5) * size.height
          minX = Math.min(minX, px)
          maxX = Math.max(maxX, px)
          minY = Math.min(minY, py)
          maxY = Math.max(maxY, py)
        }
        const box = kingState.squares[i] ?? (kingState.squares[i] = { x: 0, y: 0, w: 0, h: 0 })
        box.x = minX
        box.y = minY
        box.w = maxX - minX
        box.h = maxY - minY
      }
      kingState.squares.length = count
    }
  })

  return (
    <>
      {/* Dialled back from the pre-environment values: the studio map now
          supplies most of the fill, and leaving these as they were blew the
          king out to flat white. */}
      <ambientLight intensity={0.25} />
      <hemisphereLight args={['#ffffff', '#d8d2c8', 0.25]} />
      <directionalLight position={[3, 5, 4]} intensity={0.9} />
      <directionalLight position={[-4, 2, 3]} intensity={0.25} />

      <group ref={boardRef} position={[0, BOARD_Y, 0]} rotation={[BOARD_TILT, 0, 0]}>
        <primitive object={built.board} />
        <primitive object={built.shadow} ref={shadowRef} />
      </group>

      <primitive object={built.parkShadow} ref={parkShadowRef} />

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
      <StudioEnvironment />
      <Scene count={count} />
    </Canvas>
  )
}

useGLTF.preload(MODEL_URL)
