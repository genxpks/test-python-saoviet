"use client";

import { PracticalProblem } from "@/types";
import { PythonEngine, RunResult, GradeResult } from "@/lib/pythonEngine";
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
  Bot
} from "lucide-react";
import { useState } from "react";

interface PracticalQuestionCardProps {
  problem: PracticalProblem;
  index?: number;
}

export default function PracticalQuestionCard({ problem, index }: PracticalQuestionCardProps) {
  const [userCode, setUserCode] = useState(problem.starter_code || "");
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const pNum = index !== undefined ? index + 1 : problem.id;

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput("⏳ Đang biên dịch & thực thi Python 3 Engine qua web...");
    try {
      const res: RunResult = await PythonEngine.runCode(userCode);
      setConsoleOutput(res.output);
    } catch (e: any) {
      setConsoleOutput("❌ Lỗi: " + e.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleGrade = () => {
    const res = PythonEngine.gradeProblem(problem.id, userCode);
    setGradeResult(res);
    if (!consoleOutput) {
      handleRunCode();
    }
  };

  const handleResetCode = () => {
    if (confirm("Em có muốn khôi phục lại code khởi tạo ban đầu không?")) {
      setUserCode(problem.starter_code);
      setConsoleOutput("");
      setGradeResult(null);
      setAiFeedback(null);
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
    <div className="q-card" style={{ border: "1px solid rgba(0, 245, 200, 0.25)", background: "rgba(10, 18, 42, 0.75)" }}>
      {/* Header */}
      <div className="q-card-header" style={{ marginBottom: "0.8rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            className="q-badge"
            style={{
              background: "rgba(0, 245, 200, 0.12)",
              color: "#00f5c8",
              borderColor: "rgba(0, 245, 200, 0.35)",
              fontWeight: 800
            }}
          >
            <Terminal size={14} />
            <span>BÀI LUYỆN CODE #{pNum}</span>
          </span>
          <span style={{ fontSize: "0.78rem", color: "#38bdf8", fontWeight: 700 }}>
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
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#94a3b8",
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
      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.5rem", color: "#ffffff" }}>
        {problem.title}
      </h3>

      <p style={{ color: "#cbd5e1", marginBottom: "1.2rem", fontSize: "0.94rem", lineHeight: "1.65" }}>
        {problem.description}
      </p>

      {/* Interactive Web IDE Editor Area */}
      <div style={{
        background: "#040b19",
        border: "1.5px solid rgba(0, 245, 200, 0.3)",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        marginBottom: "1rem"
      }}>
        {/* Editor Top Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.55rem 0.9rem",
          background: "rgba(10, 25, 55, 0.8)",
          borderBottom: "1px solid rgba(0, 245, 200, 0.18)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#00f5c8", fontSize: "0.82rem", fontWeight: 700 }}>
            <FileCode2 size={16} />
            <span>main.py</span>
            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>(Python 3.12 Engine)</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
              <span>{isAiLoading ? "Đang phân tích..." : "Hỏi Thầy AI"}</span>
            </button>
          </div>
        </div>

        {/* Code Lines & Textarea */}
        <div style={{ display: "flex", minHeight: "150px", position: "relative", background: "#050d21" }}>
          <div style={{
            padding: "0.85rem 0.5rem",
            background: "rgba(2, 6, 18, 0.7)",
            borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#475569",
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
              color: "#38bdf8",
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
          background: "rgba(6, 15, 36, 0.95)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          flexWrap: "wrap",
          gap: "0.6rem"
        }}>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.5rem 1.1rem",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(37, 99, 235, 0.35)"
              }}
            >
              <Play size={15} fill="#ffffff" />
              <span>{isRunning ? "Đang Chạy..." : "▶️ Chạy Thử Code"}</span>
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
                background: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                fontWeight: 700,
                fontSize: "0.84rem",
                cursor: "pointer"
              }}
            >
              <CheckCircle2 size={15} />
              <span>Chấm Điểm Test Cases</span>
            </button>
          </div>

          {gradeResult && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 0.75rem",
              borderRadius: "6px",
              background: gradeResult.passed ? "rgba(16, 185, 129, 0.18)" : "rgba(245, 158, 11, 0.18)",
              border: `1px solid ${gradeResult.passed ? "#10b981" : "#f59e0b"}`
            }}>
              <span style={{ fontWeight: 900, color: gradeResult.passed ? "#10b981" : "#f59e0b", fontSize: "0.85rem" }}>
                {gradeResult.passed ? `🎉 ĐẠT (${gradeResult.score}/10đ)` : `⚠️ CHƯA ĐẠT (${gradeResult.score}/10đ)`}
              </span>
              <span style={{ fontSize: "0.78rem", color: "#e2e8f0" }}>
                {gradeResult.feedback}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Console Output */}
      {consoleOutput && (
        <div style={{
          background: "#070c18",
          border: "1px solid rgba(59, 130, 246, 0.25)",
          borderRadius: "10px",
          padding: "0.85rem 1rem",
          marginBottom: "1rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.84rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", color: "#94a3b8", fontSize: "0.74rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#38bdf8", fontWeight: 700 }}>
              <Terminal size={13} />
              KẾT QUẢ ĐẦU RA (OUTPUT CONSOLE):
            </span>
            <button
              onClick={() => setConsoleOutput("")}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "0.72rem" }}
            >
              Xóa màn hình
            </button>
          </div>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "#f8fafc", lineHeight: "1.5" }}>
            {consoleOutput}
          </pre>
        </div>
      )}

      {/* AI Feedback Card */}
      {aiFeedback && (
        <div style={{
          background: "rgba(24, 16, 48, 0.8)",
          border: "1px solid rgba(168, 85, 247, 0.35)",
          borderRadius: "10px",
          padding: "0.9rem 1.1rem",
          marginBottom: "1rem",
          color: "#e9d5ff",
          fontSize: "0.88rem",
          lineHeight: "1.6"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#c084fc", fontWeight: 800, marginBottom: "0.4rem" }}>
            <Sparkles size={16} />
            <span>Thầy AI Hướng Dẫn & Đánh Giá:</span>
          </div>
          <div style={{ whiteSpace: "pre-wrap" }}>{aiFeedback}</div>
        </div>
      )}

      {/* Solution Code Accordion */}
      <div style={{
        background: "rgba(15, 23, 42, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
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
            color: "#38bdf8",
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
                style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem" }}
              >
                {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copied ? "Đã sao chép" : "Sao chép code mẫu"}</span>
              </button>
            </div>
            <pre style={{
              background: "#040916",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              padding: "0.85rem",
              borderRadius: "8px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "#34d399",
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
