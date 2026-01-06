/**
 * Refund Policy Page
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function RefundPolicy() {
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
        <div className="content-container legal-content">
          <h1>Refund Policy</h1>
          <p className="last-updated">Last updated: January 1, 2025</p>

          <div className="policy-highlights">
            <div className="highlight-card">
              <Clock size={24} />
              <h3>7-Day Money Back</h3>
              <p>Full refund within 7 days of purchase</p>
            </div>
            <div className="highlight-card">
              <RefreshCw size={24} />
              <h3>Easy Process</h3>
              <p>Simple refund request process</p>
            </div>
            <div className="highlight-card">
              <CheckCircle size={24} />
              <h3>Quick Processing</h3>
              <p>Refunds processed within 5-7 business days</p>
            </div>
          </div>

          <section className="legal-section">
            <h2>1. Refund Eligibility</h2>
            <p>
              At AI Tutor, we want you to be completely satisfied with your subscription. We offer 
              a 7-day money-back guarantee for all new subscriptions. You are eligible for a full 
              refund if:
            </p>
            <ul>
              <li>Your refund request is made within 7 days of the initial purchase</li>
              <li>This is your first subscription with AI Tutor</li>
              <li>You have not violated our Terms of Service</li>
              <li>You have not previously received a refund for an AI Tutor subscription</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>2. Non-Refundable Items</h2>
            <p>The following are not eligible for refunds:</p>
            <ul>
              <li>Subscriptions after the 7-day refund period</li>
              <li>Renewal payments for existing subscriptions</li>
              <li>Promotional or discounted subscriptions (unless specifically stated)</li>
              <li>Accounts that have been suspended for Terms of Service violations</li>
              <li>Partial month or unused portion of subscription</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How to Request a Refund</h2>
            <p>To request a refund, please follow these steps:</p>
            <ol>
              <li>Log in to your AI Tutor account</li>
              <li>Go to Settings → Subscription → Request Refund</li>
              <li>Fill out the refund request form with your reason for cancellation</li>
              <li>Submit your request</li>
            </ol>
            <p>Alternatively, you can email us at <strong>support@aitutor.in</strong> with:</p>
            <ul>
              <li>Your registered email address</li>
              <li>Transaction ID or Order ID</li>
              <li>Reason for refund request</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Refund Processing</h2>
            <p>
              Once we receive your refund request and verify your eligibility, we will process your 
              refund within 5-7 business days. The refund will be credited to the original payment method:
            </p>
            <ul>
              <li><strong>Credit/Debit Card:</strong> 5-7 business days</li>
              <li><strong>UPI:</strong> 3-5 business days</li>
              <li><strong>Net Banking:</strong> 5-7 business days</li>
              <li><strong>Wallet:</strong> 2-3 business days</li>
            </ul>
            <p>
              Please note that the actual time for the refund to appear in your account may vary 
              depending on your bank or payment provider.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Cancellation Policy</h2>
            <p>
              You may cancel your subscription at any time. Upon cancellation:
            </p>
            <ul>
              <li>Your subscription will remain active until the end of the current billing period</li>
              <li>You will not be charged for the next billing cycle</li>
              <li>Access to premium features will be revoked after the subscription expires</li>
              <li>Your learning progress and data will be retained for 30 days</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Pro-rata Refunds</h2>
            <p>
              We do not offer pro-rata refunds for partial months or unused portions of your 
              subscription. When you cancel, you will have access to all features until the end 
              of your current billing period.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Exceptional Circumstances</h2>
            <p>
              In exceptional circumstances, we may consider refund requests outside the standard 
              policy. These are evaluated on a case-by-case basis and may include:
            </p>
            <ul>
              <li>Technical issues that prevented access to the service</li>
              <li>Billing errors on our part</li>
              <li>Service unavailability for extended periods</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Contact Us</h2>
            <p>If you have any questions about our refund policy, please contact us:</p>
            <ul>
              <li>Email: support@aitutor.in</li>
              <li>Phone: +91-9876543210</li>
              <li>WhatsApp: +91-9876543210</li>
            </ul>
            <p>Our support team is available Monday to Saturday, 9 AM to 6 PM IST.</p>
          </section>
        </div>
      </main>

      <footer className="static-footer">
        <p>© 2025 AI Tutor. All rights reserved. Powered by <a href="https://kasoftware.in/" target="_blank" rel="noopener noreferrer">KA Software</a></p>
      </footer>
    </div>
  );
}

export default RefundPolicy;
