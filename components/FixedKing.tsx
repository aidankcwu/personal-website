'use client'

import dynamic from 'next/dynamic'

const ChessKingScene = dynamic(() => import('./ChessKingScene'), { ssr: false })

export default function FixedKing() {
  return (
    <div className="fixed inset-y-0 right-0 w-[50%] pointer-events-none z-0 opacity-50">
      <ChessKingScene />
    </div>
  )
}
