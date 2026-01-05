/**
 * Students API Service
 */

import apiClient, { setStoredStudent } from './client';
import { ENDPOINTS } from './config';

export const studentsApi = {
  getAll: async (userId?: string) => {
    const response = await apiClient.get(ENDPOINTS.STUDENTS.LIST, {
      params: userId ? { userId } : undefined,
    });
    return response.data;
  },

  create: async (data: {
    studentName: string;
    dateOfBirth?: string;
    gender?: string;
    schoolName?: string;
    boardId: string;
    classId: string;
    section?: string;
    medium?: string;
  }) => {
    const response = await apiClient.post(ENDPOINTS.STUDENTS.CREATE, data);
    if (response.data.success && response.data.data) {
      setStoredStudent(response.data.data);
    }
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(ENDPOINTS.STUDENTS.GET(id));
    return response.data;
  },

  update: async (id: string, data: Partial<{
    studentName: string;
    dateOfBirth: string;
    gender: string;
    schoolName: string;
    boardId: string;
    classId: string;
    section: string;
    medium: string;
  }>) => {
    const response = await apiClient.put(ENDPOINTS.STUDENTS.UPDATE(id), data);
    if (response.data.success && response.data.data) {
      setStoredStudent(response.data.data);
    }
    return response.data;
  },
};

export default studentsApi;
