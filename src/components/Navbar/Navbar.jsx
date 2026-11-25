import React, { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import '../../styles/navbar.css'

const NAV_ITEMS = [
  { name: 'Home', href: '/', id: 'home' },
  { name: 'Services', href: '/services', id: 'services' },
  { name: 'Work', href: '#how-we-work', id: 'work' },
  { name: 'Blog', href: '#blog', id: 'blog' },
  { name: 'Careers', href: '#careers', id: 'careers' },
  { name: 'Contact', href: '/get-started', id: 'contact' },
  { name: 'About', href: '/about', id: 'about' },
]

export default function Navbar({
  activePage = 'home',
  onNavigate,
  onOpenContact,
  className = '',
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const progressBarRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
      setScrolled(scrollY > 20)

      if (progressBarRef.current) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0
        progressBarRef.current.style.transform = `scaleX(${progress})`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    if (window.lenis) {
      window.lenis.on('scroll', handleScroll)
    }
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (window.lenis) {
        window.lenis.off('scroll', handleScroll)
      }
    }
  }, [activePage])

  const handleLinkClick = (e, link) => {
    e.preventDefault()
    setMobileMenuOpen(false)

    if (link.href === '/services' || link.href === '#services') {
      if (onNavigate) onNavigate('/services')
      return
    }

    if (link.href === '/about' || link.href === '#about') {
      if (onNavigate) onNavigate('/about')
      return
    }

    if (link.href === '/get-started' || link.href === '#contact' || link.href === '#get-started') {
      if (onOpenContact) onOpenContact()
      else if (onNavigate) onNavigate('/get-started')
      return
    }

    if (link.href === '/' || link.href === '#home') {
      if (onNavigate) onNavigate('/')
      return
    }

    if (link.href && link.href.startsWith('#')) {
      if (onNavigate) {
        onNavigate('/', link.href)
      } else {
        const target = document.querySelector(link.href)
        if (target) {
          if (window.lenis) window.lenis.scrollTo(target, { duration: 1.2 })
          else target.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  const handleCtaClick = (e) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (onOpenContact) {
      onOpenContact()
    } else if (onNavigate) {
      onNavigate('/get-started')
    }
  }

  const isLinkActive = (link) => {
    if (activePage === 'home') return link.id === 'home'
    if (activePage === 'services') return link.id === 'services'
    if (activePage === 'get-started') return link.id === 'contact'
    if (activePage === 'about') return link.id === 'about'
    return false
  }

  return (
    <header className={`navisland-header ${scrolled ? 'navisland-header--scrolled' : ''} ${className}`}>
      <div className="navisland-progress-track" aria-hidden="true">
        <div ref={progressBarRef} className="navisland-progress-bar" />
      </div>
      <div className="navisland-inner">
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, { name: 'Home', href: '/', id: 'home' })}
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
