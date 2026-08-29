"use client";

import { Code2, Award, Bot } from "lucide-react";

const badges = [
  {
    icon: <Code2 size={16} />,
    iconBg: "rgba(0, 245, 200, 0.12)",
    iconColor: "#00f5c8",
    title: "120+ Câu",
    sub: "6 Archetype"
  },
  {
    icon: <Award size={16} />,
    iconBg: "rgba(59, 130, 246, 0.12)",
    iconColor: "#60a5fa",
    title: "Chứng Chỉ",
    sub: "Chuẩn Sao Việt"
  },
  {
    icon: <Bot size={16} />,
    iconBg: "rgba(139, 92, 246, 0.12)",
    iconColor: "#a78bfa",
    title: "Gemini AI",
    sub: "Hỗ trợ 24/7"
  }
];

export default function HeroFeatureMicroBadges() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "0.75rem",
      paddingTop: "1.5rem",
      borderTop: "1px solid rgba(255,255,255,0.06)"
    }}>
      {badges.map((b, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "rgba(15, 23, 42, 0.7)",
            padding: "0.65rem 0.75rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
            transition: "all 0.2s ease"
          }}
        >
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: b.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: b.iconColor,
            flexShrink: 0
          }}>
            {b.icon}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.84rem", color: "#f1f5f9" }}>{b.title}</div>
            <div style={{ fontSize: "0.69rem", color: "var(--text-muted)" }}>{b.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
