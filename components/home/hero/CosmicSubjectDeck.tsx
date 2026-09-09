"use client";

import Link from "next/link";

interface SubjectItem {
  id: string;
  name: string;
  href: string;
  accent: string;
}

const MOCKUP_SUBJECTS: SubjectItem[] = [
  {
    id: "python",
    name: "Python",
    href: "/study?subject=python",
    accent: "rgba(37, 99, 235, 0.08)"
  },
  {
    id: "cpp",
    name: "C++",
    href: "/study?subject=cpp",
    accent: "rgba(5, 150, 105, 0.08)"
  },
  {
    id: "web",
    name: "Web development",
    href: "/study?subject=web",
    accent: "rgba(124, 58, 237, 0.08)"
  }
];

export default function CosmicSubjectDeck() {
  return (
    <div style={{ marginTop: "3rem", marginBottom: "3rem", position: "relative", zIndex: 2 }}>
      {/* 3 Large Language Cards — adaptive light & dark */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem"
      }}>
        {MOCKUP_SUBJECTS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="mockup-subject-card"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              /* Adaptive background: dark mode giữ dark glass, light mode dùng white card */
              background: "var(--subject-card-bg, var(--surface-card))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1.5px solid var(--surface-glass-border)",
              borderRadius: "20px",
              padding: "2.4rem 1.5rem",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.07), 0 1px 4px rgba(0, 0, 0, 0.04)",
              transition: "all 0.22s ease",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Top Shimmer Line — xanh primary, hiển thị rõ cả 2 theme */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: "2px",
              background: "linear-gradient(90deg, transparent, var(--brand-primary), transparent)"
            }} />

            {/* Subtle background tint */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: item.accent,
              borderRadius: "inherit"
            }} />

            {/* Language Name — adaptive text color */}
            <span style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.5px",
              fontFamily: "var(--font-heading)",
              position: "relative",
              zIndex: 1
            }}>
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
