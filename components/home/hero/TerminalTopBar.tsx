"use client";

interface TerminalTopBarProps {
  title: string;
  activeLanguage: "python" | "cpp" | "web";
  onLanguageChange: (lang: "python" | "cpp" | "web") => void;
}

export default function TerminalTopBar({ title, activeLanguage, onLanguageChange }: TerminalTopBarProps) {
  return (
    <div style={{
      background: "linear-gradient(180deg, #131d31 0%, #0c1424 100%)",
      padding: "0.75rem 1.1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      userSelect: "none"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
        </div>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.78rem",
          color: "#94a3b8",
          fontWeight: 600,
          letterSpacing: "0.02em"
        }}>
          {title}
        </span>
      </div>

      {/* Language Switcher Tabs */}
      <div style={{
        display: "flex",
        gap: "0.25rem",
        background: "rgba(15, 23, 42, 0.9)",
        padding: "3px",
        borderRadius: "6px",
        border: "1px solid rgba(255, 255, 255, 0.06)"
      }}>
        {(["python", "cpp", "web"] as const).map((lang) => {
          const label = lang === "python" ? "Python" : lang === "cpp" ? "C++" : "Web JS";
          const isActive = activeLanguage === lang;
          return (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              style={{
                background: isActive ? "var(--brand-primary)" : "transparent",
                color: isActive ? "#ffffff" : "#94a3b8",
                border: "none",
                borderRadius: "4px",
                padding: "0.2rem 0.55rem",
                fontSize: "0.72rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease"
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
