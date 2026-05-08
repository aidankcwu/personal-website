export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-800">
      <a href="/" className="text-sm font-medium text-neutral-100 hover:text-white transition-colors">
        Aidan Wu
      </a>
      <div className="flex items-center gap-6 text-sm text-neutral-400">
        <a href="#about" className="hover:text-neutral-100 transition-colors">About</a>
        <a href="#projects" className="hover:text-neutral-100 transition-colors">Projects</a>
        <a href="#contact" className="hover:text-neutral-100 transition-colors">Contact</a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-md border border-neutral-700 hover:border-neutral-500 hover:text-neutral-100 transition-colors"
        >
          Resume
        </a>
      </div>
    </nav>
  );
}
