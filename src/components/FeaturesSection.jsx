import React, { useRef, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Logo3D from './ThreeCanvas/Logo3D'

gsap.registerPlugin(ScrollTrigger)

const allServices = [
  {
    num: '1',
    title: 'Brand Identity',
    subtitle: 'Starting from ₹20,000',
    description: 'Full identity packages including logo design, color systems, typography rules, business stationery, and ready to use social media kits.',
  },
  {
    num: '2',
    title: 'UI/UX Design',
    subtitle: 'Starting from ₹25,000',
    description: 'Clean wireframes, interactive Figma prototypes, and thoughtful user flows for web and mobile apps, crafted to guide visitors into action.',
  },
  {
    num: '3',
    title: 'Web Development',
    subtitle: 'Starting from ₹30,000',
    description: 'Fast, responsive websites built on Webflow, WordPress, or custom code, fully search optimized and fine tuned for instant page loads.',
  },
  {
    num: '4',
    title: 'Digital Marketing',
    subtitle: 'Starting from ₹20,000+ / month',
    description: 'Targeted Google and Meta ad campaigns from creative production and audience targeting to weekly optimization for profitable growth.',
  },
]

function FeatureCard({ service }) {
  return (
    <div className="feat-card">
      <div className="feat-card-head">
        <div className="feat-card-num">{service.num}</div>
        <div className="feat-card-titles">
          <h4 className="feat-card-title">{service.title}</h4>
          <div className="feat-card-sub">{service.subtitle}</div>
        </div>
      </div>
      <p className="feat-card-body">{service.description}</p>
    </div>
  )
}

const arenas = [
  { cards: [allServices[0], allServices[1]], variant: 'a' },
  { cards: [allServices[2], allServices[3]], variant: 'b' },
]

export default function FeaturesSection({ onOpenContact }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: '(min-width: 901px)',
        isMobile: '(max-width: 900px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions
        if (reduceMotion) return

        gsap.utils.toArray('.feat-arena').forEach((arena) => {
          const leftSlot = arena.querySelector('.feat-slot-left')
          const rightSlot = arena.querySelector('.feat-slot-right')
          const logoAnim = arena.querySelector('.feat-logo-anim')

          const tl = gsap.timeline({
            scrollTrigger: { trigger: arena, start: 'top 95%', end: 'top 45%', scrub: 1 },
          })

          if (isDesktop) {
            if (leftSlot) tl.from(leftSlot, { opacity: 0.3, y: 140, x: -70, rotate: -3, ease: 'power2.out' }, 0)
            if (rightSlot) tl.from(rightSlot, { opacity: 0.3, y: 140, x: 70, rotate: 3, ease: 'power2.out' }, 0)
          } else {
            if (leftSlot) tl.from(leftSlot, { opacity: 0.3, y: 60, ease: 'power2.out' }, 0)
            if (rightSlot) tl.from(rightSlot, { opacity: 0.3, y: 60, ease: 'power2.out' }, 0)
          }
          if (logoAnim) tl.from(logoAnim, { scale: 0.7, opacity: 0.4, ease: 'power2.out' }, 0)
        })

        gsap.to('.features-watermark', {
          opacity: 0,
          yPercent: -18,
          scale: 0.94,
          ease: 'none',
          scrollTrigger: { trigger: '.feat-arena', start: 'top 38%', end: 'top -5%', scrub: 1 },
        })
      },
      sectionRef
    )

    return () => mm.revert()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="features-section">
      <div className="features-glow" aria-hidden="true" />

      <div className="features-watermark" aria-hidden="true">Features</div>

      {arenas.map((arena) => (
        <div key={arena.variant} className={`feat-arena feat-arena--${arena.variant}`}>
          <div className="feat-logo-wrap">
            <div className="feat-logo-anim">
              <div className="feat-logo-halo" />
              <Logo3D className="feat-logo3d" />
            </div>
          </div>
          <div className="feat-slot feat-slot-left">
            <FeatureCard service={arena.cards[0]} />
          </div>
          <div className="feat-slot feat-slot-right">
            <FeatureCard service={arena.cards[1]} />
          </div>
        </div>
      ))}

      <div className="feat-footer">
        <button
          onClick={() => {
            window.location.hash = '#services'
          }}
          className="about-cta"
        >
          <span>Explore all Services</span>
          <ArrowUpRight style={{ width: '26px', height: '26px' }} strokeWidth={2.4} />
        </button>
      </div>
    </section>
  )
}
