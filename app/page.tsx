import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SectionDivider from '@/components/SectionDivider'
import FeaturedProjects from '@/components/FeaturedProjects'
import AwardsEducation from '@/components/AwardsEducation'
import Footer from '@/components/Footer'
import FixedKing from '@/components/FixedKing'
import Grain from '@/components/Grain'

export default function Home() {
  return (
    <>
      <FixedKing />
      <Grain />

      <Navbar />
      <main className="relative z-10 flex flex-col flex-1">
        <Hero />
        <SectionDivider />
        <FeaturedProjects />
        {/* Thin grey end-to-end rule between sections. Fades to transparent
            before reaching the king's visible area so it doesn't appear to
            cut through the model. */}
        <div
          aria-hidden="true"
          className="h-px"
          style={{
            background:
              'linear-gradient(to right, rgb(38 38 38) 0%, rgb(38 38 38) 55%, transparent 68%)',
          }}
        />
        <AwardsEducation />
      </main>
      <Footer />
    </>
  )
}
