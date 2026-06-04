import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  // Hero Interactive Booking States
  const [selectedDate, setSelectedDate] = useState('Today')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Expert Discovery Filters
  const [activeCategory, setActiveCategory] = useState('Tech')

  // Live Calendar Interactions
  const [selectedCalendarSlot, setSelectedCalendarSlot] = useState(null)

  // Dashboard Role Selection
  const [activeRole, setActiveRole] = useState('Learner')

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleConfirmBooking = () => {
    if (!selectedTime) return
    setBookingConfirmed(true)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 4000)
  }

  const handleResetBooking = () => {
    setBookingConfirmed(false)
    setSelectedTime('')
  }

  // Expert Data
  const experts = [
    { name: 'Sarah Jenkins', role: 'Principal Architect at Google', category: 'Tech', rating: '4.9', sessions: '1.2K', avatar: '💻', rate: '$150/hr' },
    { name: 'David Chen', role: 'Staff Product Designer at Meta', category: 'Design', rating: '4.8', sessions: '980', avatar: '🎨', rate: '$120/hr' },
    { name: 'Elena Rostova', role: 'VP of Growth at Stripe', category: 'Marketing', rating: '5.0', sessions: '1.5K', avatar: '📈', rate: '$180/hr' },
    { name: 'Marcus Sterling', role: 'Y-Combinator Partner / Founder', category: 'Startup', rating: '4.9', sessions: '760', avatar: '🚀', rate: '$220/hr' },
    { name: 'Akiro Tanaka', role: 'Senior Cloud Security Lead', category: 'Tech', rating: '4.9', sessions: '540', avatar: '🔐', rate: '$160/hr' },
    { name: 'Sophia Loren', role: 'UX Research Director', category: 'Design', rating: '4.7', sessions: '890', avatar: '🔍', rate: '$130/hr' }
  ]

  const filteredExperts = experts.filter(e => e.category === activeCategory)

  // Calendar Slots (Mon-Fri)
  const calendarDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const calendarSlots = [
    { day: 'Mon', time: '09:00 AM', status: 'Booked', user: 'Alex K.' },
    { day: 'Mon', time: '11:00 AM', status: 'Available' },
    { day: 'Tue', time: '10:00 AM', status: 'Available' },
    { day: 'Tue', time: '02:00 PM', status: 'Booked', user: 'Julia R.' },
    { day: 'Wed', time: '11:00 AM', status: 'Available' },
    { day: 'Wed', time: '04:00 PM', status: 'Buffer' },
    { day: 'Thu', time: '09:00 AM', status: 'Available' },
    { day: 'Thu', time: '01:00 PM', status: 'Booked', user: 'Liam P.' },
    { day: 'Fri', time: '11:00 AM', status: 'Available' },
    { day: 'Fri', time: '03:00 PM', status: 'Available' }
  ]

  const faqs = [
    { q: 'How do timezone differences work?', a: 'All availability schedules are dynamically adjusted and displayed in your local timezone automatically.' },
    { q: 'Can I reschedule or cancel a session?', a: 'Yes. Rescheduling can be done up to 12 hours before a session starts via your booking management dashboard.' },
    { q: 'What tools are used to run meetings?', a: 'The platform contains built-in browser-based secure video rooms. No extra software downloads are required.' }
  ]

  return (
    <div className="premium-booking-page">
      {/* Toast Alert */}
      {showToast && (
        <div className="live-toast-alert">
          <div className="toast-icon">✨</div>
          <div className="toast-text">
            <strong>Booking Request Sent!</strong>
            <span>Check your dashboard or email for details.</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <nav className="landing-navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <span className="logo-symbol">◆</span>
            <span className="logo-text">Sessions</span>
          </div>
          <div className="navbar-actions">
            <Link to="/login" className="nav-btn-signin">Sign In</Link>
            <Link to="/register" className="nav-btn-register">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* SECTION 1: Immersive Hero Section & Booking Experience */}
      <header className="booking-hero">
        <div className="hero-mesh"></div>
        <div className="hero-content-container">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="live-pulse"></span>
              14,290+ Active Bookings Today
            </div>
            <h1 className="hero-title-main">
              The premier infrastructure for <span className="gradient-highlight">expert sessions</span>
            </h1>
            <p className="hero-subtext">
              Accelerate your knowledge flow. Book verified industry leads, manage time slots, and collaborate in ultra-premium video spaces.
            </p>
            <div className="hero-metrics-pill">
              <div className="metric-item">
                <strong>500+</strong>
                <span>Experts Vetted</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <strong>12s</strong>
                <span>Avg Match Speed</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <strong>99.8%</strong>
                <span>Uptime</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            {/* Interactive Hero Booking Card */}
            <div className="hero-interactive-card">
              <div className="card-header-main">
                <div className="curator-info">
                  <div className="curator-img">👤</div>
                  <div>
                    <h3>Sarah Jenkins</h3>
                    <p>Google Principal Systems Lead</p>
                  </div>
                </div>
                <span className="rate-badge">$150/hr</span>
              </div>

              {!bookingConfirmed ? (
                <div className="interactive-booking-body">
                  <div className="date-picker-group">
                    <label>Select Date</label>
                    <div className="date-selector-row">
                      {['Today', 'Tomorrow', 'Jun 6'].map(date => (
                        <button
                          key={date}
                          className={`date-chip ${selectedDate === date ? 'active' : ''}`}
                          onClick={() => setSelectedDate(date)}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="time-picker-group">
                    <label>Select Availability Slot</label>
                    <div className="slots-grid-hero">
                      {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map(time => (
                        <button
                          key={time}
                          className={`time-chip ${selectedTime === time ? 'active' : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    className={`confirm-hero-booking-btn ${!selectedTime ? 'disabled' : ''}`}
                    disabled={!selectedTime}
                    onClick={handleConfirmBooking}
                  >
                    Confirm Booking for {selectedDate} {selectedTime ? `@ ${selectedTime}` : ''}
                  </button>
                </div>
              ) : (
                <div className="interactive-booking-success">
                  <div className="success-lottie">✓</div>
                  <h4>Appointment Confirmed!</h4>
                  <p>A video link, calendar invite, and notification alert have been generated.</p>
                  <div className="summary-box">
                    <div><strong>Expert:</strong> Sarah Jenkins</div>
                    <div><strong>Time:</strong> {selectedDate} at {selectedTime}</div>
                    <div><strong>Platform:</strong> Native SafeRoom Video</div>
                  </div>
                  <button className="reset-booking-btn" onClick={handleResetBooking}>
                    Book Another Slot
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 2: Expert Discovery Showcase */}
      <section className="landing-section section-discovery">
        <div className="section-head">
          <span className="section-badge">02 // EXPLORE</span>
          <h2>Connect with vetted specialists</h2>
          <p>Filter through verified global leaders. Book live consultations instantly.</p>
        </div>

        <div className="filter-tabs-row">
          {['Tech', 'Design', 'Marketing', 'Startup'].map(cat => (
            <button
              key={cat}
              className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="experts-grid-showcase">
          {filteredExperts.map((exp, idx) => (
            <div key={idx} className="expert-showcase-card">
              <div className="exp-card-header">
                <div className="exp-avatar">{exp.avatar}</div>
                <div className="exp-details">
                  <h3>{exp.name}</h3>
                  <p>{exp.role}</p>
                </div>
              </div>
              <div className="exp-card-body">
                <div className="exp-stat-item">
                  <span>Rating</span>
                  <strong>★ {exp.rating}</strong>
                </div>
                <div className="exp-stat-item">
                  <span>Sessions Completed</span>
                  <strong>{exp.sessions}</strong>
                </div>
              </div>
              <div className="exp-card-footer">
                <span className="footer-rate">{exp.rate}</span>
                <button className="footer-book-btn">Schedule Session</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Live Calendar & Availability Preview */}
      <section className="landing-section section-calendar">
        <div className="section-head">
          <span className="section-badge">03 // AVAILABILITY</span>
          <h2>Live Scheduler Grid</h2>
          <p>Real-time slot allocation. Click an available slot to preview the booking workflow.</p>
        </div>

        <div className="calendar-widget-preview">
          <div className="calendar-header-strip">
            <h3>Weekly Planner (GMT -5)</h3>
            <div className="calendar-legend">
              <span className="legend-dot available"></span> Available
              <span className="legend-dot booked"></span> Booked
            </div>
          </div>

          <div className="calendar-grid-cols">
            {calendarDays.map(day => (
              <div key={day} className="calendar-col">
                <div className="col-day-header">{day}</div>
                <div className="col-slots-list">
                  {calendarSlots.filter(s => s.day === day).map((slot, idx) => {
                    const isSelected = selectedCalendarSlot === `${day}-${slot.time}`
                    return (
                      <div
                        key={idx}
                        className={`calendar-slot-box ${slot.status.toLowerCase()} ${isSelected ? 'selected' : ''}`}
                        onClick={() => slot.status === 'Available' && setSelectedCalendarSlot(`${day}-${slot.time}`)}
                      >
                        <span className="slot-time-text">{slot.time}</span>
                        {slot.status === 'Booked' && <span className="slot-user-tag">Booked ({slot.user})</span>}
                        {slot.status === 'Buffer' && <span className="slot-buffer-tag">Buffer Space</span>}
                        {slot.status === 'Available' && (
                          <span className="slot-action-tag">
                            {isSelected ? 'Selected' : 'Book'}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Session Management Dashboard Preview */}
      <section className="landing-section section-dashboard-preview">
        <div className="section-head">
          <span className="section-badge">04 // INTERCONNECT</span>
          <h2>The Session Dashboard</h2>
          <p>Manage, prep, and launch sessions from a single unified control hub.</p>
        </div>

        <div className="dashboard-console-mockup">
          <div className="console-sidebar">
            <div className="sidebar-logo">◆ Sessions</div>
            <div className="sidebar-links">
              <div className="link-item active">📅 Dashboard</div>
              <div className="link-item">👥 My Mentors</div>
              <div className="link-item">📊 Reports</div>
              <div className="link-item">⚙️ Integration Settings</div>
            </div>
          </div>
          <div className="console-main">
            <div className="console-nav">
              <h3>Upcoming Appointments</h3>
              <span className="live-status-pill">System Syncing</span>
            </div>
            
            <div className="dashboard-content-split">
              <div className="dashboard-left-pane">
                <div className="live-session-feed-card">
                  <div className="feed-card-header">
                    <span className="live-tag">LIVE NOW</span>
                    <span className="session-type">1:1 Tech Advisory</span>
                  </div>
                  <h4>Scale Infrastructure Setup</h4>
                  <p>with Sarah Jenkins (Google)</p>
                  <div className="feed-card-footer">
                    <span className="time-remaining-counter">Time Left: 24:19</span>
                    <button className="join-room-btn">Join Video Room</button>
                  </div>
                </div>

                <div className="upcoming-list-mini">
                  <div className="mini-appointment-card">
                    <div className="mini-card-left">
                      <strong>Jun 5, 2:30 PM</strong>
                      <span>Meta Designer Consultation</span>
                    </div>
                    <button className="btn-manage">Reschedule</button>
                  </div>
                </div>
              </div>

              <div className="dashboard-right-pane">
                <div className="notes-shared-notebook">
                  <h4>Shared Session Notebook</h4>
                  <div className="notebook-line">✓ Define scaling priorities</div>
                  <div className="notebook-line">✓ Check database bottlenecks</div>
                  <div className="notebook-line typing">↳ Waiting for expert notes...<span className="cursor-indicator">|</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Automated Reminders & Notifications */}
      <section className="landing-section section-reminders">
        <div className="section-head">
          <span className="section-badge">05 // ENGAGEMENT</span>
          <h2>Zero No-Shows Infrastructure</h2>
          <p>Our smart delivery engine handles triggers to SMS, Slack, and email channels.</p>
        </div>

        <div className="reminders-flex-row">
          <div className="notification-card-mock sms">
            <div className="mock-header">
              <span>SMS Alert</span>
              <span>Just Now</span>
            </div>
            <p><strong>Reminder:</strong> Your session with Sarah Jenkins starts in 10 minutes. Click to join: s.mp/39f0a</p>
          </div>

          <div className="notification-card-mock slack">
            <div className="mock-header">
              <span>Slack Integration</span>
              <span>5m ago</span>
            </div>
            <p><strong>@Sessions App:</strong> Appointment confirmed with Marcus Sterling for Tomorrow at 02:00 PM.</p>
          </div>

          <div className="notification-card-mock email">
            <div className="mock-header">
              <span>Calendar Event</span>
              <span>10m ago</span>
            </div>
            <p><strong>Google Calendar:</strong> Invitation accepted for 1:1 Growth Consult.</p>
          </div>
        </div>
      </section>

      {/* SECTION 6: Reviews & Success Stories */}
      <section className="landing-section section-reviews">
        <div className="section-head">
          <span className="section-badge">06 // TESTIMONIALS</span>
          <h2>Endorsed by high performers</h2>
          <p>See how teams use live sessions to unlock technical development blocks.</p>
        </div>

        <div className="reviews-dense-grid">
          <div className="review-box">
            <p className="review-quote">"This platform saved us weeks of architecture planning. Booking Sarah Jenkins was straightforward, and the built-in call room worked perfectly."</p>
            <div className="review-author">
              <div className="author-details">
                <strong>Tarun Mehta</strong>
                <span>CTO, Veloce</span>
              </div>
            </div>
          </div>

          <div className="review-box">
            <p className="review-quote">"As a mentor, the automated invoicing and availability calendars cut my management overhead to zero. An absolute game-changer."</p>
            <div className="review-author">
              <div className="author-details">
                <strong>Elena Rostova</strong>
                <span>VP Growth, Stripe</span>
              </div>
            </div>
          </div>

          <div className="review-box">
            <p className="review-quote">"Simple scheduling across timezones, clean interface. Rescheduling is smooth. Highly recommended."</p>
            <div className="review-author">
              <div className="author-details">
                <strong>Julian V.</strong>
                <span>Product Designer, Airbnb</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Analytics & Session Insights */}
      <section className="landing-section section-analytics">
        <div className="section-head">
          <span className="section-badge">07 // INSIGHTS</span>
          <h2>Platform Performance Analytics</h2>
          <p>Monitor hours, feedback ratings, and growth metrics over time.</p>
        </div>

        <div className="analytics-dashboard-preview">
          <div className="analytics-stats-strip">
            <div className="a-metric">
              <span>Total Hours Completed</span>
              <strong>14,290 hrs</strong>
            </div>
            <div className="a-metric">
              <span>Average Rating</span>
              <strong>4.92 ★</strong>
            </div>
            <div className="a-metric">
              <span>Repeat Booking Rate</span>
              <strong>84.2%</strong>
            </div>
          </div>

          <div className="chart-area-visual">
            <div className="chart-title">Completed Sessions Over Time</div>
            <div className="chart-placeholder-svg">
              <svg viewBox="0 0 600 200" className="svg-line-chart">
                <path d="M 0 150 Q 150 100 300 130 T 600 40" fill="none" stroke="#6366f1" strokeWidth="4" />
                <circle cx="150" cy="115" r="6" fill="#ec4899" />
                <circle cx="300" cy="130" r="6" fill="#6366f1" />
                <circle cx="490" cy="65" r="6" fill="#6366f1" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: Multi-role Support */}
      <section className="landing-section section-roles">
        <div className="section-head">
          <span className="section-badge">08 // MULTI-ROLE</span>
          <h2>One Console. Three Views.</h2>
          <p>Tailored dashboards for clients, experts, and administrators.</p>
        </div>

        <div className="role-switcher-tabs">
          {['Learner', 'Expert', 'Admin'].map(role => (
            <button
              key={role}
              className={`role-tab ${activeRole === role ? 'active' : ''}`}
              onClick={() => setActiveRole(role)}
            >
              For {role}s
            </button>
          ))}
        </div>

        <div className="role-console-display">
          {activeRole === 'Learner' && (
            <div className="role-card-preview fade-in">
              <h4>Learner Portal Overview</h4>
              <ul>
                <li>✓ Quick search by skills, company, or tool</li>
                <li>✓ Integrated scheduling with calendar invites</li>
                <li>✓ SafeRoom High-Definition Video access</li>
                <li>✓ Secure booking transaction logs</li>
              </ul>
            </div>
          )}
          {activeRole === 'Expert' && (
            <div className="role-card-preview fade-in">
              <h4>Expert Dashboard Overview</h4>
              <ul>
                <li>✓ Calendar syncing with Google Calendar</li>
                <li>✓ Automated payout options and billing reports</li>
                <li>✓ Intake questionnaire customization</li>
                <li>✓ Customized session duration templates</li>
              </ul>
            </div>
          )}
          {activeRole === 'Admin' && (
            <div className="role-card-preview fade-in">
              <h4>Platform Admin Overview</h4>
              <ul>
                <li>✓ Dispute management and refund triggers</li>
                <li>✓ Automated onboarding and expert validation</li>
                <li>✓ Real-time platform usage analytics</li>
                <li>✓ Custom email and branding rules</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 9: Conversion Section & FAQ */}
      <footer className="conversion-footer">
        <div className="footer-gradient"></div>
        <div className="footer-container-inner">
          <div className="footer-cta-box">
            <h2>Ready to transform your scheduling workflow?</h2>
            <p>Join thousands of professionals scheduling sessions globally.</p>
            <div className="footer-buttons">
              <Link to="/sessions" className="footer-btn-primary">Explore Experts</Link>
              <Link to="/login" className="footer-btn-secondary">Register Free</Link>
            </div>
          </div>

          {/* Accordion FAQ */}
          <div className="footer-faq-accordion">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <button className="faq-question-btn" onClick={() => toggleFaq(idx)}>
                    <span>{faq.q}</span>
                    <span>{openFaq === idx ? '−' : '+'}</span>
                  </button>
                  {openFaq === idx && (
                    <div className="faq-answer-panel">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="copyright-bar">
            <span>© 2026 Session & Appointment Booking Platform. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
