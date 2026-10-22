import React, { useRef, useState, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import '../styles/cta.css'
import '../styles/cta-lit.css'

export default function CtaSection({ onOpenContact }) {
  const [lit, setLit] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || typeof IntersectionObserver === 'undefined') {
      setLit(true)
      return
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLit(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [])

  const handleCtaClick = (e) => {
    e.preventDefault()
    if (onOpenContact) {
      onOpenContact()
    } else {
      window.location.hash = '#get-started'
    }
  }

  return (
    <section id="contact" ref={sectionRef} className={`cta-section${lit ? ' is-lit' : ''}`}>
      <div className="cta-banner">

        <img
          src="/assets/Tublight.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="cta-banner-bg"
        />

        <div className="cta-tubelight" />

        <div className="cta-content">
          <h2>
            Let's build something <br />
            premium.
          </h2>

          <p>
            Tell us about your project and we'll come back with a plan,
            timeline, and quote within <br />
            one business day.
          </p>

          <a href="#get-started" onClick={handleCtaClick} className="cta-btn">
            <span>Get Started</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

      </div>
    </section>
  )
}
