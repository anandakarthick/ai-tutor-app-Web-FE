/**
 * Progress API Service
 */

import apiClient from './client';
import { ENDPOINTS } from './config';

export const progressApi = {
  getOverall: async (studentId: string, skipCache: boolean = false) => {
    const response = await apiClient.get(ENDPOINTS.PROGRESS.OVERALL(studentId), {
      params: skipCache ? { skipCache: 'true' } : undefined,
    });
    return response.data;
  },

  getDaily: async (studentId: string, days: number = 7) => {
    const response = await apiClient.get(ENDPOINTS.PROGRESS.DAILY(studentId), {
      params: { days },
    });
    return response.data;
  },

  getStreak: async (studentId: string) => {
    const response = await apiClient.get(ENDPOINTS.PROGRESS.STREAK(studentId));
    return response.data;
  },
};

export default progressApi;
