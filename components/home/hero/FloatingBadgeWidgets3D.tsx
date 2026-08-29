"use client";

import { Award, Bot, Sparkles, CheckCircle2 } from "lucide-react";

export default function FloatingBadgeWidgets3D() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0.8rem",
      marginTop: "1rem"
    }}>
      {/* Docked Card 1: Sao Viet Cert Gold */}
      <div style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        borderRadius: "var(--radius-md)",
        padding: "0.75rem 0.95rem",
        boxShadow: "0 4px 16px -2px rgba(15, 23, 42, 0.06)",
        display: "flex",
        alignItems: "center",
        gap: "0.7rem"
      }}>
        <div style={{
          width: "34px",
          height: "34px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 4px 10px rgba(217, 119, 6, 0.25)"
        }}>
          <Award size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#0f172a" }}>Chứng Nhận Chuẩn Hóa</div>
          <div style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 700, display: "flex", alignItems: "center", gap: "3px" }}>
            <CheckCircle2 size={11} />
            <span>Tin Học Sao Việt Khổ A4</span>
          </div>
        </div>
      </div>

      {/* Docked Card 2: Live AI Gemini */}
      <div style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        borderRadius: "var(--radius-md)",
        padding: "0.75rem 0.95rem",
        boxShadow: "0 4px 16px -2px rgba(15, 23, 42, 0.06)",
        display: "flex",
        alignItems: "center",
        gap: "0.7rem"
      }}>
        <div style={{
          width: "34px",
          height: "34px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 4px 10px rgba(124, 58, 237, 0.25)"
        }}>
          <Bot size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#0f172a" }}>AI Sư Phạm 2.0</div>
          <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>Giải thích logic & thuật toán</div>
        </div>
      </div>
    </div>
  );
}
