import React, { useRef, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Logo3D from './ThreeCanvas/Logo3D'

gsap.registerPlugin(ScrollTrigger)

// Services + starting prices from the "Srifix Studios — Services & Pricing" deck
const allServices = [
  {
    num: '1',
    title: 'Brand Identity',
    subtitle: 'Starting from ₹20,000',
    description: 'Logo, brand style guide, colour palette and typography — a complete identity system, delivered with business cards and a social media kit.',
  },
  {
    num: '2',
    title: 'UI/UX Design',
    subtitle: 'Starting from ₹25,000',
    description: 'Wireframes, Figma prototypes, UI flows and user-journey mapping for websites and mobile apps — intuitive, elegant and built to convert.',
  },
  {
    num: '3',
    title: 'Web Development',
    subtitle: 'Starting from ₹30,000',
    description: 'Modern, responsive websites on WordPress, Webflow or fully custom code — SEO-friendly from day one and optimised for speed.',
  },
  {
    num: '4',
    title: 'Digital Marketing',
    subtitle: 'Starting from ₹20,000+ / month',
    description: 'Google and Meta ad campaigns set up and managed end to end — with ad creatives, audience research and ongoing ROAS optimisation.',
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

// Two showcases, as in the design: [1 top-left, 2 bottom-right], then [3 mid-left, 4 bottom-right]
const arenas = [
  { cards: [allServices[0], allServices[1]], variant: 'a' },
  { cards: [allServices[2], allServices[3]], variant: 'b' },
]

export default function FeaturesSection({ onOpenContact }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Each showcase: cards + logo arrive as it enters the viewport
      gsap.utils.toArray('.feat-arena').forEach((arena) => {
        gsap.timeline({
          scrollTrigger: { trigger: arena, start: 'top 95%', end: 'top 45%', scrub: 1 },
        })
          .from(arena.querySelector('.feat-slot-left'), { opacity: 0.3, y: 140, x: -70, rotate: -3, ease: 'power2.out' }, 0)
          .from(arena.querySelector('.feat-slot-right'), { opacity: 0.3, y: 140, x: 70, rotate: 3, ease: 'power2.out' }, 0)
          .from(arena.querySelector('.feat-logo-anim'), { scale: 0.7, opacity: 0.4, ease: 'power2.out' }, 0)
      })

      // "Features" stays fully visible first, then fades once the user scrolls on past it
      gsap.to('.features-watermark', {
        opacity: 0,
        yPercent: -18,
        scale: 0.94,
        ease: 'none',
        scrollTrigger: { trigger: '.feat-arena', start: 'top 38%', end: 'top -5%', scrub: 1 },
      })
    }, sectionRef)

    return () => mm.revert()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="features-section">
      <div className="features-glow" aria-hidden="true" />

      {/* Giant "Features" watermark, fades out on scroll */}
      <div className="features-watermark" aria-hidden="true">Features</div>

      {arenas.map((arena) => (
        <div key={arena.variant} className={`feat-arena feat-arena--${arena.variant}`}>
          {/* Interactive 3D brand mark: auto-rotates, tilts to the pointer, drag to spin */}
          <div className="feat-logo-wrap">
            {/* Inner layer takes the scroll animation, so GSAP never touches the wrapper's centring */}
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
        <button onClick={onOpenContact} className="about-cta">
          <span>Explore all Services</span>
          <ArrowUpRight style={{ width: '26px', height: '26px' }} strokeWidth={2.4} />
        </button>
      </div>
    </section>
  )
}
