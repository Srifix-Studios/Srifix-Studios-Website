import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/stacked-cards.css'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    name: 'Elena Marsh',
    role: 'Founder, Northline Finance',
    flagImg: '/figma/flag_finland.png',
    flagAlt: 'Finland',
    quote: 'Srifix rebuilt our entire digital presence in three weeks. Conversion is up 58% and the brand finally feels like us.',
    highlight: 'Conversion is up 58%',
  },
  {
    name: 'Priya Nandakumar',
    role: 'CMO, Loom & Thread',
    flagImg: '/figma/flag_india.png',
    flagAlt: 'India',
    quote: "Every single deliverable felt thoughtful and polished. Quality was simply their natural standard from day one.",
    highlight: 'natural standard from day one',
  },
  {
    name: 'Daniyar Zholdasbayev',
    role: 'Founder, Kinetix AI',
    flagImg: '/figma/flag_ukraine.png',
    flagAlt: 'Ukraine',
    quote: "The custom automation they built paid for itself within six weeks. Their team was clear, communicative, and remarkably reliable.",
    highlight: 'clear, communicative, and remarkably reliable',
  },
]

function Quote({ text, highlight }) {
  const i = highlight ? text.indexOf(highlight) : -1
  if (i < 0) return <span>&ldquo;{text}&rdquo;</span>
  const before = text.slice(0, i)
  const after = text.slice(i + highlight.length)
  return (
    <span>
      &ldquo;{before}<mark className="tv-hl">{highlight}</mark>{after}&rdquo;
    </span>
  )
}

const onCardMove = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--sx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--sy', `${e.clientY - r.top}px`)
}

