"use client";

import { useState } from "react";
import { ExamResult } from "@/types";
import { Award, Printer, X, Trophy, BookOpen, Lock, ShieldCheck } from "lucide-react";
import ExamReviewSheet from "@/components/exam/ExamReviewSheet";
import { getExamSettings } from "@/lib/usersData";

interface ExamResultModalProps {
  resultData: ExamResult;
  onClose: () => void;
}

export default function ExamResultModal({ resultData, onClose }: ExamResultModalProps) {
  const [showReview, setShowReview] = useState(false);
  const examSettings = getExamSettings();
  const allowReview = examSettings.allowReviewAnswers !== false;
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
      <div className="q-card" style={{ maxWidth: "520px", width: "100%", padding: "1.4rem 1.6rem", position: "relative" }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b"
          }}
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
          <div style={{
            width: "48px",
            height: "48px",
            background: isPassed 
              ? "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))"
              : "linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(245, 158, 11, 0.15))",
            color: isPassed ? "var(--brand-emerald)" : "var(--brand-rose)",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 0.75rem auto"
          }}>
            {isPassed ? <Trophy size={24} /> : <Award size={24} />}
          </div>

          <span style={{
            fontSize: "0.68rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--brand-primary)",
            background: "rgba(37, 99, 235, 0.08)",
            padding: "0.2rem 0.65rem",
            borderRadius: "var(--radius-full)",
            border: "1px solid rgba(37, 99, 235, 0.18)"
          }}>
            KẾT QUẢ ĐÁNH GIÁ CHUẨN ĐẦU RA
          </span>

          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginTop: "0.45rem", marginBottom: "0.15rem", letterSpacing: "-0.2px" }}>
            BÀI THI LẬP TRÌNH SAO VIỆT
          </h2>

          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", margin: "0.2rem 0 0" }}>
            Học viên: <strong style={{ color: "var(--text-primary)" }}>{resultData.userName}</strong>
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.65rem", marginBottom: "1.15rem" }}>
          <div style={{
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            border: "1px solid #bfdbfe",
            padding: "0.75rem 0.65rem",
            borderRadius: "10px",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "0.66rem", color: "var(--brand-primary)", fontWeight: 800, textTransform: "uppercase", display: "block" }}>
              TỔNG ĐIỂM
            </span>
            <span style={{ fontSize: "1.55rem", fontWeight: 900, color: "#1e40af", lineHeight: "1.2", margin: "0.15rem 0", display: "block" }}>
              {finalScore}
            </span>
            <span style={{ fontSize: "0.68rem", color: "#3b82f6", fontWeight: 700 }}>Thang 10.0</span>
          </div>

          <div style={{
            background: "var(--surface-subtle)",
            border: "1px solid var(--border-light)",
            padding: "0.75rem 0.65rem",
            borderRadius: "10px",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "0.66rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block" }}>
              TRẮC NGHIỆM ĐÚNG
            </span>
            <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", margin: "0.25rem 0", display: "block" }}>
              {resultData.correctCount || 0} câu
            </span>
            <span style={{ fontSize: "0.68rem", color: "var(--brand-primary)", fontWeight: 700 }}>Đã chấm tự động</span>
          </div>

          <div style={{
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
            border: "1px solid #a7f3d0",
            padding: "0.75rem 0.65rem",
            borderRadius: "10px",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "0.66rem", color: "var(--brand-emerald-dark)", fontWeight: 800, textTransform: "uppercase", display: "block" }}>
              XẾP LOẠI
            </span>
            <span style={{ fontSize: "0.85rem", fontWeight: 900, color: "#065f46", margin: "0.3rem 0", display: "block", lineHeight: "1.3" }}>
              {getRankName(finalScore)}
            </span>
            <span style={{ fontSize: "0.68rem", color: "#059669", fontWeight: 600 }}>{isPassed ? "Đạt Tiêu Chuẩn" : "Cần Ôn Thêm"}</span>
          </div>
        </div>

        {resultData.certificateCode && (
          <div style={{
            background: "var(--surface-subtle)",
            padding: "0.5rem 0.8rem",
            borderRadius: "8px",
            border: "1px solid var(--border-light)",
            marginBottom: "1rem",
            textAlign: "center",
            fontSize: "0.78rem"
          }}>
            <span>Mã Chứng Chỉ Tốt Nghiệp: </span>
            <code style={{ fontWeight: 800, color: "var(--brand-primary)" }}>{resultData.certificateCode}</code>
          </div>
        )}

        {/* Nút Xem Chi Tiết Đúng / Sai */}
        {allowReview ? (
          <button
            onClick={() => setShowReview(true)}
            style={{
              width: "100%",
              padding: "0.65rem 0.9rem",
              borderRadius: "10px",
              border: "1.5px solid #2563eb",
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              color: "#1d4ed8",
              fontWeight: 800,
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              marginBottom: "0.9rem",
              boxShadow: "0 2px 6px rgba(37, 99, 235, 0.12)",
              transition: "all 0.15s ease"
            }}
          >
            <BookOpen size={16} />
            <span>🔍 Xem Danh Sách Bài Làm & Kiểm Tra Đúng / Sai</span>
          </button>
        ) : (
          <div style={{
            padding: "0.55rem 0.8rem",
            borderRadius: "8px",
            background: "#f8fafc",
            border: "1px dashed #cbd5e1",
            color: "#64748b",
            fontSize: "0.76rem",
            textAlign: "center",
            marginBottom: "0.9rem"
          }}>
            🔒 Quy chế phòng thi: Chức năng xem chi tiết đáp án tạm thời được bảo mật bởi giám thị.
          </div>
        )}

        {/* Thông báo trạng thái đóng môn học nếu thi đạt */}
        {resultData.passed && (
          <div style={{
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            padding: "0.45rem 0.75rem",
            borderRadius: "8px",
            fontSize: "0.76rem",
            color: "#065f46",
            marginBottom: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <Lock size={14} color="#059669" />
            <span>Môn học đã hoàn thành và bảo lưu kết quả. Phòng thi đã được đóng lại an toàn.</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.55rem" }}>
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem" }}
          >
            Đóng Bảng Điểm
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => window.print()}
            style={{ padding: "0.45rem 0.95rem", fontSize: "0.8rem", gap: "5px" }}
          >
            <Printer size={14} />
            <span>In Bảng Điểm / PDF</span>
          </button>
        </div>
      </div>

      {showReview && (
        <ExamReviewSheet
          resultData={resultData}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  );
}
