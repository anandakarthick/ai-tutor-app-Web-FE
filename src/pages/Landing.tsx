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
  Loader2,
  Gift,
  Crown,
} from 'lucide-react';
import { subscriptionApi } from '../services/api';
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

const steps = [
  { number: '01', title: 'Sign Up', description: 'Create your free account in seconds', icon: Users },
  { number: '02', title: 'Choose Subject', description: 'Select from CBSE, ICSE, or State boards', icon: BookOpen },
  { number: '03', title: 'Start Learning', description: 'Get personalized AI-powered lessons', icon: Lightbulb },
  { number: '04', title: 'Track Progress', description: 'Monitor your improvement daily', icon: BarChart3 },
];

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

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

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const response = await subscriptionApi.getPlans();
        if (response.success && response.data) {
          // Sort plans: monthly first (durationMonths = 1), then yearly (durationMonths = 12)
          const sortedPlans = response.data.sort((a: any, b: any) => {
            return (a.durationMonths || 1) - (b.durationMonths || 12);
          });
          setPlans(sortedPlans);
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
        // Fallback plans if API fails
        setPlans([
          {
            id: 'monthly',
            name: 'Monthly',
            displayName: 'Monthly Plan',
            price: 299,
            originalPrice: 399,
            durationMonths: 1,
            description: 'Perfect for trying out our platform',
            isPopular: false,
            features: [
              'Unlimited access to all subjects',
              'AI-powered personalized learning',
              'Instant doubt resolution',
              'Progress tracking & analytics',
              'Quizzes & assessments',
              'Study plan generation',
            ],
          },
          {
            id: 'yearly',
            name: 'Yearly',
            displayName: 'Yearly Plan',
            price: 3000,
            originalPrice: 3588,
            durationMonths: 12,
            description: 'Best value! Save ₹588 with annual subscription',
            isPopular: true,
            features: [
              'Everything in Monthly Plan',
              'Priority AI responses',
              'Extended AI usage (120 min/day)',
              'Detailed performance reports',
              'Parent dashboard access',
              'Offline content download',
              'Certificate of completion',
            ],
          },
        ]);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate yearly savings (Monthly price * 12 - Yearly price)
  const calculateSavings = () => {
    const monthlyPlan = plans.find(p => p.durationMonths === 1);
    const yearlyPlan = plans.find(p => p.durationMonths === 12);
    if (!monthlyPlan || !yearlyPlan) return 0;
    return (monthlyPlan.price * 12) - yearlyPlan.price;
  };

  const savings = calculateSavings();

  // Get period text based on duration
  const getPeriodText = (durationMonths: number) => {
    if (durationMonths === 1) return 'month';
    if (durationMonths === 12) return 'year';
    return `${durationMonths} months`;
  };

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
            <a href="#study-plans" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Study Plans</a>
            
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

      {/* Study Plans Section */}
      <section id="study-plans" className="pricing">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Study Plans</span>
            <h2>Choose Your Learning Journey</h2>
            <p>Flexible plans designed for every learner</p>
          </div>
          
          {loadingPlans ? (
            <div className="plans-loading">
              <Loader2 size={40} className="spinner" />
              <p>Loading plans...</p>
            </div>
          ) : (
            <div className="pricing-grid">
              {plans.map((plan, index) => {
                const isYearly = plan.durationMonths === 12;
                const isPopular = plan.isPopular || isYearly;
                
                return (
                  <div key={plan.id || index} className={`pricing-card ${isPopular ? 'popular' : ''}`}>
                    {/* Most Recommended Badge for Yearly */}
                    {isPopular && (
                      <div className="popular-badge">
                        <Star size={14} />
                        Most Recommended
                      </div>
                    )}
                    
                    {/* Plan Header with Icon */}
                    <div className="plan-header">
                      <div className="plan-icon">
                        <Crown size={24} />
                      </div>
                      <h3>{plan.displayName || plan.name}</h3>
                    </div>
                    
                    {/* Pricing */}
                    <div className="pricing-price">
                      {plan.originalPrice && plan.originalPrice > plan.price && (
                        <span className="original-price">{formatPrice(plan.originalPrice)}</span>
                      )}
                      <span className="price">{formatPrice(plan.price)}</span>
                      <span className="period">/{getPeriodText(plan.durationMonths)}</span>
                    </div>
                    
                    {/* Description */}
                    <p className="pricing-description">
                      {plan.description || (isYearly 
                        ? 'Best value for serious learners' 
                        : 'Everything you need to excel')}
                    </p>

                    {/* Savings Badge for Yearly Plan */}
                    {isYearly && savings > 0 && (
                      <div className="savings-badge">
                        <Gift size={16} />
                        <span>Save {formatPrice(savings)}/year</span>
                      </div>
                    )}
                    
                    {/* Features List */}
                    <ul className="pricing-features">
                      {(plan.features || []).slice(0, 6).map((feature: string, i: number) => (
                        <li key={i}>
                          <CheckCircle size={18} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Subscribe Button */}
                    <Link to="/register" className={`btn ${isPopular ? 'btn-primary' : 'btn-outline'} btn-full`}>
                      <Zap size={18} />
                      Subscribe Now
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-badge">
              <Shield size={20} />
              <span>Secure Payments</span>
            </div>
            <div className="trust-badge">
              <TrendingUp size={20} />
              <span>Cancel Anytime</span>
            </div>
            <div className="trust-badge">
              <Award size={20} />
              <span>100% Satisfaction</span>
            </div>
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
              <a href="#study-plans">Study Plans</a>
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
