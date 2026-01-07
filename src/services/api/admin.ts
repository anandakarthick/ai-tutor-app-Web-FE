/**
 * Admin API Service
 * API calls for the admin panel
 */

import axios from 'axios';
import { API_CONFIG } from './config';

// Admin Storage Keys
export const ADMIN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'adminAccessToken',
  REFRESH_TOKEN: 'adminRefreshToken',
  ADMIN: 'admin',
};

// Create separate axios instance for admin (no encryption)
const adminClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add admin auth token
adminClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
adminClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      clearAdminAuth();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Admin Auth Helpers
export const setAdminAuth = (accessToken: string, refreshToken: string, admin: any) => {
  localStorage.setItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  localStorage.setItem(ADMIN_STORAGE_KEYS.ADMIN, JSON.stringify(admin));
};

export const clearAdminAuth = () => {
  localStorage.removeItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(ADMIN_STORAGE_KEYS.ADMIN);
};

export const isAdminAuthenticated = () => {
  return !!localStorage.getItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN);
};

export const getStoredAdmin = () => {
  const adminStr = localStorage.getItem(ADMIN_STORAGE_KEYS.ADMIN);
  return adminStr ? JSON.parse(adminStr) : null;
};

// ==================== AUTH ====================

export const adminLogin = async (email: string, password: string) => {
  const response = await adminClient.post('/admin/auth/login', { email, password });
  return response.data;
};

export const adminLogout = async () => {
  try {
    await adminClient.post('/admin/auth/logout');
  } finally {
    clearAdminAuth();
  }
};

export const getAdminProfile = async () => {
  const response = await adminClient.get('/admin/auth/me');
  return response.data;
};

// ==================== DASHBOARD ====================

export const getDashboardStats = async () => {
  const response = await adminClient.get('/admin/dashboard/stats');
  return response.data;
};

export const getRecentActivity = async (limit = 10) => {
  const response = await adminClient.get(`/admin/dashboard/recent-activity?limit=${limit}`);
  return response.data;
};

// ==================== STUDENTS ====================

export interface StudentFilters {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
  boardId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const getStudents = async (filters: StudentFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  });
  const response = await adminClient.get(`/admin/students?${params.toString()}`);
  return response.data;
};

export const getStudentById = async (id: string) => {
  const response = await adminClient.get(`/admin/students/${id}`);
  return response.data;
};

export const updateStudent = async (id: string, data: any) => {
  const response = await adminClient.put(`/admin/students/${id}`, data);
  return response.data;
};

export const deleteStudent = async (id: string) => {
  const response = await adminClient.delete(`/admin/students/${id}`);
  return response.data;
};

// ==================== SCHOOLS ====================

export interface SchoolFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const getSchools = async (filters: SchoolFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  });
  const response = await adminClient.get(`/admin/schools?${params.toString()}`);
  return response.data;
};

export const getSchoolById = async (id: string) => {
  const response = await adminClient.get(`/admin/schools/${id}`);
  return response.data;
};

export const createSchool = async (data: any) => {
  const response = await adminClient.post('/admin/schools', data);
  return response.data;
};

export const updateSchool = async (id: string, data: any) => {
  const response = await adminClient.put(`/admin/schools/${id}`, data);
  return response.data;
};

export const deleteSchool = async (id: string) => {
  const response = await adminClient.delete(`/admin/schools/${id}`);
  return response.data;
};

// ==================== CLASSES ====================

export interface ClassFilters {
  boardId?: string;
  status?: string;
}

export const getClasses = async (filters: ClassFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  });
  const response = await adminClient.get(`/admin/classes?${params.toString()}`);
  return response.data;
};

export const createClass = async (data: any) => {
  const response = await adminClient.post('/admin/classes', data);
  return response.data;
};

export const updateClass = async (id: string, data: any) => {
  const response = await adminClient.put(`/admin/classes/${id}`, data);
  return response.data;
};

export const deleteClass = async (id: string) => {
  const response = await adminClient.delete(`/admin/classes/${id}`);
  return response.data;
};

// ==================== SUBJECTS ====================

export interface SubjectFilters {
  classId?: string;
  status?: string;
}

export const getSubjects = async (filters: SubjectFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  });
  const response = await adminClient.get(`/admin/subjects?${params.toString()}`);
  return response.data;
};

export const getSubjectById = async (id: string) => {
  const response = await adminClient.get(`/admin/subjects/${id}`);
  return response.data;
};

export const createSubject = async (data: any) => {
  const response = await adminClient.post('/admin/subjects', data);
  return response.data;
};

export const updateSubject = async (id: string, data: any) => {
  const response = await adminClient.put(`/admin/subjects/${id}`, data);
  return response.data;
};

export const deleteSubject = async (id: string) => {
  const response = await adminClient.delete(`/admin/subjects/${id}`);
  return response.data;
};

// ==================== BOOKS (SUBJECT MAPPING) ====================

export interface BookFilters {
  classId?: string;
  subjectId?: string;
  status?: string;
}

