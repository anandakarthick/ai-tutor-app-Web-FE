/**
 * Maintenance Page
 * Displayed when the site is under maintenance
 */

import { useSettings } from '../context/SettingsContext';
import logoImage from '../assets/images/logo.png';
import './StaticPages.css';

export function MaintenancePage() {
  const { settings } = useSettings();

  return (
    <div className="static-page maintenance-page">
      <main className="static-content">
        <div className="maintenance-container">
          <div className="maintenance-icon">
            <img src={logoImage} alt={settings.siteName} className="maintenance-logo" />
          </div>
          
          <div className="maintenance-animation">
            <div className="gear gear-1">⚙️</div>
            <div className="gear gear-2">🔧</div>
            <div className="gear gear-3">⚙️</div>
          </div>

          <h1>We'll Be Back Soon!</h1>
          
          <p className="maintenance-message">
            {settings.maintenanceMessage || 'We are currently performing scheduled maintenance to improve your experience. Please check back shortly.'}
          </p>

          <div className="maintenance-info">
            <div className="info-item">
              <span className="info-icon">📧</span>
              <span>Email: {settings.supportEmail}</span>
            </div>
            <div className="info-item">
              <span className="info-icon">📞</span>
              <span>Phone: {settings.supportPhone}</span>
            </div>
          </div>

          <div className="maintenance-social">
            <p>Follow us for updates:</p>
            <div className="social-links">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="social-link">
                  Facebook
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="social-link">
                  Twitter
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="social-link">
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="static-footer">
        <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
      </footer>

      <style>{`
        .maintenance-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .maintenance-page .static-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .maintenance-container {
          text-align: center;
          max-width: 600px;
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .maintenance-logo {
          width: 80px;
          height: 80px;
          margin-bottom: 1rem;
        }

        .maintenance-animation {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 2rem 0;
        }

        .gear {
          font-size: 2.5rem;
          animation: spin 3s linear infinite;
        }

        .gear-1 { animation-duration: 3s; }
        .gear-2 { animation-duration: 2s; animation-direction: reverse; }
        .gear-3 { animation-duration: 4s; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .maintenance-container h1 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 2rem;
        }

        .maintenance-message {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .maintenance-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 10px;
          margin-bottom: 2rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #555;
        }

        .info-icon {
          font-size: 1.2rem;
        }

        .maintenance-social p {
          color: #888;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .social-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border: 1px solid #667eea;
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: #667eea;
          color: white;
        }

        .maintenance-page .static-footer {
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
        }

        .maintenance-page .static-footer p {
          color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 600px) {
          .maintenance-container {
            padding: 2rem;
            margin: 1rem;
          }

          .maintenance-container h1 {
            font-size: 1.5rem;
          }

          .gear {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default MaintenancePage;
