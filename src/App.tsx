import { useState, useEffect } from 'react'
import './App.css'
import logoImage from './assets/images/logo.png'

function App() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app">
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <a href="#" className="logo">
            <img src={logoImage} alt="AI Tutor" className="logo-image" />
            <span>AI Tutor</span>
          </a>
          
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How it Works</a>
            <a href="#subjects" className="nav-link">Subjects</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </div>
          
          <div className="nav-buttons">
            <button className="btn btn-outline">Login</button>
            <button className="btn btn-primary">Get Started</button>
          </div>
          
          <button className="mobile-menu-btn">☰</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              AI-Powered Learning Platform
            </div>
            <h1 className="hero-title">
              Learn Smarter with Your <span>Personal AI Tutor</span>
            </h1>
            <p className="hero-description">
              Experience personalized education with AI that adapts to your learning style. 
              Master any subject with interactive lessons, quizzes, and 24/7 doubt resolution.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-large">
                📱 Download App
              </button>
              <button className="btn btn-outline btn-large">
                ▶️ Watch Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">50K+</div>
                <div className="hero-stat-label">Active Students</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">1M+</div>
                <div className="hero-stat-label">Lessons Completed</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">4.9★</div>
                <div className="hero-stat-label">App Rating</div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            {/* Floating Cards */}
            <div className="floating-card floating-card-1">
              <div className="floating-emoji">🔥</div>
              <div className="floating-text">15 Day Streak!</div>
              <div className="floating-subtext">Keep it going</div>
            </div>
            
            <div className="floating-card floating-card-2">
              <div className="floating-emoji">⭐</div>
              <div className="floating-text">+50 XP</div>
              <div className="floating-subtext">Quiz completed</div>
            </div>
            
            <div className="floating-card floating-card-3">
              <div className="floating-emoji">🎯</div>
              <div className="floating-text">95%</div>
              <div className="floating-subtext">Accuracy</div>
            </div>
            
            {/* Phone Mockup */}
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="phone-notch"></div>
                <div className="phone-content">
                  <div className="phone-header">
                    <div>
                      <div className="phone-greeting">Good Morning 🌅</div>
                      <div className="phone-name">Rahul</div>
                    </div>
                    <div className="phone-avatar">R</div>
                  </div>
                  
                  <div className="phone-stats">
                    <div className="phone-stat-card">
                      <div className="phone-stat-icon">🔥</div>
                      <div className="phone-stat-value">15</div>
                      <div className="phone-stat-label">Streak</div>
                    </div>
                    <div className="phone-stat-card">
                      <div className="phone-stat-icon">⭐</div>
                      <div className="phone-stat-value">2,450</div>
                      <div className="phone-stat-label">XP</div>
                    </div>
                  </div>
                  
                  <div className="phone-continue">
                    <div className="phone-continue-title">▶️ Continue Learning</div>
                    <div className="phone-continue-topic">Quadratic Equations</div>
                  </div>
                  
                  <div className="phone-subjects">
                    <div className="phone-subject">
                      <div className="phone-subject-icon" style={{background: '#FFF7ED'}}>📐</div>
                      <div className="phone-subject-info">
                        <div className="phone-subject-name">Mathematics</div>
                        <div className="phone-subject-progress">12/20 chapters</div>
                        <div className="phone-progress-bar">
                          <div className="phone-progress-fill" style={{width: '60%', background: '#F97316'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="phone-subject">
                      <div className="phone-subject-icon" style={{background: '#F0FDF4'}}>🔬</div>
                      <div className="phone-subject-info">
                        <div className="phone-subject-name">Science</div>
                        <div className="phone-subject-progress">8/15 chapters</div>
                        <div className="phone-progress-bar">
                          <div className="phone-progress-fill" style={{width: '53%', background: '#22C55E'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="phone-subject">
                      <div className="phone-subject-icon" style={{background: '#F5F3FF'}}>📖</div>
                      <div className="phone-subject-info">
                        <div className="phone-subject-name">English</div>
                        <div className="phone-subject-progress">10/18 chapters</div>
                        <div className="phone-progress-bar">
                          <div className="phone-progress-fill" style={{width: '55%', background: '#8B5CF6'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">✨ Features</div>
            <h2 className="section-title">Everything You Need to Excel</h2>
            <p className="section-description">
              Our AI-powered platform provides all the tools you need to learn effectively and achieve your academic goals.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#FFF7ED'}}>🤖</div>
              <h3 className="feature-title">AI-Powered Teaching</h3>
              <p className="feature-description">
                Our advanced AI adapts to your learning pace and style, providing personalized explanations that make complex topics easy to understand.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#EFF6FF'}}>💬</div>
              <h3 className="feature-title">Instant Doubt Resolution</h3>
              <p className="feature-description">
                Ask any question, anytime. Get instant, detailed answers from our AI tutor that helps you understand concepts deeply.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#F0FDF4'}}>📝</div>
              <h3 className="feature-title">Interactive Quizzes</h3>
              <p className="feature-description">
                Test your knowledge with adaptive quizzes that adjust difficulty based on your performance. Track your progress in real-time.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#FDF2F8'}}>📅</div>
              <h3 className="feature-title">Smart Study Plans</h3>
              <p className="feature-description">
                AI-generated study schedules that optimize your learning time. Stay on track with personalized daily goals and reminders.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#FEF3C7'}}>🏆</div>
              <h3 className="feature-title">Gamified Learning</h3>
              <p className="feature-description">
                Earn XP, maintain streaks, unlock achievements, and compete on leaderboards. Learning has never been this fun!
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#ECFEFF'}}>📺</div>
              <h3 className="feature-title">Screen Casting</h3>
              <p className="feature-description">
                Cast your learning sessions to TV for a bigger screen experience. Perfect for visual learners and family study time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">🚀 Simple Steps</div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Get started in minutes and begin your personalized learning journey.
            </p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">
                <span className="step-emoji">📱</span>
              </div>
              <h3 className="step-title">Download & Sign Up</h3>
              <p className="step-description">
                Download the app and create your profile. Select your board, class, and subjects.
              </p>
            </div>
            
            <div className="step">
              <div className="step-number">
                <span className="step-emoji">🎯</span>
              </div>
              <h3 className="step-title">Get Your Study Plan</h3>
              <p className="step-description">
                AI creates a personalized study plan based on your goals and available time.
              </p>
            </div>
            
            <div className="step">
              <div className="step-number">
                <span className="step-emoji">📚</span>
              </div>
              <h3 className="step-title">Learn & Practice</h3>
              <p className="step-description">
                Study with AI-powered lessons, ask doubts, and test your knowledge with quizzes.
              </p>
            </div>
            
            <div className="step">
              <div className="step-number">
                <span className="step-emoji">🏆</span>
              </div>
              <h3 className="step-title">Track & Excel</h3>
              <p className="step-description">
                Monitor your progress, earn rewards, and watch your grades improve!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="subjects" id="subjects">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">📚 Curriculum</div>
            <h2 className="section-title">All Subjects Covered</h2>
            <p className="section-description">
              CBSE, ICSE, and State Board curriculum from Class 6 to 12.
            </p>
          </div>
          
          <div className="subjects-grid">
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#FFF7ED'}}>📐</div>
              <h3 className="subject-name">Mathematics</h3>
              <p className="subject-chapters">150+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#F0FDF4'}}>🔬</div>
              <h3 className="subject-name">Science</h3>
              <p className="subject-chapters">120+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#F5F3FF'}}>📖</div>
              <h3 className="subject-name">English</h3>
              <p className="subject-chapters">100+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#FDF2F8'}}>📚</div>
              <h3 className="subject-name">Hindi</h3>
              <p className="subject-chapters">80+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#EFF6FF'}}>⚛️</div>
              <h3 className="subject-name">Physics</h3>
              <p className="subject-chapters">90+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#F0FDFA'}}>🧪</div>
              <h3 className="subject-name">Chemistry</h3>
              <p className="subject-chapters">85+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#F7FEE7'}}>🧬</div>
              <h3 className="subject-name">Biology</h3>
              <p className="subject-chapters">95+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#EEF2FF'}}>🌍</div>
              <h3 className="subject-name">Social Science</h3>
              <p className="subject-chapters">110+ Chapters</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">💬 Testimonials</div>
            <h2 className="section-title">Loved by Students & Parents</h2>
            <p className="section-description">
              See what our community has to say about their learning experience.
            </p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "AI Tutor helped me improve my Math scores from 65% to 92% in just 3 months! The personalized explanations are amazing."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">👨‍🎓</div>
                <div>
                  <div className="testimonial-name">Rahul Sharma</div>
                  <div className="testimonial-role">Class 10, CBSE</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "As a parent, I love how the app tracks my daughter's progress. The gamification keeps her motivated to study every day!"
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">👩</div>
                <div>
                  <div className="testimonial-name">Priya Patel</div>
                  <div className="testimonial-role">Parent</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "The instant doubt resolution feature is a game-changer. I can ask questions anytime and get detailed explanations instantly!"
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">👩‍🎓</div>
                <div>
                  <div className="testimonial-name">Ananya Reddy</div>
                  <div className="testimonial-role">Class 12, Science</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">💰 Pricing</div>
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-description">
              Choose the plan that fits your learning needs.
            </p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3 className="pricing-name">Free</h3>
              <div className="pricing-price">₹0<span>/month</span></div>
              <p className="pricing-description">Perfect for trying out</p>
              <ul className="pricing-features">
                <li>3 Subjects</li>
                <li>5 Doubts per day</li>
                <li>Basic quizzes</li>
                <li>Progress tracking</li>
              </ul>
              <button className="btn btn-outline" style={{width: '100%'}}>Get Started</button>
            </div>
            
            <div className="pricing-card popular">
              <div className="pricing-badge">Most Popular</div>
              <h3 className="pricing-name">Pro</h3>
              <div className="pricing-price">₹299<span>/month</span></div>
              <p className="pricing-description">Best for serious learners</p>
              <ul className="pricing-features">
                <li>All Subjects</li>
                <li>Unlimited Doubts</li>
                <li>Advanced quizzes</li>
                <li>AI Study Plans</li>
                <li>Progress reports</li>
                <li>Priority support</li>
              </ul>
              <button className="btn btn-primary" style={{width: '100%'}}>Start Free Trial</button>
            </div>
            
            <div className="pricing-card">
              <h3 className="pricing-name">Annual</h3>
              <div className="pricing-price">₹1999<span>/year</span></div>
              <p className="pricing-description">Save 44% annually</p>
              <ul className="pricing-features">
                <li>Everything in Pro</li>
                <li>Offline access</li>
                <li>Parent dashboard</li>
                <li>Performance analytics</li>
                <li>Certificate on completion</li>
              </ul>
              <button className="btn btn-outline" style={{width: '100%'}}>Choose Plan</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Start Learning? 🚀</h2>
          <p className="cta-description">
            Join thousands of students who are already learning smarter with AI Tutor. 
            Download now and get 7 days of Pro features free!
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large">Download Free App</button>
          </div>
          <div className="app-badges">
            <a href="#" className="app-badge">
              <span className="app-badge-icon">🍎</span>
              <div className="app-badge-text">
                <div className="app-badge-small">Download on the</div>
                <div className="app-badge-big">App Store</div>
              </div>
            </a>
            <a href="#" className="app-badge">
              <span className="app-badge-icon">▶️</span>
              <div className="app-badge-text">
                <div className="app-badge-small">Get it on</div>
                <div className="app-badge-big">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src={logoImage} alt="AI Tutor" className="footer-logo-image" />
                <span>AI Tutor</span>
              </div>
              <p className="footer-description">
                AI-powered personalized learning platform helping students excel in their academics through interactive and engaging content.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">📸</a>
                <a href="#" className="social-link">💼</a>
              </div>
            </div>
            
            <div className="footer-column">
              <h4>Product</h4>
              <ul className="footer-links">
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Subjects</a></li>
                <li><a href="#">Download App</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Support</h4>
              <ul className="footer-links">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">Feedback</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2025 AI Tutor. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
