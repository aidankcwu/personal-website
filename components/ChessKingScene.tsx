'use client'

import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function KingMesh() {
  const groupRef = useRef<THREE.Group>(null)
  const axis = new THREE.Vector3(0.18, 1, 0.07).normalize()
  const scrollRef = useRef(0)
  const prevScrollRef = useRef(0)

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame(() => {
    const delta = scrollRef.current - prevScrollRef.current
    prevScrollRef.current = scrollRef.current
    if (Math.abs(delta) > 0.1 && groupRef.current) {
      groupRef.current.rotateOnAxis(axis, delta * 0.012)
    }
  })

  const mat = (
    <meshStandardMaterial color="#e8e8e8" metalness={0.15} roughness={0.5} />
  )

  return (
    <group ref={groupRef}>
      {/* base plate */}
      <mesh position={[0, -2.15, 0]}>
        <cylinderGeometry args={[1.15, 1.25, 0.18, 48]} />
        {mat}
      </mesh>
      {/* base collar ring */}
      <mesh position={[0, -2.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.08, 0.1, 16, 48]} />
        {mat}
      </mesh>
      {/* lower body */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.58, 1.0, 1.7, 48]} />
        {mat}
      </mesh>
      {/* waist band */}
      <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.09, 16, 48]} />
        {mat}
      </mesh>
      {/* upper body */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.44, 0.6, 1.05, 48]} />
        {mat}
      </mesh>
      {/* neck */}
      <mesh position={[0, 1.08, 0]}>
        <cylinderGeometry args={[0.28, 0.42, 0.32, 48]} />
        {mat}
      </mesh>
      {/* head sphere */}
      <mesh position={[0, 1.48, 0]}>
        <sphereGeometry args={[0.36, 48, 48]} />
        {mat}
      </mesh>
      {/* cross — vertical */}
      <mesh position={[0, 2.05, 0]}>
        <boxGeometry args={[0.1, 0.62, 0.1]} />
        {mat}
      </mesh>
      {/* cross — horizontal */}
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[0.42, 0.1, 0.1]} />
        {mat}
      </mesh>
    </group>
  )
}

export default function ChessKingScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 9], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} />
      <directionalLight position={[-5, 1, 2]} intensity={0.4} color="#a0b0ff" />
      <directionalLight position={[0, -2, -6]} intensity={0.25} color="#ffffff" />
      <KingMesh />
    </Canvas>
  )
}
