"use client";

import { Code2, Award, Bot } from "lucide-react";

export default function HeroFeatureMicroBadges() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "0.8rem",
      paddingTop: "1.4rem",
      borderTop: "1px solid var(--border-light)"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        background: "rgba(255, 255, 255, 0.6)",
        padding: "0.6rem 0.75rem",
        borderRadius: "var(--radius-sm)",
        border: "1px solid rgba(226, 232, 240, 0.7)",
        backdropFilter: "blur(8px)"
      }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(37, 99, 235, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-primary)", flexShrink: 0 }}>
          <Code2 size={16} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.84rem", color: "var(--text-primary)" }}>120+ Câu</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>6 Archetype</div>
        </div>
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        background: "rgba(255, 255, 255, 0.6)",
        padding: "0.6rem 0.75rem",
        borderRadius: "var(--radius-sm)",
        border: "1px solid rgba(226, 232, 240, 0.7)",
        backdropFilter: "blur(8px)"
      }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(5, 150, 105, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-emerald)", flexShrink: 0 }}>
          <Award size={16} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.84rem", color: "var(--text-primary)" }}>Chứng Chỉ</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Chuẩn Sao Việt</div>
        </div>
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        background: "rgba(255, 255, 255, 0.6)",
        padding: "0.6rem 0.75rem",
        borderRadius: "var(--radius-sm)",
        border: "1px solid rgba(226, 232, 240, 0.7)",
        backdropFilter: "blur(8px)"
      }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(124, 58, 237, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-violet)", flexShrink: 0 }}>
          <Bot size={16} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.84rem", color: "var(--text-primary)" }}>Gemini AI</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Hỗ trợ 24/7</div>
        </div>
      </div>
    </div>
  );
}
