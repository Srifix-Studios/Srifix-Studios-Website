import React, { useEffect, useRef } from 'react'
import Navbar from './Navbar/Navbar'
import Footer from './Footer'
import CtaSection from './CtaSection'
import Approach3DSection from './Approach3DSection'
import '../styles/about-page.css'

// ─── Asset paths ──────────────────────────────────────────────
const ASSETS = {
  headerBg:           '/figma/about/hero-header-bg.png?v=5',
  vectorArrow:        '/figma/about/vector-arrow.svg',
  vector1:            '/figma/about/vector1.svg',
  blueShadow:         '/figma/about/blue-shadow.svg',
  container1:         '/figma/about/container1.svg',
  container2:         '/figma/about/container2.svg',
  container3:         '/figma/about/container3.svg',
  group318:           '/figma/about/group318.svg',
  group319:           '/figma/about/group319.svg',
  missionVisionCard:  '/figma/about/mission-vision-card.svg',
  vector9:            '/figma/about/vector9.svg',
  vector10:           '/figma/about/vector10.svg',
  frame321b:          '/figma/about/frame-321b.svg',
  favicon:            '/assets/favicon-logo.png',
}

// ─── Visual Services Showcases ────────────────────────────────
const SERVICE_SHOWCASES = [
  {
    num: '01 / BRAND IDENTITY',
    title: 'Brand Systems & Visual Architecture',
    desc: 'Bespoke type hierarchies, mathematical grids, and cohesive design tokens engineered to establish enduring market authority.',
    image: '/figma/about/service-brand.jpg',
    accent: '#2753e3',
    tags: ['Brand Identity', 'Custom Typography', 'Design Systems', 'Packaging'],
    metric: '99% Distinctiveness',
  },
  {
    num: '02 / ENGINEERING & 3D',
    title: 'High-Performance Web & Spatial UI',
    desc: 'Sub-second, highly interactive web applications powered by modern Next.js/React, fluid WebGL 3D physics, and zero layout shift.',
    image: '/figma/about/service-web.jpg',
    accent: '#2753e3',
    tags: ['Spatial UI/UX', 'Interactive WebGL', 'Next.js & React', 'Speed 100/100'],
    metric: 'Sub-Second Latency',
  },
  {
    num: '03 / CREATIVE & GROWTH',
    title: 'Cinematic Motion & Performance Scale',
    desc: 'Accelerating customer acquisition through narrative-driven 3D motion graphics, high-converting ad creative, and full-funnel strategy.',
    image: '/figma/about/service-growth.jpg',
    accent: '#f07108',
    tags: ['Motion Graphics', 'Paid Media Ads', 'Video Production', '4.2x Avg ROAS'],
    metric: '+218% Conversion',
  },
]

// ─── 4 Curated Marquee Streams for What We Do ─────────────────
const TICKER_ROWS = [
  'Website Design & Development · UI/UX Design · Full-Stack WebGL · SEO Optimization · Performance Engineering · Next.js Applications ·',
  'Brand Architecture · Custom Typography · 3D Spatial UI · Graphic Design · Motion Graphics · Visual Identity Systems ·',
  'Google Ads · Meta Performance Ads · Social Media Strategy · Conversion Rate Optimization · High-Converting Video Editing ·',
  'Creative Content · Digital Marketing · Design Systems · Brand Strategy · Global Scaling · Business Solutions ·',
]

// ─── Why Us floating tags (Exact Figma 2-Row Layout) ──────────
const WHY_TAGS_ROW1 = [
  { label: 'Transparent Communication', type: 'frosted' },
  { label: 'Multi-Disciplinary Team', type: 'frosted' },
  { label: 'Business & Digital Solutions', type: 'frosted' },
]

const WHY_TAGS_ROW2 = [
  { label: 'Business-Focused Approach', type: 'blue' },
  { label: 'Modern Solutions', type: 'blue' },
  { label: 'Creative Thinking', type: 'orange' },
  { label: 'Long-Term Partnership', type: 'orange' },
]

