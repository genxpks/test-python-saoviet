"use client";

import { CheckCircle2, X } from "lucide-react";

interface SingleChoiceSimulatorProps {
  answer: number | null;
  onSelectAnswer: (idx: number) => void;
}

export default function SingleChoiceSimulator({ answer, onSelectAnswer }: SingleChoiceSimulatorProps) {
  const isCorrect = answer === 2;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
        <span className="q-badge" style={{ background: "rgba(37, 99, 235, 0.1)", color: "var(--brand-primary)" }}>
          DẠNG 1: SINGLE CHOICE
        </span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Chọn 1 đáp án chính xác nhất</span>
      </div>

      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.6rem" }}>
        Trong Python, kết quả của biểu thức <code>type(3.14)</code> là gì?
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", margin: "1.2rem 0" }}>
        {["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'double'>"].map((opt, idx) => (
          <div
            key={idx}
            onClick={() => onSelectAnswer(idx)}
            className={`option-item ${answer === idx ? "selected" : ""}`}
          >
            <div className="option-letter">{String.fromCharCode(65 + idx)}</div>
            <div style={{ flex: 1, fontSize: "0.92rem", fontWeight: 600 }}>{opt}</div>
            {answer === idx && (
              idx === 2 ? <CheckCircle2 size={18} color="#10b981" /> : <X size={18} color="#ef4444" />
            )}
          </div>
        ))}
      </div>

      {answer !== null && (
        <div style={{
          padding: "0.8rem 1rem",
          borderRadius: "var(--radius-md)",
          background: isCorrect ? "#ecfdf5" : "#fef2f2",
          border: isCorrect ? "1px solid #a7f3d0" : "1px solid #fecaca",
          color: isCorrect ? "#047857" : "#b91c1c",
          fontSize: "0.88rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem"
        }}>
          {isCorrect ? <CheckCircle2 size={18} /> : <X size={18} />}
          <span>
            {isCorrect 
              ? "Chính xác! Trong Python, số thực có dấu chấm thập phân thuộc kiểu float." 
              : "Chưa chính xác! Python không có kiểu double, số thực luôn là float. Em hãy chọn lại câu C nhé!"}
          </span>
        </div>
      )}
    </div>
  );
}
