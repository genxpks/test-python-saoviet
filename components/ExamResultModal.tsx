"use client";

import { ExamResult } from "@/types";
import { Award, Printer, X, Trophy } from "lucide-react";

interface ExamResultModalProps {
  resultData: ExamResult;
  onClose: () => void;
}

export default function ExamResultModal({ resultData, onClose }: ExamResultModalProps) {
  const finalScore = resultData.score ?? 0;
  const isPassed = resultData.passed ?? (finalScore >= 5.0);

  const getRankName = (sc: number) => {
    if (sc >= 8.5) return "Xuất Sắc (Certificate of Distinction)";
    if (sc >= 7.0) return "Giỏi (Certificate of Merit)";
    if (sc >= 5.0) return "Đạt Chuẩn (Passed)";
    return "Chưa Đạt (Retake Required)";
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.65)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div className="q-card" style={{ maxWidth: "600px", width: "100%", padding: "2.2rem", position: "relative" }}>
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
            background: "rgba(37, 99, 235, 0.1)",
            padding: "0.25rem 0.8rem",
            borderRadius: "var(--radius-full)",
            border: "1px solid rgba(37, 99, 235, 0.2)"
          }}>
            KẾT QUẢ ĐÁNH GIÁ CHUẨN ĐẦU RA
          </span>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, marginTop: "0.6rem", marginBottom: "0.2rem" }}>
            BÀI THI LẬP TRÌNH SAO VIỆT
          </h2>

          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
            Học viên: <strong style={{ color: "var(--text-primary)" }}>{resultData.userName}</strong>
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", marginBottom: "1.8rem" }}>
          <div style={{
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            border: "1px solid #bfdbfe",
            padding: "1.2rem 1rem",
            borderRadius: "var(--radius-md)",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "0.74rem", color: "var(--brand-primary)", fontWeight: 800, textTransform: "uppercase", display: "block" }}>
              TỔNG ĐIỂM
            </span>
            <span style={{ fontSize: "2.1rem", fontWeight: 900, color: "#1e40af", lineHeight: "1.2", margin: "0.2rem 0", display: "block" }}>
              {finalScore}
            </span>
            <span style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: 700 }}>Thang 10.0</span>
          </div>

          <div style={{
            background: "var(--surface-subtle)",
            border: "1px solid var(--border-light)",
            padding: "1.2rem 1rem",
            borderRadius: "var(--radius-md)",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block" }}>
              TRẮC NGHIỆM ĐÚNG
            </span>
            <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", margin: "0.3rem 0", display: "block" }}>
              {resultData.correctCount || 0} câu
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--brand-primary)", fontWeight: 700 }}>Đã chấm tự động</span>
          </div>

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
            <span style={{ fontSize: "1rem", fontWeight: 900, color: "#065f46", margin: "0.4rem 0", display: "block", lineHeight: "1.3" }}>
              {getRankName(finalScore)}
            </span>
            <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 600 }}>{isPassed ? "Đạt Tiêu Chuẩn" : "Cần Ôn Thêm"}</span>
          </div>
        </div>

        {resultData.certificateCode && (
          <div style={{
            background: "var(--surface-subtle)",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-light)",
            marginBottom: "1.5rem",
            textAlign: "center",
            fontSize: "0.85rem"
          }}>
            <span>Mã Chứng Chỉ Tốt Nghiệp: </span>
            <code style={{ fontWeight: 800, color: "var(--brand-primary)" }}>{resultData.certificateCode}</code>
          </div>
        )}

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
