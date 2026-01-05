/**
 * Learning API Service
 */

import apiClient from './client';
import { ENDPOINTS, API_CONFIG } from './config';

export const learningApi = {
  startSession: async (studentId: string, topicId: string, sessionType: string = 'learning') => {
    const response = await apiClient.post(ENDPOINTS.LEARNING.SESSION, {
      studentId,
      topicId,
      sessionType,
    });
    return response.data;
  },

  endSession: async (sessionId: string, xpEarned: number = 0) => {
    const response = await apiClient.put(ENDPOINTS.LEARNING.END_SESSION(sessionId), {
      xpEarned,
    });
    return response.data;
  },

  sendMessage: async (sessionId: string, content: string, messageType: string = 'text') => {
    const response = await apiClient.post(ENDPOINTS.LEARNING.MESSAGE(sessionId), {
      content,
      messageType,
    });
    return response.data;
  },

  getMessages: async (sessionId: string) => {
    const response = await apiClient.get(ENDPOINTS.LEARNING.MESSAGES(sessionId));
    return response.data;
  },

  updateProgress: async (
    studentId: string,
    topicId: string,
    progressPercentage: number,
    masteryLevel?: string
  ) => {
    const response = await apiClient.put(ENDPOINTS.LEARNING.PROGRESS, {
      studentId,
      topicId,
      progressPercentage,
      masteryLevel,
    });
    return response.data;
  },

  // Stream AI teaching content
  streamTeaching: async function* (
    studentName: string,
    grade: string,
    subject: string,
    topic: string,
    content: string,
    onChunk?: (text: string) => void
  ): AsyncGenerator<string, void, unknown> {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.LEARNING.TEACH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ studentName, grade, subject, topic, content }),
    });

    if (!response.ok) throw new Error('Teaching stream request failed');

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.done) return;
            if (data.text) {
              if (onChunk) onChunk(data.text);
              yield data.text;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  },
};

export default learningApi;
