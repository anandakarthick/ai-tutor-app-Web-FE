/**
 * Help Center Page
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown, ChevronUp, BookOpen, CreditCard, User, Settings, MessageCircle, Shield } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

const categories = [
  { name: 'Getting Started', icon: BookOpen, color: '#F97316' },
  { name: 'Account & Profile', icon: User, color: '#3B82F6' },
  { name: 'Billing & Payments', icon: CreditCard, color: '#22C55E' },
  { name: 'Features & Usage', icon: Settings, color: '#8B5CF6' },
  { name: 'Technical Issues', icon: MessageCircle, color: '#EC4899' },
  { name: 'Privacy & Security', icon: Shield, color: '#14B8A6' },
];

// Generate FAQs with dynamic site name
const getFaqs = (siteName: string, supportEmail: string, supportPhone: string) => [
  {
    question: 'How do I create an account?',
    answer: 'Creating an account is easy! Click on "Get Started" or "Sign Up" on the homepage. Enter your phone number, verify with OTP, and fill in your details including your board and class. You\'ll be ready to start learning in minutes!',
    category: 'Getting Started',
  },
  {
    question: `What subjects are available on ${siteName}?`,
    answer: `${siteName} covers all major subjects including Mathematics, Science, English, Hindi, Physics, Chemistry, Biology, and Social Science. We support CBSE, ICSE, and various State Board curricula from Class 1 to Class 12.`,
    category: 'Getting Started',
  },
  {
    question: 'How does the AI teaching work?',
    answer: `Our AI-powered system uses advanced language models to provide personalized explanations. It adapts to your learning pace, answers your questions in real-time, and provides examples relevant to your understanding level.`,
    category: 'Features & Usage',
  },
  {
    question: `Can I use ${siteName} offline?`,
    answer: `Currently, ${siteName} requires an internet connection for the AI-powered features. However, Annual plan subscribers can download select content for offline viewing.`,
    category: 'Features & Usage',
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription anytime from your Profile > Subscription settings. Your access will continue until the end of your billing period. No questions asked!',
    category: 'Billing & Payments',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods including UPI, Credit/Debit Cards, Net Banking, and popular wallets like Paytm and PhonePe. All payments are processed securely.',
    category: 'Billing & Payments',
  },
  {
    question: 'How do I reset my password?',
    answer: `${siteName} uses OTP-based login, so there\'s no password to remember! Simply enter your registered phone number and verify with the OTP sent to your phone.`,
    category: 'Account & Profile',
  },
  {
    question: `Is my data safe with ${siteName}?`,
    answer: 'Absolutely! We take data privacy seriously. All your data is encrypted and stored securely. We never share your personal information with third parties. Read our Privacy Policy for more details.',
    category: 'Privacy & Security',
  },
  {
    question: 'The app is not loading properly. What should I do?',
    answer: 'Try these steps: 1) Check your internet connection, 2) Clear browser cache/app cache, 3) Update to the latest version, 4) Restart the app. If issues persist, contact our support team.',
    category: 'Technical Issues',
  },
  {
    question: 'How do I contact customer support?',
    answer: `You can reach us via: Email: ${supportEmail}, Phone: ${supportPhone} (Mon-Sat, 9 AM - 6 PM), or use the in-app chat feature for instant assistance.`,
    category: 'Technical Issues',
  },
];

export function HelpCenter() {
  const { settings } = useSettings();
  const faqs = getFaqs(settings.siteName, settings.supportEmail, settings.supportPhone);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h1>Help Center</h1>
          <p className="subtitle">Find answers to your questions</p>

          <section className="search-section">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </section>

          <section className="categories-section">
            <h2>Browse by Category</h2>
            <div className="categories-grid">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <button
                    key={index}
                    className={`category-card ${selectedCategory === category.name ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                  >
                    <div className="category-icon" style={{ background: `${category.color}15`, color: category.color }}>
                      <Icon size={24} />
                    </div>
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    {expandedFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedFaq === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="cta-section">
            <h2>Still Need Help?</h2>
            <p>Our support team is here to assist you.</p>
            <Link to="/contact" className="btn btn-primary">
              Contact Support
            </Link>
          </section>
        </div>
      </main>

      <footer className="static-footer">
        <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved. Powered by <a href="https://kasoftware.in/" target="_blank" rel="noopener noreferrer">KA Software</a></p>
      </footer>
    </div>
  );
}

export default HelpCenter;
