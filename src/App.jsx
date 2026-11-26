import React, { useState, useEffect } from 'react'
import { useLenis } from './hooks/useLenis'
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
import Navbar from './components/Navbar/Navbar'
import MouseTrail from './components/MouseTrail'
import ChatBot from './components/ChatBot/ChatBot'
import GetStartedPage from './components/GetStarted/GetStartedPage'
import ServicesPage from './components/Services/ServicesPage'
import AboutPage from './components/AboutPage'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from './components/Preloader'

function getPageFromLocation() {
  if (typeof window === 'undefined') return 'home'
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '')
  const hash = window.location.hash.toLowerCase()

  if (path === '/get-started' || hash === '#get-started') return 'get-started'
  if (path === '/services' || hash === '#services') return 'services'
  if (path === '/about' || hash === '#about') return 'about'
  return 'home'
}

export default function App() {
  useLenis()

  const [currentPage, setCurrentPage] = useState(getPageFromLocation)
  const [preselectedService, setPreselectedService] = useState(null)

  const navigateTo = (destination, targetAnchor = '') => {
    let page = 'home'
    let path = '/'
    let anchor = ''

    if (
      destination === '/get-started' ||
      destination === 'get-started' ||
      destination === '#get-started'
    ) {
      page = 'get-started'
      path = '/get-started'
    } else if (
      destination === '/services' ||
      destination === 'services' ||
      destination === '#services'
    ) {
      page = 'services'
      path = '/services'
    } else if (
      destination === '/about' ||
      destination === 'about' ||
      destination === '#about'
    ) {
      page = 'about'
      path = '/about'
    } else {
      page = 'home'
      anchor = targetAnchor || (destination.startsWith('#') ? destination : '')
      path = anchor ? `/${anchor}` : '/'
    }

    if (
      window.location.pathname !== path ||
      (anchor && window.location.hash !== anchor)
    ) {
      window.history.pushState(null, '', path)
    }

    setCurrentPage(page)

    if (page === 'home' && anchor && anchor !== '#home') {
      setTimeout(() => {
        const el = document.querySelector(anchor)
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
    }, 150)
  }

  useEffect(() => {
    // If user loaded with a legacy hash route (#about), convert cleanly to pathname (/about)
    const initialPage = getPageFromLocation()
    if (initialPage !== 'home' && window.location.hash) {
      window.history.replaceState(null, '', `/${initialPage}`)
    }

    const handlePopState = () => {
      const page = getPageFromLocation()
      setCurrentPage(page)
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
      else window.scrollTo({ top: 0, behavior: 'instant' })
    }

    const handleOpenContact = (e) => {
      const service = e?.detail?.service || null
      setPreselectedService(service)
      navigateTo('/get-started')
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('open-get-started', handleOpenContact)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('open-get-started', handleOpenContact)
    }
  }, [])

  const handleOpenGetStarted = (service = null) => {
    setPreselectedService(service)
    navigateTo('/get-started')
  }

  return (
    <>
    <Preloader/>
      <MouseTrail />
      <ChatBot />

      {currentPage === 'get-started' ? (
        <GetStartedPage
          onBack={(target) => navigateTo(target || '/')}
          preselectedService={preselectedService}
        />
      ) : currentPage === 'services' ? (
        <ServicesPage
          onBack={(target) => navigateTo(target || '/')}
          onOpenContact={(srv) => handleOpenGetStarted(srv)}
        />
      ) : currentPage === 'about' ? (
        <AboutPage
          onNavigate={(target, anchor) => navigateTo(target, anchor)}
          onOpenContact={() => handleOpenGetStarted()}
        />
      ) : (
        <>
          <Navbar
            activePage="home"
            onNavigate={(target, anchor) => navigateTo(target, anchor)}
            onOpenContact={() => handleOpenGetStarted()}
          />
          <main>
            <HeroSection onOpenContact={() => handleOpenGetStarted()} />
            <AboutUsSection onNavigate={(target) => navigateTo(target || '/about')} />
            <FeaturesSection onOpenContact={() => handleOpenGetStarted()} />
            <HowWeWork />
            <WhyUsSection />
            <TestimonialsSection />
            <PricingSection onOpenContact={(srv) => handleOpenGetStarted(srv)} />
            <FaqSection />
            <CtaSection onOpenContact={() => handleOpenGetStarted()} />
          </main>
          <Footer
            onOpenContact={() => handleOpenGetStarted()}
            onNavigate={(target, anchor) => navigateTo(target, anchor)}
          />
        </>
      )}
    </>
  )
}
