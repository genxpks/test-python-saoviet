// lib/usersData.ts - Quản lý tài khoản, phân quyền 3 cấp, thời lượng học & Timeout phiên 3 giờ
// Đơn vị: TRUNG TÂM TIN HỌC SAO VIỆT

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
    id: "python_advanced",
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
    id: "cpp_basic",
    name: "Lập Trình C / C++ Căn Bản",
    code: "CPP_CB",
    icon: "Terminal",
    runtime: "cpp",
    description: "Nền tảng tư duy lập trình: Biến, Kiểu dữ liệu, Vòng lặp, Mảng 1D/2D, Con trỏ & Hàm trong C++.",
    totalModules: 6,
    isActive: true,
    createdDate: "2026-08-29"
  },
  {
    id: "web_frontend",
    name: "Lập Trình Web HTML5, CSS3, JavaScript",
    code: "WEB_FE",
    icon: "Layers",
    runtime: "html_css",
    description: "Xây dựng giao diện web chuẩn responsive, hiệu ứng CSS Keyframes và tương tác JavaScript DOM.",
    totalModules: 8,
    isActive: true,
    createdDate: "2026-08-29"
  },
  {
    id: "java_core",
    name: "Lập Trình Hướng Đối Tượng Java Core",
    code: "JAVA_OOP",
    icon: "Cpu",
    runtime: "java",
    description: "Lập trình hướng đối tượng OOP với Java: Đóng gói, Kế thừa, Đa hình, Trừu tượng & Collections.",
    totalModules: 6,
    isActive: true,
    createdDate: "2026-08-29"
  }
];

export const DEFAULT_USERS: User[] = [
  // 1. ADMIN
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
    createdDate: "2026-08-29"
  },
  // 2. BRANCH MANAGERS
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
    createdDate: "2026-08-29"
  },
  // 3. STUDENTS
  {
    id: "hv_demo",
    username: "hocvien",
    password: "saoviet2026",
    fullName: "Nguyễn Văn Học Viên",
    role: "student",
    branchId: "branch_thuduc",
    branchName: "Chi Nhánh TP. Thủ Đức",
    phone: "0901888999",
    class: "Python Nâng Cao K26",
    status: "active",
    totalStudySeconds: 4200,
    createdDate: "2026-08-29"
  },
  {
    id: "hv01",
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
    createdDate: "2026-08-29"
  },
  {
    id: "hv02",
    username: "0912345672",
    password: "Khoi0912345672",
    fullName: "Trần Minh Khôi",
    role: "student",
    branchId: "branch_thuduc",
    branchName: "Chi Nhánh TP. Thủ Đức",
    phone: "0912345672",
    class: "Python Nâng Cao K26",
    status: "active",
    totalStudySeconds: 1800,
    createdDate: "2026-08-29"
  },
  {
    id: "hv03",
    username: "0912345673",
    password: "Ha0912345673",
    fullName: "Lê Thu Hà",
    role: "student",
    branchId: "branch_quan1",
    branchName: "Chi Nhánh Quận 1 (Trung Tâm)",
    phone: "0912345673",
    class: "Python Nâng Cao K26",
    status: "active",
    totalStudySeconds: 2400,
    createdDate: "2026-08-29"
  },
  {
    id: "hv04",
    username: "0912345674",
    password: "Long0912345674",
    fullName: "Phạm Hoàng Long",
    role: "student",
    branchId: "branch_govap",
    branchName: "Chi Nhánh Gò Vấp",
    phone: "0912345674",
    class: "Python Nâng Cao K26",
    status: "active",
    totalStudySeconds: 900,
    createdDate: "2026-08-29"
  },
  {
    id: "hv05",
    username: "0912345675",
    password: "Linh0912345675",
    fullName: "Vũ Mỹ Linh",
    role: "student",
    branchId: "branch_binhthanh",
    branchName: "Chi Nhánh Bình Thạnh",
    phone: "0912345675",
    class: "Python Nâng Cao K26",
    status: "active",
    totalStudySeconds: 1200,
    createdDate: "2026-08-29"
  }
];

export function removeVietnameseTones(str: string): string {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
}

export function generateStandardPassword(fullName: string, phone: string): string {
  if (!fullName && !phone) return "123456";
  const cleanPhone = (phone || "").replace(/\D/g, "");
  const words = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return cleanPhone || "123456";
  const firstName = words[words.length - 1];
  const cleanName = removeVietnameseTones(firstName);
  const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
  return `${capitalized}${cleanPhone}`;
}

export function generateStandardUsername(phone: string): string {
  return (phone || "").replace(/\D/g, "");
}

