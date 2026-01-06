/**
 * Register Page - Multi-Step Registration matching Mobile App
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  ChevronDown, 
  BookOpen, 
  Target, 
  Trophy, 
  Home,
  Check,
} from 'lucide-react';
import { authApi, contentApi, setAuthTokens, setStoredUser, setStoredStudent } from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import logoImage from '../assets/images/logo.png';
import './Auth.css';

// Medium options matching mobile
const MEDIUMS = [
  { id: 'english', name: 'English', emoji: '🇬🇧' },
  { id: 'hindi', name: 'Hindi', emoji: '🇮🇳' },
  { id: 'tamil', name: 'Tamil', emoji: '🏛️' },
  { id: 'telugu', name: 'Telugu', emoji: '🎭' },
  { id: 'kannada', name: 'Kannada', emoji: '🪔' },
  { id: 'malayalam', name: 'Malayalam', emoji: '🌴' },
  { id: 'marathi', name: 'Marathi', emoji: '🏰' },
  { id: 'bengali', name: 'Bengali', emoji: '🎨' },
  { id: 'gujarati', name: 'Gujarati', emoji: '🦁' },
];

// Gender options
const GENDERS = [
  { id: 'male', name: 'Male', emoji: '👦' },
  { id: 'female', name: 'Female', emoji: '👧' },
  { id: 'other', name: 'Other', emoji: '🧑' },
];

// Learning style options
const LEARNING_STYLES = [
  { id: 'visual', name: 'Visual', emoji: '👁️', desc: 'Learn by seeing' },
  { id: 'auditory', name: 'Auditory', emoji: '👂', desc: 'Learn by hearing' },
  { id: 'kinesthetic', name: 'Kinesthetic', emoji: '✋', desc: 'Learn by doing' },
  { id: 'reading', name: 'Reading/Writing', emoji: '📖', desc: 'Learn by reading' },
];

// Daily study hours
const STUDY_HOURS = ['1', '2', '3', '4', '5', '6'];

type Step = 1 | 2 | 3 | 'otp';

export function Register() {
  const navigate = useNavigate();
  const { setUser, setStudent } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Basic Information
  const [formData, setFormData] = useState({
    phone: '',
    fullName: '',
    studentName: '',
    schoolName: '',
    boardId: '',
    classId: '',
    medium: '',
  });

  // Step 2: Additional Details
  const [additionalData, setAdditionalData] = useState({
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    section: '',
  });

  // Step 3: Learning Preferences
  const [preferences, setPreferences] = useState({
    learningStyle: '',
    dailyStudyHours: '2',
  });

  const [otp, setOtp] = useState('');
  const [boards, setBoards] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    if (formData.boardId) {
      loadClasses(formData.boardId);
      setFormData(prev => ({ ...prev, classId: '' }));
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
      // Fallback boards
      setBoards([
        { id: 'cbse', name: 'CBSE' },
        { id: 'icse', name: 'ICSE' },
        { id: 'state', name: 'State Board' },
      ]);
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
      // Fallback classes
      setClasses([
        { id: 'class-6', displayName: 'Class 6th' },
        { id: 'class-7', displayName: 'Class 7th' },
        { id: 'class-8', displayName: 'Class 8th' },
        { id: 'class-9', displayName: 'Class 9th' },
        { id: 'class-10', displayName: 'Class 10th' },
        { id: 'class-11', displayName: 'Class 11th' },
        { id: 'class-12', displayName: 'Class 12th' },
      ]);
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.phone || formData.phone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }
    if (!formData.boardId) {
      newErrors.boardId = 'Please select a board';
    }
    if (!formData.classId) {
      newErrors.classId = 'Please select a class';
    }
    if (!formData.medium) {
      newErrors.medium = 'Please select medium of instruction';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (additionalData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(additionalData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (additionalData.password && additionalData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Send OTP
      await handleSendOtp();
    }
  };

  const handleBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep(3);
    } else if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSkip = () => {
    if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      handleSendOtp();
    }
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const response = await authApi.sendOtp(formData.phone, 'registration');
      if (response.success) {
        toast.success('OTP sent successfully!');
        setCurrentStep('otp');
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
        setLoading(false);
        return;
      }

      // Then register with all data
      const registerData = {
        ...formData,
        ...additionalData,
        ...preferences,
        dailyStudyHours: parseInt(preferences.dailyStudyHours, 10) || 2,
      };

      const response = await authApi.register(registerData);
      
      if (response.success && response.data) {
        const { user, student, accessToken, refreshToken } = response.data;
        
        if (accessToken && refreshToken) {
          setAuthTokens(accessToken, refreshToken);
        }
        
        if (user) {
          setStoredUser(user);
          setUser(user);
        }
        
        if (student) {
          setStoredStudent(student);
          setStudent(student);
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

  const getProgress = () => {
    if (currentStep === 'otp') return 100;
    return (currentStep / 3) * 100;
  };

  const getBoardEmoji = (name: string) => {
    const map: Record<string, string> = {
      'CBSE': '📘',
      'ICSE': '📗',
      'State Board': '📙',
      'IB': '📕',
      'Cambridge': '📓',
    };
    return map[name] || '📚';
  };

  // Step 1: Basic Information
  const renderStep1 = () => (
    <div className="register-step">
      <h2 className="step-title">📋 Basic Information</h2>
      <p className="step-subtitle">Tell us about yourself</p>

      {/* Phone Number */}
      <div className="form-group">
        <label>Mobile Number <span className="required">*</span></label>
        <div className="phone-input-row">
          <div className="country-code">🇮🇳 +91</div>
          <div className={`input-wrapper no-icon ${errors.phone ? 'has-error' : ''}`}>
            <input
              type="tel"
              placeholder="Enter 10-digit number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              maxLength={10}
            />
          </div>
        </div>
        {errors.phone && <span className="error-text">{errors.phone}</span>}
      </div>

      {/* Full Name */}
      <div className="form-group">
        <label>Your Full Name <span className="required">*</span></label>
        <div className={`input-wrapper no-icon ${errors.fullName ? 'has-error' : ''}`}>
          <input
            type="text"
            placeholder="Enter your name (parent/guardian)"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>
        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
      </div>

      {/* Student Name */}
      <div className="form-group">
        <label>Student Name <span className="required">*</span></label>
        <div className={`input-wrapper no-icon ${errors.studentName ? 'has-error' : ''}`}>
          <input
            type="text"
            placeholder="Enter student's full name"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
          />
        </div>
        {errors.studentName && <span className="error-text">{errors.studentName}</span>}
      </div>

      {/* School Name */}
      <div className="form-group">
        <label>School Name</label>
        <div className="input-wrapper no-icon">
          <input
            type="text"
            placeholder="Enter school name (optional)"
            value={formData.schoolName}
            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
          />
        </div>
      </div>

      {/* Board Selection */}
      <div className="form-group">
        <label>Board of Education <span className="required">*</span></label>
        <div className={`board-grid ${errors.boardId ? 'has-error' : ''}`}>
          {boards.map((board) => (
            <div
              key={board.id}
              className={`board-card ${formData.boardId === board.id ? 'selected' : ''}`}
              onClick={() => setFormData({ ...formData, boardId: board.id })}
            >
              <span className="board-emoji">{getBoardEmoji(board.name)}</span>
              <span className="board-name">{board.name}</span>
              {formData.boardId === board.id && (
                <div className="check-badge"><Check size={12} /></div>
              )}
            </div>
          ))}
        </div>
        {errors.boardId && <span className="error-text">{errors.boardId}</span>}
      </div>

      {/* Class Selection */}
      <div className="form-group">
        <label>Class / Grade <span className="required">*</span></label>
        {!formData.boardId ? (
          <p className="helper-text">Please select a board first</p>
        ) : (
          <div className={`class-chips ${errors.classId ? 'has-error' : ''}`}>
            {classes.map((cls) => (
              <div
                key={cls.id}
                className={`class-chip ${formData.classId === cls.id ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, classId: cls.id })}
              >
                {cls.displayName || cls.className}
              </div>
            ))}
          </div>
        )}
        {errors.classId && <span className="error-text">{errors.classId}</span>}
      </div>

      {/* Medium Selection */}
      <div className="form-group">
        <label>Medium of Instruction <span className="required">*</span></label>
        <div className={`select-wrapper ${errors.medium ? 'has-error' : ''}`}>
          <select
            value={formData.medium}
            onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
          >
            <option value="">Select Medium</option>
            {MEDIUMS.map((medium) => (
              <option key={medium.id} value={medium.id}>
                {medium.emoji} {medium.name}
              </option>
            ))}
          </select>
          <div className="select-icon"><ChevronDown size={20} /></div>
        </div>
        {errors.medium && <span className="error-text">{errors.medium}</span>}
      </div>
    </div>
  );

  // Step 2: Additional Details
  const renderStep2 = () => (
    <div className="register-step">
      <h2 className="step-title">📝 Additional Details</h2>
      <p className="step-subtitle">Help us personalize your experience (Optional)</p>

      {/* Email */}
      <div className="form-group">
        <label>Email</label>
        <div className={`input-wrapper no-icon ${errors.email ? 'has-error' : ''}`}>
          <input
            type="email"
            placeholder="Enter email address"
            value={additionalData.email}
            onChange={(e) => setAdditionalData({ ...additionalData, email: e.target.value })}
          />
        </div>
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      {/* Password */}
      <div className="form-group">
        <label>Password</label>
        <div className={`input-wrapper no-icon ${errors.password ? 'has-error' : ''}`}>
          <input
            type="password"
            placeholder="Create a password (min 6 characters)"
            value={additionalData.password}
            onChange={(e) => setAdditionalData({ ...additionalData, password: e.target.value })}
          />
        </div>
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      {/* Date of Birth */}
      <div className="form-group">
        <label>Date of Birth</label>
        <div className="input-wrapper no-icon">
          <input
            type="date"
            value={additionalData.dateOfBirth}
            onChange={(e) => setAdditionalData({ ...additionalData, dateOfBirth: e.target.value })}
          />
        </div>
      </div>

      {/* Gender Selection */}
      <div className="form-group">
        <label>Gender</label>
        <div className="gender-grid">
          {GENDERS.map((g) => (
            <div
              key={g.id}
              className={`gender-card ${additionalData.gender === g.id ? 'selected' : ''}`}
              onClick={() => setAdditionalData({ ...additionalData, gender: g.id })}
            >
              <span className="gender-emoji">{g.emoji}</span>
              <span className="gender-name">{g.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section */}
      <div className="form-group">
        <label>Section</label>
        <div className="input-wrapper no-icon" style={{ maxWidth: 150 }}>
          <input
            type="text"
            placeholder="e.g., A, B, C"
            value={additionalData.section}
            onChange={(e) => setAdditionalData({ ...additionalData, section: e.target.value.toUpperCase() })}
            maxLength={5}
            style={{ textAlign: 'center', textTransform: 'uppercase' }}
          />
        </div>
      </div>
    </div>
  );

  // Step 3: Learning Preferences
  const renderStep3 = () => (
    <div className="register-step">
      <h2 className="step-title">🎯 Learning Preferences</h2>
      <p className="step-subtitle">Help us customize your learning journey (Optional)</p>

      {/* Learning Style */}
      <div className="form-group">
        <label>How do you learn best?</label>
        <div className="learning-grid">
          {LEARNING_STYLES.map((style) => (
            <div
              key={style.id}
              className={`learning-card ${preferences.learningStyle === style.id ? 'selected' : ''}`}
              onClick={() => setPreferences({ ...preferences, learningStyle: style.id })}
            >
              <span className="learning-emoji">{style.emoji}</span>
              <span className="learning-name">{style.name}</span>
              <span className="learning-desc">{style.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Study Hours */}
      <div className="form-group">
        <label>Daily study hours available</label>
        <div className="hours-grid">
          {STUDY_HOURS.map((hour) => (
            <div
              key={hour}
              className={`hour-chip ${preferences.dailyStudyHours === hour ? 'selected' : ''}`}
              onClick={() => setPreferences({ ...preferences, dailyStudyHours: hour })}
            >
              {hour} hr{hour !== '1' ? 's' : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="summary-card">
        <h3>📋 Registration Summary</h3>
        <div className="summary-content">
          <div className="summary-row">
            <span className="summary-label">Name:</span>
            <span className="summary-value">{formData.fullName}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Student:</span>
            <span className="summary-value">{formData.studentName}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Phone:</span>
            <span className="summary-value">+91 {formData.phone}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Board:</span>
            <span className="summary-value">{boards.find(b => b.id === formData.boardId)?.name}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Class:</span>
            <span className="summary-value">{classes.find(c => c.id === formData.classId)?.displayName}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Medium:</span>
            <span className="summary-value">{MEDIUMS.find(m => m.id === formData.medium)?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // OTP Step
  const renderOtpStep = () => (
    <div className="register-step">
      <h2 className="step-title">🔐 Verify OTP</h2>
      <p className="step-subtitle">Enter the OTP sent to +91 {formData.phone}</p>

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Enter 6-digit OTP</label>
          <div className="otp-input-wrapper">
            <input
              type="text"
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="otp-input"
            />
          </div>
        </div>

        <button type="submit" className="auth-btn" disabled={loading || otp.length !== 6}>
          {loading ? <Loader2 size={20} className="spinner" /> : <>Create Account <Check size={20} /></>}
        </button>

        <button type="button" className="resend-btn" onClick={handleSendOtp} disabled={loading}>
          Resend OTP
        </button>
      </form>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="auth-header">
          <Link to="/" className="home-link">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <img src={logoImage} alt="AI Tutor" className="auth-logo" />
          <h1>Create Account</h1>
          <p>Start your learning journey today</p>
        </div>

        {/* Progress Bar */}
        {currentStep !== 'otp' && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${getProgress()}%` }} />
            <div className="progress-steps">
              <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
              <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
              <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="auth-form">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 'otp' && renderOtpStep()}

          {/* Navigation Buttons */}
          {currentStep !== 'otp' && (
            <div className="step-buttons">
              {currentStep > 1 && (
                <button type="button" className="back-btn" onClick={handleBack}>
                  <ArrowLeft size={20} /> Back
                </button>
              )}
              
              {currentStep > 1 && (
                <button type="button" className="skip-btn" onClick={handleSkip}>
                  Skip
                </button>
              )}
              
              <button 
                type="button" 
                className="auth-btn" 
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 size={20} className="spinner" />
                ) : currentStep === 3 ? (
                  <>Complete Registration <Check size={20} /></>
                ) : (
                  <>Continue <ArrowRight size={20} /></>
                )}
              </button>
            </div>
          )}

          {currentStep === 'otp' && (
            <button type="button" className="back-btn full-width" onClick={handleBack}>
              <ArrowLeft size={20} /> Go Back
            </button>
          )}
        </div>

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
              <div className="feature-icon-wrap">
                <BookOpen size={24} />
              </div>
              <span>All Subjects Covered</span>
            </div>
            <div className="banner-feature">
              <div className="feature-icon-wrap">
                <Target size={24} />
              </div>
              <span>Personalized Learning</span>
            </div>
            <div className="banner-feature">
              <div className="feature-icon-wrap">
                <Trophy size={24} />
              </div>
              <span>Gamified Experience</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
