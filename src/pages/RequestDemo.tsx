/**
 * Request Demo Page
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, Users, School, Building, Send, Calendar, Clock, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function RequestDemo() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    students: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Demo request submitted! We\'ll contact you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      organization: '',
      role: '',
      students: '',
      preferredDate: '',
      preferredTime: '',
      message: ''
    });
    setIsSubmitting(false);
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
          <div className="demo-hero">
            <h1>Request a Demo</h1>
            <p>See how {settings.siteName} can transform learning for your school or organization</p>
          </div>

          <div className="demo-layout">
            <div className="demo-info">
              <h2>What You'll Get</h2>
              <ul className="demo-benefits">
                <li>
                  <Video size={24} />
                  <div>
                    <h4>Live Product Demo</h4>
                    <p>30-minute personalized walkthrough of all features</p>
                  </div>
                </li>
                <li>
                  <Users size={24} />
                  <div>
                    <h4>Custom Use Cases</h4>
                    <p>See how {settings.siteName} fits your specific needs</p>
                  </div>
                </li>
                <li>
                  <School size={24} />
                  <div>
                    <h4>Institutional Pricing</h4>
                    <p>Special pricing for schools and organizations</p>
                  </div>
                </li>
                <li>
                  <CheckCircle size={24} />
                  <div>
                    <h4>Free Trial Access</h4>
                    <p>Get extended free trial for your team</p>
                  </div>
                </li>
              </ul>

              <div className="trusted-by">
                <h3>Trusted by 500+ Schools</h3>
                <p>Join leading educational institutions already using {settings.siteName}</p>
              </div>
            </div>

            <div className="demo-form-container">
              <form onSubmit={handleSubmit} className="demo-form">
                <h3>Schedule Your Demo</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="work@example.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone *</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="form-group">
                    <label>Organization *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.organization}
                      onChange={e => setFormData({...formData, organization: e.target.value})}
                      placeholder="School/Company name"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Your Role</label>
                    <select 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="">Select role</option>
                      <option value="principal">Principal</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Administrator</option>
                      <option value="parent">Parent</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Number of Students</label>
                    <select 
                      value={formData.students}
                      onChange={e => setFormData({...formData, students: e.target.value})}
                    >
                      <option value="">Select range</option>
                      <option value="1-50">1-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="501-1000">501-1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Date</label>
                    <input 
                      type="date" 
                      value={formData.preferredDate}
                      onChange={e => setFormData({...formData, preferredDate: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Time</label>
                    <select 
                      value={formData.preferredTime}
                      onChange={e => setFormData({...formData, preferredTime: e.target.value})}
                    >
                      <option value="">Select time</option>
                      <option value="9-10">9:00 AM - 10:00 AM</option>
                      <option value="10-11">10:00 AM - 11:00 AM</option>
                      <option value="11-12">11:00 AM - 12:00 PM</option>
                      <option value="14-15">2:00 PM - 3:00 PM</option>
                      <option value="15-16">3:00 PM - 4:00 PM</option>
                      <option value="16-17">4:00 PM - 5:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Message (Optional)</label>
                  <textarea 
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Request Demo'}
                  <Send size={18} />
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

export default RequestDemo;
