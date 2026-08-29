import { User, UserRole, Branch, Subject, PausedExamState, ExamResult, UserSessionData, StudySessionLog } from "@/types";

export const DEFAULT_BRANCHES: Branch[] = [
  {
    id: "branch_thuduc",
    name: "Chi Nhánh TP. Thủ Đức",
    code: "TD_HCM",
    address: "Khu Đô Thị ĐHQG TP.HCM / Đường số 9, P. Linh Tây, TP. Thủ Đức",
    phone: "0901.234.567",
    managerName: "Thầy Nguyễn Duy Thiên",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_quan1",
    name: "Chi Nhánh Quận 1 (Trung Tâm)",
    code: "Q1_HCM",
    address: "Số 15 Lê Duẩn, Phường Bến Nghé, Quận 1, TP.HCM",
    phone: "0902.345.678",
    managerName: "Cô Trần Thị Mai",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_govap",
    name: "Chi Nhánh Gò Vấp",
    code: "GV_HCM",
    address: "Số 128 Quang Trung, Phường 10, Quận Gò Vấp, TP.HCM",
    phone: "0903.456.789",
    managerName: "Thầy Lê Hoàng Nam",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_binhthanh",
    name: "Chi Nhánh Bình Thạnh",
    code: "BT_HCM",
    address: "Số 475A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP.HCM",
    phone: "0904.567.890",
    managerName: "Thầy Phạm Đức Minh",
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
    id: "mgr_thuduc",
    username: "quanly_thuduc",
    password: "saoviet2026",
    fullName: "Thầy Nguyễn Duy Thiên",
    role: "branch_manager",
    branchId: "branch_thuduc",
    branchName: "Chi Nhánh TP. Thủ Đức",
    phone: "0901234567",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "mgr_quan1",
    username: "quanly_quan1",
    password: "saoviet2026",
    fullName: "Cô Trần Thị Mai",
    role: "branch_manager",
    branchId: "branch_quan1",
    branchName: "Chi Nhánh Quận 1 (Trung Tâm)",
    phone: "0902345678",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "mgr_govap",
    username: "quanly_govap",
    password: "saoviet2026",
    fullName: "Thầy Lê Hoàng Nam",
    role: "branch_manager",
    branchId: "branch_govap",
    branchName: "Chi Nhánh Gò Vấp",
    phone: "0903456789",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "mgr_binhthanh",
    username: "quanly_binhthanh",
    password: "saoviet2026",
    fullName: "Thầy Phạm Đức Minh",
    role: "branch_manager",
    branchId: "branch_binhthanh",
    branchName: "Chi Nhánh Bình Thạnh",
    phone: "0904567890",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "hv01",
    username: "0937482673",
    password: "Thien0937482673",
    fullName: "Nguyễn Duy Thiên",
    role: "student",
    branchId: "branch_thuduc",
    branchName: "Chi Nhánh TP. Thủ Đức",
    phone: "0937482673",
    class: "Python Nâng Cao K26",
    status: "active",
    totalStudySeconds: 5400,
    enrolledSubjects: ["python", "web_basic", "cpp"],
    createdDate: "2026-08-29"
  },
  {
    id: "hv02",
    username: "0912345671",
    password: "Nam0912345671",
    fullName: "Nguyễn Bảo Nam",
    role: "student",
    branchId: "branch_thuduc",
    branchName: "Chi Nhánh TP. Thủ Đức",
    phone: "0912345671",
    class: "Python Nâng Cao K26",
    status: "active",
    totalStudySeconds: 3600,
    enrolledSubjects: ["python", "c"],
    createdDate: "2026-08-29"
  },
  {
    id: "hv03",
    username: "0912345672",
    password: "Khoi0912345672",
    fullName: "Trần Minh Khôi",
    role: "student",
    branchId: "branch_thuduc",
    branchName: "Chi Nhánh TP. Thủ Đức",
    phone: "0912345672",
    class: "Lập Trình Web Frontend",
    status: "active",
    totalStudySeconds: 1800,
    enrolledSubjects: ["web_basic", "typescript"],
    createdDate: "2026-08-29"
  },
  {
    id: "hv04",
    username: "0912345673",
    password: "Ha0912345673",
    fullName: "Lê Thu Hà",
    role: "student",
    branchId: "branch_quan1",
    branchName: "Chi Nhánh Quận 1 (Trung Tâm)",
    phone: "0912345673",
    class: "Java Core K26",
    status: "active",
    totalStudySeconds: 2400,
    enrolledSubjects: ["java", "python"],
    createdDate: "2026-08-29"
  },
  {
    id: "hv05",
    username: "0912345674",
    password: "Long0912345674",
    fullName: "Phạm Hoàng Long",
    role: "student",
    branchId: "branch_govap",
    branchName: "Chi Nhánh Gò Vấp",
    phone: "0912345674",
    class: "C# .NET K26",
    status: "active",
    totalStudySeconds: 900,
    enrolledSubjects: ["csharp"],
    createdDate: "2026-08-29"
  },
  {
    id: "hv06",
    username: "0912345675",
    password: "Linh0912345675",
    fullName: "Vũ Mỹ Linh",
    role: "student",
    branchId: "branch_binhthanh",
    branchName: "Chi Nhánh Bình Thạnh",
    phone: "0912345675",
    class: "Lập Trình C++ DSA",
    status: "active",
    totalStudySeconds: 3100,
    enrolledSubjects: ["cpp", "c"],
    createdDate: "2026-08-29"
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
    DEFAULT_USERS.forEach(u => userMap.set(u.username.toLowerCase(), u));
    parsed.forEach(u => {
      if (u && u.username) {
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
  if (cleanAttempt === "saoviet2026" || cleanAttempt === "123456" || lowerAttempt === "saoviet2026") {
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

    const log: StudySessionLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      subjectId,
      mode,
      durationSeconds: addedSeconds,
      timestamp: new Date().toISOString()
    };
    const logsRaw = localStorage.getItem(STORAGE_KEY_STUDY_LOGS);
    const logs: StudySessionLog[] = logsRaw ? JSON.parse(logsRaw) : [];
    logs.push(log);
    if (logs.length > 500) logs.shift();
    localStorage.setItem(STORAGE_KEY_STUDY_LOGS, JSON.stringify(logs));
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
