import {
  getNavbar,
  getHero,
  getFeatures,
  getTestimonials,
  getPricingPlans,
  getFooter,
  getPainPoints,
  getWorkWithWebsite,
  getBusinessImpact,
  getStatsGrid,
  getHowItWorks,
  getResources,
  getLandingFaq,
  getConversionPanel,
} from "@/lib/strapi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import PainPoints from "@/components/sections/PainPoints";
import WorkWithWebsite from "@/components/sections/WorkWithWebsite";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import BusinessImpact from "@/components/sections/BusinessImpact";
import StatsGrid from "@/components/sections/StatsGrid";
import HowItWorks from "@/components/sections/HowItWorks";
import Resources from "@/components/sections/Resources";
import LandingFaq from "@/components/sections/LandingFaq";
import ConversionPanel from "@/components/sections/ConversionPanel";

export default async function Home() {
  const [
    navbar,
    hero,
    painPoints,
    workWithWebsite,
    features,
    businessImpact,
    statsGrid,
    howItWorks,
    testimonials,
    pricingPlans,
    resources,
    landingFaq,
    conversionPanel,
    footer,
  ] = await Promise.all([
    getNavbar(),
    getHero(),
    getPainPoints(),
    getWorkWithWebsite(),
    getFeatures(),
    getBusinessImpact(),
    getStatsGrid(),
    getHowItWorks(),
    getTestimonials(),
    getPricingPlans(),
    getResources(),
    getLandingFaq(),
    getConversionPanel(),
    getFooter(),
  ]);

  return (
    <>
      <Navbar data={navbar} />
      <main className="overflow-x-hidden">
        <Hero data={hero} />
        <WorkWithWebsite data={workWithWebsite} />
        <PainPoints data={painPoints} />
        {/* <Features data={features} /> */}
        <BusinessImpact data={businessImpact} />
        <StatsGrid data={statsGrid} />
        <HowItWorks data={howItWorks} />
        <Testimonials data={testimonials} />
        <Pricing data={pricingPlans} />
        <Resources data={resources} />
        <LandingFaq data={landingFaq} />
        <ConversionPanel data={conversionPanel} />
      </main>
      <Footer data={footer} />
    </>
  );
}
