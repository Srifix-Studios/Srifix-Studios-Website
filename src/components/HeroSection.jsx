import React, { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import gsap from 'gsap'
import '../styles/hero.css'

const navLinks = [
  { name: 'Home', href: '#home', active: true },
  { name: 'Services', href: '#services' },
  { name: 'Work', href: '#how-we-work' },
  { name: 'About', href: '#about' },
  { name: 'Careers', href: '#careers' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
]

const stats = [
  { value: '120+', label: 'Projects Delivered' },
  { value: '40+', label: 'Countries Served' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '4.9/5', label: 'Average Rating' },
]

export default function HeroSection({ onOpenContact }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.navisland-header', {
        y: -30,
        opacity: 0,
        duration: 0.8,
      })
      .from('.hero-v5-heading', {
        y: 40,
        opacity: 0,
        duration: 1,
      }, '-=0.4')
      .from('.hero-v5-subtitle', {
        y: 25,
        opacity: 0,
        duration: 0.8,
      }, '-=0.4')
      .from('.hero-v5-cta-btn', {
        y: 20,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
      }, '-=0.4')
      .from('.mini-info-container', {
        y: 40,
        opacity: 0,
        duration: 0.8,
      }, '-=0.3')
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
        contactSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div id="home" ref={heroRef} className="hero-v5-wrapper">
      {/* Space animation background */}
      <video
        className="hero-v5-bg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
          type="video/mp4"
        />
      </video>

      {/* Navisland (Header Navigation) */}
      <header className={`navisland-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="navisland-inner">
          {/* Logo */}
          <a href="#home" className="navisland-logo">
            <img
              src="/assets/favicon-logo.png"
              alt="Srifix Studios Logo"
              className="navisland-logo-img"
            />
            <span className="navisland-logo-text">SRIFIX STUDIOS</span>
          </a>

          {/* Center Pill Menu (Desktop) */}
          <ul className="navisland-pill" role="navigation">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`navisland-link ${link.active ? 'active' : ''}`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Right CTA Button */}
          <a
            href="#contact"
            onClick={handleCtaClick}
            className="navisland-cta-btn"
          >
            <span>Get Started</span>
            <img
              src="/assets/arrow-up-right.svg"
              alt=""
              className="navisland-cta-icon"
            />
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
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>

      {/* Hero Content Area */}
      <section className="hero-v5-content">
        <h1 className="hero-v5-heading">
          <span className="hero-v5-text-gradient">We Transform Ideas</span>
          <br />
          <span className="hero-v5-text-gradient">Into </span>
          <span className="hero-v5-digital-word">Digital</span>
          <span className="hero-v5-text-gradient"> Experiences</span>
        </h1>

        <p className="hero-v5-subtitle">
          Srifix Studios designs and builds brand identities, websites, and AI-powered products
          for ambitious companies — engineered to feel inevitable.
        </p>

        <a
          href="#contact"
          onClick={handleCtaClick}
          className="hero-v5-cta-btn"
        >
          <span>Get Started</span>
          <img
            src="/assets/arrow-up-right.svg"
            alt=""
            className="hero-v5-cta-icon"
          />
        </a>
      </section>

      {/* Mini Info (Key Metrics Bar from Version 5) */}
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
