"use client";

import { Award, Bot, ShieldCheck } from "lucide-react";

export default function FloatingBadgeWidgets3D() {
  return (
    <>
      {/* Floating 3D Widget 1: Sao Viet Cert Gold */}
      <div style={{
        position: "absolute",
        top: "-25px",
        right: "-20px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(226, 232, 240, 0.9)",
        borderRadius: "var(--radius-md)",
        padding: "0.6rem 1rem",
        boxShadow: "0 14px 28px rgba(15, 23, 42, 0.12)",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        zIndex: 20,
        transform: "translateZ(30px)"
      }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Award size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#0f172a" }}>Chứng Nhận Sao Việt</div>
          <div style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 700 }}>Đạt chuẩn ISO Khảo Thí</div>
        </div>
      </div>

      {/* Floating 3D Widget 2: Live AI Gemini */}
      <div style={{
        position: "absolute",
        bottom: "-20px",
        left: "-20px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(226, 232, 240, 0.9)",
        borderRadius: "var(--radius-md)",
        padding: "0.6rem 1rem",
        boxShadow: "0 14px 28px rgba(15, 23, 42, 0.12)",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        zIndex: 20,
        transform: "translateZ(30px)"
      }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bot size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#0f172a" }}>AI Sư Phạm 2.0</div>
          <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Giải thích logic tức thì</div>
        </div>
      </div>
    </>
  );
}
