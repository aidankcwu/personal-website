export default function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-neutral-800 mt-auto">
      <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-neutral-600">
        <span>© {new Date().getFullYear()} Aidan Wu</span>
        <span>Built with Next.js + Tailwind</span>
      </div>
    </footer>
  );
}
