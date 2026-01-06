/**
 * Feedback Page
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Star, ThumbsUp, ThumbsDown, MessageSquare, Lightbulb, Bug, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function Feedback() {
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { id: 'general', label: 'General Feedback', icon: MessageSquare },
    { id: 'suggestion', label: 'Feature Suggestion', icon: Lightbulb },
    { id: 'bug', label: 'Report a Bug', icon: Bug },
    { id: 'appreciation', label: 'Appreciation', icon: Heart },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Thank you for your feedback! We appreciate your input.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
    setRating(0);
    setIsSubmitting(false);
  };

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
          <div className="feedback-hero">
            <h1>We Value Your Feedback</h1>
            <p>Help us improve AI Tutor by sharing your thoughts and suggestions</p>
          </div>

          <div className="feedback-layout">
            <div className="feedback-sidebar">
              <h3>What's on your mind?</h3>
              <div className="feedback-types">
                {feedbackTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      className={`feedback-type ${feedbackType === type.id ? 'active' : ''}`}
                      onClick={() => {
                        setFeedbackType(type.id);
                        setFormData({...formData, category: type.id});
                      }}
                    >
                      <Icon size={20} />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="feedback-stats">
                <h4>Feedback Impact</h4>
                <div className="stat-item">
                  <span className="stat-number">95%</span>
                  <span className="stat-text">of suggestions reviewed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">48hrs</span>
                  <span className="stat-text">average response time</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">200+</span>
                  <span className="stat-text">features added from feedback</span>
                </div>
              </div>
            </div>

            <div className="feedback-form-container">
              <form onSubmit={handleSubmit} className="feedback-form">
                <h3>Share Your Feedback</h3>

                {/* Rating */}
                <div className="form-group">
                  <label>How would you rate your experience?</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`star ${(hoverRating || rating) >= star ? 'active' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <Star size={32} fill={(hoverRating || rating) >= star ? '#F59E0B' : 'none'} />
                      </button>
                    ))}
                    <span className="rating-text">
                      {rating === 0 && 'Click to rate'}
                      {rating === 1 && 'Poor'}
                      {rating === 2 && 'Fair'}
                      {rating === 3 && 'Good'}
                      {rating === 4 && 'Very Good'}
                      {rating === 5 && 'Excellent!'}
                    </span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    placeholder="Brief summary of your feedback"
                  />
                </div>

                <div className="form-group">
                  <label>Your Feedback *</label>
                  <textarea 
                    rows={5}
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder={
                      feedbackType === 'suggestion' ? 'Describe the feature you\'d like to see...' :
                      feedbackType === 'bug' ? 'Describe the issue in detail. Include steps to reproduce if possible...' :
                      feedbackType === 'appreciation' ? 'Tell us what you love about AI Tutor...' :
                      'Share your thoughts, suggestions, or concerns...'
                    }
                  />
                </div>

                {feedbackType === 'bug' && (
                  <div className="form-group">
                    <label>Device & Browser Info</label>
                    <input 
                      type="text" 
                      placeholder="e.g., iPhone 13, Safari 16"
                    />
                  </div>
                )}

                <div className="quick-feedback">
                  <p>Quick Response:</p>
                  <div className="quick-options">
                    <button type="button" className="quick-btn positive">
                      <ThumbsUp size={16} /> Love it!
                    </button>
                    <button type="button" className="quick-btn neutral">
                      😐 It's okay
                    </button>
                    <button type="button" className="quick-btn negative">
                      <ThumbsDown size={16} /> Needs work
                    </button>
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>

          <div className="feedback-recent">
            <h2>Recent Updates Based on Feedback</h2>
            <div className="updates-list">
              <div className="update-item">
                <span className="update-badge new">New</span>
                <h4>Dark Mode Added</h4>
                <p>Based on popular demand, we've added a dark mode option</p>
              </div>
              <div className="update-item">
                <span className="update-badge improved">Improved</span>
                <h4>Faster Quiz Loading</h4>
                <p>Quiz loading times reduced by 60%</p>
              </div>
              <div className="update-item">
                <span className="update-badge fixed">Fixed</span>
                <h4>Audio Playback Issues</h4>
                <p>Fixed audio lessons not playing on some devices</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="static-footer">
        <p>© 2025 AI Tutor. All rights reserved. Powered by <a href="https://kasoftware.in/" target="_blank" rel="noopener noreferrer">KA Software</a></p>
      </footer>
    </div>
  );
}

export default Feedback;
