import { User, UserRole, Branch, Subject, PausedExamState, ExamResult, UserSessionData, StudySessionLog, ExamSettings } from "@/types";

export const DEFAULT_BRANCHES: Branch[] = [
  {
    id: "branch_binhthanh",
    name: "Chi Nhánh Bình Thạnh",
    code: "BT_HCM",
    address: "Số 475A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP.HCM",
    phone: "0904.567.890",
    managerName: "Quản Lý Bình Thạnh",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_quan7",
    name: "Chi Nhánh Quận 7",
    code: "Q7_HCM",
    address: "Số 512 Huỳnh Tấn Phát, Phường Bình Thuận, Quận 7, TP.HCM",
    phone: "0905.123.456",
    managerName: "Quản Lý Quận 7",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_binhtan",
    name: "Chi Nhánh Bình Tân",
    code: "BTA_HCM",
    address: "Số 135 Kinh Dương Vương, Phường An Lạc, Quận Bình Tân, TP.HCM",
    phone: "0906.234.567",
    managerName: "Quản Lý Bình Tân",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_quan12",
    name: "Chi Nhánh Quận 12",
    code: "Q12_HCM",
    address: "Số 186 Tô Ký, Phường Tân Chánh Hiệp, Quận 12, TP.HCM",
    phone: "0907.345.678",
    managerName: "Quản Lý Quận 12",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_thuduc",
    name: "Chi Nhánh TP. Thủ Đức",
    code: "TD_HCM",
    address: "Khu Đô Thị ĐHQG TP.HCM / Đường số 9, P. Linh Tây, TP. Thủ Đức",
    phone: "0901.234.567",
    managerName: "Quản Lý Thủ Đức",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_tanbinh",
    name: "Chi Nhánh Tân Bình",
    code: "TB_HCM",
    address: "Số 268 Lý Thường Kiệt, Phường 14, Quận Tân Bình, TP.HCM",
    phone: "0908.456.789",
    managerName: "Quản Lý Tân Bình",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_thudaumot",
    name: "Chi Nhánh Thủ Dầu Một",
    code: "TDM_BD",
    address: "Số 234 Đại Lộ Bình Dương, Phường Phú Hòa, TP. Thủ Dầu Một, Bình Dương",
    phone: "0909.567.890",
    managerName: "Quản Lý Thủ Dầu Một",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_thuanan",
    name: "Chi Nhánh Thuận An",
    code: "TA_BD",
    address: "Số 88 Cách Mạng Tháng 8, Phường Lái Thiêu, TP. Thuận An, Bình Dương",
    phone: "0910.678.901",
    managerName: "Quản Lý Thuận An",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_dian",
    name: "Chi Nhánh Dĩ An",
    code: "DA_BD",
    address: "Số 168 Nguyễn An Ninh, Phường Dĩ An, TP. Dĩ An, Bình Dương",
    phone: "0911.789.012",
    managerName: "Quản Lý Dĩ An",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_tanuyen",
    name: "Chi Nhánh Tân Uyên",
    code: "TU_BD",
    address: "Đường ĐT 746, Phường Uyên Hưng, TP. Tân Uyên, Bình Dương",
    phone: "0912.890.123",
    managerName: "Quản Lý Tân Uyên",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_bienhoa",
    name: "Chi Nhánh Biên Hòa",
    code: "BH_DN",
    address: "Số 56 Đồng Khởi, Phường Tân Hiệp, TP. Biên Hòa, Đồng Nai",
    phone: "0913.901.234",
    managerName: "Quản Lý Biên Hòa",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_longthanh",
    name: "Chi Nhánh Long Thành",
    code: "LT_DN",
    address: "Số 12 Khu Phước Hải, Thị Trấn Long Thành, Huyện Long Thành, Đồng Nai",
    phone: "0914.012.345",
    managerName: "Quản Lý Long Thành",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_vungtau",
    name: "Chi Nhánh Vũng Tàu",
    code: "VT_BRVT",
    address: "Số 207 Lê Hồng Phong, Phường 8, TP. Vũng Tàu, Bà Rịa - Vũng Tàu",
    phone: "0915.123.456",
    managerName: "Quản Lý Vũng Tàu",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  }
];

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: "python",
    name: "Lập Trình Python Nâng Cao",
    code: "PY_NC",
    icon: "FileCode2",
    runtime: "python3",
    description: "Khóa học Python nâng cao: Chuỗi, List/Dict, Hàm, Thư viện chuẩn & Đồ họa Turtle Graphics.",
    totalModules: 5,
    isActive: true,
    createdDate: "2026-08-29"
  },
  {
    id: "c",
    name: "Lập Trình Ngôn Ngữ C",
    code: "C_CORE",
    icon: "Terminal",
    runtime: "c",
    description: "Nền tảng tư duy lập trình C: Kiểu dữ liệu, Con trỏ ô nhớ, Cấp phát động & Struct.",
    totalModules: 5,
    isActive: true,
    createdDate: "2026-08-29"
  },
  {
    id: "cpp",
    name: "Lập Trình C++ & Cấu Trúc Dữ Liệu",
    code: "CPP_DSA",
    icon: "Terminal",
    runtime: "cpp",
    description: "Giải thuật nâng cao, STL Containers, Vector, Stack, Queue & Binary Tree.",
    totalModules: 6,
    isActive: true,
    createdDate: "2026-08-29"
  },
  {
    id: "csharp",
    name: "Lập Trình C# .NET Enterprise",
    code: "CS_NET",
    icon: "Cpu",
    runtime: "csharp",
    description: "Lập trình C# hướng đối tượng, LINQ, Async/Await & Kiến trúc dịch vụ .NET 8.",
    totalModules: 6,
    isActive: true,
    createdDate: "2026-08-29"
  },
  {
    id: "java",
    name: "Lập Trình Java Core OOP",
    code: "JAVA_OOP",
    icon: "Cpu",
    runtime: "java",
    description: "Lập trình hướng đối tượng Java: Đóng gói, Kế thừa, Đa hình, Trừu tượng & Collections.",
    totalModules: 6,
    isActive: true,
    createdDate: "2026-08-29"
  },
  {
    id: "typescript",
    name: "Lập Trình TypeScript Fullstack",
    code: "TS_FULL",
    icon: "Layers",
    runtime: "typescript",
    description: "Hệ thống kiểu tĩnh nâng cao, Generics, Utility Types, Async Promises & React Next.js.",
    totalModules: 6,
    isActive: true,
    createdDate: "2026-08-29"
  },
  {
    id: "web_basic",
    name: "Lập Trình Web HTML5, CSS3, JS Cơ Bản",
    code: "WEB_BASIC",
    icon: "Layers",
    runtime: "html_css",
    description: "Xây dựng giao diện web chuẩn responsive, hiệu ứng CSS 3D và tương tác JavaScript DOM.",
    totalModules: 8,
    isActive: true,
    createdDate: "2026-08-29"
  }
];

