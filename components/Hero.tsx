import WavyBackground from './WavyBackground'
import HeroLink from './HeroLink'

const links = [
  { label: 'LinkedIn', href: '#', external: true },
  { label: 'Resume', href: '/resume.pdf', external: true },
  { label: 'GitHub', href: '#', external: true },
  { label: 'Email', href: 'mailto:placeholder@example.com', external: false },
]

export default function Hero() {
  return (
    <section className="relative flex items-center min-h-screen overflow-hidden">
      <WavyBackground />

      <div className="relative z-10 pl-6 md:pl-16 lg:pl-24 pr-6 pt-32 max-w-xl">
        <p className="text-[11px] text-neutral-500 mb-8 tracking-[0.25em] uppercase">
          Software Engineer
        </p>

        <h1 className="italic text-7xl md:text-8xl tracking-tight text-neutral-100 mb-10 leading-[0.95]">
          Aidan<span className="text-purple-400 not-italic">.</span>
        </h1>

        <p className="text-lg text-neutral-400 leading-relaxed mb-12 max-w-md">
          I&apos;m a [year] studying [major] at [university]. I spend most of my time
          building software, thinking about [topic], and occasionally losing at chess.
          My work tends to live at the intersection of [field A] and [field B] —
          drawn to problems where there&apos;s a hard technical challenge behind a
          clear real-world impact.
        </p>

        <div className="flex items-center flex-wrap gap-x-3 gap-y-2 text-sm italic text-neutral-400">
          {links.map((link, i) => (
            <span key={link.label} className="flex items-center gap-3">
              {i > 0 && <span className="text-neutral-700 not-italic">—</span>}
              <HeroLink href={link.href} external={link.external}>
                {link.label}
              </HeroLink>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
