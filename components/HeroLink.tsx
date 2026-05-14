import type { ReactNode } from 'react'

type HeroLinkProps = {
  children: ReactNode
  href: string
  external?: boolean
  className?: string
}

export default function HeroLink({
  children,
  href,
  external = false,
  className,
}: HeroLinkProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={[
        'group relative inline-flex items-center text-neutral-400 transition-colors duration-300',
        'before:pointer-events-none before:absolute before:left-0 before:top-[1.45em] before:h-px before:w-full before:bg-current before:content-[\'\']',
        'before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]',
        'hover:text-purple-300 hover:before:origin-left hover:before:scale-x-100',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span>{children}</span>
      <svg
        className="ml-[0.35em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}
