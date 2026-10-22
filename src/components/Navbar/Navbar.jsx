import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import '../../styles/navbar.css'

const NAV_ITEMS = [
  { name: 'Home', href: '#home', id: 'home' },
  { name: 'Services', href: '#services', id: 'services' },
  { name: 'Work', href: '#how-we-work', id: 'work' },
  { name: 'Blog', href: '#blog', id: 'blog' },
  { name: 'Careers', href: '#careers', id: 'careers' },
  { name: 'Contact', href: '#contact', id: 'contact' },
  { name: 'About', href: '#about', id: 'about' },
]

export default function Navbar({
  activePage = 'home',
  onNavigate,
  onOpenContact,
  className = '',
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLinkClick = (e, link) => {
    e.preventDefault()
    setMobileMenuOpen(false)

    if (onNavigate) {
      onNavigate(link.href)
      return
    }

    if (link.href === '#services') {
      window.location.hash = '#services'
      return
    }

    if (link.href === '#contact') {
      if (onOpenContact) {
        onOpenContact()
      } else {
        window.location.hash = '#get-started'
      }
      return
    }

    if (link.href && link.href.startsWith('#')) {
      const target = document.querySelector(link.href)
      if (target) {
        if (window.lenis) {
          window.lenis.scrollTo(target, { duration: 1.2 })
        } else {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        window.location.hash = link.href
      }
    }
  }

  const handleCtaClick = (e) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (onOpenContact) {
      onOpenContact()
    } else if (onNavigate) {
      onNavigate('#get-started')
    } else {
      window.location.hash = '#get-started'
    }
  }

  const isLinkActive = (link) => {
    if (activePage === 'home') return link.id === 'home'
    if (activePage === 'services') return link.id === 'services'
    if (activePage === 'get-started') return link.id === 'contact'
    return false
  }

  return (
    <header className={`navisland-header ${className}`}>
      <div className="navisland-inner">
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, { name: 'Home', href: '#home', id: 'home' })}
          className="navisland-logo"
        >
          <img
            src="/assets/favicon-logo.png"
            alt="Srifix Studios Logo"
            className="navisland-logo-img"
          />
          <span className="navisland-logo-text">
            <span className="logo-srifix">SRIFIX</span>{' '}
            <span className="logo-studios">STUDIOS</span>
          </span>
        </a>

        <ul className="navisland-pill" role="navigation">
          {NAV_ITEMS.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className={`navisland-link ${isLinkActive(link) ? 'active' : ''}`}
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#get-started"
          onClick={handleCtaClick}
          className="navisland-cta-btn"
        >
          <span>Get started</span>
          <span className="navisland-cta-arrow">↗</span>
        </a>

        <button
          type="button"
          className="navisland-mobile-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <ul className="navisland-mobile-menu">
          {NAV_ITEMS.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className={`navisland-link ${isLinkActive(link) ? 'active' : ''}`}
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
