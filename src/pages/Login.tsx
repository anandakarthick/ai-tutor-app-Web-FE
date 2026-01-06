/**
 * Login Page - Fixed
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2, Brain, MessageCircle, BarChart3, Home } from 'lucide-react';
import { authApi, setAuthTokens, setStoredUser, setStoredStudent } from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import logoImage from '../assets/images/logo.png';
import './Auth.css';

export function Login() {
  const navigate = useNavigate();
  const { setUser, setStudent, fetchStudents } = useAuthStore();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.sendOtp(phone, 'login');
      if (response.success) {
        toast.success('OTP sent successfully!');
        setStep('otp');
        // Show OTP in dev mode
        if (response.data?.otp) {
          toast(`Dev OTP: ${response.data.otp}`, { duration: 10000 });
        }
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.loginWithOtp(phone, otp);
      if (response.success && response.data) {
        const { user, student, accessToken, refreshToken } = response.data;
        
        // Store tokens in localStorage
        if (accessToken && refreshToken) {
          setAuthTokens(accessToken, refreshToken);
        }
        
        // Store user and student data
        if (user) {
          setStoredUser(user);
          setUser(user);
        }
        
        if (student) {
          setStoredStudent(student);
          setStudent(student);
        } else {
          await fetchStudents();
        }
        
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="home-link">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <img src={logoImage} alt="AI Tutor" className="auth-logo" />
          <h1>Welcome Back!</h1>
          <p>Sign in to continue your learning journey</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="auth-form">
            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  className="input-no-icon"
                />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <Loader2 size={20} className="spinner" />
              ) : (
                <>
                  Send OTP
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <div className="form-group">
              <label>Enter OTP</label>
              <p className="otp-sent-text">OTP sent to +91 {phone}</p>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="input-no-icon input-with-toggle"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <Loader2 size={20} className="spinner" />
              ) : (
                <>
                  Verify & Login
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <button
              type="button"
              className="back-btn"
              onClick={() => { setStep('phone'); setOtp(''); }}
            >
              Change Phone Number
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>
      </div>

      <div className="auth-banner">
        <div className="banner-content">
          <h2>Learn Smarter with AI</h2>
          <p>Personalized education that adapts to your learning style</p>
          <div className="banner-features">
            <div className="banner-feature">
              <div className="feature-icon-wrap">
                <Brain size={24} />
              </div>
              <span>AI-Powered Teaching</span>
            </div>
            <div className="banner-feature">
              <div className="feature-icon-wrap">
                <MessageCircle size={24} />
              </div>
              <span>Instant Doubt Resolution</span>
            </div>
            <div className="banner-feature">
              <div className="feature-icon-wrap">
                <BarChart3 size={24} />
              </div>
              <span>Progress Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
