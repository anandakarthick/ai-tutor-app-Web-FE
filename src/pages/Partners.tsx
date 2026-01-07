/**
 * Partners Page
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Handshake, School, Building, Gift, TrendingUp, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function Partners() {
  const { settings } = useSettings();
  
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
          <div className="partners-hero">
            <h1>Partner With Us</h1>
            <p>Join our mission to transform education through AI technology</p>
          </div>

          <section className="partner-types">
            <div className="partner-card">
              <div className="partner-icon">
                <School size={40} />
              </div>
              <h3>Schools & Institutions</h3>
              <p>Bring AI-powered learning to your students with special institutional pricing and dedicated support.</p>
              <ul>
                <li><CheckCircle size={16} /> Bulk licensing discounts</li>
                <li><CheckCircle size={16} /> Custom curriculum mapping</li>
                <li><CheckCircle size={16} /> Teacher training programs</li>
                <li><CheckCircle size={16} /> Progress analytics dashboard</li>
              </ul>
              <Link to="/demo" className="partner-cta">
                Request Demo <ArrowRight size={16} />
              </Link>
            </div>

            <div className="partner-card">
              <div className="partner-icon">
                <Building size={40} />
              </div>
              <h3>Content Partners</h3>
              <p>Collaborate with us to create and distribute high-quality educational content.</p>
              <ul>
                <li><CheckCircle size={16} /> Revenue sharing model</li>
                <li><CheckCircle size={16} /> Content distribution</li>
                <li><CheckCircle size={16} /> Brand visibility</li>
                <li><CheckCircle size={16} /> Analytics & insights</li>
              </ul>
              <a href={`mailto:${settings.supportEmail}`} className="partner-cta">
                Contact Us <ArrowRight size={16} />
              </a>
            </div>

            <div className="partner-card">
              <div className="partner-icon">
                <Handshake size={40} />
              </div>
              <h3>Affiliate Partners</h3>
              <p>Earn commissions by referring students and schools to {settings.siteName}.</p>
              <ul>
                <li><CheckCircle size={16} /> 20% commission per sale</li>
                <li><CheckCircle size={16} /> Real-time tracking</li>
                <li><CheckCircle size={16} /> Marketing materials</li>
                <li><CheckCircle size={16} /> Monthly payouts</li>
              </ul>
              <a href={`mailto:${settings.supportEmail}`} className="partner-cta">
                Join Program <ArrowRight size={16} />
              </a>
            </div>
          </section>

          <section className="partner-benefits">
            <h2>Why Partner With {settings.siteName}?</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <TrendingUp size={24} />
                <h4>Growing Market</h4>
                <p>EdTech is one of the fastest growing sectors in India</p>
              </div>
              <div className="benefit-item">
                <Users size={24} />
                <h4>50K+ Students</h4>
                <p>Access to our large and engaged user base</p>
              </div>
              <div className="benefit-item">
                <Gift size={24} />
                <h4>Attractive Terms</h4>
                <p>Competitive pricing and revenue sharing</p>
              </div>
              <div className="benefit-item">
                <CheckCircle size={24} />
                <h4>Dedicated Support</h4>
                <p>Partner success team to help you grow</p>
              </div>
            </div>
          </section>

          <section className="current-partners">
            <h2>Our Partners</h2>
            <p>Trusted by leading educational institutions across India</p>
            <div className="partner-logos">
              <div className="partner-logo-placeholder">Partner 1</div>
              <div className="partner-logo-placeholder">Partner 2</div>
              <div className="partner-logo-placeholder">Partner 3</div>
              <div className="partner-logo-placeholder">Partner 4</div>
              <div className="partner-logo-placeholder">Partner 5</div>
              <div className="partner-logo-placeholder">Partner 6</div>
            </div>
          </section>

          <section className="partner-cta-section">
            <h2>Ready to Partner?</h2>
            <p>Contact our partnerships team to discuss collaboration opportunities</p>
            <a href={`mailto:${settings.supportEmail}`} className="cta-button">
              Contact Partnerships Team
            </a>
          </section>
        </div>
      </main>

      <footer className="static-footer">
        <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved. Powered by <a href="https://kasoftware.in/" target="_blank" rel="noopener noreferrer">KA Software</a></p>
      </footer>
    </div>
  );
}

export default Partners;
