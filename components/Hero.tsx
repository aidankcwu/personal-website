export default function Hero() {
  return (
    <section className="flex flex-col justify-center min-h-screen px-6 pt-20 max-w-3xl mx-auto w-full">
      <p className="text-neutral-400 text-sm mb-3 tracking-wide uppercase">
        Software Engineer
      </p>
      <h1 className="text-5xl font-bold tracking-tight text-neutral-100 mb-6">
        Hi, I&apos;m Aidan.
      </h1>
      <p className="text-xl text-neutral-400 leading-relaxed max-w-xl">
        I build things at the intersection of software and ideas. Currently focused on
        [placeholder — what you&apos;re working on right now].
      </p>
      <div className="flex items-center gap-4 mt-10">
        <a
          href="#projects"
          className="px-5 py-2.5 rounded-md bg-neutral-100 text-neutral-900 font-medium text-sm hover:bg-white transition-colors"
        >
          See my work
        </a>
        <a
          href="#contact"
          className="px-5 py-2.5 rounded-md border border-neutral-700 text-neutral-300 text-sm hover:border-neutral-500 hover:text-neutral-100 transition-colors"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
