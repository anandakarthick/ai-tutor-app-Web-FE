/**
 * Doubts API Service
 */

import apiClient from './client';
import { ENDPOINTS } from './config';

export const doubtsApi = {
  create: async (data: {
    studentId: string;
    topicId?: string;
    question: string;
    doubtType?: string;
  }) => {
    const response = await apiClient.post(ENDPOINTS.DOUBTS.CREATE, data);
    return response.data;
  },

  getAll: async (params: {
    studentId?: string;
    topicId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get(ENDPOINTS.DOUBTS.LIST, { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(ENDPOINTS.DOUBTS.GET(id));
    return response.data;
  },

  resolve: async (id: string, rating?: number, feedback?: string) => {
    const response = await apiClient.put(ENDPOINTS.DOUBTS.RESOLVE(id), {
      rating,
      feedback,
    });
    return response.data;
  },
};

export default doubtsApi;
