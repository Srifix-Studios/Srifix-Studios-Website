import React, { useRef, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { pricingPlans } from '../data/pricing'
import '../styles/pricing.css'

gsap.registerPlugin(ScrollTrigger)

function PricingCard({ plan }) {
  return (
    <div className={plan.featured ? 'pricing-card featured card' : 'pricing-card card'}>
      {plan.featured && (
        <div className="glow">
          <div className="wave wave1" />
          <div className="wave wave2" />
        </div>
      )}

      <p className="title">{plan.title}</p>
      <h2 className="price">{plan.price}</h2>
      <span className="tag">{plan.tag}</span>

      <ul className="features">
        {plan.features.map((feature) => (
          <li key={feature}>
            <span className="bar" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="btn-wrap">
        <button type="button" className="btn">
          View Details <ArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default function PricingSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // "Pricing" is fully visible first as the pricing cards scroll up into
   
      gsap.to('.pricing-bg-text', {
        opacity: 0,
        yPercent: -18,
        scale: 0.94,
        ease: 'none',
        scrollTrigger: {
          trigger: '.pricing-grid',
          start: 'top 85%',
          end: 'top 30%',
          scrub: 0.6,
        },
      })
    }, sectionRef)

    return () => mm.revert()
  }, [])

  return (
    <section id="pricing" className="pricing-section" ref={sectionRef}>
      <h2 className="pricing-bg-text" aria-hidden="true">Pricing</h2>

      <div className="pricing-grid">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.title} plan={plan} />
        ))}
      </div>

      <h3 className="pricing-heading">Simple, Transparent Pricing</h3>
    </section>
  )
}