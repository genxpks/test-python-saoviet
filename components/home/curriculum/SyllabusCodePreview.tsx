"use client";

interface SyllabusCodePreviewProps {
  runtime: string;
  sampleQuestion: string;
  sampleCode: string;
  color: string;
}

export default function SyllabusCodePreview({
  runtime,
  sampleQuestion,
  sampleCode,
  color
}: SyllabusCodePreviewProps) {
  return (
    <div style={{
      background: "#070d19",
      border: "1px solid #1e293b",
      borderRadius: "var(--radius-md)",
      padding: "0.9rem 1.1rem",
      fontFamily: "var(--font-mono)",
      fontSize: "0.82rem",
      marginBottom: "1.5rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "0.72rem", marginBottom: "0.3rem" }}>
        <span># Câu hỏi trích đoạn mẫu:</span>
        <span style={{ color: color }}>{runtime}</span>
      </div>
      <div style={{ color: "#f8fafc", marginBottom: "0.4rem", fontWeight: 600 }}>
        Q: {sampleQuestion}
      </div>
      <pre style={{ margin: 0, color: "#38bdf8", overflowX: "auto" }}>
        {sampleCode}
      </pre>
    </div>
  );
}
