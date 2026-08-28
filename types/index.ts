// types/index.ts - TypeScript Interfaces cho Hệ Thống Luyện Thi & In Đề Python Nâng Cao

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
  type: QuestionType;
  type_name: string;
  question: string;
  options?: string[];
  correct_answer?: any; // number | number[] | string
  items?: string[]; // for sequence_order
  correct_order?: number[]; // for sequence_order
  pairs?: MatchingPair[]; // for matching
  left_items?: string[];
  right_items?: string[];
  explanation: string;
}

export interface PracticalTestCase {
  input: string;
  expected_output: string;
}

export interface PracticalProblem {
  id: number;
  title: string;
  description: string;
  starter_code: string;
  solution_code: string;
  test_cases: PracticalTestCase[];
}

export interface User {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  role: 'teacher' | 'student';
  phone?: string;
  class?: string;
  pin?: string;
  createdDate: string;
}

export interface PausedExamState {
  userId: string;
  userName: string;
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
  mcqCorrect: number;
  mcqScore: number;
  practicalScore: number;
  totalScore: number;
  rank: string;
  submittedAt: string;
}
