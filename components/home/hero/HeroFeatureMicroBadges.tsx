"use client";

import { Code2, Award, Bot } from "lucide-react";

export default function HeroFeatureMicroBadges() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "0.8rem",
      paddingTop: "1.5rem",
      borderTop: "1px solid var(--border-light)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(37, 99, 235, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-primary)" }}>
          <Code2 size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>120+ Câu Hỏi</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>6 Archetype chuẩn</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(5, 150, 105, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-emerald)" }}>
          <Award size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>Chứng Chỉ Vàng</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Sao Việt Cert A4</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(124, 58, 237, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-violet)" }}>
          <Bot size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>Gemini 2.0 AI</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Sư phạm tự động</div>
        </div>
      </div>
    </div>
  );
}