export function generateDefaultStudentPassword(fullName: string, phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const parts = fullName.trim().split(/\s+/);
  const rawFirstName = parts[parts.length - 1] || "Student";
  const normalized = rawFirstName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
  const formattedName = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return `${formattedName}${cleanPhone}`;
}

export const DEFAULT_USERS: User[] = [
  {
    id: "admin",
    username: "admin",
    password: "",
    fullName: "Tổng Quản Trị Viên (Super Admin)",
    role: "admin",
    phone: "0901888999",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_binhthanh",
    username: "binhthanh@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Bình Thạnh",
    role: "branch_manager",
    branchId: "branch_binhthanh",
    branchName: "Chi Nhánh Bình Thạnh",
    phone: "0904567890",
    email: "binhthanh@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_quan7",
    username: "quan7@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Quận 7",
    role: "branch_manager",
    branchId: "branch_quan7",
    branchName: "Chi Nhánh Quận 7",
    phone: "0905123456",
    email: "quan7@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_binhtan",
    username: "binhtan@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Bình Tân",
    role: "branch_manager",
    branchId: "branch_binhtan",
    branchName: "Chi Nhánh Bình Tân",
    phone: "0906234567",
    email: "binhtan@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_quan12",
    username: "quan12@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Quận 12",
    role: "branch_manager",
    branchId: "branch_quan12",
    branchName: "Chi Nhánh Quận 12",
    phone: "0907345678",
    email: "quan12@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_thuduc",
    username: "thuduc@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Thủ Đức",
    role: "branch_manager",
    branchId: "branch_thuduc",
    branchName: "Chi Nhánh TP. Thủ Đức",
    phone: "0901234567",
    email: "thuduc@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_tanbinh",
    username: "tanbinh@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Tân Bình",
    role: "branch_manager",
    branchId: "branch_tanbinh",
    branchName: "Chi Nhánh Tân Bình",
    phone: "0908456789",
    email: "tanbinh@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_thudaumot",
    username: "thudaumot@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Thủ Dầu Một",
    role: "branch_manager",
    branchId: "branch_thudaumot",
    branchName: "Chi Nhánh Thủ Dầu Một",
    phone: "0909567890",
    email: "thudaumot@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_thuanan",
    username: "thuanan@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Thuận An",
    role: "branch_manager",
    branchId: "branch_thuanan",
    branchName: "Chi Nhánh Thuận An",
    phone: "0910678901",
    email: "thuanan@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_dian",
    username: "dian@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Dĩ An",
    role: "branch_manager",
    branchId: "branch_dian",
    branchName: "Chi Nhánh Dĩ An",
    phone: "0911789012",
    email: "dian@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_tanuyen",
    username: "tanuyen@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Tân Uyên",
    role: "branch_manager",
    branchId: "branch_tanuyen",
    branchName: "Chi Nhánh Tân Uyên",
    phone: "0912890123",
    email: "tanuyen@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_bienhoa",
    username: "bienhoa@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Biên Hòa",
    role: "branch_manager",
    branchId: "branch_bienhoa",
    branchName: "Chi Nhánh Biên Hòa",
    phone: "0913901234",
    email: "bienhoa@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_longthanh",
    username: "longthanh@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Long Thành",
    role: "branch_manager",
    branchId: "branch_longthanh",
    branchName: "Chi Nhánh Long Thành",
    phone: "0914012345",
    email: "longthanh@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_vungtau",
    username: "vungtau@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Vũng Tàu",
    role: "branch_manager",
    branchId: "branch_vungtau",
    branchName: "Chi Nhánh Vũng Tàu",
    phone: "0915123456",
    email: "vungtau@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "student_demo",
    username: "0937482673",
    fullName: "Học Viên Sao Việt (Demo)",
    role: "student",
    phone: "0937482673",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "student_kiet",
    username: "0977266020",
    password: "Kiet0977266020",
    fullName: "Nguyễn Tuấn Kiệt",
    role: "student",
    branchId: "branch_thuduc",
    branchName: "Chi Nhánh TP. Thủ Đức",
    class: "110926",
    phone: "0977266020",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python"],
    createdDate: "2026-09-10"
  }
];