// ⏱️ 3-HOUR SESSION TIMEOUT CONSTANT (3 giờ = 10,800,000 milliseconds)
export const SESSION_TIMEOUT_MS = 3 * 60 * 60 * 1000;

const USERS_KEY = "NEXT_SAOVIET_USERS";
const BRANCHES_KEY = "NEXT_SAOVIET_BRANCHES";
const SUBJECTS_KEY = "NEXT_SAOVIET_SUBJECTS";
const SESSION_KEY = "NEXT_SAOVIET_CURRENT_USER";
const PAUSED_EXAM_KEY = "NEXT_SAOVIET_PAUSED_EXAM";
const RESULTS_KEY = "NEXT_SAOVIET_EXAM_RESULTS";
const STUDY_LOGS_KEY = "NEXT_SAOVIET_STUDY_LOGS";

// FORMAT DURATION HELPER (VD: 3800s -> "1 giờ 3 phút")
export function formatStudyDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0 phút";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h} giờ ${m > 0 ? `${m} phút` : ""}`.trim();
  }
  if (m > 0) {
    return `${m} phút`;
  }
  return `${s} giây`;
}

// BRANCHES HELPER
export function getBranches(): Branch[] {
  if (typeof window === "undefined") return DEFAULT_BRANCHES;
  try {
    const raw = localStorage.getItem(BRANCHES_KEY);
    if (!raw) {
      localStorage.setItem(BRANCHES_KEY, JSON.stringify(DEFAULT_BRANCHES));
      return DEFAULT_BRANCHES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_BRANCHES;
  }
}

export function saveBranches(branches: Branch[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
}

// SUBJECTS HELPER
export function getSubjects(): Subject[] {
  if (typeof window === "undefined") return DEFAULT_SUBJECTS;
  try {
    const raw = localStorage.getItem(SUBJECTS_KEY);
    if (!raw) {
      localStorage.setItem(SUBJECTS_KEY, JSON.stringify(DEFAULT_SUBJECTS));
      return DEFAULT_SUBJECTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SUBJECTS;
  }
}

export function saveSubjects(subjects: Subject[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
}

// USERS HELPER
export function getUsers(): User[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: User[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// AUTH & 3-HOUR SESSION MANAGEMENT
export function loginUser(username: string, password: string): { success: boolean; user?: User; message?: string } {
  const users = getUsers();
  const found = users.find(u => 
    u.username.toLowerCase() === username.trim().toLowerCase() && 
    u.password === password.trim()
  );

  if (found) {
    if (typeof window !== "undefined") {
      const now = Date.now();
      const sessionData: UserSessionData = {
        user: found,
        loginTimestamp: now,
        expiresAt: now + SESSION_TIMEOUT_MS
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    }
    return { success: true, user: found };
  }
  return { success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" };
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // If structure is UserSessionData with loginTimestamp
    if (parsed && parsed.loginTimestamp) {
      const now = Date.now();
      if (now - parsed.loginTimestamp > SESSION_TIMEOUT_MS) {
        // Session expired after 3 hours
        logoutUser();
        return null;
      }
      return parsed.user;
    }

    // Legacy user object without timestamp -> stamp it
    if (parsed && parsed.id) {
      const now = Date.now();
      const sessionData: UserSessionData = {
        user: parsed,
        loginTimestamp: now,
        expiresAt: now + SESSION_TIMEOUT_MS
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      return parsed;
    }

    return null;
  } catch (e) {
    return null;
  }
}

// Get Remaining Session Time in Seconds
export function getSessionRemainingSeconds(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.loginTimestamp) {
      const elapsed = Date.now() - parsed.loginTimestamp;
      const remainingMs = SESSION_TIMEOUT_MS - elapsed;
      return remainingMs > 0 ? Math.floor(remainingMs / 1000) : 0;
    }
    return 0;
  } catch (e) {
    return 0;
  }
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

// STUDY TIME LOGGING
export function logStudyTime(
  userId: string,
  durationSeconds: number,
  mode: 'study' | 'exam' | 'practice' = 'study',
  subjectId: string = 'python_advanced'
) {
  if (!userId || durationSeconds <= 0 || typeof window === "undefined") return;

  try {
    // 1. Update local users array
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId || u.username === userId);
    if (userIndex !== -1) {
      users[userIndex].totalStudySeconds = (users[userIndex].totalStudySeconds || 0) + durationSeconds;
      users[userIndex].lastStudyDate = new Date().toISOString().split("T")[0];
      saveUsers(users);

      // Update current session user as well
      const cur = getCurrentUser();
      if (cur && (cur.id === userId || cur.username === userId)) {
        cur.totalStudySeconds = users[userIndex].totalStudySeconds;
        const now = Date.now();
        const raw = localStorage.getItem(SESSION_KEY);
        const loginTs = raw ? JSON.parse(raw).loginTimestamp || now : now;
        localStorage.setItem(SESSION_KEY, JSON.stringify({
          user: cur,
          loginTimestamp: loginTs,
          expiresAt: loginTs + SESSION_TIMEOUT_MS
        }));
      }
    }

    // 2. Save to local study logs
    const rawLogs = localStorage.getItem(STUDY_LOGS_KEY);
    const logs: StudySessionLog[] = rawLogs ? JSON.parse(rawLogs) : [];
    const newLog: StudySessionLog = {
      id: "log_" + Date.now(),
      userId,
      username: users[userIndex]?.username || userId,
      studentName: users[userIndex]?.fullName || "Học Viên",
      branchId: users[userIndex]?.branchId,
      subjectId,
      durationSeconds,
      date: new Date().toISOString().split("T")[0],
      startTime: new Date().toISOString(),
      lastUpdatedTime: new Date().toISOString(),
      mode
    };
    logs.unshift(newLog);
    localStorage.setItem(STUDY_LOGS_KEY, JSON.stringify(logs.slice(0, 200)));

    // 3. Sync with MongoDB Atlas in background
    fetch("/api/study-time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLog)
    }).catch(() => {});
  } catch (err) {
    console.warn("Study time logging warning:", err);
  }
}

export function addUser(userData: Partial<User>): { success: boolean; user?: User; message?: string } {
  const users = getUsers();
  if (users.some(u => u.username.toLowerCase() === userData.username?.trim().toLowerCase())) {
    return { success: false, message: "Tên đăng nhập / Số điện thoại đã tồn tại!" };
  }
  const newUser: User = {
    id: "u_" + Date.now(),
    username: userData.username?.trim() || `user_${Date.now()}`,
    fullName: userData.fullName?.trim() || "Học Viên Mới",
    role: userData.role || "student",
    branchId: userData.branchId || "branch_thuduc",
    branchName: userData.branchName || "Chi Nhánh TP. Thủ Đức",
    phone: userData.phone?.trim(),
    class: userData.class || "Python Nâng Cao",
    password: userData.password?.trim() || "123456",
    pin: userData.pin?.trim() || (userData.role === "admin" || userData.role === "branch_manager" ? "8888" : undefined),
    status: "active",
    totalStudySeconds: 0,
    createdDate: new Date().toISOString().split("T")[0]
  };
  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
}

export function updateUser(userId: string, updateData: Partial<User>) {
  let users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return { success: false, message: "Không tìm thấy tài khoản!" };

  users[index] = {
    ...users[index],
    ...updateData
  };
  saveUsers(users);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    const raw = localStorage.getItem(SESSION_KEY);
    const loginTs = raw ? JSON.parse(raw).loginTimestamp || Date.now() : Date.now();
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      user: users[index],
      loginTimestamp: loginTs,
      expiresAt: loginTs + SESSION_TIMEOUT_MS
    }));
  }

  return { success: true, user: users[index] };
}

export function deleteUser(userId: string) {
  let users = getUsers();
  users = users.filter(u => u.id !== userId && u.username !== "admin");
  saveUsers(users);
  return { success: true };
}

export function savePausedExam(state: PausedExamState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PAUSED_EXAM_KEY, JSON.stringify(state));
}

