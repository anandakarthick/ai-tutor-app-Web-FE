/**
 * Community Page
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle, Award, Calendar, ExternalLink, Trophy, Star, Heart } from 'lucide-react';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function Community() {
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
          <div className="community-hero">
            <h1>Join Our Community</h1>
            <p>Connect with fellow learners, share knowledge, and grow together</p>
          </div>

          <div className="community-stats">
            <div className="stat-card">
              <Users size={32} />
              <span className="stat-value">50,000+</span>
              <span className="stat-label">Community Members</span>
            </div>
            <div className="stat-card">
              <MessageCircle size={32} />
              <span className="stat-value">10,000+</span>
              <span className="stat-label">Daily Discussions</span>
            </div>
            <div className="stat-card">
              <Award size={32} />
              <span className="stat-value">500+</span>
              <span className="stat-label">Top Contributors</span>
            </div>
          </div>

          <section className="community-section">
            <h2>Community Channels</h2>
            <div className="channels-grid">
              <a href="https://discord.gg/aitutor" target="_blank" rel="noopener noreferrer" className="channel-card discord">
                <div className="channel-icon">💬</div>
                <h3>Discord Server</h3>
                <p>Real-time chat with students and mentors</p>
                <span className="join-link">Join Server <ExternalLink size={14} /></span>
              </a>
              <a href="https://t.me/aitutor" target="_blank" rel="noopener noreferrer" className="channel-card telegram">
                <div className="channel-icon">📱</div>
                <h3>Telegram Group</h3>
                <p>Updates, tips, and study materials</p>
                <span className="join-link">Join Group <ExternalLink size={14} /></span>
              </a>
              <a href="https://www.reddit.com/r/aitutor" target="_blank" rel="noopener noreferrer" className="channel-card reddit">
                <div className="channel-icon">🔴</div>
                <h3>Reddit Community</h3>
                <p>Discussions, Q&A, and resources</p>
                <span className="join-link">Join Subreddit <ExternalLink size={14} /></span>
              </a>
              <a href="https://facebook.com/groups/aitutor" target="_blank" rel="noopener noreferrer" className="channel-card facebook">
                <div className="channel-icon">👥</div>
                <h3>Facebook Group</h3>
                <p>Parent and student community</p>
                <span className="join-link">Join Group <ExternalLink size={14} /></span>
              </a>
            </div>
          </section>

          <section className="community-section">
            <h2>Leaderboard</h2>
            <p>Top learners this month</p>
            <div className="leaderboard">
              <div className="leaderboard-item gold">
                <span className="rank">🥇</span>
                <div className="user-info">
                  <span className="user-name">Aisha Sharma</span>
                  <span className="user-class">Class 10 • CBSE</span>
                </div>
                <div className="user-stats">
                  <Star size={16} /> 12,450 XP
                </div>
              </div>
              <div className="leaderboard-item silver">
                <span className="rank">🥈</span>
                <div className="user-info">
                  <span className="user-name">Rahul Verma</span>
                  <span className="user-class">Class 9 • ICSE</span>
                </div>
                <div className="user-stats">
                  <Star size={16} /> 11,890 XP
                </div>
              </div>
              <div className="leaderboard-item bronze">
                <span className="rank">🥉</span>
                <div className="user-info">
                  <span className="user-name">Priya Patel</span>
                  <span className="user-class">Class 12 • CBSE</span>
                </div>
                <div className="user-stats">
                  <Star size={16} /> 11,234 XP
                </div>
              </div>
            </div>
          </section>

          <section className="community-section">
            <h2>Upcoming Events</h2>
            <div className="events-list">
              <div className="event-card">
                <div className="event-date">
                  <span className="day">15</span>
                  <span className="month">Jan</span>
                </div>
                <div className="event-info">
                  <h4>Weekly Quiz Challenge</h4>
                  <p>Compete with students across India</p>
                  <span className="event-time"><Calendar size={14} /> Saturday, 4:00 PM</span>
                </div>
                <button className="event-join">Join</button>
              </div>
              <div className="event-card">
                <div className="event-date">
                  <span className="day">20</span>
                  <span className="month">Jan</span>
                </div>
                <div className="event-info">
                  <h4>Live Doubt Session - Physics</h4>
                  <p>Ask your doubts live to expert teachers</p>
                  <span className="event-time"><Calendar size={14} /> Thursday, 6:00 PM</span>
                </div>
                <button className="event-join">Join</button>
              </div>
              <div className="event-card">
                <div className="event-date">
                  <span className="day">25</span>
                  <span className="month">Jan</span>
                </div>
                <div className="event-info">
                  <h4>Study Group: Board Exam Prep</h4>
                  <p>Group study session for Class 10 & 12</p>
                  <span className="event-time"><Calendar size={14} /> Tuesday, 5:00 PM</span>
                </div>
                <button className="event-join">Join</button>
              </div>
            </div>
          </section>

          <section className="community-section">
            <h2>Community Guidelines</h2>
            <div className="guidelines">
              <div className="guideline">
                <Heart size={20} />
                <p><strong>Be Respectful:</strong> Treat everyone with kindness and respect</p>
              </div>
              <div className="guideline">
                <Users size={20} />
                <p><strong>Help Others:</strong> Share knowledge and support fellow learners</p>
              </div>
              <div className="guideline">
                <Trophy size={20} />
                <p><strong>Stay Positive:</strong> Encourage and motivate each other</p>
              </div>
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

export default Community;
