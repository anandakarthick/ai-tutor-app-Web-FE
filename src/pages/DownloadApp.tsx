/**
 * Download App Page
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Smartphone, Monitor, CheckCircle, Star, Download, Play, Apple } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function DownloadApp() {
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
        <div className="content-container">
          <div className="download-hero">
            <h1>Download {settings.siteName}</h1>
            <p>Learn anywhere, anytime with our mobile and desktop apps</p>
          </div>

          <div className="download-platforms">
            <div className="platform-card">
              <div className="platform-icon android">
                <Play size={40} />
              </div>
              <h3>Android App</h3>
              <p>For Android 8.0 and above</p>
              <div className="app-rating">
                <div className="stars">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <span>4.8 (10K+ reviews)</span>
              </div>
              <ul className="platform-features">
                <li><CheckCircle size={16} /> Offline learning mode</li>
                <li><CheckCircle size={16} /> Push notifications</li>
                <li><CheckCircle size={16} /> Screen casting support</li>
                <li><CheckCircle size={16} /> Lightweight (25MB)</li>
              </ul>
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="download-btn android">
                <Play size={20} />
                Get it on Google Play
              </a>
            </div>

            <div className="platform-card">
              <div className="platform-icon ios">
                <Apple size={40} />
              </div>
              <h3>iOS App</h3>
              <p>For iOS 14.0 and above</p>
              <div className="app-rating">
                <div className="stars">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <span>4.9 (5K+ reviews)</span>
              </div>
              <ul className="platform-features">
                <li><CheckCircle size={16} /> Optimized for iPad</li>
                <li><CheckCircle size={16} /> Apple Watch companion</li>
                <li><CheckCircle size={16} /> Siri integration</li>
                <li><CheckCircle size={16} /> iCloud sync</li>
              </ul>
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="download-btn ios">
                <Apple size={20} />
                Download on App Store
              </a>
            </div>

            <div className="platform-card">
              <div className="platform-icon web">
                <Monitor size={40} />
              </div>
              <h3>Web App</h3>
              <p>Use on any browser</p>
              <div className="app-rating">
                <div className="stars">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <span>Best for large screens</span>
              </div>
              <ul className="platform-features">
                <li><CheckCircle size={16} /> No download required</li>
                <li><CheckCircle size={16} /> Works on all browsers</li>
                <li><CheckCircle size={16} /> Keyboard shortcuts</li>
                <li><CheckCircle size={16} /> Large screen optimized</li>
              </ul>
              <Link to="/register" className="download-btn web">
                <Monitor size={20} />
                Open Web App
              </Link>
            </div>
          </div>

          <div className="download-qr">
            <h2>Scan to Download</h2>
            <p>Scan the QR code with your phone camera to download the app</p>
            <div className="qr-container">
              <div className="qr-placeholder">
                <Smartphone size={60} />
                <p>QR Code</p>
              </div>
            </div>
          </div>

          <div className="download-features">
            <h2>Why Download the App?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <Download size={24} />
                <h4>Offline Access</h4>
                <p>Download lessons and study without internet</p>
              </div>
              <div className="feature-item">
                <Smartphone size={24} />
                <h4>Native Experience</h4>
                <p>Smooth, fast, and optimized for your device</p>
              </div>
              <div className="feature-item">
                <Star size={24} />
                <h4>Exclusive Features</h4>
                <p>Voice commands, widgets, and more</p>
              </div>
              <div className="feature-item">
                <CheckCircle size={24} />
                <h4>Auto Sync</h4>
                <p>Progress synced across all devices</p>
              </div>
            </div>
          </div>

          <div className="system-requirements">
            <h2>System Requirements</h2>
            <div className="requirements-grid">
              <div className="requirement-item">
                <h4>Android</h4>
                <ul>
                  <li>Android 8.0 or higher</li>
                  <li>2GB RAM minimum</li>
                  <li>100MB free storage</li>
                </ul>
              </div>
              <div className="requirement-item">
                <h4>iOS</h4>
                <ul>
                  <li>iOS 14.0 or higher</li>
                  <li>iPhone 6s or newer</li>
                  <li>100MB free storage</li>
                </ul>
              </div>
              <div className="requirement-item">
                <h4>Web</h4>
                <ul>
                  <li>Chrome, Firefox, Safari, Edge</li>
                  <li>JavaScript enabled</li>
                  <li>Stable internet connection</li>
                </ul>
              </div>
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

export default DownloadApp;
