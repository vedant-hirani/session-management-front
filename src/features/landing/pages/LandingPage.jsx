import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import './LandingPage.css'

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [hoveredStat, setHoveredStat] = useState(null)
  const [hoveredFeature, setHoveredFeature] = useState(null)

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: '✨',
      title: 'Expert Matching',
      description: 'AI-powered algorithms connect you with mentors perfectly suited to your goals',
      highlight: 'Real-time matching'
    },
    {
      icon: '⚡',
      title: 'Instant Booking',
      description: 'Schedule sessions seamlessly with flexible time slots across all timezones',
      highlight: 'Book in seconds'
    },
    {
      icon: '🎯',
      title: 'Progress Tracking',
      description: 'Monitor your growth with detailed metrics, notes, and personalized insights',
      highlight: 'Data-driven growth'
    },
    {
      icon: '🌍',
      title: 'Global Community',
      description: 'Access 500+ vetted experts and 15,000+ learners from around the world',
      highlight: 'World-class network'
    }
  ]

  const stats = [
    { value: '2,500+', label: 'Active Sessions', color: 'from-indigo-500 to-purple-500' },
    { value: '500+', label: 'Expert Creators', color: 'from-purple-500 to-pink-500' },
    { value: '15K+', label: 'Learners', color: 'from-pink-500 to-red-500' },
    { value: '4.9★', label: 'Avg Rating', color: 'from-blue-500 to-cyan-500' }
  ]

  const steps = [
    { num: '01', title: 'Discover', description: 'Explore thousands of expert-led sessions tailored to your interests' },
    { num: '02', title: 'Connect', description: 'Find mentors matching your learning style and professional goals' },
    { num: '03', title: 'Learn', description: 'Book personalized sessions and start your transformation journey' },
    { num: '04', title: 'Grow', description: 'Track progress and achieve your professional milestones' }
  ]

  return (
    <div className="landing-page">
      {/* Background Elements */}
      <div className="bg-grid"></div>
      <div className="bg-gradient-1"></div>
      <div className="bg-gradient-2"></div>

      {/* Hero Section */}
      <section className={`hero-section ${isVisible ? 'loaded' : ''}`}>
        <div className="hero-container">
          {/* Animated Background */}
          <div className="hero-bg">
            <div className="mesh-gradient mesh-1"></div>
            <div className="mesh-gradient mesh-2"></div>
            <div className="mesh-gradient mesh-3"></div>
            <div className="floating-element elem-1"></div>
            <div className="floating-element elem-2"></div>
            <div className="floating-element elem-3"></div>
          </div>

          {/* Hero Content */}
          <div className="hero-grid">
            <div className="hero-text">
              <div className="badge">✨ The Future of Learning</div>
              <h1 className="hero-title">
                Connect with <span className="gradient-text">industry experts</span> instantly
              </h1>
              <p className="hero-description">
                Book personalized mentoring sessions with vetted professionals. Get expert guidance, accelerate your growth, and unlock your potential.
              </p>
              <div className="hero-cta-group">
                <Link to="/sessions">
                  <button className="cta-primary">
                    Explore Sessions
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                      <path d="M7 10h6m0 0l-3-3m3 3l-3 3" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </Link>
                <Link to="/login">
                  <button className="cta-secondary">Get Started</button>
                </Link>
              </div>
              <div className="trust-badges">
                <div className="badge-item">
                  <span className="badge-icon">✓</span>
                  <span>98% satisfaction rate</span>
                </div>
                <div className="badge-item">
                  <span className="badge-icon">✓</span>
                  <span>10,000+ bookings monthly</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hero-visual">
              <div className="visual-frame">
                <div className="glass-card card-1">
                  <div className="card-icon">👤</div>
                  <div className="card-text">Expert Mentor</div>
                  <div className="card-meta">Verified Professional</div>
                </div>
                <div className="glass-card card-2">
                  <div className="card-icon">⭐</div>
                  <div className="card-text">4.9 Rating</div>
                  <div className="card-meta">1,200+ sessions</div>
                </div>
                <div className="glass-card card-3">
                  <div className="card-icon">🎯</div>
                  <div className="card-text">Instant Match</div>
                  <div className="card-meta">AI Powered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Integrated */}
      <section className="stats-integrated">
        <div className="stats-wrapper">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="stat-card"
              onMouseEnter={() => setHoveredStat(idx)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className={`stat-gradient bg-gradient-to-r ${stat.color}`}></div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Premium Grid */}
      <section className="features-premium">
        <div className="section-container">
          <div className="section-header">
            <h2>Why experts choose Sessions Marketplace</h2>
            <p>Everything you need to teach, learn, and grow</p>
          </div>

          <div className="features-grid">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="feature-item"
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="feature-glow"></div>
                <div className="feature-card-inner">
                  <div className="feature-header">
                    <span className="feature-icon">{feature.icon}</span>
                    <span className="feature-highlight">{feature.highlight}</span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="feature-arrow">→</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Timeline */}
      <section className="timeline-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Get started in minutes</h2>
            <p>A seamless experience from discovery to transformation</p>
          </div>

          <div className="timeline-wrapper">
            {steps.map((step, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-content">{step.num}</div>
                </div>
                <div className="timeline-card">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="proof-section">
        <div className="section-container">
          <div className="proof-content">
            <div className="proof-text">
              <h2>Trusted by professionals worldwide</h2>
              <p>Join thousands of learners and experts transforming careers every day</p>
            </div>
            <div className="proof-logos">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="logo-item">
                  <div className="logo-placeholder">Brand {i}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-final">
        <div className="cta-gradient-bg"></div>
        <div className="section-container">
          <div className="cta-content">
            <h2>Ready to transform your career?</h2>
            <p>Start your journey with expert mentorship today</p>
            <div className="cta-buttons">
              <Link to="/sessions">
                <button className="cta-primary-large">Browse Sessions</button>
              </Link>
              <Link to="/login">
                <button className="cta-secondary-large">Create Account</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
