import React, { useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/why-us.css'

gsap.registerPlugin(ScrollTrigger)

const featuresList = [
  'Global delivery team',
  'Fixed, transparent pricing',
  'Direct founder collaboration',
  'Dedicated post launch support',
]

const hexagonsData = [
  {
    id: '6',
    value: '6',
    label: 'Delivery regions',
    desktopX: -330,
    tabletX: -240,
    mobileX: -130,
    zIndex: 4,
  },
  {
    id: '100',
    value: '100%',
    label: 'Remote first',
    desktopX: -110,
    tabletX: -80,
    mobileX: -44,
    zIndex: 3,
  },
  {
    id: '48h',
    value: '48h',
    label: 'Avg. first response',
    desktopX: 110,
    tabletX: 80,
    mobileX: 44,
    zIndex: 2,
  },
  {
    id: '18',
    value: '18',
    label: 'Services offered',
    desktopX: 330,
    tabletX: 240,
    mobileX: 130,
    zIndex: 1,
  },
]

const HEX_PATH =
  'M 115 28 Q 155 5 195 28 L 285 80 Q 305 100 305 130 L 305 208 Q 305 238 285 258 L 195 310 Q 155 333 115 310 L 25 258 Q 5 238 5 208 L 5 130 Q 5 100 25 80 Z'

function RoundedHexagon() {
  return (
    <svg
      className="why-hex-svg-bg"
      viewBox="0 0 310 338"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="why-hex-grad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#0F0F1C" />
          <stop offset="38%" stopColor="#121838" />
          <stop offset="82%" stopColor="#2753E3" />
          <stop offset="100%" stopColor="#2F5BF0" />
        </linearGradient>
      </defs>
      <path
        d={HEX_PATH}
        fill="url(#why-hex-grad)"
        stroke="rgba(255, 255, 255, 0.14)"
        strokeWidth="1.2"
      />
    </svg>
  )
}

export default function WhyUsSection() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return

    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isTablet: '(min-width: 641px) and (max-width: 1023px)',
        isMobile: '(max-width: 640px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, isTablet, isMobile, reduceMotion } = context.conditions

        const getTargetX = (hex) => {
          if (isMobile) return hex.mobileX
          if (isTablet) return hex.tabletX
          return hex.desktopX
        }

        const t18 = getTargetX(hexagonsData[3])
        const t48 = getTargetX(hexagonsData[2])
        const t100 = getTargetX(hexagonsData[1])
        const t6 = getTargetX(hexagonsData[0])

        if (reduceMotion) {
          gsap.set('.why-hex-card--18', { x: t18, opacity: 1, scale: 1 })
          gsap.set('.why-hex-card--48h', { x: t48, opacity: 1, scale: 1 })
          gsap.set('.why-hex-card--100', { x: t100, opacity: 1, scale: 1 })
          gsap.set('.why-hex-card--6', { x: t6, opacity: 1, scale: 1 })
          return
        }

        gsap.set('.why-hex-card--18', { x: 0, opacity: 1, scale: 1, zIndex: 1 })
        gsap.set('.why-hex-card--48h', { x: 0, opacity: 0, scale: 0.94, zIndex: 2 })
        gsap.set('.why-hex-card--100', { x: 0, opacity: 0, scale: 0.94, zIndex: 3 })
        gsap.set('.why-hex-card--6', { x: 0, opacity: 0, scale: 0.94, zIndex: 4 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=900', 
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        })

        tl.to(
          '.why-hex-card--18',
          {
            x: t18,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          0
        )

        tl.to(
          '.why-hex-card--48h',
          {
            x: t48,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            ease: 'power2.out',
          },
          0.08
        )

        tl.to(
          '.why-hex-card--100',
          {
            x: t100,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            ease: 'power2.out',
          },
          0.22
        )

        tl.to(
          '.why-hex-card--6',
          {
            x: t6,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            ease: 'power2.out',
          },
          0.38
        )

        const finePointer = window.matchMedia('(pointer: fine)').matches
        if (finePointer) {
          const cards = stage.querySelectorAll('.why-hex-card')
          cards.forEach((card) => {
            const onEnter = () => gsap.to(card, { y: -8, scale: 1.03, duration: 0.3, ease: 'power2.out' })
            const onLeave = () => gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
            card.addEventListener('pointerenter', onEnter)
            card.addEventListener('pointerleave', onLeave)
          })
        }
      },
      sectionRef
    )

    return () => mm.revert()
  }, [])

  return (
    <section id="why-us" ref={sectionRef} className="why-section">
      <div className="why-backdrop-glow" aria-hidden="true" />

      <div className="why-watermark-wrap" aria-hidden="true">
        <img
          src="/figma/why_us_watermark.svg"
          alt=""
          className="why-watermark-svg"
          draggable="false"
        />
      </div>

      <div className="why-inner">
        <h2 className="why-headline">
          Studio <span className="why-accent">craft</span>. <br />
          Agency scale.
        </h2>

        <p className="why-sub">
          We combine high visual craft with the disciplined execution of a full studio,
          giving you dedicated personal attention without slowing your launch down.
        </p>

        <div className="why-ticks-box">
          <ul className="why-ticks-grid">
            {featuresList.map((item) => (
              <li key={item} className="why-tick-item">
                <Check className="why-tick-icon" strokeWidth={2.6} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div ref={stageRef} className="why-hexes-stage">
          {hexagonsData.map((hex) => (
            <div
              key={hex.id}
              className={`why-hex-card why-hex-card--${hex.id}`}
              style={{ zIndex: hex.zIndex }}
            >
              <div className="why-hex-float">
                <RoundedHexagon />
                <div className="why-hex-content">
                  <span className="why-hex-val">{hex.value}</span>
                  <span className="why-hex-lbl">{hex.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
