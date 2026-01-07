/**
 * Privacy Policy Page
 */

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function PrivacyPolicy() {
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
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: January 1, 2025</p>

          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to {settings.siteName} ("we," "our," or "us"). We are committed to protecting your personal 
              information and your right to privacy. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you use our mobile application and website 
              (collectively, the "Platform").
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this 
              privacy policy, please do not access the Platform.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul>
              <li>Name and contact information (email address, phone number)</li>
              <li>Educational information (class, board, school name)</li>
              <li>Account credentials</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Profile information and preferences</li>
            </ul>

            <h3>2.2 Usage Information</h3>
            <p>We automatically collect certain information when you use the Platform:</p>
            <ul>
              <li>Device information (device type, operating system, unique device identifiers)</li>
              <li>Log information (access times, pages viewed, app features used)</li>
              <li>Learning progress and performance data</li>
              <li>Location information (with your consent)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Personalize your learning experience</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent or illegal activities</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Information Sharing</h2>
            <p>We may share your information in the following circumstances:</p>
            <ul>
              <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
              <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process</li>
              <li><strong>Protection:</strong> To protect our rights, privacy, safety, or property</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> With your consent or at your direction</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </section>

          <section className="legal-section">
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction. 
              These measures include:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes 
              outlined in this privacy policy, unless a longer retention period is required or 
              permitted by law. When you delete your account, we will delete or anonymize your 
              personal information within 30 days, unless we are required to retain it for legal purposes.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your personal information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@aitutor.in.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>
              {settings.siteName} is designed for students of all ages. For users under 18, we require parental 
              or guardian consent for account creation. We do not knowingly collect personal information 
              from children under 13 without verifiable parental consent.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new privacy policy on this page and updating the "Last updated" date. 
              You are advised to review this privacy policy periodically for any changes.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Contact Us</h2>
            <p>If you have questions about this privacy policy, please contact us at:</p>
            <ul>
              <li>Email: {settings.supportEmail}</li>
              <li>Phone: {settings.supportPhone}</li>
              <li>Address: {settings.address}</li>
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

export default PrivacyPolicy;