export const getBooks = async (filters: BookFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  });
  const response = await adminClient.get(`/admin/books?${params.toString()}`);
  return response.data;
};

export const getBookById = async (id: string) => {
  const response = await adminClient.get(`/admin/books/${id}`);
  return response.data;
};

export const createBook = async (data: any) => {
  const response = await adminClient.post('/admin/books', data);
  return response.data;
};

export const updateBook = async (id: string, data: any) => {
  const response = await adminClient.put(`/admin/books/${id}`, data);
  return response.data;
};

export const deleteBook = async (id: string) => {
  const response = await adminClient.delete(`/admin/books/${id}`);
  return response.data;
};

// ==================== SUBSCRIPTION PLANS ====================

export const getPlans = async () => {
  const response = await adminClient.get('/admin/plans');
  return response.data;
};

export const createPlan = async (data: any) => {
  const response = await adminClient.post('/admin/plans', data);
  return response.data;
};

export const updatePlan = async (id: string, data: any) => {
  const response = await adminClient.put(`/admin/plans/${id}`, data);
  return response.data;
};

export const deletePlan = async (id: string) => {
  const response = await adminClient.delete(`/admin/plans/${id}`);
  return response.data;
};

// ==================== TRANSACTIONS ====================

export interface TransactionFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export const getTransactions = async (filters: TransactionFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  });
  const response = await adminClient.get(`/admin/transactions?${params.toString()}`);
  return response.data;
};

export const getTransactionById = async (id: string) => {
  const response = await adminClient.get(`/admin/transactions/${id}`);
  return response.data;
};

// ==================== ADMIN USERS ====================

export const getAdminUsers = async () => {
  const response = await adminClient.get('/admin/admins');
  return response.data;
};

export const createAdminUser = async (data: any) => {
  const response = await adminClient.post('/admin/admins', data);
  return response.data;
};

export const updateAdminUser = async (id: string, data: any) => {
  const response = await adminClient.put(`/admin/admins/${id}`, data);
  return response.data;
};

export const deleteAdminUser = async (id: string) => {
  const response = await adminClient.delete(`/admin/admins/${id}`);
  return response.data;
};

// ==================== ANALYTICS ====================

export const getAnalyticsOverview = async (period = '30') => {
  const response = await adminClient.get(`/admin/analytics/overview?period=${period}`);
  return response.data;
};

export const getTopSubjects = async () => {
  const response = await adminClient.get('/admin/analytics/top-subjects');
  return response.data;
};

export const getTopClasses = async () => {
  const response = await adminClient.get('/admin/analytics/top-classes');
  return response.data;
};

export const getRecentUserActivity = async (page = 1, limit = 10) => {
  const response = await adminClient.get(`/admin/analytics/recent-activity?page=${page}&limit=${limit}`);
  return response.data;
};

// ==================== BOARDS ====================

export const getBoards = async () => {
  const response = await adminClient.get('/admin/boards');
  return response.data;
};

export const createBoard = async (data: any) => {
  const response = await adminClient.post('/admin/boards', data);
  return response.data;
};

export const updateBoard = async (id: string, data: any) => {
  const response = await adminClient.put(`/admin/boards/${id}`, data);
  return response.data;
};

export const deleteBoard = async (id: string) => {
  const response = await adminClient.delete(`/admin/boards/${id}`);
  return response.data;
};

// ==================== REPORTS ====================

export const getReportsSummary = async () => {
  const response = await adminClient.get('/admin/reports/summary');
  return response.data;
};

// ==================== SETTINGS ====================

export const getSettings = async (category?: string) => {
  const url = category ? `/admin/settings/${category}` : '/admin/settings';
  const response = await adminClient.get(url);
  return response.data;
};

export const getSettingsByCategory = async (category: string) => {
  const response = await adminClient.get(`/admin/settings/${category}`);
  return response.data;
};

export const updateSettings = async (data: Record<string, any>) => {
  const response = await adminClient.put('/admin/settings', data);
  return response.data;
};

export const updateSettingsByCategory = async (category: string, data: Record<string, any>) => {
  const response = await adminClient.put(`/admin/settings/${category}`, data);
  return response.data;
};

export default {
  // Auth
  adminLogin,
  adminLogout,
  getAdminProfile,
  setAdminAuth,
  clearAdminAuth,
  isAdminAuthenticated,
  getStoredAdmin,
  
  // Dashboard
  getDashboardStats,
  getRecentActivity,
  
  // Students
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  
  // Schools
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  
  // Classes
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  
  // Subjects
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  
  // Books (Subject Mapping)
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  
  // Plans
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  
  // Transactions
  getTransactions,
  getTransactionById,
  
  // Admin Users
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  
  // Analytics
  getAnalyticsOverview,
  getTopSubjects,
  getTopClasses,
  getRecentUserActivity,
  
  // Boards
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  
  // Reports
  getReportsSummary,
  
  // Settings
  getSettings,
  getSettingsByCategory,
  updateSettings,
  updateSettingsByCategory,
};
