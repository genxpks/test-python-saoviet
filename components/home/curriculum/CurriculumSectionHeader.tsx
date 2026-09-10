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
        13 Ngôn Ngữ & Công Nghệ — Lộ Trình Lập Trình Đầy Đủ
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "700px", margin: "0 auto" }}>
        Từ <strong>Python, C/C++, Java, C#, PHP</strong> đến <strong>React, Next.js, Node.js, Spring Boot, Android</strong> — Sao Việt đào tạo đủ stack cho mọi định hướng nghề nghiệp trong CNTT.
      </p>
    </div>
  );
}
