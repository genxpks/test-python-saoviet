"use client";

interface TerminalOutputConsoleProps {
  output: string;
}

export default function TerminalOutputConsole({ output }: TerminalOutputConsoleProps) {
  return (
    <div style={{
      background: "#040711",
      borderTop: "1px solid #1e293b",
      padding: "0.9rem 1.25rem",
      fontFamily: "var(--font-mono)",
      fontSize: "0.8rem",
      color: "#10b981",
      lineHeight: "1.5"
    }}>
      <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{output}</pre>
    </div>
  );
}