export default function TestimonialsSection() {
  const sectionRef = useRef(null)
  const card1Ref = useRef(null)
  const card2Ref = useRef(null)
  const card3Ref = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const card1 = card1Ref.current
    const card2 = card2Ref.current
    const card3 = card3Ref.current

    if (!section || !card1 || !card2 || !card3) return

    const mm = gsap.matchMedia()

    // Parallax background drift for atmospheric depth
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        '.tv-bg',
        { yPercent: -5, scale: 1.08 },
        {
          yPercent: 5,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      )
    }, sectionRef)

    // Desktop: 3D zoom cards choreography matching Figma Version 5
    mm.add('(min-width: 861px)', () => {
      // Initial positions: Card 1 is active; Cards 2 & 3 hidden
      gsap.set(card1, { x: 0, y: 0, scale: 1, autoAlpha: 1, zIndex: 10, pointerEvents: 'auto' })
      gsap.set(card2, { x: -80, y: -10, scale: 0.45, autoAlpha: 0, zIndex: 5, pointerEvents: 'none' })
      gsap.set(card3, { x: 90, y: -10, scale: 0.45, autoAlpha: 0, zIndex: 3, pointerEvents: 'none' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      // Reading hold on Card 1
      tl.to({}, { duration: 0.5 })

      // Step 1: Card 1 zooms forward toward camera and vanishes cleanly
      tl.to(
        card1,
        {
          scale: 1.5,
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power2.in',
        },
        'step1'
      )
        .set(card1, { pointerEvents: 'none', zIndex: 1 }, 'step1+=0.4')
        .set(card2, { pointerEvents: 'auto', zIndex: 10 }, 'step1+=0.35')

        // Step 2: Card 2 enters Left Foreground, Card 3 enters Center-Right Background
        .fromTo(
          card2,
          { x: -80, y: -10, scale: 0.45, autoAlpha: 0 },
          {
            x: -240,
            y: 10,
            scale: 1,
            autoAlpha: 1,
            duration: 0.7,
            ease: 'power2.out',
          },
          'step1+=0.35'
        )
        .fromTo(
          card3,
          { x: 90, y: -10, scale: 0.45, autoAlpha: 0 },
          {
            x: 100,
            y: -5,
            scale: 0.54,
            autoAlpha: 0.75,
            duration: 0.7,
            ease: 'power2.out',
          },
          'step1+=0.4'
        )

        // Reading hold on Card 2 (and Card 3 in depth)
        .to({}, { duration: 0.8 })

        // Step 3: Card 2 zooms out left and vanishes cleanly
        .to(
          card2,
          {
            x: -380,
            scale: 1.35,
            autoAlpha: 0,
            duration: 0.45,
            ease: 'power2.in',
          },
          'step2'
        )
        .set(card2, { pointerEvents: 'none', zIndex: 1 }, 'step2+=0.4')
        .set(card3, { pointerEvents: 'auto', zIndex: 12 }, 'step2+=0.35')

        // Card 3 scales up into Right Foreground
        .to(
          card3,
          {
            x: 230,
            y: 15,
            scale: 1.05,
            autoAlpha: 1,
            duration: 0.7,
            ease: 'power2.out',
          },
          'step2+=0.35'
        )

        // Reading hold on Card 3 before section unpins
        .to({}, { duration: 0.8 })
    }, sectionRef)

    // Mobile / Tablet: centered 3D zoom cards choreography with zero overlapping text
    mm.add('(max-width: 860px)', () => {
      gsap.set(card1, { x: 0, y: 0, scale: 1, autoAlpha: 1, zIndex: 10, pointerEvents: 'auto' })
      gsap.set(card2, { x: 0, y: 25, scale: 0.85, autoAlpha: 0, zIndex: 5, pointerEvents: 'none' })
      gsap.set(card3, { x: 0, y: 25, scale: 0.85, autoAlpha: 0, zIndex: 3, pointerEvents: 'none' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      // Reading hold on Card 1
      tl.to({}, { duration: 0.5 })

      // Step 1: Card 1 zooms out and vanishes
      tl.to(
        card1,
        {
          scale: 1.35,
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power2.in',
        },
        'mStep1'
      )
        .set(card1, { pointerEvents: 'none', zIndex: 1 }, 'mStep1+=0.4')
        .set(card2, { pointerEvents: 'auto', zIndex: 10 }, 'mStep1+=0.4')
        .fromTo(
          card2,
          { x: 0, y: 25, scale: 0.85, autoAlpha: 0 },
          {
            x: 0,
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.65,
            ease: 'power2.out',
          },
          'mStep1+=0.4'
        )

        // Reading hold on Card 2
        .to({}, { duration: 0.8 })

        // Step 2: Card 2 zooms out and vanishes
        .to(
          card2,
          {
            scale: 1.35,
            autoAlpha: 0,
            duration: 0.45,
            ease: 'power2.in',
          },
          'mStep2'
        )
        .set(card2, { pointerEvents: 'none', zIndex: 1 }, 'mStep2+=0.4')
        .set(card3, { pointerEvents: 'auto', zIndex: 12 }, 'mStep2+=0.4')
        .fromTo(
          card3,
          { x: 0, y: 25, scale: 0.85, autoAlpha: 0 },
          {
            x: 0,
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.65,
            ease: 'power2.out',
          },
          'mStep2+=0.4'
        )

        // Reading hold on Card 3 before section unpins
        .to({}, { duration: 0.8 })
    }, sectionRef)

    return () => mm.revert()
  }, [])

  return (
    <section id="testimonials" ref={sectionRef} className="tv-section">
      {/* Canyon backdrop + Figma Version 5 blur vignettes */}
      <div className="tv-backdrop" aria-hidden="true">
        <img src="/figma/canyon_bg.png" alt="" className="tv-bg" draggable="false" />
        <div className="tv-vignette-top" />
        <div className="tv-portal-glow" />
        <div className="tv-vignette-bottom" />
      </div>

      {/* Figma Version 5 Vector Watermark */}
      <div className="tv-watermark-wrap" aria-hidden="true">
        <img
          src="/figma/client_review_watermark.svg"
          alt=""
          className="tv-watermark-svg"
          draggable="false"
        />
      </div>

      <div className="tv-inner">
        <h2 className="tv-headline">
          Trusted <span className="tv-accent">Worldwide</span>
        </h2>

        {/* 3D Zoom Cards Stage */}
        <div className="tv-stage">
          {/* Card 1: Elena Marsh */}
          <figure
            ref={card1Ref}
            className="tv-card card-1"
            onPointerMove={onCardMove}
          >
            <span className="tv-spot" aria-hidden="true" />
            <header className="tv-card-head">
              <div className="tv-card-flag">
                <img
                  src={testimonials[0].flagImg}
                  alt={testimonials[0].flagAlt}
                  className="tv-flag-img"
                  draggable="false"
                />
              </div>
              <div className="tv-card-who">
                <h3 className="tv-card-name">{testimonials[0].name}</h3>
                <p className="tv-card-role">{testimonials[0].role}</p>
              </div>
            </header>
            <div className="tv-card-body">
              <div className="tv-stars" role="img" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((n) => (
                  <span key={n} className="tv-star" style={{ '--n': n }}>★</span>
                ))}
              </div>
              <blockquote className="tv-quote">
                <Quote text={testimonials[0].quote} highlight={testimonials[0].highlight} />
              </blockquote>
            </div>
          </figure>

          {/* Card 2: Priya Nandakumar */}
          <figure
            ref={card2Ref}
            className="tv-card card-2"
            onPointerMove={onCardMove}
          >
            <span className="tv-spot" aria-hidden="true" />
            <header className="tv-card-head">
              <div className="tv-card-flag">
                <img
                  src={testimonials[1].flagImg}
                  alt={testimonials[1].flagAlt}
                  className="tv-flag-img"
                  draggable="false"
                />
              </div>
              <div className="tv-card-who">
                <h3 className="tv-card-name">{testimonials[1].name}</h3>
                <p className="tv-card-role">{testimonials[1].role}</p>
              </div>
            </header>
            <div className="tv-card-body">
              <div className="tv-stars" role="img" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((n) => (
                  <span key={n} className="tv-star" style={{ '--n': n }}>★</span>
                ))}
              </div>
              <blockquote className="tv-quote">
                <Quote text={testimonials[1].quote} highlight={testimonials[1].highlight} />
              </blockquote>
            </div>
          </figure>

          {/* Card 3: Daniyar Zholdasbayev */}
          <figure
            ref={card3Ref}
            className="tv-card card-3"
            onPointerMove={onCardMove}
          >
            <span className="tv-spot" aria-hidden="true" />
            <header className="tv-card-head">
              <div className="tv-card-flag">
                <img
                  src={testimonials[2].flagImg}
                  alt={testimonials[2].flagAlt}
                  className="tv-flag-img"
                  draggable="false"
                />
              </div>
              <div className="tv-card-who">
                <h3 className="tv-card-name">{testimonials[2].name}</h3>
                <p className="tv-card-role">{testimonials[2].role}</p>
              </div>
            </header>
            <div className="tv-card-body">
              <div className="tv-stars" role="img" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((n) => (
                  <span key={n} className="tv-star" style={{ '--n': n }}>★</span>
                ))}
              </div>
              <blockquote className="tv-quote">
                <Quote text={testimonials[2].quote} highlight={testimonials[2].highlight} />
              </blockquote>
            </div>
          </figure>
        </div>
      </div>
    </section>
  )
}

export { TestimonialsSection as ClientReviewSection }
