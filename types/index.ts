// 5-cấp phân quyền: admin > internal_manager > branch_manager > teacher > student
export type UserRole = 'admin' | 'internal_manager' | 'branch_manager' | 'teacher' | 'student';

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Quản Trị Hệ Thống',
  internal_manager: 'Quản Lý Nội Bộ',
  branch_manager: 'Quản Lý Chi Nhánh',
  teacher: 'Giáo Viên',
  student: 'Học Viên',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: '#dc2626',
  internal_manager: '#7c3aed',
  branch_manager: '#2563eb',
  teacher: '#059669',
  student: '#64748b',
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 5,
  internal_manager: 4,
  branch_manager: 3,
  teacher: 2,
  student: 1,
};

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  managerName?: string;
  defaultTeacherPin?: string;
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
  defaultExamConfig?: ExamConfig;
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
  option_explanations?: Record<string | number, string>;
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
  initial_code?: string;
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
  lastLoginDate?: string;
  lastLoginTime?: string;
  lastLoginIp?: string;
  enrolledSubjects?: string[];     // Môn học được cấp phép (student)
  assignedSubjectIds?: string[];   // Môn học được phân công giảng dạy (teacher)
  managedBranchIds?: string[];     // Chi nhánh được quản lý (internal_manager có thể quản nhiều)
  createdDate: string;
}

export interface UserSessionData {
  user: User;
  token: string;
  expiresAt: number;
  loginTimestamp: number;
  loginTimeFormatted?: string;
  loginDate?: string;
  ipAddress?: string;
  networkInfo?: {
    ip: string;
    userAgent?: string;
  };
}

export interface PausedExamState {
  examId: string;
  userId: string;
  userName?: string;
  subjectId: string;
  branchId: string;
  currentPart?: 1 | 2;
  currentQuestionIndex: number;
  userAnswers: Record<number, any>;
  userPracticalCode?: Record<number, string>;
  practicalResults?: Record<number, any>;
  examQuestions?: Question[];
  examPracticals?: PracticalProblem[];
  remainingSeconds: number;
  totalDurationSeconds?: number;
  pausedAt: string;
  pausedDate?: string;
  pausedBy: 'student' | 'teacher';
  reason?: string;
  isUnlocked?: boolean;
  originalCode?: string;
  resumeCodeUsed?: string;
  clientIp?: string;
}

export interface ExamSettings {
  autoLockSubjectOnPass: boolean;      // Tự động đóng môn học khi thi Đạt (>= 5.0)
  autoLockAccountOnSubmit: boolean;    // Tự động khóa tài khoản sau khi nộp bài
  allowReviewAnswers: boolean;         // Cho phép học viên xem giải thích đúng/sai sau thi
  passScoreThreshold: number;          // Điểm đạt chuẩn (mặc định: 5.0)
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
  examDate?: string;                             // Ngày thi (VD: 10/09/2026)
  examStartTime?: string;                        // Giờ bắt đầu vào làm bài (VD: 11:05:30)
  examEndTime?: string;                          // Giờ hoàn thành nộp bài (VD: 11:45:12)
  completedTime?: string;                        // Giờ nộp bài
  loginTime?: string;                            // Giờ học viên đăng nhập (VD: 11:01:25)
  ipAddress?: string;                            // Địa chỉ IP mạng máy dự thi (VD: 14.161.28.10)
  clientIp?: string;                             // IP client
  networkDevice?: string;                        // Thiết bị / Trình duyệt thí sinh
  questionsDetail?: Question[];                  // Danh sách câu hỏi đề thi
  practicalsDetail?: PracticalProblem[];         // Danh sách bài tự luận code
  userAnswers?: Record<number, any>;             // Đáp án học viên đã chọn
  userPracticalCode?: Record<number, string>;    // Code học viên đã viết
  practicalResults?: Record<number, any>;        // Kết quả test cases code
  subjectLockedAfterExam?: boolean;              // Đã đóng môn học sau thi
  accountLockedAfterExam?: boolean;              // Đã khóa tài khoản sau thi
}

export interface StudySessionLog {
  id: string;
  userId: string;
  subjectId: string;
  mode: 'study' | 'exam' | 'practice';
  durationSeconds: number;
  timestamp: string;
}

// Cấu trúc cấu hình đề thi (Option C mặc định: 50 TN + 4 Code + 60 phút)
export interface ExamConfig {
  numQuestions: number;      // Số câu trắc nghiệm lý thuyết (mặc định: 50)
  numPracticals: number;     // Số bài code thực hành (mặc định: 4)
  durationMinutes: number;   // Thời gian làm bài phút (mặc định: 60)
}

// Mã mở phòng thi 6 số — do Admin/GV cấp, lưu MongoDB
export interface ExamAccessCode {
  id: string;           // UUID tự sinh
  code: string;         // Mã 6 chữ số, VD: "482931"
  subjectId: string;    // Môn học áp dụng: "python" | "all" | ...
  branchId: string;     // Chi nhánh: "all" = toàn hệ thống
  label: string;        // Ghi chú: "Lớp Python chiều T2 CN Bình Thạnh"
  createdBy: string;    // Username người tạo
  expiresAt: string;    // ISO datetime: "2026-09-11T18:30:00+07:00"
  isActive: boolean;    // Có thể tắt thủ công
  usageCount: number;   // Số lần học viên đã dùng
  createdAt: string;    // ISO datetime lúc tạo
  config?: ExamConfig;  // Cấu hình cấu trúc đề thi riêng cho mã này
}

