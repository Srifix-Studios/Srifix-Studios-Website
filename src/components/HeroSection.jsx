import React, { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import gsap from 'gsap'
import '../styles/hero.css'

const navLinks = [
  { name: 'Home', href: '#home', active: true },
  { name: 'Services', href: '#services' },
  { name: 'Work', href: '#how-we-work' },
  { name: 'Blog', href: '#blog' },
  { name: 'Careers', href: '#careers' },
  { name: 'Contact', href: '#contact' },
  { name: 'About', href: '#about' },
]

const stats = [
  { value: '120+', label: 'Projects Delivered' },
  { value: '40+', label: 'Countries Served' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '4.9/5', label: 'Average Rating' },
]

export default function HeroSection({ onOpenContact }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '.navisland-header',
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
      .fromTo(
        '.hero-v5-title-line',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15 },
        '-=0.4'
      )
      .fromTo(
        '.hero-v5-subtitle',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.4'
      )
      .fromTo(
        '.hero-v5-cta-btn',
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7 },
        '-=0.4'
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const handleCtaClick = (e) => {
    e.preventDefault()
    if (onOpenContact) {
      onOpenContact()
    } else {
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        if (window.lenis) {
          window.lenis.scrollTo(contactSection, { duration: 1.2 })
        } else {
          contactSection.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  const handleNavLinkClick = (e, href) => {
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        setMobileMenuOpen(false)
        if (window.lenis) {
          window.lenis.scrollTo(target, { duration: 1.2 })
        } else {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <div id="home" ref={heroRef} className="hero-v5-wrapper">
      {/* 100vh Hero Viewport matching exact reference photo */}
      <div className="hero-v5-viewport">
        {/* Space animation background (kept intact) */}
        <video
          className="hero-v5-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
            type="video/mp4"
          />
        </video>

        {/* Top Navbar */}
        <header className="navisland-header">
          <div className="navisland-inner">
            {/* Logo */}
            <a href="#home" onClick={(e) => handleNavLinkClick(e, '#home')} className="navisland-logo">
              <img
                src="/assets/favicon-logo.png"
                alt="Srifix Studios Logo"
                className="navisland-logo-img"
              />
              <span className="navisland-logo-text">
                <span className="logo-srifix">SRIFIX</span>{' '}
                <span className="logo-studios">STUDIOS</span>
              </span>
            </a>

            {/* Center Navigation Links (Floating cleanly as in reference photo) */}
            <ul className="navisland-pill" role="navigation">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`navisland-link ${link.active ? 'active' : ''}`}
                    onClick={(e) => handleNavLinkClick(e, link.href)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right Nav CTA Button */}
            <a
              href="#contact"
              onClick={handleCtaClick}
              className="navisland-cta-btn"
            >
              <span>Get started</span>
              <span className="navisland-cta-arrow">↗</span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="navisland-mobile-toggle"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <ul className="navisland-mobile-menu">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`navisland-link ${link.active ? 'active' : ''}`}
                    onClick={(e) => handleNavLinkClick(e, link.href)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </header>

        {/* Hero Main Content Area */}
        <section className="hero-v5-content">
          <h1 className="hero-v5-heading">
            <span className="hero-v5-title-line">We Transform Ideas</span>
            <span className="hero-v5-title-line hero-v5-line-2">
              <span className="hero-v5-into">Into</span>
              <span className="hero-v5-digital">Digital</span>
              <span className="hero-v5-experiences">Experiences</span>
            </span>
          </h1>

          <p className="hero-v5-subtitle">
            <strong>
              Srifix Studios designs and builds brand identities, websites, and AI powered{' '}
              <br className="hero-v5-sub-br" />
              products for ambitious companies, engineered to feel inevitable.
            </strong>
          </p>

          <a
            href="#contact"
            onClick={handleCtaClick}
            className="hero-v5-cta-btn"
          >
            <span>Get started</span>
            <span className="hero-v5-cta-arrow">↗</span>
          </a>
        </section>
      </div>

      {/* Mini Info (Key Metrics Bar - positioned in document flow below the 100vh hero) */}
      <div className="mini-info-wrapper">
        <div className="mini-info-container">
          {stats.map((stat, i) => (
            <div key={i} className="mini-info-item">
              <span className="mini-info-number">{stat.value}</span>
              <span className="mini-info-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
