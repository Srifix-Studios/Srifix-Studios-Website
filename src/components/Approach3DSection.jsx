import React, { useState, useEffect, useRef, useCallback } from 'react'
import '../styles/about-page.css'

// ─── 5 Approach Steps with Rich Strategic Detail ───────────────
export const APPROACH_STEPS = [
  {
    id: 'understand',
    num: '01',
    label: 'Understand',
    tagline: 'Discovery & Deep Strategic Diagnosis',
    desc: 'We immerse ourselves into your brand DNA, user psychology, competitor landscape, and core commercial bottlenecks to identify high-leverage growth opportunities before a single pixel is drawn.',
    deliverables: ['Stakeholder Workshops', 'Competitive Landscape Audit', 'User Personas & Journey Mapping', 'Technical Architecture Review'],
    metric: '100% Roadmap Alignment',
    left: '0%',
    top: '80.135%',
    accentColor: '#2753e3',
    textColor: '#2753e3',
  },
  {
    id: 'create',
    num: '02',
    label: 'Create',
    tagline: 'High-Fidelity Visual Architecture & 3D UI',
    desc: 'Translating raw strategy into bespoke design systems, 3D spatial interfaces, cinematic typography, and rapid interactive prototypes engineered to captivate and convert.',
    deliverables: ['Bespoke Design Systems', '3D Spatial & Motion UI', 'Interactive Figma & Code Prototypes', 'Full-Stack Technical Framework'],
    metric: 'Sub-Second Visual Impact',
    left: '20.576%',
    top: '49.661%',
    accentColor: '#2753e3',
    textColor: '#2753e3',
  },
  {
    id: 'refine',
    num: '03',
    label: 'Refine',
    tagline: 'Micro-Physics, Usability & Stress Testing',
    desc: 'Relentless micro-interaction tuning, 60fps render benchmarking, accessibility compliance, and cross-browser stress testing until every interaction feels tactile and effortless.',
    deliverables: ['Micro-Interactions & Physics', 'Sub-Second Performance Tuning', 'Cross-Device Rigorous QA', 'Conversion Funnel Stress-Tests'],
    metric: '99.9% Usability Polish',
    left: '41.793%',
    top: '19.865%',
    accentColor: '#2753e3',
    textColor: '#2753e3',
  },
  {
    id: 'deliver',
    num: '04',
    label: 'Deliver',
    tagline: 'Production-Grade Launch & Asset Handover',
    desc: 'Zero-downtime production deployment, pristine asset packaging, SEO metadata integration, and seamless developer handover with comprehensive technical documentation.',
    deliverables: ['Zero-Downtime Live Launch', 'Clean Modular Codebase', 'Complete Asset Package', 'Technical Handover Docs'],
    metric: '100/100 Lighthouse Performance',
    left: '62.050%',
    top: '49.661%',
    accentColor: '#2753e3',
    textColor: '#2753e3',
  },
  {
    id: 'grow',
    num: '05',
    label: 'Grow',
    tagline: 'Continuous Analytics, Optimization & Scale',
    desc: 'We operate as long-term creative engineering partners: monitoring live user telemetry, running A/B conversion experiments, and scaling high-performing digital campaigns.',
    deliverables: ['Live Telemetry & User Heatmaps', 'Continuous A/B Conversion Tests', 'High-Converting Ad Creatives', 'Dedicated Strategic Growth Loops'],
    metric: '+218% Average Conversion Lift',
    left: '81.025%',
    top: '0%',
    accentColor: '#f07108',
    textColor: '#f07108',
  },
]

