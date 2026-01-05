/**
 * API Services Index
 */

export { API_CONFIG, ENDPOINTS } from './config';
export {
  default as apiClient,
  setAuthTokens,
  clearAuthTokens,
  isAuthenticated,
  getStoredUser,
  getStoredStudent,
  setStoredUser,
  setStoredStudent,
} from './client';

export { authApi } from './auth';
export { contentApi } from './content';
export { studentsApi } from './students';
export { learningApi } from './learning';
export { quizzesApi } from './quizzes';
export { doubtsApi } from './doubts';
export { studyPlansApi } from './studyPlans';
export { progressApi } from './progress';
export { dashboardApi } from './dashboard';
