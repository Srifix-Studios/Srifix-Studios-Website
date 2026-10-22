import React from 'react'
import { Mail, Phone, ArrowUp } from 'lucide-react'
import '../styles/cta.css'

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'Work', href: '#how-we-work' },
  { name: 'About', href: '#about' },
  { name: 'Why Us', href: '#why-us' },
  { name: 'Reviews', href: '#testimonials' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Contact Desk', href: '#contact' },
]
const legalLinks = ['Terms of Service', 'Privacy Policy']
const socialLinks = [
  { name: 'Twitter', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'WhatsApp', href: 'https://wa.me/919625038790' },
  { name: 'Facebook', href: '#' },
]
const STUDIO_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'info@srifix.srifixstudios.com'

function scrollToTop() {
  if (window.lenis) window.lenis.scrollTo(0, { duration: 1.2 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function Footer({ onOpenContact }) {
  function handleLinkClick(e, href) {
    if (href === '#contact' || href === '#get-started') {
      e.preventDefault()
      if (onOpenContact) {
        onOpenContact()
      } else {
        window.location.hash = '#get-started'
      }
      return
    }

    if (href === '#services') {
      e.preventDefault()
      window.location.hash = '#services'
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
      else window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    if (href.startsWith('#')) {
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        if (window.lenis) {
          window.lenis.scrollTo(target, { duration: 1.2 })
        } else {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }
  return (
    <>
      <footer className="footer">
        <div className="footer-atmosphere-glow" aria-hidden="true" />

        <div className="footer-top">

          <div className="footer-col">
            <h4>QUICK LINKS</h4>

            <ul>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>LEGAL LINK</h4>

            <ul>
              {legalLinks.map((link) => (
                <li key={link}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>STAY CONNECTED</h4>

            <div className="social-grid">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-newsletter">

            <span className="dispatch">DISPATCH</span>

            <h3>
              You Read This Far, Might As
              Well Sign Up.
            </h3>

            <p className="signup-text">
              Practical perspectives on brand identity,
              web design, and digital growth.
              Zero spam, always.
            </p>
            <p className="leads">DIRECT STUDIO LEADS</p>

            <a href={`mailto:${STUDIO_EMAIL}`} className="contact-box">
              <Mail size={15} color="#A0C9FF" aria-hidden="true" />
              <span>{STUDIO_EMAIL}</span>
            </a>

            <a href="tel:+919625038790" className="contact-box">
              <Phone size={14} color="#A0C9FF" aria-hidden="true" />
              <span>+91 9625038790</span>
            </a>

          </div>

        </div>

        <div className="footer-marquee" aria-hidden="true">
          <div className="footer-marquee-track">
            <div className="footer-marquee-group">
              <span>SRIFIX STUDIOS</span>
              <span>SRIFIX STUDIOS</span>
              <span>SRIFIX STUDIOS</span>
            </div>
            <div className="footer-marquee-group" aria-hidden="true">
              <span>SRIFIX STUDIOS</span>
              <span>SRIFIX STUDIOS</span>
              <span>SRIFIX STUDIOS</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">

          <p>
            © 2026 Srifix Studios LLC. Built with care for ambitious founders. All rights reserved.
          </p>

          <button type="button" className="back-top" onClick={scrollToTop}>
            <span>Back to Top</span>
            <ArrowUp size={14} aria-hidden="true" />
          </button>

        </div>

      </footer>

      <div className="footer-copyright">
        <div className="footer-copyright-content">

          <div className="footer-brand">
            <h3>SRIFIX STUDIOS</h3>
            <p>
              Digital design, modern web development, and
              brand strategy for growing companies.
            </p>
          </div>

          <p className="copyright-text">
            © 2026 Srifix Studios. All rights reserved.
          </p>

        </div>
      </div>
    </>
  )
}