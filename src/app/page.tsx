import {
  Header,
  Hero,
  HeroMan,
  NoiseProblem,
  Portfolio,
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
        <Portfolio />
        <Services />
      </main>
      <HeroMan />
    </ScrollSnap>
  );
}