const STORAGE_KEY_USERS = "saoviet_users_v2";
const STORAGE_KEY_SESSION = "saoviet_session_v2";
const STORAGE_KEY_STUDY_LOGS = "saoviet_study_logs_v2";
const STORAGE_KEY_PAUSED_EXAMS = "saoviet_paused_exams_v2";
const STORAGE_KEY_EXAM_RESULTS = "saoviet_exam_results_v2";
const SESSION_DURATION_SECONDS = 3 * 60 * 60;

export function isSubjectEnrolled(user: User | null, subjectId: string): boolean {
  if (!user) return false;
  if (user.role === "admin" || user.role === "branch_manager" || user.role === "teacher") {
    return true;
  }
  const userSubs = user.enrolledSubjects || [];
  return userSubs.includes(subjectId) || userSubs.includes(subjectId.replace("_advanced", ""));
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed: User[] = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const userMap = new Map<string, User>();
    // Add parsed users first to preserve custom created order (newest on top)
    parsed.forEach(u => {
      if (u && u.username) {
        userMap.set(u.username.toLowerCase(), u);
      }
    });
    // Ensure all default users exist
    DEFAULT_USERS.forEach(u => {
      if (!userMap.has(u.username.toLowerCase())) {
        userMap.set(u.username.toLowerCase(), u);
      }
    });
    return Array.from(userMap.values());
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {}
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    const session: UserSessionData = JSON.parse(raw);
    const now = Date.now();
    if (now > session.expiresAt) {
      logoutUser();
      return null;
    }
    return session.user;
  } catch {
    return null;
  }
}

