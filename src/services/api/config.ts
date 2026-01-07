/**
 * API Configuration for Web
 */

// Use the same API as mobile app
// Change this to your backend URL
const DEV_API_URL = 'http://192.168.1.3:3000/api/v1';
const PROD_API_URL = 'https://api.aitutor.com/api/v1';

export const API_CONFIG = {
  BASE_URL: import.meta.env.DEV ? DEV_API_URL : PROD_API_URL,
  TIMEOUT: 30000,
  
  // E2E Encryption settings - same as mobile app
  ENCRYPTION_ENABLED: true,
};

export const ENDPOINTS = {
  AUTH: {
    HANDSHAKE: '/auth/handshake',
    PUBLIC_KEY: '/auth/public-key',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGIN_PASSWORD: '/auth/login/password',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  STUDENTS: {
    LIST: '/students',
    CREATE: '/students',
    GET: (id: string) => `/students/${id}`,
    UPDATE: (id: string) => `/students/${id}`,
  },
  BOARDS: {
    LIST: '/boards',
    CLASSES: (id: string) => `/boards/${id}/classes`,
  },
  SUBJECTS: {
    LIST: '/subjects',
    GET: (id: string) => `/subjects/${id}`,
  },
  BOOKS: {
    LIST: '/books',
    GET: (id: string) => `/books/${id}`,
  },
  CHAPTERS: {
    LIST: '/chapters',
    GET: (id: string) => `/chapters/${id}`,
  },
  TOPICS: {
    LIST: '/topics',
    GET: (id: string) => `/topics/${id}`,
    CONTENT: (id: string) => `/topics/${id}/content`,
  },
  LEARNING: {
    SESSION: '/learning/session',
    END_SESSION: (id: string) => `/learning/session/${id}/end`,
    MESSAGE: (id: string) => `/learning/session/${id}/message`,
    MESSAGES: (id: string) => `/learning/session/${id}/messages`,
    PROGRESS: '/learning/progress',
    TEACH: '/learning/teach',
  },
  DOUBTS: {
    LIST: '/doubts',
    CREATE: '/doubts',
    GET: (id: string) => `/doubts/${id}`,
    RESOLVE: (id: string) => `/doubts/${id}/resolve`,
  },
  QUIZZES: {
    LIST: '/quizzes',
    GET: (id: string) => `/quizzes/${id}`,
    START_ATTEMPT: (id: string) => `/quizzes/${id}/attempt`,
    SUBMIT_ANSWER: (attemptId: string) => `/quizzes/attempts/${attemptId}/answer`,
    SUBMIT: (attemptId: string) => `/quizzes/attempts/${attemptId}/submit`,
  },
  STUDY_PLANS: {
    LIST: '/study-plans',
    GENERATE: '/study-plans/generate',
    GET: (id: string) => `/study-plans/${id}`,
    TODAY: (id: string) => `/study-plans/${id}/today`,
    COMPLETE_ITEM: (itemId: string) => `/study-plans/items/${itemId}/complete`,
  },
  PROGRESS: {
    OVERALL: (studentId: string) => `/progress/${studentId}`,
    DAILY: (studentId: string) => `/progress/${studentId}/daily`,
    STREAK: (studentId: string) => `/progress/${studentId}/streak`,
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    TODAY: '/dashboard/today',
    LEADERBOARD: '/dashboard/leaderboard',
    ACHIEVEMENTS: '/dashboard/achievements',
  },
};
