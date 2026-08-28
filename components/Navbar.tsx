"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/types";
import { getCurrentUser, logoutUser, loginUser } from "@/lib/usersData";

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
      setLoginError(res.message || "Đăng nhập thất bại");
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  const quickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <>
      <header className="main-header no-print">
        <div className="header-container">
          <Link href="/" className="brand-box">
            <div className="brand-logo">🐍</div>
            <div className="brand-info">
              <h1>TIN HỌC SAO VIỆT THỦ ĐỨC</h1>
              <span className="sub-title">Luyện Thi & In Đề Python Nâng Cao</span>
            </div>
          </Link>

          <nav className="nav-tabs">
            <Link href="/" className={`tab-link ${pathname === "/" ? "active" : ""}`}>
              🏠 Trang Chủ
            </Link>
            <Link href="/study" className={`tab-link ${pathname === "/study" ? "active" : ""}`}>
              📖 Ôn Tập 120 Câu
            </Link>
            <Link href="/exam" className={`tab-link ${pathname === "/exam" ? "active" : ""}`}>
              ⏱️ Thi Online
            </Link>
            <Link href="/print-exam" className={`tab-link ${pathname === "/print-exam" ? "active" : ""}`}>
              🖨️ In Đề Chuẩn A4
            </Link>
            {user?.role === "teacher" && (
              <Link href="/admin" className={`tab-link ${pathname === "/admin" ? "active" : ""}`}>
                🛡️ Quản Trị
              </Link>
            )}
          </nav>

          <div className="user-action-box">
            {user ? (
              <>
                <div className="user-profile-badge">
                  <div className="user-avatar">{user.fullName.charAt(0)}</div>
                  <div className="user-details">
                    <span className="u-name">{user.fullName}</span>
                    <span className="u-role">{user.role === "teacher" ? "⭐ Giáo Viên" : "🎓 Học Viên"}</span>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                  Đăng Xuất
                </button>
              </>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => setShowLoginModal(true)}>
                🔐 Đăng Nhập
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button
              className="close-modal-btn"
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
              onClick={() => setShowLoginModal(false)}
            >
              &times;
            </button>
            <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
              <div style={{ fontSize: "2.5rem" }}>🔐</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Đăng Nhập Tài Khoản</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Chọn tài khoản cấp sẵn hoặc đăng nhập quyền Giáo viên</p>
            </div>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Tên đăng nhập:</label>
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ví dụ: hocvien01 hoặc admin"
                  required
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Mật khẩu:</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mặc định: 123456 (Admin: saoviet2026)"
                  required
                />
              </div>
              <div style={{ background: "#f8fafc", padding: "0.6rem", borderRadius: "6px", marginBottom: "1rem" }}>
                <small style={{ fontWeight: 600, color: "#64748b" }}>Tài khoản mẫu nhanh:</small>
                <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.3rem" }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => quickFill("hocvien01", "123456")}>
                    Học viên 01
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => quickFill("hocvien02", "123456")}>
                    Học viên 02
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => quickFill("admin", "saoviet2026")}>
                    Giáo Viên
                  </button>
                </div>
              </div>
              {loginError && (
                <div style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem", background: "#fef2f2", padding: "0.5rem", borderRadius: "4px" }}>
                  {loginError}
                </div>
              )}
              <button type="submit" className="btn btn-primary btn-block">
                Đăng Nhập Ngay
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