// ─── How We Work steps ───────────────────────────────────────
const HOW_WE_WORK = [
  {
    num: '01',
    label: 'Discover.',
    desc: 'Understand the business, audience, goals, and challenges.',
    tags: ['User Research', 'Audience Mapping', 'Scope Definition'],
  },
  {
    num: '02',
    label: 'Strategize.',
    desc: 'Define the digital architecture, core positioning, and roadmap.',
    tags: ['Information Architecture', 'Brand Positioning', 'Milestone Roadmap'],
  },
  {
    num: '03',
    label: 'Create.',
    desc: 'Design high-fidelity brand systems, 3D spatial UI, and prototypes.',
    tags: ['Brand Systems', 'Spatial Experience', 'Interactive Prototyping'],
  },
  {
    num: '04',
    label: 'Refine.',
    desc: 'Test micro-physics, cross-device responsiveness, and performance.',
    tags: ['Motion Physics', 'Cross-Device QA', 'Sub-Second Speeds'],
  },
  {
    num: '05',
    label: 'Deliver.',
    desc: 'Production deployment, clean code handover, and asset release.',
    tags: ['Full Deployment', 'Production Handover', 'Asset Package'],
  },
  {
    num: '06',
    label: 'Grow.',
    desc: 'Continuous analytics intelligence, telemetry audits, and scaling.',
    tags: ['Conversion Telemetry', 'Iterative Audits', 'Scale Engineering'],
  },
]

// ─── Our Values (Option A: 6 Structured Values in Dual Realms) ──
const VALUES_BLUE = [
  {
    num: '01',
    name: 'Creativity',
    pillar: 'Originality First',
    desc: 'Unconventional thinking and distinct aesthetics that break through digital saturation and command lasting cultural relevance.',
    accent: '#2753e3',
    points: ['Bold Visual Systems', 'Distinct Typographic Hierarchy', 'Non-Derivative Concepts'],
  },
  {
    num: '02',
    name: 'Growth',
    pillar: 'Compounding Impact',
    desc: 'Engineering scalable design and technology systems architected for measurable client acquisition and sustainable commercial velocity.',
    accent: '#2753e3',
    points: ['Conversion-Driven UI', 'Full-Funnel Digital Velocity', 'Compounding Performance'],
  },
  {
    num: '03',
    name: 'Integrity',
    pillar: 'Radical Transparency',
    desc: 'Uncompromising honesty, transparent communication, realistic roadmaps, and zero hidden technical compromises.',
    accent: '#2753e3',
    points: ['Direct Open Dialogue', 'Clean Production Standards', 'No Fluff or Overpromises'],
  },
]

const VALUES_ORANGE = [
  {
    num: '04',
    name: 'Collaboration',
    pillar: 'Embedded Extension',
    desc: 'Co-creating as an embedded extension of your founding leadership team, moving fast with shared vision and mutual accountability.',
    accent: '#f07108',
    points: ['Shared Product Ownership', 'High-Frequency Syncs', 'Frictionless Team Integration'],
  },
  {
    num: '05',
    name: 'Quality',
    pillar: 'Sub-Pixel Polish',
    desc: 'Obsessive attention to craft: 60fps micro-physics, fluid layout transitions, responsive precision, and sub-second performance.',
    accent: '#f07108',
    points: ['Micro-Physics & Delight', 'Sub-Second Page Speeds', 'Rigorous Cross-Device QA'],
  },
  {
    num: '06',
    name: 'Innovation',
    pillar: 'Spatial Frontier',
    desc: 'Continuously pioneering emerging spatial UI, WebGL 3D physics, headless architecture, and next-generation creative engineering.',
    accent: '#f07108',
    points: ['Interactive WebGL & 3D', 'Emerging Tech Exploration', 'Next-Gen Frontend Stacks'],
  },
]

// ─── Team Members ─────────────────────────────────────────────
const TEAM_MEMBERS = [
  {
    num: '01',
    name: 'John Doe',
    role: 'Founder & Creative Director',
    dept: 'DESIGN & DIRECTION',
    bio: 'Directing brand architecture, spatial typography, and high-impact digital experiences across web and spatial mediums.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    tags: ['Brand Architecture', 'Spatial Systems', 'Creative Direction'],
  },
  {
    num: '02',
    name: 'Yogesh Srivastava',
    role: 'Co-Founder & Tech Lead',
    dept: 'ENGINEERING & ARCHITECTURE',
    bio: 'Architecting resilient full-stack systems, interactive 3D WebGL physics, and performance-first web infrastructure.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    tags: ['Full-Stack', 'Interactive WebGL', 'Cloud Architecture'],
  },
  {
    num: '03',
    name: 'Elena Rostova',
    role: 'Lead 3D & Motion Designer',
    dept: 'VISUAL ARTS & 3D',
    bio: 'Crafting real-time 3D spatial simulations, kinetic brand motion, and tactile interactive micro-physics.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    tags: ['3D Experiences', 'Spline & Blender', 'Motion Physics'],
  },
  {
    num: '04',
    name: 'Marcus Chen',
    role: 'Head of Growth & Performance',
    dept: 'DIGITAL STRATEGY',
    bio: 'Scaling conversion funnels and commercial momentum through rigorous telemetry, data audits, and performance marketing.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    tags: ['Growth Marketing', 'Conversion Strategy', 'Performance Ads'],
  },
]

