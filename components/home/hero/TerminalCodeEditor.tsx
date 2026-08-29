"use client";

interface TerminalCodeEditorProps {
  code: string;
}

export default function TerminalCodeEditor({ code }: TerminalCodeEditorProps) {
  const lines = code.split("\n");

  return (
    <div style={{
      padding: "1.1rem 1.25rem",
      background: "#080e1a",
      fontFamily: "var(--font-mono)",
      fontSize: "0.84rem",
      lineHeight: "1.65",
      color: "#e2e8f0",
      overflowX: "auto"
    }}>
      <div style={{ display: "flex" }}>
        {/* Line Numbers Column */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          paddingRight: "1rem",
          marginRight: "1rem",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#475569",
          userSelect: "none",
          textAlign: "right",
          fontSize: "0.78rem"
        }}>
          {lines.map((_, idx) => (
            <span key={idx}>{idx + 1}</span>
          ))}
        </div>

        {/* Code Lines with Syntax Coloring */}
        <pre style={{ margin: 0, color: "#38bdf8", flex: 1, whiteSpace: "pre" }}>
          {code}
        </pre>
      </div>
    </div>
  );
}
