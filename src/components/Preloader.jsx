import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/preloader.css'

gsap.registerPlugin(ScrollTrigger)

export default function Preloader() {
  const [mounted, setMounted] = useState(true)

  const rootRef = useRef(null)
  const counterRef = useRef(null)
 
  const iconFillRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    document.body.style.overflow = 'hidden'
    window.lenis?.stop()

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const state = { value: 0 }
    let exitTl = null
    let cancelled = false

    const unlock = () => {
      document.body.style.overflow = ''
      window.lenis?.start()
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    const render = () => {
      const progress = Math.min(100, Math.max(0, state.value))

      if (counterRef.current) {
        counterRef.current.textContent = Math.round(progress)
      }

     

     if (iconFillRef.current) {
  iconFillRef.current.style.clipPath =
    `inset(${100 - progress}% 0 0 0)`
}

// Wave fill animation sync
if (iconFillRef.current) {
  iconFillRef.current.style.animationDuration = `${8 * (progress / 85)}s`
}

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

    const finishPreloader = () => {
      if (cancelled) return

      exitTl = gsap.timeline({
        onComplete: () => {
          unlock()
          setMounted(false)
        },
      })

      exitTl
        .to('.preloader-hud', {
          opacity: 0,
          y: -20,
          duration: 0.35,
          ease: 'power2.inOut',
        })
        .to(root, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        }, '-=0.08')
    }

    const waitForPage = () => {
      if (document.readyState === 'complete') {
        return Promise.resolve()
      }

      return new Promise((resolve) => {
        window.addEventListener('load', resolve, { once: true })
      })
    }

    const run = async () => {
      render()

      if (reducedMotion) {
        await countTo(100, 0.3, 'none')
        finishPreloader()
        return
      }

      // Animate while the page is loading.
      const pageReady = Promise.all([
        waitForPage(),
        document.fonts?.ready ?? Promise.resolve(),
      ])

      await countTo(85, 4, 'power1.inOut')

      // Wait for actual page readiness.
      await pageReady

      if (cancelled) return

      await countTo(100, 1.2, 'power2.inOut')
      finishPreloader()
    }

    const ctx = gsap.context(() => {
      run()
    }, root)

    return () => {
      cancelled = true
      ctx.revert()
      exitTl?.kill()
      gsap.killTweensOf(state)
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
      <div className="preloader-hud">

        <div className="preloader-icon">
          <img
            src="/assets/favicon-logo.png"
            className="preloader-icon-base"
            alt=""
          />

          <div
            className="preloader-icon-fill"
            ref={iconFillRef}
          >
            <img src="/assets/favicon-logo.png" alt="" />
          </div>
        </div>

        <span className="preloader-brand">
          SRIFIX <span className="brand-name">STUDIOS</span>
        </span>

        <div className="preloader-counter">
          <span ref={counterRef}>0</span>
          <span className="preloader-percent">%</span>
        </div>

      
        <span className="preloader-label">
          LOADING EXPERIENCE
        </span>

      </div>
    </div>
  )
}