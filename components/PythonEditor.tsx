"use client";

import { useState } from "react";
import { PracticalProblem } from "@/types";
import { PythonEngine, GradeResult } from "@/lib/pythonEngine";
import { 
  Play, 
  Bot, 
  Save, 
  Terminal, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  FileCode2, 
  Copy, 
  Check, 
  X,
  Sparkles
} from "lucide-react";

interface PythonEditorProps {
  problem: PracticalProblem;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  onSubmitGrade?: (grade: GradeResult) => void;
}

export default function PythonEditor({ problem, initialCode, onCodeChange, onSubmitGrade }: PythonEditorProps) {
  const [code, setCode] = useState(initialCode || problem.starter_code);
  const [consoleOutput, setConsoleOutput] = useState("Sẵn sàng thực thi. Nhấn '▶️ Chạy Thử Code' để xem kết quả...");
  const [isRunning, setIsRunning] = useState(false);
  const [gradeStatus, setGradeStatus] = useState<GradeResult | null>(null);

  // AI Assistant State
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
    setConsoleOutput("⏳ Đang biên dịch và thực thi Python 3.12 Engine...");
    const res = await PythonEngine.runCode(code);
    setConsoleOutput(res.output);
    setIsRunning(false);
  };

  const handleAskAI = async () => {
    setIsAiLoading(true);
    setAiFeedback("⏳ Thầy AI đang phân tích logic thuật toán và tìm lỗi trong code của em...");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "fix_code",
          prompt: "Hãy phân tích đoạn code Python học viên vừa viết, chỉ ra lỗi sai (nếu có), hướng dẫn cách tối ưu logic và gợi ý cách sửa từng bước.",
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
        setAiFeedback("❌ Gián đoạn kết nối tới Trợ lý AI. Em hãy thử lại nhé!");
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

  // Line numbers calculation
  const lineCount = Math.max(code.split("\n").length, 8);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="code-ide-card">
      {/* IDE Header */}
      <div className="ide-header-tab">
        <div className="ide-tab-pill">
          <FileCode2 size={15} />
          <span>main.py</span>
        </div>

        <div className="ide-engine-badge">
          <span>Python 3.12 Engine • UTF-8</span>
        </div>
      </div>

      {/* Editor & Line Numbers */}
      <div className="ide-editor-area">
        <div className="ide-line-numbers">
          {lineNumbers.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>

        <textarea
          className="ide-textarea"
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="# Viết mã nguồn Python của em tại đây..."
        />
      </div>

      {/* IDE Toolbar */}
      <div className="ide-toolbar">
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button className="btn btn-warning btn-sm" onClick={handleRunCode} disabled={isRunning}>
            <Play size={14} />
            <span>{isRunning ? "Đang chạy..." : "Chạy Thử Code"}</span>
          </button>

          <button className="btn btn-ai btn-sm" onClick={handleAskAI} disabled={isAiLoading}>
            <Bot size={14} />
            <span>{isAiLoading ? "AI Đang Phân Tích..." : "Nhờ AI Sửa Code"}</span>
          </button>
        </div>

        <button className="btn btn-success btn-sm" onClick={handleSubmit}>
          <Save size={14} />
          <span>Lưu & Nộp Bài Này</span>
        </button>
      </div>

      {/* AI Feedback Panel */}
      {aiFeedback && (
        <div style={{
          background: "linear-gradient(135deg, #2e1065, #1e1b4b)",
          color: "#f5d0fe",
          padding: "1rem 1.25rem",
          borderTop: "1px solid #6b21a8",
          fontSize: "0.88rem",
          lineHeight: "1.6"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800, color: "#f0abfc" }}>
              <Bot size={16} />
              <span>Hướng Dẫn & Nhận Xét Của Thầy AI:</span>
            </div>
            <button
              onClick={() => setAiFeedback(null)}
              style={{ background: "none", border: "none", color: "#e879f9", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>
          <div style={{ whiteSpace: "pre-wrap", color: "#fae8ff" }}>
            {aiFeedback}
          </div>
        </div>
      )}

      {/* Auto Grade Notification */}
      {gradeStatus && (
        <div style={{
          background: gradeStatus.passed ? "#064e3b" : "#4c0519",
          color: gradeStatus.passed ? "#a7f3d0" : "#fecdd3",
          padding: "0.65rem 1rem",
          fontSize: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          {gradeStatus.passed ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>
            <strong>Kết quả chấm:</strong> {gradeStatus.feedback} ({gradeStatus.score}/10 điểm)
          </span>
        </div>
      )}

      {/* Terminal Console */}
      <div className="terminal-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Terminal size={14} />
          <span>Cửa Sổ Console Output Giả Lập</span>
        </div>
        <button
          onClick={() => setConsoleOutput("Đã xóa console.")}
          style={{
            background: "none",
            border: "none",
            color: "#64748b",
            fontSize: "0.72rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "3px"
          }}
          title="Xóa output"
        >
          <Trash2 size={12} />
          <span>Xóa</span>
        </button>
      </div>

      <div className="terminal-output-box">{consoleOutput}</div>
    </div>
  );
}
