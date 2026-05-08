export default function About() {
  return (
    <section id="about" className="px-6 py-24 max-w-3xl mx-auto w-full">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-8">
        About
      </h2>
      <div className="space-y-4 text-neutral-300 text-lg leading-relaxed">
        <p>
          I&apos;m a [year] studying [major] at [university]. I spend most of my time building
          software, thinking about [topic], and occasionally losing at chess.
        </p>
        <p>
          My work tends to live at the intersection of [field A] and [field B]. I&apos;m drawn to
          problems where there&apos;s a clear real-world impact and a hard technical challenge sitting
          behind it.
        </p>
        <p>
          Before this, I worked at [company] on [thing], and [other experience].
        </p>
      </div>
    </section>
  );
}
