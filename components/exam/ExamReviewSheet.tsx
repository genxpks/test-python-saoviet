"use client";

import { useState } from "react";
import { ExamResult, Question, PracticalProblem } from "@/types";
import { PythonEngine, RunResult, GradeResult } from "@/lib/pythonEngine";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Code2, 
  Sparkles, 
  Printer, 
  X, 
  ArrowLeft,
  Check,
  Terminal,
  Trophy,
  Award,
  BookOpen,
  Info,
  Layers,
  Lock,
  Play,
  RotateCcw,
  FileCode,
  Bot
} from "lucide-react";
import AIMarkdownRenderer from "../AIMarkdownRenderer";

interface ExamReviewSheetProps {
  resultData: ExamResult;
  onClose: () => void;
}

type FilterType = "all" | "correct" | "incorrect" | "unattempted" | "practicals";

export default function ExamReviewSheet({ resultData, onClose }: ExamReviewSheetProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  // State cho bộ chạy build thử & chấm điểm code trực quan
  const [testCodes, setTestCodes] = useState<Record<number, string>>({});
  const [runResults, setRunResults] = useState<Record<number, RunResult>>({});
  const [isRunning, setIsRunning] = useState<Record<number, boolean>>({});
  const [gradeResults, setGradeResults] = useState<Record<number, GradeResult>>({});
  const [isGrading, setIsGrading] = useState<Record<number, boolean>>({});
  const [aiReviewFeedback, setAiReviewFeedback] = useState<Record<number, string>>({});
  const [isAiReviewing, setIsAiReviewing] = useState<Record<number, boolean>>({});

  const questions = resultData.questionsDetail || [];
  const practicals = resultData.practicalsDetail || [];
  const userAnswers = resultData.userAnswers || {};
  const userPracticalCode = resultData.userPracticalCode || {};
  const practicalResults = resultData.practicalResults || {};

  const toggleExpand = (id: number) => {
    setExpandedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };


  const expandAll = () => {
    const all: Record<number, boolean> = {};
    questions.forEach(q => { all[q.id] = true; });
    practicals.forEach(p => { all[p.id + 10000] = true; });
    setExpandedQuestions(all);
  };

  const collapseAll = () => {
    setExpandedQuestions({});
  };

  const handleAskAiReview = async (p: PracticalProblem) => {
    const currentCode = testCodes[p.id] !== undefined ? testCodes[p.id] : (userPracticalCode[p.id] || "");
    const initialGrade = practicalResults[p.id];
    setIsAiReviewing(prev => ({ ...prev, [p.id]: true }));
    setAiReviewFeedback(prev => ({ ...prev, [p.id]: "⏳ Thầy AI đang đối chiếu bài thi của em với bộ test cases và tìm lỗi cụ thể..." }));

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "review_practical",
          prompt: "Phân tích bài thi tự luận code của học sinh, chỉ ra chính xác dòng mấy bị sai hoặc thiếu so với đề bài, giải thích lý do test case bị trượt và đưa ra bản sửa hoàn chỉnh.",
          context: {
            problem_id: p.id,
            problem_title: p.title,
            problem_description: p.description,
            student_submitted_code: currentCode,
            solution_code: p.solution_code,
            initial_grade: initialGrade
          }
        })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setAiReviewFeedback(prev => ({ ...prev, [p.id]: data.reply }));
      } else {
        setAiReviewFeedback(prev => ({ ...prev, [p.id]: "❌ Không thể kết nối tới Thầy AI lúc này. Em hãy thử lại nhé!" }));
      }
    } catch (e: any) {
      setAiReviewFeedback(prev => ({ ...prev, [p.id]: "❌ Lỗi: " + e.message }));
    } finally {
      setIsAiReviewing(prev => ({ ...prev, [p.id]: false }));
    }
  };

  const handleRunCode = async (problemId: number) => {
    const code = testCodes[problemId] !== undefined ? testCodes[problemId] : (userPracticalCode[problemId] || "");
    setIsRunning(prev => ({ ...prev, [problemId]: true }));
    try {
      const res = await PythonEngine.runCode(code);
      setRunResults(prev => ({ ...prev, [problemId]: res }));
    } finally {
      setIsRunning(prev => ({ ...prev, [problemId]: false }));
    }
  };

  const handleGradeCode = (problemId: number) => {
    const code = testCodes[problemId] !== undefined ? testCodes[problemId] : (userPracticalCode[problemId] || "");
    setIsGrading(prev => ({ ...prev, [problemId]: true }));
    try {
      const grade = PythonEngine.gradeProblem(problemId, code);
      setGradeResults(prev => ({ ...prev, [problemId]: grade }));
    } finally {
      setIsGrading(prev => ({ ...prev, [problemId]: false }));
    }
  };

  const handleLoadSolution = (problemId: number, solutionCode: string) => {
    setTestCodes(prev => ({ ...prev, [problemId]: solutionCode }));
  };

  const handleResetSubmitted = (problemId: number) => {
    setTestCodes(prev => ({ ...prev, [problemId]: userPracticalCode[problemId] || "" }));
  };

  const handlePrintAll = () => {
    expandAll();
    document.body.classList.add("print-review-only");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("print-review-only");
    }, 1000);
  };

  // Helper check MCQ correctness
  const isMcqCorrect = (q: Question): boolean => {
    const uAns = userAnswers[q.id];
    if (uAns === undefined || uAns === null || uAns === "") return false;

    if (q.type === "single_choice" || q.type === "true_false" || !q.type) {
      return String(uAns) === String(q.correct_answer);
    }
    if (q.type === "multiple_choice") {
      if (Array.isArray(uAns) && Array.isArray(q.correct_answer)) {
        const sortedU = [...uAns].map(String).sort().join(",");
        const sortedC = [...q.correct_answer].map(String).sort().join(",");
        return sortedU === sortedC;
      }
      return false;
    }
    if (q.type === "fill_blank") {
      return String(uAns).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase();
    }
    if (q.type === "sequence_order") {
      if (Array.isArray(uAns) && Array.isArray(q.correct_order)) {
        return uAns.map(String).join(",") === q.correct_order.map(String).join(",");
      }
      return false;
    }
    if (q.type === "matching") {
      if (uAns && typeof uAns === "object" && Array.isArray(q.pairs)) {
        return q.pairs.every((pair: any, idx: number) => uAns[idx] === pair.right);
      }
      return false;
    }
    return false;
  };

  const isMcqAttempted = (q: Question): boolean => {
    const uAns = userAnswers[q.id];
    return uAns !== undefined && uAns !== null && uAns !== "" && (!Array.isArray(uAns) || uAns.length > 0);
  };

  // Stats calculation
  let correctMCQs = 0;
  let incorrectMCQs = 0;
  let unattemptedMCQs = 0;

  questions.forEach(q => {
    if (!isMcqAttempted(q)) {
      unattemptedMCQs++;
    } else if (isMcqCorrect(q)) {
      correctMCQs++;
    } else {
      incorrectMCQs++;
    }
  });

  const practicalPassedCount = practicals.filter(p => {
    const res = practicalResults[p.id];
    return res && res.passed;
  }).length;

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    if (filter === "all") return true;
    if (filter === "practicals") return false;
    const correct = isMcqCorrect(q);
    const attempted = isMcqAttempted(q);
    if (filter === "correct") return correct;
    if (filter === "incorrect") return attempted && !correct;
    if (filter === "unattempted") return !attempted;
    return true;
  });

  const showPracticals = filter === "all" || filter === "practicals";

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.75)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1100,
      padding: "1rem"
    }}>
      <div style={{
        background: "var(--surface-card, #ffffff)",
        borderRadius: "20px",
        border: "1.5px solid var(--border-medium, #cbd5e1)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        maxWidth: "1050px",
        width: "100%",
        maxHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* MODAL HEADER */}
        <div style={{
          padding: "0.85rem 1.25rem",
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <BookOpen size={18} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#ffffff", letterSpacing: "-0.2px" }}>
                Bảng Kiểm Tra Đúng / Sai & Giải Thích Chi Tiết
              </h2>
              <p style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.85)", margin: "0.15rem 0 0" }}>
                Học viên: <strong>{resultData.userName}</strong> • Tổng điểm: <strong>{resultData.score}/10.0</strong> ({resultData.passed ? "Đạt Chuẩn Tốt Nghiệp" : "Chưa Đạt"}) • Ngày thi: <strong>{resultData.examDate || resultData.completedDate}</strong> ({resultData.examStartTime || "N/A"} → {resultData.examEndTime || resultData.completedTime || "N/A"}) • IP mạng: <strong>{resultData.ipAddress || resultData.clientIp || "127.0.0.1"}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={handlePrintAll}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "0.35rem 0.65rem",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                fontSize: "0.76rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
              title="In toàn bộ câu hỏi, bài làm và đáp án chi tiết ra A4 / PDF"
            >
              <Printer size={13} />
              <span>In Toàn Bộ Bài Thi & Kết Quả (PDF)</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#ffffff"
              }}
              title="Đóng bảng tra cứu"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* STATUS BANNER NẾU MÔN HỌC ĐÃ ĐƯỢC TỰ ĐỘNG KHÓA */}
        {resultData.passed && (
          <div style={{
            background: "#ecfdf5",
            borderBottom: "1px solid #a7f3d0",
            padding: "0.45rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.76rem",
            color: "#065f46"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Lock size={13} color="#059669" />
              <span>
                <strong>Khóa bảo lưu kết quả:</strong> Môn học đã hoàn thành với điểm số <strong>{resultData.score}đ</strong>. Kết quả đã đồng bộ an toàn lên MongoDB Atlas.
              </span>
            </div>
            {resultData.certificateCode && (
              <span style={{ fontWeight: 800, background: "#ffffff", padding: "1px 6px", borderRadius: "5px", border: "1px solid #10b981", color: "#047857", fontSize: "0.72rem" }}>
                Chứng chỉ: {resultData.certificateCode}
              </span>
            )}
          </div>
        )}

        {/* SUMMARY STATS STRIP */}
        <div style={{
          padding: "0.65rem 1.15rem",
          background: "var(--surface-subtle, #f8fafc)",
          borderBottom: "1px solid var(--border-light, #e2e8f0)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "0.65rem"
        }}>
          <div style={{ background: "#ffffff", padding: "0.45rem 0.65rem", borderRadius: "8px", border: "1px solid #bfdbfe", textAlign: "center" }}>
            <span style={{ fontSize: "0.65rem", color: "#2563eb", fontWeight: 800, textTransform: "uppercase", display: "block" }}>TỔNG ĐIỂM</span>
            <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#1e40af" }}>{resultData.score}</span>
            <span style={{ fontSize: "0.65rem", color: "#64748b", display: "block" }}>Thang 10.0</span>
          </div>

          <div style={{ background: "#ffffff", padding: "0.45rem 0.65rem", borderRadius: "8px", border: "1px solid #a7f3d0", textAlign: "center" }}>
            <span style={{ fontSize: "0.65rem", color: "#059669", fontWeight: 800, textTransform: "uppercase", display: "block" }}>CÂU ĐÚNG</span>
            <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#047857" }}>{correctMCQs}</span>
            <span style={{ fontSize: "0.65rem", color: "#059669", display: "block" }}>+{(correctMCQs * 0.14).toFixed(2)}đ TN</span>
          </div>

          <div style={{ background: "#ffffff", padding: "0.45rem 0.65rem", borderRadius: "8px", border: "1px solid #fecaca", textAlign: "center" }}>
            <span style={{ fontSize: "0.65rem", color: "#dc2626", fontWeight: 800, textTransform: "uppercase", display: "block" }}>CÂU SAI</span>
            <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#b91c1c" }}>{incorrectMCQs}</span>
            <span style={{ fontSize: "0.65rem", color: "#dc2626", display: "block" }}>Cần ôn lại</span>
          </div>

          <div style={{ background: "#ffffff", padding: "0.45rem 0.65rem", borderRadius: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
            <span style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 800, textTransform: "uppercase", display: "block" }}>BỎ QUA / CHƯA LÀM</span>
            <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#475569" }}>{unattemptedMCQs}</span>
            <span style={{ fontSize: "0.65rem", color: "#94a3b8", display: "block" }}>0 điểm</span>
          </div>

          <div style={{ background: "#ffffff", padding: "0.45rem 0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1", textAlign: "center" }}>
            <span style={{ fontSize: "0.65rem", color: "#0284c7", fontWeight: 800, textTransform: "uppercase", display: "block" }}>CODE THỰC HÀNH</span>
            <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0369a1" }}>{practicalPassedCount} / 4</span>
            <span style={{ fontSize: "0.65rem", color: "#0284c7", display: "block" }}>+{(practicalPassedCount * 0.75).toFixed(2)}đ tự luận</span>
          </div>
        </div>

        {/* FILTER TOOLBAR & EXPAND ALL BUTTONS */}
        <div style={{
          padding: "0.55rem 1.15rem",
          background: "#ffffff",
          borderBottom: "1px solid var(--border-light, #e2e8f0)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}>
          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                padding: "0.3rem 0.65rem",
                borderRadius: "6px",
                border: filter === "all" ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                background: filter === "all" ? "#eff6ff" : "#ffffff",
                color: filter === "all" ? "#1d4ed8" : "#475569",
                fontWeight: 700,
                fontSize: "0.74rem",
                cursor: "pointer"
              }}
            >
              Tất Cả ({questions.length + practicals.length})
            </button>

            <button
              onClick={() => setFilter("correct")}
              style={{
                padding: "0.3rem 0.65rem",
                borderRadius: "6px",
                border: filter === "correct" ? "1.5px solid #059669" : "1px solid #cbd5e1",
                background: filter === "correct" ? "#ecfdf5" : "#ffffff",
                color: filter === "correct" ? "#047857" : "#475569",
                fontWeight: 700,
                fontSize: "0.74rem",
                cursor: "pointer"
              }}
            >
              ✅ Đúng ({correctMCQs})
            </button>

            <button
              onClick={() => setFilter("incorrect")}
              style={{
                padding: "0.3rem 0.65rem",
                borderRadius: "6px",
                border: filter === "incorrect" ? "1.5px solid #dc2626" : "1px solid #cbd5e1",
                background: filter === "incorrect" ? "#fef2f2" : "#ffffff",
                color: filter === "incorrect" ? "#b91c1c" : "#475569",
                fontWeight: 700,
                fontSize: "0.74rem",
                cursor: "pointer"
              }}
            >
              ❌ Sai ({incorrectMCQs})
            </button>

            <button
              onClick={() => setFilter("unattempted")}
              style={{
                padding: "0.3rem 0.65rem",
                borderRadius: "6px",
                border: filter === "unattempted" ? "1.5px solid #64748b" : "1px solid #cbd5e1",
                background: filter === "unattempted" ? "#f1f5f9" : "#ffffff",
                color: filter === "unattempted" ? "#334155" : "#64748b",
                fontWeight: 700,
                fontSize: "0.74rem",
                cursor: "pointer"
              }}
            >
              ⚪ Chưa Làm ({unattemptedMCQs})
            </button>

            <button
              onClick={() => setFilter("practicals")}
              style={{
                padding: "0.3rem 0.65rem",
                borderRadius: "6px",
                border: filter === "practicals" ? "1.5px solid #0284c7" : "1px solid #cbd5e1",
                background: filter === "practicals" ? "#f0f9ff" : "#ffffff",
                color: filter === "practicals" ? "#0369a1" : "#475569",
                fontWeight: 700,
                fontSize: "0.74rem",
                cursor: "pointer"
              }}
            >
              💻 Code Thực Hành ({practicals.length})
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.35rem" }}>
            <button
              onClick={expandAll}
              style={{
                padding: "0.28rem 0.55rem",
                borderRadius: "5px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#334155",
                fontSize: "0.72rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Mở Tất Cả Chi Tiết
            </button>
            <button
              onClick={collapseAll}
              style={{
                padding: "0.28rem 0.55rem",
                borderRadius: "5px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#334155",
                fontSize: "0.72rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Thu Gọn
            </button>
          </div>
        </div>

        {/* SCROLLABLE QUESTION LIST */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.85rem 1.15rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {/* PHẦN 1: CÂU TRẮC NGHIỆM */}
          {filteredQuestions.map((q, idx) => {
            const correct = isMcqCorrect(q);
            const attempted = isMcqAttempted(q);
            const isExpanded = !!expandedQuestions[q.id];
            const uAns = userAnswers[q.id];

            return (
              <div
                key={q.id}
                style={{
                  border: correct ? "1.5px solid #a7f3d0" : attempted ? "1.5px solid #fecaca" : "1px solid #e2e8f0",
                  background: correct ? "#f0fdf4" : attempted ? "#fef2f2" : "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "all 0.15s ease"
                }}
              >
                {/* QUESTION ROW SUMMARY */}
                <div
                  onClick={() => toggleExpand(q.id)}
                  style={{
                    padding: "0.55rem 0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.75rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", flex: 1 }}>
                    <div style={{ marginTop: "2px" }}>
                      {correct ? (
                        <CheckCircle2 size={16} color="#059669" />
                      ) : attempted ? (
                        <XCircle size={16} color="#dc2626" />
                      ) : (
                        <AlertCircle size={16} color="#94a3b8" />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.76rem", color: "#1e293b" }}>
                          Câu #{idx + 1}
                        </span>
                        <span style={{ fontSize: "0.66rem", padding: "1px 5px", borderRadius: "4px", background: "#e2e8f0", color: "#475569", fontWeight: 700 }}>
                          {q.type_name || q.type}
                        </span>
                        <span style={{
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          padding: "1px 5px",
                          borderRadius: "4px",
                          background: correct ? "#dcfce7" : attempted ? "#fee2e2" : "#f1f5f9",
                          color: correct ? "#15803d" : attempted ? "#b91c1c" : "#64748b"
                        }}>
                          {correct ? "+0.14đ (Đúng)" : attempted ? "0đ (Sai)" : "0đ (Chưa làm)"}
                        </span>
                      </div>

                      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.4 }}>
                        {q.question}
                      </div>

                      {/* Summary text of answers */}
                      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.3rem", fontSize: "0.74rem", flexWrap: "wrap" }}>
                        <span>
                          Bạn chọn:{" "}
                          <strong style={{ color: correct ? "#15803d" : attempted ? "#b91c1c" : "#64748b" }}>
                            {attempted ? JSON.stringify(uAns) : "(Bỏ trống)"}
                          </strong>
                        </span>
                        {!correct && (
                          <span>
                            Đáp án đúng: <strong style={{ color: "#15803d" }}>{JSON.stringify(q.correct_answer)}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleExpand(q.id); }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "3px 6px",
                      borderRadius: "5px"
                    }}
                  >
                    <span>{isExpanded ? "Thu gọn" : "Chi tiết"}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* EXPANDED ACCORDION: FULL OPTIONS & LOGIC EXPLANATION */}
                {isExpanded && (
                  <div style={{
                    padding: "0.75rem 0.95rem",
                    borderTop: "1px solid #e2e8f0",
                    background: "#ffffff"
                  }}>
                    {/* Code snippet if question has it */}
                    {q.code && (
                      <div style={{
                        background: "#0f172a",
                        color: "#38bdf8",
                        padding: "0.65rem 0.8rem",
                        borderRadius: "6px",
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "0.78rem",
                        marginBottom: "0.65rem",
                        overflowX: "auto"
                      }}>
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{q.code}</pre>
                      </div>
                    )}

                    {/* Options Breakdown */}
                    {q.options && q.options.length > 0 && (
                      <div style={{ marginBottom: "0.7rem" }}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                          CÁC PHƯƠNG ÁN LỰA CHỌN:
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          {q.options.map((opt, oIdx) => {
                            const optLetter = String.fromCharCode(65 + oIdx);
                            const isUserPick = String(uAns) === opt || String(uAns) === String(oIdx) || String(uAns) === optLetter;
                            const isAnswer = String(q.correct_answer) === opt || String(q.correct_answer) === String(oIdx) || String(q.correct_answer) === optLetter;

                            return (
                              <div
                                key={oIdx}
                                style={{
                                  padding: "0.38rem 0.65rem",
                                  borderRadius: "6px",
                                  fontSize: "0.78rem",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "7px",
                                  border: isAnswer ? "1.5px solid #10b981" : isUserPick ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                                  background: isAnswer ? "#ecfdf5" : isUserPick ? "#fef2f2" : "#f8fafc"
                                }}
                              >
                                <span style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.7rem",
                                  fontWeight: 800,
                                  background: isAnswer ? "#059669" : isUserPick ? "#dc2626" : "#cbd5e1",
                                  color: "#ffffff"
                                }}>
                                  {optLetter}
                                </span>
                                <span style={{ flex: 1, color: isAnswer ? "#065f46" : isUserPick ? "#991b1b" : "#334155", fontWeight: isAnswer || isUserPick ? 700 : 500 }}>
                                  {opt}
                                </span>
                                {isAnswer && (
                                  <span style={{ fontSize: "0.68rem", color: "#059669", fontWeight: 800, display: "flex", alignItems: "center", gap: "3px" }}>
                                    <Check size={12} /> Đáp án đúng
                                  </span>
                                )}
                                {isUserPick && !isAnswer && (
                                  <span style={{ fontSize: "0.68rem", color: "#dc2626", fontWeight: 800 }}>
                                    Bạn đã chọn (Sai)
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Sequence Order Breakdown */}
                    {q.type === "sequence_order" && q.items && (
                      <div style={{ marginBottom: "0.7rem" }}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                          ĐỐI CHIẾU THỨ TỰ CÁC DÒNG LỆNH:
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.5rem" }}>
                          {/* Thứ tự học viên đã chọn */}
                          <div style={{ background: correct ? "#ecfdf5" : "#fef2f2", border: correct ? "1px solid #10b981" : "1px solid #ef4444", borderRadius: "6px", padding: "0.45rem 0.65rem" }}>
                            <div style={{ fontSize: "0.7rem", fontWeight: 800, color: correct ? "#065f46" : "#991b1b", marginBottom: "0.3rem" }}>
                              {correct ? "✅ Thứ tự bạn đã xếp (Chính xác):" : "❌ Thứ tự bạn đã xếp (Chưa đúng):"}
                            </div>
                            {Array.isArray(uAns) && uAns.length > 0 ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontFamily: "var(--font-mono)", fontSize: "0.74rem" }}>
                                {uAns.map((itIdx: number, pos: number) => {
                                  const isPosCorrect = Array.isArray(q.correct_order) && itIdx === q.correct_order[pos];
                                  return (
                                    <div key={pos} style={{ padding: "0.2rem 0.4rem", borderRadius: "4px", background: isPosCorrect ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.12)", color: isPosCorrect ? "#065f46" : "#991b1b" }}>
                                      #{pos + 1}: {q.items![itIdx]}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div style={{ fontSize: "0.72rem", color: "#64748b", fontStyle: "italic" }}>Chưa xếp thứ tự</div>
                            )}
                          </div>

                          {/* Thứ tự chuẩn xác */}
                          {Array.isArray(q.correct_order) && (
                            <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.45rem 0.65rem" }}>
                              <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#059669", marginBottom: "0.3rem" }}>
                                💡 Thứ tự đúng chuẩn:
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontFamily: "var(--font-mono)", fontSize: "0.74rem" }}>
                                {q.correct_order.map((itIdx: number, pos: number) => (
                                  <div key={pos} style={{ padding: "0.2rem 0.4rem", borderRadius: "4px", background: "rgba(16, 185, 129, 0.08)", color: "#065f46" }}>
                                    #{pos + 1}: {q.items![itIdx]}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Matching Pairs Breakdown */}
                    {q.type === "matching" && Array.isArray(q.pairs) && (
                      <div style={{ marginBottom: "0.7rem" }}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                          KẾT QUẢ NỐI CẶP:
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                          {q.pairs.map((p, pIdx) => {
                            const userMatch = uAns && typeof uAns === "object" ? uAns[p.left] || uAns[pIdx] : "";
                            const isPairCorrect = userMatch === p.right;
                            return (
                              <div key={pIdx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.35rem 0.65rem", borderRadius: "6px", fontSize: "0.75rem", background: isPairCorrect ? "#ecfdf5" : "#fef2f2", border: isPairCorrect ? "1px solid #10b981" : "1px solid #ef4444" }}>
                                <span><strong>{p.left}</strong> ➔ <em>{p.right}</em></span>
                                <span style={{ fontWeight: 800, color: isPairCorrect ? "#059669" : "#dc2626" }}>
                                  {isPairCorrect ? "✓ Đúng" : `Sai (Bạn chọn: ${userMatch || "Bỏ trống"})`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Logic Explanation Box */}
                    {q.explanation && (
                      <div style={{
                        background: "#f0fdf4",
                        border: "1px solid #86efac",
                        borderRadius: "7px",
                        padding: "0.55rem 0.75rem",
                        color: "#166534",
                        fontSize: "0.78rem"
                      }}>
                        <div style={{ fontWeight: 800, display: "flex", alignItems: "center", gap: "5px", marginBottom: "0.25rem" }}>
                          <Sparkles size={13} color="#15803d" />
                          <span>Giải Thích Logic Chuẩn Xác:</span>
                        </div>
                        <div style={{ lineHeight: 1.5 }}>
                          {q.explanation}
                        </div>
                      </div>
                    )}

                    {/* Option Explanations */}
                    {q.option_explanations && Object.keys(q.option_explanations).length > 0 && (
                      <div style={{ marginTop: "0.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "7px", padding: "0.5rem 0.7rem", fontSize: "0.74rem" }}>
                        <div style={{ fontWeight: 800, color: "#475569", marginBottom: "0.25rem" }}>Phân tích từng phương án:</div>
                        {Object.entries(q.option_explanations).map(([optKey, expText]) => (
                          <div key={optKey} style={{ marginBottom: "0.15rem", color: "#334155" }}>
                            <strong>{optKey}:</strong> {expText}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* PHẦN 2: BÀI THỰC HÀNH CODE TỰ LUẬN (4 BÀI) */}
          {showPracticals && practicals.length > 0 && (
            <div style={{ marginTop: "0.75rem" }}>
              <div style={{
                fontSize: "0.88rem",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: "0.6rem",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                <Code2 size={16} color="#2563eb" />
                <span>Phần 2: 4 Bài Tự Luận & Thực Hành Viết Code Python</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {practicals.map((p, pIdx) => {
                  const pRes = practicalResults[p.id];
                  const passed = pRes && pRes.passed;
                  const codeSubmitted = userPracticalCode[p.id] || "";
                  const isExpanded = !!expandedQuestions[p.id + 10000];

                  return (
                    <div
                      key={p.id}
                      style={{
                        border: passed ? "1.5px solid #a7f3d0" : "1.5px solid #cbd5e1",
                        background: passed ? "#f0fdf4" : "#ffffff",
                        borderRadius: "10px",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        onClick={() => toggleExpand(p.id + 10000)}
                        style={{
                          padding: "0.55rem 0.85rem",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "7px",
                            background: passed ? "#ecfdf5" : "#f1f5f9",
                            color: passed ? "#059669" : "#64748b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            <Terminal size={15} />
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                              <span style={{ fontWeight: 800, fontSize: "0.76rem", color: "#1e293b" }}>
                                Tự Luận #{pIdx + 1}:
                              </span>
                              <span style={{
                                fontSize: "0.68rem",
                                fontWeight: 800,
                                padding: "1px 5px",
                                borderRadius: "4px",
                                background: passed ? "#dcfce7" : "#fee2e2",
                                color: passed ? "#15803d" : "#b91c1c"
                              }}>
                                {passed ? "+0.75đ (ĐẠT CHUẨN)" : "0đ (CHƯA ĐẠT / LỖI TEST CASE)"}
                              </span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: "0.84rem", color: "#0f172a", marginTop: "1px" }}>
                              {p.title}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}>
                          <span>{isExpanded ? "Thu gọn" : "Xem code & test cases"}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={{ padding: "0.85rem 1rem", borderTop: "1px solid #e2e8f0", background: "#ffffff" }}>
                          <p style={{ fontSize: "0.82rem", color: "#334155", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                            {p.description}
                          </p>

                          {/* KHU VỰC CODE EDITOR TƯƠNG TÁC (CHẠY THỬ & CHẤM ĐIỂM) */}
                          <div style={{
                            background: "#0f172a",
                            borderRadius: "8px",
                            border: "1px solid #1e293b",
                            overflow: "hidden",
                            marginBottom: "0.75rem"
                          }}>
                            {/* Editor Top Toolbar */}
                            <div style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "0.45rem 0.8rem",
                              background: "#1e293b",
                              borderBottom: "1px solid #334155",
                              flexWrap: "wrap",
                              gap: "0.4rem"
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "0.74rem", fontWeight: 800 }}>
                                <FileCode size={14} />
                                <span>TRÌNH SOẠN THẢO & BIÊN DỊCH PYTHON:</span>
                              </div>

                              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                <button
                                  type="button"
                                  disabled={isAiReviewing[p.id]}
                                  onClick={() => handleAskAiReview(p)}
                                  className="btn btn-sm"
                                  style={{
                                    padding: "0.2rem 0.6rem",
                                    fontSize: "0.7rem",
                                    fontWeight: 800,
                                    borderRadius: "5px",
                                    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                                    color: "#ffffff",
                                    border: "1px solid rgba(168, 85, 247, 0.4)",
                                    boxShadow: "0 2px 8px rgba(124, 58, 237, 0.3)",
                                    cursor: isAiReviewing[p.id] ? "wait" : "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px"
                                  }}
                                  title="Nhờ Thầy AI phân tích bài thi, chỉ ra dòng nào sai và gợi ý sửa"
                                >
                                  <Sparkles size={11} />
                                  <span>{isAiReviewing[p.id] ? "AI Đang Phân Tích..." : "🤖 Thầy AI Chỉ Chỗ Sửa"}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleLoadSolution(p.id, p.solution_code)}
                                  className="btn btn-sm"
                                  style={{
                                    padding: "0.2rem 0.55rem",
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    borderRadius: "5px",
                                    background: "rgba(52, 211, 153, 0.15)",
                                    color: "#34d399",
                                    border: "1px solid rgba(52, 211, 153, 0.3)",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "3px"
                                  }}
                                  title="Nạp code mẫu chuẩn vào ô biên dịch để chạy thử"
                                >
                                  <Sparkles size={11} />
                                  <span>Thử Code Mẫu</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleResetSubmitted(p.id)}
                                  className="btn btn-sm"
                                  style={{
                                    padding: "0.2rem 0.55rem",
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    borderRadius: "5px",
                                    background: "rgba(148, 163, 184, 0.15)",
                                    color: "#cbd5e1",
                                    border: "1px solid rgba(148, 163, 184, 0.3)",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "3px"
                                  }}
                                  title="Khôi phục lại code học viên đã nộp lúc thi"
                                >
                                  <RotateCcw size={11} />
                                  <span>Khôi Phục Code Nộp</span>
                                </button>
                              </div>
                            </div>

                            {/* Code Textarea */}
                            <textarea
                              value={testCodes[p.id] !== undefined ? testCodes[p.id] : (codeSubmitted || "")}
                              onChange={(e) => setTestCodes(prev => ({ ...prev, [p.id]: e.target.value }))}
                              placeholder="# Viết mã Python tại đây để chạy build thử..."
                              rows={8}
                              style={{
                                width: "100%",
                                background: "#0a0f1d",
                                color: "#f8fafc",
                                fontFamily: "Consolas, 'Courier New', monospace",
                                fontSize: "0.82rem",
                                lineHeight: "1.45",
                                padding: "0.75rem",
                                border: "none",
                                outline: "none",
                                resize: "vertical",
                                boxSizing: "border-box",
                                whiteSpace: "pre"
                              }}
                            />

                            {/* Action Buttons: Run Code & Test Cases */}
                            <div style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: "0.55rem",
                              padding: "0.5rem 0.8rem",
                              background: "#1e293b",
                              borderTop: "1px solid #334155"
                            }}>
                              <button
                                type="button"
                                disabled={isRunning[p.id]}
                                onClick={() => handleRunCode(p.id)}
                                className="btn btn-sm"
                                style={{
                                  background: isRunning[p.id] ? "#475569" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                  color: "#ffffff",
                                  padding: "0.35rem 0.85rem",
                                  fontSize: "0.75rem",
                                  fontWeight: 800,
                                  borderRadius: "6px",
                                  border: "none",
                                  cursor: isRunning[p.id] ? "not-allowed" : "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  boxShadow: "0 2px 6px rgba(37, 99, 235, 0.3)"
                                }}
                              >
                                <Play size={13} fill="#ffffff" />
                                <span>{isRunning[p.id] ? "Đang chạy..." : "▶️ Chạy Build Thử Code"}</span>
                              </button>

                              <button
                                type="button"
                                disabled={isGrading[p.id]}
                                onClick={() => handleGradeCode(p.id)}
                                className="btn btn-sm"
                                style={{
                                  background: isGrading[p.id] ? "#475569" : "linear-gradient(135deg, #059669, #047857)",
                                  color: "#ffffff",
                                  padding: "0.35rem 0.85rem",
                                  fontSize: "0.75rem",
                                  fontWeight: 800,
                                  borderRadius: "6px",
                                  border: "none",
                                  cursor: isGrading[p.id] ? "not-allowed" : "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  boxShadow: "0 2px 6px rgba(5, 150, 105, 0.3)"
                                }}
                              >
                                <CheckCircle2 size={13} />
                                <span>{isGrading[p.id] ? "Đang chấm..." : "🧪 Chấm Điểm & Kiểm Tra Test Cases"}</span>
                              </button>
                            </div>
                          </div>

                          {/* CONSOLE STDOUT RESULT */}
                          {runResults[p.id] && (
                            <div style={{
                              background: "#020617",
                              border: "1px solid #1e293b",
                              borderRadius: "8px",
                              padding: "0.65rem 0.85rem",
                              marginBottom: "0.75rem"
                            }}>
                              <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "0.7rem",
                                fontWeight: 800,
                                color: "#94a3b8",
                                marginBottom: "0.35rem",
                                borderBottom: "1px solid #1e293b",
                                paddingBottom: "0.25rem"
                              }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                  <Terminal size={12} color="#38bdf8" />
                                  <span>CONSOLE OUTPUT (Thời gian: {runResults[p.id].executionTimeMs}ms)</span>
                                </span>
                                <span style={{ color: runResults[p.id].success ? "#34d399" : "#f87171" }}>
                                  {runResults[p.id].success ? "SUCCESS" : "ERROR"}
                                </span>
                              </div>
                              <pre style={{
                                margin: 0,
                                color: runResults[p.id].success ? "#38bdf8" : "#fca5a5",
                                fontFamily: "Consolas, 'Courier New', monospace",
                                fontSize: "0.78rem",
                                whiteSpace: "pre-wrap",
                                maxHeight: "180px",
                                overflowY: "auto"
                              }}>
                                {runResults[p.id].output}
                              </pre>

                              {/* Đồ họa rùa Turtle SVG nếu có */}
                              {runResults[p.id].turtleCanvasSvg && (
                                <div style={{ marginTop: "0.6rem", borderTop: "1px solid #1e293b", paddingTop: "0.5rem" }}>
                                  <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#34d399", marginBottom: "0.3rem" }}>
                                    🎨 BẢNG VẼ ĐỒ HỌA RÙA (TURTLE CANVAS):
                                  </div>
                                  <div 
                                    style={{ background: "#ffffff", borderRadius: "6px", padding: "6px", display: "flex", justifyContent: "center" }}
                                    dangerouslySetInnerHTML={{ __html: runResults[p.id].turtleCanvasSvg || "" }}
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {/* TEST CASES COMPARISON TABLE */}
                          {(gradeResults[p.id] || (pRes && pRes.testCaseResults && pRes.testCaseResults.length > 0)) && (
                            <div style={{
                              background: "#f8fafc",
                              padding: "0.65rem 0.85rem",
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0",
                              fontSize: "0.75rem",
                              marginBottom: "0.75rem"
                            }}>
                              <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontWeight: 800,
                                color: "#334155",
                                marginBottom: "0.4rem"
                              }}>
                                <span>KẾT QUẢ KIỂM THỬ ĐÚNG / SAI (TEST CASES):</span>
                                {gradeResults[p.id] && (
                                  <span style={{
                                    fontSize: "0.7rem",
                                    padding: "2px 7px",
                                    borderRadius: "4px",
                                    background: gradeResults[p.id].passed ? "#dcfce7" : "#fee2e2",
                                    color: gradeResults[p.id].passed ? "#15803d" : "#b91c1c"
                                  }}>
                                    {gradeResults[p.id].feedback || (gradeResults[p.id].passed ? "Đạt toàn bộ test cases" : "Chưa đạt test cases")}
                                  </span>
                                )}
                              </div>

                              {/* Chi tiết test case từ kết quả chấm mới nhất hoặc kết quả bài thi ban đầu */}
                              {(gradeResults[p.id]?.details || pRes?.testCaseResults || []).map((tc: any, tIdx: number) => {
                                const isPassed = tc.passed;
                                return (
                                  <div 
                                    key={tIdx} 
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "85px 1fr 1fr 1fr",
                                      gap: "0.5rem",
                                      padding: "0.35rem 0.5rem",
                                      borderRadius: "5px",
                                      marginBottom: "0.25rem",
                                      background: isPassed ? "rgba(34, 197, 94, 0.08)" : "rgba(239, 68, 68, 0.08)",
                                      border: isPassed ? "1px solid #bbf7d0" : "1px solid #fecaca",
                                      alignItems: "center"
                                    }}
                                  >
                                    <span style={{ fontWeight: 800, color: isPassed ? "#15803d" : "#b91c1c" }}>
                                      {isPassed ? "✅ PASS" : "❌ FAIL"} #{tIdx + 1}
                                    </span>
                                    <div>
                                      <span style={{ color: "#64748b", fontSize: "0.68rem" }}>Đầu vào: </span>
                                      <code style={{ background: "#ffffff", padding: "1px 4px", borderRadius: "3px" }}>{tc.input || "None"}</code>
                                    </div>
                                    <div>
                                      <span style={{ color: "#64748b", fontSize: "0.68rem" }}>Kỳ vọng: </span>
                                      <code style={{ background: "#ffffff", padding: "1px 4px", borderRadius: "3px" }}>{tc.expected}</code>
                                    </div>
                                    <div>
                                      <span style={{ color: "#64748b", fontSize: "0.68rem" }}>Thực tế: </span>
                                      <code style={{ background: "#ffffff", padding: "1px 4px", borderRadius: "3px", color: isPassed ? "#15803d" : "#b91c1c" }}>
                                        {tc.actual || "None"}
                                      </code>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* AI REVIEW & FIX SUGGESTION DRAWER */}
                          {aiReviewFeedback[p.id] && (
                            <div style={{
                              background: "linear-gradient(135deg, #1e1b4b, #0f172a)",
                              border: "1px solid #7c3aed",
                              borderRadius: "8px",
                              padding: "0.85rem 1rem",
                              marginBottom: "0.75rem",
                              color: "#f3e8ff",
                              boxShadow: "0 4px 15px rgba(124, 58, 237, 0.2)"
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 800, color: "#c084fc", fontSize: "0.82rem" }}>
                                  <Bot size={15} color="#e879f9" />
                                  <span>PHÂN TÍCH LỖI VÀ CHỈ CHỖ SỬA TỪ THẦY AI:</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setAiReviewFeedback(prev => {
                                    const next = { ...prev };
                                    delete next[p.id];
                                    return next;
                                  })}
                                  style={{ background: "none", border: "none", color: "#e879f9", cursor: "pointer" }}
                                  title="Đóng bảng nhận xét"
                                >
                                  <X size={15} />
                                </button>
                              </div>
                              <AIMarkdownRenderer
                                content={aiReviewFeedback[p.id]}
                                onApplyCode={(newCode) => {
                                  setTestCodes(prev => ({ ...prev, [p.id]: newCode }));
                                }}
                                applyButtonLabel="Nạp Vào Editor Để Chạy Thử Ngay"
                              />
                            </div>
                          )}

                          {/* MÃ NGUỒN MẪU THAM KHẢO */}
                          <div style={{
                            background: "#f1f5f9",
                            borderRadius: "6px",
                            padding: "0.55rem 0.8rem",
                            border: "1px solid #cbd5e1"
                          }}>
                            <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", marginBottom: "0.25rem" }}>
                              💡 MÃ NGUỒN CHUẨN THAM KHẢO:
                            </div>
                            <pre style={{
                              margin: 0,
                              color: "#047857",
                              fontFamily: "Consolas, 'Courier New', monospace",
                              fontSize: "0.76rem",
                              whiteSpace: "pre-wrap",
                              background: "#ffffff",
                              padding: "0.5rem 0.65rem",
                              borderRadius: "4px",
                              border: "1px solid #e2e8f0"
                            }}>
                              {p.solution_code}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div style={{
          padding: "0.65rem 1.15rem",
          background: "var(--surface-subtle, #f8fafc)",
          borderTop: "1px solid var(--border-light, #e2e8f0)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <button
            onClick={onClose}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "0.45rem 0.85rem",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            <ArrowLeft size={14} />
            <span>Quay Lại Bảng Điểm</span>
          </button>

          <button
            onClick={onClose}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "0.45rem 1rem",
              borderRadius: "6px",
              border: "none",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#ffffff",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(37, 99, 235, 0.3)"
            }}
          >
            <Check size={14} />
            <span>Hoàn Tất & Đóng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
