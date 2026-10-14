import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { workflowSteps } from '../../data/workflow'

const PULL_MAX = 70 // px the cord can stretch
const PULL_TRIGGER = 26 // px of drag that counts as a pull
const AUTO_ON_MS = 6000 // fallback: switch on by itself if the visitor never pulls

// Dust motes floating in the beam (deterministic so renders are stable)
const DUST = Array.from({ length: 38 }, (_, i) => {
  const r = (n) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1
  return {
    left: `${15 + r(1) * 70}%`,
    top: `${20 + r(2) * 70}%`,
    size: `${1.5 + r(3) * 2.5}px`,
    dur: `${9 + r(4) * 10}s`,
    delay: `${-r(5) * 18}s`,
    drift: `${(r(6) - 0.5) * 60}px`,
  }
})

// What the paper tag on the cord says in each interaction state
const TAG_TEXT = {
  idle: 'Pull me',
  hover: 'Go on, give it a tug',
  more: 'A little more…',
  letgo: 'Now let go!',
  lit: 'Lights out?',
}

// How We Work — Desk lamp: the process sits on a dark desk under an articulated lamp.
// Pull the cord and the lamp flickers on, the light falls on the desk and the cards
// light up one by one, sweeping away from the lamp (right to left). Pull again to switch off.
export default function HowWeWorkLamp() {
  const [lit, setLit] = useState(false)
  const [pulled, setPulled] = useState(false)
  const [settled, setSettled] = useState(false) // reveal finished: hover reacts instantly
  const [tag, setTag] = useState('idle') // paper tag state on the cord
  const [cordHover, setCordHover] = useState(false)
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const rigRef = useRef(null)
  const cordRef = useRef(null)
  const drag = useRef({ active: false, startY: 0, dy: 0 })
  const litRef = useRef(false)
  const autoTimer = useRef(0)
  const touched = useRef(false) // visitor used the cord: no automatic switching
  litRef.current = lit

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Nobody should miss the content: if the cord isn't pulled, the light comes on by itself
  useEffect(() => {
    if (reduced()) {
      setLit(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        clearTimeout(autoTimer.current)
        if (e.isIntersecting && !litRef.current && !touched.current) {
          autoTimer.current = setTimeout(() => {
            if (!litRef.current && !touched.current) setLit(true)
          }, AUTO_ON_MS)
        }
      },
      { threshold: 0.45 }
    )
    io.observe(stageRef.current)
    return () => {
      io.disconnect()
      clearTimeout(autoTimer.current)
    }
  }, [])

  // A pull yanks the lamp: it swings on its mount and settles (the beam swings with it)
  const swing = () => {
    if (reduced() || !rigRef.current) return
    gsap.fromTo(rigRef.current, { rotation: 7 }, { rotation: 0, duration: 2.4, ease: 'elastic.out(1, 0.22)', overwrite: true })
  }

  // Lamp swings / aims from its ceiling mount
  useEffect(() => {
    if (rigRef.current) gsap.set(rigRef.current, { transformOrigin: '50% 0%' })
  }, [])

  useEffect(() => {
    if (!lit) return setSettled(false)
    const t = setTimeout(() => setSettled(true), 1800)
    return () => clearTimeout(t)
  }, [lit])

  const toggle = () => {
    touched.current = true
    clearTimeout(autoTimer.current)
    setLit((v) => !v)
    setPulled(true)
    swing()
  }

  // Lamp turns to aim its beam at the card being read
  const aimAt = (e) => {
    if (!litRef.current || reduced() || !rigRef.current) return
    const rig = rigRef.current.getBoundingClientRect()
    const card = e.currentTarget.getBoundingClientRect()
    const dx = card.left + card.width / 2 - (rig.left + rig.width / 2)
    const dy = card.top + card.height / 2 - rig.top
    const deg = Math.max(-16, Math.min(16, (-Math.atan2(dx, dy) * 180) / Math.PI * 0.45))
    gsap.to(rigRef.current, { rotation: deg, duration: 1.1, ease: 'power3.out', overwrite: true })
  }

  const aimHome = () => {
    if (!rigRef.current || reduced()) return
    gsap.to(rigRef.current, { rotation: 0, duration: 1.4, ease: 'power3.inOut', overwrite: true })
  }

  const springBack = () => {
    if (reduced()) return gsap.set(cordRef.current, { '--pull': '0px' })
    gsap.to(cordRef.current, { '--pull': '0px', duration: 0.9, ease: 'elastic.out(1.2, 0.3)', overwrite: true })
  }

  // Click / keyboard: a quick tug, then switch
  const tug = () => {
    if (reduced()) return toggle()
    gsap
      .timeline()
      .to(cordRef.current, { '--pull': '34px', duration: 0.14, ease: 'power2.in', onComplete: toggle })
      .to(cordRef.current, { '--pull': '0px', duration: 0.9, ease: 'elastic.out(1.2, 0.3)' })
  }

  const onPointerDown = (e) => {
    touched.current = true
    clearTimeout(autoTimer.current)
    drag.current = { active: true, startY: e.clientY, dy: 0 }
    e.currentTarget.setPointerCapture?.(e.pointerId)
    gsap.killTweensOf(cordRef.current)
  }

  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.active) return
    d.dy = Math.max(0, Math.min(PULL_MAX, e.clientY - d.startY))
    gsap.set(cordRef.current, { '--pull': `${d.dy}px` })
    // Bulb warms up as the cord is pulled; the tag cheers the visitor on
    sectionRef.current?.style.setProperty('--pre', Math.min(1, d.dy / PULL_TRIGGER).toFixed(2))
    setTag(d.dy >= PULL_TRIGGER ? 'letgo' : d.dy > 6 ? 'more' : 'hover')
  }

  const onPointerUp = (e) => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    sectionRef.current?.style.setProperty('--pre', '0')
    setTag('idle')
    if (d.dy >= PULL_TRIGGER) {
      toggle()
      springBack()
    } else if (d.dy < 6) {
      tug()
    } else {
      springBack()
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      tug()
    }
  }

  // Resolve the tag message: dragging wins, then hover, then on/off state
  const tagState = tag !== 'idle' ? tag : lit ? (cordHover ? 'lit' : 'hidden') : cordHover ? 'hover' : 'idle'

  return (
    <section id="workflow" ref={sectionRef} className={`hw4 ${lit ? 'is-on' : ''} ${settled ? 'is-settled' : ''}`}>
      <div ref={stageRef} className="hw4-stage">
        {/* Heading sits on the left; the lamp hangs on the right */}
        <header className="hw4-head">
          <span className="hw-eyebrow">Our Process</span>
          <h2 className="hw-title">
            How We <span className="hw-accent">Work</span>
          </h2>
          <p className="hw-lead">
            {lit
              ? 'Four focused phases take you from first idea to a launched, growing product.'
              : 'Every great project starts with a little light. Pull the cord.'}
          </p>
        </header>

        <div className="hw4-ambient" aria-hidden="true" />
        <div className="hw4-desktop" aria-hidden="true" />

        {/* Articulated lamp */}
        <div ref={rigRef} className="hw4-lamp">
          {/* Beam lives inside the lamp rig, so it swings and aims with the lamp */}
          <div className="hw4-beam" aria-hidden="true">
            <div className="hw4-beam-soft">
              <div className="hw4-cone" />
            </div>
            <div className="hw4-dust">
              {DUST.map((d, i) => (
                <span
                  key={i}
                  style={{ left: d.left, top: d.top, width: d.size, height: d.size, '--dur': d.dur, '--delay': d.delay, '--drift': d.drift }}
                />
              ))}
            </div>
          </div>
          <svg viewBox="0 0 320 260" className="hw4-lamp-svg" aria-hidden="true">
            <defs>
              <linearGradient id="hw4Metal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#4A5266" />
                <stop offset="0.5" stopColor="#262B38" />
                <stop offset="1" stopColor="#151821" />
              </linearGradient>
              <linearGradient id="hw4Shade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#1A1E29" />
                <stop offset="0.45" stopColor="#3A4152" />
                <stop offset="1" stopColor="#141720" />
              </linearGradient>
              <radialGradient id="hw4Bulb" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#FFFBEF" />
                <stop offset="0.5" stopColor="#FFD9A0" />
                <stop offset="1" stopColor="#F7801E" />
              </radialGradient>
            </defs>
            {/* ceiling mount + rod */}
            <rect x="138" y="0" width="44" height="9" rx="3" fill="url(#hw4Metal)" />
            <rect x="157" y="8" width="6" height="52" rx="3" fill="url(#hw4Metal)" />
            {/* articulated arms with tension springs */}
            <path d="M160 60 L214 118" stroke="url(#hw4Metal)" strokeWidth="7" strokeLinecap="round" />
            <path d="M166 70 L218 126" stroke="#5B6478" strokeWidth="1.4" strokeDasharray="2 3" />
            <path d="M214 118 L160 168" stroke="url(#hw4Metal)" strokeWidth="7" strokeLinecap="round" />
            <path d="M208 112 L154 162" stroke="#5B6478" strokeWidth="1.4" strokeDasharray="2 3" />
            <circle cx="160" cy="60" r="7" fill="#2E3443" stroke="#6B7590" strokeWidth="1.5" />
            <circle cx="214" cy="118" r="7" fill="#2E3443" stroke="#6B7590" strokeWidth="1.5" />
            <circle cx="160" cy="168" r="7" fill="#2E3443" stroke="#6B7590" strokeWidth="1.5" />
            {/* shade */}
            <path d="M140 176 Q160 168 180 176 L214 230 Q160 246 106 230 Z" fill="url(#hw4Shade)" />
            <path d="M140 176 Q160 168 180 176" stroke="#7B86A3" strokeWidth="1.2" fill="none" opacity="0.6" />
            {/* mouth + bulb (glow only when on) */}
            <ellipse cx="160" cy="232" rx="54" ry="9" fill="#0A0C12" />
            <ellipse className="hw4-bulb" cx="160" cy="231" rx="48" ry="7" fill="url(#hw4Bulb)" />
          </svg>

          {/* Pull cord hangs from the shade rim */}
          <button
            ref={cordRef}
            type="button"
            className={`hw4-cord ${pulled ? 'was-pulled' : ''}`}
            aria-label={lit ? 'Pull to switch the lamp off' : 'Pull to switch the lamp on'}
            aria-pressed={lit}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            onPointerEnter={() => setCordHover(true)}
            onPointerLeave={() => setCordHover(false)}
          >
            <span className="hw4-cord-sway">
              <span className="hw4-cord-line" />
              <span className="hw4-cord-knob" />
            </span>
            {/* Paper tag tied to the bead: talks to the visitor while they pull */}
            <span className="hw4-tag-wrap" aria-hidden="true">
              <span className={`hw4-tag is-${tagState}`}>
                <span className="hw4-tag-hole" />
                {TAG_TEXT[tagState]}
              </span>
            </span>
          </button>
        </div>

        {/* The desk */}
        <div className="hw4-desk">
          <div className="hw4-cards" onPointerLeave={aimHome}>
            {workflowSteps.map((s, i) => {
              const Icon = s.icon
              // Light sweeps away from the lamp (right to left)
              return (
                <article key={s.step} className="hw4-card" onPointerEnter={aimAt} style={{ '--d': `${0.55 + (workflowSteps.length - 1 - i) * 0.18}s` }}>
                  <div className="hw4-card-top">
                    <span className="hw4-card-num">{s.step}</span>
                    <span className="hw4-card-icon">
                      <Icon style={{ width: '22px', height: '22px' }} />
                    </span>
                  </div>
                  <h3 className="hw4-card-title">{s.title}</h3>
                  <p className="hw4-card-desc">{s.desc}</p>
                  <ul className="hw4-card-list">
                    {s.deliverables.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
          <div className="hw4-surface" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
