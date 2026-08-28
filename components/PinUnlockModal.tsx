"use client";

import { useState } from "react";
import { verifyTeacherPin } from "@/lib/usersData";
import { Lock, KeyRound, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";

interface PinUnlockModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PinUnlockModal({ onSuccess, onCancel }: PinUnlockModalProps) {
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyTeacherPin(pinInput)) {
      onSuccess();
    } else {
      setPinError("Mã PIN không chính xác! Vui lòng liên hệ Thầy/Cô phụ trách phòng thi.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: "rgba(245, 158, 11, 0.15)",
            color: "var(--brand-amber)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem auto"
          }}>
            <Lock size={28} />
          </div>

          <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Bài Thi Đang Được Tạm Dừng
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Toàn bộ tiến trình câu trả lời và thời gian làm bài đã được lưu an toàn.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--text-secondary)", textAlign: "center" }}>
              Nhập Mã PIN Phê Duyệt Của Giáo Viên:
            </label>
            <input
              type="password"
              className="form-input"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError("");
              }}
              placeholder="••••"
              maxLength={8}
              autoFocus
              required
              style={{
                textAlign: "center",
                fontSize: "1.6rem",
                letterSpacing: "8px",
                fontWeight: 800,
                fontFamily: "var(--font-mono)",
                height: "52px"
              }}
            />
          </div>

          {pinError && (
            <div style={{
              color: "#e11d48",
              fontSize: "0.85rem",
              marginBottom: "1.2rem",
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              padding: "0.65rem 0.9rem",
              borderRadius: "var(--radius-xs)",
              textAlign: "center"
            }}>
              {pinError}
            </div>
          )}

          <div style={{
            background: "var(--surface-subtle)",
            padding: "0.75rem",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1.2rem",
            border: "1px solid var(--border-light)",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            textAlign: "center"
          }}>
            <span>🔒 Vui lòng giơ tay gọi Thầy/Cô giám thị nhập mã PIN để mở khóa tiếp tục bài thi.</span>
          </div>

          <div style={{ display: "flex", gap: "0.65rem" }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              <ArrowLeft size={16} />
              <span>Về Trang Chủ</span>
            </button>
            <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
              <ShieldCheck size={16} />
              <span>Mở Khóa & Tiếp Tục</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
