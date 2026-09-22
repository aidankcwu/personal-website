'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { STAGE, kingState } from './kingState'

const MODEL_URL = '/models/king.glb'

/** Visible height the king occupies in world units at the camera's z=0 plane. */
const TARGET_HEIGHT = 1.85

/**
 * Contour material. The ink line is derived from |N·V| — it inks the fragments
 * where the surface turns away from the camera, which is the silhouette plus
 * the tight curvature around it. Two reasons to do it in a shader rather than
 * with an inverted-hull shell: the model's winding is inconsistent (the mesh
 * needs DoubleSide), which breaks backface-based outlines, and abs() here makes
 * the result winding-independent.
 */
const CONTOUR_MATERIAL = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1,
  uniforms: {
    uFill: { value: new THREE.Color('#ffffff') },
    uInk: { value: new THREE.Color('#141414') },
    // Driven per frame — see the note in useFrame.
    uEdge: { value: 0.3 },
    uSoft: { value: 0.11 },
  },
  vertexShader: /* glsl */ `
    varying vec3 vNormalView;
    varying vec3 vViewDir;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vNormalView = normalize(normalMatrix * normal);
      vViewDir = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uFill;
    uniform vec3 uInk;
    uniform float uEdge;
    uniform float uSoft;
    varying vec3 vNormalView;
    varying vec3 vViewDir;
    void main() {
      float facing = abs(dot(normalize(vNormalView), normalize(vViewDir)));
      float line = 1.0 - smoothstep(uEdge - uSoft, uEdge + uSoft, facing);
      // Barely-there tonal falloff so the volume reads without a highlight.
      float shade = mix(0.94, 1.0, facing);
      gl_FragColor = vec4(mix(uFill * shade, uInk, line), 1.0);
    }
  `,
})

function KingModel() {
  const angleRef = useRef(0)
  const outerRef = useRef<THREE.Group>(null)

  const { scene } = useGLTF(MODEL_URL)

  const { model, fit } = useMemo(() => {
    scene.updateMatrixWorld(true)

    // Bake each mesh's world transform into a cloned geometry so everything
    // below lives in one flat coordinate space.
    const geos: THREE.BufferGeometry[] = []
    scene.traverse((child) => {
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

    const edgeMat = new THREE.LineBasicMaterial({
      color: '#141414',
      transparent: true,
      opacity: 0.35,
    })

    const group = new THREE.Group()
    geos.forEach((geo) => {
      group.add(new THREE.Mesh(geo, CONTOUR_MATERIAL))
      // Hard creases — the crown notches, the collar rings.
      group.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), edgeMat))
    })
    group.position.set(-center.x, -center.y, -center.z)

    return {
      model: group,
      // Normalises away the model's authored units.
      fit: TARGET_HEIGHT / (size.y || 1),
    }
  }, [scene])

  useFrame((_, delta) => {
    const outer = outerRef.current
    if (!outer) return

    const spin = kingState.spin
    angleRef.current += delta * 0.42 * spin

    // Below the threshold the king eases toward the nearest full turn so it
    // settles facing the viewer rather than stopping mid-rotation.
    if (spin < 0.4) {
      const turn = Math.PI * 2
      const nearest = Math.round(angleRef.current / turn) * turn
      angleRef.current += (nearest - angleRef.current) * (1 - spin / 0.4) * 0.12
    }

    outer.rotation.y = angleRef.current

    const norm = Math.min(1, kingState.size / STAGE)
    outer.scale.setScalar(fit * norm)

    // The contour is a fraction of the surface, so it thins in proportion as
    // the king shrinks. Widening the threshold as it gets smaller keeps the
    // line weight roughly constant on screen — legible on a board square,
    // still delicate at full size.
    CONTOUR_MATERIAL.uniforms.uEdge.value = 0.28 + (1 - norm) * 0.18
  })

  return (
    <group ref={outerRef}>
      <primitive object={model} />
    </group>
  )
}

export default function KingScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 30 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <KingModel />
    </Canvas>
  )
}

useGLTF.preload(MODEL_URL)
