import React, { useRef, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { pricingPlans, pricingPrinciple } from '../data/pricing'
import '../styles/pricing.css'

gsap.registerPlugin(ScrollTrigger)

function PricingCard({ plan, onOpenContact }) {
  const isCustomPrice = plan.price.toLowerCase().includes('requirement')

  const handleCtaClick = (e) => {
    e.preventDefault()
    if (onOpenContact) {
      let serviceId = 'webdev'
      const titleLower = plan.title.toLowerCase()
      if (titleLower.includes('brand')) serviceId = 'brand'
      else if (titleLower.includes('ui') || titleLower.includes('ux')) serviceId = 'uiux'
      else if (titleLower.includes('web')) serviceId = 'webdev'
      else if (titleLower.includes('digital') || titleLower.includes('marketing')) serviceId = 'digital-marketing'
      else if (titleLower.includes('social')) serviceId = 'social-media'
      else if (titleLower.includes('creative')) serviceId = 'custom'
      onOpenContact(serviceId)
    } else {
      window.location.hash = '#get-started'
    }
  }

  return (
    <div className={plan.featured ? 'pricing-card featured card' : 'pricing-card card'}>
      <div className="glow">
        <div className="wave wave1" />
        <div className="wave wave2" />
      </div>
    

      <div className="card-top">
        <span className="card-num">{plan.num} / {plan.category || 'SERVICE'}</span>
        {plan.featured && <span className="featured-badge">MOST POPULAR</span>}
      </div>

      <p className="title">{plan.title}</p>

      <div className="price-wrap">
        <span className="price-prefix">{isCustomPrice ? 'Investment Model' : 'Starting From'}</span>
        <h2 className={`price ${isCustomPrice ? 'price-custom' : ''}`}>{plan.price}</h2>
        <span className="tag">{plan.tag}</span>
      </div>

      <div className="scope-label">Scope / Deliverables</div>

      <ul className="features">
        {plan.features.map((feature) => (
          <li key={feature}>
            <span className="bar" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {plan.note && <div className="card-note">*{plan.note}</div>}

      <div className="btn-wrap">
        <a href="#contact" onClick={handleCtaClick} className="btn">
          <span>Get Started</span>
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}

export default function PricingSection({ onOpenContact }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
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

      <div className="pricing-header-wrap">
        <h3 className="pricing-heading">
          Services &amp; <span className="accent">Pricing</span>
        </h3>
        <p className="pricing-subtitle">
          Creative design, strategy, and digital solutions structured around your business goals.
        </p>
      </div>

      <div className="pricing-grid">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.title} plan={plan} onOpenContact={onOpenContact} />
        ))}
      </div>

      <div className="pricing-principle-banner">
        <div className="pricing-principle-card">
          <div className="principle-col">
            <h4>
              <span className="principle-tag">PRINCIPLE</span>
              {pricingPrinciple.heading}
            </h4>
            <p>{pricingPrinciple.description}</p>
          </div>

          <div className="principle-col">
            <h4>
              <span className="principle-tag">POLICY</span>
              {pricingPrinciple.policyHeading}
            </h4>
            <p>{pricingPrinciple.policyDescription}</p>
            <p className="production-subnote">
              <strong>{pricingPrinciple.productionHeading}:</strong> {pricingPrinciple.productionDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}