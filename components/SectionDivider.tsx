export default function SectionDivider() {
  return (
    <div aria-hidden="true" className="pb-24 relative z-10">
      <div className="relative h-36 w-full overflow-hidden bg-purple-700">
        {/* Halo layer A — left-weighted bright lobe drifting laterally */}
        <div
          className="absolute inset-0 will-change-[opacity,transform]"
          style={{
            background:
              'radial-gradient(ellipse 55% 90% at 28% 50%, #a855f7 0%, rgba(168,85,247,0.4) 35%, transparent 70%)',
            animation: 'halo-drift-a 7s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />
        {/* Halo layer B — right-weighted deeper-violet lobe */}
        <div
          className="absolute inset-0 will-change-[opacity,transform]"
          style={{
            background:
              'radial-gradient(ellipse 55% 90% at 72% 50%, #c084fc 0%, rgba(192,132,252,0.35) 35%, transparent 70%)',
            animation: 'halo-drift-b 11s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />
        {/* Halo layer C — center, broader, slower; gives the band its core glow */}
        <div
          className="absolute inset-0 will-change-[opacity,transform]"
          style={{
            background:
              'radial-gradient(ellipse 70% 110% at 50% 50%, #d8b4fe 0%, rgba(216,180,254,0.25) 30%, transparent 65%)',
            animation: 'halo-drift-c 13s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* Rim aura — sits outside the band's bounds and breathes independently.
          Uses a separate non-clipping wrapper so the glow extends above/below. */}
      <div
        className="pointer-events-none absolute left-0 right-0 h-36 -mt-36"
        style={{
          boxShadow:
            '0 0 80px 10px rgba(168,85,247,0.55), 0 0 180px 30px rgba(168,85,247,0.25)',
          animation: 'rim-breathe 5s ease-in-out infinite',
        }}
      />
    </div>
  )
}
