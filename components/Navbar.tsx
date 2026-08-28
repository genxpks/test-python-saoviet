"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/types";
import { getCurrentUser, logoutUser, loginUser } from "@/lib/usersData";
import { 
  Terminal, 
  BookOpen, 
  Clock, 
  Printer, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  X, 
  Sparkles,
  CheckCircle2, 
  KeyRound,
  Eye,
  EyeOff,
  UserPlus,
  Phone
} from "lucide-react";
import { addUser, generateStandardPassword, generateStandardUsername } from "@/lib/usersData";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  
  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register form state (Chuẩn: Tên + SĐT)
  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regClass, setRegClass] = useState("Python Nâng Cao K26");
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginUser(username, password);
    if (res.success && res.user) {
      setUser(res.user);
      setShowLoginModal(false);
      setUsername("");
      setPassword("");
      setLoginError("");
    } else {
      setLoginError(res.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản!");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regPhone.trim()) {
      setLoginError("Vui lòng nhập đầy đủ Họ Tên và Số Điện Thoại!");
      return;
    }

    const stdUsername = generateStandardUsername(regPhone);
    const stdPassword = generateStandardPassword(regFullName, regPhone);

    const res = addUser({
      username: stdUsername,
      fullName: regFullName.trim(),
      phone: regPhone.trim(),
      class: regClass.trim(),
      password: stdPassword,
      role: "student"
    });

    if (res.success && res.user) {
      // Sync MongoDB
      try {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: stdUsername,
            fullName: regFullName.trim(),
            phone: regPhone.trim(),
            class: regClass.trim(),
            password: stdPassword,
            role: "student"
          })
        });
      } catch (err) {}

      setUser(res.user);
      setShowLoginModal(false);
      setRegFullName("");
      setRegPhone("");
      setLoginError("");
      alert(`🎉 Đăng ký thành công!\n👤 Tên đăng nhập: ${stdUsername}\n🔑 Mật khẩu chuẩn: ${stdPassword}\nĐã tự động đăng nhập vào hệ thống!`);
    } else {
      setLoginError(res.message || "Đăng ký không thành công!");
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <>
      <header className="main-header no-print">
        <div className="header-container">
          {/* Brand Identity */}
          <Link href="/" className="brand-box">
            <div className="brand-logo-icon">
              <Terminal size={24} />
            </div>
            <div className="brand-info">
              <h1>TIN HỌC SAO VIỆT THỦ ĐỨC</h1>
              <span className="sub-title">Python Cyber Studio & Examination</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="nav-tabs">
            <Link href="/" className={`tab-link ${pathname === "/" ? "active" : ""}`}>
              <Sparkles size={16} />
              <span>Trang Chủ</span>
            </Link>
            <Link href="/study" className={`tab-link ${pathname === "/study" ? "active" : ""}`}>
              <BookOpen size={16} />
              <span>Ôn Tập 120 Câu</span>
            </Link>
            <Link href="/exam" className={`tab-link ${pathname === "/exam" ? "active" : ""}`}>
              <Clock size={16} />
              <span>Thi Online</span>
            </Link>
            <Link href="/print-exam" className={`tab-link ${pathname === "/print-exam" ? "active" : ""}`}>
              <Printer size={16} />
              <span>In Đề Chuẩn A4</span>
            </Link>
            {user?.role === "teacher" ? (
              <Link href="/admin" className={`tab-link ${pathname === "/admin" ? "active" : ""}`}>
                <ShieldCheck size={16} />
                <span>Quản Trị</span>
              </Link>
            ) : (
              <button
                type="button"
                className={`tab-link ${pathname === "/admin" ? "active" : ""}`}
                style={{ background: "transparent", border: "none", cursor: "pointer", font: "inherit" }}
                onClick={() => {
                  setUsername("");
                  setPassword("");
                  setAuthMode("login");
                  setShowLoginModal(true);
                }}
              >
                <ShieldCheck size={16} />
                <span>Quản Trị</span>
              </button>
            )}
          </nav>

          {/* User Profile & Auth */}
          <div className="user-action-box">
            {user ? (
              <>
                <div className="user-profile-badge">
                  <div className="user-avatar">{user.fullName.charAt(0)}</div>
                  <div className="user-details">
                    <span className="u-name">{user.fullName}</span>
                    <span className="u-role">{user.role === "teacher" ? "Giáo Viên Quản Trị" : user.class || "Học Viên"}</span>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout} title="Đăng xuất">
                  <LogOut size={14} />
                  <span>Thoát</span>
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button className="btn btn-primary btn-sm" onClick={() => {
                  setUsername("");
                  setPassword("");
                  setLoginError("");
                  setAuthMode("login");
                  setShowLoginModal(true);
                }}>
                  <LogIn size={15} />
                  <span>Đăng Nhập</span>
                </button>

                <button className="btn btn-secondary btn-sm" onClick={() => {
                  setRegFullName("");
                  setRegPhone("");
                  setLoginError("");
                  setAuthMode("register");
                  setShowLoginModal(true);
                }}>
                  <UserPlus size={15} />
                  <span>Đăng Ký</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modern Secure Auth Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <button
              style={{
                position: "absolute",
                top: "1.2rem",
                right: "1.2rem",
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#64748b"
              }}
              onClick={() => setShowLoginModal(false)}
            >
              <X size={18} />
            </button>

            {/* Auth Mode Switcher */}
            <div style={{
              display: "flex",
              background: "var(--surface-subtle)",
              padding: "4px",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.2rem",
              border: "1px solid var(--border-light)"
            }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: "0.5rem 0.8rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  background: authMode === "login" ? "var(--brand-primary)" : "transparent",
                  color: authMode === "login" ? "#fff" : "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  transition: "all 0.2s ease"
                }}
                onClick={() => {
                  setAuthMode("login");
                  setLoginError("");
                }}
              >
                <LogIn size={15} />
                <span>Đăng Nhập</span>
              </button>

              <button
                type="button"
                style={{
                  flex: 1,
                  padding: "0.5rem 0.8rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  background: authMode === "register" ? "var(--brand-primary)" : "transparent",
                  color: authMode === "register" ? "#fff" : "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  transition: "all 0.2s ease"
                }}
                onClick={() => {
                  setAuthMode("register");
                  setLoginError("");
                }}
              >
                <UserPlus size={15} />
                <span>Đăng Ký Học Viên</span>
              </button>
            </div>

            {authMode === "login" ? (
              /* LOGIN FORM */
              <>
                <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Đăng Nhập Hệ Thống</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                    Dành cho học viên (SĐT) và giáo viên quản trị
                  </p>
                </div>

                <form onSubmit={handleLogin}>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                      Tên Đăng Nhập / SĐT:
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập số điện thoại hoặc username..."
                      required
                      autoFocus
                    />
                  </div>

                  <div style={{ marginBottom: "1.4rem" }}>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                      Mật Khẩu (Chuẩn Tên + SĐT):
                    </label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu..."
                        required
                        style={{ paddingRight: "40px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "10px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#64748b",
                          padding: "4px",
                          display: "flex",
                          alignItems: "center"
                        }}
                        title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div style={{
                      color: "#e11d48",
                      fontSize: "0.85rem",
                      marginBottom: "1.2rem",
                      background: "#fff1f2",
                      border: "1px solid #fecdd3",
                      padding: "0.65rem 0.9rem",
                      borderRadius: "var(--radius-xs)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <span>⚠️</span>
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary btn-block btn-lg">
                    <CheckCircle2 size={18} />
                    <span>Xác Nhận Đăng Nhập</span>
                  </button>
                </form>
              </>
            ) : (
              /* REGISTER FORM (Standard: Tên + SĐT) */
              <>
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Đăng Ký Học Viên Mới</h3>
                  <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                    Tự động thiết lập mật khẩu chuẩn <strong>Tên + SĐT</strong>
                  </p>
                </div>

                <div style={{
                  background: "rgba(37, 99, 235, 0.06)",
                  border: "1px solid rgba(37, 99, 235, 0.15)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.65rem 0.9rem",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginBottom: "1rem"
                }}>
                  💡 Mật khẩu đăng nhập sẽ là <strong>Tên + SĐT</strong> (Ví dụ: <em>Nguyễn Bảo Nam</em> + <em>0912345671</em> ➔ <code>Nam0912345671</code>)
                </div>

                <form onSubmit={handleRegister}>
                  <div style={{ marginBottom: "0.85rem" }}>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                      Họ Và Tên Học Viên: <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Bảo Nam"
                      required
                      autoFocus
                    />
                  </div>

                  <div style={{ marginBottom: "0.85rem" }}>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                      Số Điện Thoại (SĐT): <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="Ví dụ: 0912345671"
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "1.2rem" }}>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                      Lớp Học:
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={regClass}
                      onChange={(e) => setRegClass(e.target.value)}
                    />
                  </div>

                  {loginError && (
                    <div style={{
                      color: "#e11d48",
                      fontSize: "0.85rem",
                      marginBottom: "1.2rem",
                      background: "#fff1f2",
                      border: "1px solid #fecdd3",
                      padding: "0.65rem 0.9rem",
                      borderRadius: "var(--radius-xs)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <span>⚠️</span>
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary btn-block btn-lg">
                    <CheckCircle2 size={18} />
                    <span>Đăng Ký & Vào Học Ngay</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
