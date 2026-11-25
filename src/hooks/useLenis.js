import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    window.lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const update = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(update)

    gsap.ticker.lagSmoothing(0)

    let lastHeight = 0
    let refreshTimer = 0
    const scheduleRefresh = () => {
      clearTimeout(refreshTimer)
      refreshTimer = setTimeout(() => {
        const h = document.body.scrollHeight
        if (Math.abs(h - lastHeight) > 1) {
          lastHeight = h
          ScrollTrigger.refresh()
        }
      }, 200)
    }
    const ro = new ResizeObserver(scheduleRefresh)
    ro.observe(document.body)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => {
      ro.disconnect()
      clearTimeout(refreshTimer)
      gsap.ticker.remove(update)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
      if (window.lenis === lenis) delete window.lenis
    }
  }, [])
}
