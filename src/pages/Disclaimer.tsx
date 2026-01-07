/**
 * Disclaimer Page
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function Disclaimer() {
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
          <h1>Disclaimer</h1>
          <p className="last-updated">Last updated: January 1, 2025</p>

          <section className="legal-section">
            <h2>1. Educational Content Disclaimer</h2>
            <p>
              The educational content provided by {settings.siteName} is designed to supplement, not replace, 
              formal education from schools, colleges, or other educational institutions. While we 
              strive to provide accurate and up-to-date information, we make no warranties or 
              representations about the completeness, reliability, or suitability of the content.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. AI-Generated Content</h2>
            <p>
              {settings.siteName} uses artificial intelligence to generate educational content, explanations, 
              and assessments. While our AI systems are designed to provide accurate information, 
              they may occasionally produce errors or inconsistencies. Users are encouraged to:
            </p>
            <ul>
              <li>Verify important information with authoritative sources</li>
              <li>Consult teachers or educational professionals for clarification</li>
              <li>Report any inaccuracies to our support team</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. No Guarantee of Results</h2>
            <p>
              While {settings.siteName} is designed to enhance learning and improve academic performance, we 
              cannot guarantee specific outcomes or results. Academic success depends on various 
              factors including individual effort, prior knowledge, learning environment, and 
              consistent practice.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Third-Party Content</h2>
            <p>
              Our platform may include links to third-party websites, resources, or content. We do 
              not control and are not responsible for the content, privacy policies, or practices 
              of any third-party sites or services. Inclusion of any links does not imply endorsement.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Technical Disclaimer</h2>
            <p>
              We strive to maintain a reliable and accessible platform. However, we do not guarantee:
            </p>
            <ul>
              <li>Uninterrupted or error-free service</li>
              <li>Compatibility with all devices or browsers</li>
              <li>Security from all potential cyber threats</li>
              <li>Availability of the service at all times</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Health and Safety</h2>
            <p>
              Extended use of digital devices for learning may cause eye strain, fatigue, or other 
              health issues. We recommend:
            </p>
            <ul>
              <li>Taking regular breaks (20-20-20 rule)</li>
              <li>Maintaining proper posture while studying</li>
              <li>Ensuring adequate lighting</li>
              <li>Limiting screen time for younger students</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, {settings.siteName} shall not be liable for any direct, 
              indirect, incidental, special, consequential, or punitive damages arising from:
            </p>
            <ul>
              <li>Use or inability to use the service</li>
              <li>Errors or inaccuracies in content</li>
              <li>Unauthorized access to your data</li>
              <li>Any third-party content or services</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Changes to Disclaimer</h2>
            <p>
              We reserve the right to modify this disclaimer at any time. Changes will be effective 
              immediately upon posting on the platform. Your continued use of {settings.siteName} after changes 
              are posted constitutes acceptance of the modified disclaimer.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Contact Us</h2>
            <p>If you have questions about this disclaimer, please contact us at:</p>
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

export default Disclaimer;
