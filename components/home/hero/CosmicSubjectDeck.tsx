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
              background: "rgba(4, 12, 32, 0.72)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1.8px solid rgba(0, 245, 200, 0.38)",
              borderRadius: "20px",
              padding: "2.4rem 1.5rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 245, 200, 0.12), inset 0 0 20px rgba(0, 245, 200, 0.04)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Top Cyan Glowing Shimmer Line */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: "2px",
              background: "linear-gradient(90deg, transparent, rgba(0, 245, 200, 0.7), transparent)",
              boxShadow: "0 0 10px rgba(0, 245, 200, 0.6)"
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
