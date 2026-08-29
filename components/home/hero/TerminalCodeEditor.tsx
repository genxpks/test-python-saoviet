"use client";

interface TerminalCodeEditorProps {
  code: string;
}

export default function TerminalCodeEditor({ code }: TerminalCodeEditorProps) {
  return (
    <div style={{
      padding: "1.25rem 1.4rem",
      maxHeight: "250px",
      overflowY: "auto",
      fontFamily: "var(--font-mono)",
      fontSize: "0.88rem",
      lineHeight: "1.6"
    }}>
      <pre style={{ margin: 0, color: "#38bdf8", overflowX: "auto" }}>
        {code}
      </pre>
    </div>
  );
}
