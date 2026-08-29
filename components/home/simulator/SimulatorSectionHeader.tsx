"use client";

import { Sparkles } from "lucide-react";

export default function SimulatorSectionHeader() {
  return (
    <div style={{ textAlign: "center", marginBottom: "2.2rem" }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "rgba(16, 185, 129, 0.08)",
        color: "var(--brand-emerald-dark)",
        padding: "0.3rem 0.85rem",
        borderRadius: "var(--radius-full)",
        fontSize: "0.8rem",
        fontWeight: 800,
        marginBottom: "0.6rem"
      }}>
        <Sparkles size={14} />
        <span>CÔNG NGHỆ KHẢO THÍ TƯƠNG TÁC THẾ HỆ MỚI</span>
      </div>

      <h2 style={{ fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "0.4rem" }}>
        Trải Nghiệm Trực Tiếp 6 Dạng Khảo Thí Thông Minh
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "680px", margin: "0 auto" }}>
        Vượt xa trắc nghiệm truyền thống, hệ thống thiết kế các dạng bài tương tác rèn luyện phản xạ đọc hiểu, sắp xếp dòng lệnh và ghép nối thuật toán.
      </p>
    </div>
  );
}
