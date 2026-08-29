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
  Eye, 
  EyeOff, 
  Building2, 
  Hourglass
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sessionRemainingSec, setSessionRemainingSec] = useState<number>(0);
  
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

    const sessionTimer = setInterval(() => {
      const liveUser = getCurrentUser();
      if (!liveUser && user) {
        setUser(null);
        alert("⏰ Phiên đăng nhập đã tự động kết thúc sau 3 giờ học tập theo quy định của Tin Học Sao Việt.\nVui lòng đăng nhập lại để tiếp tục!");
        setShowLoginModal(true);
      } else if (liveUser) {
        setUser(liveUser);
        setSessionRemainingSec(getSessionRemainingSeconds());
      }
    }, 15000);

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
        <div className="container header-content">
          <Link href="/" className="logo-section">
            <div className="logo-icon-wrap" style={{
              background: "linear-gradient(135deg, rgba(0, 245, 200, 0.25), rgba(14, 165, 233, 0.25))",
              border: "1px solid rgba(0, 245, 200, 0.4)",
              boxShadow: "0 0 15px rgba(0, 245, 200, 0.3)"
            }}>
              <Sparkles size={20} color="#00f5c8" />
            </div>
            <div>
              <div className="brand-title" style={{ fontSize: "1.05rem", letterSpacing: "-0.3px" }}>TIN HỌC SAO VIỆT</div>
              <div className="brand-subtitle" style={{ color: "#94a3b8" }}>Hệ Thống Đào Tạo & Khảo Thí Lập Trình 3D</div>
            </div>
          </Link>

          <nav className="nav-links">
            <Link 
              href="/" 
              className={`nav-link ${pathname === "/" ? "active" : ""}`}
            >
              <Sparkles size={16} />
              <span>Trang Chủ</span>
            </Link>
            
            <Link 
              href="/study" 
              className={`nav-link ${pathname === "/study" ? "active" : ""}`}
            >
              <BookOpen size={16} />
              <span>Ôn Tập 120 Câu</span>
            </Link>
            
            <Link 
              href="/exam" 
              className={`nav-link ${pathname === "/exam" ? "active" : ""}`}
            >
              <Clock size={16} />
              <span>Thi Online</span>
            </Link>

            <Link 
              href="/print-exam" 
              className={`nav-link ${pathname === "/print-exam" ? "active" : ""}`}
            >
              <Printer size={16} />
              <span>In Đề Chuẩn A4</span>
            </Link>

            {user && (user.role === "admin" || user.role === "branch_manager" || user.role === "teacher") && (
              <Link 
                href="/admin" 
                className={`nav-link ${pathname === "/admin" ? "active" : ""}`}
              >
                <ShieldCheck size={16} />
                <span>Quản Trị</span>
              </Link>
            )}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(15, 23, 42, 0.8)",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid rgba(0, 245, 200, 0.2)",
                  fontSize: "0.82rem",
                  backdropFilter: "blur(12px)"
                }}>
                  <div style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: user.role === "admin" ? "linear-gradient(135deg, #f43f5e, #be123c)" : user.role === "branch_manager" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "linear-gradient(135deg, #00f5c8, #0ea5e9)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 900,
                    boxShadow: user.role === "admin" ? "0 0 10px rgba(244,63,94,0.4)" : user.role === "branch_manager" ? "0 0 10px rgba(139,92,246,0.4)" : "0 0 10px rgba(0,245,200,0.4)"
                  }}>
                    {user.role === "admin" ? "AD" : user.role === "branch_manager" ? "QL" : "HV"}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                    <span style={{ fontWeight: 800, color: "#f1f5f9" }}>
                      {user.fullName}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Building2 size={10} />
                      <span>{user.branchName || "Chi Nhánh Thủ Đức"}</span>
                    </span>
                  </div>

                  {user.role === "student" && (
                    <div style={{
                      marginLeft: "0.4rem",
                      paddingLeft: "0.4rem",
                      borderLeft: "1px solid var(--border-light)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      color: "var(--brand-primary)",
                      fontWeight: 700,
                      fontSize: "0.72rem"
                    }} title="Thời gian phiên đăng nhập còn lại">
                      <Hourglass size={12} />
                      <span>{formatRemainingTime(sessionRemainingSec)}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: "0.4rem 0.65rem", gap: "0.3rem", fontSize: "0.78rem" }}
                  title="Đăng xuất"
                >
                  <LogOut size={14} />
                  <span>Thoát</span>
                </button>
              </div>
            ) : (
              <button 
                  onClick={() => setShowLoginModal(true)}
                  className="btn btn-sm"
                  style={{
                    gap: "0.4rem",
                    background: "rgba(0, 245, 200, 0.1)",
                    color: "#00f5c8",
                    border: "1px solid rgba(0, 245, 200, 0.3)",
                    boxShadow: "0 0 15px rgba(0, 245, 200, 0.1)",
                    backdropFilter: "blur(4px)"
                  }}
                >
                  <LogIn size={15} />
                  <span>Đăng Nhập</span>
                </button>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div className="q-card" style={{ maxWidth: "460px", width: "100%", padding: "2rem", position: "relative", background: "rgba(10, 16, 32, 0.95)", border: "1px solid rgba(0,245,200,0.15)" }}>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: "absolute",
                top: "1.2rem",
                right: "1.2rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)"
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "rgba(0, 245, 200, 0.08)",
                border: "1px solid rgba(0, 245, 200, 0.2)",
                color: "#00f5c8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 0.8rem",
                boxShadow: "0 0 20px rgba(0,245,200,0.1)"
              }}>
                <UserIcon size={26} />
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 900, marginBottom: "0.2rem" }}>
                Đăng Nhập Khóa Học
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#94a3b8" }}>
                Học viên đăng nhập bằng SĐT được Quản lý chi nhánh cấp
              </p>
            </div>

            <div style={{
              background: "rgba(0, 245, 200, 0.04)",
              border: "1px solid rgba(0, 245, 200, 0.12)",
              borderRadius: "var(--radius-sm)",
              padding: "0.65rem 0.85rem",
              marginBottom: "1.2rem",
              fontSize: "0.78rem",
              color: "#cbd5e1"
            }}>
              <div>• <strong>Tên đăng nhập:</strong> Số điện thoại học viên (VD: <code>0937482673</code>)</div>
              <div>• <strong>Mật khẩu:</strong> Tên + SĐT (VD: <code>Thien0937482673</code>)</div>
            </div>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {loginError && (
                <div style={{
                  color: "#b91c1c",
                  fontSize: "0.82rem",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  padding: "0.6rem 0.8rem",
                  borderRadius: "var(--radius-sm)"
                }}>
                  {loginError}
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  Tên Đăng Nhập / SĐT:
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="VD: 0937482673 hoặc admin"
                  className="input"
                  style={{ width: "100%" }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  Mật Khẩu:
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="input"
                    style={{ width: "100%", paddingRight: "40px" }}
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
                      color: "var(--text-muted)",
                      padding: "4px"
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: "0.4rem" }}>
                <LogIn size={16} />
                <span>Đăng Nhập Khóa Học</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
