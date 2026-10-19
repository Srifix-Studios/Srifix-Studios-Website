import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/about.css'

gsap.registerPlugin(ScrollTrigger)

export default function AboutUsSection({ onOpenContact }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: '(min-width: 981px)',
        isMobile: '(max-width: 980px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions
        if (reduceMotion) return

        // Heading & subtitle fade up
        gsap.from('.about-v5-header', {
          scrollTrigger: {
            trigger: '.about-v5-header',
            start: 'top 85%',
          },
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        })

        // Flanking cards & center button entrance
        gsap.from('.about-card-left', {
          scrollTrigger: {
            trigger: '.about-v5-showcase',
            start: 'top 80%',
          },
          x: isDesktop ? -50 : 0,
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        })

        gsap.from('.about-card-right', {
          scrollTrigger: {
            trigger: '.about-v5-showcase',
            start: 'top 80%',
          },
          x: isDesktop ? 50 : 0,
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        })

        gsap.from('.about-v5-center-action', {
          scrollTrigger: {
            trigger: '.about-v5-showcase',
            start: 'top 80%',
          },
          scale: 0.9,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'back.out(1.5)',
        })

        // Background "About Us" text: arrives from downside to up as per scroll (visible & crisp)
        gsap.fromTo(
          '.about-v5-watermark',
          {
            y: isDesktop ? 200 : 80,
            opacity: 0.1,
          },
          {
            y: isDesktop ? -80 : -25,
            opacity: 0.45,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        )
      },
      sectionRef
    )

    return () => mm.revert()
  }, [])

  const handleActionClick = (e) => {
    e.preventDefault()
    if (onOpenContact) {
      onOpenContact()
    } else {
      const servicesSection = document.getElementById('services')
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <section id="about" ref={sectionRef} className="about-v5-section">
      {/* Ambient Blue Glow Orb */}
      <div className="about-v5-glow" aria-hidden="true" />
      <div className="about-v5-glow-secondary" aria-hidden="true" />

      {/* Background Graphic Title from Figma */}
      <div className="about-v5-watermark" aria-hidden="true" />

      <div className="about-v5-container">
        {/* Header Text Group */}
        <div className="about-v5-header">
          <h2 className="about-v5-heading">
            We build brands<br />
            that outlive <span className="about-v5-highlight">trends</span>.
          </h2>

          <p className="about-v5-subtitle">
            We combine memorable visual design with dependable engineering so your brand earns trust,
            stands apart, and drives real business results.
          </p>
        </div>

        {/* 3-Column Showcase: Left Glass Card, Center CTA, Right Glass Card */}
        <div className="about-v5-showcase">
          {/* Left Card: Art Direction & Brand Craft */}
          <div className="about-v5-card about-card-left">
            <div>
              <div className="about-v5-card-num">01 / ART DIRECTION</div>
              <h3 className="about-v5-card-title">Thoughtful Visual Standards</h3>
              <p className="about-v5-card-desc">
                Every typeface choice, layout grid, and interactive detail is shaped with care so
                your product looks refined, confident, and memorable.
              </p>
            </div>
            <ul className="about-v5-card-tags">
              <li className="about-v5-card-tag">High Fashion Aesthetic</li>
              <li className="about-v5-card-tag">3D Motion Design</li>
              <li className="about-v5-card-tag">Complete Brand Systems</li>
            </ul>
          </div>

          {/* Center Action Button */}
          <div className="about-v5-center-action">
            <a
              href="#services"
              onClick={handleActionClick}
              className="about-v5-btn"
            >
              <span>About Us</span>
              <img
                src="/assets/arrow-about.svg"
                alt=""
                className="about-v5-btn-icon"
              />
            </a>
            <span className="about-v5-center-sub">Partner with an international digital studio</span>
          </div>

          {/* Right Card: Software Engineering & Scale */}
          <div className="about-v5-card about-card-right">
            <div>
              <div className="about-v5-card-num">02 / ENGINEERING</div>
              <h3 className="about-v5-card-title">Built for Real Scale</h3>
              <p className="about-v5-card-desc">
                Clean, dependable code designed for smooth page interactions, instant load times,
                and steady customer conversions across the globe.
              </p>
            </div>
            <ul className="about-v5-card-tags">
              <li className="about-v5-card-tag">Smooth Animations</li>
              <li className="about-v5-card-tag">Performance Optimized</li>
              <li className="about-v5-card-tag">Global Remote Delivery</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
