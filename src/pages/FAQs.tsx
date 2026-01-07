/**
 * FAQs Page
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Search, HelpCircle, CreditCard, BookOpen, User, Settings } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

// Function to generate FAQ categories with dynamic site name
const getFaqCategories = (siteName: string, supportEmail: string) => [
  {
    id: 'general',
    name: 'General',
    icon: HelpCircle,
    faqs: [
      {
        question: `What is ${siteName}?`,
        answer: `${siteName} is an AI-powered educational platform designed to provide personalized learning experiences for K-12 students. Our platform adapts to each student's learning style and pace, offering instant doubt resolution, smart quizzes, and comprehensive progress tracking.`
      },
      {
        question: 'Which boards and classes are supported?',
        answer: `${siteName} supports CBSE, ICSE, and major State Board curricula for classes 1 to 12. We cover all core subjects including Mathematics, Science, English, Hindi, Physics, Chemistry, Biology, and Social Science.`
      },
      {
        question: `Is ${siteName} available in regional languages?`,
        answer: `Yes! ${siteName} supports multiple languages including English, Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, and Gujarati. You can choose your preferred medium of instruction.`
      },
      {
        question: 'How does the AI personalization work?',
        answer: 'Our AI analyzes your learning patterns, strengths, and areas for improvement to create a personalized study plan. The more you use the platform, the better it understands your needs and adapts content accordingly.'
      }
    ]
  },
  {
    id: 'subscription',
    name: 'Subscription & Billing',
    icon: CreditCard,
    faqs: [
      {
        question: 'What subscription plans are available?',
        answer: 'We offer two plans: Monthly (₹299/month) and Yearly (₹3,000/year). The yearly plan saves you ₹588 compared to monthly billing. Both plans include unlimited access to all features.'
      },
      {
        question: 'Is there a free trial?',
        answer: 'Yes! New users get a 7-day free trial with full access to all features. No credit card required to start your trial.'
      },
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept all major payment methods including Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and popular wallets. All payments are processed securely through Razorpay.'
      },
      {
        question: 'Can I get a refund?',
        answer: 'Yes, we offer a 7-day money-back guarantee for all new subscriptions. If you\'re not satisfied, request a refund within 7 days of purchase for a full refund. Please see our Refund Policy for details.'
      },
      {
        question: 'How do I cancel my subscription?',
        answer: 'You can cancel your subscription anytime from Settings > Subscription > Cancel. Your access will continue until the end of the current billing period.'
      }
    ]
  },
  {
    id: 'learning',
    name: 'Learning & Features',
    icon: BookOpen,
    faqs: [
      {
        question: 'How do I ask doubts?',
        answer: 'You can ask doubts through text, voice, or by uploading an image of your question. Our AI will provide detailed explanations instantly. You can also access 24/7 doubt resolution support.'
      },
      {
        question: 'Can I download lessons for offline use?',
        answer: 'Yes! Premium subscribers can download lessons for offline access. Downloaded content is available for 30 days and can be re-downloaded anytime.'
      },
      {
        question: 'How do quizzes work?',
        answer: 'Our AI generates personalized quizzes based on your learning progress. Quizzes adapt in difficulty based on your performance, ensuring you\'re always challenged at the right level.'
      },
      {
        question: 'What is the XP and streak system?',
        answer: 'XP (Experience Points) are earned by completing lessons, quizzes, and maintaining daily study habits. Streaks track your consecutive days of learning. Both motivate consistent study habits.'
      }
    ]
  },
  {
    id: 'account',
    name: 'Account & Profile',
    icon: User,
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Click "Get Started" on our homepage, enter your phone number for OTP verification, and fill in your details. You can also sign up using your Google account.'
      },
      {
        question: 'Can I use one account on multiple devices?',
        answer: 'Yes, you can access your account from multiple devices. However, for security, only one device can be active at a time. Logging in on a new device will log you out of others.'
      },
      {
        question: 'How do I change my class or board?',
        answer: 'Go to Profile > Edit Profile > Academic Info. You can change your class, board, and medium. Your learning progress will be adjusted accordingly.'
      },
      {
        question: 'How do I delete my account?',
        answer: 'To delete your account, go to Settings > Account > Delete Account. Please note this action is irreversible and all your data will be permanently deleted after 30 days.'
      }
    ]
  },
  {
    id: 'technical',
    name: 'Technical Support',
    icon: Settings,
    faqs: [
      {
        question: 'Which devices are supported?',
        answer: `${siteName} works on Android (8.0+), iOS (14.0+), and all modern web browsers (Chrome, Firefox, Safari, Edge). We recommend using the latest version for best experience.`
      },
      {
        question: 'The app is running slow. What should I do?',
        answer: 'Try clearing the app cache, ensuring you have a stable internet connection, and updating to the latest version. If issues persist, contact our support team.'
      },
      {
        question: 'I forgot my password. How do I reset it?',
        answer: 'Click "Forgot Password" on the login screen, enter your registered phone number, and follow the OTP verification process to set a new password.'
      },
      {
        question: 'How do I report a bug or issue?',
        answer: `You can report issues through the app (Settings > Help > Report Issue) or email us at ${supportEmail} with details and screenshots.`
      }
    ]
  }
];

export function FAQs() {
  const { settings } = useSettings();
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get FAQ categories with dynamic settings
  const faqCategories = getFaqCategories(settings.siteName, settings.supportEmail);

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => searchQuery === '' || category.faqs.length > 0);

  const currentCategory = filteredFaqs.find(c => c.id === activeCategory) || filteredFaqs[0];

  return (
    <div className="static-page">
      <header className="static-header">
        <div className="header-container">
          <Link to="/" className="logo">
            <img src={logoImage} alt={settings.siteName} />
            <span>{settings.siteName}</span>
          </Link>
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="static-content">
        <div className="content-container">
          <div className="faq-hero">
            <h1>Frequently Asked Questions</h1>
            <p>Find answers to common questions about {settings.siteName}</p>
            
            <div className="faq-search">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="faq-layout">
            <div className="faq-categories">
              {filteredFaqs.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    className={`faq-category ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <Icon size={20} />
                    <span>{category.name}</span>
                    <span className="faq-count">{category.faqs.length}</span>
                  </button>
                );
              })}
            </div>

            <div className="faq-list">
              <h2>{currentCategory?.name}</h2>
              {currentCategory?.faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${expandedFaq === `${currentCategory.id}-${index}` ? 'expanded' : ''}`}
                >
                  <button 
                    className="faq-question"
                    onClick={() => setExpandedFaq(
                      expandedFaq === `${currentCategory.id}-${index}` ? null : `${currentCategory.id}-${index}`
                    )}
                  >
                    <span>{faq.question}</span>
                    {expandedFaq === `${currentCategory.id}-${index}` ? 
                      <ChevronUp size={20} /> : <ChevronDown size={20} />
                    }
                  </button>
                  {expandedFaq === `${currentCategory.id}-${index}` && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="faq-contact">
            <h3>Still have questions?</h3>
            <p>Can't find what you're looking for? Contact our support team.</p>
            <div className="faq-contact-buttons">
              <Link to="/contact" className="contact-btn">Contact Support</Link>
              <Link to="/help" className="contact-btn secondary">Visit Help Center</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="static-footer">
        <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved. Powered by <a href="https://kasoftware.in/" target="_blank" rel="noopener noreferrer">KA Software</a></p>
      </footer>
    </div>
  );
}

export default FAQs;
