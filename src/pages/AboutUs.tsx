/**
 * About Us Page
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Heart, Users, Award, Lightbulb, Globe } from 'lucide-react';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function AboutUs() {
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
          <h1>About Us</h1>
          <p className="subtitle">Transforming education through the power of AI</p>

          <section className="content-section">
            <h2>Our Mission</h2>
            <p>
              At AI Tutor, we believe that every student deserves access to personalized, 
              high-quality education. Our mission is to democratize learning by leveraging 
              cutting-edge artificial intelligence to create an adaptive learning experience 
              that meets each student where they are.
            </p>
          </section>

          <section className="content-section">
            <h2>Our Story</h2>
            <p>
              Founded in 2024, AI Tutor was born from a simple observation: traditional 
              education often fails to address the unique learning needs of individual students. 
              Our founders, a team of educators and technologists, set out to change this by 
              building an AI-powered platform that adapts to each learner's pace, style, and goals.
            </p>
            <p>
              Today, AI Tutor serves over 50,000 students across India, helping them achieve 
              their academic goals through personalized lessons, instant doubt resolution, 
              and engaging gamified experiences.
            </p>
          </section>

          <section className="values-section">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon" style={{ background: '#FFF7ED', color: '#F97316' }}>
                  <Target size={28} />
                </div>
                <h3>Student-First</h3>
                <p>Every decision we make starts with what's best for our students.</p>
              </div>
              <div className="value-card">
                <div className="value-icon" style={{ background: '#DCFCE7', color: '#22C55E' }}>
                  <Lightbulb size={28} />
                </div>
                <h3>Innovation</h3>
                <p>We continuously push the boundaries of what's possible in education.</p>
              </div>
              <div className="value-card">
                <div className="value-icon" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
                  <Heart size={28} />
                </div>
                <h3>Accessibility</h3>
                <p>Quality education should be accessible to everyone, everywhere.</p>
              </div>
              <div className="value-card">
                <div className="value-icon" style={{ background: '#F3E8FF', color: '#8B5CF6' }}>
                  <Award size={28} />
                </div>
                <h3>Excellence</h3>
                <p>We strive for excellence in everything we do.</p>
              </div>
            </div>
          </section>

          <section className="content-section">
            <h2>Our Team</h2>
            <p>
              We're a diverse team of passionate educators, engineers, designers, and 
              AI researchers united by a common goal: to make learning more effective 
              and enjoyable for students everywhere. Our team brings together expertise 
              from leading educational institutions and technology companies.
            </p>
          </section>

          <section className="cta-section">
            <h2>Join Our Journey</h2>
            <p>Be part of the education revolution. Start learning with AI Tutor today.</p>
            <Link to="/register" className="btn btn-primary">
              Get Started Free
            </Link>
          </section>
        </div>
      </main>

      <footer className="static-footer">
        <p>© 2025 AI Tutor. All rights reserved. Powered by <a href="https://kasoftware.in/" target="_blank" rel="noopener noreferrer">KA Software</a></p>
      </footer>
    </div>
  );
}

export default AboutUs;
