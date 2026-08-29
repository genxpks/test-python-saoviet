"use client";

import { Sparkles, Zap } from "lucide-react";

export default function HeroEyebrowBadge3D() {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.6rem",
      padding: "0.4rem 1rem",
      borderRadius: "9999px",
      background: "rgba(0, 245, 200, 0.07)",
      border: "1px solid rgba(0, 245, 200, 0.25)",
      color: "#00f5c8",
      fontSize: "0.76rem",
      fontWeight: 800,
      marginBottom: "1.4rem",
      backdropFilter: "blur(12px)",
      boxShadow: "0 0 20px rgba(0, 245, 200, 0.1)",
      letterSpacing: "0.06em",
      position: "relative"
    }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <span style={{
          display: "inline-block",
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: "#00f5c8",
          boxShadow: "0 0 10px #00f5c8",
          animation: "glowPulse 2s ease-in-out infinite"
        }} />
      </div>
      <Zap size={12} style={{ opacity: 0.8 }} />
      <span style={{ textTransform: "uppercase" }}>Nền Tảng Khảo Thí & Đào Tạo Chuẩn 2026</span>
    </div>
  );
}
