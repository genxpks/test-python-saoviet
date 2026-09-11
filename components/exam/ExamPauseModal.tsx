"use client";

import { useState } from "react";
import { verifyTeacherPin } from "@/lib/usersData";
import { 
  Pause, 
  ShieldCheck, 
  LogOut, 
  KeyRound, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  BookOpen,
  HelpCircle
} from "lucide-react";

interface ExamPauseModalProps {
  remainingSeconds: number;
  subjectName: string;
  subjectId: string;
  branchId: string;
  answeredCount: number;
  totalQuestions: number;
  onResumeWithCode: (code: string) => Promise<{ success: boolean; message?: string }>;
  onSaveAndExit: () => void;
  onCancel: () => void;
}

export default function ExamPauseModal({
  remainingSeconds,
  subjectName,
  subjectId,
  branchId,
  answeredCount,
  totalQuestions,
  onResumeWithCode,
  onSaveAndExit,
  onCancel,
}: ExamPauseModalProps) {
  const [unlockCode, setUnlockCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")} phút ${s.toString().padStart(2, "0")} giây`;
  };

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = unlockCode.trim().toUpperCase();
    if (!clean) {
      setErrorMsg("Vui lòng nhập Mã Phòng Thi Mới (Mã v2) hoặc PIN Giám Thị!");
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");

    try {
      // 1. Kiểm tra PIN giáo viên trước (8888)
      if (verifyTeacherPin(clean)) {
        setIsVerifying(false);
        await onResumeWithCode(clean);
        return;
      }

      // 2. Kiểm tra mã thi v2
      const res = await onResumeWithCode(clean);
      if (!res.success) {
        setErrorMsg(res.message || "Mã không hợp lệ hoặc đã hết hạn! Vui lòng liên hệ Thầy/Cô giám thị.");
      }
    } catch (err: any) {
      setErrorMsg("Đã xảy ra lỗi khi kiểm tra mã: " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.7)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1050,
      padding: "1rem"
    }}>
      <div style={{
        background: "var(--surface-card, #ffffff)",
        borderRadius: "16px",
        border: "1.5px solid var(--border-medium, #cbd5e1)",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
        maxWidth: "500px",
        width: "100%",
        padding: "1.5rem 1.6rem",
        animation: "fadeIn 0.2s ease"
      }}>
        <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
          <div style={{
            width: "52px",
            height: "52px",
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.15))",
            color: "#d97706",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 0.75rem",
            border: "1px solid rgba(245, 158, 11, 0.3)"
          }}>
            <Pause size={26} />
          </div>

          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: 0 }}>
            Bài Thi Đang Được Tạm Dừng
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748b)", margin: "0.3rem 0 0" }}>
            Toàn bộ tiến trình bài làm & thời gian còn lại đã được bảo lưu an toàn.
          </p>
        </div>

        {/* Thông tin bài thi đang lưu */}
        <div style={{
          background: "var(--surface-subtle, #f8fafc)",
          border: "1px solid var(--border-light, #e2e8f0)",
          borderRadius: "10px",
          padding: "0.75rem 1rem",
          marginBottom: "1.1rem",
          fontSize: "0.8rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#334155" }}>
            <span>Môn thi:</span>
            <strong style={{ color: "#1e40af" }}>{subjectName}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#334155" }}>
            <span>Thời gian còn lại:</span>
            <strong style={{ color: "#d97706", fontFamily: "var(--font-mono, monospace)" }}>
              {formatTimer(remainingSeconds)}
            </strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#334155" }}>
            <span>Tiến độ đã làm:</span>
            <strong style={{ color: "#059669" }}>
              {answeredCount} / {totalQuestions} câu hỏi & bài code
            </strong>
          </div>
        </div>

        {/* Form nhập mã mới v2 để tiếp tục thi */}
        <form onSubmit={handleUnlockSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
              🔑 Nhập Mã Phòng Thi Mới (Mã v2) hoặc PIN Giám Thị (8888) để thi tiếp:
            </label>
            <input
              type="text"
              value={unlockCode}
              onChange={(e) => {
                setUnlockCode(e.target.value);
                setErrorMsg("");
              }}
              placeholder="Nhập mã v2 (VD: SAOVIET2026, PYTHON2026 hoặc 8888)"
              autoFocus
              style={{
                width: "100%",
                padding: "0.55rem 0.85rem",
                borderRadius: "8px",
                border: "1.5px solid var(--border-medium, #cbd5e1)",
                background: "var(--surface-card, #ffffff)",
                color: "var(--text-primary, #0f172a)",
                fontSize: "0.95rem",
                fontWeight: 800,
                textAlign: "center",
                letterSpacing: "0.05em",
                outline: "none"
              }}
            />
          </div>

          {errorMsg && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecdd3",
              color: "#b91c1c",
              padding: "0.5rem 0.75rem",
              borderRadius: "7px",
              fontSize: "0.78rem",
              fontWeight: 600,
              marginBottom: "1rem",
              textAlign: "center"
            }}>
              {errorMsg}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            <button
              type="submit"
              disabled={isVerifying}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "0.55rem",
                fontSize: "0.84rem",
                fontWeight: 800,
                justifyContent: "center",
                gap: "6px",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)"
              }}
            >
              <ShieldCheck size={16} />
              <span>{isVerifying ? "Đang xác thực mã..." : "XÁC NHẬN MÃ & TIẾP TỤC BÀI THI"}</span>
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem" }}>
              <button
                type="button"
                onClick={onSaveAndExit}
                className="btn btn-secondary"
                style={{
                  padding: "0.5rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  justifyContent: "center",
                  gap: "5px",
                  color: "#d97706",
                  border: "1px solid #fde68a",
                  background: "#fffbeb"
                }}
                title="Bảo lưu trạng thái và rời phòng thi, hôm sau dùng mã v2 để thi tiếp"
              >
                <LogOut size={14} />
                <span>Bảo Lưu & Thoát Ra</span>
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary"
                style={{
                  padding: "0.5rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  justifyContent: "center"
                }}
              >
                <span>Hủy Bỏ / Quay Lại</span>
              </button>
            </div>
          </div>
        </form>

        <div style={{
          marginTop: "1rem",
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--border-light, #e2e8f0)",
          fontSize: "0.74rem",
          color: "var(--text-muted, #64748b)",
          lineHeight: "1.4"
        }}>
          💡 <strong>Hướng dẫn:</strong> Nếu cần tạm dừng để về nhà hoặc hôm sau thi tiếp, em bấm <strong>"Bảo Lưu & Thoát Ra"</strong>. Hôm sau đến lớp, giáo viên cấp <strong>Mã v2 mới</strong> để em nhập mở khóa làm tiếp đúng câu hỏi và số phút còn lại!
        </div>
      </div>
    </div>
  );
}
