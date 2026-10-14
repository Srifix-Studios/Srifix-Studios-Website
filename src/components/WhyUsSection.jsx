import React, { useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const featuresList = [
  'Global delivery team',
  'Fixed, transparent pricing',
  'AI-accelerated workflows',
  'Post-launch support',
]

// `from` is the direction each hexagon flies in from
const hexagonsData = [
  { id: 'top', value: '48h', label: 'Avg. first response', from: { y: -120 } },
  { id: 'left', value: '6', label: 'Delivery regions', from: { x: -160 } },
  { id: 'right', value: '18', label: 'Services offered', from: { x: 160 } },
  { id: 'bottom', value: '100%', label: 'Remote-first', from: { y: 140 } },
]

export default function WhyUsSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // "Why Us" is fully visible first; as the hexagons scroll up into view it fades away.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.why-hexes',
          start: 'top 85%',
          end: 'top 30%',
          scrub: 0.6,
        },
      })

      tl.to('.why-watermark', { opacity: 0, yPercent: -18, scale: 0.94, ease: 'none' }, 0)

      hexagonsData.forEach((hex, i) => {
        tl.from(`.why-hex--${hex.id}`, { ...hex.from, opacity: 0, scale: 0.85, ease: 'power2.out' }, i * 0.08)
      })

      // Numbers count up from 0 the first time the cluster comes into view
      const counters = gsap.utils.toArray('.why-hex-value').map((el) => {
        // Read the target from data-value (textContent may already be reset to 0 on a re-run)
        const [, num, suffix] = el.dataset.value.match(/^(\d+)(.*)$/) || []
        return { el, num: Number(num), suffix }
      })
      counters.forEach(({ el, suffix }) => { el.textContent = '0' + suffix })

      ScrollTrigger.create({
        trigger: '.why-hexes',
        start: 'top 70%',
        once: true,
        onEnter: () => {
          counters.forEach(({ el, num, suffix }, i) => {
            const state = { v: 0 }
            gsap.to(state, {
              v: num,
              duration: 1.8,
              delay: 0.15 + i * 0.12,
              ease: 'power3.out',
              onUpdate: () => { el.textContent = Math.round(state.v) + suffix },
            })
          })
        },
      })

      // Cluster tilts gently toward the pointer (desktop pointers only)
      const cluster = sectionRef.current.querySelector('.why-hexes')
      const rotX = gsap.quickTo(cluster, 'rotationX', { duration: 0.8, ease: 'power3.out' })
      const rotY = gsap.quickTo(cluster, 'rotationY', { duration: 0.8, ease: 'power3.out' })
      const onMove = (e) => {
        const r = cluster.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        rotY(px * 12)
        rotX(-py * 10)
      }
      const onLeave = () => { rotX(0); rotY(0) }
      const finePointer = window.matchMedia('(pointer: fine)').matches
      if (finePointer) {
        cluster.addEventListener('pointermove', onMove)
        cluster.addEventListener('pointerleave', onLeave)
      }

      return () => {
        cluster.removeEventListener('pointermove', onMove)
        cluster.removeEventListener('pointerleave', onLeave)
      }
    }, sectionRef)

    return () => mm.revert()
  }, [])

  return (
    <section id="why-us" ref={sectionRef} className="why-section">
      {/* Giant "Why Us" watermark, fades out on scroll */}
      <div className="why-watermark" aria-hidden="true">Why Us</div>

      <div className="why-inner">
        <h2 className="why-headline">
          Studio <span className="why-accent">craft</span>. <br />
          Agency scale.
        </h2>

        <p className="why-sub">
          We combine an obsessive design standard with the operational discipline of a full production house — so you get boutique attention without sacrificing speed.
        </p>

        <ul className="why-pills">
          {featuresList.map((item) => (
            <li key={item}>
              <Check className="why-pill-check" strokeWidth={2.5} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Honeycomb KPI cluster */}
        <div className="why-hexes">
          <div className="why-hexes-glow" aria-hidden="true" />
          {hexagonsData.map((hex) => (
            <div key={hex.id} className={`why-hex why-hex--${hex.id}`}>
              <span className="why-hex-value" data-value={hex.value}>{hex.value}</span>
              <span className="why-hex-label">{hex.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
