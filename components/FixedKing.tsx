'use client'

import dynamic from 'next/dynamic'

const ChessKingScene = dynamic(() => import('./ChessKingScene'), { ssr: false })
const KingHaloGradient = dynamic(() => import('./KingHaloGradient'), { ssr: false })

export default function FixedKing() {
  return (
    <div className="fixed inset-y-0 right-0 w-[55%] pointer-events-none z-30">
      {/* Animated dark-violet shader gradient — replaces the static radial halo.
          Lives behind the king as the breathing atmosphere anchor. */}
      <div className="absolute inset-0">
        <KingHaloGradient />
      </div>
      <ChessKingScene />
    </div>
  )
}
