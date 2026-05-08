import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FeaturedProjects from "@/components/FeaturedProjects";
import CurrentlyBuilding from "@/components/CurrentlyBuilding";
import Interests from "@/components/Interests";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1">
        <Hero />
        <About />
        <FeaturedProjects />
        <CurrentlyBuilding />
        <Interests />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
