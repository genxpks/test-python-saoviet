"use client";

import { Sparkles, Bot } from "lucide-react";

export default function AiCapabilityHighlight() {
  return (
    <div style={{
      marginTop: "1.5rem",
      padding: "0.85rem 1.2rem",
      borderRadius: "var(--radius-md)",
      background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(124, 58, 237, 0.05))",
      border: "1px solid rgba(124, 58, 237, 0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "0.8rem"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Bot size={18} color="var(--brand-violet)" />
        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Trí tuệ nhân tạo Gemini 2.0 Flash được tinh chỉnh chuyên sâu theo giáo trình Tin Học Sao Việt.
        </span>
      </div>
      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--brand-violet)" }}>
        Phản hồi 0.2s • Không giới hạn
      </span>
    </div>
  );
}
