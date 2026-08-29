"use client";

import { Code2 } from "lucide-react";

export default function CurriculumSectionHeader() {
  return (
    <div style={{ textAlign: "center", marginBottom: "2.2rem" }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "rgba(37, 99, 235, 0.08)",
        color: "var(--brand-primary)",
        padding: "0.3rem 0.85rem",
        borderRadius: "var(--radius-full)",
        fontSize: "0.8rem",
        fontWeight: 800,
        marginBottom: "0.6rem"
      }}>
        <Code2 size={14} />
        <span>DANH MỤC KHÓA HỌC CHUẨN ĐẦU RA</span>
      </div>

      <h2 style={{ fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "0.4rem" }}>
        Ma Trận Đào Tạo 4 Bộ Môn Lập Trình Trọng Điểm
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "650px", margin: "0 auto" }}>
        Chương trình biên soạn độc quyền của Tin Học Sao Việt, kết hợp bài giảng lý thuyết cô đọng và thực chiến phòng máy 100%.
      </p>
    </div>
  );
}
