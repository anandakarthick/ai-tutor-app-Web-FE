/**
 * Main App with Routing
 */

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout, SessionTerminatedModal, SubscriptionGuard } from './components';
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
  Subscription,
  // Company Pages
  AboutUs,
  Careers,
  Blog,
  PressKit,
  Partners,
  // Support Pages
  HelpCenter,
  ContactUs,
  FAQs,
  Community,
  Feedback,
  // Legal Pages
  PrivacyPolicy,
  TermsOfService,
  CookiesPolicy,
  RefundPolicy,
  Disclaimer,
  // Product Pages
  DownloadApp,
  RequestDemo,
  Sitemap,
} from './pages';

// Admin imports
import {
  AdminLayout,
  AdminLogin,
  AdminDashboard,
  // Students
  StudentsManagement,
  StudentView,
  StudentEdit,
  // Schools
  SchoolsManagement,
  SchoolAdd,
  SchoolEdit,
  SchoolView,
  // Boards
  BoardsManagement,
  BoardAdd,
  BoardEdit,
  BoardView,
  // Classes
  ClassesManagement,
  ClassAdd,
  ClassEdit,
  ClassView,
  // Subjects
  SubjectsManagement,
  SubjectAdd,
  SubjectEdit,
  SubjectView,
  SubjectMapping,
  // Plans
  PlansManagement,
  PlanAdd,
  PlanEdit,
  PlanView,
  // Transactions
  TransactionsManagement,
  TransactionView,
  // Admin Users
  AdminUsersManagement,
  AdminUserAdd,
  AdminUserEdit,
  AdminUserView,
  // Other
  Analytics,
  Reports,
  AdminSettings,
  AdminProfile,
} from './admin';
import { useAuthStore } from './store/authStore';
import { useSubscriptionStore } from './store/subscriptionStore';
import { initializeEncryption, getEncryptionStatus, setSessionTerminatedCallback } from './services/api';
import { encryptionDebug } from './services/encryption';
import screenSecurity from './services/screenSecurity';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
}

// Protected Route with Subscription Check
function SubscriptionProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Layout>
      <SubscriptionGuard>{children}</SubscriptionGuard>
    </Layout>
  );
}

