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
  initializeEncryption,
  isEncryptionReady,
  getEncryptionStatus,
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
export { subscriptionApi } from './subscription';
export { paymentsApi } from './payments';
