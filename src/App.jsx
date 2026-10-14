import React from 'react'
import { useLenis } from './hooks/useLenis'
import HeroSection from './components/HeroSection'
import AboutUsSection from './components/AboutUsSection'
import FeaturesSection from './components/FeaturesSection'
import HowWeWork from './components/HowWeWork'
import WhyUsSection from './components/WhyUsSection'
import TestimonialsSection from './components/TestimonialsSection'

// Hero (Version 5) → About Us (Version 5) → Features → How We Work → Why Us → Client Review
export default function App() {
  useLenis()

  return (
    <main>
      <HeroSection />
      <AboutUsSection />
      <FeaturesSection />
      <HowWeWork />
      <WhyUsSection />
      <TestimonialsSection />
    </main>
  )
}
