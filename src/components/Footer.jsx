import React from 'react'
import '../styles/cta.css'

const quickLinks = ['Home', 'Services', 'Work', 'Blog', 'Careers', 'Contact Desk', 'About']
const legalLinks = ['Terms of Service', 'Privacy Policy']
const socialLinks = ['Twitter', 'LinkedIn', 'Instagram', 'WhatsApp', 'Facebook']

function scrollToTop() {
  // Lenis drives smooth scrolling; the instance is exposed by useLenis as window.lenis
  if (window.lenis) window.lenis.scrollTo(0, { duration: 1.2 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function Footer() {
  return (
    <>
      <footer className="footer">

        <div className="footer-top">

          {/* Quick Links */}
          <div className="footer-col">
            <h4>QUICK LINKS</h4>

            <ul>
              {quickLinks.map((link) => (
                <li key={link}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h4>LEGAL LINK</h4>

            <ul>
              {legalLinks.map((link) => (
                <li key={link}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="footer-col">
            <h4>STAY CONNECTED</h4>

            <div className="social-grid">
              {socialLinks.map((link) => (
                <a key={link} href="#">{link}</a>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="footer-newsletter">

            <span className="dispatch">DISPATCH</span>

            <h3>
              You Read This Far, Might As
              Well Sign Up.
            </h3>

            <p className="signup-text">
              Fortnightly essays on spatial interfaces,
              brand architecture, and interactive physics.
              Zero spam.
            </p>
            <p className="leads">DIRECT STUDIO LEADS</p>

            <div className="contact-box">
              ✉ yogeshsrivastava9876@gmail.com
            </div>

            <div className="contact-box">
              ☎ +91 9625038790
            </div>

          </div>

        </div>

        {/* Huge Text */}
        <div className="footer-logo-wrapper" aria-hidden="true">
          <div className="footer-logo">SRIFIX STUDIOS</div>
        </div>

        {/* Bottom Row */}
        <div className="footer-bottom">

          <p>
            © 2026 Srifix Studios LLC.
            Engineered for the relentless.
            All rights reserved.
          </p>

          <button type="button" className="back-top" onClick={scrollToTop}>
            Back to Top ↑
          </button>

        </div>

      </footer>

      {/* Dark Bottom Bar */}
      <div className="footer-copyright">
        <div className="footer-copyright-content">

          <div className="footer-brand">
            <h3>SRIFIX STUDIOS</h3>
            <p>
              Next-generation digital production and
              forward brand narratives.
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