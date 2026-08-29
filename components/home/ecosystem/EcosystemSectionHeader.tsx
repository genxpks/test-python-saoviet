"use client";

import { Zap } from "lucide-react";

export default function EcosystemSectionHeader() {
  return (
    <div style={{ textAlign: "center", marginBottom: "2.2rem" }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "rgba(5, 150, 105, 0.08)",
        color: "var(--brand-emerald-dark)",
        padding: "0.3rem 0.85rem",
        borderRadius: "var(--radius-full)",
        fontSize: "0.8rem",
        fontWeight: 800,
        marginBottom: "0.6rem"
      }}>
        <Zap size={14} />
        <span>HẠ TẦNG KỸ THUẬT & CÔNG NGHỆ NỀN TẢNG</span>
      </div>

      <h2 style={{ fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "0.4rem" }}>
        Hệ Sinh Thái Kỹ Thuật Số Chuẩn Doanh Nghiệp
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "650px", margin: "0 auto" }}>
        Tích hợp các công nghệ điện toán đám mây và trí tuệ nhân tạo hiện đại nhất nhằm tối ưu trải nghiệm học lập trình.
      </p>
    </div>
  );
}
