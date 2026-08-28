// users.js - Hệ thống Quản lý Tài khoản & Phân quyền Người dùng
// Đơn vị: TIN HỌC SAO VIỆT THỦ ĐỨC

const DEFAULT_USERS = [
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

class UserManager {
  constructor() {
    this.STORAGE_KEY = "SAOVIET_PYTHON_USERS";
    this.SESSION_KEY = "SAOVIET_CURRENT_USER";
    this.EXAM_STATE_KEY = "SAOVIET_PAUSED_EXAM_STATE";
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    }
  }

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  }

  saveUsers(users) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  login(username, password) {
    const users = this.getUsers();
    const user = users.find(u => u.username === username.trim() && u.password === password.trim());
    if (user) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" };
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this.SESSION_KEY)) || null;
    } catch (e) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  }

  addUser(userData) {
    const users = this.getUsers();
    if (users.some(u => u.username === userData.username.trim())) {
      return { success: false, message: "Tên đăng nhập đã tồn tại!" };
    }
    const newUser = {
      id: "u_" + Date.now(),
      username: userData.username.trim(),
      password: userData.password.trim() || "123456",
      fullName: userData.fullName.trim(),
      role: userData.role || "student",
      class: userData.class || "Python Nâng Cao",
      createdDate: new Date().toISOString().split("T")[0]
    };
    users.push(newUser);
    this.saveUsers(users);
    return { success: true, user: newUser };
  }

  deleteUser(userId) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== userId && u.username !== "admin");
    this.saveUsers(users);
    return { success: true };
  }

  savePausedExam(examData) {
    localStorage.setItem(this.EXAM_STATE_KEY, JSON.stringify(examData));
  }

  getPausedExam() {
    try {
      return JSON.parse(localStorage.getItem(this.EXAM_STATE_KEY)) || null;
    } catch (e) {
      return null;
    }
  }

  clearPausedExam() {
    localStorage.removeItem(this.EXAM_STATE_KEY);
  }

  verifyTeacherPin(pin) {
    const users = this.getUsers();
    const admin = users.find(u => u.role === "teacher");
    const validPin = (admin && admin.pin) ? admin.pin : "8888";
    return pin.trim() === validPin || pin.trim() === "saoviet2026";
  }
}

window.userManager = new UserManager();
