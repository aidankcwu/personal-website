import Hero from '@/components/Hero'
import SectionBreak from '@/components/SectionBreak'
import InfoBlock from '@/components/InfoBlock'
import Projects from '@/components/Projects'
import PersistentKing from '@/components/PersistentKing'
import SmoothScroll from '@/components/SmoothScroll'
import { featuredProjects } from '@/data/projects'

export default function Home() {
  return (
    <>
      <SmoothScroll />

      {/* The only element on the page with depth. Lives outside <main> because
          it persists across every section — it is never remounted. */}
      <PersistentKing projectCount={featuredProjects.length} />

      <main className="relative">
        <Hero />
        <SectionBreak />
        <InfoBlock />
        <SectionBreak />
        <Projects />
      </main>
    </>
  )
}
