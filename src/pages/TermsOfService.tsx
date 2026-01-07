/**
 * Terms of Service Page
 */

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function TermsOfService() {
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
        <div className="content-container legal-content">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last updated: January 1, 2025</p>

          <section className="legal-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using {settings.siteName}'s services, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, you 
              are prohibited from using or accessing our services.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily access and use {settings.siteName} for personal, non-commercial 
              educational purposes. This license does not include:
            </p>
            <ul>
              <li>Modifying or copying our materials</li>
              <li>Using materials for commercial purposes</li>
              <li>Attempting to reverse engineer any software</li>
              <li>Removing any copyright or proprietary notations</li>
              <li>Transferring materials to another person or "mirror" on any other server</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. User Accounts</h2>
            <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
            <p>We reserve the right to terminate accounts that violate these terms.</p>
          </section>

          <section className="legal-section">
            <h2>4. Subscription and Payments</h2>
            <p>
              Some features of {settings.siteName} require a paid subscription. By subscribing, you agree to:
            </p>
            <ul>
              <li>Pay all fees associated with your subscription plan</li>
              <li>Provide accurate billing information</li>
              <li>Automatic renewal unless cancelled before the renewal date</li>
            </ul>
            <p>Prices are subject to change with prior notice.</p>
          </section>

          <section className="legal-section">
            <h2>5. Intellectual Property</h2>
            <p>
              All content, features, and functionality of {settings.siteName}, including but not limited to text, 
              graphics, logos, icons, images, audio clips, video clips, data compilations, and software, 
              are the exclusive property of {settings.siteName} and are protected by copyright, trademark, and other 
              intellectual property laws.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any unlawful purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the service</li>
              <li>Attempt to gain unauthorized access to any systems</li>
              <li>Upload viruses or malicious code</li>
              <li>Collect user information without consent</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Disclaimer</h2>
            <p>
              {settings.siteName} is provided "as is" without warranties of any kind. We do not guarantee that 
              the service will be uninterrupted, secure, or error-free. Educational content is for 
              informational purposes and should not replace professional educational guidance.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Limitation of Liability</h2>
            <p>
              {settings.siteName} shall not be liable for any indirect, incidental, special, consequential, or 
              punitive damages resulting from your use of or inability to use the service, even if 
              we have been advised of the possibility of such damages.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. 
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction 
              of the courts in Bangalore, Karnataka.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any 
              material changes by posting the new terms on our platform. Your continued use of the 
              service after such changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us at:</p>
            <ul>
              <li>Email: {settings.supportEmail}</li>
              <li>Phone: {settings.supportPhone}</li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="static-footer">
        <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved. Powered by <a href="https://kasoftware.in/" target="_blank" rel="noopener noreferrer">KA Software</a></p>
      </footer>
    </div>
  );
}

export default TermsOfService;