export default function Approach3DSection({ onOpenContact }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const stageRef = useRef(null)
  const animFrameRef = useRef(null)
  const targetTilt = useRef({ x: 0, y: 0 })

  // ── Auto-tour cycle (pauses on user interaction) ───────────
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % APPROACH_STEPS.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  // ── Smooth 3D Mouse Parallax Tilt Physics ───────────────────
  const handleMouseMove = useCallback((e) => {
    if (!stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width // 0 to 1
    const y = (e.clientY - rect.top) / rect.height // 0 to 1

    // Target tilt angles: max ±12 deg
    targetTilt.current = {
      x: (0.5 - y) * 16, // vertical mouse moves tilt around X
      y: (x - 0.5) * 22, // horizontal mouse moves tilt around Y
    }
  }, [])

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    targetTilt.current = { x: 0, y: 0 }
  }

  // Smooth lerp frame loop
  useEffect(() => {
    let running = true
    const loop = () => {
      if (!running) return
      setTilt((prev) => {
        const dx = targetTilt.current.x - prev.x
        const dy = targetTilt.current.y - prev.y
        if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
          return targetTilt.current
        }
        return {
          x: prev.x + dx * 0.08,
          y: prev.y + dy * 0.08,
        }
      })
      animFrameRef.current = requestAnimationFrame(loop)
    }
    animFrameRef.current = requestAnimationFrame(loop)
    return () => {
      running = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  const activeStep = APPROACH_STEPS[activeIndex]

  return (
    <div className="approach-3d">
      {/* ── 3D Interactive Stage Canvas ── */}
      <div
        className="approach-3d__stage-viewport"
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="approach-3d__stage-canvas"
          style={{
            transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* Spatial Grid & Ambient Hologram Depth Layer (-40px) */}
          <div className="approach-3d__ambient-grid" aria-hidden="true" />
          <div className="approach-3d__ambient-glow" aria-hidden="true" />

          {/* SVG Vector Conduit Layer (+15px Z) */}
          <div className="approach-3d__vectors-layer">
            {/* Blue vector: Refine -> Deliver -> Grow */}
            <div className="approach-3d__vector approach-3d__vector--blue">
              <img
                src="/figma/about/vector9.svg"
                alt=""
                aria-hidden="true"
              />
            </div>
            {/* White vector: Understand -> Create */}
            <div className="approach-3d__vector approach-3d__vector--white">
              <img
                src="/figma/about/vector10.svg"
                alt=""
                aria-hidden="true"
              />
            </div>

            {/* Glowing Traveling Energy Pulse Particle */}
            <div
              className={`approach-3d__energy-tracer approach-3d__energy-tracer--step-${activeIndex}`}
              aria-hidden="true"
            />
          </div>

          {/* 5 Tactile 3D Pill Nodes Layer (+55px to +90px Z) */}
          <div className="approach-3d__nodes-layer">
            {APPROACH_STEPS.map((step, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={step.id}
                  className={`approach-3d__node ${isActive ? 'approach-3d__node--active' : ''}`}
                  style={{
                    left: step.left,
                    top: step.top,
                    color: step.textColor,
                  }}
                  onClick={() => {
                    setActiveIndex(idx)
                    setIsAutoPlaying(false)
                  }}
                  aria-label={`${step.num} ${step.label}: ${step.tagline}`}
                >
                  {/* Subtle 3D Bevel & Gloss Sheen */}
                  <span className="approach-3d__node-gloss" aria-hidden="true" />

                  {/* Node Index Badge */}
                  <span className="approach-3d__node-badge">{step.num}</span>

                  {/* Label */}
                  <span className="approach-3d__node-text">{step.label}</span>

                  {/* Active Indicator Pulse Ring */}
                  {isActive && (
                    <span className="approach-3d__node-pulse" aria-hidden="true" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 3D Interaction Prompt Badge */}
        <div className="approach-3d__hint">
          <span className="approach-3d__hint-dot" />
          <span>Interactive 3D Stage · Move cursor to tilt · Click nodes to inspect</span>
        </div>
      </div>

      {/* ── Dynamic Process Inspector Console (Floating Glass Pod) ── */}
      <div className="approach-3d__inspector">
        {/* Step Selector Tab Bar */}
        <div className="approach-3d__tabs" role="tablist">
          {APPROACH_STEPS.map((step, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={step.id}
                role="tab"
                aria-selected={isActive}
                className={`approach-3d__tab ${isActive ? 'approach-3d__tab--active' : ''}`}
                onClick={() => {
                  setActiveIndex(idx)
                  setIsAutoPlaying(false)
                }}
              >
                <span className="approach-3d__tab-num">{step.num}</span>
                <span className="approach-3d__tab-label">{step.label}</span>
              </button>
            )
          })}
        </div>

        {/* Selected Step Detail Card */}
        <div className="approach-3d__card">
          <div className="approach-3d__card-header">
            <div className="approach-3d__card-meta">
              <span className="approach-3d__card-phase">
                PHASE {activeStep.num} OF 05
              </span>
              <h3 className="approach-3d__card-title">{activeStep.label}</h3>
              <p className="approach-3d__card-tagline">{activeStep.tagline}</p>
            </div>
            <div className="approach-3d__card-metric">
              <span className="approach-3d__metric-label">Benchmark</span>
              <span className="approach-3d__metric-val">{activeStep.metric}</span>
            </div>
          </div>

          <p className="approach-3d__card-desc">{activeStep.desc}</p>

          <div className="approach-3d__card-deliverables">
            <span className="approach-3d__deliv-title">Core Deliverables:</span>
            <div className="approach-3d__deliv-tags">
              {activeStep.deliverables.map((item) => (
                <span key={item} className="approach-3d__deliv-tag">
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Controls Bar: Prev, Next, Auto-Tour & Contact */}
          <div className="approach-3d__card-footer">
            <div className="approach-3d__nav-btns">
              <button
                className="approach-3d__nav-btn"
                onClick={() => {
                  setActiveIndex((prev) => (prev - 1 + APPROACH_STEPS.length) % APPROACH_STEPS.length)
                  setIsAutoPlaying(false)
                }}
                aria-label="Previous Phase"
              >
                ← Prev Phase
              </button>
              <button
                className="approach-3d__nav-btn"
                onClick={() => {
                  setActiveIndex((prev) => (prev + 1) % APPROACH_STEPS.length)
                  setIsAutoPlaying(false)
                }}
                aria-label="Next Phase"
              >
                Next Phase →
              </button>
              <button
                className={`approach-3d__tour-btn ${isAutoPlaying ? 'approach-3d__tour-btn--active' : ''}`}
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                title={isAutoPlaying ? 'Pause Auto Tour' : 'Start Auto Tour'}
              >
                {isAutoPlaying ? '⏸ Tour Active' : '▶ Play Tour'}
              </button>
            </div>

            {onOpenContact && (
              <button
                className="approach-3d__contact-btn"
                onClick={onOpenContact}
              >
                <span>Discuss Your Project</span>
                <span className="about-hero__cta-arrow">↗</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
