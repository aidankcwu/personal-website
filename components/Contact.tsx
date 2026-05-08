const links = [
  { label: "Email", href: "mailto:placeholder@example.com", display: "placeholder@example.com" },
  { label: "GitHub", href: "https://github.com", display: "github.com/placeholder" },
  { label: "LinkedIn", href: "https://linkedin.com", display: "linkedin.com/in/placeholder" },
  { label: "Twitter / X", href: "https://x.com", display: "@placeholder" },
];

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24 max-w-3xl mx-auto w-full">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-8">
        Contact
      </h2>
      <p className="text-neutral-400 mb-8 leading-relaxed">
        I&apos;m always open to interesting conversations, collaborations, or just a good chess game.
        Best way to reach me is email.
      </p>
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 hover:border-neutral-600 transition-colors group"
          >
            <span className="text-sm text-neutral-500">{link.label}</span>
            <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
              {link.display} ↗
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
