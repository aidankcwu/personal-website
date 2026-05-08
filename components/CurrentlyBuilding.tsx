const items = [
  {
    title: "Project in progress",
    description:
      "Short description of what you're actively working on. What problem does it solve, and why are you building it?",
  },
  {
    title: "Another thing you're exploring",
    description:
      "Could be a side experiment, a research direction, or something you're just noodling on.",
  },
];

export default function CurrentlyBuilding() {
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto w-full">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-8">
        Currently Building
      </h2>
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.title} className="flex gap-4">
            <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <div>
              <p className="font-medium text-neutral-200 mb-1">{item.title}</p>
              <p className="text-sm text-neutral-400 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
