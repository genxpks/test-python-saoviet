export type UserRole = 'admin' | 'branch_manager' | 'student' | 'teacher';

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  managerName?: string;
  defaultTeacherPin: string;
  createdDate: string;
}

export type ProgrammingRuntime = 'python3' | 'c' | 'cpp' | 'csharp' | 'java' | 'typescript' | 'html_css';

export interface Subject {
  id: string;
  name: string;
  code: string;
  icon: string;
  runtime: ProgrammingRuntime;
  description: string;
  totalModules: number;
  isActive: boolean;
  createdDate: string;
}

export type QuestionType = 
  | 'single_choice' 
  | 'true_false' 
  | 'multiple_choice' 
  | 'fill_blank' 
  | 'sequence_order' 
  | 'matching';

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Question {
  id: number;
  subjectId?: string;
  branchId?: string;
  moduleId?: number;
  type: QuestionType;
  type_name: string;
  question: string;
  options?: string[];
  correct_answer?: any;
  items?: string[];
  correct_order?: number[];
  pairs?: MatchingPair[];
  left_items?: string[];
  right_items?: string[];
  code?: string;
  chapter?: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  createdAt?: string;
}

export interface PracticalTestCase {
  input: string;
  expected_output: string;
}

export interface PracticalProblem {
  id: number;
  subjectId?: string;
  title: string;
  description: string;
  starter_code: string;
  solution_code: string;
  test_cases: PracticalTestCase[];
  difficulty?: 'easy' | 'medium' | 'hard';
  createdAt?: string;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  role: UserRole;
  branchId?: string;
  branchName?: string;
  class?: string;
  phone?: string;
  email?: string;
  pin?: string;
  status?: 'active' | 'locked';
  totalStudySeconds?: number;
  lastStudyDate?: string;
  enrolledSubjects?: string[];
  createdDate: string;
}

export interface UserSessionData {
  user: User;
  token: string;
  expiresAt: number;
  loginTimestamp: number;
}

export interface PausedExamState {
  examId: string;
  userId: string;
  subjectId: string;
  branchId: string;
  currentQuestionIndex: number;
  userAnswers: Record<number, any>;
  remainingSeconds: number;
  pausedAt: string;
  pausedBy: 'student' | 'teacher';
  reason: string;
  isUnlocked: boolean;
}

export interface ExamResult {
  id: string;
  userId: string;
  userName: string;
  studentName?: string;
  studentClass?: string;
  branchId: string;
  branchName?: string;
  subjectId: string;
  score: number;
  totalScore?: number;
  totalQuestions: number;
  correctCount: number;
  mcqCorrect?: number;
  mcqScore?: number;
  practicalScore?: number;
  rank?: string;
  timeSpentSeconds: number;
  passed: boolean;
  certificateCode?: string;
  completedDate: string;
}

export interface StudySessionLog {
  id: string;
  userId: string;
  subjectId: string;
  mode: 'study' | 'exam' | 'practice';
  durationSeconds: number;
  timestamp: string;
}
