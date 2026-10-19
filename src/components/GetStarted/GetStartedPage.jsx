import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Mail,
  Phone
} from 'lucide-react'
import Footer from '../Footer'
import '../../styles/get-started.css'

function WhatsAppIcon({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.894-11.893a11.815 11.815 0 00-3.484-8.411z" />
    </svg>
  )
}

const SERVICES = [
  { id: 'brand', label: 'Brand Identity', price: '₹20,000' },
  { id: 'uiux', label: 'UI/UX Design', price: '₹25,000' },
  { id: 'webdev', label: 'Web Development', price: '₹30,000' },
  { id: 'digital-marketing', label: 'Digital Marketing', price: '₹20,000+' },
  { id: 'social-media', label: 'Social Media', price: '₹12,000+' },
  { id: 'custom', label: 'Creative Direction', price: 'Custom' },
]

const TIME_WINDOWS = [
  { id: 'morning', label: 'Morning (10 AM - 1 PM)' },
  { id: 'afternoon', label: 'Afternoon (2 PM - 5 PM)' },
  { id: 'evening', label: 'Evening (6 PM - 9 PM)' },
]

export default function GetStartedPage({ onBack, preselectedService = null }) {
  // Normalize preselected service
  const initialServices = React.useMemo(() => {
    if (!preselectedService) return ['webdev']
    const match = SERVICES.find((s) => s.id === preselectedService)
    return match ? [match.id] : ['webdev']
  }, [preselectedService])

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    services: initialServices,
    meetingDate: '',
    timeWindow: 'afternoon',
    notes: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [minDateString, setMinDateString] = useState('')

  // Set minimum date to tomorrow
  useEffect(() => {
    const today = new Date()
    today.setDate(today.getDate() + 1)
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const minDate = `${yyyy}-${mm}-${dd}`
    setMinDateString(minDate)
    setFormData((prev) => ({
      ...prev,
      meetingDate: prev.meetingDate || minDate,
    }))
  }, [])

  // Scroll to top on mount
  useEffect(() => {
    if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleService = (serviceId) => {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceId)
      if (exists) {
        if (prev.services.length === 1) return prev
        return { ...prev, services: prev.services.filter((s) => s !== serviceId) }
      }
      return { ...prev, services: [...prev.services, serviceId] }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      if (window.lenis) window.lenis.scrollTo(0, { duration: 0.8 })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 700)
  }

  const handleNavClick = (hash) => {
    if (onBack) onBack(hash)
  }

  return (
    <div className="gs-page-wrapper">
      {/* Overhead Neon Tubelight (CtaSection Glow Signature) */}
      <div className="gs-overhead-tubelight" aria-hidden="true" />

      {/* Atmospheric Ambient Glow Orb */}
      <div className="gs-ambient-glow" aria-hidden="true" />

      {/* Top Navbar Matching Hero Specifications */}
      <header className="gs-navbar">
        <div className="gs-navbar-inner">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('#home')
            }}
            className="navisland-logo"
          >
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

          {/* Section Navigation Links */}
          <ul className="gs-nav-links">
            <li>
              <button
                type="button"
                onClick={() => handleNavClick('#about')}
                className="gs-nav-btn"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNavClick('#features')}
                className="gs-nav-btn"
              >
                Services
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNavClick('#pricing')}
                className="gs-nav-btn"
              >
                Pricing
              </button>
            </li>
          </ul>

          {/* Back Action Button */}
          <button
            type="button"
            onClick={() => handleNavClick('#home')}
            className="gs-nav-back-btn"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Watermark Section Header */}
      <div className="gs-watermark-wrap">
        <h2 className="gs-watermark-text" aria-hidden="true">
          Contact
        </h2>
      </div>

      {/* Main 2-Column Studio Discovery Layout */}
      <div className="gs-main-layout">
        {/* Left Column: Direct Studio Information */}
        <div className="gs-studio-info">
          <span className="gs-info-tag">01 / DISCOVERY SESSION</span>

          <h1 className="gs-info-heading">
            Let's build something <span className="gs-info-highlight">extraordinary</span>.
          </h1>

          <p className="gs-info-desc">
            Schedule a 1-on-1 strategy call with our founding team. We will analyze your goals, recommend the right architecture, and formulate a clear milestone timeline.
          </p>

          <ul className="gs-perks-list">
            <li className="gs-perk-item">
              <span className="gs-perk-bar" />
              <span>30-Minute Video Consultation (Google Meet)</span>
            </li>
            <li className="gs-perk-item">
              <span className="gs-perk-bar" />
              <span>Transparent Milestone-Based Quotation</span>
            </li>
            <li className="gs-perk-item">
              <span className="gs-perk-bar" />
              <span>Architecture &amp; Design System Audit</span>
            </li>
            <li className="gs-perk-item">
              <span className="gs-perk-bar" />
              <span>Strict Client Privacy &amp; NDA Protection</span>
            </li>
          </ul>

          <div className="gs-direct-leads">
            <span className="gs-leads-title">Direct Studio Leads</span>

            <a href="mailto:info@srifixstudios.com" className="gs-contact-link">
              <Mail size={15} color="#A0C9FF" />
              <span>info@srifixstudios.com</span>
            </a>

            <a href="tel:+919625038790" className="gs-contact-link">
              <Phone size={14} color="#A0C9FF" />
              <span>+91 9625038790</span>
            </a>

            <a
              href="https://wa.me/919625038790?text=Hi%20Srifix%20Studios%2C%20I%20would%20like%20to%20discuss%20a%20new%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="gs-leads-wa-btn"
            >
              <WhatsAppIcon size={14} />
              <span>Instant Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Right Column: Studio Discovery Form Card */}
        <div className="gs-form-card">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="gs-form">
              <div className="gs-card-header">
                <span className="gs-card-badge">DIRECT STUDIO DESK</span>
                <span className="gs-card-subbadge">CONFIRM YOUR DISCOVERY SLOT</span>
              </div>

              {/* 1. Contact Information */}
              <div className="gs-section-block">
                <span className="gs-block-title">Your Details</span>

                <div className="gs-grid-2col">
                  <div className="gs-input-group">
                    <label htmlFor="fullName" className="gs-label">
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Yogesh Srivastava"
                      className="gs-text-input"
                    />
                  </div>

                  <div className="gs-input-group">
                    <label htmlFor="email" className="gs-label">
                      Work Email <span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. contact@company.com"
                      className="gs-text-input"
                    />
                  </div>
                </div>

                <div className="gs-grid-2col">
                  <div className="gs-input-group">
                    <label htmlFor="phone" className="gs-label">
                      Phone or WhatsApp <span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 9625038790"
                      className="gs-text-input"
                    />
                  </div>

                  <div className="gs-input-group">
                    <label htmlFor="company" className="gs-label">
                      Company or Brand
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Srifix Ventures"
                      className="gs-text-input"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Service Deliverables */}
              <div className="gs-section-block">
                <span className="gs-block-title">Deliverables / Scope</span>
                <div className="gs-pills-wrap">
                  {SERVICES.map((s) => {
                    const isSelected = formData.services.includes(s.id)
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleService(s.id)}
                        className={`gs-service-chip ${isSelected ? 'selected' : ''}`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                        <span>{s.label}</span>
                        <span className="gs-chip-price">({s.price})</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 3. Schedule Meeting */}
              <div className="gs-section-block">
                <span className="gs-block-title">Schedule Discovery Meeting</span>

                <div className="gs-grid-2col">
                  <div className="gs-input-group">
                    <label htmlFor="meetingDate" className="gs-label">
                      Select Date <span className="req">*</span>
                    </label>
                    <input
                      type="date"
                      id="meetingDate"
                      name="meetingDate"
                      required
                      min={minDateString}
                      value={formData.meetingDate}
                      onChange={handleInputChange}
                      className="gs-date-input"
                    />
                  </div>

                  <div className="gs-input-group">
                    <label className="gs-label">Preferred Time Window</label>
                    <div className="gs-time-pills">
                      {TIME_WINDOWS.map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          className={`gs-time-chip ${formData.timeWindow === w.id ? 'selected' : ''}`}
                          onClick={() => setFormData((prev) => ({ ...prev, timeWindow: w.id }))}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Project Notes */}
              <div className="gs-section-block">
                <label htmlFor="notes" className="gs-label">
                  Project Notes &amp; Goals
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Share a short summary of your project, target audience, or link to reference sites or Figma files..."
                  className="gs-textarea-input"
                />
              </div>

              {/* Submit CTA */}
              <div className="gs-submit-wrap">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gs-submit-btn"
                >
                  {isSubmitting ? (
                    <span>Submitting Brief...</span>
                  ) : (
                    <>
                      <span>Confirm &amp; Schedule Meeting</span>
                      <ArrowUpRight size={17} />
                    </>
                  )}
                </button>

                <p className="gs-submit-footnote">
                  *All project briefs are strictly confidential. We confirm your meeting invite within one business day.
                </p>
              </div>
            </form>
          ) : (
            /* Confirmation View */
            <div className="gs-success-view">
              <div className="gs-success-icon-wrap">
                <CheckCircle2 size={40} color="#2753E3" />
              </div>

              <h2 className="gs-success-heading">
                Meeting Request Confirmed
              </h2>

              <p className="gs-success-desc">
                Thank you, <strong style={{ color: '#FFFFFF' }}>{formData.fullName || 'Partner'}</strong>. We have received your brief and tentatively reserved your discovery session for{' '}
                <span className="gs-success-date-highlight">{formData.meetingDate}</span> ({TIME_WINDOWS.find((w) => w.id === formData.timeWindow)?.label || 'Afternoon'}).
              </p>

              <div className="gs-summary-box">
                {formData.email && (
                  <div className="gs-summary-row">
                    <span className="gs-summary-k">Email</span>
                    <span className="gs-summary-v">{formData.email}</span>
                  </div>
                )}
                {formData.phone && (
                  <div className="gs-summary-row">
                    <span className="gs-summary-k">Phone</span>
                    <span className="gs-summary-v">{formData.phone}</span>
                  </div>
                )}
                <div className="gs-summary-row">
                  <span className="gs-summary-k">Scope</span>
                  <span className="gs-summary-v">
                    {formData.services
                      .map((id) => SERVICES.find((s) => s.id === id)?.label || id)
                      .join(', ')}
                  </span>
                </div>
              </div>

              <div className="gs-success-actions">
                <a
                  href={`https://wa.me/919625038790?text=Hi%20Srifix%20Studios%2C%20I%20just%20submitted%20a%20project%20brief%20for%20${encodeURIComponent(formData.fullName || 'my project')}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gs-btn-wa-direct"
                >
                  <WhatsAppIcon size={16} />
                  <span>Connect on WhatsApp for Fast Track</span>
                  <ArrowUpRight size={15} />
                </a>

                <button
                  type="button"
                  onClick={() => handleNavClick('#home')}
                  className="gs-btn-home"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Studio Footer */}
      <Footer onOpenContact={() => {}} />
    </div>
  )
}
