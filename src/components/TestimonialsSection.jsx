import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    name: 'Elena Marsh',
    role: 'Founder, Northline Finance',
    flag: 'fi',
    quote: 'Srifix rebuilt our entire digital presence in three weeks. Conversion is up 58% and the brand finally feels like us.',
    highlight: 'Conversion is up 58%',
  },
  {
    name: 'Priya Nandakumar',
    role: 'CMO, Loom & Thread',
    flag: 'in',
    quote: "Every deliverable felt like an Awwwards case study. Premium isn't a buzzword for this team — it's the baseline.",
    highlight: "it's the baseline",
  },
  {
    name: 'Daniyar Zholdasbayev',
    role: 'Founder, Northline Finance',
    flag: 'ua',
    quote: "The AI chatbot alone paid for the engagement in six weeks. Their process is the most disciplined I've worked with.",
    highlight: 'paid for the engagement in six weeks',
  },
]

function Flag({ code }) {
  if (code === 'fi') {
    return (
      <svg viewBox="0 0 18 11" className="tv-flag" aria-label="Finland">
        <rect width="18" height="11" fill="#FFFFFF" />
        <rect x="5" width="3" height="11" fill="#1B3F8B" />
        <rect y="4" width="18" height="3" fill="#1B3F8B" />
      </svg>
    )
  }
  if (code === 'in') {
    return (
      <svg viewBox="0 0 18 12" className="tv-flag" aria-label="India">
        <rect width="18" height="4" fill="#FF9933" />
        <rect y="4" width="18" height="4" fill="#FFFFFF" />
        <rect y="8" width="18" height="4" fill="#138808" />
        <circle cx="9" cy="6" r="1.5" fill="none" stroke="#000080" strokeWidth="0.4" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 18 12" className="tv-flag" aria-label="Ukraine">
      <rect width="18" height="6" fill="#0057B7" />
      <rect y="6" width="18" height="6" fill="#FFD700" />
    </svg>
  )
}

// Quote with its key result highlighted
function Quote({ text, highlight }) {
  const i = highlight ? text.indexOf(highlight) : -1
  if (i < 0) return <>"{text}"</>
  return (
    <>
      "{text.slice(0, i)}
      <mark className="tv-hl">{highlight}</mark>
      {text.slice(i + highlight.length)}"
    </>
  )
}

// Cursor spotlight on a card
const onCardMove = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--sx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--sy', `${e.clientY - r.top}px`)
}

