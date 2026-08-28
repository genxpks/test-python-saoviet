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
    pin: "8888",
    createdDate: "2026-08-28"
  },
  {
    id: "hv01",
    username: "hocvien01",
    password: "123456",
    fullName: "Nguyễn Bảo Nam",
    role: "student",
    class: "Python Nâng Cao K26",
    createdDate: "2026-08-28"
  },
  {
    id: "hv02",
    username: "hocvien02",
    password: "123456",
    fullName: "Trần Minh Khôi",
    role: "student",
    class: "Python Nâng Cao K26",
    createdDate: "2026-08-28"
  },
  {
    id: "hv03",
    username: "saoviet01",
    password: "123456",
    fullName: "Lê Thu Hà",
    role: "student",
    class: "Python Nâng Cao K26",
    createdDate: "2026-08-28"
  },
  {
    id: "hv04",
    username: "saoviet02",
    password: "123456",
    fullName: "Phạm Hoàng Long",
    role: "student",
    class: "Python Nâng Cao K26",
    createdDate: "2026-08-28"
  },
  {
    id: "hv05",
    username: "saoviet03",
    password: "123456",
    fullName: "Vũ Mỹ Linh",
    role: "student",
    class: "Python Nâng Cao K26",
    createdDate: "2026-08-28"
  }
];

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

export function addUser(userData: { username: string; fullName: string; role?: 'teacher' | 'student'; class?: string; password?: string }) {
  const users = getUsers();
  if (users.some(u => u.username.toLowerCase() === userData.username.trim().toLowerCase())) {
    return { success: false, message: "Tên đăng nhập đã tồn tại!" };
  }
  const newUser: User = {
    id: "u_" + Date.now(),
    username: userData.username.trim(),
    fullName: userData.fullName.trim(),
    role: userData.role || "student",
    class: userData.class || "Python Nâng Cao",
    password: userData.password?.trim() || "123456",
    createdDate: new Date().toISOString().split("T")[0]
  };
  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
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
