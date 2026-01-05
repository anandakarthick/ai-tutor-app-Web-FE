/**
 * Dashboard API Service
 */

import apiClient from './client';
import { ENDPOINTS } from './config';

export const dashboardApi = {
  getStats: async (studentId: string) => {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.STATS, {
      params: { studentId },
    });
    return response.data;
  },

  getToday: async (studentId: string) => {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.TODAY, {
      params: { studentId },
    });
    return response.data;
  },

  getLeaderboard: async (studentId?: string, limit: number = 10) => {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.LEADERBOARD, {
      params: { studentId, limit },
    });
    return response.data;
  },

  getAchievements: async (studentId: string) => {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.ACHIEVEMENTS, {
      params: { studentId },
    });
    return response.data;
  },
};

export default dashboardApi;
