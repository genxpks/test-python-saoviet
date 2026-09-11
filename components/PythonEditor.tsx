"use client";

import { useState, useEffect } from "react";
import { PracticalProblem } from "@/types";
import { PythonEngine, GradeResult } from "@/lib/pythonEngine";
import VSCodeTerminal from "./VSCodeTerminal";
import AIMarkdownRenderer from "./AIMarkdownRenderer";
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
  Sparkles,
  FileEdit,
  Lightbulb
} from "lucide-react";

interface PythonEditorProps {
  problem: PracticalProblem;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  onSubmitGrade?: (grade: GradeResult) => void;
  isExamMode?: boolean;
}

const DEFAULT_CLEAN_SLATE = "# Viết mã nguồn Python của em ở đây...\n";

export default function PythonEditor({ 
  problem, 
  initialCode, 
  onCodeChange, 
  onSubmitGrade,
  isExamMode = false
}: PythonEditorProps) {
  // Do NOT pre-fill with starter code solution; default to clean slate so student writes code by themselves
  const [code, setCode] = useState(initialCode !== undefined && initialCode !== null ? initialCode : DEFAULT_CLEAN_SLATE);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [executionTimeMs, setExecutionTimeMs] = useState(0);
  const [turtleSvg, setTurtleSvg] = useState<string | undefined>(undefined);
  const [gradeStatus, setGradeStatus] = useState<GradeResult | null>(null);

  useEffect(() => {
    setCode(initialCode !== undefined && initialCode !== null ? initialCode : DEFAULT_CLEAN_SLATE);
    setConsoleOutput("");
    setIsError(false);
    setExecutionTimeMs(0);
    setTurtleSvg(undefined);
    setGradeStatus(null);
    setAiFeedback(null);
  }, [problem.id, initialCode]);

  // AI Assistant State
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiGrading, setIsAiGrading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);
    if (onCodeChange) onCodeChange(val);
  };

  const handleLoadTemplate = () => {
    if (problem.starter_code) {
      if (confirm("Em có muốn tải khung gợi ý của bài này vào trình soạn thảo không? (Code hiện tại sẽ được thay thế)")) {
        setCode(problem.starter_code);
        if (onCodeChange) onCodeChange(problem.starter_code);
      }
    }
  };

  const handleClearCode = () => {
    if (confirm("Em có chắc chắn muốn xóa toàn bộ code để viết lại từ đầu không?")) {
      setCode(DEFAULT_CLEAN_SLATE);
      if (onCodeChange) onCodeChange(DEFAULT_CLEAN_SLATE);
    }
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

  // Trợ lý AI sửa lỗi code
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

  // Giám khảo AI Chấm Điểm Thông Minh (Chấp nhận tên hàm tự do)
  const handleGradeWithAI = async () => {
    if (!code || code.trim().length < 5) {
      alert("⚠️ Mã nguồn đang trống! Em hãy viết bài giải rồi bấm Chấm Điểm AI nhé.");
      return;
    }

    setIsAiGrading(true);
    setAiFeedback("⏳ Giám Khảo AI đang đối chiếu yêu cầu đề bài, kiểm tra logic thuật toán và chấm điểm tự do...");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "grade_code",
          prompt: "Chấm điểm bài làm của học viên. Học viên được phép đặt tên hàm tùy ý hoặc viết script, miễn là logic giải quyết đúng bài toán.",
          context: {
            problem_id: problem.id,
            problem_title: problem.title,
            problem_description: problem.description,
            student_code: code,
            solution_code: problem.solution_code
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiFeedback(data.reply);
        // Trích xuất điểm số nếu có trong phản hồi
        const scoreMatch = data.reply.match(/(\d+(?:\.\d+)?)\s*\/\s*10/);
        const parsedScore = scoreMatch ? Math.min(10, Math.max(0, parseFloat(scoreMatch[1]))) : 10;
        const isPassed = parsedScore >= 5;

        const gradeRes: GradeResult = {
          passed: isPassed,
          score: parsedScore,
          feedback: `Chấm bằng AI: ${isPassed ? "Đạt chuẩn" : "Cần sửa lại"} (${parsedScore}/10 điểm)`,
          passedTestCases: isPassed ? 4 : 2,
          totalTestCases: 4
        };
        setGradeStatus(gradeRes);
        if (onSubmitGrade) onSubmitGrade(gradeRes);
      } else {
        setAiFeedback("❌ Không thể kết nối tới Giám khảo AI: " + (data.message || ""));
      }
    } catch (e: any) {
      setAiFeedback("❌ Lỗi khi chấm điểm AI: " + e.message);
    } finally {
      setIsAiGrading(false);
    }
  };

  const handleSubmit = () => {
    const res = PythonEngine.gradeProblem(problem.id, code);
    if (isExamMode) {
      if (onSubmitGrade) onSubmitGrade(res);
      alert(`✅ Đã lưu bài làm câu ${problem.id} vào hệ thống thi.`);
    } else {
      setGradeStatus(res);
      if (onSubmitGrade) onSubmitGrade(res);
      alert(`✅ Đã nộp bài ${problem.id}!\nĐánh giá: ${res.feedback}\nĐiểm hệ thống: ${res.score}/10`);
    }
  };

  // Line numbers calculation
  const lineCount = Math.max(code.split("\n").length, 8);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="code-ide-card">
      {/* IDE Header */}
      <div className="ide-header-tab">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div className="ide-tab-pill">
            <FileCode2 size={15} />
            <span>main.py</span>
          </div>
          {!isExamMode && (
            <button
              onClick={handleLoadTemplate}
              style={{
                background: "rgba(56, 189, 248, 0.12)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                color: "#38bdf8",
                fontSize: "0.75rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "6px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: 700
              }}
              title="Tải khung hàm mẫu gợi ý (nếu cần trợ giúp)"
            >
              <Lightbulb size={12} />
              <span>Xem Gợi Ý Khung Hàm</span>
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={handleClearCode}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              fontSize: "0.75rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px"
            }}
            title="Xóa trắng để viết lại"
          >
            <Trash2 size={13} />
            <span>Làm sạch</span>
          </button>

          <div className="ide-engine-badge">
            <span>Python 3.12 Engine • Tên Hàm Tự Do</span>
          </div>
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
          placeholder="# Tự do viết code Python tại đây. Đặt tên hàm tùy ý, giải quyết đúng đề bài..."
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
            <span>{isRunning ? "Đang chạy..." : "▶️ Chạy Thử / Build (F5)"}</span>
          </button>

          {/* AI Chấm Điểm Thông Minh Button (Chỉ hiện trong chế độ ôn luyện) */}
          {!isExamMode && (
            <button
              onClick={handleGradeWithAI}
              disabled={isAiGrading}
              className="btn btn-sm"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "#ffffff",
                fontWeight: 800,
                border: "1px solid rgba(168, 85, 247, 0.5)",
                boxShadow: "0 2px 10px rgba(124, 58, 237, 0.35)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: isAiGrading ? "wait" : "pointer"
              }}
              title="Dùng AI kiểm tra tính đúng đắn của code (chấp nhận mọi cách đặt tên hàm)"
            >
              <Sparkles size={14} />
              <span>{isAiGrading ? "AI Đang Chấm..." : "🤖 Chấm Điểm Bằng AI"}</span>
            </button>
          )}

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

      {/* AI Feedback Panel (Chỉ hiển thị khi không phải phòng thi) */}
      {!isExamMode && aiFeedback && (
        <div style={{
          background: "linear-gradient(135deg, #1e1b4b, #0f172a)",
          color: "#f5d0fe",
          padding: "1rem 1.25rem",
          borderTop: "1px solid #6b21a8",
          fontSize: "0.88rem",
          lineHeight: "1.6"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800, color: "#c084fc" }}>
              <Bot size={16} />
              <span>Đánh Giá & Nhận Xét Của Giám Khảo AI:</span>
            </div>
            <button
              onClick={() => setAiFeedback(null)}
              style={{ background: "none", border: "none", color: "#e879f9", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>
          <AIMarkdownRenderer
            content={aiFeedback}
            onApplyCode={(newCode) => {
              setCode(newCode);
              if (onCodeChange) onCodeChange(newCode);
            }}
            applyButtonLabel="Áp Dụng Vào Trình Soạn Thảo"
          />
        </div>
      )}

      {/* Auto Grade Notification (Chỉ hiển thị khi không phải phòng thi) */}
      {!isExamMode && gradeStatus && (
        <div style={{
          background: gradeStatus.passed ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
          color: gradeStatus.passed ? "#34d399" : "#fca5a5",
          padding: "0.65rem 1rem",
          fontSize: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          borderTop: `1px solid ${gradeStatus.passed ? "#10b981" : "#ef4444"}`
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
