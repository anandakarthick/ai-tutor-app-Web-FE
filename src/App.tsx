/**
 * Main App with Routing
 */

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components';
import {
  Landing,
  Dashboard,
  Login,
  Register,
  Learn,
  SubjectDetail,
  ChapterDetail,
  Lesson,
  Quizzes,
  QuizTaking,
  Doubts,
  Progress,
  Profile,
  StudyPlan,
  AboutUs,
  Careers,
  Blog,
  HelpCenter,
  ContactUs,
  PrivacyPolicy,
} from './pages';
import { useAuthStore } from './store/authStore';
import { isAuthenticated, initializeEncryption, getEncryptionStatus } from './services/api';
import { encryptionDebug } from './services/encryption'; // Load debug utilities
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated: authState, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  if (!isAuthenticated() && !authState) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
}

// Public Route (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated: authState } = useAuthStore();

  if (isAuthenticated() || authState) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { loadStoredAuth, fetchStudents, student } = useAuthStore();
  const [encryptionInitialized, setEncryptionInitialized] = useState(false);

  // Initialize encryption on app start
  useEffect(() => {
    const initEncryption = async () => {
      try {
        console.log('🔐 Starting E2E encryption initialization...');
        const success = await initializeEncryption();
        console.log('🔐 Encryption initialization result:', success);
        console.log('📋 Encryption status:', getEncryptionStatus());
        
        // Log debug helper availability
        if (success) {
          console.log('💡 Debug utilities available. Type encryptionDebug.help() in console for commands.');
        }
      } catch (error) {
        console.error('❌ Encryption initialization error:', error);
      } finally {
        setEncryptionInitialized(true);
      }
    };

    initEncryption();
    
    // Ensure debug utilities are loaded
    if (encryptionDebug) {
      console.log('🔧 Encryption debug utilities ready');
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated() && !student) {
      fetchStudents();
    }
  }, [student]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1C1917',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px 20px',
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Static Pages */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/subject/:subjectId"
          element={
            <ProtectedRoute>
              <SubjectDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/chapter/:chapterId"
          element={
            <ProtectedRoute>
              <ChapterDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/topic/:topicId"
          element={
            <ProtectedRoute>
              <Lesson />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <Quizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:quizId"
          element={
            <ProtectedRoute>
              <QuizTaking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doubts"
          element={
            <ProtectedRoute>
              <Doubts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study-plan"
          element={
            <ProtectedRoute>
              <StudyPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 - Redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
