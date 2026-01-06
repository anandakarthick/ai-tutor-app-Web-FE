/**
 * Press Kit Page
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Image, Video, Mail, ExternalLink } from 'lucide-react';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function PressKit() {
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
          <div className="press-hero">
            <h1>Press Kit</h1>
            <p>Resources for media and press coverage</p>
          </div>

          <section className="press-section">
            <h2>About AI Tutor</h2>
            <p>
              AI Tutor is India's leading AI-powered educational platform, making quality education 
              accessible to every student through personalized learning experiences. Founded in 2024, 
              we serve over 50,000 students across India with our innovative approach to K-12 education.
            </p>
            <div className="press-stats">
              <div className="stat">
                <span className="stat-value">50K+</span>
                <span className="stat-label">Active Students</span>
              </div>
              <div className="stat">
                <span className="stat-value">500+</span>
                <span className="stat-label">Partner Schools</span>
              </div>
              <div className="stat">
                <span className="stat-value">4.8</span>
                <span className="stat-label">App Rating</span>
              </div>
              <div className="stat">
                <span className="stat-value">10M+</span>
                <span className="stat-label">Lessons Completed</span>
              </div>
            </div>
          </section>

          <section className="press-section">
            <h2>Brand Assets</h2>
            <div className="assets-grid">
              <div className="asset-card">
                <div className="asset-icon">
                  <Image size={32} />
                </div>
                <h4>Logo Package</h4>
                <p>PNG, SVG, and vector formats</p>
                <button className="download-asset">
                  <Download size={16} />
                  Download Logos
                </button>
              </div>
              <div className="asset-card">
                <div className="asset-icon">
                  <Image size={32} />
                </div>
                <h4>Screenshots</h4>
                <p>App screenshots in high resolution</p>
                <button className="download-asset">
                  <Download size={16} />
                  Download Screenshots
                </button>
              </div>
              <div className="asset-card">
                <div className="asset-icon">
                  <FileText size={32} />
                </div>
                <h4>Brand Guidelines</h4>
                <p>Colors, typography, and usage rules</p>
                <button className="download-asset">
                  <Download size={16} />
                  Download Guidelines
                </button>
              </div>
              <div className="asset-card">
                <div className="asset-icon">
                  <Video size={32} />
                </div>
                <h4>Product Videos</h4>
                <p>Demo and promotional videos</p>
                <button className="download-asset">
                  <Download size={16} />
                  Download Videos
                </button>
              </div>
            </div>
          </section>

          <section className="press-section">
            <h2>Recent Press Releases</h2>
            <div className="press-releases">
              <div className="press-item">
                <span className="press-date">Jan 2025</span>
                <h4>AI Tutor Raises Series A Funding</h4>
                <p>Leading EdTech platform secures funding to expand across India</p>
                <a href="#" className="read-more">Read More <ExternalLink size={14} /></a>
              </div>
              <div className="press-item">
                <span className="press-date">Dec 2024</span>
                <h4>AI Tutor Partners with 200 Schools in Tamil Nadu</h4>
                <p>Strategic partnership to bring AI-powered learning to government schools</p>
                <a href="#" className="read-more">Read More <ExternalLink size={14} /></a>
              </div>
              <div className="press-item">
                <span className="press-date">Nov 2024</span>
                <h4>AI Tutor Launches Voice-Based Learning</h4>
                <p>New feature enables students to learn through voice commands</p>
                <a href="#" className="read-more">Read More <ExternalLink size={14} /></a>
              </div>
            </div>
          </section>

          <section className="press-section">
            <h2>Media Contact</h2>
            <div className="contact-card">
              <h4>For press inquiries, please contact:</h4>
              <p><strong>Press Relations Team</strong></p>
              <p><Mail size={16} /> press@aitutor.in</p>
              <p>We typically respond within 24 hours.</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="static-footer">
        <p>© 2025 AI Tutor. All rights reserved. Powered by <a href="https://kasoftware.in/" target="_blank" rel="noopener noreferrer">KA Software</a></p>
      </footer>
    </div>
  );
}

export default PressKit;
