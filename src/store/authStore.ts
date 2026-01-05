/**
 * Auth Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, studentsApi, getStoredUser, getStoredStudent, clearAuthTokens } from '../services/api';

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

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setStudent: (student) => set({ student }),

      login: async (phone, otp) => {
        set({ isLoading: true });
        try {
          const response = await authApi.loginWithOtp(phone, otp);
          if (response.success) {
            set({
              user: response.data.user,
              student: response.data.student || null,
              isAuthenticated: true,
            });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithPassword: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.loginWithPassword(email, password);
          if (response.success) {
            set({
              user: response.data.user,
              student: response.data.student || null,
              isAuthenticated: true,
            });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register(data);
          if (response.success) {
            set({
              user: response.data.user,
              student: response.data.student || null,
              isAuthenticated: true,
            });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await authApi.logout();
        clearAuthTokens();
        set({ user: null, student: null, isAuthenticated: false });
      },

      loadStoredAuth: () => {
        const user = getStoredUser();
        const student = getStoredStudent();
        if (user) {
          set({ user, student, isAuthenticated: true });
        }
      },

      fetchStudents: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const response = await studentsApi.getAll(user.id);
          if (response.success && response.data?.length > 0) {
            set({ student: response.data[0] });
          }
        } catch (error) {
          console.error('Failed to fetch students:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        student: state.student,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
