const interests = [
  { label: "Chess", note: "Enjoy playing at [rating/level]. Follow the pro scene closely." },
  { label: "Machine Learning", note: "Particularly interested in [subfield or application]." },
  { label: "Reading", note: "Lately: [book title]. Generally: [genre or topic area]." },
  { label: "Placeholder interest", note: "A sentence about why this matters to you." },
];

export default function Interests() {
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto w-full">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-8">
        Interests
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {interests.map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40"
          >
            <p className="font-medium text-neutral-200 mb-1">{item.label}</p>
            <p className="text-sm text-neutral-500 leading-relaxed">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
