/**
 * Auth Store - Fixed version
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi, studentsApi, clearAuthTokens, setAuthTokens, setStoredUser, setStoredStudent } from '../services/api';

interface User {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  role: string;
  profileImageUrl?: string;
}

interface Student {
  id: string;
  userId: string;
  studentName: string;
  xp: number;
  level: number;
  streakDays: number;
  medium: string;
  dailyStudyGoalMinutes: number;
  board?: { id: string; name: string; fullName: string };
  class?: { id: string; className: string; displayName: string };
  boardId?: string;
  classId?: string;
}

interface AuthState {
  user: User | null;
  student: Student | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setStudent: (student: Student | null) => void;
  login: (phone: string, otp: string) => Promise<void>;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => void;
  fetchStudents: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      student: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
        if (user) {
          setStoredUser(user);
        }
      },
      
      setStudent: (student) => {
        set({ student });
        if (student) {
          setStoredStudent(student);
        }
      },

      login: async (phone, otp) => {
        set({ isLoading: true });
        try {
          const response = await authApi.loginWithOtp(phone, otp);
          if (response.success && response.data) {
            const { user, student, accessToken, refreshToken } = response.data;
            
            // Store tokens
            if (accessToken && refreshToken) {
              setAuthTokens(accessToken, refreshToken);
            }
            
            // Store user/student in localStorage too
            if (user) setStoredUser(user);
            if (student) setStoredStudent(student);
            
            set({
              user,
              student: student || null,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithPassword: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.loginWithPassword(email, password);
          if (response.success && response.data) {
            const { user, student, accessToken, refreshToken } = response.data;
            
            // Store tokens
            if (accessToken && refreshToken) {
              setAuthTokens(accessToken, refreshToken);
            }
            
            // Store user/student in localStorage too
            if (user) setStoredUser(user);
            if (student) setStoredStudent(student);
            
            set({
              user,
              student: student || null,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register(data);
          if (response.success && response.data) {
            const { user, student, accessToken, refreshToken } = response.data;
            
            // Store tokens
            if (accessToken && refreshToken) {
              setAuthTokens(accessToken, refreshToken);
            }
            
            // Store user/student in localStorage too
            if (user) setStoredUser(user);
            if (student) setStoredStudent(student);
            
            set({
              user,
              student: student || null,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error('Register error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout API error:', error);
        }
        clearAuthTokens();
        set({ user: null, student: null, isAuthenticated: false });
      },

      loadStoredAuth: () => {
        // Check if we have a valid access token
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          // No token, ensure we're logged out
          set({ user: null, student: null, isAuthenticated: false });
          return;
        }
        
        // Token exists, check if we have stored user data
        const storedUser = localStorage.getItem('user');
        const storedStudent = localStorage.getItem('student');
        
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            const student = storedStudent ? JSON.parse(storedStudent) : null;
            set({ user, student, isAuthenticated: true });
          } catch (e) {
            // Invalid stored data
            console.error('Failed to parse stored auth:', e);
            clearAuthTokens();
            set({ user: null, student: null, isAuthenticated: false });
          }
        } else {
          // Token exists but no user data - this shouldn't happen normally
          // Keep authenticated true, we'll fetch user data later
          const { user } = get();
          if (user) {
            set({ isAuthenticated: true });
          } else {
            // No user in store either, clear everything
            clearAuthTokens();
            set({ user: null, student: null, isAuthenticated: false });
          }
        }
      },

      fetchStudents: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const response = await studentsApi.getAll(user.id);
          if (response.success && response.data?.length > 0) {
            const student = response.data[0];
            set({ student });
            setStoredStudent(student);
          }
        } catch (error) {
          console.error('Failed to fetch students:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        student: state.student,
        isAuthenticated: state.isAuthenticated,
      }),
      // On rehydration, also check token validity
      onRehydrateStorage: () => (state) => {
        if (state) {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken && state.isAuthenticated) {
            // Token missing but state says authenticated - fix it
            state.isAuthenticated = false;
            state.user = null;
            state.student = null;
          }
        }
      },
    }
  )
);
