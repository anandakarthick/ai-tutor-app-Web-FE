/**
 * Quizzes API Service
 */

import apiClient from './client';
import { ENDPOINTS } from './config';

export const quizzesApi = {
  getAll: async (params?: { topicId?: string; chapterId?: string; quizType?: string }) => {
    const response = await apiClient.get(ENDPOINTS.QUIZZES.LIST, { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(ENDPOINTS.QUIZZES.GET(id));
    return response.data;
  },

  startAttempt: async (quizId: string, studentId: string) => {
    const response = await apiClient.post(ENDPOINTS.QUIZZES.START_ATTEMPT(quizId), {
      studentId,
    });
    return response.data;
  },

  submitAnswer: async (
    attemptId: string,
    questionId: string,
    studentAnswer: string,
    timeTaken: number = 0
  ) => {
    const response = await apiClient.post(ENDPOINTS.QUIZZES.SUBMIT_ANSWER(attemptId), {
      questionId,
      studentAnswer,
      timeTaken,
    });
    return response.data;
  },

  submit: async (attemptId: string) => {
    const response = await apiClient.put(ENDPOINTS.QUIZZES.SUBMIT(attemptId));
    return response.data;
  },
};

export default quizzesApi;
