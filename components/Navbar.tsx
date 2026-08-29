"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/types";
import { 
  getCurrentUser, 
  logoutUser, 
  loginUser, 
  getSessionRemainingSeconds, 
  formatStudyDuration 
} from "@/lib/usersData";
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
  Building2,
  Lock,
  Hourglass
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sessionRemainingSec, setSessionRemainingSec] = useState<number>(0);
  
  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const curUser = getCurrentUser();
    setUser(curUser);
    if (curUser) {
      setSessionRemainingSec(getSessionRemainingSeconds());
    }

    // Interval to monitor 3-hour session timeout & study time updates
    const sessionTimer = setInterval(() => {
      const liveUser = getCurrentUser();
      if (!liveUser && user) {
        // Session has expired after 3 hours!
        setUser(null);
        alert("⏰ Phiên đăng nhập đã tự động kết thúc sau 3 giờ học tập theo quy định của Tin Học Sao Việt.\nVui lòng đăng nhập lại để tiếp tục!");
        setShowLoginModal(true);
      } else if (liveUser) {
        setUser(liveUser);
        setSessionRemainingSec(getSessionRemainingSeconds());
      }
    }, 15000); // Check every 15s

    return () => clearInterval(sessionTimer);
  }, [user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginUser(username, password);
    if (res.success && res.user) {
      setUser(res.user);
      setShowLoginModal(false);
      setUsername("");
      setPassword("");
      setLoginError("");
      setSessionRemainingSec(getSessionRemainingSeconds());
    } else {
      setLoginError(res.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản!");
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  const formatRemainingTime = (sec: number) => {
    if (sec <= 0) return "0p";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    if (h > 0) return `${h}h ${m}p`;
    return `${m}p`;
  };

  return (
    <>
      <header className="main-header no-print">
        <div className="header-container">
          {/* Brand Identity */}
          <Link href="/" className="brand-box">
            <div className="brand-logo-icon">
              <Terminal size={22} />
            </div>
            <div className="brand-info">
              <h1>TIN HỌC SAO VIỆT</h1>
              <span className="sub-title">Hệ Thống Đào Tạo & Khảo Thí Lập Trình</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="nav-tabs">
            <Link href="/" className={`tab-link ${pathname === "/" ? "active" : ""}`}>
              <Sparkles size={15} />
              <span>Trang Chủ</span>
            </Link>
            <Link href="/study" className={`tab-link ${pathname === "/study" ? "active" : ""}`}>
              <BookOpen size={15} />
              <span>Ôn Tập 120 Câu</span>
            </Link>
            <Link href="/exam" className={`tab-link ${pathname === "/exam" ? "active" : ""}`}>
              <Clock size={15} />
              <span>Thi Online</span>
            </Link>
            <Link href="/print-exam" className={`tab-link ${pathname === "/print-exam" ? "active" : ""}`}>
              <Printer size={15} />
              <span>In Đề Chuẩn A4</span>
            </Link>
            {(user?.role === "admin" || user?.role === "branch_manager" || user?.role === "teacher") ? (
              <Link href="/admin" className={`tab-link ${pathname === "/admin" ? "active" : ""}`}>
                <ShieldCheck size={15} />
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
                  setShowLoginModal(true);
                }}
              >
                <ShieldCheck size={15} />
                <span>Quản Trị</span>
              </button>
            )}
          </nav>

          {/* User Profile & Auth */}
          <div className="user-action-box">
            {user ? (
              <>
                {/* Session countdown indicator */}
                <div 
                  className="hide-mobile"
                  title="Thời lượng phiên đăng nhập (tự động đăng xuất sau 3 giờ)"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.35rem 0.65rem",
                    background: sessionRemainingSec < 900 ? "rgba(239, 68, 68, 0.1)" : "rgba(241, 245, 249, 0.8)",
                    border: sessionRemainingSec < 900 ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid var(--border-light)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    color: sessionRemainingSec < 900 ? "#b91c1c" : "var(--text-secondary)"
                  }}
                >
                  <Hourglass size={13} className={sessionRemainingSec < 900 ? "text-red-500" : ""} />
                  <span>Phiên: {formatRemainingTime(sessionRemainingSec)}</span>
                </div>

                {/* Total Study Time badge */}
                <div 
                  className="hide-mobile"
                  title="Tổng thời gian học tích lũy trên hệ thống"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.35rem 0.65rem",
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    color: "var(--brand-emerald-dark)"
                  }}
                >
                  <Clock size={13} />
                  <span>Đã học: {formatStudyDuration(user.totalStudySeconds || 0)}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.35rem 0.75rem",
                    background: "var(--surface-subtle)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.82rem",
                    fontWeight: 700
                  }}>
                    <UserIcon size={14} color="var(--brand-primary)" />
                    <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.fullName}
                    </span>
                    <span style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.15rem 0.45rem",
                      borderRadius: "var(--radius-full)",
                      background: user.role === "admin" ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : user.role === "branch_manager" ? "linear-gradient(135deg, #059669, #0891b2)" : "#e2e8f0",
                      color: (user.role === "admin" || user.role === "branch_manager") ? "#ffffff" : "var(--text-secondary)"
                    }}>
                      {user.role === "admin" ? "Admin" : user.role === "branch_manager" ? "QL Chi Nhánh" : user.role === "teacher" ? "Giáo Viên" : "Học Viên"}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary btn-sm"
                    title="Đăng xuất tài khoản"
                  >
                    <LogOut size={14} />
                    <span className="hide-mobile">Thoát</span>
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  setUsername("");
                  setPassword("");
                  setShowLoginModal(true);
                }}
                className="btn btn-primary btn-sm"
              >
                <LogIn size={15} />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(6px)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div className="q-card" style={{ maxWidth: "440px", width: "100%", padding: "2.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.15))",
                  color: "var(--brand-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Lock size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Đăng Nhập Hệ Thống</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Học viên & Cán bộ đào tạo Sao Việt</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError("");
                }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            {loginError && (
              <div style={{
                color: "#b91c1c",
                fontSize: "0.82rem",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                padding: "0.6rem 0.8rem",
                borderRadius: "var(--radius-sm)",
                marginBottom: "1rem",
                lineHeight: "1.4"
              }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">
                  Tên đăng nhập (Số điện thoại học viên hoặc mã tài khoản)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 0912345671 hoặc admin"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="form-label">Mật khẩu</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Nhập mật khẩu..."
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)"
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{
                fontSize: "0.76rem",
                color: "var(--text-muted)",
                background: "var(--surface-subtle)",
                padding: "0.6rem 0.8rem",
                borderRadius: "var(--radius-xs)",
                lineHeight: "1.4"
              }}>
                💡 Tài khoản học viên do Trung tâm cấp theo hồ sơ đăng ký. Phiên học tự động bảo vệ sau 3 giờ liên tục.
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
                <LogIn size={16} />
                <span>Xác Nhận Đăng Nhập</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
