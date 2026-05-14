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
        <AwardsEducation />
      </main>
      <Footer />
    </>
  )
}
