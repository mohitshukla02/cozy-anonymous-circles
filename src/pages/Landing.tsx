
import React from 'react';
import LandingHeader from './landing/LandingHeader';
import HeroSection from './landing/HeroSection';
import FeaturesGrid from './landing/FeaturesGrid';
import HowItWorksSection from './landing/HowItWorksSection';
import PromiseSection from './landing/PromiseSection';
import FinalCtaSection from './landing/FinalCtaSection';

// All these are pure presentational—no logic/functional change!
const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <HeroSection />
      <FeaturesGrid />
      <HowItWorksSection />
      <PromiseSection />
      <FinalCtaSection />
    </div>
  );
};

export default Landing;
