'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_URL = '/models/king.glb'

const KING_MATERIAL = new THREE.MeshPhysicalMaterial({
  color: '#f4f4f4',
  metalness: 0,
  roughness: 0.18,
  clearcoat: 0.8,
  clearcoatRoughness: 0.1,
  reflectivity: 0.5,
  side: THREE.DoubleSide,
})

function FaceAndKing() {
  const { scene: kingScene } = useGLTF(MODEL_URL)

  // Load face texture defensively: missing file falls back to a placeholder color
  // instead of crashing the suspense boundary.
  const [faceTexture, setFaceTexture] = useState<THREE.Texture | null>(null)
  useEffect(() => {
    let cancelled = false
    new THREE.TextureLoader().load(
      '/face.jpg',
      (tex) => {
        if (cancelled) return
        tex.colorSpace = THREE.SRGBColorSpace
        tex.minFilter = THREE.LinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.wrapS = THREE.ClampToEdgeWrapping
        tex.wrapT = THREE.ClampToEdgeWrapping
        tex.generateMipmaps = false

        // CircleGeometry UVs span a 1:1 square. If the source image isn't square
        // it gets stretched. Use texture.offset/repeat to crop to the centered
        // square region of the texture so aspect is preserved.
        const img = tex.image as HTMLImageElement | undefined
        if (img && img.width > 0 && img.height > 0) {
          const aspect = img.width / img.height
          if (aspect >= 1) {
            // wider than tall — crop left/right
            tex.repeat.set(1 / aspect, 1)
            tex.offset.set((1 - 1 / aspect) / 2, 0)
          } else {
            // taller than wide — crop top/bottom
            tex.repeat.set(1, aspect)
            tex.offset.set(0, (1 - aspect) / 2)
          }
        }

        tex.needsUpdate = true
        setFaceTexture(tex)
      },
      undefined,
      (err) => {
        if (!cancelled) {
          console.warn('[ChessKingScene] face.jpg load failed:', err)
        }
      },
    )
    return () => { cancelled = true }
  }, [])

  // Override the king's material once; idempotent so Strict Mode double-mounts are safe.
  kingScene.traverse((child) => {
    const m = child as THREE.Mesh
    if (m.isMesh && m.material !== KING_MATERIAL) {
      m.material = KING_MATERIAL
    }
  })

  const faceRef = useRef<THREE.Mesh>(null)
  const kingFlipRef = useRef<THREE.Group>(null)
  const rotationGroup = useRef<THREE.Group>(null)
  const tiltedAxis = new THREE.Vector3(0.18, 1, 0.07).normalize()
  const scrollRef = useRef(0)

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame(() => {
    const vh = window.innerHeight
    const maxScroll = document.documentElement.scrollHeight - vh
    const scrollY = scrollRef.current

    // Flip progress: 0 → 1 across scroll [0, vh].
    const flipT = Math.max(0, Math.min(1, scrollY / vh))

    // Face: rotates around Y. Visible only during first half of the flip.
    if (faceRef.current) {
      faceRef.current.rotation.y = flipT * Math.PI
      faceRef.current.visible = flipT < 0.5
    }

    // King flip group: outer rotation purely around Y (no tilt).
    // Visible only second half. Rotates from -π/2 (edge-on side) → 0 (facing camera).
    // Formula: -π * (1 - flipT) → at flipT=0.5 yields -π/2, at flipT=1 yields 0.
    if (kingFlipRef.current) {
      kingFlipRef.current.rotation.y = -Math.PI * (1 - flipT)
      kingFlipRef.current.visible = flipT >= 0.5
    }

    // Inner rotation group: tilted-axis rotation. Starts the moment the king first
    // appears (scroll = 0.5·vh) so there's no stationary beat between "flip lands"
    // and "rotation begins" — the king is already in motion when it takes over.
    if (rotationGroup.current) {
      const rotationStart = vh * 0.5
      const active = Math.max(1, maxScroll - rotationStart)
      const kingT = Math.max(0, Math.min(1, (scrollY - rotationStart) / active))
      rotationGroup.current.setRotationFromAxisAngle(tiltedAxis, kingT * Math.PI * 2)
    }
  })

  return (
    <>
      {/* Face plane — a textured disc rendered inside the 3D scene.
          `key` forces R3F to remount the material when the texture loads so the
          shader recompiles with the `map` uniform wired up. Without this, R3F
          updates the map prop but doesn't trigger a shader recompile, and the
          mesh renders pure color (white). */}
      <mesh ref={faceRef} position={[0, 0, 0]}>
        <circleGeometry args={[0.5, 64]} />
        <meshBasicMaterial
          key={faceTexture ? 'textured' : 'placeholder'}
          map={faceTexture ?? null}
          color={faceTexture ? '#ffffff' : '#2a1f3d'}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* King — full 3D model. Outer group handles pure-Y flip rotation; inner
          handles the post-flip slow tilted-axis rotation. */}
      <group ref={kingFlipRef}>
        <group ref={rotationGroup} scale={0.25}>
          <Center>
            <primitive object={kingScene} />
          </Center>
        </group>
      </group>
    </>
  )
}

export default function ChessKingScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.85, 3.5], fov: 35 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.8} />
      <directionalLight position={[-5, 1, 2]} intensity={0.5} color="#a0b0ff" />
      <FaceAndKing />
    </Canvas>
  )
}

useGLTF.preload(MODEL_URL)
