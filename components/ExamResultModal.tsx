"use client";

import { ExamResult } from "@/types";

interface ExamResultModalProps {
  resultData: ExamResult;
  onClose: () => void;
}

export default function ExamResultModal({ resultData, onClose }: ExamResultModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-card modal-lg">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3.2rem", marginBottom: "0.4rem" }}>🎉</div>
          <h3 style={{ fontSize: "1.4rem", fontWeight: 800 }}>KẾT QUẢ BÀI THI PYTHON NÂNG CAO</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Học viên: <strong>{resultData.studentName}</strong> — Lớp: <strong>{resultData.studentClass}</strong>
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "var(--primary-light)", border: "1px solid var(--primary-border)", padding: "1rem", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", display: "block" }}>Điểm Tổng Kết</span>
            <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--primary)" }}>{resultData.totalScore} / 10</span>
          </div>

          <div style={{ background: "#f8fafc", border: "1px solid var(--border)", padding: "1rem", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block" }}>Trắc Nghiệm (50c)</span>
            <span style={{ fontSize: "1.25rem", fontWeight: 700 }}>{resultData.mcqCorrect}/50 ({resultData.mcqScore}đ)</span>
          </div>

          <div style={{ background: "#f8fafc", border: "1px solid var(--border)", padding: "1rem", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block" }}>Tự Luận Code (4c)</span>
            <span style={{ fontSize: "1.25rem", fontWeight: 700 }}>{resultData.practicalScore} / 5.0đ</span>
          </div>

          <div style={{ background: "var(--success-light)", border: "1px solid var(--success-border)", padding: "1rem", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--success-dark)", fontWeight: 700, textTransform: "uppercase", display: "block" }}>Xếp Loại</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--success-dark)" }}>{resultData.rank}</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng Bảng Điểm
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            🖨️ In Phiếu Điểm / Lưu PDF
          </button>
        </div>
      </div>
    </div>
  );
}
