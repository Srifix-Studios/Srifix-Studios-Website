import React from 'react'
import { useLenis } from './hooks/useLenis'
import Preloader from './components/Preloader'
import HeroSection from './components/HeroSection'
import AboutUsSection from './components/AboutUsSection'
import FeaturesSection from './components/FeaturesSection'
import HowWeWork from './components/HowWeWork'
import WhyUsSection from './components/WhyUsSection'
import TestimonialsSection from './components/TestimonialsSection'
import PricingSection from './components/PricingSection'
import FaqSection from './components/FaqSection'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'
import MouseTrail from './components/MouseTrail'
import ChatBot from './components/ChatBot/ChatBot'

// Hero (Version 5) → About Us (Version 5) → Features → How We Work → Why Us → Client Review → Pricing → Questions → CTA → Footer
export default function App() {
  useLenis()

  return (
    <>
      <Preloader />
      <MouseTrail />
      <ChatBot />
      <main>
        <HeroSection />
        <AboutUsSection />
        <FeaturesSection />
        <HowWeWork />
        <WhyUsSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
