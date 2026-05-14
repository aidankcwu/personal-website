'use client'

import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

// Slow-breathing dark-violet sphere gradient. Replaces the static radial
// halo that previously lived behind the king. Colors stay near-black so the
// king (white, glossy) remains the focal element — this is atmosphere only.
export default function KingHaloGradient() {
  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      pixelDensity={1}
      fov={45}
    >
      <ShaderGradient
        type="sphere"
        animate="on"
        uSpeed={0.08}
        uStrength={1.2}
        uDensity={1.1}
        uFrequency={0}
        uAmplitude={0}
        color1="#2a1245"
        color2="#1a0a2e"
        color3="#0a0a0a"
        cDistance={3.6}
        cPolarAngle={90}
        cAzimuthAngle={180}
        lightType="3d"
        brightness={0.9}
        reflection={0.1}
        grain="off"
        positionX={0}
        positionY={0}
        positionZ={0}
        rotationX={0}
        rotationY={0}
        rotationZ={0}
      />
    </ShaderGradientCanvas>
  )
}
