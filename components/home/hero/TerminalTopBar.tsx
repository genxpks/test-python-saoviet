"use client";

interface TerminalTopBarProps {
  title: string;
  activeLanguage: "python" | "cpp" | "web";
  onLanguageChange: (lang: "python" | "cpp" | "web") => void;
}

export default function TerminalTopBar({ title, activeLanguage, onLanguageChange }: TerminalTopBarProps) {
  return (
    <div style={{
      background: "#0d1527",
      padding: "0.8rem 1.25rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #1e293b"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#94a3b8", fontWeight: 600 }}>
          {title}
        </span>
      </div>

      {/* Language Switcher Tabs */}
      <div style={{ display: "flex", gap: "0.3rem", background: "rgba(15, 23, 42, 0.8)", padding: "2px", borderRadius: "6px" }}>
        {(["python", "cpp", "web"] as const).map((lang) => {
          const label = lang === "python" ? "Python" : lang === "cpp" ? "C++" : "TypeScript";
          const isActive = activeLanguage === lang;
          return (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              style={{
                background: isActive ? "var(--brand-primary)" : "transparent",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                padding: "0.2rem 0.6rem",
                fontSize: "0.72rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
