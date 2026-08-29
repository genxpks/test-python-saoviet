"use client";

import Link from "next/link";
import { ArrowRight, Code2, Cpu, Terminal, Globe, Sparkles, CheckCircle2 } from "lucide-react";

interface SubjectCardItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  icon: any;
  color: string;
  borderGlow: string;
  href: string;
}

const COSMIC_SUBJECTS: SubjectCardItem[] = [
  {
    id: "python",
    name: "Python",
    category: "AI & Khoa Học Dữ Liệu",
    badge: "120+ Câu Hỏi",
    icon: Code2,
    color: "#00f5c8",
    borderGlow: "rgba(0, 245, 200, 0.35)",
    href: "/study?subject=python"
  },
  {
    id: "cpp",
    name: "C++",
    category: "Thuật Toán & Cấu Trúc Dữ Liệu",
    badge: "Chuẩn Quốc Tế",
    icon: Terminal,
    color: "#38bdf8",
    borderGlow: "rgba(56, 189, 248, 0.35)",
    href: "/study?subject=cpp"
  },
  {
    id: "web",
    name: "Web Development",
    category: "Fullstack • Next.js & TypeScript",
    badge: "3D Interactive",
    icon: Globe,
    color: "#a78bfa",
    borderGlow: "rgba(167, 139, 250, 0.35)",
    href: "/study?subject=web"
  }
];

export default function CosmicSubjectDeck() {
  return (
    <div style={{ marginTop: "2rem", position: "relative", zIndex: 2 }}>
      {/* Small Eyebrow Label */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "0.85rem",
        padding: "0 0.25rem"
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          fontSize: "0.82rem",
          fontWeight: 800,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em"
        }}>
          <Sparkles size={14} color="#00f5c8" />
          <span>Chọn Ngôn Ngữ Khảo Thí & Thực Chiến Ngay</span>
        </div>
        <Link
          href="/study"
          style={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "#00f5c8",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem"
          }}
        >
          <span>Xem tất cả môn</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* 3 Cosmic Subject Cards Grid (Matching User Mockup) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.25rem"
      }}>
        {COSMIC_SUBJECTS.map((item) => {
          const IconComp = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="cosmic-subject-card"
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                background: "rgba(6, 14, 36, 0.78)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1.5px solid rgba(0, 200, 180, 0.18)",
                borderRadius: "var(--radius-lg)",
                padding: "1.4rem 1.6rem",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 245, 200, 0.03)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Top Shimmer Line */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1.5px",
                background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`
              }} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: `rgba(${item.id === "python" ? "0, 245, 200" : item.id === "cpp" ? "56, 189, 248" : "167, 139, 250"}, 0.12)`,
                  border: `1px solid ${item.borderGlow}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: item.color,
                  boxShadow: `0 0 16px ${item.borderGlow}`
                }}>
                  <IconComp size={22} />
                </div>

                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: item.color,
                  background: "rgba(0, 0, 0, 0.4)",
                  border: `1px solid ${item.borderGlow}`,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "var(--radius-full)",
                  letterSpacing: "0.02em"
                }}>
                  <CheckCircle2 size={11} />
                  <span>{item.badge}</span>
                </span>
              </div>

              <h3 style={{
                fontSize: "1.35rem",
                fontWeight: 900,
                letterSpacing: "-0.4px",
                color: "#ffffff",
                marginBottom: "0.25rem",
                fontFamily: "var(--font-heading)"
              }}>
                {item.name}
              </h3>

              <p style={{
                fontSize: "0.84rem",
                color: "var(--text-muted)",
                marginBottom: "1rem",
                lineHeight: "1.4"
              }}>
                {item.category}
              </p>

              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.82rem",
                fontWeight: 800,
                color: item.color
              }}>
                <span>Vào Ôn Tập Ngay</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
