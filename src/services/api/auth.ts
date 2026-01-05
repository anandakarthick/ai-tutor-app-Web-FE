/**
 * Authentication API Service
 */

import apiClient, { setAuthTokens, clearAuthTokens, setStoredUser, setStoredStudent } from './client';
import { ENDPOINTS } from './config';

export const authApi = {
  sendOtp: async (phone: string, purpose: 'login' | 'registration' = 'login') => {
    const response = await apiClient.post(ENDPOINTS.AUTH.SEND_OTP, { phone, purpose });
    return response.data;
  },

  verifyOtp: async (phone: string, otp: string) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.VERIFY_OTP, { phone, otp });
    return response.data;
  },

  register: async (data: {
    fullName: string;
    phone: string;
    email?: string;
    studentName?: string;
    boardId?: string;
    classId?: string;
    medium?: string;
  }) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, {
      ...data,
      deviceInfo: navigator.userAgent,
    });

    if (response.data.success && response.data.data) {
      const { tokens, user, student } = response.data.data;
      setAuthTokens(tokens.accessToken, tokens.refreshToken);
      setStoredUser(user);
      if (student) {
        setStoredStudent(student);
      }
    }

    return response.data;
  },

  loginWithOtp: async (phone: string, otp: string) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
      phone,
      otp,
      deviceInfo: navigator.userAgent,
    });

    if (response.data.success && response.data.data) {
      const { tokens, user, student } = response.data.data;
      setAuthTokens(tokens.accessToken, tokens.refreshToken);
      setStoredUser(user);
      if (student) {
        setStoredStudent(student);
      }
    }

    return response.data;
  },

  loginWithPassword: async (email: string, password: string) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN_PASSWORD, {
      email,
      password,
      deviceInfo: navigator.userAgent,
    });

    if (response.data.success && response.data.data) {
      const { tokens, user, student } = response.data.data;
      setAuthTokens(tokens.accessToken, tokens.refreshToken);
      setStoredUser(user);
      if (student) {
        setStoredStudent(student);
      }
    }

    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get(ENDPOINTS.AUTH.ME);
    if (response.data.success && response.data.data) {
      setStoredUser(response.data.data.user);
    }
    return response.data;
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken });
    } catch (error) {
      console.log('Logout API error:', error);
    } finally {
      clearAuthTokens();
    }
  },
};

export default authApi;
