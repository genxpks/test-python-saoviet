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
          background: "rgba(2, 6, 18, 0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            maxWidth: "440px",
            width: "100%",
            padding: "2.6rem 2.2rem",
            position: "relative",
            background: "rgba(4, 12, 34, 0.88)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1.5px solid rgba(0, 245, 200, 0.28)",
            borderRadius: "24px",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.75), 0 0 45px rgba(0, 245, 200, 0.18), inset 0 0 25px rgba(0, 245, 200, 0.04)",
            textAlign: "center"
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: "absolute",
                top: "1.2rem",
                right: "1.2rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00f5c8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              <X size={20} />
            </button>

            {/* Glowing Star Icon (Exact Mockup Match) */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.2rem"
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, rgba(0, 245, 200, 0.15), rgba(14, 165, 233, 0.15))",
                border: "1.5px solid rgba(0, 245, 200, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#00f5c8",
                boxShadow: "0 0 25px rgba(0, 245, 200, 0.35), inset 0 0 15px rgba(0, 245, 200, 0.1)"
              }}>
                <Sparkles size={32} />
              </div>
            </div>

            <h3 style={{
              fontSize: "1.55rem",
              fontWeight: 900,
              color: "#ffffff",
              marginBottom: "1.5rem",
              letterSpacing: "-0.5px",
              fontFamily: "var(--font-heading)"
            }}>
              Đăng Nhập Khóa Học
            </h3>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.1rem", textAlign: "left" }}>
              {loginError && (
                <div style={{
                  color: "#fb7185",
                  fontSize: "0.84rem",
                  background: "rgba(244, 63, 94, 0.12)",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                  padding: "0.65rem 0.9rem",
                  borderRadius: "10px",
                  textAlign: "center"
                }}>
                  {loginError}
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.4rem", color: "#cbd5e1" }}>
                  SĐT
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Phone SĐT (VD: 0937482673)"
                  style={{
                    width: "100%",
                    padding: "0.85rem 1.1rem",
                    background: "rgba(10, 20, 48, 0.75)",
                    border: "1.5px solid rgba(0, 245, 200, 0.35)",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "0.92rem",
                    outline: "none",
                    boxShadow: "0 0 15px rgba(0, 245, 200, 0.08)",
                    transition: "all 0.2s ease"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#00f5c8";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 245, 200, 0.25)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0, 245, 200, 0.35)";
                    e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 245, 200, 0.08)";
                  }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.4rem", color: "#cbd5e1" }}>
                  Mật khẩu
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                    style={{
                      width: "100%",
                      padding: "0.85rem 1.1rem",
                      paddingRight: "44px",
                      background: "rgba(10, 20, 48, 0.75)",
                      border: "1.5px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "0.92rem",
                      outline: "none",
                      transition: "all 0.2s ease"
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#00f5c8";
                      e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 245, 200, 0.25)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#00f5c8",
                      padding: "4px"
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Exact Mockup Cyan Gradient Full-Width Pill Button */}
              <button
                type="submit"
                style={{
                  marginTop: "0.6rem",
                  width: "100%",
                  padding: "0.95rem 1.5rem",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #00f5c8 0%, #0ea5e9 100%)",
                  color: "#020a14",
                  fontWeight: 900,
                  fontSize: "1rem",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  boxShadow: "0 6px 25px rgba(0, 245, 200, 0.45)",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.015)";
                  e.currentTarget.style.boxShadow = "0 10px 32px rgba(0, 245, 200, 0.65)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 6px 25px rgba(0, 245, 200, 0.45)";
                }}
              >
                ĐĂNG NHẬP
              </button>
            </form>

            {/* Clean Footer Hint (Exact Mockup Match) */}
            <div style={{
              marginTop: "1.4rem",
              fontSize: "0.85rem",
              color: "#94a3b8",
              fontWeight: 600
            }}>
              Mật khẩu = Tên + SĐT
            </div>
          </div>
        </div>
      )}
    </>
  );
}
