// import CaseStudy from "./components/CaseStudy";
import CTA from "./components/CTA";
import Events from "./components/Events";
import Features from "./components/Features";
import Hero from "./components/Hero";
import ProductPortfolio from "./components/ProducyPortfolio";
import ReelShowcase from "./components/ReelShowcase";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <ProductPortfolio />
      <Features />
      <CTA />
      <Events />
      <ReelShowcase />
      {/* <CaseStudy /> */}
    </div>
  );
}