export function getSessionRemainingSeconds(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return 0;
    const session: UserSessionData = JSON.parse(raw);
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((session.expiresAt - now) / 1000));
    return remaining;
  } catch {
    return 0;
  }
}

export function validateUserCredentials(user: User, passwordAttempt: string): boolean {
  if (!passwordAttempt) return false;
  const cleanAttempt = passwordAttempt.trim();
  const lowerAttempt = cleanAttempt.toLowerCase();
  
  // 1. Direct password match or case-insensitive match
  if (user.password && (user.password === cleanAttempt || user.password.toLowerCase() === lowerAttempt)) {
    return true;
  }
  
  // 2. Admin super password
  if (user.role === "admin" && (cleanAttempt === "saoviet@admin2026" || cleanAttempt === "admin" || !user.password)) {
    return true;
  }
  
  // 3. Student standard password (e.g. Dat0987654321, dat0987654321, Đạt0987654321)
  if (user.role === "student") {
    const expectedPass = generateDefaultStudentPassword(user.fullName, user.phone || user.username);
    if (cleanAttempt === expectedPass || lowerAttempt === expectedPass.toLowerCase()) {
      return true;
    }
    // Also support First Name + clean Phone with accented first name
    const parts = user.fullName.trim().split(/\s+/);
    const rawFirst = parts[parts.length - 1] || "";
    const cleanPhone = (user.phone || user.username || "").replace(/\D/g, "");
    if (cleanPhone && `${rawFirst}${cleanPhone}`.toLowerCase() === lowerAttempt) {
      return true;
    }
    // Also allow student to login with just their Phone number as password
    if (cleanPhone && cleanAttempt === cleanPhone) {
      return true;
    }
  }
  
  // 4. Default global passwords
  if (
    cleanAttempt === "saoviet@2026" ||
    cleanAttempt === "saoviet2026" ||
    cleanAttempt === "123456" ||
    lowerAttempt === "saoviet@2026" ||
    lowerAttempt === "saoviet2026"
  ) {
    return true;
  }
  
  return false;
}

export function findUserByUsernameOrPhone(input: string, usersList?: User[]): User | undefined {
  const users = usersList || getUsers();
  const rawInput = input.trim();
  const cleanInput = rawInput.toLowerCase();
  const cleanPhone = rawInput.replace(/\D/g, "");
  
  return users.find(u => {
    if (!u) return false;
    const uName = (u.username || "").toLowerCase();
    const uPhone = (u.phone || "").replace(/\D/g, "");
    const uFullName = (u.fullName || "").toLowerCase();
    
    // Match username
    if (uName === cleanInput) return true;
    // Match clean phone
    if (cleanPhone && (uPhone === cleanPhone || uName === cleanPhone)) return true;
    // Match phone exact
    if (u.phone && u.phone.toLowerCase() === cleanInput) return true;
    // Match ID
    if (u.id && u.id.toLowerCase() === cleanInput) return true;
    // Match Full Name
    if (uFullName === cleanInput) return true;
    return false;
  });
}

export function loginUser(username: string, passwordAttempt: string): { success: boolean; user?: User; message?: string } {
  const user = findUserByUsernameOrPhone(username);

  if (!user) {
    return { success: false, message: "Tài khoản không tồn tại trên hệ thống. Vui lòng kiểm tra lại SĐT hoặc liên hệ Quản lý/Giáo viên!" };
  }

  if (user.status === "locked") {
    return { success: false, message: "Tài khoản đang bị tạm khóa. Vui lòng liên hệ Quản lý chi nhánh." };
  }

  const isValidPass = validateUserCredentials(user, passwordAttempt);
  if (!isValidPass) {
    return { success: false, message: "Mật khẩu không chính xác. Định dạng mặc định: Tên + SĐT (VD: Thien0937482673)" };
  }

  const now = Date.now();
  const session: UserSessionData = {
    user,
    token: `token_${user.id}_${now}`,
    loginTimestamp: now,
    expiresAt: now + SESSION_DURATION_SECONDS * 1000
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    window.dispatchEvent(new Event("saoviet-auth-change"));
  }

  return { success: true, user };
}

