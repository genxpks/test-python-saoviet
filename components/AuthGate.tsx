"use client";

import { useEffect, useState, useRef } from "react";
import { User } from "@/types";
import { getCurrentUser, loginUser, logStudyTime, getSessionRemainingSeconds, formatStudyDuration } from "@/lib/usersData";
import { Lock, LogIn, Sparkles, CheckCircle2, Eye, EyeOff, Clock, BookOpen, ShieldAlert } from "lucide-react";

interface AuthGateProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  mode?: "study" | "exam" | "practice";
  subjectId?: string;
}

export default function AuthGate({ 
  children, 
  pageTitle = "Khu Vực Học Tập & Khảo Thí", 
  pageDescription = "Vui lòng đăng nhập bằng tài khoản học viên do Trung tâm cấp để tiếp tục.",
  mode = "study",
  subjectId = "python_advanced"
}: AuthGateProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Login form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Study time tracking timer
  const activeSecondsRef = useRef(0);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsChecking(false);

    // If logged in, start tracking study time every second
    const trackInterval = setInterval(() => {
      const liveUser = getCurrentUser();
      if (!liveUser) {
        setCurrentUser(null);
        return;
      }
      activeSecondsRef.current += 1;

      // Every 60s, persist study duration
      if (activeSecondsRef.current > 0 && activeSecondsRef.current % 60 === 0) {
        logStudyTime(liveUser.id, 60, mode, subjectId);
      }
    }, 1000);

    return () => {
      clearInterval(trackInterval);
      // Log remainder on unmount
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
      window.location.reload(); // Refresh to update all session headers
    } else {
      setLoginError(res.message || "Sai tên đăng nhập hoặc mật khẩu!");
    }
  };

  if (isChecking) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <div style={{ color: "var(--brand-primary)", fontWeight: 700, fontSize: "1.1rem" }}>
          Đang kiểm tra phiên đăng nhập...
        </div>
      </div>
    );
  }

  // If user is authenticated, render protected content
  if (currentUser) {
    return <>{children}</>;
  }

  // Otherwise, render modern Authentication Barrier
  return (
    <div style={{ maxWidth: "520px", margin: "3rem auto", padding: "0 1rem" }}>
      <div className="q-card" style={{ padding: "2.5rem 2rem", textAlign: "center" }}>
        <div style={{
          width: "68px",
          height: "68px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.15))",
          color: "var(--brand-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.2rem"
        }}>
          <Lock size={32} />
        </div>

        <h2 style={{ fontSize: "1.45rem", fontWeight: 900, marginBottom: "0.4rem", letterSpacing: "-0.5px" }}>
          {pageTitle}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.5rem", lineHeight: "1.5" }}>
          {pageDescription}
        </p>

        {/* Thông báo quy định cấp tài khoản */}
        <div style={{
          background: "rgba(37, 99, 235, 0.05)",
          border: "1px solid rgba(37, 99, 235, 0.15)",
          borderRadius: "var(--radius-sm)",
          padding: "0.8rem 1rem",
          marginBottom: "1.5rem",
          fontSize: "0.82rem",
          color: "var(--text-secondary)",
          textAlign: "left",
          lineHeight: "1.5"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, color: "var(--brand-primary)", marginBottom: "0.25rem" }}>
            <Sparkles size={14} />
            <span>Quy định tài khoản học viên Sao Việt:</span>
          </div>
          <div>• <strong>Tên đăng nhập:</strong> Số điện thoại học viên (VD: <code>0912345671</code>)</div>
          <div>• <strong>Mật khẩu chuẩn:</strong> Tên không dấu + SĐT (VD: <code>Nam0912345671</code>)</div>
          <div style={{ marginTop: "0.3rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            ⏱️ Phiên học sẽ tự động hết hạn và bảo vệ sau 3 giờ học liên tục.
          </div>
        </div>

        <form onSubmit={handleInlineLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
          {loginError && (
            <div style={{
              color: "#b91c1c",
              fontSize: "0.85rem",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <span>⚠️</span>
              <span>{loginError}</span>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              Tên Đăng Nhập / SĐT:
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="VD: 0912345671 hoặc admin"
              className="input"
              style={{ width: "100%" }}
              autoFocus
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.35rem" }}>
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
            <LogIn size={18} />
            <span>Đăng Nhập Vào Học Ngay</span>
          </button>
        </form>
      </div>
    </div>
  );
}
