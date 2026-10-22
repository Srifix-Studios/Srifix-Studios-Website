import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Sparkles,
  Info,
  X,
  Menu,
  ShieldCheck,
  Layers,
  Zap,
  HelpCircle,
  MessageSquare,
  ArrowUp
} from 'lucide-react'
import {
  CATEGORIES,
  SERVICE_ROWS,
  ALL_SERVICES,
  PACKAGE_COMBINATIONS,
  ADD_ON_SERVICES,
  POLICIES,
  PRICING_PRINCIPLE,
} from '../../data/servicesData'
import Footer from '../Footer'
import Navbar from '../Navbar/Navbar'
import '../../styles/services-page.css'
import '../../styles/pricing.css'
import '../../styles/cta.css'
import '../../styles/cta-lit.css'

export default function ServicesPage({ onBack, onOpenContact }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedService, setSelectedService] = useState(null)
  const [showAddonsModal, setShowAddonsModal] = useState(false)
  const [showPoliciesModal, setShowPoliciesModal] = useState(false)
  const [showPackagesModal, setShowPackagesModal] = useState(false)
  const [ctaLit, setCtaLit] = useState(false)
  const ctaSectionRef = useRef(null)

  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [])

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || typeof IntersectionObserver === 'undefined') {
      setCtaLit(true)
      return
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCtaLit(true)
        } else if (e.boundingClientRect.top > (window.innerHeight || document.documentElement.clientHeight)) {
          setCtaLit(false)
        }
      },
      { threshold: 0.15 }
    )

    if (ctaSectionRef.current) io.observe(ctaSectionRef.current)
    return () => io.disconnect()
  }, [])

  const filteredCards = useMemo(() => {
    if (activeCategory === 'all') return null
    return ALL_SERVICES.filter((c) => c.category === activeCategory)
  }, [activeCategory])

  const handleBookService = (service) => {
    const serviceIdentifier =
      typeof service === 'string' ? service : service?.title || service?.id || 'general'
    if (onOpenContact) {
      onOpenContact(serviceIdentifier)
    } else {
      window.location.hash = '#get-started'
    }
  }

  const handleOpenChatBot = () => {
    window.dispatchEvent(new CustomEvent('open-chatbot'))
  }

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNavClick = (targetHash) => {
    if (targetHash === '#services') {
      scrollToTop()
      return
    }
    if (targetHash === '#contact') {
      handleBookService('general')
      return
    }
    if (onBack) {
      onBack(targetHash)
    } else {
      window.location.hash = targetHash
    }
  }

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5
    card.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`)
    card.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`)
  }

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget
    card.style.setProperty('--mouse-x', `-999px`)
    card.style.setProperty('--mouse-y', `-999px`)
    card.style.setProperty('--tilt-x', `0deg`)
    card.style.setProperty('--tilt-y', `0deg`)
  }

  const renderServiceCard = (card, isMiddleGlow) => {
    const isCustomPrice =
      typeof card.price === 'string' &&
      (card.price.toLowerCase().includes('requirement') ||
        card.price.toLowerCase().includes('quote') ||
        card.price.toLowerCase().includes('custom'))
    const categoryTag = card.tier || card.category?.toUpperCase() || 'SERVICE'
    const cardNumber = card.number ? `${card.number} / ` : ''

    return (
      <article
        key={card.id}
        className={isMiddleGlow ? 'pricing-card featured card' : 'pricing-card card'}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
      >
        <div className="glow" aria-hidden="true">
          <div className="wave wave1" />
          <div className="wave wave2" />
        </div>

        <div className="card-cursor-spotlight" aria-hidden="true" />

        <div className="card-top">
          <span className="card-num">{cardNumber}{categoryTag}</span>
          {isMiddleGlow && <span className="featured-badge">MOST POPULAR</span>}
        </div>

        <p className="title">{card.title}</p>

        <div className="price-wrap">
          <span className="price-prefix">{isCustomPrice ? 'Investment Model' : 'Starting From'}</span>
          <h2 className={`price ${isCustomPrice ? 'price-custom' : ''}`}>{card.price}</h2>
          <span className="tag">{card.priceUnit || 'ONE-TIME PROJECT'}</span>
        </div>

        <div className="scope-label">Scope / Deliverables</div>

        <ul className="features">
          {card.deliverables.map((feature, idx) => (
            <li key={idx}>
              <span className="bar" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {card.notes && <div className="card-note">*{card.notes}</div>}

        <div className="btn-wrap">
          <button
            type="button"
            onClick={() => handleBookService(card)}
            className="btn"
          >
            <span>Get Started</span>
            <ArrowUpRight aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedService(card)}
            className="card-details-trigger"
            aria-label={`View full scope and add-ons for ${card.title}`}
          >
            <span>View Scope &amp; Add-ons</span>
            <span className="btn-arrow">↗</span>
          </button>
        </div>
      </article>
    )
  }

  return (
    <div className="services-page-wrapper">
      <div className="services-hero-canopy-wrap" aria-hidden="true">
        <div className="services-hero-dome">
          <div className="services-dome-grid" />
        </div>
      </div>

      <Navbar
        activePage="services"
        onNavigate={handleNavClick}
        onOpenContact={() => handleBookService('general')}
      />

      <main className="services-main-container">
        <section className="services-hero-section">
          <div className="services-hero-watermark" aria-hidden="true">
            Services
          </div>

          <h1 className="services-hero-title">
            Everything your brand<br />needs, <span className="services-title-accent">under one roof.</span>
          </h1>

          <p className="services-hero-subtitle">
            From first logo sketch to full-funnel marketing and AI automation every service is priced transparently and delivered on a defined timeline.
          </p>
        </section>

        <nav className="services-tabs-container" aria-label="Services Categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`service-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        <div className="services-subnav-strip">
          <button
            type="button"
            className="subnav-link-btn"
            onClick={() => setShowAddonsModal(true)}
          >
            + Explore 16 Add-On Services (from ₹299)
          </button>
          <span className="subnav-divider" style={{ color: '#475569' }}>•</span>
          <button
            type="button"
            className="subnav-link-btn"
            onClick={() => setShowPoliciesModal(true)}
          >
            Pricing &amp; Revision Policies
          </button>
          <span className="subnav-divider" style={{ color: '#475569' }}>•</span>
          <button
            type="button"
            className="subnav-link-btn"
            onClick={() => setShowPackagesModal(true)}
          >
            Monthly Growth Packages
          </button>
        </div>

        {activeCategory === 'all' ? (
          <div className="services-all-rows-container">
            {SERVICE_ROWS.map((row) => (
              <div key={row.rowId} className="services-grid-3col">
                {row.cards.map((card) => {
                  const isMiddleGlow = card.tier === 'GROWTH' || card.featured
                  return renderServiceCard(card, isMiddleGlow)
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="services-grid-3col">
            {filteredCards.map((card, idx) => {
              const isMiddleGlow = idx % 3 === 1 || card.featured
              return renderServiceCard(card, isMiddleGlow)
            })}
          </div>
        )}
      </main>

      <section
        ref={ctaSectionRef}
        className={`cta-section services-cta-section${ctaLit ? ' is-lit' : ''}`}
        aria-label="Service consultation CTA"
      >
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
              Not sure which service <br />
              fits?
            </h2>

            <p>
              Ask Fix, our AI concierge, or book a free 20-minute consultation and we'll map <br />
              the right package for your brand.
            </p>

            <div className="cta-actions-wrap">
              <button
                type="button"
                onClick={() => handleBookService('consultation')}
                className="cta-btn"
              >
                <span>Book Free Consultation</span>
                <ArrowUpRight aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleOpenChatBot}
                className="cta-secondary-btn"
              >
                <span>Ask Fix (AI Concierge) ✦</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onOpenContact={() => handleBookService('general')} />

      {selectedService && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedService(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedService(null)}
              aria-label="Close details"
            >
              <X size={18} />
            </button>

            <span className="modal-tag">
              {selectedService.tier} • {selectedService.category?.toUpperCase()}
            </span>

            <h3 className="modal-title">{selectedService.title}</h3>

            <div className="modal-price-box">
              <span className="modal-price">{selectedService.price}</span>
              {selectedService.priceUnit && (
                <span className="card-price-unit">{selectedService.priceUnit}</span>
              )}
            </div>

            {selectedService.summary && (
              <p className="modal-summary">{selectedService.summary}</p>
            )}

            <div className="modal-section-title">Scope &amp; Deliverables</div>
            <ul className="modal-deliverables-list">
              {selectedService.deliverables.map((item, idx) => (
                <li key={idx} className="modal-deliverable-item">
                  <span className="card-dash">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {selectedService.timeline && (
              <div className="modal-notes-badge">
                <strong style={{ color: '#E2E8F0' }}>Estimated Timeline:</strong>{' '}
                {selectedService.timeline}
              </div>
            )}

            {selectedService.notes && (
              <div className="modal-notes-badge">
                <strong style={{ color: '#E2E8F0' }}>Production Note:</strong>{' '}
                {selectedService.notes}
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="modal-book-btn"
                onClick={() => {
                  handleBookService(selectedService)
                  setSelectedService(null)
                }}
              >
                <span>Book This Service</span>
                <span className="btn-arrow">↗</span>
              </button>

              <a
                href={`https://wa.me/919625038790?text=${encodeURIComponent(
                  `Hi Srifix Studios! I'm interested in the ${selectedService.title} (${selectedService.price}). Could you share more information?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-wa-btn"
              >
                WhatsApp ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {showAddonsModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddonsModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-card"
            style={{ maxWidth: '720px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowAddonsModal(false)}
              aria-label="Close add-ons"
            >
              <X size={18} />
            </button>

            <span className="modal-tag">PDF Page 9 • Modular Enhancements</span>
            <h3 className="modal-title">All 16 Add-On Services</h3>
            <p className="modal-summary">
              Modular creative, technical, and marketing add-ons that can be added to any
              active project or monthly retainer.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '12px',
                marginTop: '16px',
                marginBottom: '24px',
              }}
            >
              {ADD_ON_SERVICES.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: "var(--font-mono, 'Space Grotesk', monospace)",
                        color: '#64748B',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {item.type}
                    </span>
                    <h4
                      style={{
                        fontSize: '14.5px',
                        fontWeight: 600,
                        color: '#F1F5F9',
                        marginTop: '4px',
                      }}
                    >
                      {item.service}
                    </h4>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      paddingTop: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#38BDF8',
                      }}
                    >
                      {item.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleBookService(`Add-on: ${item.service}`)
                        setShowAddonsModal(false)
                      }}
                      style={{
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        borderRadius: '999px',
                        color: '#38BDF8',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Inquire ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="modal-book-btn"
              onClick={() => {
                handleBookService('Custom Add-ons')
                setShowAddonsModal(false)
              }}
            >
              <span>Consult on Custom Scope</span>
              <span className="btn-arrow">↗</span>
            </button>
          </div>
        </div>
      )}

      {showPoliciesModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowPoliciesModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-card"
            style={{ maxWidth: '680px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowPoliciesModal(false)}
              aria-label="Close policies"
            >
              <X size={18} />
            </button>

            <span className="modal-tag">PDF Page 10 • Terms &amp; Scope</span>
            <h3 className="modal-title">Project &amp; Pricing Policies</h3>
            <p className="modal-summary">
              Transparent terms, production scope guidelines, and revision rules ensuring
              predictable delivery for every brand partnership.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                marginTop: '18px',
                marginBottom: '24px',
              }}
            >
              {POLICIES.map((policy, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '16px 20px',
                  }}
                >
                  <h4
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#60A5FA',
                      marginBottom: '6px',
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>{policy.title}</span>
                  </h4>
                  <p
                    style={{
                      fontSize: '13.5px',
                      color: '#94A3B8',
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {policy.content}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="modal-book-btn"
              onClick={() => setShowPoliciesModal(false)}
            >
              <span>Understood, Return to Services</span>
            </button>
          </div>
        </div>
      )}

      {showPackagesModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowPackagesModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-card"
            style={{ maxWidth: '780px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowPackagesModal(false)}
              aria-label="Close packages"
            >
              <X size={18} />
            </button>

            <span className="modal-tag">PDF Page 9 • Curated Bundles</span>
            <h3 className="modal-title">Monthly Growth Packages</h3>
            <p className="modal-summary">
              Turnkey full-stack bundles engineered for every growth stage from early launch
              to scaled enterprise operations.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '16px',
                marginTop: '18px',
                marginBottom: '24px',
              }}
            >
              {PACKAGE_COMBINATIONS.map((pkg, i) => (
                <div
                  key={i}
                  style={{
                    background: pkg.featured
                      ? 'linear-gradient(145deg, rgba(37, 99, 235, 0.22) 0%, rgba(8, 11, 24, 0.9) 100%)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: pkg.featured
                      ? '1px solid rgba(96, 165, 250, 0.45)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '18px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '11px',
                        fontFamily: "var(--font-mono, 'Space Grotesk', monospace)",
                        fontWeight: 700,
                        color: pkg.featured ? '#38BDF8' : '#94A3B8',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                      }}
                    >
                      {pkg.featured ? '★ Most Popular' : 'Monthly Tier'}
                    </span>
                    <h4
                      style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        marginBottom: '8px',
                      }}
                    >
                      {pkg.package}
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '6px',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '24px',
                          fontWeight: 800,
                          color: '#FFFFFF',
                        }}
                      >
                        {pkg.price}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>
                        {pkg.period}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '12.5px',
                        color: '#94A3B8',
                        marginBottom: '14px',
                      }}
                    >
                      Ideal for: {pkg.idealFor}
                    </p>

                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {pkg.features.map((feat, fIdx) => (
                        <li
                          key={fIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            fontSize: '13px',
                            color: '#E2E8F0',
                          }}
                        >
                          <Check
                            size={14}
                            style={{ color: '#38BDF8', marginTop: '2px', flexShrink: 0 }}
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    className="modal-book-btn"
                    onClick={() => {
                      handleBookService(pkg.package)
                      setShowPackagesModal(false)
                    }}
                  >
                    <span>Choose {pkg.package}</span>
                    <span className="btn-arrow">↗</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
