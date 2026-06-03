import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import './LandingPage.css'

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: '🎓',
      title: 'Expert Sessions',
      description: 'Book one-on-one sessions with industry experts and mentors'
    },
    {
      icon: '⚡',
      title: 'Flexible Scheduling',
      description: 'Learn at your own pace with customizable session times'
    },
    {
      icon: '💬',
      title: 'Direct Interaction',
      description: 'Connect directly with experienced professionals in your field'
    },
    {
      icon: '📈',
      title: 'Track Progress',
      description: 'Monitor your growth with detailed session history and notes'
    }
  ]

  const stats = [
    { label: 'Active Sessions', value: '2,500+' },
    { label: 'Expert Creators', value: '500+' },
    { label: 'Learners Worldwide', value: '15,000+' },
    { label: 'Satisfaction Rate', value: '98%' }
  ]

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className={`hero ${isVisible ? 'visible' : ''}`}>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Learn From Industry Experts</h1>
            <p className="hero-subtitle">Book personalized sessions with experienced professionals and accelerate your growth</p>
            <div className="hero-cta">
              <Link to="/sessions">
                <Button className="btn-primary-lg">Explore Sessions</Button>
              </Link>
              <Link to="/login">
                <Button className="btn-secondary-lg">Get Started</Button>
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
            <div className="visual-cards">
              <div className="card-item card-1">
                <div className="card-header">Expert Match</div>
                <div className="card-stat">95%</div>
              </div>
              <div className="card-item card-2">
                <div className="card-header">Session Quality</div>
                <div className="card-stat">4.9★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2>Why Choose Sessions Marketplace</h2>
          <p>Everything you need to grow your skills</p>
        </div>

        <div className="features-content">
          <div className="features-list">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`feature-card ${activeFeature === idx ? 'active' : ''}`}
                onMouseEnter={() => setActiveFeature(idx)}
                onClick={() => setActiveFeature(idx)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="features-visual">
            <div className="feature-graphic">
              <div className="graphic-circle"></div>
              <div className="graphic-text">
                <h4>Curated for You</h4>
                <p>Find sessions tailored to your learning goals and schedule</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Browse Sessions</h3>
            <p>Explore thousands of expert-led sessions across various topics</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Pick Your Expert</h3>
            <p>Find the perfect mentor matching your learning style</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Book & Learn</h3>
            <p>Schedule your session and start your learning journey</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Grow & Succeed</h3>
            <p>Track progress and achieve your professional goals</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Learning Journey?</h2>
          <p>Join thousands of professionals already transforming their careers</p>
          <Link to="/sessions">
            <Button className="btn-primary-lg">Browse Sessions Now</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
