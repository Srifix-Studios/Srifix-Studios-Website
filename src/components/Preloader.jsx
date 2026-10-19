import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/preloader.css'

gsap.registerPlugin(ScrollTrigger)

function Curtain({ side }) {
  return (
    <div className={`preloader-curtain preloader-curtain--${side}`} aria-hidden="true">
      <div className="preloader-curtain-sway">
        <div className="preloader-folds" />
        <div className="preloader-seam" />
      </div>
    </div>
  )
}

export default function Preloader() {
  const [mounted, setMounted] = useState(true)
  const rootRef = useRef(null)
  const counterRef = useRef(null)
  const fillRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    // Lock scrolling while the loader is on screen (body + Lenis).
    document.body.style.overflow = 'hidden'
    const lockRaf = requestAnimationFrame(() => window.lenis?.stop())

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const state = { value: 0 }
    let openTl = null

    const unlock = () => {
      document.body.style.overflow = ''
      window.lenis?.start()
      // Sync ScrollTrigger with the freshly revealed layout.
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    const render = () => {
      const v = Math.min(100, Math.round(state.value))
      if (counterRef.current) counterRef.current.textContent = String(v)
      if (fillRef.current) fillRef.current.style.width = `${v}%`
    }

    const countTo = (target, duration, ease) =>
      new Promise((resolve) => {
        gsap.to(state, {
          value: target,
          duration,
          ease,
          onUpdate: render,
          onComplete: resolve,
        })
      })

    const openCurtains = () => {
      // Freeze the drifting fabric the moment the reveal begins.
      root.classList.add('preloader--opening')

      
      // Desktop keeps the full cinematic gather; tablet runs it quicker with
      // a slightly smaller gather; mobile skips the dip entirely.
      const isMobile = window.matchMedia('(max-width: 640px)').matches
      const isTablet = !isMobile && window.matchMedia('(max-width: 900px)').matches
      const dip = isMobile ? 0 : isTablet ? 1.5 : 2.5
      const steps = isMobile
        ? [
            { x: 12, scaleX: 0.9, duration: 0.3, ease: 'power2.out' },
            { x: 115, scaleX: 0.35, duration: 0.6, ease: 'power3.out' },
          ]
        : isTablet
          ? [
              { x: 10, scaleX: 0.86, duration: 0.35, ease: 'power2.out' },
              { x: 55, scaleX: 0.55, duration: 0.55, ease: 'power2.out' },
              { x: 118, scaleX: 0.3, duration: 0.45, ease: 'power3.out' },
            ]
          : [
              { x: 10, scaleX: 0.86, duration: 0.45, ease: 'power2.out' },
              { x: 55, scaleX: 0.55, duration: 0.7, ease: 'power2.out' },
              { x: 118, scaleX: 0.3, duration: 0.55, ease: 'power3.out' },
            ]

      // Fabric arcs out with a dip while it compresses toward the edge;
    
      const keyframes = (dir) =>
        steps.map((step, i) => ({
          xPercent: dir * step.x,
          yPercent: i === steps.length - 1 ? 0 : i % 2 === 0 ? -dip : dip,
          scaleX: step.scaleX,
          duration: step.duration,
          ease: step.ease,
        }))

      openTl = gsap.timeline({
        onComplete: () => {
          unlock()
          setMounted(false)
        },
      })
      openTl
        .to('.preloader-hud', {
          opacity: 0,
          y: isMobile ? -16 : -24,
          duration: isMobile ? 0.35 : isTablet ? 0.45 : 0.5,
          ease: 'power2.out',
        })
        // Real curtains gather at their edges —
        .to(
          '.preloader-curtain--left',
          { transformOrigin: 'left center', keyframes: keyframes(-1) },
          'open'
        )
        .to(
          '.preloader-curtain--right',
          { transformOrigin: 'right center', keyframes: keyframes(1) },
          'open'
        )
        
    }

    const ctx = gsap.context(() => {
      const pageReady = new Promise((resolve) => {
        if (document.readyState === 'complete') resolve()
        else window.addEventListener('load', resolve, { once: true })
      })

      const run = async () => {
        if (reducedMotion) {
          await countTo(100, 0.3, 'power2.out')
          openCurtains()
          return
        }
        // Creep up to ~92% while assets load, then finish once the page is ready.
        await countTo(92, 2.4, 'power2.out')
        await Promise.all([pageReady, document.fonts?.ready ?? Promise.resolve()])
        await countTo(100, 0.6, 'power2.out')
        await new Promise((resolve) => setTimeout(resolve, 300))
        openCurtains()
      }

      run()
    }, root)

    return () => {
      ctx.revert()
      openTl?.kill()
      cancelAnimationFrame(lockRaf)
      unlock()
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      className="preloader"
      ref={rootRef}
      role="status"
      aria-label="Loading website"
    >
     
      <Curtain side="left" />
      <Curtain side="right" />

      <div className="preloader-hud">
        <span className="preloader-brand">SRIFIX STUDIOS</span>
        <div className="preloader-counter">
          <span ref={counterRef}>0</span>
          <span className="preloader-percent">%</span>
        </div>
        <div className="preloader-bar">
          <div className="preloader-bar-fill" ref={fillRef} />
        </div>
        <span className="preloader-label">LOADING EXPERIENCE</span>
      </div>
    </div>
  )
}
