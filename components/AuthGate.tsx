"use client";

import { useEffect, useState, useRef } from "react";
import { User } from "@/types";
import { getCurrentUser, loginUser, logStudyTime } from "@/lib/usersData";
import { Sparkles, Eye, EyeOff } from "lucide-react";

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

  const activeSecondsRef = useRef(0);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsChecking(false);

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
      const remainingSeconds = activeSecondsRef.current % 60;
      if (remainingSeconds > 10) {
        const u = getCurrentUser();
        if (u) {
          logStudyTime(u.id, remainingSeconds, mode, subjectId);
        }
      }
    };
  }, [mode, subjectId]);

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginUser(username, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setLoginError("");
      if (res.user.role === "admin" || res.user.role === "branch_manager" || res.user.role === "teacher") {
        window.location.href = "/admin";
      } else {
        window.location.reload();
      }
    } else {
      setLoginError(res.message || "Sai tên đăng nhập hoặc mật khẩu!");
    }
  };

  if (isChecking) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <div style={{ color: "#00f5c8", fontWeight: 700, fontSize: "1.1rem" }}>
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
        background: "rgba(4, 12, 34, 0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1.5px solid rgba(0, 245, 200, 0.28)",
        borderRadius: "24px",
        padding: "2.6rem 2.2rem",
        textAlign: "center",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.75), 0 0 45px rgba(0, 245, 200, 0.18), inset 0 0 25px rgba(0, 245, 200, 0.04)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Top Glowing Shimmer Line */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: "2px",
          background: "linear-gradient(90deg, transparent, rgba(0, 245, 200, 0.7), transparent)",
          boxShadow: "0 0 10px rgba(0, 245, 200, 0.6)"
        }} />

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

        <h2 style={{
          fontSize: "1.55rem",
          fontWeight: 900,
          marginBottom: "1.5rem",
          letterSpacing: "-0.5px",
          color: "#ffffff",
          fontFamily: "var(--font-heading)"
        }}>
          {pageTitle}
        </h2>

        <form onSubmit={handleInlineLogin} style={{ display: "flex", flexDirection: "column", gap: "1.1rem", textAlign: "left" }}>
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
  );
}
