"use client";

import { ExamResult } from "@/types";
import { Award, Trophy, CheckCircle2, ShieldCheck, Printer, Calendar, MapPin, Hash, QrCode } from "lucide-react";

interface CertificateCardProps {
  resultData: ExamResult;
  onPrint?: () => void;
  onClose?: () => void;
  showActions?: boolean;
}

export default function CertificateCard({
  resultData,
  onPrint,
  onClose,
  showActions = true,
}: CertificateCardProps) {
  const score = resultData.score ?? 0;

  const getRankViEn = (sc: number) => {
    if (sc >= 8.5) return { vi: "XUẤT SẮC", en: "DISTINCTION", color: "#1e3a8a", badgeColor: "#eff6ff", borderColor: "#3b82f6" };
    if (sc >= 7.0) return { vi: "GIỎI", en: "MERIT", color: "#065f46", badgeColor: "#ecfdf5", borderColor: "#10b981" };
    if (sc >= 5.0) return { vi: "ĐẠT CHUẨN", en: "PASSED", color: "#854d0e", badgeColor: "#fefce8", borderColor: "#f59e0b" };
    return { vi: "CHƯA ĐẠT", en: "RETAKE", color: "#991b1b", badgeColor: "#fef2f2", borderColor: "#ef4444" };
  };

  const rank = getRankViEn(score);
  const certCode = resultData.certificateCode || `SV-TD-${Math.floor(100000 + Math.random() * 900000)}`;
  const examDate = resultData.examDate || resultData.completedDate || "11/09/2026";
  const studentName = resultData.studentName || resultData.userName || "HỌC VIÊN SAO VIỆT";
  const branchName = resultData.branchName || "Chi Nhánh Thủ Đức - TP. Hồ Chí Minh";
  const studentClass = resultData.studentClass || "Lập Trình Python Căn Bản & Nâng Cao";
  const subjectTitle = (resultData.subjectId || "PYTHON").toUpperCase() === "PYTHON"
    ? "LẬP TRÌNH PYTHON - TRUNG TÂM TIN HỌC SAO VIỆT"
    : `MÔN HỌC: ${(resultData.subjectId || "").toUpperCase()}`;

  const handlePrintCertificate = () => {
    if (onPrint) {
      onPrint();
    } else {
      document.body.classList.add("print-certificate-only");
      window.print();
      setTimeout(() => {
        document.body.classList.remove("print-certificate-only");
      }, 1000);
    }
  };

  return (
    <div className="certificate-wrapper" style={{ width: "100%", maxWidth: "850px", margin: "0 auto" }}>
      {/* KHUNG GIẤY CHỨNG NHẬN CHUẨN A4 LANDSCAPE / PORTRAIT */}
      <div
        id="saoviet-certificate"
        className="saoviet-certificate-print"
        style={{
          background: "#fffdfa",
          border: "12px double #b45309",
          borderRadius: "8px",
          padding: "2.2rem 2.5rem",
          position: "relative",
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.12)",
          fontFamily: "'Times New Roman', Times, serif",
          color: "#1e293b",
          boxSizing: "border-box"
        }}
      >
        {/* Viền chỉ vàng bên trong */}
        <div style={{
          position: "absolute",
          inset: "8px",
          border: "1.5px solid #d97706",
          borderRadius: "4px",
          pointerEvents: "none"
        }} />

        {/* 4 Góc Hoa Văn */}
        <div style={{ position: "absolute", top: "12px", left: "12px", color: "#b45309", fontSize: "1.1rem", lineHeight: 1 }}>❖</div>
        <div style={{ position: "absolute", top: "12px", right: "12px", color: "#b45309", fontSize: "1.1rem", lineHeight: 1 }}>❖</div>
        <div style={{ position: "absolute", bottom: "12px", left: "12px", color: "#b45309", fontSize: "1.1rem", lineHeight: 1 }}>❖</div>
        <div style={{ position: "absolute", bottom: "12px", right: "12px", color: "#b45309", fontSize: "1.1rem", lineHeight: 1 }}>❖</div>

        {/* HEADER TRUNG TÂM */}
        <div style={{ textAlign: "center", marginBottom: "1.2rem", position: "relative" }}>
          <div style={{ fontSize: "0.88rem", fontWeight: 700, letterSpacing: "2px", color: "#78350f", textTransform: "uppercase" }}>
            HỆ THỐNG ĐÀO TẠO TIN HỌC SAO VIỆT
          </div>
          <div style={{ fontSize: "0.76rem", letterSpacing: "1px", color: "#92400e", textTransform: "uppercase", marginTop: "2px" }}>
            TRUNG TÂM KHẢO THÍ & ĐÁNH GIÁ CHUẨN ĐẦU RA CÔNG NGHỆ THÔNG TIN
          </div>
          <div style={{
            width: "80px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #b45309, transparent)",
            margin: "8px auto 0 auto"
          }} />
        </div>

        {/* TIÊU ĐỀ CHỨNG NHẬN */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#d97706",
            marginBottom: "0.4rem"
          }}>
            <Trophy size={28} />
          </div>
          <h1 style={{
            fontSize: "1.95rem",
            fontWeight: 900,
            color: "#1e3a8a",
            letterSpacing: "1.5px",
            margin: 0,
            textTransform: "uppercase",
            fontFamily: "Georgia, 'Times New Roman', serif"
          }}>
            GIẤY CHỨNG NHẬN KẾT QUẢ THI
          </h1>
          <div style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "3px",
            color: "#b45309",
            textTransform: "uppercase",
            marginTop: "0.25rem"
          }}>
            CERTIFICATE OF ACHIEVEMENT
          </div>
        </div>

        {/* THÔNG TIN HỌC VIÊN */}
        <div style={{ textAlign: "center", marginBottom: "1.3rem" }}>
          <div style={{ fontSize: "0.95rem", fontStyle: "italic", color: "#475569", marginBottom: "0.35rem" }}>
            Hội đồng Khảo thí chứng nhận học viên (This is to certify that):
          </div>

          <div style={{
            fontSize: "1.85rem",
            fontWeight: 900,
            color: "#0f172a",
            letterSpacing: "1px",
            textTransform: "uppercase",
            margin: "0.3rem 0",
            fontFamily: "Georgia, 'Times New Roman', serif",
            textDecoration: "underline",
            textDecorationColor: "#f59e0b",
            textUnderlineOffset: "6px"
          }}>
            {studentName}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", fontSize: "0.84rem", color: "#334155", marginTop: "0.6rem" }}>
            <span>Mã học viên / SBD: <strong>{resultData.userId}</strong></span>
            <span>•</span>
            <span>Lớp học: <strong>{studentClass}</strong></span>
            <span>•</span>
            <span>Đơn vị: <strong>{branchName}</strong></span>
          </div>
        </div>

        {/* NỘI DUNG HOÀN THÀNH */}
        <div style={{
          background: "rgba(254, 243, 199, 0.35)",
          border: "1px dashed #f59e0b",
          borderRadius: "8px",
          padding: "1rem 1.4rem",
          margin: "0 auto 1.5rem auto",
          maxWidth: "680px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "0.92rem", color: "#1e293b", lineHeight: "1.6" }}>
            Đã hoàn thành kỳ thi đánh giá năng lực & chuẩn đầu ra môn học:
          </div>
          <div style={{
            fontSize: "1.15rem",
            fontWeight: 800,
            color: "#1d4ed8",
            marginTop: "0.25rem",
            letterSpacing: "0.5px"
          }}>
            {subjectTitle}
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.8rem",
            marginTop: "0.75rem",
            paddingTop: "0.65rem",
            borderTop: "1px solid rgba(217, 119, 6, 0.25)"
          }}>
            <div>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Tổng Điểm Bài Thi: </span>
              <strong style={{ fontSize: "1.25rem", color: "#1e40af", fontFamily: "var(--font-mono, monospace)" }}>
                {score.toFixed(1)} / 10.0
              </strong>
            </div>
            <div style={{ height: "20px", width: "1px", background: "#cbd5e1" }} />
            <div>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Xếp Loại: </span>
              <span style={{
                fontSize: "0.95rem",
                fontWeight: 800,
                color: rank.color,
                background: rank.badgeColor,
                border: `1px solid ${rank.borderColor}`,
                padding: "0.15rem 0.6rem",
                borderRadius: "4px"
              }}>
                {rank.vi} ({rank.en})
              </span>
            </div>
            <div style={{ height: "20px", width: "1px", background: "#cbd5e1" }} />
            <div>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Ngày thi: </span>
              <strong style={{ fontSize: "0.88rem", color: "#0f172a" }}>{examDate}</strong>
            </div>
          </div>
        </div>

        {/* CHỮ KÝ, DẤU MỘC & MÃ XÁC THỰC */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "flex-end",
          marginTop: "1.2rem",
          paddingTop: "0.5rem"
        }}>
          {/* CỘT TRÁI: MÃ TRA CỨU & QR */}
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* QR placeholder box */}
              <div style={{
                width: "60px",
                height: "60px",
                border: "1.5px solid #0f172a",
                borderRadius: "4px",
                padding: "3px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#ffffff"
              }}>
                <QrCode size={44} color="#0f172a" />
              </div>

              <div style={{ fontSize: "0.76rem", lineHeight: "1.45", color: "#475569" }}>
                <div>Mã số chứng nhận:</div>
                <strong style={{ fontSize: "0.88rem", color: "#1e40af", fontFamily: "var(--font-mono, monospace)" }}>
                  {certCode}
                </strong>
                <div style={{ color: "#059669", fontWeight: 600 }}>
                  ✓ Đã đối soát & bảo lưu hồ sơ
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: DẤU MỘC & CHỮ KÝ */}
          <div style={{ textAlign: "center", position: "relative" }}>
            <div style={{ fontSize: "0.8rem", color: "#475569", fontStyle: "italic", marginBottom: "0.25rem" }}>
              TP. Hồ Chí Minh, ngày {examDate.split("/")[0] || "11"} tháng {examDate.split("/")[1] || "09"} năm {examDate.split("/")[2] || "2026"}
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1e293b", textTransform: "uppercase" }}>
              BAN ĐÀO TẠO & KHẢO THÍ SAO VIỆT
            </div>

            {/* Dấu mộc tròn đỏ của Tin Học Sao Việt */}
            <div style={{
              position: "relative",
              height: "75px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {/* Vòng dấu mộc đỏ SVG */}
              <div style={{
                position: "absolute",
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                border: "2.5px solid #dc2626",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#dc2626",
                opacity: 0.88,
                transform: "rotate(-12deg)",
                pointerEvents: "none",
                fontSize: "0.55rem",
                fontWeight: 900,
                textAlign: "center",
                lineHeight: "1.1",
                padding: "4px"
              }}>
                <span style={{ fontSize: "0.52rem", letterSpacing: "0.5px" }}>TIN HỌC SAO VIỆT</span>
                <span style={{ fontSize: "0.75rem", margin: "1px 0" }}>★ ĐÃ XÁC THỰC ★</span>
                <span style={{ fontSize: "0.5rem" }}>BAN KHẢO THÍ</span>
              </div>

              {/* Chữ ký mẫu */}
              <div style={{
                fontFamily: "'Brush Script MT', cursive, 'Dancing Script', cursive",
                fontSize: "1.7rem",
                color: "#1e3a8a",
                transform: "rotate(-4deg)",
                zIndex: 2,
                userSelect: "none"
              }}>
                Nguyen Van Tuan
              </div>
            </div>

            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
              ThS. Nguyễn Văn Tuấn
            </div>
            <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
              Giám đốc Hội đồng Khảo thí
            </div>
          </div>
        </div>
      </div>

      {/* ACTION TOOLBAR (ẨN KHI IN) */}
      {showActions && (
        <div className="no-print" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1.2rem",
          gap: "0.75rem",
          flexWrap: "wrap"
        }}>
          {onClose && (
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 700 }}
            >
              ← Quay Lại Bảng Điểm
            </button>
          )}

          <div style={{ display: "flex", gap: "0.6rem", marginLeft: "auto" }}>
            <button
              onClick={handlePrintCertificate}
              className="btn btn-primary"
              style={{
                padding: "0.55rem 1.25rem",
                fontSize: "0.84rem",
                fontWeight: 800,
                gap: "7px",
                background: "linear-gradient(135deg, #d97706, #b45309)",
                color: "#ffffff",
                boxShadow: "0 3px 12px rgba(217, 119, 6, 0.35)",
                border: "none",
                borderRadius: "8px"
              }}
            >
              <Printer size={16} />
              <span>IN GIẤY CHỨNG NHẬN (A4 / PDF)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
