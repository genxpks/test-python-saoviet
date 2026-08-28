// lib/usersData.ts - Quản lý tài khoản & phân quyền người dùng
// Đơn vị: TIN HỌC SAO VIỆT THỦ ĐỨC

import { User, PausedExamState, ExamResult } from "@/types";

export const DEFAULT_USERS: User[] = [
  {
    id: "admin",
    username: "admin",
    password: "saoviet2026",
    fullName: "Giáo Viên Quản Trị (Admin)",
    role: "teacher",
    phone: "0901234567",
    pin: "8888",
    createdDate: "2026-08-28"
  },
  {
    id: "hv01",
    username: "0912345671",
    password: "Nam0912345671",
    fullName: "Nguyễn Bảo Nam",
    role: "student",
    phone: "0912345671",
    class: "Python Nâng Cao K26",
    createdDate: "2026-08-28"
  },
  {
    id: "hv02",
    username: "0912345672",
    password: "Khoi0912345672",
    fullName: "Trần Minh Khôi",
    role: "student",
    phone: "0912345672",
    class: "Python Nâng Cao K26",
    createdDate: "2026-08-28"
  },
  {
    id: "hv03",
    username: "0912345673",
    password: "Ha0912345673",
    fullName: "Lê Thu Hà",
    role: "student",
    phone: "0912345673",
    class: "Python Nâng Cao K26",
    createdDate: "2026-08-28"
  },
  {
    id: "hv04",
    username: "0912345674",
    password: "Long0912345674",
    fullName: "Phạm Hoàng Long",
    role: "student",
    phone: "0912345674",
    class: "Python Nâng Cao K26",
    createdDate: "2026-08-28"
  },
  {
    id: "hv05",
    username: "0912345675",
    password: "Linh0912345675",
    fullName: "Vũ Mỹ Linh",
    role: "student",
    phone: "0912345675",
    class: "Python Nâng Cao K26",
    createdDate: "2026-08-28"
  }
];

// Helper: Xóa dấu tiếng Việt chuẩn
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

// Helper: Sinh Mật Khẩu Chuẩn Theo Quy Tắc "Tên + SĐT" (Ví dụ: "Nguyễn Bảo Nam" + "0912345671" -> "Nam0912345671")
export function generateStandardPassword(fullName: string, phone: string): string {
  if (!fullName && !phone) return "123456";
  const cleanPhone = (phone || "").replace(/\D/g, "");
  const words = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return cleanPhone || "123456";
  const firstName = words[words.length - 1]; // Lấy Tên chính cuối cùng
  const cleanName = removeVietnameseTones(firstName);
  const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
  return `${capitalized}${cleanPhone}`;
}

// Helper: Tự động trích xuất tên đăng nhập chuẩn từ SĐT
export function generateStandardUsername(phone: string): string {
  return (phone || "").replace(/\D/g, "");
}

const USERS_KEY = "NEXT_SAOVIET_USERS";
const SESSION_KEY = "NEXT_SAOVIET_CURRENT_USER";
const PAUSED_EXAM_KEY = "NEXT_SAOVIET_PAUSED_EXAM";
const RESULTS_KEY = "NEXT_SAOVIET_EXAM_RESULTS";

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

export function loginUser(username: string, password: string): { success: boolean; user?: User; message?: string } {
  const users = getUsers();
  const found = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password.trim());
  if (found) {
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(found));
    }
    return { success: true, user: found };
  }
  return { success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" };
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function addUser(userData: { 
  username: string; 
  fullName: string; 
  role?: 'teacher' | 'student'; 
  phone?: string;
  class?: string; 
  password?: string; 
  pin?: string 
}) {
  const users = getUsers();
  if (users.some(u => u.username.toLowerCase() === userData.username.trim().toLowerCase())) {
    return { success: false, message: "Tên đăng nhập / Số điện thoại đã tồn tại!" };
  }
  const newUser: User = {
    id: "u_" + Date.now(),
    username: userData.username.trim(),
    fullName: userData.fullName.trim(),
    role: userData.role || "student",
    phone: userData.phone?.trim(),
    class: userData.class || "Python Nâng Cao",
    password: userData.password?.trim() || "123456",
    pin: userData.pin?.trim() || (userData.role === "teacher" ? "8888" : undefined),
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

  // If current user is updated, update session as well
  const current = getCurrentUser();
  if (current && current.id === userId) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(users[index]));
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
  const admin = users.find(u => u.role === "teacher");
  const validPin = admin?.pin || "8888";
  return pin.trim() === validPin || pin.trim() === "saoviet2026";
}

export function updateTeacherPin(newPin: string) {
  let users = getUsers();
  const admin = users.find(u => u.role === "teacher");
  if (admin) {
    admin.pin = newPin.trim();
    saveUsers(users);
    return { success: true };
  }
  return { success: false, message: "Không tìm thấy tài khoản giáo viên!" };
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
