"use client";

import { Sparkles } from "lucide-react";

export default function HeroEyebrowBadge3D() {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.35rem 0.95rem",
      borderRadius: "var(--radius-full)",
      background: "linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(6, 182, 212, 0.12))",
      border: "1px solid rgba(37, 99, 235, 0.25)",
      color: "var(--brand-primary)",
      fontSize: "0.82rem",
      fontWeight: 800,
      marginBottom: "1.2rem",
      boxShadow: "0 2px 12px rgba(37, 99, 235, 0.1)",
      letterSpacing: "0.02em"
    }}>
      <Sparkles size={15} />
      <span>NỀN TẢNG KHẢO THÍ & ĐÀO TẠO CHUẨN DOANH NGHIỆP 2026</span>
    </div>
  );
}
