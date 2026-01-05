/**
 * API Types
 */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface User {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  role: string;
  profileImageUrl?: string;
}

export interface Student {
  id: string;
  userId: string;
  studentName: string;
  xp: number;
  level: number;
  streakDays: number;
  medium: string;
  dailyStudyGoalMinutes: number;
  board?: Board;
  class?: Class;
  boardId?: string;
  classId?: string;
}

export interface Board {
  id: string;
  name: string;
  fullName: string;
  description?: string;
}

export interface Class {
  id: string;
  boardId: string;
  className: string;
  displayName: string;
}

export interface Subject {
  id: string;
  classId: string;
  subjectName: string;
  displayName: string;
  iconUrl?: string;
  colorCode?: string;
  medium: string;
  totalChapters?: number;
}

export interface Book {
  id: string;
  subjectId: string;
  bookTitle: string;
  totalChapters: number;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  bookId: string;
  chapterNumber: number;
  chapterTitle: string;
  description?: string;
  totalTopics: number;
  estimatedHours: number;
  topics?: Topic[];
  completedTopics?: number;
  progress?: number;
}

export interface Topic {
  id: string;
  chapterId: string;
  topicTitle: string;
  description?: string;
  estimatedMinutes: number;
  difficultyLevel: string;
  isCompleted?: boolean;
  progress?: number;
  chapter?: Chapter;
}

export interface ContentBlock {
  id: string;
  topicId: string;
  blockType: string;
  title?: string;
  content: string;
  mediaUrl?: string;
  sequenceOrder: number;
}

export interface LearningSession {
  id: string;
  studentId: string;
  topicId: string;
  sessionType: string;
  status: string;
  topic?: Topic;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderType: 'student' | 'ai' | 'system';
  messageType: string;
  content: string;
  createdAt: string;
}

export interface Doubt {
  id: string;
  studentId: string;
  topicId?: string;
  question: string;
  aiAnswer?: string;
  status: string;
  createdAt: string;
  topic?: Topic;
}

export interface Quiz {
  id: string;
  topicId?: string;
  chapterId?: string;
  quizTitle: string;
  description?: string;
  quizType: string;
  difficultyLevel: string;
  totalQuestions: number;
  totalMarks: number;
  timeLimitMinutes?: number;
  passingPercentage: number;
  questions?: Question[];
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  questionType: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  marks: number;
  difficultyLevel: string;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  status: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  timeTakenSeconds: number;
  isPassed: boolean;
  xpEarned: number;
  quiz?: Quiz;
}

export interface StudyPlan {
  id: string;
  studentId: string;
  planTitle: string;
  status: string;
  items?: StudyPlanItem[];
}

export interface StudyPlanItem {
  id: string;
  studyPlanId: string;
  topicId: string;
  scheduledDate: string;
  estimatedMinutes: number;
  status: string;
  topic?: Topic;
}

export interface DailyProgress {
  id: string;
  studentId: string;
  date: string;
  totalStudyTimeMinutes: number;
  topicsCompleted: number;
  quizzesAttempted: number;
  doubtsAsked: number;
  xpEarned: number;
}

export interface DashboardStats {
  student: {
    name: string;
    xp: number;
    level: number;
    streakDays: number;
  };
  today: {
    studyTimeMinutes: number;
    topicsCompleted: number;
    xpEarned: number;
  };
  overall: {
    totalTopics: number;
    completedTopics: number;
    totalQuizzes: number;
    avgQuizScore: number;
    bestQuizScore: number;
  };
}
