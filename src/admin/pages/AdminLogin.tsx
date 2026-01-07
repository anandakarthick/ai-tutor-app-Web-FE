/**
 * Admin Login Page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminStore } from '../store/adminStore';
import logoImage from '../../assets/images/logo.png';
import './AdminLogin.css';

export function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);

    try {
      // Simulating login for now
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Demo login - accept any credentials for now
      if (email === 'admin@aitutor.com' && password === 'admin123') {
        const adminData = {
          id: '1',
          name: 'Super Admin',
          email: email,
          role: 'super_admin' as const,
          permissions: ['all'],
        };

        login(adminData, 'demo-token-123');
        toast.success('Login successful!');
        navigate('/admin');
      } else {
        // For demo, allow any login
        const adminData = {
          id: '1',
          name: email.split('@')[0],
          email: email,
          role: 'admin' as const,
          permissions: ['read', 'write'],
        };

        login(adminData, 'demo-token-123');
        toast.success('Login successful!');
        navigate('/admin');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-branding">
            <img src={logoImage} alt="AI Tutor" />
            <h1>AI Tutor Admin</h1>
            <p>Manage your educational platform</p>
          </div>
          <div className="login-features">
            <div className="feature-item">
              <Shield size={20} />
              <div>
                <h4>Secure Access</h4>
                <p>Enterprise-grade security</p>
              </div>
            </div>
            <div className="feature-item">
              <Lock size={20} />
              <div>
                <h4>Role-Based Permissions</h4>
                <p>Granular access control</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <div className="login-header">
              <div className="login-icon">
                <Shield size={26} />
              </div>
              <h2>Admin Login</h2>
              <p>Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@aitutor.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>Demo: admin@aitutor.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
