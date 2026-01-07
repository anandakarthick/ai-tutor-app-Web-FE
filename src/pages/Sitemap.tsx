/**
 * Sitemap Page
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Home, BookOpen, Users, HelpCircle, FileText, Download, ExternalLink } from 'lucide-react';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function Sitemap() {
  const sitemapSections = [
    {
      title: 'Main Pages',
      icon: Home,
      links: [
        { name: 'Home', path: '/' },
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
        { name: 'Dashboard', path: '/dashboard' },
      ]
    },
    {
      title: 'Learning',
      icon: BookOpen,
      links: [
        { name: 'Learn', path: '/learn' },
        { name: 'Quizzes', path: '/quizzes' },
        { name: 'Doubts', path: '/doubts' },
        { name: 'Progress', path: '/progress' },
        { name: 'Study Plan', path: '/study-plan' },
      ]
    },
    {
      title: 'Account',
      icon: Users,
      links: [
        { name: 'Profile', path: '/profile' },
        { name: 'Subscription', path: '/subscription' },
      ]
    },
    {
      title: 'Product',
      icon: Download,
      links: [
        { name: 'Features', path: '/#features' },
        { name: 'Subjects', path: '/#subjects' },
        { name: 'Study Plans', path: '/#study-plans' },
        { name: 'Download App', path: '/download' },
        { name: 'Request Demo', path: '/demo' },
      ]
    },
    {
      title: 'Company',
      icon: Users,
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Blog', path: '/blog' },
        { name: 'Press Kit', path: '/press' },
        { name: 'Partners', path: '/partners' },
      ]
    },
    {
      title: 'Support',
      icon: HelpCircle,
      links: [
        { name: 'Help Center', path: '/help' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'FAQs', path: '/faq' },
        { name: 'Community', path: '/community' },
        { name: 'Feedback', path: '/feedback' },
      ]
    },
    {
      title: 'Legal',
      icon: FileText,
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Cookies Policy', path: '/cookies' },
        { name: 'Refund Policy', path: '/refund' },
        { name: 'Disclaimer', path: '/disclaimer' },
      ]
    },
  ];

  return (
    <div className="static-page">
      <header className="static-header">
        <div className="header-container">
          <Link to="/" className="logo">
            <img src={logoImage} alt="AI Tutor" />
            <span>AI Tutor</span>
          </Link>
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="static-content">
        <div className="content-container">
          <h1>Sitemap</h1>
          <p className="subtitle">Find everything on AI Tutor</p>

          <div className="sitemap-grid">
            {sitemapSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="sitemap-section">
                  <div className="sitemap-header">
                    <Icon size={20} />
                    <h3>{section.title}</h3>
                  </div>
                  <ul className="sitemap-links">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <Link to={link.path}>
                          {link.name}
                          <ExternalLink size={14} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="static-footer">
        <p>© 2025 AI Tutor. All rights reserved. Powered by <a href="https://kasoftware.in/" target="_blank" rel="noopener noreferrer">KA Software</a></p>
      </footer>
    </div>
  );
}

export default Sitemap;
