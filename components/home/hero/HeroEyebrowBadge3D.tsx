"use client";

import { Sparkles } from "lucide-react";

export default function HeroEyebrowBadge3D() {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.6rem",
      padding: "0.35rem 0.9rem",
      borderRadius: "var(--radius-full)",
      background: "rgba(37, 99, 235, 0.06)",
      border: "1px solid rgba(37, 99, 235, 0.2)",
      color: "var(--brand-primary)",
      fontSize: "0.78rem",
      fontWeight: 800,
      marginBottom: "1.2rem",
      backdropFilter: "blur(8px)",
      boxShadow: "0 2px 10px rgba(37, 99, 235, 0.08)",
      letterSpacing: "0.03em"
    }}>
      <span style={{
        display: "inline-block",
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: "#10b981",
        boxShadow: "0 0 8px #10b981"
      }} />
      <span style={{ textTransform: "uppercase" }}>Nền Tảng Khảo Thí & Đào Tạo Chuẩn 2026</span>
    </div>
  );
}
