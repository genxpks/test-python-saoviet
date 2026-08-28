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
  KeyRound
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginUser(username, password);
    if (res.success && res.user) {
      setUser(res.user);
      setShowLoginModal(false);
      setLoginError("");
    } else {
      setLoginError(res.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản!");
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  const quickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setLoginError("");
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
            {user?.role === "teacher" && (
              <Link href="/admin" className={`tab-link ${pathname === "/admin" ? "active" : ""}`}>
                <ShieldCheck size={16} />
                <span>Quản Trị</span>
              </Link>
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
              <button className="btn btn-primary btn-sm" onClick={() => setShowLoginModal(true)}>
                <LogIn size={15} />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modern Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
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

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.15))",
                color: "var(--brand-primary)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem auto"
              }}>
                <KeyRound size={28} />
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Đăng Nhập Hệ Thống</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                Truy cập phòng thi trực tuyến & lưu trữ kết quả học tập
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                  Tên Đăng Nhập / Mã Học Viên:
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ví dụ: hocvien01 hoặc admin"
                  required
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                  Mật Khẩu:
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  required
                />
              </div>

              {/* Quick Fill Suggestions */}
              <div style={{
                background: "var(--surface-subtle)",
                padding: "0.85rem",
                borderRadius: "var(--radius-sm)",
                marginBottom: "1.2rem",
                border: "1px solid var(--border-light)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  <Sparkles size={14} color="var(--brand-primary)" />
                  <span>Chọn nhanh tài khoản mẫu:</span>
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => quickFill("hocvien01", "123456")}>
                    Học Viên 01
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => quickFill("hocvien02", "123456")}>
                    Học Viên 02
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => quickFill("admin", "saoviet2026")}>
                    Giáo Viên
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
          </div>
        </div>
      )}
    </>
  );
}
