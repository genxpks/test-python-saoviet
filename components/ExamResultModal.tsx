"use client";

import { ExamResult } from "@/types";
import { Award, CheckCircle2, Printer, X, Sparkles, Trophy, BookCheck, Terminal } from "lucide-react";

interface ExamResultModalProps {
  resultData: ExamResult;
  onClose: () => void;
}

export default function ExamResultModal({ resultData, onClose }: ExamResultModalProps) {
  const isPassed = resultData.totalScore >= 5.0;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b"
          }}
        >
          <X size={18} />
        </button>

        {/* Certificate / Result Header */}
        <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <div style={{
            width: "64px",
            height: "64px",
            background: isPassed 
              ? "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))"
              : "linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(245, 158, 11, 0.15))",
            color: isPassed ? "var(--brand-emerald)" : "var(--brand-rose)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem auto"
          }}>
            {isPassed ? <Trophy size={32} /> : <Award size={32} />}
          </div>

          <span style={{
            fontSize: "0.76rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--brand-primary)",
            background: "var(--brand-primary-light)",
            padding: "0.25rem 0.8rem",
            borderRadius: "var(--radius-full)",
            border: "1px solid rgba(37, 99, 235, 0.2)"
          }}>
            KẾT QUẢ ĐÁNH GIÁ TỐT NGHIỆP
          </span>

          <h2 style={{ fontSize: "1.6rem", fontWeight: 900, marginTop: "0.6rem", marginBottom: "0.2rem" }}>
            BÀI THI LẬP TRÌNH PYTHON NÂNG CAO
          </h2>

          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
            Học viên: <strong style={{ color: "var(--text-primary)" }}>{resultData.studentName}</strong> • Lớp: <strong>{resultData.studentClass}</strong>
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", marginBottom: "1.8rem" }}>
          {/* Total Score */}
          <div style={{
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            border: "1px solid #bfdbfe",
            padding: "1.2rem 1rem",
            borderRadius: "var(--radius-md)",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "0.74rem", color: "var(--brand-primary)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", display: "block" }}>
              TỔNG ĐIỂM
            </span>
            <span style={{ fontSize: "2.1rem", fontWeight: 900, color: "#1e40af", fontFamily: "var(--font-heading)", lineHeight: "1.2", margin: "0.2rem 0", display: "block" }}>
              {resultData.totalScore}
            </span>
            <span style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: 700 }}>Thang 10.0</span>
          </div>

          {/* MCQ Score */}
          <div style={{
            background: "var(--surface-subtle)",
            border: "1px solid var(--border-light)",
            padding: "1.2rem 1rem",
            borderRadius: "var(--radius-md)",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block" }}>
              TRẮC NGHIỆM (50c)
            </span>
            <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", margin: "0.3rem 0", display: "block" }}>
              {resultData.mcqCorrect}/50
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--brand-primary)", fontWeight: 700 }}>{resultData.mcqScore} / 5.0đ</span>
          </div>

          {/* Practical Score */}
          <div style={{
            background: "var(--surface-subtle)",
            border: "1px solid var(--border-light)",
            padding: "1.2rem 1rem",
            borderRadius: "var(--radius-md)",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block" }}>
              TỰ LUẬN (4 bài)
            </span>
            <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", margin: "0.3rem 0", display: "block" }}>
              {resultData.practicalScore}/5.0
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--brand-emerald-dark)", fontWeight: 700 }}>Điểm code IDE</span>
          </div>

          {/* Rank */}
          <div style={{
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
            border: "1px solid #a7f3d0",
            padding: "1.2rem 1rem",
            borderRadius: "var(--radius-md)",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "0.74rem", color: "var(--brand-emerald-dark)", fontWeight: 800, textTransform: "uppercase", display: "block" }}>
              XẾP LOẠI
            </span>
            <span style={{ fontSize: "1.05rem", fontWeight: 900, color: "#065f46", margin: "0.4rem 0", display: "block", lineHeight: "1.3" }}>
              {resultData.rank}
            </span>
            <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 600 }}>{isPassed ? "Đạt Tiêu Chuẩn" : "Cần Ôn Thêm"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng Bảng Điểm
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={16} />
            <span>In Bảng Điểm / Lưu PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
