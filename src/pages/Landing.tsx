/**
 * Landing Page - AI Tutor
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  MessageCircle,
  FileText,
  Calendar,
  Trophy,
  Tv,
  ArrowRight,
  Check,
  Star,
  Flame,
  Target,
  Play,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Users,
  Clock,
  Shield,
  TrendingUp,
  BookOpen,
  Calculator,
  FlaskConical,
  Languages,
  Atom,
  TestTube,
  Dna,
  Globe,
  Zap,
  Award,
  BarChart3,
  GraduationCap,
  Lightbulb,
  CheckCircle,
} from 'lucide-react';
import logoImage from '../assets/images/logo.png';
import './Landing.css';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Teaching',
    description: 'Personalized lessons that adapt to your learning style and pace',
    color: '#F97316',
  },
  {
    icon: MessageCircle,
    title: 'Instant Doubt Resolution',
    description: 'Ask questions anytime and get detailed explanations within seconds',
    color: '#3B82F6',
  },
  {
    icon: FileText,
    title: 'Smart Quizzes',
    description: 'AI-generated quizzes that test your understanding effectively',
    color: '#22C55E',
  },
  {
    icon: Calendar,
    title: 'Study Planner',
    description: 'Personalized study plans based on your goals and schedule',
    color: '#8B5CF6',
  },
  {
    icon: Trophy,
    title: 'Gamified Learning',
    description: 'Earn XP, maintain streaks, and compete on leaderboards',
    color: '#F59E0B',
  },
  {
    icon: Tv,
    title: 'Screen Casting',
    description: 'Cast lessons to TV for a better learning experience',
    color: '#14B8A6',
  },
];

const subjects = [
  { name: 'Mathematics', icon: Calculator, color: '#F97316' },
  { name: 'Science', icon: FlaskConical, color: '#22C55E' },
  { name: 'English', icon: BookOpen, color: '#8B5CF6' },
  { name: 'Hindi', icon: Languages, color: '#EC4899' },
  { name: 'Physics', icon: Atom, color: '#3B82F6' },
  { name: 'Chemistry', icon: TestTube, color: '#14B8A6' },
  { name: 'Biology', icon: Dna, color: '#84CC16' },
  { name: 'Social Science', icon: Globe, color: '#F59E0B' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Class 10 Student',
    initials: 'PS',
    text: 'AI Tutor helped me improve my math scores from 60% to 90%. The explanations are so clear!',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Parent',
    initials: 'RV',
    text: 'My son loves learning with AI Tutor. The gamification keeps him motivated every day.',
    rating: 5,
  },
  {
    name: 'Ananya Patel',
    role: 'Class 8 Student',
    initials: 'AP',
    text: 'I can ask doubts anytime without feeling shy. Its like having a personal tutor 24/7!',
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'Forever',
    description: 'Get started with basic features',
    features: [
      '5 AI lessons per day',
      '10 doubt questions per day',
      'Basic progress tracking',
      '2 subjects access',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹299',
    period: 'per month',
    description: 'Everything you need to excel',
    features: [
      'Unlimited AI lessons',
      'Unlimited doubt questions',
      'All subjects access',
      'Detailed analytics',
      'Personalized study plans',
      'Priority support',
    ],
    cta: 'Get Pro',
    popular: true,
  },
  {
    name: 'Annual',
    price: '₹1999',
    period: 'per year',
    description: 'Best value - Save 44%',
    features: [
      'Everything in Pro',
      'Family sharing (up to 3)',
      'Offline mode',
      'Early access to new features',
      '1-on-1 doubt sessions',
      'Certificate of completion',
    ],
    cta: 'Get Annual',
    popular: false,
  },
];

const steps = [
  { number: '01', title: 'Sign Up', description: 'Create your free account in seconds', icon: Users },
  { number: '02', title: 'Choose Subject', description: 'Select from CBSE, ICSE, or State boards', icon: BookOpen },
  { number: '03', title: 'Start Learning', description: 'Get personalized AI-powered lessons', icon: Lightbulb },
  { number: '04', title: 'Track Progress', description: 'Monitor your improvement daily', icon: BarChart3 },
];

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="logo">
            <img src={logoImage} alt="AI Tutor" />
            <span>AI Tutor</span>
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#features" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="nav-link" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
            <a href="#subjects" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Subjects</a>
            <a href="#pricing" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            
            <div className="mobile-nav-buttons">
              <Link to="/login" className="btn btn-outline" style={{width: '100%'}}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{width: '100%'}}>
                Get Started
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="nav-buttons">
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>AI-Powered Education Platform</span>
            </div>
            <h1>
              Learn Smarter with <span className="gradient-text">AI Tutor</span>
            </h1>
            <p className="hero-description">
              Experience personalized education that adapts to your learning style.
              Get instant doubt resolution, smart quizzes, and track your progress - all powered by AI.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <Users size={20} />
                <span><strong>50K+</strong> Students</span>
              </div>
              <div className="hero-stat">
                <Star size={20} />
                <span><strong>4.8</strong> Rating</span>
              </div>
              <div className="hero-stat">
                <Clock size={20} />
                <span><strong>24/7</strong> Support</span>
              </div>
            </div>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Start Learning Free
                <ArrowRight size={20} />
              </Link>
              <button className="btn btn-video">
                <div className="play-btn">
                  <Play size={20} />
                </div>
                Watch Demo
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="phone-mockup">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                <div className="app-header">
                  <img src={logoImage} alt="AI Tutor" className="app-logo" />
                  <span>AI Tutor</span>
                </div>
                <div className="app-greeting">
                  <span>Good Morning! 👋</span>
                  <h3>Ready to learn?</h3>
                </div>
                <div className="app-stats">
                  <div className="app-stat">
                    <Flame size={16} color="#EF4444" />
                    <span>15 days</span>
                  </div>
                  <div className="app-stat">
                    <Star size={16} color="#F59E0B" />
                    <span>2,450 XP</span>
                  </div>
                </div>
                <div className="app-subjects">
                  <div className="app-subject math">
                    <Calculator size={20} color="#F97316" />
                  </div>
                  <div className="app-subject science">
                    <FlaskConical size={20} color="#22C55E" />
                  </div>
                  <div className="app-subject english">
                    <BookOpen size={20} color="#8B5CF6" />
                  </div>
                  <div className="app-subject hindi">
                    <Languages size={20} color="#EC4899" />
                  </div>
                </div>
                <div className="app-progress">
                  <span>Today's Progress</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '65%' }}></div>
                  </div>
                  <span>65% Complete</span>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="floating-card card-streak">
              <Flame size={24} color="#EF4444" />
              <div>
                <span className="card-value">15</span>
                <span className="card-label">Day Streak</span>
              </div>
            </div>
            <div className="floating-card card-xp">
              <Star size={24} color="#F59E0B" />
              <div>
                <span className="card-value">2,450</span>
                <span className="card-label">XP Earned</span>
              </div>
            </div>
            <div className="floating-card card-accuracy">
              <Target size={24} color="#22C55E" />
              <div>
                <span className="card-value">92%</span>
                <span className="card-label">Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2>Everything You Need to Excel</h2>
            <p>Powerful features designed to make learning effective and enjoyable</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <div className="feature-icon" style={{ background: `${feature.color}15`, color: feature.color }}>
                    <Icon size={28} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">How It Works</span>
            <h2>Start Learning in 4 Simple Steps</h2>
            <p>Getting started is quick and easy</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="step-card">
                  <div className="step-number">
                    <Icon size={28} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  {index < steps.length - 1 && <div className="step-arrow"><ChevronRight size={24} /></div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="subjects">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Subjects</span>
            <h2>All Subjects Covered</h2>
            <p>From CBSE to ICSE, we've got you covered</p>
          </div>
          <div className="subjects-grid">
            {subjects.map((subject, index) => {
              const Icon = subject.icon;
              return (
                <div key={index} className="subject-card" style={{ borderColor: subject.color }}>
                  <div className="subject-icon-wrap" style={{ background: `${subject.color}15`, color: subject.color }}>
                    <Icon size={28} />
                  </div>
                  <span className="subject-name">{subject.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2>Loved by Students & Parents</h2>
            <p>See what our users are saying</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{testimonial.initials}</div>
                  <div>
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
                <p>"{testimonial.text}"</p>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Pricing</span>
            <h2>Simple, Transparent Pricing</h2>
            <p>Choose the plan that's right for you</p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h3>{plan.name}</h3>
                <div className="pricing-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                <p className="pricing-description">{plan.description}</p>
                <ul className="pricing-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <CheckCircle size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'} btn-full`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="section-container">
          <div className="cta-content">
            <h2>Ready to Start Learning?</h2>
            <p>Join 50,000+ students already learning smarter with AI Tutor</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-white btn-large">
                Get Started Free
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="cta-trust">
              <Shield size={20} />
              <span>No credit card required • Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <img src={logoImage} alt="AI Tutor" />
              <span>AI Tutor</span>
            </Link>
            <p>Making quality education accessible to every student through the power of AI.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#subjects">Subjects</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/blog">Blog</Link>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 AI Tutor. All rights reserved. Powered by <a href="https://kasoftware.in/" target="_blank" rel="noopener noreferrer">KA Software</a></p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
