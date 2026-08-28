"use client";

import { useState } from "react";
import { verifyTeacherPin } from "@/lib/usersData";

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
      setPinError("Mã PIN không chính xác! Vui lòng liên hệ Thầy/Cô.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.4rem" }}>⏸️</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Bài Thi Đang Tạm Dừng</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Toàn bộ tiến trình làm bài và thời gian còn lại đã được lưu an toàn.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
              Mã PIN Phê Duyệt Của Giáo Viên:
            </label>
            <input
              type="password"
              className="form-input"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError("");
              }}
              placeholder="Nhập PIN (Mặc định: 8888)"
              autoFocus
              required
              style={{ textAlign: "center", fontSize: "1.3rem", letterSpacing: "6px", fontWeight: 700 }}
            />
          </div>

          {pinError && (
            <div style={{ color: "var(--danger)", fontSize: "0.85rem", marginBottom: "1rem", background: "var(--danger-light)", padding: "0.5rem 0.8rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--danger-border)" }}>
              {pinError}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Về Trang Chủ
            </button>
            <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
              🔓 Mở Khóa & Tiếp Tục Thi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
