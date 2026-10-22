import React, { useState, useRef, useEffect } from 'react'
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  RefreshCw,
  Minus,
  ArrowUpRight,
  ChevronRight,
  Bot,
  User,
  CheckCircle2,
  Phone,
  Mail
} from 'lucide-react'
import '../../styles/chatbot.css'

function WhatsAppIcon({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.894-11.893a11.815 11.815 0 00-3.484-8.411z" />
    </svg>
  )
}

const WHATSAPP_NUMBER = '+91 9625038790'
const WHATSAPP_URL = 'https://wa.me/919625038790?text=Hi%20Srifix%20Studios%2C%20I%20would%20like%20to%20discuss%20a%20project'
const STUDIO_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'info@srifix.srifixstudios.com'

const SUGGESTIONS = [
  'Connect on WhatsApp',
  'What services do you offer?',
  'How much does a project cost?',
  'How does your 4-step process work?',
  'What tech stack do you use?',
  'How do we get started?',
]

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: "Hello! Welcome to Srifix Studios. I can help you explore our design services, check pricing estimates, or connect with our lead team directly via WhatsApp or email.",
    timestamp: 'Just now',
    actions: [
      { label: 'Chat on WhatsApp', url: WHATSAPP_URL, isWhatsApp: true },
      { label: 'Email Studio Desk', url: `mailto:${STUDIO_EMAIL}` },
      { label: 'Start Project & Book Call', sectionId: '#get-started' },
      { label: 'View Pricing', sectionId: '#pricing' },
      { label: 'Explore Process', sectionId: '#how-we-work' },
    ]
  }
]

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showTooltip, setShowTooltip] = useState(true)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false)
    }, 8000)
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-chatbot', handleOpen)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('open-chatbot', handleOpen)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setUnreadCount(0)
      setShowTooltip(false)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, messages, isTyping])

  const scrollToSection = (targetId) => {
    const el = document.querySelector(targetId)
    if (el) {
      if (window.lenis) {
        window.lenis.scrollTo(el, { duration: 1.2 })
      } else {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleActionClick = (action) => {
    if (action.sectionId === '#contact' || action.sectionId === '#get-started') {
      setIsOpen(false)
      window.dispatchEvent(
        new CustomEvent('open-get-started', {
          detail: { service: action.service || null }
        })
      )
      window.location.hash = '#get-started'
    } else if (action.sectionId) {
      scrollToSection(action.sectionId)
    } else if (action.url) {
      window.open(action.url, '_blank', 'noopener,noreferrer')
    }
  }

  const generateBotResponse = (userText) => {
    const query = userText.toLowerCase().trim()

    if (
      query.includes('whatsapp') ||
      query.includes('whats app') ||
      query.includes('wa') ||
      query.includes('chat on whatsapp') ||
      query.includes('message') ||
      query.includes('text')
    ) {
      return {
        text: `You can chat with our lead team directly on WhatsApp at ${WHATSAPP_NUMBER}.\n\nWe are available to review project requirements, share live Figma links, and prepare tailored quotations.`,
        actions: [
          { label: `Open WhatsApp (${WHATSAPP_NUMBER})`, url: WHATSAPP_URL, isWhatsApp: true },
          { label: `Email ${STUDIO_EMAIL}`, url: `mailto:${STUDIO_EMAIL}` },
          { label: 'Call Direct', url: 'tel:+919625038790' },
        ]
      }
    }

    if (
      query.includes('price') ||
      query.includes('cost') ||
      query.includes('pricing') ||
      query.includes('rate') ||
      query.includes('budget') ||
      query.includes('quote') ||
      query.includes('how much')
    ) {
      return {
        text: "Here is a quick overview of our standard project rates:\n\n• Brand Identity: Starting at ₹20,000 (Logo, identity guide, color system, social kit)\n• UI/UX Design: Starting at ₹25,000 (Wireframes, Figma design, user flows)\n• Web Development: Starting at ₹30,000 (Fast, responsive, SEO-ready code)\n• Digital Marketing: From ₹20,000 / mo (Google & Meta ad campaigns)\n• Social Media Marketing: From ₹12,000 / mo (Content strategy, posts & reels)\n\nFinal pricing depends on your exact scope, deliverables, and timelines.",
        actions: [
          { label: 'See Detailed Pricing Table', sectionId: '#pricing' },
          { label: 'Ask Quote on WhatsApp', url: WHATSAPP_URL, isWhatsApp: true },
          { label: 'Request Custom Quote', sectionId: '#contact' },
        ]
      }
    }

    if (
      query.includes('service') ||
      query.includes('what do you do') ||
      query.includes('offer') ||
      query.includes('capabilities') ||
      query.includes('branding') ||
      query.includes('ui') ||
      query.includes('ux') ||
      query.includes('develop') ||
      query.includes('website')
    ) {
      return {
        text: "Srifix Studios builds distinctive brands and high-performing web experiences. Our core capabilities include:\n\n1. Brand Identity: Visual systems, brand books, typography, social collateral\n2. UI/UX Architecture: Figma design systems, interactive prototypes, user flows\n3. Modern Web Development: Custom high-speed websites, interactive 3D, Webflow, and React\n4. Digital Marketing: Performance advertising on Meta and Google Ads\n5. Social Media Retainers: Turnkey creative content and account handling",
        actions: [
          { label: 'View Capabilities', sectionId: '#services' },
          { label: 'Chat on WhatsApp', url: WHATSAPP_URL, isWhatsApp: true },
          { label: 'Check Pricing', sectionId: '#pricing' },
          { label: 'Discuss Your Needs', sectionId: '#contact' },
        ]
      }
    }

    if (
      query.includes('process') ||
      query.includes('workflow') ||
      query.includes('how we work') ||
      query.includes('how do you work') ||
      query.includes('step') ||
      query.includes('method')
    ) {
      return {
        text: "Our projects follow a structured 4-step framework:\n\n1. Discover: We analyze your audience, product, and market positioning.\n2. Design: High-fidelity prototypes and design systems shaped through weekly syncs.\n3. Build: Clean, responsive code optimized for speed and reliability.\n4. Launch: End-to-end QA, seamless deployment, and continuous support.",
        actions: [
          { label: 'Inspect 4-Step Process', sectionId: '#how-we-work' },
          { label: 'Chat on WhatsApp', url: WHATSAPP_URL, isWhatsApp: true },
          { label: 'Book Discovery Chat', sectionId: '#contact' },
        ]
      }
    }

    if (
      query.includes('tech') ||
      query.includes('stack') ||
      query.includes('code') ||
      query.includes('react') ||
      query.includes('three') ||
      query.includes('gsap') ||
      query.includes('webflow') ||
      query.includes('wordpress') ||
      query.includes('framework')
    ) {
      return {
        text: "We use modern, battle-tested tools to build reliable digital products:\n\n• Frontend: React, Vite, Next.js, Vanilla CSS, modern JavaScript\n• Creative Animation: GSAP, Three.js, WebGL, Lenis smooth scrolling\n• CMS Platforms: Webflow, WordPress, headless CMS setups\n• Design: Figma, Adobe Suite, custom 3D design pipelines\n\nEvery site is engineered for ultra-fast loading speeds and crisp mobile responsiveness.",
        actions: [
          { label: 'See Features', sectionId: '#services' },
          { label: 'Discuss on WhatsApp', url: WHATSAPP_URL, isWhatsApp: true },
          { label: 'Contact Dev Team', sectionId: '#contact' },
        ]
      }
    }

    if (
      query.includes('contact') ||
      query.includes('call') ||
      query.includes('email') ||
      query.includes('reach') ||
      query.includes('talk') ||
      query.includes('hire') ||
      query.includes('start') ||
      query.includes('book') ||
      query.includes('get started')
    ) {
      return {
        text: `We would love to collaborate on your project! You can connect with our team directly:\n\n• WhatsApp: ${WHATSAPP_NUMBER}\n• Email: ${STUDIO_EMAIL}\n• Direct Phone: ${WHATSAPP_NUMBER}\n• Turnaround: We review every project inquiry and reply with a plan within 1 business day.`,
        actions: [
          { label: `Chat on WhatsApp (${WHATSAPP_NUMBER})`, url: WHATSAPP_URL, isWhatsApp: true },
          { label: `Email ${STUDIO_EMAIL}`, url: `mailto:${STUDIO_EMAIL}` },
          { label: `Call ${WHATSAPP_NUMBER}`, url: 'tel:+919625038790' },
          { label: 'Send Project Brief', sectionId: '#contact' },
        ]
      }
    }

    if (
      query.includes('time') ||
      query.includes('fast') ||
      query.includes('duration') ||
      query.includes('days') ||
      query.includes('weeks') ||
      query.includes('deadline') ||
      query.includes('turnaround')
    ) {
      return {
        text: "Most projects kick off within 3 to 5 business days after our discovery chat.\n\n• Brand Identity packages: typically 2 to 3 weeks\n• Custom Websites: typically 3 to 5 weeks depending on scope\n• A La Carte design assets: typically 24 to 48 hours\n\nNeed an expedited launch? Let us know your timeline when you get in touch.",
        actions: [
          { label: 'Check FAQs', sectionId: '#faq' },
          { label: 'Chat on WhatsApp', url: WHATSAPP_URL, isWhatsApp: true },
          { label: 'Share Your Deadline', sectionId: '#contact' },
        ]
      }
    }

    if (
      query.includes('where') ||
      query.includes('location') ||
      query.includes('india') ||
      query.includes('international') ||
      query.includes('remote') ||
      query.includes('global') ||
      query.includes('client')
    ) {
      return {
        text: "Yes, we collaborate with ambitious startups, founders, and enterprises globally. All our workflows and weekly review syncs are built for seamless remote collaboration across time zones.",
        actions: [
          { label: 'Client Reviews', sectionId: '#testimonials' },
          { label: 'WhatsApp Inquiry', url: WHATSAPP_URL, isWhatsApp: true },
          { label: 'Get in Touch', sectionId: '#contact' },
        ]
      }
    }

    if (
      query.includes('support') ||
      query.includes('maintain') ||
      query.includes('maintenance') ||
      query.includes('after launch') ||
      query.includes('retainer')
    ) {
      return {
        text: "We stand by our work well beyond launch day. Every build includes dedicated post-launch QA, deployment handover, and optional ongoing retainer plans for continuous design updates, feature development, and speed optimization.",
        actions: [
          { label: 'View Retainer Options', sectionId: '#pricing' },
          { label: 'WhatsApp Us', url: WHATSAPP_URL, isWhatsApp: true },
          { label: 'Contact Us', sectionId: '#contact' },
        ]
      }
    }

    return {
      text: "Thanks for reaching out! Whether you need a fresh brand identity, an interactive custom website, or growth marketing, our studio team is here to help.\n\nFeel free to explore our sections, message us on WhatsApp, or send an inquiry directly.",
      actions: [
        { label: `WhatsApp (${WHATSAPP_NUMBER})`, url: WHATSAPP_URL, isWhatsApp: true },
        { label: `Email ${STUDIO_EMAIL}`, url: `mailto:${STUDIO_EMAIL}` },
        { label: 'Explore Services', sectionId: '#services' },
        { label: 'View Pricing', sectionId: '#pricing' },
        { label: 'How We Work', sectionId: '#how-we-work' },
        { label: 'Connect With Studio', sectionId: '#contact' },
      ]
    }
  }

  const handleSend = (textToSend = null) => {
    const text = (typeof textToSend === 'string' ? textToSend : inputValue).trim()
    if (!text || isTyping) return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: 'Just now',
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      const response = generateBotResponse(text)
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        timestamp: 'Just now',
        actions: response.actions,
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
      if (!isOpen) {
        setUnreadCount((count) => count + 1)
      }
    }, 750)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES)
    setInputValue('')
    setIsTyping(false)
  }

  return (
    <div className="srifix-chatbot-container">
      <div className="srifix-chatbot-launcher-wrapper">
        {showTooltip && !isOpen && (
          <div
            className="srifix-chatbot-tooltip"
            onClick={() => setIsOpen(true)}
            role="button"
            tabIndex={0}
          >
            <div className="srifix-chatbot-tooltip-content">
              <span className="srifix-chatbot-tooltip-dot" />
              <span>Ask Srifix Studio AI</span>
            </div>
            <button
              className="srifix-chatbot-tooltip-close"
              onClick={(e) => {
                e.stopPropagation()
                setShowTooltip(false)
              }}
              aria-label="Dismiss tooltip"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <button
          className={`srifix-chatbot-launcher ${isOpen ? 'is-active' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close chat' : 'Open Srifix chat assistant'}
          type="button"
        >
          <div className="srifix-launcher-glow" />
          <div className="srifix-launcher-icon-wrap">
            {isOpen ? (
              <X size={24} className="srifix-icon-rotate" />
            ) : (
              <>
                <MessageSquare size={24} className="srifix-icon-default" />
                <Sparkles size={14} className="srifix-launcher-sparkle" />
              </>
            )}
          </div>
          {unreadCount > 0 && !isOpen && (
            <span className="srifix-chatbot-badge">{unreadCount}</span>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="srifix-chatbot-window" role="dialog" aria-modal="true" aria-label="Srifix Studio Assistant">
          <div className="srifix-chat-header">
            <div className="srifix-chat-header-info">
              <div className="srifix-chat-avatar">
                <Bot size={20} color="#FFFFFF" />
                <span className="srifix-avatar-status" />
              </div>
              <div className="srifix-chat-header-text">
                <div className="srifix-chat-title-row">
                  <h3>Srifix AI Assistant</h3>
                  <span className="srifix-tag-online">LIVE</span>
                </div>
                <p>Direct studio answers & live support</p>
              </div>
            </div>

            <div className="srifix-chat-header-actions">
              <button
                type="button"
                className="srifix-chat-action-btn"
                onClick={resetChat}
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <RefreshCw size={15} />
              </button>
              <button
                type="button"
                className="srifix-chat-action-btn"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                <Minus size={16} />
              </button>
              <button
                type="button"
                className="srifix-chat-action-btn close"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="srifix-chat-whatsapp-banner"
            title="Chat directly on WhatsApp"
          >
            <div className="srifix-whatsapp-banner-left">
              <div className="srifix-whatsapp-icon-circle">
                <WhatsAppIcon size={14} />
              </div>
              <div className="srifix-whatsapp-banner-info">
                <div className="srifix-whatsapp-banner-title">
                  <span>Chat on WhatsApp</span>
                  <span className="srifix-whatsapp-live-dot" />
                </div>
                <span className="srifix-whatsapp-banner-sub">{WHATSAPP_NUMBER}</span>
              </div>
            </div>
            <div className="srifix-whatsapp-banner-badge">
              <span>Connect</span>
              <ArrowUpRight size={13} />
            </div>
          </a>

          <div className="srifix-chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`srifix-message-row ${msg.sender === 'user' ? 'is-user' : 'is-bot'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="srifix-msg-avatar">
                    <Bot size={14} />
                  </div>
                )}

                <div className="srifix-msg-bubble-wrap">
                  <div className="srifix-msg-bubble">
                    <div className="srifix-msg-text">
                      {msg.text.split('\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>

                    {msg.actions && msg.actions.length > 0 && (
                      <div className="srifix-msg-actions">
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            type="button"
                            className={`srifix-msg-action-btn ${act.isWhatsApp ? 'is-whatsapp' : ''}`}
                            onClick={() => handleActionClick(act)}
                          >
                            {act.isWhatsApp && <WhatsAppIcon size={13} className="srifix-btn-wa-icon" />}
                            <span>{act.label}</span>
                            <ArrowUpRight size={13} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="srifix-msg-time">{msg.timestamp}</span>
                </div>

                {msg.sender === 'user' && (
                  <div className="srifix-msg-avatar user">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="srifix-message-row is-bot">
                <div className="srifix-msg-avatar">
                  <Bot size={14} />
                </div>
                <div className="srifix-msg-bubble-wrap">
                  <div className="srifix-msg-bubble typing">
                    <div className="srifix-typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="srifix-chat-suggestions">
            <span className="srifix-suggestions-label">Quick Inquiries:</span>
            <div className="srifix-suggestions-scroll">
              {SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`srifix-suggestion-pill ${item.includes('WhatsApp') ? 'is-wa-pill' : ''}`}
                  onClick={() => handleSend(item)}
                >
                  {item.includes('WhatsApp') && <WhatsAppIcon size={12} className="srifix-pill-wa-icon" />}
                  <span>{item}</span>
                  <ChevronRight size={12} className="srifix-pill-arrow" />
                </button>
              ))}
            </div>
          </div>

          <form
            className="srifix-chat-input-row"
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about pricing, WhatsApp, services..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="srifix-chat-input"
            />
            <button
              type="submit"
              className="srifix-chat-send-btn"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>

          <div className="srifix-chat-micro-footer">
            <span>Direct Studio Desk • {STUDIO_EMAIL} • WhatsApp: {WHATSAPP_NUMBER}</span>
          </div>
        </div>
      )}
    </div>
  )
}
