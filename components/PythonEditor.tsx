"use client";

import { useState } from "react";
import { PracticalProblem } from "@/types";
import { PythonEngine, GradeResult } from "@/lib/pythonEngine";

interface PythonEditorProps {
  problem: PracticalProblem;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  onSubmitGrade?: (grade: GradeResult) => void;
}

export default function PythonEditor({ problem, initialCode, onCodeChange, onSubmitGrade }: PythonEditorProps) {
  const [code, setCode] = useState(initialCode || problem.starter_code);
  const [consoleOutput, setConsoleOutput] = useState("Sẵn sàng thực thi. Hãy bấm '▶️ Chạy Thử Code' để kiểm tra kết quả!");
  const [isRunning, setIsRunning] = useState(false);
  const [gradeStatus, setGradeStatus] = useState<GradeResult | null>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);
    if (onCodeChange) onCodeChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      if (onCodeChange) onCodeChange(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput("⏳ Đang biên dịch và thực thi Python...");
    const res = await PythonEngine.runCode(code);
    setConsoleOutput(res.output);
    setIsRunning(false);
  };

  const handleSubmit = () => {
    const res = PythonEngine.gradeProblem(problem.id, code);
    setGradeStatus(res);
    if (onSubmitGrade) onSubmitGrade(res);
    alert(`✅ Đã nộp bài ${problem.id}!\nĐánh giá tự động: ${res.feedback}\nĐiểm dự kiến: ${res.score}/10`);
  };

  return (
    <div className="code-editor-card">
      <div className="code-editor-header">
        <span>📄 Trình Soạn Thảo Python (Gõ code của em bên dưới):</span>
        <span>UTF-8 • Python 3.12 Engine</span>
      </div>

      <textarea
        className="code-textarea"
        value={code}
        onChange={handleCodeChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.4rem" }}>
        <button className="btn btn-warning" onClick={handleRunCode} disabled={isRunning}>
          ▶️ Chạy Thử Code (Build & Run)
        </button>
        <button className="btn btn-success" onClick={handleSubmit}>
          💾 Nộp Bài Tự Luận Này
        </button>
      </div>

      {gradeStatus && (
        <div style={{ background: gradeStatus.passed ? "#ecfdf5" : "#fef2f2", border: `1px solid ${gradeStatus.passed ? "#86efac" : "#fca5a5"}`, padding: "0.6rem 0.9rem", borderRadius: "6px", fontSize: "0.85rem" }}>
          <strong>Kết quả chấm:</strong> {gradeStatus.feedback} ({gradeStatus.score}/10 điểm)
        </div>
      )}

      <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, marginTop: "0.4rem" }}>
        🖥️ Cửa Sổ Console Output Giả Lập:
      </div>
      <div className="console-output-box">{consoleOutput}</div>
    </div>
  );
}
