/**
 * Content API Service
 */

import apiClient from './client';
import { ENDPOINTS } from './config';

export const contentApi = {
  boards: {
    getAll: async () => {
      const response = await apiClient.get(ENDPOINTS.BOARDS.LIST);
      return response.data;
    },
    getClasses: async (boardId: string) => {
      const response = await apiClient.get(ENDPOINTS.BOARDS.CLASSES(boardId));
      return response.data;
    },
  },

  subjects: {
    getByClass: async (classId: string, medium: string = 'english') => {
      const response = await apiClient.get(ENDPOINTS.SUBJECTS.LIST, {
        params: { classId, medium },
      });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(ENDPOINTS.SUBJECTS.GET(id));
      return response.data;
    },
  },

  books: {
    getBySubject: async (subjectId: string) => {
      const response = await apiClient.get(ENDPOINTS.BOOKS.LIST, {
        params: { subjectId },
      });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(ENDPOINTS.BOOKS.GET(id));
      return response.data;
    },
  },

  chapters: {
    getByBook: async (bookId: string, studentId?: string) => {
      const params: Record<string, string> = { bookId };
      if (studentId) params.studentId = studentId;
      const response = await apiClient.get(ENDPOINTS.CHAPTERS.LIST, { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(ENDPOINTS.CHAPTERS.GET(id));
      return response.data;
    },
  },

  topics: {
    getByChapter: async (chapterId: string, studentId?: string) => {
      const params: Record<string, string> = { chapterId };
      if (studentId) params.studentId = studentId;
      const response = await apiClient.get(ENDPOINTS.TOPICS.LIST, { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(ENDPOINTS.TOPICS.GET(id));
      return response.data;
    },
    getContent: async (topicId: string) => {
      const response = await apiClient.get(ENDPOINTS.TOPICS.CONTENT(topicId));
      return response.data;
    },
  },
};

export default contentApi;
