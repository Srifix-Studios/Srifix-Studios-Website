import React, { useRef, useState, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import '../styles/cta.css'
import '../styles/cta-lit.css'

// "Light on" variant of CtaSection: the section starts as a complete blackout;
// when it scrolls into view the tubelight flickers on, the blackout lifts and

export default function CtaSection() {
  const [lit, setLit] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Reduced motion / no IntersectionObserver: the light is simply already on
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setLit(true)
      return
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLit(true)
          io.disconnect() // ignites once and stays on
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={`cta-section${lit ? ' is-lit' : ''}`}>
      <div className="cta-banner">

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

          <a href="#" className="cta-btn">
            <span>Get Started</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

      </div>
    </section>
  )
}