export async function loginUserAsync(username: string, passwordAttempt: string): Promise<{ success: boolean; user?: User; message?: string }> {
  // 1. Try local login first
  const localRes = loginUser(username, passwordAttempt);
  if (localRes.success) {
    return localRes;
  }

  // 2. If user not found locally, fetch latest users from server API
  try {
    const res = await fetch("/api/users");
    const data = await res.json();
    if (data && data.success && Array.isArray(data.users) && data.users.length > 0) {
      const currentLocals = getUsers();
      const userMap = new Map<string, User>();
      data.users.forEach((u: User) => {
        if (u.username) userMap.set(u.username.toLowerCase(), u);
      });
      currentLocals.forEach((u: User) => {
        if (u.username) userMap.set(u.username.toLowerCase(), u);
      });
      const merged = Array.from(userMap.values());
      saveUsers(merged);

      const retryUser = findUserByUsernameOrPhone(username, merged);
      if (retryUser) {
        if (retryUser.status === "locked") {
          return { success: false, message: "Tài khoản đang bị tạm khóa. Vui lòng liên hệ Quản lý chi nhánh." };
        }
        if (validateUserCredentials(retryUser, passwordAttempt)) {
          const now = Date.now();
          const session: UserSessionData = {
            user: retryUser,
            token: `token_${retryUser.id}_${now}`,
            loginTimestamp: now,
            expiresAt: now + SESSION_DURATION_SECONDS * 1000
          };
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
            window.dispatchEvent(new Event("saoviet-auth-change"));
          }
          return { success: true, user: retryUser };
        } else {
          return { success: false, message: "Mật khẩu không chính xác. Định dạng mặc định: Tên + SĐT (VD: Thien0937482673)" };
        }
      }
    }
  } catch (e) {}

  return localRes;
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY_SESSION);
  window.dispatchEvent(new Event("saoviet-auth-change"));
}

export function logStudyTime(userId: string, addedSeconds: number, mode: 'study' | 'exam' | 'practice' = 'study', subjectId: string = 'python'): void {
  if (typeof window === "undefined" || addedSeconds <= 0) return;
  try {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].totalStudySeconds = (users[idx].totalStudySeconds || 0) + addedSeconds;
      users[idx].lastStudyDate = new Date().toISOString();
      saveUsers(users);

      const cur = getCurrentUser();
      if (cur && cur.id === userId) {
        cur.totalStudySeconds = users[idx].totalStudySeconds;
        cur.lastStudyDate = users[idx].lastStudyDate;
        const raw = localStorage.getItem(STORAGE_KEY_SESSION);
        if (raw) {
          const session = JSON.parse(raw);
          session.user = cur;
          localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
        }
      }
    }

    // Sync to MongoDB Atlas study_logs and users collection
    fetch("/api/study-time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        durationSeconds: addedSeconds,
        subjectId,
        mode
      })
    }).catch(() => null);
  } catch {}
}

export function formatStudyDuration(totalSec: number): string {
  if (!totalSec || totalSec <= 0) return "0 giờ 0 phút";
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  if (hours === 0) return `${minutes} phút`;
  return `${hours} giờ ${minutes} phút`;
}

export function deleteUser(id: string): void {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  saveUsers(filtered);
}

export function updateUser(id: string, updates: Partial<User>): void {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
  }
}

export function addUser(user: Partial<User>): { success: boolean; user?: User; message?: string } {
  const users = getUsers();
  const cleanUsername = (user.username || user.phone || "").trim();
  const existingIdx = users.findIndex(u => 
    (u.username && cleanUsername && u.username.toLowerCase() === cleanUsername.toLowerCase()) ||
    (u.id && user.id && u.id === user.id)
  );

  const newUser: User = {
    id: user.id || `u_${Date.now()}`,
    username: cleanUsername,
    fullName: (user.fullName || "").trim(),
    phone: (user.phone || "").trim(),
    class: user.class || "Python Nâng Cao",
    password: user.password || "123456",
    role: user.role || "student",
    branchId: user.branchId || "branch_thuduc",
    branchName: user.branchName || "Chi Nhánh Thủ Đức",
    pin: user.pin,
    status: user.status || "active",
    enrolledSubjects: user.enrolledSubjects || ["python"],
    totalStudySeconds: user.totalStudySeconds || 0,
    createdDate: user.createdDate || new Date().toISOString().split("T")[0]
  };

  if (existingIdx !== -1) {
    users[existingIdx] = { ...users[existingIdx], ...newUser };
  } else {
    users.unshift(newUser);
  }
  saveUsers(users);
  return { success: true, user: newUser };
}

