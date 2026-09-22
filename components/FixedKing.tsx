'use client'

import dynamic from 'next/dynamic'

const ChessKingScene = dynamic(() => import('./ChessKingScene'), { ssr: false })

export default function FixedKing() {
  return (
    <div className="fixed inset-y-0 right-0 w-[55%] pointer-events-none z-30">
      {/* Static purple radial halo — constant atmosphere anchor behind the king. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 65% at 50% 50%, rgba(168,85,247,0.28) 0%, rgba(168,85,247,0.12) 30%, rgba(120,60,200,0.04) 55%, transparent 75%)',
        }}
      />
      <ChessKingScene />
    </div>
  )
}
