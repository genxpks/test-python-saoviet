"use client";

interface TerminalOutputConsoleProps {
  output: string;
}

export default function TerminalOutputConsole({ output }: TerminalOutputConsoleProps) {
  return (
    <div style={{
      background: "#040711",
      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
      padding: "0.85rem 1.1rem",
      fontFamily: "var(--font-mono)",
      fontSize: "0.78rem",
      color: "#10b981",
      lineHeight: "1.5"
    }}>
      <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{output}</pre>
    </div>
  );
}
