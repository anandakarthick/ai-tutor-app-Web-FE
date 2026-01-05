/**
 * Blog Page
 */

import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  ChevronRight,
  Brain,
  BookOpen,
  Gamepad2,
  Timer,
  Users,
  Calculator,
} from 'lucide-react';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

const blogPosts = [
  {
    title: 'How AI is Revolutionizing Education in India',
    excerpt: 'Discover how artificial intelligence is transforming the way students learn and teachers teach across the country.',
    author: 'Dr. Priya Sharma',
    date: 'Dec 28, 2024',
    readTime: '5 min read',
    category: 'Education',
    icon: Brain,
    color: '#F97316',
  },
  {
    title: '10 Study Tips for Board Exam Success',
    excerpt: 'Expert-backed strategies to help you prepare effectively for your upcoming board examinations.',
    author: 'Rahul Verma',
    date: 'Dec 20, 2024',
    readTime: '7 min read',
    category: 'Study Tips',
    icon: BookOpen,
    color: '#3B82F6',
  },
  {
    title: 'The Science Behind Gamified Learning',
    excerpt: 'Understanding why gamification makes learning more effective and engaging for students of all ages.',
    author: 'Ananya Patel',
    date: 'Dec 15, 2024',
    readTime: '6 min read',
    category: 'Research',
    icon: Gamepad2,
    color: '#8B5CF6',
  },
  {
    title: 'Building Better Study Habits with AI',
    excerpt: 'Learn how AI-powered tools can help you develop consistent and effective study routines.',
    author: 'Dr. Amit Kumar',
    date: 'Dec 10, 2024',
    readTime: '4 min read',
    category: 'Productivity',
    icon: Timer,
    color: '#22C55E',
  },
  {
    title: 'Parent\'s Guide to Supporting Online Learning',
    excerpt: 'Practical tips for parents to help their children succeed in the digital learning environment.',
    author: 'Meera Reddy',
    date: 'Dec 5, 2024',
    readTime: '8 min read',
    category: 'Parenting',
    icon: Users,
    color: '#EC4899',
  },
  {
    title: 'Mathematics Made Easy: Overcoming Math Anxiety',
    excerpt: 'Strategies and techniques to help students overcome their fear of mathematics.',
    author: 'Prof. Suresh Nair',
    date: 'Nov 28, 2024',
    readTime: '6 min read',
    category: 'Mathematics',
    icon: Calculator,
    color: '#14B8A6',
  },
];

export function Blog() {
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
          <h1>Blog</h1>
          <p className="subtitle">Insights, tips, and stories about education and learning</p>

          <section className="blog-section">
            <div className="blog-grid">
              {blogPosts.map((post, index) => {
                const Icon = post.icon;
                return (
                  <article key={index} className="blog-card">
                    <div className="blog-image" style={{ background: `${post.color}15` }}>
                      <Icon size={48} color={post.color} />
                    </div>
                    <div className="blog-content">
                      <span className="blog-category" style={{ background: `${post.color}15`, color: post.color }}>{post.category}</span>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <div className="blog-meta">
                        <span><User size={14} /> {post.author}</span>
                        <span><Calendar size={14} /> {post.date}</span>
                        <span><Clock size={14} /> {post.readTime}</span>
                      </div>
                      <button className="read-more">
                        Read More <ChevronRight size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="cta-section">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get the latest articles and tips delivered to your inbox.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="btn btn-primary">Subscribe</button>
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

export default Blog;