// ─── Culture Highlights ───────────────────────────────────────
const CULTURE_PILLARS = [
  {
    title: 'Continuous Learning',
    desc: 'Unrelenting curiosity across emerging spatial tech, modern WebGL, and digital ecosystems.',
    accent: '#2753e3',
  },
  {
    title: 'Radical Candor',
    desc: 'Transparent, direct communication where ideas are pressure-tested to reach their purest form.',
    accent: '#f07108',
  },
  {
    title: 'Craft Over Speed',
    desc: 'Obsessive attention to tactile feedback, fluid physics, and bespoke brand typography.',
    accent: '#2753e3',
  },
  {
    title: 'High-Agency Ownership',
    desc: 'Empowering every team member to solve complex problems and take pride in extraordinary output.',
    accent: '#f07108',
  },
]

// ─── Approach nodes ──────────────────────────────────────────
const APPROACH = [
  { label: 'Understand', left: '0%',       top: '80.135%' },
  { label: 'Create',     left: '20.576%',  top: '49.661%' },
  { label: 'Refine',     left: '41.793%',  top: '19.865%' },
  { label: 'Deliver',    left: '62.050%',  top: '49.661%' },
  { label: 'Grow',       left: '81.025%',  top: '0%' },
]

// ─── CTA Button ──────────────────────────────────────────────
function CtaButton({ label = 'Get started', icon = ASSETS.vectorArrow, onClick, className = '' }) {
  return (
    <button className={`about-cta-btn ${className}`} onClick={onClick}>
      <div className="about-cta-btn__glow" />
      <span className="about-cta-btn__text">{label}</span>
      <span className="about-cta-btn__icon">
        <img src={icon} alt="" aria-hidden="true" />
      </span>
    </button>
  )
}

