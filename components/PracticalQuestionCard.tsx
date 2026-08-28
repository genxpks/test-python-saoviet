"use client";

import { PracticalProblem } from "@/types";

interface PracticalQuestionCardProps {
  problem: PracticalProblem;
  index?: number;
}

export default function PracticalQuestionCard({ problem, index }: PracticalQuestionCardProps) {
  const pNum = index !== undefined ? index + 1 : problem.id;

  return (
    <div className="q-card">
      <div className="q-card-header">
        <span className="q-badge">💻 BÀI TOÁN THỰC HÀNH {pNum}</span>
      </div>

      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--text-main)" }}>
        {problem.title}
      </h3>
      <p style={{ color: "var(--text-muted)", marginBottom: "0.8rem", fontSize: "0.92rem" }}>
        {problem.description}
      </p>

      {/* Starter Code Preview */}
      <div style={{ background: "#0f172a", color: "#f8fafc", padding: "0.8rem 1rem", borderRadius: "var(--radius-sm)", fontFamily: "monospace", fontSize: "0.86rem", marginBottom: "0.8rem", border: "1px solid #334155" }}>
        <small style={{ color: "#94a3b8", display: "block", marginBottom: "0.3rem" }}># Khung hàm khởi tạo:</small>
        {problem.starter_code}
      </div>

      {/* Solution Code Accordion */}
      <details style={{ background: "var(--success-light)", border: "1px solid var(--success-border)", padding: "0.8rem 1rem", borderRadius: "var(--radius-sm)" }}>
        <summary style={{ cursor: "pointer", fontWeight: 700, color: "var(--success-dark)", fontSize: "0.9rem" }}>
          💡 Bấm để xem code mẫu chuẩn & giải thích thuật toán ▼
        </summary>
        <pre style={{ marginTop: "0.6rem", background: "#ffffff", border: "1px solid #cbd5e1", padding: "0.75rem", borderRadius: "var(--radius-sm)", fontFamily: "monospace", fontSize: "0.85rem", color: "#0f172a", overflowX: "auto" }}>
          {problem.solution_code}
        </pre>
      </details>
    </div>
  );
}