export function verifyTeacherPin(pin: string): boolean {
  if (!pin) return false;
  const clean = pin.trim();
  if (clean === "8888") return true;
  const user = getCurrentUser();
  if (user && user.pin && user.pin === clean) return true;
  return false;
}

export function getPausedExam(): PausedExamState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PAUSED_EXAMS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePausedExam(exam: PausedExamState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PAUSED_EXAMS, JSON.stringify(exam));
  } catch {}
}

export function clearPausedExam(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_PAUSED_EXAMS);
  } catch {}
}

export function getExamResults(): ExamResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EXAM_RESULTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveExamResult(result: ExamResult): void {
  if (typeof window === "undefined") return;
  try {
    const results = getExamResults();
    results.unshift(result);
    localStorage.setItem(STORAGE_KEY_EXAM_RESULTS, JSON.stringify(results));
  } catch {}
}

export function clearExamResults(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_EXAM_RESULTS);
  } catch {}
}

export function deleteExamResult(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const results = getExamResults().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY_EXAM_RESULTS, JSON.stringify(results));
  } catch {}
}

export function getBranches(): Branch[] {
  return DEFAULT_BRANCHES;
}

export function saveBranches(branches: Branch[]): void {}

export function getSubjects(): Subject[] {
  return DEFAULT_SUBJECTS;
}

export function saveSubjects(subjects: Subject[]): void {}

export function updateTeacherPin(branchId: string, newPin: string): boolean {
  return true;
}

export function generateStandardPassword(fullName: string, phone: string): string {
  return generateDefaultStudentPassword(fullName, phone);
}

export function generateStandardUsername(phone: string): string {
  return phone.replace(/\D/g, "");
}

// ==========================================
// EXAM POLICIES & ACCOUNT LOCKING SYSTEM
// ==========================================
const STORAGE_KEY_EXAM_SETTINGS = "saoviet_exam_settings_v2";

export const DEFAULT_EXAM_SETTINGS: ExamSettings = {
  autoLockSubjectOnPass: true,
  autoLockAccountOnSubmit: false,
  allowReviewAnswers: true,
  passScoreThreshold: 5.0
};

export function getExamSettings(): ExamSettings {
  if (typeof window === "undefined") return DEFAULT_EXAM_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EXAM_SETTINGS);
    if (!raw) return DEFAULT_EXAM_SETTINGS;
    return { ...DEFAULT_EXAM_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_EXAM_SETTINGS;
  }
}

export function saveExamSettings(settings: ExamSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_EXAM_SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event("saoviet-exam-settings-change"));
  } catch {}
}

export async function setUserStatus(userId: string, status: 'active' | 'locked'): Promise<boolean> {
  try {
    updateUser(userId, { status });
    const u = getUsers().find(x => x.id === userId);
    if (u) {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: u.id, username: u.username, status })
      });
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("saoviet-auth-change"));
    }
    return true;
  } catch (err) {
    console.error("setUserStatus error:", err);
    return false;
  }
}

export async function toggleUserSubject(userId: string, subjectId: string, grant: boolean): Promise<boolean> {
  try {
    const users = getUsers();
    const u = users.find(x => x.id === userId);
    if (!u) return false;

    let currentSubs = [...(u.enrolledSubjects || ["python"])];
    if (grant) {
      if (!currentSubs.includes(subjectId)) currentSubs.push(subjectId);
    } else {
      currentSubs = currentSubs.filter(s => s !== subjectId);
    }

    updateUser(userId, { enrolledSubjects: currentSubs });

    await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, username: u.username, enrolledSubjects: currentSubs })
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("saoviet-auth-change"));
    }
    return true;
  } catch (err) {
    console.error("toggleUserSubject error:", err);
    return false;
  }
}

export async function grantExamRetake(userId: string, subjectId: string): Promise<boolean> {
  try {
    await setUserStatus(userId, "active");
    await toggleUserSubject(userId, subjectId, true);
    return true;
  } catch (err) {
    console.error("grantExamRetake error:", err);
    return false;
  }
}
