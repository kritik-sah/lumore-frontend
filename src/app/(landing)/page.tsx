import AppStats from "./components/AppStats";
import HowLumoreIsDifferent from "./components/HowLumoreIsDifferent";
import Hero from "./components/Hero";
import HowLumoreWorks from "./components/HowLumoreWorks";
import ProductPortfolio from "./components/ProducyPortfolio";
import ReelShowcase from "./components/ReelShowcase";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <ProductPortfolio />
      <AppStats />
      <HowLumoreWorks />
      <HowLumoreIsDifferent />
      <ReelShowcase />
    </div>
  );
}
