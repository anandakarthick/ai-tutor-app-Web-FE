/**
 * Register Page
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, ArrowRight, Loader2, ChevronDown } from 'lucide-react';
import { authApi, contentApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import logoImage from '../assets/images/logo.png';
import './Auth.css';

export function Register() {
  const navigate = useNavigate();
  const { setUser, setStudent } = useAuthStore();
  
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    studentName: '',
    phone: '',
    email: '',
    boardId: '',
    classId: '',
    medium: 'english',
  });
  const [otp, setOtp] = useState('');
  
  const [boards, setBoards] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    if (formData.boardId) {
      loadClasses(formData.boardId);
    }
  }, [formData.boardId]);

  const loadBoards = async () => {
    try {
      const response = await contentApi.boards.getAll();
      if (response.success) {
        setBoards(response.data);
      }
    } catch (error) {
      console.error('Failed to load boards:', error);
    }
  };

  const loadClasses = async (boardId: string) => {
    try {
      const response = await contentApi.boards.getClasses(boardId);
      if (response.success) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.boardId || !formData.classId) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.sendOtp(formData.phone, 'registration');
      if (response.success) {
        toast.success('OTP sent successfully!');
        setStep('otp');
        if (response.data?.otp) {
          toast(`Dev OTP: ${response.data.otp}`, { duration: 10000 });
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      // First verify OTP
      const verifyRes = await authApi.verifyOtp(formData.phone, otp);
      if (!verifyRes.success) {
        toast.error('Invalid OTP');
        return;
      }

      // Then register
      const response = await authApi.register({
        ...formData,
        studentName: formData.studentName || formData.fullName,
      });
      
      if (response.success) {
        setUser(response.data.user);
        if (response.data.student) {
          setStudent(response.data.student);
        }
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <img src={logoImage} alt="AI Tutor" className="auth-logo" />
          <h1>Create Account</h1>
          <p>Start your learning journey today</p>
        </div>

        {step === 'info' ? (
          <form onSubmit={handleSendOtp} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-wrapper">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <div className="input-wrapper">
                  <Phone size={20} className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    maxLength={10}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email (Optional)</label>
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Board *</label>
                <div className="select-wrapper">
                  <select name="boardId" value={formData.boardId} onChange={handleChange} required>
                    <option value="">Select Board</option>
                    {boards.map((board) => (
                      <option key={board.id} value={board.id}>{board.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={20} className="select-icon" />
                </div>
              </div>
              <div className="form-group">
                <label>Class *</label>
                <div className="select-wrapper">
                  <select name="classId" value={formData.classId} onChange={handleChange} required>
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.displayName}</option>
                    ))}
                  </select>
                  <ChevronDown size={20} className="select-icon" />
                </div>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <Loader2 size={20} className="spinner" /> : <>Continue <ArrowRight size={20} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Enter OTP</label>
              <p className="otp-sent-text">OTP sent to +91 {formData.phone}</p>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  style={{ paddingLeft: 16 }}
                />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <Loader2 size={20} className="spinner" /> : <>Create Account <ArrowRight size={20} /></>}
            </button>

            <button type="button" className="back-btn" onClick={() => setStep('info')}>
              Go Back
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>

      <div className="auth-banner">
        <div className="banner-content">
          <h2>Join 50,000+ Students</h2>
          <p>Learning smarter with AI-powered education</p>
          <div className="banner-features">
            <div className="banner-feature">
              <span className="feature-icon">📚</span>
              <span>All Subjects Covered</span>
            </div>
            <div className="banner-feature">
              <span className="feature-icon">🎯</span>
              <span>Personalized Learning</span>
            </div>
            <div className="banner-feature">
              <span className="feature-icon">🏆</span>
              <span>Gamified Experience</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
