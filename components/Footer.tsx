export default function Footer() {
  return (
    <footer className="pl-6 md:pl-16 lg:pl-24 pr-6 py-12 border-t border-neutral-900 mt-auto bg-neutral-950/80 backdrop-blur-sm relative z-10">
      <div className="flex items-center flex-wrap gap-x-3 text-[11px] italic text-neutral-600 max-w-2xl">
        <span>© {new Date().getFullYear()} Aidan Wu.</span>
        <span className="text-neutral-800 not-italic">—</span>
        <span>Built with Next.js and Tailwind.</span>
      </div>
    </footer>
  )
}