export function getPausedExam(): PausedExamState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PAUSED_EXAM_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearPausedExam() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PAUSED_EXAM_KEY);
}

export function verifyTeacherPin(pin: string): boolean {
  const users = getUsers();
  const validPins = users
    .filter(u => u.role === "admin" || u.role === "branch_manager" || u.role === "teacher")
    .map(u => u.pin)
    .filter(Boolean);
  return validPins.includes(pin.trim()) || pin.trim() === "8888";
}

export function updateTeacherPin(newPin: string, userId?: string) {
  let users = getUsers();
  let target = userId ? users.find(u => u.id === userId) : users.find(u => u.role === "admin" || u.role === "branch_manager");
  if (target) {
    target.pin = newPin.trim();
    saveUsers(users);
    return { success: true };
  }
  return { success: false, message: "Không tìm thấy tài khoản giáo viên/quản lý!" };
}

export function saveExamResult(result: ExamResult) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    const list: ExamResult[] = raw ? JSON.parse(raw) : [];
    list.unshift(result);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(list));
  } catch (e) {}
}

export function getExamResults(): ExamResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function deleteExamResult(id: string) {
  if (typeof window === "undefined") return;
  try {
    let list = getExamResults();
    list = list.filter(r => r.id !== id);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(list));
  } catch (e) {}
}

export function clearExamResults() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RESULTS_KEY);
}
