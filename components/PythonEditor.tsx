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

  // AI Assistant State
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

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

  const handleAskAI = async () => {
    setIsAiLoading(true);
    setAiFeedback("⏳ Thầy AI đang phân tích đoạn code và tìm cách tối ưu/sửa lỗi giúp em...");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "fix_code",
          prompt: "Hãy giúp em phân tích xem đoạn code này đã giải quyết đúng yêu cầu bài toán chưa, có lỗi cú pháp hay logic nào không và hướng dẫn em cách sửa từng bước.",
          context: {
            problem_title: problem.title,
            problem_description: problem.description,
            starter_code: problem.starter_code,
            student_code: code,
            solution_code: problem.solution_code
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiFeedback(data.reply);
      } else {
        setAiFeedback("❌ Không thể kết nối tới Trợ lý AI. Em thử lại nhé!");
      }
    } catch (e: any) {
      setAiFeedback("❌ Lỗi khi gửi yêu cầu tới AI: " + e.message);
    } finally {
      setIsAiLoading(false);
    }
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

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
        <button className="btn btn-warning" onClick={handleRunCode} disabled={isRunning}>
          ▶️ Chạy Thử Code (Build & Run)
        </button>
        <button
          className="btn"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)", color: "#ffffff", border: "none" }}
          onClick={handleAskAI}
          disabled={isAiLoading}
        >
          🤖 Nhờ AI Phân Tích & Sửa Code
        </button>
        <button className="btn btn-success" onClick={handleSubmit}>
          💾 Nộp Bài Tự Luận Này
        </button>
      </div>

      {/* AI Feedback Box */}
      {aiFeedback && (
        <div
          style={{
            background: "#fdf4ff",
            border: "1px solid #f0abfc",
            padding: "1rem",
            borderRadius: "8px",
            marginTop: "0.6rem",
            fontSize: "0.88rem",
            lineHeight: "1.6"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <strong style={{ color: "#86198f", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>🤖</span> Hướng Dẫn & Nhận Xét Của Thầy AI Sao Việt:
            </strong>
            <button
              onClick={() => setAiFeedback(null)}
              style={{ background: "none", border: "none", color: "#a21caf", cursor: "pointer", fontSize: "0.8rem" }}
            >
              Đóng ✕
            </button>
          </div>
          <div style={{ whiteSpace: "pre-wrap", color: "#3b0764" }}>{aiFeedback}</div>
        </div>
      )}

      {gradeStatus && (
        <div style={{ background: gradeStatus.passed ? "#ecfdf5" : "#fef2f2", border: `1px solid ${gradeStatus.passed ? "#86efac" : "#fca5a5"}`, padding: "0.6rem 0.9rem", borderRadius: "6px", fontSize: "0.85rem", marginTop: "0.4rem" }}>
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
