import React, { useRef, useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { faqs } from '../data/pricing'
import '../styles/pricing.css'

gsap.registerPlugin(ScrollTrigger)

export default function FaqSection() {
  // Accordion: only one question open at a time; clicking the open one closes it.
  const [openIndex, setOpenIndex] = useState(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // "Questions" is fully visible first; as the questions scroll up into view it fades away.
      gsap.to('.question-bg-text', {
        opacity: 0,
        yPercent: -18,
        scale: 0.94,
        ease: 'none',
        scrollTrigger: {
          trigger: '.question-list',
          start: 'top 85%',
          end: 'top 30%',
          scrub: 0.6,
        },
      })
    }, sectionRef)

    return () => mm.revert()
  }, [])

  return (
    <section id="faq" className="question-section" ref={sectionRef}>
      <h2 className="question-bg-text" aria-hidden="true">Questions</h2>
      <h3 className="question-heading">Frequently Asked <span className="accent">Questions</span></h3>

      <div className="question-list">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index

          return (
            <article key={faq.q} className={isOpen ? 'question-item open' : 'question-item'}>
              <button
                type="button"
                className="question-q"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{faq.q}</span>
                <span className="question-chevron">
                  <ChevronDown aria-hidden="true" />
                </span>
              </button>

              <div className="question-a">
                <p>{faq.a}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}