// ─── Services Ticker (4 Continuous Infinite Streams) ─────────
function ServicesTicker() {
  return (
    <div className="about-ticker" aria-hidden="true">
      {TICKER_ROWS.map((text, idx) => (
        <div
          key={idx}
          className={`about-ticker__track ${idx % 2 === 1 ? 'about-ticker__track--reverse' : ''}`}
          style={{ '--ticker-dur': `${30 + idx * 4}s` }}
        >
          <span className="about-ticker__text">{text}</span>
          <span className="about-ticker__text">{text}</span>
          <span className="about-ticker__text">{text}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Service Card with Slide-Up Curtain Reveal ───────────────
function ServiceCard({ service, onOpenContact }) {
  const [isRevealed, setIsRevealed] = React.useState(false)

  return (
    <div
      className={`about-service-card ${isRevealed ? 'about-service-card--revealed' : ''}`}
      style={{ '--accent': service.accent }}
      onClick={() => setIsRevealed(!isRevealed)}
    >
      <div className="about-service-card__glow" />

      {/* ── BASE LAYER: Full Written Content ── */}
      <div className="about-service-card__body">
        <div className="about-service-card__top">
          <span className="about-service-card__num">{service.num}</span>
          <span className="about-service-card__metric-badge">{service.metric}</span>
        </div>

        <h3 className="about-service-card__title">{service.title}</h3>
        <p className="about-service-card__desc">{service.desc}</p>

        <div className="about-service-card__tags">
          {service.tags.map((tag) => (
            <span key={tag} className="about-service-card__tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="about-service-card__footer">
          <button
            className="about-service-card__btn"
            onClick={(e) => {
              e.stopPropagation()
              onOpenContact()
            }}
          >
            <span>Partner on this</span>
            <span className="about-hero__cta-arrow">↗</span>
          </button>
          <span className="about-service-card__hint">
            <span>✦ Hover to preview visual work</span>
          </span>
        </div>
      </div>

      {/* ── SLIDE-UP CURTAIN: Visual Showcase ── */}
      <div className="about-service-card__curtain" aria-hidden="true">
        <div className="about-service-card__curtain-media">
          <img
            src={service.image}
            alt=""
            className="about-service-card__curtain-img"
            loading="lazy"
          />
          <span className="about-service-card__curtain-pill">{service.metric}</span>
        </div>

        <div className="about-service-card__curtain-bar">
          <div className="about-service-card__curtain-info">
            <span className="about-service-card__curtain-num">{service.num}</span>
            <h4 className="about-service-card__curtain-title">{service.title}</h4>
          </div>
          <button
            className="about-service-card__curtain-btn"
            onClick={(e) => {
              e.stopPropagation()
              onOpenContact()
            }}
          >
            <span>Work With Us</span>
            <span className="about-hero__cta-arrow">↗</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Option B: Kinetic Floating Parallelogram Podium (Figma-Evolved) ─
function OurValuesParallelogram() {
  const stageRef = useRef(null)
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 })
  const [activeItem, setActiveItem] = React.useState(null)

  const handleMouseMove = (e) => {
    if (!stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({
      x: (0.5 - y) * 12,
      y: (x - 0.5) * 14,
    })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <section className="about-values" id="values">
      <p className="about-section__eyebrow about-values__eyebrow">Our Values</p>

      <div
        className="about-values__stage"
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Exact Figma tilted parallelogram matrix (-15 deg) with 3D perspective */}
        <div
          className="about-values__matrix"
          style={{
            transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotate(-15deg)`,
          }}
        >
          {/* 4 Luminous Frosted Glass Podiums */}
          <div className="about-values__block about-values__block--blue-top">
            <div className="about-values__block-glass" />
          </div>
          <div className="about-values__block about-values__block--blue-bottom">
            <div className="about-values__block-glass" />
          </div>
          <div className="about-values__block about-values__block--orange-top">
            <div className="about-values__block-glass" />
          </div>
          <div className="about-values__block about-values__block--orange-bottom">
            <div className="about-values__block-glass" />
          </div>

          {/* Left Column: 3 Values on Blue Podiums */}
          <div className="about-values__column about-values__column--left">
            {VALUES_BLUE.map((val) => {
              const isActive = activeItem === val.name
              return (
                <div
                  key={val.name}
                  className={`about-values__item ${isActive ? 'about-values__item--active' : ''}`}
                  onMouseEnter={() => setActiveItem(val.name)}
                  onMouseLeave={() => setActiveItem(null)}
                  onClick={() => setActiveItem(isActive ? null : val.name)}
                >
                  <span className="about-values__name">{val.name}</span>
                  <span className="about-values__diamond">◆</span>

                  {/* Luminous Interactive Creed Flyout */}
                  <div className="about-values__tooltip">
                    <span className="about-values__tooltip-pillar">{val.pillar}</span>
                    <span className="about-values__tooltip-desc">{val.desc}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: 3 Values on Orange Podiums */}
          <div className="about-values__column about-values__column--right">
            {VALUES_ORANGE.map((val) => {
              const isActive = activeItem === val.name
              return (
                <div
                  key={val.name}
                  className={`about-values__item about-values__item--orange ${isActive ? 'about-values__item--active' : ''}`}
                  onMouseEnter={() => setActiveItem(val.name)}
                  onMouseLeave={() => setActiveItem(null)}
                  onClick={() => setActiveItem(isActive ? null : val.name)}
                >
                  <span className="about-values__name">{val.name}</span>
                  <span className="about-values__diamond">◆</span>

                  {/* Luminous Interactive Creed Flyout */}
                  <div className="about-values__tooltip about-values__tooltip--orange">
                    <span className="about-values__tooltip-pillar">{val.pillar}</span>
                    <span className="about-values__tooltip-desc">{val.desc}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── How We Work (Interactive Hover Cards / Accordion) ───────
function HowWeWorkHoverCards() {
  const [activeStep, setActiveStep] = React.useState(0)

  return (
    <section className="about-how" id="how-we-work">
      {/* Ambient edge beam (matching left glow vignette from Figma) */}
      <div className="about-how__ambient-glow" aria-hidden="true" />

      <p className="about-section__eyebrow">How We Work</p>

      <div className="about-how__steps" role="list">
        {HOW_WE_WORK.map((step, i) => {
          const isActive = activeStep === i
          return (
            <div
              key={step.num}
              role="listitem"
              className={`about-how__step ${isActive ? 'about-how__step--active' : ''}`}
              style={{ '--i': i }}
              onMouseEnter={() => setActiveStep(i)}
              onClick={() => setActiveStep(i)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setActiveStep(i)
                }
              }}
              aria-expanded={isActive}
            >
              {/* Divider line across top */}
              <div className="about-how__step-line" />

              {/* Glowing active card indicator pill on left */}
              <div className="about-how__step-accent" aria-hidden="true" />

              <div className="about-how__step-header">
                <p className="about-how__step-label">
                  <span className="about-how__step-num">{step.num} </span>
                  <span className="about-accent-blue">{step.label}</span>
                </p>
                <div className="about-how__step-badge" aria-hidden="true">
                  <span className="about-how__step-badge-text">Phase {step.num}</span>
                  <svg
                    className="about-how__step-badge-arrow"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>

              {/* Collapsible card body with smooth grid animation */}
              <div className="about-how__step-content-wrapper">
                <div className="about-how__step-content-inner">
                  <p className="about-how__step-desc">{step.desc}</p>
                  <div className="about-how__step-tags">
                    {step.tags.map((tag) => (
                      <span key={tag} className="about-how__step-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Closing bottom divider line */}
        <div className="about-how__step-bottom-line" />
      </div>
    </section>
  )
}

// ─── Team Member Card with Slide-Up Portrait Curtain ────────
function TeamMemberCard({ member }) {
  const [isRevealed, setIsRevealed] = React.useState(false)

  return (
    <div
      className={`about-team__card ${isRevealed ? 'about-team__card--revealed' : ''}`}
      onClick={() => setIsRevealed(!isRevealed)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setIsRevealed(!isRevealed)
        }
      }}
      aria-label={`${member.name}, ${member.role}`}
    >
      <div className="about-team__card-glow" />

      {/* ── BASE LAYER: Written Content First ── */}
      <div className="about-team__body">
        <div className="about-team__top">
          <span className="about-team__dept">{member.dept}</span>
          <span className="about-team__num">{member.num}</span>
        </div>

        <div className="about-team__info">
          <h3 className="about-team__name">{member.name}</h3>
          <p className="about-team__role">{member.role}</p>
        </div>

        <p className="about-team__bio">{member.bio}</p>

        <div className="about-team__tags">
          {member.tags.map((tag) => (
            <span key={tag} className="about-team__tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="about-team__hint">
          <span>✦ Hover to reveal portrait</span>
          <span className="about-team__hint-arrow">↗</span>
        </div>
      </div>

      {/* ── SLIDE-UP CURTAIN: Portrait Showcase ── */}
      <div className="about-team__curtain" aria-hidden="true">
        <div className="about-team__curtain-media">
          <img
            src={member.avatar}
            alt={member.name}
            className="about-team__curtain-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              if (e.currentTarget.nextSibling) {
                e.currentTarget.nextSibling.style.display = 'flex'
              }
            }}
          />
          <div className="about-team__avatar-fallback" style={{ display: 'none' }}>
            <span>{member.name.split(' ').map((n) => n[0]).join('')}</span>
          </div>
          <span className="about-team__curtain-badge">{member.dept}</span>
        </div>

        <div className="about-team__curtain-bar">
          <div className="about-team__curtain-info">
            <h4 className="about-team__curtain-name">{member.name}</h4>
            <p className="about-team__curtain-role">{member.role}</p>
          </div>
          <span className="about-team__curtain-tag">{member.tags[0]}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────
export default function AboutPage({ onNavigate, onOpenContact }) {
  const tickerRef = useRef(null)

  function handleNav(href) {
    if (onNavigate) onNavigate(href)
    else if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) {
        if (window.lenis) window.lenis.scrollTo(el, { duration: 1.2 })
        else el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="about-page">
      {/* ── Navbar ── */}
      <Navbar
        activePage="about"
        onNavigate={handleNav}
        onOpenContact={onOpenContact}
        className="about-navbar"
      />

      {/* ── HERO HEADER ── */}
      <section className="about-hero">
        <div className="about-hero__bg">
          <img src={ASSETS.headerBg} alt="" aria-hidden="true" className="about-hero__bg-img" />
        </div>

        <div className="about-hero__inner">
          <p className="about-hero__eyebrow">About Srifix Studios</p>
          <h1 className="about-hero__headline">
            Building Brands. Creating Experiences.
          </h1>
          <p className="about-hero__subheadline">
            <span className="about-hero__accent">Driving Digital Growth.</span>
          </p>
          <p className="about-hero__body">
            Srifix Studios is a modern creative digital agency helping startups, businesses,
            and growing brands build a strong, memorable, and performance-driven digital presence.
          </p>
          <div className="about-hero__ctas">
            <button
              className="about-hero__cta-meet"
              onClick={() => handleNav('#our-team')}
            >
              <span>Meet Our Team</span>
              <span className="about-hero__cta-arrow">↗</span>
            </button>
            <button
              className="about-hero__cta-work"
              onClick={onOpenContact}
            >
              <span>Work With Us</span>
              <span className="about-hero__cta-arrow">↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── WHO WE ARE (Immediately follows Hero) ── */}
      <section className="about-who" id="who-we-are">
        <p className="about-section__eyebrow">Who We Are</p>
        <h2 className="about-section__headline about-who__headline">
          We're More Than a<br />
          Creative <span className="about-accent-blue">Agency.</span>
        </h2>
        <p className="about-section__body">
          Srifix Studios is a creative digital agency focused on helping businesses transform
          ideas into impactful digital experiences. We bring design, technology, marketing,
          content, and strategy together to create meaningful digital solutions.
        </p>

        {/* 3D Interactive Approach Pathway Engine */}
        <Approach3DSection onOpenContact={onOpenContact} />
      </section>

      {/* ── WHAT WE DO / SERVICES SHOWCASE ── */}
      <section className="about-what-we-do" id="services">
        <div className="about-what-we-do__header">
          <h2 className="about-section__eyebrow about-what-we-do__title">What We Do</h2>
          <p className="about-section__subhead">
            End-to-End Capabilities Built for{' '}
            <span className="about-accent-blue">Modern</span>{' '}
            <span className="about-accent-orange">Scale</span>
          </p>
        </div>

        {/* Dynamic Continuous Ticker */}
        <ServicesTicker />

        {/* 3 Visual Service Showcase Cards with Slide-Up Curtain Reveal */}
        <div className="about-services-grid">
          {SERVICE_SHOWCASES.map((service) => (
            <ServiceCard
              key={service.num}
              service={service}
              onOpenContact={onOpenContact}
            />
          ))}
        </div>
      </section>

      {/* ── OUR MISSION & VISION (Faithful to media_1794983240552_cbadfd52) ── */}
      <section className="about-mission" id="mission-vision">
        <div className="about-mission__card">
          {/* Card SVG background with dual glow & S-ribbon */}
          <div className="about-mission__bg">
            <img
              src="/figma/about/mission-vision-card.svg?v=2"
              alt=""
              aria-hidden="true"
              className="about-mission__bg-img"
            />
          </div>

          <div className="about-mission__content">
            {/* Top Mission Statement (Blue Realm) */}
            <div className="about-mission__top">
              <span className="about-mission__badge">✦ 01 / OUR PURPOSE</span>
              <p className="about-mission__statement">
                Our mission is to make professional digital creativity accessible to businesses of
                every size. We create work that communicates clearly, builds trust, attracts the
                right audience, and contributes to meaningful business growth.
              </p>
            </div>

            {/* Middle S-Curve Ribbon Podium with Headings */}
            <div className="about-mission__mid">
              <div className="about-mission__podium about-mission__podium--left">
                <h3 className="about-mission__label">Our Mission</h3>
              </div>
              <div className="about-mission__podium about-mission__podium--right">
                <h3 className="about-mission__label">Our Vision</h3>
              </div>
            </div>

            {/* Bottom Vision Statement (Orange Realm) */}
            <div className="about-mission__bottom">
              <span className="about-mission__badge about-mission__badge--orange">✦ 02 / OUR HORIZON</span>
              <p className="about-mission__statement about-mission__statement--right">
                To build Srifix Studios into a globally recognized creative digital agency known
                for innovation, quality, creativity, transparency, and impactful digital experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR CULTURE ── */}
      <section className="about-culture" id="culture">
        <div className="about-culture__emblem" aria-hidden="true">
          <img src={ASSETS.group318} alt="" className="about-culture__emblem-img" />
        </div>
        <div className="about-culture__header">
          <p className="about-section__eyebrow">Our Culture</p>
          <h2 className="about-section__headline">
            Where Freedom Ignites <span className="about-accent-blue">Craft</span> &{' '}
            <span className="about-accent-orange">Innovation</span>
          </h2>
          <p className="about-culture__text">
            At Srifix Studios, we believe people do their best work when they have the freedom
            to learn, experiment, collaborate, and take ownership. We encourage continuous
            learning, open communication, creativity, responsibility, teamwork, and quality.
          </p>
        </div>

        <div className="about-culture__pillars">
          {CULTURE_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="about-culture__card"
              style={{ '--accent': pillar.accent }}
            >
              <div className="about-culture__card-glow" />
              <div className="about-culture__card-bar" />
              <h3 className="about-culture__card-title">{pillar.title}</h3>
              <p className="about-culture__card-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OUR VALUES (Option B: Kinetic Floating Parallelogram Podium) ── */}
      <OurValuesParallelogram />

      {/* ── WHY US (Figma Design with Light-to-Dark Hover Physics) ── */}
      <section className="about-why" id="why-us">
        <p className="about-section__eyebrow">Why Us</p>
        <h2 className="about-section__headline">
          Why Choose <span className="about-accent-blue">Srifix</span>{' '}
          <span className="about-accent-orange">Studios</span>?
        </h2>

        <div className="about-why__cluster">
          {/* Row 1: Frosted Gray Pills */}
          <div className="about-why__row about-why__row--top">
            {WHY_TAGS_ROW1.map((tag) => (
              <div
                key={tag.label}
                className={`about-why__tag about-why__tag--${tag.type}`}
              >
                <span>{tag.label}</span>
              </div>
            ))}
          </div>

          {/* Row 2: Colored Pills with Glowing Amber Orb */}
          <div className="about-why__row about-why__row--bottom">
            {WHY_TAGS_ROW2.slice(0, 2).map((tag) => (
              <div
                key={tag.label}
                className={`about-why__tag about-why__tag--${tag.type}`}
              >
                <span>{tag.label}</span>
              </div>
            ))}

            {/* Glowing Amber Orb (matching Figma screenshot) */}
            <div className="about-why__orb" aria-hidden="true" />

            {WHY_TAGS_ROW2.slice(2).map((tag) => (
              <div
                key={tag.label}
                className={`about-why__tag about-why__tag--${tag.type}`}
              >
                <span>{tag.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK (Interactive Hover Cards) ── */}
      <HowWeWorkHoverCards />

      {/* ── OUR TEAM ── */}
      <section className="about-team" id="our-team">
        <p className="about-section__eyebrow">Our Team</p>
        <h2 className="about-section__headline">
          Meet the People Behind{' '}
          <span className="about-accent-blue">Srifix</span>{' '}
          <span className="about-accent-orange">Studios</span>
        </h2>
        <p className="about-section__body">
          Great work is never created by one person alone. Srifix Studios is powered by a
          growing team of creative professionals, developers, marketers, business specialists,
          and support teams working together across different domains.
        </p>

        {/* Studio Leadership & Core Specialist Roster with Slide-Up Portrait Curtain */}
        <div className="about-team__grid">
          {TEAM_MEMBERS.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </section>

      {/* ── CAREERS BANNER (Figma Node 1844:5978) ── */}
      <section className="about-careers" id="careers">
        <div className="about-careers__card">
          <div className="about-careers__glow" aria-hidden="true" />
          <div className="about-careers__content">
            <p className="about-section__eyebrow">Careers</p>
            <h2 className="about-section__headline about-careers__headline">
              Build Your Career With <span className="about-accent-blue">Srifix</span>{' '}
              <span className="about-accent-orange">Studios</span>
            </h2>
            <p className="about-careers__body">
              We’re always interested in meeting creative and motivated people who want to learn,
              contribute, and grow. Opportunities can span Design, Development, Marketing, HR,
              Business Development, Video, UI/UX, and Content.
            </p>
            <button className="about-careers__btn" onClick={onOpenContact}>
              <span>Explore Opportunities</span>
              <span className="about-hero__cta-arrow">↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Same CTA as Homepage ── */}
      <CtaSection onOpenContact={onOpenContact} />

      {/* ── Same Footer as Homepage ── */}
      <Footer
        onOpenContact={onOpenContact}
        onNavigate={handleNav}
      />
    </div>
  )
}
