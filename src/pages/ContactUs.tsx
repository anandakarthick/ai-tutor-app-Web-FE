/**
 * Contact Us Page
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle, Loader2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import logoImage from '../assets/images/logo.png';
import toast from 'react-hot-toast';
import './StaticPages.css';

export function ContactUs() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          <h1>Contact Us</h1>
          <p className="subtitle">We'd love to hear from you. Get in touch with us.</p>

          <div className="contact-layout">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>Have questions or feedback? Reach out to us through any of the following channels.</p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon" style={{ background: '#FFF7ED', color: '#F97316' }}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3>Email</h3>
                    <p>{settings.supportEmail}</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon" style={{ background: '#DCFCE7', color: '#22C55E' }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3>Phone</h3>
                    <p>{settings.supportPhone}</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3>Address</h3>
                    <p>{settings.address}</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon" style={{ background: '#F3E8FF', color: '#8B5CF6' }}>
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3>Business Hours</h3>
                    <p>Monday - Saturday</p>
                    <p>9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject *</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} required>
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    placeholder="How can we help you?"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                  {submitting ? (
                    <><Loader2 size={20} className="spinner" /> Sending...</>
                  ) : (
                    <><Send size={20} /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="static-footer">
        <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved. Powered by <a href="https://kasoftware.in/" target="_blank" rel="noopener noreferrer">KA Software</a></p>
      </footer>
    </div>
  );
}

export default ContactUs;
