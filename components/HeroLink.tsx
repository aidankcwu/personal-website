import type { ReactNode } from 'react'

type HeroLinkProps = {
  children: ReactNode
  href: string
  external?: boolean
}

// Shared link micro-interaction: an underline that wipes in from the left.
// The origin swap (right when idle, left on hover) is what makes it wipe in and
// out in the same direction instead of snapping back.
export const linkClass = [
  'group relative inline-flex items-center text-muted transition-colors duration-300',
  "before:pointer-events-none before:absolute before:left-0 before:top-[1.45em] before:h-px before:w-full before:bg-current before:content-['']",
  'before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[var(--ease-brand)]',
  'hover:text-ink hover:before:origin-left hover:before:scale-x-100',
  'motion-reduce:before:transition-none',
].join(' ')

export default function HeroLink({ children, href, external = false }: HeroLinkProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={linkClass}
    >
      {children}
    </a>
  )
}
