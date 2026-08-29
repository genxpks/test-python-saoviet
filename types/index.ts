// types/index.ts - TypeScript Interfaces cho Hệ Thống Luyện Thi & In Đề Đa Môn, Đa Chi Nhánh
// Đơn vị: TRUNG TÂM TIN HỌC SAO VIỆT

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

export type ProgrammingRuntime = 'python3' | 'cpp' | 'java' | 'javascript' | 'html_css';

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
  subjectId?: string;       // Default: "python_advanced"
  branchId?: string;        // "all" or specific branch id
  moduleId?: number;        // Chapter/Module 1..5
  type: QuestionType;
  type_name: string;
  question: string;
  options?: string[];
  correct_answer?: any;     // number | number[] | string
  items?: string[];         // for sequence_order
  correct_order?: number[]; // for sequence_order
  pairs?: MatchingPair[];   // for matching
  left_items?: string[];
  right_items?: string[];
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
  subjectId?: string;       // Default: "python_advanced"
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
  branchId?: string;        // Branch ID
  branchName?: string;
  class?: string;           // Class name (e.g. "Python K26")
  phone?: string;
  email?: string;
  pin?: string;             // Teacher PIN
  status?: 'active' | 'locked';
  totalStudySeconds?: number;
  lastStudyDate?: string;
  createdDate: string;
}

export interface UserSessionData {
  user: User;
  loginTimestamp: number;
  expiresAt: number; // loginTimestamp + 3 * 3600 * 1000
}

export interface StudySessionLog {
  id: string;
  userId: string;
  username: string;
  studentName: string;
  branchId?: string;
  subjectId?: string;
  durationSeconds: number;
  date: string; // YYYY-MM-DD
  startTime: string;
  lastUpdatedTime: string;
  mode: 'study' | 'exam' | 'practice';
}

export interface PausedExamState {
  userId: string;
  userName: string;
  branchId?: string;
  subjectId?: string;
  examQuestions: Question[];
  examPracticalProblems: PracticalProblem[];
  currentQuestionIndex: number;
  examPart: 1 | 2;
  userAnswers: Record<number, any>;
  userPracticalCode: Record<number, string>;
  practicalResults: Record<number, { passed: boolean; score: number; feedback: string }>;
  timerSeconds: number;
  timestamp: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  branchId?: string;
  subjectId?: string;
  mcqCorrect: number;
  mcqScore: number;
  practicalScore: number;
  totalScore: number;
  rank: string;
  submittedAt: string;
}

export interface ExcelQuestionImportRow {
  stt?: number | string;
  subject_code?: string;
  question_type: string;
  question_content: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_answer: string;
  explanation: string;
  difficulty?: string;
  module_number?: number | string;
}