// Public Route (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { loadStoredAuth, fetchStudents, student, isAuthenticated, sessionTerminated, setSessionTerminated } = useAuthStore();
  const { checkSubscription, clearSubscription } = useSubscriptionStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Set up session terminated callback
  useEffect(() => {
    setSessionTerminatedCallback(() => {
      console.log('🚫 Session terminated - showing modal');
      setSessionTerminated(true);
      clearSubscription();
    });
  }, [setSessionTerminated, clearSubscription]);

  // Handle closing the session terminated modal
  const handleSessionModalClose = () => {
    setSessionTerminated(false);
    window.location.href = '/login';
  };

  // Initialize app - load stored auth, encryption, and security
  useEffect(() => {
    const initApp = async () => {
      // Load stored auth from Zustand persist
      loadStoredAuth();
      
      // Initialize screen security (prevent screenshots, screen recording)
      screenSecurity.initialize();
      
      // Initialize encryption
      try {
        console.log('🔐 Starting E2E encryption initialization...');
        const success = await initializeEncryption();
        console.log('🔐 Encryption initialization result:', success);
        console.log('📋 Encryption status:', getEncryptionStatus());
        
        if (success && encryptionDebug) {
          console.log('💡 Debug utilities available. Type encryptionDebug.help() in console for commands.');
        }
      } catch (error) {
        console.error('❌ Encryption initialization error:', error);
      }
      
      setIsInitialized(true);
    };

    initApp();
  }, []);

  // Fetch student data and check subscription when authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      if (!student) {
        fetchStudents();
      }
      // Check subscription status
      checkSubscription();
    } else if (isInitialized && !isAuthenticated) {
      // Clear subscription when logged out
      clearSubscription();
    }
  }, [isInitialized, isAuthenticated, student]);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

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

        {/* Company Pages */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/press" element={<PressKit />} />
        <Route path="/partners" element={<Partners />} />

        {/* Support Pages */}
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faq" element={<FAQs />} />
        <Route path="/community" element={<Community />} />
        <Route path="/feedback" element={<Feedback />} />

        {/* Legal Pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiesPolicy />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

        {/* Product Pages */}
        <Route path="/download" element={<DownloadApp />} />
        <Route path="/demo" element={<RequestDemo />} />
        <Route path="/sitemap" element={<Sitemap />} />

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

        {/* Protected Routes - No Subscription Required */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Subscription Required */}
        <Route
          path="/learn"
          element={
            <SubscriptionProtectedRoute>
              <Learn />
            </SubscriptionProtectedRoute>
          }
        />
        <Route
          path="/learn/subject/:subjectId"
          element={
            <SubscriptionProtectedRoute>
              <SubjectDetail />
            </SubscriptionProtectedRoute>
          }
        />
        <Route
          path="/learn/chapter/:chapterId"
          element={
            <SubscriptionProtectedRoute>
              <ChapterDetail />
            </SubscriptionProtectedRoute>
          }
        />
        <Route
          path="/learn/topic/:topicId"
          element={
            <SubscriptionProtectedRoute>
              <Lesson />
            </SubscriptionProtectedRoute>
          }
        />
        <Route
          path="/quizzes"
          element={
            <SubscriptionProtectedRoute>
              <Quizzes />
            </SubscriptionProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:quizId"
          element={
            <SubscriptionProtectedRoute>
              <QuizTaking />
            </SubscriptionProtectedRoute>
          }
        />
        <Route
          path="/doubts"
          element={
            <SubscriptionProtectedRoute>
              <Doubts />
            </SubscriptionProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <SubscriptionProtectedRoute>
              <Progress />
            </SubscriptionProtectedRoute>
          }
        />
        <Route
          path="/study-plan"
          element={
            <SubscriptionProtectedRoute>
              <StudyPlan />
            </SubscriptionProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          
          {/* Students */}
          <Route path="students" element={<StudentsManagement />} />
          <Route path="students/:id" element={<StudentView />} />
          <Route path="students/:id/edit" element={<StudentEdit />} />
          
          {/* Schools */}
          <Route path="schools" element={<SchoolsManagement />} />
          <Route path="schools/add" element={<SchoolAdd />} />
          <Route path="schools/:id" element={<SchoolView />} />
          <Route path="schools/:id/edit" element={<SchoolEdit />} />
          
          {/* Boards */}
          <Route path="boards" element={<BoardsManagement />} />
          <Route path="boards/add" element={<BoardAdd />} />
          <Route path="boards/:id" element={<BoardView />} />
          <Route path="boards/:id/edit" element={<BoardEdit />} />
          
          {/* Classes */}
          <Route path="classes" element={<ClassesManagement />} />
          <Route path="classes/add" element={<ClassAdd />} />
          <Route path="classes/:id" element={<ClassView />} />
          <Route path="classes/:id/edit" element={<ClassEdit />} />
          
          {/* Subjects */}
          <Route path="subjects" element={<SubjectsManagement />} />
          <Route path="subjects/add" element={<SubjectAdd />} />
          <Route path="subjects/:id" element={<SubjectView />} />
          <Route path="subjects/:id/edit" element={<SubjectEdit />} />
          <Route path="subject-mapping" element={<SubjectMapping />} />
          
          {/* Plans */}
          <Route path="plans" element={<PlansManagement />} />
          <Route path="plans/add" element={<PlanAdd />} />
          <Route path="plans/:id" element={<PlanView />} />
          <Route path="plans/:id/edit" element={<PlanEdit />} />
          
          {/* Transactions */}
          <Route path="transactions" element={<TransactionsManagement />} />
          <Route path="transactions/:id" element={<TransactionView />} />
          
          {/* Admin Users */}
          <Route path="admin-users" element={<AdminUsersManagement />} />
          <Route path="admin-users/add" element={<AdminUserAdd />} />
          <Route path="admin-users/:id" element={<AdminUserView />} />
          <Route path="admin-users/:id/edit" element={<AdminUserEdit />} />
          
          {/* Other */}
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="admins" element={<AdminUsersManagement />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="settings/payment" element={<AdminSettings />} />
          <Route path="settings/api-keys" element={<AdminSettings />} />
          <Route path="settings/app-config" element={<AdminSettings />} />
          <Route path="settings/notifications" element={<AdminSettings />} />
          <Route path="settings/security" element={<AdminSettings />} />
          <Route path="settings/email" element={<AdminSettings />} />
          <Route path="settings/database" element={<AdminSettings />} />
        </Route>

        {/* 404 - Redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Session Terminated Modal */}
      <SessionTerminatedModal
        isOpen={sessionTerminated}
        onClose={handleSessionModalClose}
      />
    </BrowserRouter>
  );
}

export default App;
