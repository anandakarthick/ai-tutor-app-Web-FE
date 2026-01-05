/**
 * Careers Page
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Briefcase, Code, Palette, Megaphone, Users, ChevronRight } from 'lucide-react';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

const openPositions = [
  {
    title: 'Senior AI/ML Engineer',
    department: 'Engineering',
    location: 'Bangalore, India',
    type: 'Full-time',
    icon: Code,
  },
  {
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    icon: Code,
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Bangalore, India',
    type: 'Full-time',
    icon: Palette,
  },
  {
    title: 'Content Writer - Education',
    department: 'Content',
    location: 'Remote',
    type: 'Full-time',
    icon: Megaphone,
  },
  {
    title: 'Customer Success Manager',
    department: 'Operations',
    location: 'Mumbai, India',
    type: 'Full-time',
    icon: Users,
  },
];

const benefits = [
  'Competitive salary & equity',
  'Health insurance for you & family',
  'Flexible work hours',
  'Remote work options',
  'Learning & development budget',
  'Annual team retreats',
];

export function Careers() {
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
          <h1>Careers</h1>
          <p className="subtitle">Join us in transforming education for millions of students</p>

          <section className="content-section">
            <h2>Why Join AI Tutor?</h2>
            <p>
              At AI Tutor, you'll work on meaningful problems that directly impact students' lives. 
              We're building the future of education, and we need passionate individuals who want 
              to make a difference. Join a team that values innovation, collaboration, and continuous learning.
            </p>
          </section>

          <section className="benefits-section">
            <h2>Benefits & Perks</h2>
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <ChevronRight size={18} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="positions-section">
            <h2>Open Positions</h2>
            <div className="positions-list">
              {openPositions.map((position, index) => {
                const Icon = position.icon;
                return (
                  <div key={index} className="position-card">
                    <div className="position-icon">
                      <Icon size={24} />
                    </div>
                    <div className="position-info">
                      <h3>{position.title}</h3>
                      <div className="position-meta">
                        <span><Briefcase size={14} /> {position.department}</span>
                        <span><MapPin size={14} /> {position.location}</span>
                        <span><Clock size={14} /> {position.type}</span>
                      </div>
                    </div>
                    <a href="mailto:careers@aitutor.in" className="btn btn-outline btn-sm">
                      Apply Now
                    </a>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="cta-section">
            <h2>Don't See a Fit?</h2>
            <p>We're always looking for talented individuals. Send us your resume!</p>
            <a href="mailto:careers@aitutor.in" className="btn btn-primary">
              Send Resume
            </a>
          </section>
        </div>
      </main>

      <footer className="static-footer">
        <p>© 2025 AI Tutor. All rights reserved. Powered by <a href="https://kasoftware.in/" target="_blank" rel="noopener noreferrer">KA Software</a></p>
      </footer>
    </div>
  );
}

export default Careers;
