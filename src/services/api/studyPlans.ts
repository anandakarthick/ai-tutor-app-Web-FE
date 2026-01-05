/**
 * Study Plans API Service
 */

import apiClient from './client';
import { ENDPOINTS } from './config';

export const studyPlansApi = {
  getAll: async (studentId: string) => {
    const response = await apiClient.get(ENDPOINTS.STUDY_PLANS.LIST, {
      params: { studentId },
    });
    return response.data;
  },

  generate: async (data: {
    studentId: string;
    subjectIds: string[];
    dailyHours: number;
    targetExam?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await apiClient.post(ENDPOINTS.STUDY_PLANS.GENERATE, data);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(ENDPOINTS.STUDY_PLANS.GET(id));
    return response.data;
  },

  getToday: async (id: string) => {
    const response = await apiClient.get(ENDPOINTS.STUDY_PLANS.TODAY(id));
    return response.data;
  },

  completeItem: async (itemId: string) => {
    const response = await apiClient.put(ENDPOINTS.STUDY_PLANS.COMPLETE_ITEM(itemId));
    return response.data;
  },
};

export default studyPlansApi;
