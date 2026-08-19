import Header from "./components/Header";
import Hero from "./components/Hero";
import SocialProof from "./components/SocialProof";
import PainSection from "./components/PainSection";
import ConversionCTA from "./components/ConversionCTA";
import Features from "./components/Features";
import Screenshots from "./components/Screenshots";
import HowItWorks from "./components/HowItWorks";
import Objections from "./components/Objections";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import CTAFinal from "./components/CTAFinal";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip">
      <Header />
      <Hero />
      <SocialProof />
      <PainSection />
      <ConversionCTA />
      <Features />
      <Screenshots />
      <HowItWorks />
      <Objections />
      <Pricing />
      <FAQ />
      <CTAFinal />
      <Footer />
    </main>
  );
}