export default function TestimonialsSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    const section = sectionRef.current

    // Switching between the desktop and phone layouts (window resize, DevTools) must start
    // from clean elements: the desktop sequence hides the canyon/headline/cards up front and
    // GSAP does not fully restore those inline styles when that layout is torn down.
    const resetLayout = () => {
      gsap.killTweensOf(section.querySelectorAll('.tv-watermark, .tv-backdrop, .tv-headline, .tv-card'))
      gsap.set(section.querySelectorAll('.tv-watermark, .tv-backdrop, .tv-headline, .tv-card'), {
        clearProps: 'transform,opacity,translate,rotate,scale',
      })
      section.querySelector('.tv-cards').classList.remove('stars-pending', 'is-rated')
    }

    // Background drifts slower than the page for depth (all sizes)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.tv-bg', { yPercent: -5, scale: 1.08 }, {
        yPercent: 5,
        scale: 1.02,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    }, sectionRef)

    // Phones / tablets: simple version (stacked cards, no pin)
    mm.add('(prefers-reduced-motion: no-preference) and (max-width: 900px)', () => {
      resetLayout()
      const starsBox = section.querySelector('.tv-cards')
      starsBox.classList.add('stars-pending')
      ScrollTrigger.create({
        trigger: starsBox,
        start: 'top 70%',
        onEnter: () => starsBox.classList.add('is-rated'),
        onLeaveBack: () => starsBox.classList.remove('is-rated'),
      })
      gsap.to('.tv-watermark', {
        opacity: 0,
        yPercent: -18,
        scale: 0.94,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: () => '+=' + window.innerHeight * 0.45, scrub: 1 },
      })
      gsap.from('.tv-card', {
        opacity: 0,
        scale: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.tv-cards', start: 'top 100%', end: 'top 68%', scrub: 1 },
      })
    }, sectionRef)

    // Desktop: one pinned sequence
    //   1. only "Client Review" on a dark screen
    //   2. zoom through the text -> the canyon opens up
    //   3. headline arrives, cards fly out of the portal, short read pause
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 901px)', () => {
      resetLayout()
      const watermark = section.querySelector('.tv-watermark')
      const backdrop = section.querySelector('.tv-backdrop')
      const headline = section.querySelector('.tv-headline')
      const cards = section.querySelectorAll('.tv-card')
      // Stars start dim and light up once the cards land
      const starsBox = section.querySelector('.tv-cards')
      starsBox.classList.add('stars-pending')

      // Shift that puts the watermark in the vertical centre of the screen
      const wmCentre = () => window.innerHeight / 2 - (watermark.offsetTop + watermark.offsetHeight / 2)

      const tl = gsap.timeline({
        defaults: { immediateRender: false },
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 2.05,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      // Offset that puts a card's centre on the portal glow in the background image
      // (portal sits at ~50% across, ~36% down the section)
      const fromPortal = (el) => {
        let x = 0, y = 0, n = el
        while (n && n !== section) {
          x += n.offsetLeft
          y += n.offsetTop
          n = n.offsetParent
        }
        return {
          x: section.offsetWidth * 0.5 - (x + el.offsetWidth / 2),
          y: section.offsetHeight * 0.36 - (y + el.offsetHeight / 2),
        }
      }

      // Initial state: text only; cards wait, tiny, inside the portal
      tl.set(watermark, { y: wmCentre, immediateRender: true }, 0)
        .set(backdrop, { opacity: 0, scale: 1.25, immediateRender: true }, 0)
        .set(headline, { opacity: 0, scale: 0.8, immediateRender: true }, 0)
        .set(cards, {
          x: (i, el) => fromPortal(el).x,
          y: (i, el) => fromPortal(el).y,
          scale: 0.06,
          opacity: 0,
          immediateRender: true,
        }, 0)

      // 2. Zoom through "Client Review"; the canyon opens behind it
        .to(watermark, { scale: 7, opacity: 0, ease: 'power2.in', duration: 0.45 }, 0.2)
        .to(backdrop, { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.45 }, 0.4)

      // 3. Headline arrives, then the cards fly out of the portal one by one
        .to(headline, { opacity: 1, scale: 1, ease: 'power3.out', duration: 0.3 }, 0.55)
        .to(cards, { x: 0, y: 0, scale: 1, stagger: 0.16, ease: 'power2.out', duration: 0.45 }, 0.68)
        .to(cards, { opacity: 1, stagger: 0.16, ease: 'none', duration: 0.12 }, 0.68)
        // Stars light up one by one once the cards have landed (and switch off on scroll back)
        .add(() => starsBox.classList.toggle('is-rated', tl.scrollTrigger.direction === 1), 1.4)
        .to({}, { duration: 0.35 }) // read pause
    }, sectionRef)

    return () => mm.revert()
  }, [])

  return (
    <section id="testimonials" ref={sectionRef} className="tv-section">
      {/* Canyon + portal backdrop */}
      <div className="tv-backdrop" aria-hidden="true">
        <img src="/client-voice-canyon.webp" alt="" className="tv-bg" draggable="false" />
        <div className="tv-portal-glow" />
      </div>

      {/* Giant "Client Review" watermark, fades out on scroll */}
      <div className="tv-watermark" aria-hidden="true">Client Review</div>

      <div className="tv-inner">
        <h2 className="tv-headline">
          Trusted <span className="tv-accent">Worldwide</span>
        </h2>

        <div className="tv-cards">
          {testimonials.map((t) => (
            <figure key={t.name} className="tv-card" onPointerMove={onCardMove}>
              <span className="tv-spot" aria-hidden="true" />
              <span className="tv-qmark" aria-hidden="true">“</span>
              <header className="tv-card-head">
                <div className="tv-card-flag"><Flag code={t.flag} /></div>
                <div className="tv-card-who">
                  <div className="tv-card-name">{t.name}</div>
                  <div className="tv-card-role">{t.role}</div>
                </div>
              </header>
              <div className="tv-card-body">
                <div className="tv-stars" role="img" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <span key={n} className="tv-star" style={{ '--n': n }}>★</span>
                  ))}
                </div>
                <blockquote className="tv-quote">
                  <Quote text={t.quote} highlight={t.highlight} />
                </blockquote>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
