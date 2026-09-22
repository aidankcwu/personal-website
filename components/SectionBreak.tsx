// Full-bleed section delimiter: a tall band of pure surface bounded by a
// hairline rule top and bottom. The page's only separator motif — a hard cut
// in the vertical rhythm, not a decoration.
export default function SectionBreak() {
  return (
    <div aria-hidden="true" className="relative z-10 border-y border-rule py-14 md:py-20" />
  )
}
