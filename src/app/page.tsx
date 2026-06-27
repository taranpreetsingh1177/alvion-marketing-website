import {
  Contact,
  Header,
  Hero,
  HeroMan,
  NoiseProblem,
  ScrollSnap,
  Services,
  Solution,
} from "@/sections/home";

export default function Home() {
  return (
    <ScrollSnap>
      <Header />
      <main>
        <Hero />
        <NoiseProblem />
        <Solution />
        <Services />
        <Contact />
      </main>
      <HeroMan />
    </ScrollSnap>
  );
}
