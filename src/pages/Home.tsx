import React, { useRef } from 'react';
import { Layout } from '../components/layout/Layout';
import { Portfolio } from '../components/Portfolio';
import { Testimonial } from '../components/Testimonial';

import { HeroSection } from '../components/sections/HeroSection';
import { StatsSection } from '../components/sections/StatsSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { BrandShowcaseSection } from '../components/sections/BrandShowcaseSection';
import { TrustedBySection } from '../components/sections/TrustedBySection';
import { WhyUsSection } from '../components/sections/WhyUsSection';
import { FaqSection } from '../components/sections/FaqSection';
import { CtaSection } from '../components/sections/CtaSection';

export const Home: React.FC = () => {
  const servicesRef = useRef<HTMLDivElement>(null);

  const handleExploreClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (servicesRef.current) {
      const headerOffset = 80;
      const elementPosition = servicesRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      {/* 1. Hero Section */}
      <HeroSection onExploreClick={handleExploreClick} />

      {/* 2. Key Statistics Counters */}
      <StatsSection />

      {/* 3. Services Showcase */}
      <div ref={servicesRef}>
        <ServicesSection />
      </div>

      {/* 4. Brand Value Showcase */}
      <BrandShowcaseSection />

      {/* 5. Trusted By Clients */}
      <TrustedBySection />

      {/* 6. Why Choose NexCube Comparison */}
      <WhyUsSection />

      {/* 7. Portfolio Gallery */}
      <section id="portfolio" className="py-8 bg-white">
        <Portfolio limit={9} showViewMore={true} />
      </section>

      {/* 8. Testimonials & Reviews */}
      <section id="testimonials" className="py-8 bg-slate-50/60">
        <Testimonial />
      </section>

      {/* 9. FAQ Accordions */}
      <FaqSection />

      {/* 10. Conversion CTA Banner */}
      <CtaSection />
    </Layout>
  );
};