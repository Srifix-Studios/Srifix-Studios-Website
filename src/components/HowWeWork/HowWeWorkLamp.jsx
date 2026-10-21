import React, { useRef, useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { workflowSteps } from '../../data/workflow'
import '../../styles/howwework.css'

gsap.registerPlugin(ScrollTrigger)

const AIM_CONFIG = {
  '1': {
    ropeRot: '22deg',
    shadeRot: '36deg',
    haloX: '18%',
    haloY: '34%',
  },
  '2': {
    ropeRot: '15deg',
    shadeRot: '24deg',
    haloX: '36%',
    haloY: '64%',
  },
  '3': {
    ropeRot: '8deg',
    shadeRot: '12deg',
    haloX: '60%',
    haloY: '34%',
  },
  '4': {
    ropeRot: '-2deg',
    shadeRot: '-4deg',
    haloX: '81%',
    haloY: '64%',
  },
  default: {
    ropeRot: '0deg',
    shadeRot: '0deg',
    haloX: '78%',
    haloY: '52%',
  },
}

export default function HowWeWorkLamp() {
  const [lit, setLit] = useState(false)
  const [pulled, setPulled] = useState(false)
  const [activeStep, setActiveStep] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)

  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const cordRef = useRef(null)
  const litRef = useRef(false)
  litRef.current = lit

  const swing = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    gsap.fromTo(
      stage,
      { '--rope-rot': '10deg', '--shade-rot': '14deg' },
      {
        '--rope-rot': '0deg',
        '--shade-rot': '0deg',
        duration: 2.2,
        ease: 'elastic.out(1.1, 0.28)',
        overwrite: 'auto',
      }
    )
  }, [])

  const aimLamp = useCallback((cardKey) => {
    const conf = AIM_CONFIG[cardKey] || AIM_CONFIG.default
    const stage = stageRef.current
    if (!stage) return

    gsap.to(stage, {
      '--rope-rot': conf.ropeRot,
      '--shade-rot': conf.shadeRot,
      '--halo-x': conf.haloX,
      '--halo-y': conf.haloY,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }, [])

  const handleCardEnter = (cardNum) => {
    setHoveredCard(cardNum)
    if (litRef.current) {
      aimLamp(cardNum)
    }
  }

  const handleCardLeave = () => {
    setHoveredCard(null)
    if (litRef.current && activeStep) {
      aimLamp(activeStep)
    } else if (litRef.current) {
      aimLamp('default')
    }
  }

  const toggleLamp = () => {
    setLit((prev) => {
      const next = !prev
      if (next) {
        swing()
        gsap.to('.hw4-bulb-glow', { opacity: 1, duration: 0.2, overwrite: 'auto' })
        gsap.to('.hw4-beam-group', { opacity: 1, duration: 0.3, overwrite: 'auto' })
        gsap.to('.hw4-spotlight-bloom', { opacity: 1, duration: 0.35, overwrite: 'auto' })
        gsap.to('.hw4-dashed-path', { opacity: 0.85, duration: 0.3, overwrite: 'auto' })
        gsap.to('.hw4-card--1', { opacity: 1, y: 0, duration: 0.35, overwrite: 'auto' })
        gsap.to('.hw4-watermark-title', { opacity: 0.25, duration: 0.3, overwrite: 'auto' })
        gsap.to('.hw4-orbit-rings', { opacity: 0.35, duration: 0.3, overwrite: 'auto' })
        aimLamp('1')
        setActiveStep('1')
      } else {
        gsap.to('.hw4-bulb-glow', { opacity: 0, duration: 0.2, overwrite: 'auto' })
        gsap.to('.hw4-beam-group', { opacity: 0, duration: 0.2, overwrite: 'auto' })
        gsap.to('.hw4-spotlight-bloom', { opacity: 0, duration: 0.2, overwrite: 'auto' })
        gsap.to('.hw4-dashed-path', { opacity: 0, duration: 0.2, overwrite: 'auto' })
        gsap.to('.hw4-card', { opacity: 0, y: 15, duration: 0.2, overwrite: 'auto' })
        gsap.to('.hw4-watermark-title', { opacity: 0, duration: 0.2, overwrite: 'auto' })
        gsap.to('.hw4-orbit-rings', { opacity: 0, duration: 0.2, overwrite: 'auto' })
        setHoveredCard(null)
        setActiveStep(null)
      }
      return next
    })
    setPulled(true)
  }

  useEffect(() => {
    const section = sectionRef.current
    const cord = cordRef.current
    const stage = stageRef.current
    if (!section || !cord || !stage) return

    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: '(min-width: 901px)',
        isMobile: '(max-width: 900px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions

        if (reduceMotion) {
          setLit(true)
          gsap.set(
            [
              '.hw4-bulb-glow',
              '.hw4-beam-group',
              '.hw4-spotlight-bloom',
              '.hw4-dashed-path',
              '.hw4-card',
              '.hw4-watermark-title',
              '.hw4-orbit-rings',
            ],
            { opacity: 1, y: 0 }
          )
          return
        }

        gsap.set('.hw4-bulb-glow', { opacity: 0 })
        gsap.set('.hw4-beam-group', { opacity: 0 })
        gsap.set('.hw4-spotlight-bloom', { opacity: 0 })
        gsap.set('.hw4-dashed-path', { opacity: 0 })
        gsap.set('.hw4-card', { opacity: 0, y: 15 })
        gsap.set('.hw4-watermark-title', { opacity: 0 })
        gsap.set('.hw4-orbit-rings', { opacity: 0 })
        gsap.set(cord, { '--pull': '0px' })
        gsap.set(stage, {
          '--rope-rot': '0deg',
          '--shade-rot': '0deg',
          '--halo-x': AIM_CONFIG['1'].haloX,
          '--halo-y': AIM_CONFIG['1'].haloY,
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: isDesktop ? '+=3400' : '+=2600',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress
              const isCurrentlyLit = p >= 0.04 && p <= 0.92
              if (litRef.current !== isCurrentlyLit) {
                setLit(isCurrentlyLit)
                if (isCurrentlyLit) setPulled(true)
              }

              if (p < 0.04) setActiveStep(null)
              else if (p < 0.23) setActiveStep('1')
              else if (p < 0.45) setActiveStep('2')
              else if (p < 0.67) setActiveStep('3')
              else if (p <= 0.89) setActiveStep('4')
              else setActiveStep(null)
            },
          },
        })

        tl.to(cord, { '--pull': '46px', duration: 0.035, ease: 'power1.inOut' }, 0)
          .to(cord, { '--pull': '0px', duration: 0.025, ease: 'elastic.out(1.2, 0.4)' }, 0.035)
          .to(
            stage,
            {
              '--rope-rot': AIM_CONFIG['1'].ropeRot,
              '--shade-rot': AIM_CONFIG['1'].shadeRot,
              '--halo-x': AIM_CONFIG['1'].haloX,
              '--halo-y': AIM_CONFIG['1'].haloY,
              duration: 0.05,
              ease: 'power2.out',
            },
            0.04
          )
          .to('.hw4-bulb-glow', { opacity: 1, duration: 0.04, ease: 'power2.out' }, 0.04)
          .to('.hw4-beam-group', { opacity: 1, duration: 0.04, ease: 'power2.out' }, 0.04)
          .to('.hw4-spotlight-bloom', { opacity: 1, duration: 0.04, ease: 'power2.out' }, 0.04)
          .to('.hw4-watermark-title', { opacity: 0.25, duration: 0.04, ease: 'power2.out' }, 0.04)
          .to('.hw4-dashed-path', { opacity: 0.85, duration: 0.04, ease: 'power2.out' }, 0.04)
          .to('.hw4-orbit-rings', { opacity: 0.35, duration: 0.04, ease: 'power2.out' }, 0.04)
          .fromTo(
            '.hw4-card--1',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' },
            0.05
          )
          .to({}, { duration: 0.13 }, 0.10)

        tl.to('.hw4-card--1', { opacity: 0, y: -10, duration: 0.04, ease: 'power2.in' }, 0.23)
          .to(
            stage,
            {
              '--rope-rot': AIM_CONFIG['2'].ropeRot,
              '--shade-rot': AIM_CONFIG['2'].shadeRot,
              '--halo-x': AIM_CONFIG['2'].haloX,
              '--halo-y': AIM_CONFIG['2'].haloY,
              duration: 0.06,
              ease: 'power2.inOut',
            },
            0.23
          )
          .fromTo(
            '.hw4-card--2',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' },
            0.27
          )
          .to({}, { duration: 0.13 }, 0.32)

        tl.to('.hw4-card--2', { opacity: 0, y: -10, duration: 0.04, ease: 'power2.in' }, 0.45)
          .to(
            stage,
            {
              '--rope-rot': AIM_CONFIG['3'].ropeRot,
              '--shade-rot': AIM_CONFIG['3'].shadeRot,
              '--halo-x': AIM_CONFIG['3'].haloX,
              '--halo-y': AIM_CONFIG['3'].haloY,
              duration: 0.06,
              ease: 'power2.inOut',
            },
            0.45
          )
          .fromTo(
            '.hw4-card--3',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' },
            0.49
          )
          .to({}, { duration: 0.13 }, 0.54)

        tl.to('.hw4-card--3', { opacity: 0, y: -10, duration: 0.04, ease: 'power2.in' }, 0.67)
          .to(
            stage,
            {
              '--rope-rot': AIM_CONFIG['4'].ropeRot,
              '--shade-rot': AIM_CONFIG['4'].shadeRot,
              '--halo-x': AIM_CONFIG['4'].haloX,
              '--halo-y': AIM_CONFIG['4'].haloY,
              duration: 0.06,
              ease: 'power2.inOut',
            },
            0.67
          )
          .fromTo(
            '.hw4-card--4',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' },
            0.71
          )
          .to({}, { duration: 0.13 }, 0.76)

        tl.to(cord, { '--pull': '36px', duration: 0.03, ease: 'power1.inOut' }, 0.89)
          .to(cord, { '--pull': '0px', duration: 0.02, ease: 'elastic.out(1.2, 0.4)' }, 0.92)
          .to('.hw4-card--4', { opacity: 0, y: -10, duration: 0.04, ease: 'power2.in' }, 0.89)
          .to(
            [
              '.hw4-bulb-glow',
              '.hw4-beam-group',
              '.hw4-spotlight-bloom',
              '.hw4-watermark-title',
              '.hw4-dashed-path',
              '.hw4-orbit-rings',
            ],
            { opacity: 0, duration: 0.04, ease: 'power2.in' },
            0.91
          )
          .to(
            stage,
            {
              '--rope-rot': '0deg',
              '--shade-rot': '0deg',
              duration: 0.05,
            },
            0.91
          )
          .to({}, { duration: 0.04 }, 0.96)
      },
      sectionRef
    )

    return () => mm.revert()
  }, [aimLamp])

  const isCardSpotlight = (cardNum) => {
    if (!lit) return false
    if (hoveredCard) return hoveredCard === cardNum
    return activeStep === cardNum
  }

  return (
    <section
      id="how-we-work"
      ref={sectionRef}
      className={`hw4 ${lit ? 'is-on' : ''}`}
      aria-label="How We Work Process"
    >
      <div className="hw4-stage" ref={stageRef}>
        <h2 className="hw4-watermark-title" aria-hidden="true">
          How We Work
        </h2>

        <svg
          className="hw4-orbit-rings"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <ellipse
            cx="720"
            cy="460"
            rx="660"
            ry="240"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.2"
          />
          <ellipse
            cx="720"
            cy="460"
            rx="820"
            ry="310"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
          <line
            x1="220"
            y1="100"
            x2="1220"
            y2="820"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
        </svg>

        <svg
          className="hw4-dashed-path"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M 340 300 C 410 320, 340 540, 440 560 C 560 580, 640 280, 725 280 C 880 280, 970 540, 1070 560 C 1140 580, 1260 520, 1310 460"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeDasharray="9 11"
            strokeLinecap="round"
          />
        </svg>

        <div className="hw4-spotlight-bloom" aria-hidden="true" />

        <div className="hw4-lamp-anchor">
          <div className="hw4-rope-pivot">
            <svg viewBox="0 0 280 440" className="hw4-rope-svg" aria-hidden="true">
              <defs>
                <linearGradient id="hw4CableGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1E2A38" />
                  <stop offset="50%" stopColor="#3D5A80" />
                  <stop offset="100%" stopColor="#141E28" />
                </linearGradient>
              </defs>
              <rect x="137" y="0" width="3" height="198" fill="url(#hw4CableGrad)" />
            </svg>

            <div className="hw4-shade-pivot">
              <svg
                viewBox="0 0 280 440"
                className="hw4-lamp-svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="hw4SocketGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0E1D2D" />
                    <stop offset="25%" stopColor="#244569" />
                    <stop offset="45%" stopColor="#6CA0DC" />
                    <stop offset="70%" stopColor="#1B3450" />
                    <stop offset="100%" stopColor="#0A1522" />
                  </linearGradient>

                  <linearGradient id="hw4CollarGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0B1724" />
                    <stop offset="20%" stopColor="#1C3857" />
                    <stop offset="42%" stopColor="#5B8EC9" />
                    <stop offset="68%" stopColor="#162D46" />
                    <stop offset="100%" stopColor="#08101A" />
                  </linearGradient>

                  <radialGradient id="hw4RivetGrad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#E2EEFC" />
                    <stop offset="45%" stopColor="#8BB8E8" />
                    <stop offset="100%" stopColor="#1E3854" />
                  </radialGradient>

                  <radialGradient id="hw4ShadeGlow" cx="48%" cy="75%" r="65%">
                    <stop offset="0%" stopColor="#1E3D62" />
                    <stop offset="40%" stopColor="#0E2137" />
                    <stop offset="75%" stopColor="#071320" />
                    <stop offset="100%" stopColor="#03080F" />
                  </radialGradient>

                  <linearGradient id="hw4ShadeHighlight" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06111D" stopOpacity="0.9" />
                    <stop offset="22%" stopColor="#1B3C61" stopOpacity="0.95" />
                    <stop offset="38%" stopColor="#4C84BE" stopOpacity="0.85" />
                    <stop offset="46%" stopColor="#8EC1F2" stopOpacity="0.9" />
                    <stop offset="55%" stopColor="#224872" stopOpacity="0.9" />
                    <stop offset="80%" stopColor="#0D2034" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#040B13" stopOpacity="1" />
                  </linearGradient>

                  <linearGradient id="hw4RimStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1B3550" />
                    <stop offset="28%" stopColor="#5E96CE" />
                    <stop offset="48%" stopColor="#A2CDFA" />
                    <stop offset="70%" stopColor="#3A6C9E" />
                    <stop offset="100%" stopColor="#102336" />
                  </linearGradient>

                  <radialGradient id="hw4BulbOff" cx="50%" cy="40%" r="55%">
                    <stop offset="0%" stopColor="#D9E6F5" />
                    <stop offset="50%" stopColor="#91ADC8" />
                    <stop offset="85%" stopColor="#4B6682" />
                    <stop offset="100%" stopColor="#213448" />
                  </radialGradient>

                  <radialGradient id="hw4BulbLit" cx="50%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="18%" stopColor="#FFF4E6" />
                    <stop offset="40%" stopColor="#FFC588" />
                    <stop offset="65%" stopColor="#FFA033" />
                    <stop offset="85%" stopColor="#F07108" />
                    <stop offset="100%" stopColor="#C95400" />
                  </radialGradient>

                  <filter id="hw4OrangeBulbGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#FFA033" floodOpacity="0.70" />
                    <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#F07108" floodOpacity="0.50" />
                  </filter>

                  <linearGradient id="hw4HandleGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#BAC4D1" />
                    <stop offset="35%" stopColor="#FFFFFF" />
                    <stop offset="70%" stopColor="#E2E8F0" />
                    <stop offset="100%" stopColor="#8E9AA8" />
                  </linearGradient>

                  <linearGradient id="hw4VolumetricBeam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
                    <stop offset="4%" stopColor="#FFEAD4" stopOpacity="0.40" />
                    <stop offset="12%" stopColor="#FFA033" stopOpacity="0.25" />
                    <stop offset="30%" stopColor="#F07108" stopOpacity="0.14" />
                    <stop offset="60%" stopColor="#D95800" stopOpacity="0.05" />
                    <stop offset="85%" stopColor="#9C3A00" stopOpacity="0.015" />
                    <stop offset="100%" stopColor="#5E2000" stopOpacity="0" />
                  </linearGradient>

                  <filter id="hw4BeamFeather" x="-50%" y="-20%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="12" />
                  </filter>

                  <radialGradient id="hw4MouthFlare" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
                    <stop offset="30%" stopColor="#FFEAD4" stopOpacity="0.40" />
                    <stop offset="65%" stopColor="#FFA033" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#F07108" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <g className="hw4-beam-group">
                  <path
                    d="M 17 319.5
                       C 50 324.5, 227 324.5, 260 319.5
                       L 680 1480
                       L -400 1480
                       Z"
                    fill="url(#hw4VolumetricBeam)"
                    filter="url(#hw4BeamFeather)"
                  />
                  <ellipse cx="138.5" cy="320" rx="118" ry="7" fill="url(#hw4MouthFlare)" filter="blur(4px)" />
                </g>

                <path d="M 136 190 L 141 190 L 142.5 200 L 134.5 200 Z" fill="#182738" />
                <rect x="134" y="198" width="9" height="4" rx="1.5" fill="#2E4D70" />

                <rect x="122" y="202" width="33" height="34" rx="6" fill="url(#hw4SocketGrad)" />
                <line
                  x1="131"
                  y1="204"
                  x2="131"
                  y2="234"
                  stroke="#8EC1F2"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.9"
                />

                <path d="M 98 236 L 179 236 L 184 250 L 93 250 Z" fill="url(#hw4CollarGrad)" />
                <circle cx="102" cy="243" r="4" fill="url(#hw4RivetGrad)" stroke="#0A1624" strokeWidth="0.8" />
                <circle cx="175" cy="243" r="4" fill="url(#hw4RivetGrad)" stroke="#0A1624" strokeWidth="0.8" />

                <ellipse cx="138.5" cy="317" rx="22" ry="10" fill="url(#hw4BulbOff)" opacity="0.85" />

                <g className="hw4-bulb-glow">
                  <ellipse cx="138.5" cy="318" rx="34" ry="15" fill="rgba(240, 113, 8, 0.25)" filter="blur(10px)" />
                  <ellipse
                    cx="138.5"
                    cy="317"
                    rx="22"
                    ry="11"
                    fill="url(#hw4BulbLit)"
                    filter="url(#hw4OrangeBulbGlow)"
                  />
                  <ellipse cx="138.5" cy="316" rx="14" ry="6" fill="#FFFFFF" />
                </g>

                <path
                  d="M 97 250
                     C 95 264, 48 300, 20 314
                     C 14 316.5, 13 318, 17 319.5
                     C 46 324, 231 324, 260 319.5
                     C 264 318, 263 316.5, 257 314
                     C 229 300, 182 264, 180 250
                     Z"
                  fill="url(#hw4ShadeGlow)"
                />
                <path
                  d="M 97 250
                     C 95 264, 48 300, 20 314
                     C 14 316.5, 13 318, 17 319.5
                     C 46 324, 231 324, 260 319.5
                     C 264 318, 263 316.5, 257 314
                     C 229 300, 182 264, 180 250
                     Z"
                  fill="url(#hw4ShadeHighlight)"
                />

                <path
                  d="M 17 319.5 C 50 324.5, 227 324.5, 260 319.5"
                  stroke="url(#hw4RimStroke)"
                  strokeWidth="2.6"
                  fill="none"
                  strokeLinecap="round"
                />
                <ellipse cx="138.5" cy="319" rx="114" ry="5" fill="#040910" opacity="0.8" />
              </svg>

              <button
                ref={cordRef}
                type="button"
                className={`hw4-cord ${pulled ? 'was-pulled' : ''}`}
                aria-label={lit ? 'Click to turn off lamp' : 'Click to turn on lamp'}
                onClick={toggleLamp}
              >
                <span className="hw4-cord-sway">
                  <span className="hw4-cord-line" />
                  <span className="hw4-cord-knob" />
                </span>
                <span className="hw4-click-badge" aria-hidden="true">
                  Click Here
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="hw4-constellation">
          {workflowSteps.map((step) => {
            const isSpotlight = isCardSpotlight(step.num)
            return (
              <article
                key={step.num}
                className={`hw4-card hw4-card--${step.num} ${
                  isSpotlight ? 'hw4-card--spotlight' : ''
                }`}
                onMouseEnter={() => handleCardEnter(step.num)}
                onMouseLeave={handleCardLeave}
              >
                <div className="hw4-card-header">
                  <span className="hw4-card-num-box">{step.num}</span>
                  <h3 className="hw4-card-title">{step.title}</h3>
                </div>
                <div className="hw4-card-divider" />
                <p className="hw4-card-desc">{step.desc}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
