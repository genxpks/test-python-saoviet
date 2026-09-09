"use client";

import { PracticalProblem } from "@/types";
import { PythonEngine, RunResult, GradeResult } from "@/lib/pythonEngine";
import VSCodeTerminal from "./VSCodeTerminal";
import { 
  Terminal, 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  FileCode2,
  Cpu,
  Bot,
  Lightbulb
} from "lucide-react";
import { useState } from "react";

interface PracticalQuestionCardProps {
  problem: PracticalProblem;
  index?: number;
}

const DEFAULT_PRACTICAL_CLEAN = "# Viết mã nguồn Python của em ở đây...\n";

export default function PracticalQuestionCard({ problem, index }: PracticalQuestionCardProps) {
  const [userCode, setUserCode] = useState(DEFAULT_PRACTICAL_CLEAN);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [executionTimeMs, setExecutionTimeMs] = useState(0);
  const [turtleSvg, setTurtleSvg] = useState<string | undefined>(undefined);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiGrading, setIsAiGrading] = useState(false);

  const pNum = index !== undefined ? index + 1 : problem.id;

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput("");
    try {
      const res: RunResult = await PythonEngine.runCode(userCode);
      setConsoleOutput(res.output);
      setIsError(!res.success);
      setExecutionTimeMs(res.executionTimeMs || 0);
      setTurtleSvg(res.turtleCanvasSvg);
    } catch (e: any) {
      setConsoleOutput("❌ Lỗi: " + e.message);
      setIsError(true);
      setExecutionTimeMs(0);
    } finally {
      setIsRunning(false);
    }
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
      const updated = userCode.substring(0, start) + "    " + userCode.substring(end);
      setUserCode(updated);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleGrade = () => {
    const res = PythonEngine.gradeProblem(problem.id, userCode);
    setGradeResult(res);
    if (!consoleOutput) {
      handleRunCode();
    }
  };

  const handleLoadTemplate = () => {
    if (problem.starter_code) {
      if (confirm("Em có muốn tải khung gợi ý của bài này vào trình soạn thảo không?")) {
        setUserCode(problem.starter_code);
      }
    }
  };

  const handleResetCode = () => {
    if (confirm("Em có chắc chắn muốn xóa trắng code để viết lại từ đầu không?")) {
      setUserCode(DEFAULT_PRACTICAL_CLEAN);
      setConsoleOutput("");
      setGradeResult(null);
      setAiFeedback(null);
    }
  };

  const handleGradeWithAI = async () => {
    if (!userCode || userCode.trim().length < 5) {
      alert("⚠️ Mã nguồn đang trống! Em hãy viết bài giải rồi bấm Chấm Điểm AI nhé.");
      return;
    }

    setIsAiGrading(true);
    setAiFeedback("⏳ Giám Khảo AI đang kiểm tra logic thuật toán và chấm điểm tự do...");

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
            student_code: userCode,
            solution_code: problem.solution_code
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiFeedback(data.reply);
        const scoreMatch = data.reply.match(/(\d+(?:\.\d+)?)\s*\/\s*10/);
        const parsedScore = scoreMatch ? Math.min(10, Math.max(0, parseFloat(scoreMatch[1]))) : 10;
        const isPassed = parsedScore >= 5;

        setGradeResult({
          passed: isPassed,
          score: parsedScore,
          feedback: `Chấm bằng AI: ${isPassed ? "Đạt chuẩn" : "Cần sửa lại"} (${parsedScore}/10đ)`,
          passedTestCases: isPassed ? 4 : 2,
          totalTestCases: 4
        });
      } else {
        setAiFeedback("❌ Lỗi kết nối Giám khảo AI: " + (data.message || ""));
      }
    } catch (e: any) {
      setAiFeedback("❌ Lỗi khi chấm điểm AI: " + e.message);
    } finally {
      setIsAiGrading(false);
    }
  };

  const handleAskAI = async () => {
    setIsAiLoading(true);
    setAiFeedback("⏳ Thầy AI đang phân tích logic thuật toán và gợi ý cách tối ưu...");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "fix_code",
          prompt: "Hãy phân tích đoạn code Python học viên vừa viết, chỉ ra lỗi sai và gợi ý cách sửa thuật toán từng bước.",
          context: {
            problem_title: problem.title,
            problem_description: problem.description,
            starter_code: problem.starter_code,
            student_code: userCode,
            solution_code: problem.solution_code
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiFeedback(data.reply);
      } else {
        setAiFeedback("💡 Gợi ý: Hãy kiểm tra kỹ tên hàm, kiểu dữ liệu trả về và các phép toán trong hàm.");
      }
    } catch (e: any) {
      setAiFeedback("💡 Gợi ý: Hãy kiểm tra kỹ logic bài toán và thụt đầu dòng (indentation 4 spaces).");
    } finally {
      setIsAiLoading(false);
    }
  };

  const lineCount = Math.max(userCode.split("\n").length, 6);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="q-card" style={{ border: "1.5px solid var(--border-light)", background: "var(--surface-card)", boxShadow: "var(--shadow-card)" }}>
      {/* Header */}
      <div className="q-card-header" style={{ marginBottom: "0.8rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            className="q-badge"
            style={{
              background: "rgba(37, 99, 235, 0.1)",
              color: "var(--brand-primary)",
              borderColor: "rgba(37, 99, 235, 0.3)",
              fontWeight: 800
            }}
          >
            <Terminal size={14} />
            <span>BÀI LUYỆN CODE #{pNum}</span>
          </span>
          <span style={{ fontSize: "0.78rem", color: "var(--brand-primary)", fontWeight: 700 }}>
            Python Web Compiler & Auto-Grader
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button
            onClick={handleResetCode}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "0.3rem 0.65rem",
              borderRadius: "6px",
              border: "1px solid var(--border-medium)",
              background: "var(--surface-subtle)",
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              cursor: "pointer"
            }}
            title="Khôi phục lại code ban đầu"
          >
            <RotateCcw size={12} />
            <span>Đặt Lại</span>
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
        {problem.title}
      </h3>

      <p style={{ color: "var(--text-secondary)", marginBottom: "1.2rem", fontSize: "0.94rem", lineHeight: "1.65" }}>
        {problem.description}
      </p>

      {/* Interactive Web IDE Editor Area */}
      <div style={{
        background: "var(--surface-card)",
        border: "1.5px solid var(--border-medium)",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
        marginBottom: "1rem"
      }}>
        {/* Editor Top Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.55rem 0.9rem",
          background: "var(--surface-subtle)",
          borderBottom: "1px solid var(--border-light)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--brand-primary)", fontSize: "0.82rem", fontWeight: 700 }}>
            <FileCode2 size={16} />
            <span>main.py</span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>(Python 3.12 Engine)</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={handleLoadTemplate}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "0.3rem 0.65rem",
                borderRadius: "6px",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                background: "rgba(56, 189, 248, 0.1)",
                color: "#38bdf8",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
              title="Tải khung gợi ý nếu cần hỗ trợ"
            >
              <Lightbulb size={13} />
              <span>Gợi Ý Khung Hàm</span>
            </button>

            <button
              onClick={handleResetCode}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "0.3rem 0.65rem",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#94a3b8",
                fontSize: "0.75rem",
                cursor: "pointer"
              }}
              title="Xóa trắng để tự code lại"
            >
              <RotateCcw size={12} />
              <span>Làm Sạch</span>
            </button>

            <button
              onClick={handleAskAI}
              disabled={isAiLoading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "0.3rem 0.7rem",
                borderRadius: "6px",
                border: "1px solid rgba(168, 85, 247, 0.4)",
                background: "rgba(168, 85, 247, 0.15)",
                color: "#c084fc",
                fontSize: "0.76rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <Bot size={13} />
              <span>{isAiLoading ? "Đang phân tích..." : "Nhờ AI Sửa Code"}</span>
            </button>
          </div>
        </div>

        {/* Code Lines & Textarea */}
        <div style={{ display: "flex", minHeight: "150px", position: "relative", background: "var(--surface-card)" }}>
          <div style={{
            padding: "0.85rem 0.5rem",
            background: "var(--surface-subtle)",
            borderRight: "1px solid var(--border-light)",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            textAlign: "right",
            userSelect: "none",
            minWidth: "38px",
            lineHeight: "1.6"
          }}>
            {lineNumbers.map(n => <div key={n}>{n}</div>)}
          </div>

          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            placeholder="# Em hãy viết code Python và ấn 'Chạy Thử' để xem kết quả..."
            style={{
              flex: 1,
              padding: "0.85rem 0.9rem",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.88rem",
              lineHeight: "1.6",
              resize: "vertical",
              minHeight: "150px"
            }}
          />
        </div>

        {/* Action Buttons Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.65rem 1rem",
          background: "var(--surface-subtle)",
          borderTop: "1px solid var(--border-light)",
          flexWrap: "wrap",
          gap: "0.6rem"
        }}>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              title="Chạy thử code trên Terminal giả lập (F5 hoặc Ctrl+Enter)"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.5rem 1.1rem",
                borderRadius: "8px",
                border: "1px solid rgba(2, 132, 199, 0.4)",
                background: "linear-gradient(135deg, #0284c7, #0369a1)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(2, 132, 199, 0.25)"
              }}
            >
              <Play size={15} fill="#ffffff" />
              <span>{isRunning ? "Đang Chạy..." : "▶️ Chạy Thử / Build (F5)"}</span>
            </button>

            <button
              onClick={handleGrade}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                background: "rgba(16, 185, 129, 0.12)",
                color: "#059669",
                fontWeight: 700,
                fontSize: "0.84rem",
                cursor: "pointer"
              }}
            >
              <CheckCircle2 size={15} />
              <span>Chấm Điểm Test Cases</span>
            </button>

            <button
              onClick={handleGradeWithAI}
              disabled={isAiGrading}
              title="Dùng AI kiểm tra tính đúng đắn của code (chấp nhận mọi cách đặt tên hàm)"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid rgba(168, 85, 247, 0.5)",
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.84rem",
                cursor: isAiGrading ? "wait" : "pointer",
                boxShadow: "0 2px 10px rgba(124, 58, 237, 0.25)"
              }}
            >
              <Sparkles size={15} />
              <span>{isAiGrading ? "AI Đang Chấm..." : "🤖 Chấm Điểm Bằng AI"}</span>
            </button>

            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              Phím tắt: <kbd style={{ background: "var(--surface-card)", border: "1px solid var(--border-medium)", padding: "2px 6px", borderRadius: "4px", color: "var(--primary)", fontFamily: "var(--font-mono)" }}>F5</kbd> hoặc <kbd style={{ background: "var(--surface-card)", border: "1px solid var(--border-medium)", padding: "2px 6px", borderRadius: "4px", color: "var(--primary)", fontFamily: "var(--font-mono)" }}>Ctrl+Enter</kbd>
            </span>
          </div>

          {gradeResult && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 0.75rem",
              borderRadius: "6px",
              background: gradeResult.passed ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
              border: `1px solid ${gradeResult.passed ? "#10b981" : "#f59e0b"}`
            }}>
              <span style={{ fontWeight: 900, color: gradeResult.passed ? "#059669" : "#d97706", fontSize: "0.85rem" }}>
                {gradeResult.passed ? `🎉 ĐẠT (${gradeResult.score}/10đ)` : `⚠️ CHƯA ĐẠT (${gradeResult.score}/10đ)`}
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-primary)" }}>
                {gradeResult.feedback}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* VS Code Style Integrated Terminal */}
      <div style={{ marginBottom: "1rem" }}>
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

      {/* AI Feedback Card */}
      {aiFeedback && (
        <div style={{
          background: "rgba(124, 58, 237, 0.08)",
          border: "1.5px solid rgba(124, 58, 237, 0.35)",
          borderRadius: "10px",
          padding: "0.9rem 1.1rem",
          marginBottom: "1rem",
          color: "var(--text-primary)",
          fontSize: "0.88rem",
          lineHeight: "1.6"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#7c3aed", fontWeight: 800, marginBottom: "0.4rem" }}>
            <Sparkles size={16} />
            <span>Thầy AI Hướng Dẫn & Đánh Giá:</span>
          </div>
          <div style={{ whiteSpace: "pre-wrap" }}>{aiFeedback}</div>
        </div>
      )}

      {/* Solution Code Accordion */}
      <div style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "10px",
        overflow: "hidden"
      }}>
        <button
          onClick={() => setShowSolution(!showSolution)}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            color: "var(--primary)",
            fontSize: "0.85rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Code2 size={16} />
            <span>Xem Code Mẫu Chuẩn & Thuật Toán Tối Ưu</span>
          </div>
          {showSolution ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showSolution && (
          <div style={{ padding: "0 1rem 1rem 1rem" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.4rem" }}>
              <button
                onClick={() => handleCopyCode(problem.solution_code)}
                style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem" }}
              >
                {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copied ? "Đã sao chép" : "Sao chép code mẫu"}</span>
              </button>
            </div>
            <pre style={{
              background: "var(--surface-subtle)",
              border: "1px solid var(--border-medium)",
              padding: "0.85rem",
              borderRadius: "8px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "#059669",
              overflowX: "auto",
              lineHeight: "1.55",
              margin: 0
            }}>
              {problem.solution_code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
