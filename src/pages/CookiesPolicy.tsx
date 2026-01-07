/**
 * Cookies Policy Page
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function CookiesPolicy() {
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
          <h1>Cookies Policy</h1>
          <p className="last-updated">Last updated: January 1, 2025</p>

          <section className="legal-section">
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit our website. 
              They are widely used to make websites work more efficiently and provide information to 
              the website owners. Cookies help us understand how you use our platform and allow us to 
              improve your experience.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Types of Cookies We Use</h2>
            
            <h3>2.1 Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable basic 
              functions like page navigation, secure access to authenticated areas, and remembering 
              your login status. The website cannot function properly without these cookies.
            </p>

            <h3>2.2 Performance Cookies</h3>
            <p>
              These cookies collect information about how visitors use our website, such as which 
              pages are visited most often. This data helps us improve website performance and user 
              experience. All information collected is aggregated and anonymous.
            </p>

            <h3>2.3 Functionality Cookies</h3>
            <p>
              These cookies allow the website to remember choices you make (such as your language 
              preference, region, or learning preferences) and provide enhanced, personalized features. 
              They may also be used to provide services you have asked for.
            </p>

            <h3>2.4 Analytics Cookies</h3>
            <p>
              We use analytics cookies to understand how users interact with our platform. This helps 
              us measure and improve the performance of our site. We use Google Analytics which collects 
              information anonymously.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Cookies We Use</h2>
            <table className="cookie-table">
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>session_id</td>
                  <td>Maintains user session</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td>auth_token</td>
                  <td>Authentication</td>
                  <td>30 days</td>
                </tr>
                <tr>
                  <td>user_preferences</td>
                  <td>Stores user preferences</td>
                  <td>1 year</td>
                </tr>
                <tr>
                  <td>_ga</td>
                  <td>Google Analytics</td>
                  <td>2 years</td>
                </tr>
                <tr>
                  <td>_gid</td>
                  <td>Google Analytics</td>
                  <td>24 hours</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="legal-section">
            <h2>4. Third-Party Cookies</h2>
            <p>
              Some cookies are placed by third-party services that appear on our pages. We use the 
              following third-party services that may set cookies:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> For website analytics and performance tracking</li>
              <li><strong>Razorpay:</strong> For secure payment processing</li>
              <li><strong>Intercom:</strong> For customer support chat</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Managing Cookies</h2>
            <p>
              You can control and manage cookies in various ways. Most browsers allow you to:
            </p>
            <ul>
              <li>View what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from particular sites</li>
              <li>Block all cookies from being set</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
            <p>
              Please note that if you choose to block or delete cookies, some features of our platform 
              may not work properly, and your user experience may be affected.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. How to Disable Cookies</h2>
            <p>You can disable cookies through your browser settings:</p>
            <ul>
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
              <li><strong>Edge:</strong> Settings → Privacy & Security → Cookies</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Updates to This Policy</h2>
            <p>
              We may update this Cookies Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. We encourage you to periodically 
              review this page for the latest information on our cookie practices.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Contact Us</h2>
            <p>If you have questions about our use of cookies, please contact us at:</p>
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

export default CookiesPolicy;
