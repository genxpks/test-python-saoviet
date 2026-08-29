"use client";

import { Check } from "lucide-react";

interface MultiChoiceSimulatorProps {
  answers: number[];
  onToggleAnswer: (idx: number) => void;
}

export default function MultiChoiceSimulator({ answers, onToggleAnswer }: MultiChoiceSimulatorProps) {
  const isCorrect = answers.includes(0) && answers.includes(1) && !answers.includes(2);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
        <span className="q-badge" style={{ background: "rgba(139, 92, 246, 0.1)", color: "var(--brand-violet)" }}>
          DẠNG 3: MULTIPLE CHOICE
        </span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Chọn tất cả các phương án đúng</span>
      </div>

      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.6rem" }}>
        Các phương thức nào sau đây thuộc cấu trúc dữ liệu List trong Python? (Chọn 2 đáp án)
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", margin: "1.2rem 0" }}>
        {["append(x) — Thêm phần tử vào cuối", "pop() — Xóa và lấy phần tử cuối", "push_back(x) — Thêm vào đuôi vector"].map((opt, idx) => {
          const isChecked = answers.includes(idx);
          return (
            <div
              key={idx}
              onClick={() => onToggleAnswer(idx)}
              className={`option-item ${isChecked ? "selected" : ""}`}
            >
              <div style={{
                width: "20px",
                height: "20px",
                borderRadius: "4px",
                border: isChecked ? "2px solid var(--brand-violet)" : "1.5px solid var(--border-medium)",
                background: isChecked ? "var(--brand-violet)" : "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff"
              }}>
                {isChecked && <Check size={14} />}
              </div>
              <div style={{ flex: 1, fontSize: "0.92rem" }}>{opt}</div>
            </div>
          );
        })}
      </div>

      {answers.length > 0 && (
        <div style={{
          padding: "0.8rem 1rem",
          borderRadius: "var(--radius-md)",
          background: isCorrect ? "#ecfdf5" : "#fef2f2",
          border: isCorrect ? "1px solid #a7f3d0" : "1px solid #fecaca",
          color: isCorrect ? "#047857" : "#b91c1c",
          fontSize: "0.88rem"
        }}>
          {isCorrect 
            ? "Tuyệt vời! `append` và `pop` là phương thức chuẩn của List. `push_back` là của C++ std::vector." 
            : "Em hãy chọn đúng 2 phương thức của Python List (append và pop) nhé!"}
        </div>
      )}
    </div>
  );
}
