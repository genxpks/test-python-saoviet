"use client";

import { useEffect, useState, useRef } from "react";
import { User } from "@/types";
import { getCurrentUser, loginUserAsync, logStudyTime, DEFAULT_USERS } from "@/lib/usersData";
import { Sparkles, Eye, EyeOff, Zap } from "lucide-react";

interface AuthGateProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  mode?: "study" | "exam" | "practice";
  subjectId?: string;
}

export default function AuthGate({ 
  children, 
  pageTitle = "Đăng Nhập Khóa Học", 
  pageDescription = "Học viên đăng nhập bằng SĐT được Quản lý chi nhánh cấp",
  mode = "study",
  subjectId = "python"
}: AuthGateProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const activeSecondsRef = useRef(0);

  useEffect(() => {
    const updateUser = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
      setIsChecking(false);
    };
    updateUser();

    window.addEventListener("saoviet-auth-change", updateUser);
    window.addEventListener("storage", updateUser);

    const trackInterval = setInterval(() => {
      const liveUser = getCurrentUser();
      if (!liveUser) {
        setCurrentUser(null);
        return;
      }
      activeSecondsRef.current += 1;

      if (activeSecondsRef.current > 0 && activeSecondsRef.current % 60 === 0) {
        logStudyTime(liveUser.id, 60, mode, subjectId);
      }
    }, 1000);

    return () => {
      clearInterval(trackInterval);
      window.removeEventListener("saoviet-auth-change", updateUser);
      window.removeEventListener("storage", updateUser);
      const remainingSeconds = activeSecondsRef.current % 60;
      if (remainingSeconds > 10) {
        const u = getCurrentUser();
        if (u) {
          logStudyTime(u.id, remainingSeconds, mode, subjectId);
        }
      }
    };
  }, [mode, subjectId]);

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await loginUserAsync(username, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setLoginError("");
        if (typeof window !== "undefined" && window.location.pathname === "/login") {
          window.location.href = res.user.role === "student" ? "/study" : "/admin";
        }
      } else {
        setLoginError(res.message || "Sai tên đăng nhập hoặc mật khẩu!");
      }
    } catch (err: any) {
      setLoginError("Lỗi kết nối máy chủ: " + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const res = await loginUserAsync("0937482673", "123456");
      if (res.success && res.user) {
        setCurrentUser(res.user);
      } else {
        const demo = DEFAULT_USERS.find(u => u.role === "student") || DEFAULT_USERS[0];
        setCurrentUser(demo);
      }
    } catch (e) {
      const demo = DEFAULT_USERS.find(u => u.role === "student") || DEFAULT_USERS[0];
      setCurrentUser(demo);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isChecking) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <div style={{ color: "var(--primary)", fontWeight: 700, fontSize: "1.1rem" }}>
          Đang kiểm tra phiên đăng nhập...
        </div>
      </div>
    );
  }

  if (currentUser) {
    return <>{children}</>;
  }

  return (
    <div style={{
      maxWidth: "440px",
      margin: "3.5rem auto",
      padding: "0 1rem"
    }}>
      <div style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "24px",
        padding: "2.6rem 2.2rem",
        textAlign: "center",
        boxShadow: "var(--shadow-card)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Top Shimmer Line */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: "2px",
          background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.8), transparent)"
        }} />

        {/* Icon */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.2rem"
        }}>
          <div style={{
            width: "58px",
            height: "58px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #2563eb, #0284c7)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            boxShadow: "0 4px 18px rgba(37, 99, 255, 0.25)"
          }}>
            <Sparkles size={28} />
          </div>
        </div>

        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          marginBottom: "1.5rem",
          letterSpacing: "-0.4px",
          color: "var(--text-primary)",
          fontFamily: "var(--font-heading)"
        }}>
          {pageTitle}
        </h2>

        <form onSubmit={handleInlineLogin} style={{ display: "flex", flexDirection: "column", gap: "1.1rem", textAlign: "left" }}>
          {loginError && (
            <div style={{
              color: "#dc2626",
              fontSize: "0.84rem",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              padding: "0.65rem 0.9rem",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              {loginError}
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--text-secondary)" }}>
              Số Điện Thoại Học Viên
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập SĐT (VD: 0937482673)"
              style={{
                width: "100%",
                padding: "0.85rem 1.1rem",
                background: "var(--surface-subtle)",
                border: "1.5px solid var(--border-medium)",
                borderRadius: "12px",
                color: "var(--text-primary)",
                fontSize: "0.92rem",
                outline: "none",
                transition: "all 0.2s ease"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border-medium)";
                e.currentTarget.style.boxShadow = "none";
              }}
              autoFocus
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--text-secondary)" }}>
              Mật khẩu
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                style={{
                  width: "100%",
                  padding: "0.85rem 1.1rem",
                  paddingRight: "44px",
                  background: "var(--surface-subtle)",
                  border: "1.5px solid var(--border-medium)",
                  borderRadius: "12px",
                  color: "var(--text-primary)",
                  fontSize: "0.92rem",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-medium)";
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
                  color: "var(--text-muted)",
                  padding: "4px"
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "0.6rem",
              width: "100%",
              padding: "0.9rem 1.5rem",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "0.98rem",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.02em",
              boxShadow: "0 4px 18px rgba(37, 99, 235, 0.35)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 22px rgba(37, 99, 235, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 18px rgba(37, 99, 235, 0.35)";
            }}
          >
            ĐĂNG NHẬP
          </button>
        </form>

        <div style={{ margin: "0.8rem 0" }}>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isLoggingIn}
            style={{
              width: "100%",
              padding: "0.75rem 1.2rem",
              borderRadius: "9999px",
              background: "rgba(37, 99, 235, 0.08)",
              color: "#2563eb",
              fontWeight: 700,
              fontSize: "0.88rem",
              border: "1.5px dashed rgba(37, 99, 235, 0.45)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s ease"
            }}
          >
            <Zap size={16} />
            <span>Vào Nhanh Chế Độ Học Viên Thử Nghiệm</span>
          </button>
        </div>

        <div style={{
          marginTop: "1rem",
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          fontWeight: 600
        }}>
          💡 Mẹo: Mật khẩu mặc định = Tên + SĐT (VD: nam0937482673)
        </div>
      </div>
    </div>
  );
}
