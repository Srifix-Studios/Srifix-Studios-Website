import { useEffect } from 'react'
import '../styles/mousetrail.css'

// ---- Mouse trail: cyan → blue → violet → purple → orange → gold ----
const TRAIL_COLORS = ['cyan', 'blue', 'violet', 'purple', 'orange', 'gold']

export default function MouseTrail() {
  useEffect(() => {
    const dots = TRAIL_COLORS.map((name) => {
      const node = document.createElement('div')
      node.className = 'light light--' + name
      document.body.appendChild(node)
      return node
    })

    const onMouseMove = (e) => {
      dots.forEach((node) => {
        node.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      })
    }

    document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      dots.forEach((node) => node.remove())
    }
  }, [])

  return null
}