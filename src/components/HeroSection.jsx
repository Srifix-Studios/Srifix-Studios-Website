import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Navbar from './Navbar/Navbar'
import '../styles/hero.css'

const stats = [
  { value: '120+', label: 'Projects Delivered' },
  { value: '40+', label: 'Countries Served' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '4.9/5', label: 'Average Rating' },
]

export default function HeroSection({ onOpenContact }) {
  const heroRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
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

  const handleCtaClick = () => {
    if (onOpenContact) {
      onOpenContact()
    } else {
      window.location.hash = '#get-started'
    }
  }

  const handleNavLinkClick = (href) => {
    if (href === '#services') {
      window.location.hash = '#services'
      return
    }
    if (href === '#contact') {
      handleCtaClick()
      return
    }
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href)
      if (target) {
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
      <div className="hero-v5-viewport">
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

        <Navbar
          activePage="home"
          onNavigate={handleNavLinkClick}
          onOpenContact={handleCtaClick}
        />

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
