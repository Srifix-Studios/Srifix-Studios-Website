import React, { useState, useEffect } from 'react'
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
import GetStartedPage from './components/GetStarted/GetStartedPage'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Hero (Version 5) → About Us (Version 5) → Features → How We Work → Why Us → Client Review → Pricing → Questions → CTA → Footer
export default function App() {
  useLenis()

  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#get-started' ? 'get-started' : 'home'
    }
    return 'home'
  })
  const [preselectedService, setPreselectedService] = useState(null)

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#get-started') {
        setCurrentPage('get-started')
        if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
        else window.scrollTo({ top: 0, behavior: 'instant' })
      } else {
        setCurrentPage('home')
      }
    }

    const handleOpenContact = (e) => {
      const service = e?.detail?.service || null
      setPreselectedService(service)
      window.location.hash = '#get-started'
      setCurrentPage('get-started')
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
      else window.scrollTo({ top: 0, behavior: 'instant' })
    }

    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('open-get-started', handleOpenContact)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('open-get-started', handleOpenContact)
    }
  }, [])

  const handleOpenGetStarted = (service = null) => {
    setPreselectedService(service)
    window.location.hash = '#get-started'
    setCurrentPage('get-started')
    if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleBackToHome = (targetHash = '') => {
    window.location.hash = targetHash || ''
    setCurrentPage('home')
    if (targetHash && targetHash !== '#home') {
      setTimeout(() => {
        const el = document.querySelector(targetHash)
        if (el) {
          if (window.lenis) window.lenis.scrollTo(el, { duration: 1.2 })
          else el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
    } else {
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
      else window.scrollTo({ top: 0, behavior: 'instant' })
    }
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 120)
  }


  return (
    <>
      <Preloader />
      <MouseTrail />
      <ChatBot />

      {currentPage === 'get-started' ? (
        <GetStartedPage
          onBack={handleBackToHome}
          preselectedService={preselectedService}
        />
      ) : (
        <>
          <main>
            <HeroSection onOpenContact={() => handleOpenGetStarted()} />
            <AboutUsSection />
            <FeaturesSection onOpenContact={() => handleOpenGetStarted()} />
            <HowWeWork />
            <WhyUsSection />
            <TestimonialsSection />
            <PricingSection onOpenContact={(srv) => handleOpenGetStarted(srv)} />
            <FaqSection />
            <CtaSection onOpenContact={() => handleOpenGetStarted()} />
          </main>
          <Footer onOpenContact={() => handleOpenGetStarted()} />
        </>
      )}
    </>
  )
}
