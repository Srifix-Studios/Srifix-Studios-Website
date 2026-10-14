import React from 'react'
import { useLenis } from './hooks/useLenis'
import FeaturesSection from './components/FeaturesSection'
import HowWeWork from './components/HowWeWork'
import WhyUsSection from './components/WhyUsSection'
import TestimonialsSection from './components/TestimonialsSection'

// Features → How We Work → Why Us → Client Review
export default function App() {
  useLenis()

  return (
    <main>
      <FeaturesSection />
      <HowWeWork />
      <WhyUsSection />
      <TestimonialsSection />
    </main>
  )
}
