"use client";

import Link from "next/link";

interface SubjectItem {
  id: string;
  name: string;
  href: string;
}

const MOCKUP_SUBJECTS: SubjectItem[] = [
  {
    id: "python",
    name: "Python",
    href: "/study?subject=python"
  },
  {
    id: "cpp",
    name: "C++",
    href: "/study?subject=cpp"
  },
  {
    id: "web",
    name: "Web development",
    href: "/study?subject=web"
  }
];

export default function CosmicSubjectDeck() {
  return (
    <div style={{ marginTop: "3rem", marginBottom: "3rem", position: "relative", zIndex: 2 }}>
      {/* 3 Large Cosmic Language Cards (Matching Approved Mockup) */}
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
              background: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "20px",
              padding: "2.4rem 1.5rem",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
              transition: "all 0.22s ease",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Top Shimmer Line */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: "2px",
              background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.8), transparent)"
            }} />

            {/* Language Name (Big, Bold, Clean) */}
            <span style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.5px",
              fontFamily: "var(--font-heading)",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)"
            }}>
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
