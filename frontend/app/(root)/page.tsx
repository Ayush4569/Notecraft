import Footer from "./_components/footer";
import Heading from "./_components/heading";
import { Hero } from "./_components/hero";
import { DemoEditor } from "./_components/demo-editor";
import { Features } from "./_components/features";
import { HowItWorks } from "./_components/how-it-works";
import { Pricing } from "./_components/pricing";
import { FAQ } from "./_components/faq";
import { FinalCTA } from "./_components/final-cta";

export default function Home() {
  return (
    <div className="min-h-full flex flex-col bg-background dark:bg-[#1f1f1f] selection:bg-emerald-500/20">
      <main className="flex flex-col justify-center items-center flex-1 px-4 sm:px-6">
        <Heading />
        <Hero />
        <DemoEditor />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
