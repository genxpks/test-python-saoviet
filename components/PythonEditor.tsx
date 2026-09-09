"use client";

import { useState, useEffect } from "react";
import { PracticalProblem } from "@/types";
import { PythonEngine, GradeResult } from "@/lib/pythonEngine";
import VSCodeTerminal from "./VSCodeTerminal";
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
  isExamMode?: boolean;
}

export default function PythonEditor({ 
  problem, 
  initialCode, 
  onCodeChange, 
  onSubmitGrade,
  isExamMode = false
}: PythonEditorProps) {
  const [code, setCode] = useState(initialCode || problem.starter_code || "");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [executionTimeMs, setExecutionTimeMs] = useState(0);
  const [turtleSvg, setTurtleSvg] = useState<string | undefined>(undefined);
  const [gradeStatus, setGradeStatus] = useState<GradeResult | null>(null);

  useEffect(() => {
    setCode(initialCode || problem.starter_code || "");
    setConsoleOutput("");
    setIsError(false);
    setExecutionTimeMs(0);
    setTurtleSvg(undefined);
    setGradeStatus(null);
    setAiFeedback(null);
  }, [problem.id, initialCode, problem.starter_code]);

  // AI Assistant State
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);
    if (onCodeChange) onCodeChange(val);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput("");
    const res = await PythonEngine.runCode(code);
    setConsoleOutput(res.output);
    setIsError(!res.success);
    setExecutionTimeMs(res.executionTimeMs || 0);
    setTurtleSvg(res.turtleCanvasSvg);
    setIsRunning(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRunCode();
      return;
    }
    if (e.key === "F5") {
      e.preventDefault();
      handleRunCode();
      return;
    }
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
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <button 
            className="btn btn-warning btn-sm" 
            onClick={handleRunCode} 
            disabled={isRunning}
            title="Chạy thử code trên Terminal giả lập (F5 hoặc Ctrl+Enter)"
            style={{
              background: "linear-gradient(135deg, #0284c7, #0369a1)",
              color: "#ffffff",
              fontWeight: 700,
              border: "1px solid rgba(56, 189, 248, 0.4)",
              boxShadow: "0 2px 10px rgba(2, 132, 199, 0.35)",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Play size={14} fill="#ffffff" />
            <span>{isRunning ? "Đang biên dịch & chạy..." : "▶️ Chạy Thử / Build (F5)"}</span>
          </button>

          {!isExamMode && (
            <button className="btn btn-ai btn-sm" onClick={handleAskAI} disabled={isAiLoading}>
              <Bot size={14} />
              <span>{isAiLoading ? "AI Đang Phân Tích..." : "Nhờ AI Sửa Code"}</span>
            </button>
          )}

          <span style={{ fontSize: "0.74rem", color: "#94a3b8", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            Phím tắt: <kbd style={{ background: "rgba(255,255,255,0.12)", padding: "2px 6px", borderRadius: "4px", color: "#38bdf8", fontFamily: "var(--font-mono)" }}>F5</kbd> hoặc <kbd style={{ background: "rgba(255,255,255,0.12)", padding: "2px 6px", borderRadius: "4px", color: "#38bdf8", fontFamily: "var(--font-mono)" }}>Ctrl+Enter</kbd>
          </span>
        </div>

        <button className="btn btn-success btn-sm" onClick={handleSubmit}>
          <Save size={14} />
          <span>Lưu & Nộp Bài Này</span>
        </button>
      </div>

      {/* AI Feedback Panel */}
      {!isExamMode && aiFeedback && (
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

      {/* VS Code Style Integrated Terminal */}
      <div style={{ marginTop: "1rem" }}>
        <VSCodeTerminal
          output={consoleOutput}
          isRunning={isRunning}
          isError={isError}
          executionTimeMs={executionTimeMs}
          turtleSvg={turtleSvg}
          onClear={() => {
            setConsoleOutput("");
            setIsError(false);
          }}
          onRun={handleRunCode}
        />
      </div>
    </div>
  );
}
