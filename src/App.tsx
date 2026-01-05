import { useState, useEffect } from 'react'
import './App.css'
import logoImage from './assets/images/logo.png'
import {
  // Navigation & General
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  
  // Features
  Bot,
  MessageCircleQuestion,
  FileText,
  CalendarDays,
  Trophy,
  Cast,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  
  // Subjects
  Calculator,
  FlaskConical,
  BookOpen,
  Languages,
  Atom,
  TestTube,
  Dna,
  Globe,
  
  // Stats & Progress
  Flame,
  Star,
  Award,
  Clock,
  CheckCircle,
  Play,
  
  // Social Media
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  
  // Steps
  Smartphone,
  BookMarked,
  GraduationCap,
  
  // Misc
  Download,
  Users,
  Heart,
  Shield,
  Headphones,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      // Close mobile menu on scroll
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <div className="app">
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <a href="#" className="logo">
            <img src={logoImage} alt="AI Tutor" className="logo-image" />
            <span>AI Tutor</span>
          </a>
          
          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#features" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="nav-link" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
            <a href="#subjects" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Subjects</a>
            <a href="#pricing" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            
            {/* Mobile-only buttons */}
            <div className="mobile-nav-buttons">
              <button className="btn btn-outline" style={{width: '100%'}}>Login</button>
              <button className="btn btn-primary" style={{width: '100%'}}>
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="nav-buttons">
            <button className="btn btn-outline">Login</button>
            <button className="btn btn-primary">
              Get Started
              <ArrowRight size={16} />
            </button>
          </div>
          
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <Sparkles size={14} />
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
                <Download size={20} />
                Download App
              </button>
              <button className="btn btn-outline btn-large">
                <Play size={20} />
                Watch Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">
                  <Users size={24} className="hero-stat-icon" />
                  50K+
                </div>
                <div className="hero-stat-label">Active Students</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">
                  <BookOpen size={24} className="hero-stat-icon" />
                  1M+
                </div>
                <div className="hero-stat-label">Lessons Completed</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">
                  <Star size={24} className="hero-stat-icon" />
                  4.9
                </div>
                <div className="hero-stat-label">App Rating</div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            {/* Floating Cards */}
            <div className="floating-card floating-card-1">
              <div className="floating-icon" style={{background: '#FEE2E2', color: '#EF4444'}}>
                <Flame size={20} />
              </div>
              <div>
                <div className="floating-text">15 Day Streak!</div>
                <div className="floating-subtext">Keep it going</div>
              </div>
            </div>
            
            <div className="floating-card floating-card-2">
              <div className="floating-icon" style={{background: '#FEF3C7', color: '#F59E0B'}}>
                <Star size={20} />
              </div>
              <div>
                <div className="floating-text">+50 XP</div>
                <div className="floating-subtext">Quiz completed</div>
              </div>
            </div>
            
            <div className="floating-card floating-card-3">
              <div className="floating-icon" style={{background: '#DCFCE7', color: '#22C55E'}}>
                <Target size={20} />
              </div>
              <div>
                <div className="floating-text">95%</div>
                <div className="floating-subtext">Accuracy</div>
              </div>
            </div>
            
            {/* Phone Mockup */}
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="phone-notch"></div>
                <div className="phone-content">
                  <div className="phone-header">
                    <div>
                      <div className="phone-greeting">Good Morning</div>
                      <div className="phone-name">Rahul</div>
                    </div>
                    <div className="phone-avatar">R</div>
                  </div>
                  
                  <div className="phone-stats">
                    <div className="phone-stat-card">
                      <Flame size={18} color="#EF4444" />
                      <div className="phone-stat-value">15</div>
                      <div className="phone-stat-label">Streak</div>
                    </div>
                    <div className="phone-stat-card">
                      <Star size={18} color="#F59E0B" />
                      <div className="phone-stat-value">2,450</div>
                      <div className="phone-stat-label">XP</div>
                    </div>
                  </div>
                  
                  <div className="phone-continue">
                    <div className="phone-continue-header">
                      <Play size={16} />
                      <span>Continue Learning</span>
                    </div>
                    <div className="phone-continue-topic">Quadratic Equations</div>
                  </div>
                  
                  <div className="phone-subjects">
                    <div className="phone-subject">
                      <div className="phone-subject-icon" style={{background: '#FFF7ED', color: '#F97316'}}>
                        <Calculator size={18} />
                      </div>
                      <div className="phone-subject-info">
                        <div className="phone-subject-name">Mathematics</div>
                        <div className="phone-subject-progress">12/20 chapters</div>
                        <div className="phone-progress-bar">
                          <div className="phone-progress-fill" style={{width: '60%', background: '#F97316'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="phone-subject">
                      <div className="phone-subject-icon" style={{background: '#F0FDF4', color: '#22C55E'}}>
                        <FlaskConical size={18} />
                      </div>
                      <div className="phone-subject-info">
                        <div className="phone-subject-name">Science</div>
                        <div className="phone-subject-progress">8/15 chapters</div>
                        <div className="phone-progress-bar">
                          <div className="phone-progress-fill" style={{width: '53%', background: '#22C55E'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="phone-subject">
                      <div className="phone-subject-icon" style={{background: '#F5F3FF', color: '#8B5CF6'}}>
                        <BookOpen size={18} />
                      </div>
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
            <div className="section-badge">
              <Sparkles size={14} />
              Features
            </div>
            <h2 className="section-title">Everything You Need to Excel</h2>
            <p className="section-description">
              Our AI-powered platform provides all the tools you need to learn effectively and achieve your academic goals.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#FFF7ED', color: '#F97316'}}>
                <Bot size={28} />
              </div>
              <h3 className="feature-title">AI-Powered Teaching</h3>
              <p className="feature-description">
                Our advanced AI adapts to your learning pace and style, providing personalized explanations that make complex topics easy to understand.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#EFF6FF', color: '#3B82F6'}}>
                <MessageCircleQuestion size={28} />
              </div>
              <h3 className="feature-title">Instant Doubt Resolution</h3>
              <p className="feature-description">
                Ask any question, anytime. Get instant, detailed answers from our AI tutor that helps you understand concepts deeply.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#F0FDF4', color: '#22C55E'}}>
                <FileText size={28} />
              </div>
              <h3 className="feature-title">Interactive Quizzes</h3>
              <p className="feature-description">
                Test your knowledge with adaptive quizzes that adjust difficulty based on your performance. Track your progress in real-time.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#FDF2F8', color: '#EC4899'}}>
                <CalendarDays size={28} />
              </div>
              <h3 className="feature-title">Smart Study Plans</h3>
              <p className="feature-description">
                AI-generated study schedules that optimize your learning time. Stay on track with personalized daily goals and reminders.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#FEF3C7', color: '#F59E0B'}}>
                <Trophy size={28} />
              </div>
              <h3 className="feature-title">Gamified Learning</h3>
              <p className="feature-description">
                Earn XP, maintain streaks, unlock achievements, and compete on leaderboards. Learning has never been this fun!
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{background: '#ECFEFF', color: '#06B6D4'}}>
                <Cast size={28} />
              </div>
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
            <div className="section-badge">
              <Zap size={14} />
              Simple Steps
            </div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Get started in minutes and begin your personalized learning journey.
            </p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">
                <Smartphone size={32} />
              </div>
              <h3 className="step-title">Download & Sign Up</h3>
              <p className="step-description">
                Download the app and create your profile. Select your board, class, and subjects.
              </p>
            </div>
            
            <div className="step">
              <div className="step-number">
                <Target size={32} />
              </div>
              <h3 className="step-title">Get Your Study Plan</h3>
              <p className="step-description">
                AI creates a personalized study plan based on your goals and available time.
              </p>
            </div>
            
            <div className="step">
              <div className="step-number">
                <BookMarked size={32} />
              </div>
              <h3 className="step-title">Learn & Practice</h3>
              <p className="step-description">
                Study with AI-powered lessons, ask doubts, and test your knowledge with quizzes.
              </p>
            </div>
            
            <div className="step">
              <div className="step-number">
                <GraduationCap size={32} />
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
            <div className="section-badge">
              <BookOpen size={14} />
              Curriculum
            </div>
            <h2 className="section-title">All Subjects Covered</h2>
            <p className="section-description">
              CBSE, ICSE, and State Board curriculum from Class 6 to 12.
            </p>
          </div>
          
          <div className="subjects-grid">
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#FFF7ED', color: '#F97316'}}>
                <Calculator size={32} />
              </div>
              <h3 className="subject-name">Mathematics</h3>
              <p className="subject-chapters">150+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#F0FDF4', color: '#22C55E'}}>
                <FlaskConical size={32} />
              </div>
              <h3 className="subject-name">Science</h3>
              <p className="subject-chapters">120+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#F5F3FF', color: '#8B5CF6'}}>
                <BookOpen size={32} />
              </div>
              <h3 className="subject-name">English</h3>
              <p className="subject-chapters">100+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#FDF2F8', color: '#EC4899'}}>
                <Languages size={32} />
              </div>
              <h3 className="subject-name">Hindi</h3>
              <p className="subject-chapters">80+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#EFF6FF', color: '#3B82F6'}}>
                <Atom size={32} />
              </div>
              <h3 className="subject-name">Physics</h3>
              <p className="subject-chapters">90+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#F0FDFA', color: '#14B8A6'}}>
                <TestTube size={32} />
              </div>
              <h3 className="subject-name">Chemistry</h3>
              <p className="subject-chapters">85+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#F7FEE7', color: '#84CC16'}}>
                <Dna size={32} />
              </div>
              <h3 className="subject-name">Biology</h3>
              <p className="subject-chapters">95+ Chapters</p>
            </div>
            
            <div className="subject-card">
              <div className="subject-icon" style={{background: '#EEF2FF', color: '#6366F1'}}>
                <Globe size={32} />
              </div>
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
            <div className="section-badge">
              <Heart size={14} />
              Testimonials
            </div>
            <h2 className="section-title">Loved by Students & Parents</h2>
            <p className="section-description">
              See what our community has to say about their learning experience.
            </p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#FBBF24" color="#FBBF24" />
                ))}
              </div>
              <p className="testimonial-text">
                "AI Tutor helped me improve my Math scores from 65% to 92% in just 3 months! The personalized explanations are amazing."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <div className="testimonial-name">Rahul Sharma</div>
                  <div className="testimonial-role">Class 10, CBSE</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#FBBF24" color="#FBBF24" />
                ))}
              </div>
              <p className="testimonial-text">
                "As a parent, I love how the app tracks my daughter's progress. The gamification keeps her motivated to study every day!"
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <Users size={20} />
                </div>
                <div>
                  <div className="testimonial-name">Priya Patel</div>
                  <div className="testimonial-role">Parent</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#FBBF24" color="#FBBF24" />
                ))}
              </div>
              <p className="testimonial-text">
                "The instant doubt resolution feature is a game-changer. I can ask questions anytime and get detailed explanations instantly!"
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <Award size={20} />
                </div>
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
            <div className="section-badge">
              <Zap size={14} />
              Pricing
            </div>
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
                <li><CheckCircle size={16} /> 3 Subjects</li>
                <li><CheckCircle size={16} /> 5 Doubts per day</li>
                <li><CheckCircle size={16} /> Basic quizzes</li>
                <li><CheckCircle size={16} /> Progress tracking</li>
              </ul>
              <button className="btn btn-outline" style={{width: '100%'}}>Get Started</button>
            </div>
            
            <div className="pricing-card popular">
              <div className="pricing-badge">Most Popular</div>
              <h3 className="pricing-name">Pro</h3>
              <div className="pricing-price">₹299<span>/month</span></div>
              <p className="pricing-description">Best for serious learners</p>
              <ul className="pricing-features">
                <li><CheckCircle size={16} /> All Subjects</li>
                <li><CheckCircle size={16} /> Unlimited Doubts</li>
                <li><CheckCircle size={16} /> Advanced quizzes</li>
                <li><CheckCircle size={16} /> AI Study Plans</li>
                <li><CheckCircle size={16} /> Progress reports</li>
                <li><CheckCircle size={16} /> Priority support</li>
              </ul>
              <button className="btn btn-primary" style={{width: '100%'}}>Start Free Trial</button>
            </div>
            
            <div className="pricing-card">
              <h3 className="pricing-name">Annual</h3>
              <div className="pricing-price">₹1999<span>/year</span></div>
              <p className="pricing-description">Save 44% annually</p>
              <ul className="pricing-features">
                <li><CheckCircle size={16} /> Everything in Pro</li>
                <li><CheckCircle size={16} /> Offline access</li>
                <li><CheckCircle size={16} /> Parent dashboard</li>
                <li><CheckCircle size={16} /> Performance analytics</li>
                <li><CheckCircle size={16} /> Certificate on completion</li>
              </ul>
              <button className="btn btn-outline" style={{width: '100%'}}>Choose Plan</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Start Learning?</h2>
          <p className="cta-description">
            Join thousands of students who are already learning smarter with AI Tutor. 
            Download now and get 7 days of Pro features free!
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large">
              <Download size={20} />
              Download Free App
            </button>
          </div>
          <div className="app-badges">
            <a href="#" className="app-badge">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="app-badge-text">
                <div className="app-badge-small">Download on the</div>
                <div className="app-badge-big">App Store</div>
              </div>
            </a>
            <a href="#" className="app-badge">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
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
                <a href="#" className="social-link" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="social-link" aria-label="YouTube">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
            
            <div className="footer-column">
              <h4>Product</h4>
              <ul className="footer-links">
                <li><a href="#features"><ChevronRight size={14} /> Features</a></li>
                <li><a href="#pricing"><ChevronRight size={14} /> Pricing</a></li>
                <li><a href="#subjects"><ChevronRight size={14} /> Subjects</a></li>
                <li><a href="#"><ChevronRight size={14} /> Download App</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#"><ChevronRight size={14} /> About Us</a></li>
                <li><a href="#"><ChevronRight size={14} /> Careers</a></li>
                <li><a href="#"><ChevronRight size={14} /> Blog</a></li>
                <li><a href="#"><ChevronRight size={14} /> Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Support</h4>
              <ul className="footer-links">
                <li><a href="#"><ChevronRight size={14} /> Help Center</a></li>
                <li><a href="#"><ChevronRight size={14} /> FAQs</a></li>
                <li><a href="#"><ChevronRight size={14} /> Community</a></li>
                <li><a href="#"><ChevronRight size={14} /> Feedback</a></li>
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
