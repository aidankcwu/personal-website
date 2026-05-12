import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FeaturedProjects from '@/components/FeaturedProjects'
import AwardsEducation from '@/components/AwardsEducation'
import Footer from '@/components/Footer'
import FixedKing from '@/components/FixedKing'

export default function Home() {
  return (
    <>
      {/* fixed king — stays on screen as user scrolls */}
      <FixedKing />

      <Navbar />
      <main className="relative z-10 flex flex-col flex-1">
        <Hero />
        <FeaturedProjects />
        <AwardsEducation />
      </main>
      <Footer />
    </>
  )
}
