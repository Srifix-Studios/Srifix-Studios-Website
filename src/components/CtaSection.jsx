import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import '../styles/cta.css'

export default function CtaSection() {
  return (
    <section className="cta-section">
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