"use client";

import { useEffect, useState, useRef } from "react";
import { User } from "@/types";
import { getCurrentUser, loginUser, logStudyTime } from "@/lib/usersData";
import { Lock, LogIn, Sparkles, Eye, EyeOff } from "lucide-react";

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
      window.location.reload();
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

  if (currentUser) {
    return <>{children}</>;
  }

  return (
    <div style={{
      maxWidth: "480px",
      margin: "3rem auto",
      padding: "0 1rem"
    }}>
      <div style={{
        background: "rgba(4, 10, 26, 0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(0, 200, 180, 0.2)",
        borderRadius: "20px",
        padding: "2.8rem 2.2rem",
        textAlign: "center",
        boxShadow: "0 0 60px rgba(0, 100, 200, 0.15), 0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,200,180,0.1)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, transparent, rgba(0,245,200,0.6), rgba(80,160,255,0.4), transparent)"
        }} />

        {/* Logo */}
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "18px",
          background: "linear-gradient(135deg, rgba(0, 200, 160, 0.18), rgba(0, 80, 200, 0.18))",
          border: "1px solid rgba(0, 245, 200, 0.35)",
          boxShadow: "0 0 24px rgba(0, 200, 180, 0.2)",
          color: "#00f5c8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.4rem"
        }}>
          <Lock size={32} />
        </div>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "0.4rem", letterSpacing: "-0.5px", color: "#f1f5f9" }}>
          {pageTitle}
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.88rem", marginBottom: "1.6rem", lineHeight: "1.5" }}>
          {pageDescription}
        </p>

        <div style={{
          background: "rgba(0, 40, 60, 0.5)",
          border: "1px solid rgba(0, 200, 180, 0.2)",
          borderRadius: "10px",
          padding: "0.85rem 1rem",
          marginBottom: "1.5rem",
          fontSize: "0.82rem",
          color: "#94a3b8",
          textAlign: "left",
          lineHeight: "1.6"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, color: "#00f5c8", marginBottom: "0.3rem" }}>
            <Sparkles size={14} />
            <span>Quy định tài khoản học viên Sao Việt:</span>
          </div>
          <div>• <strong>Tên đăng nhập:</strong> Số điện thoại học viên (VD: <code style={{ background: "rgba(0,200,180,0.1)", padding: "1px 5px", borderRadius: "4px", color: "#00f5c8" }}>0937482673</code>)</div>
          <div>• <strong>Mật khẩu chuẩn:</strong> Tên + SĐT (VD: <code style={{ background: "rgba(0,200,180,0.1)", padding: "1px 5px", borderRadius: "4px", color: "#00f5c8" }}>Thien0937482673</code>)</div>
          <div style={{ marginTop: "0.3rem", fontSize: "0.78rem", color: "#475569" }}>
            ⏱️ Phiên học tự động hết hạn sau 3 giờ học liên tục.
          </div>
        </div>

        <form onSubmit={handleInlineLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
          {loginError && (
            <div style={{
              color: "#fb7185",
              fontSize: "0.85rem",
              background: "rgba(244, 63, 94, 0.1)",
              border: "1px solid rgba(244, 63, 94, 0.25)",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <span>⚠️</span>
              <span>{loginError}</span>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.35rem", color: "#94a3b8" }}>
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
            <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.35rem", color: "#94a3b8" }}>
              Mật Khẩu:
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="VD: Thien0937482673..."
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
                  color: "#00f5c8",
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

