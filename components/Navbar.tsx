import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center pl-6 md:pl-16 lg:pl-24 pr-6 py-5">
      <Link
        href="/"
        className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 hover:text-neutral-200 transition-colors"
      >
        Aidan Wu
      </Link>
    </nav>
  )
}
