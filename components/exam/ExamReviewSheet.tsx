"use client";

import { useState } from "react";
import { ExamResult, Question, PracticalProblem } from "@/types";
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
  Lock
} from "lucide-react";

interface ExamReviewSheetProps {
  resultData: ExamResult;
  onClose: () => void;
}

type FilterType = "all" | "correct" | "incorrect" | "unattempted" | "practicals";

export default function ExamReviewSheet({ resultData, onClose }: ExamReviewSheetProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

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
          padding: "1.2rem 1.6rem",
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <BookOpen size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#ffffff", letterSpacing: "-0.2px" }}>
                Bảng Kiểm Tra Đúng / Sai & Giải Thích Chi Tiết
              </h2>
              <p style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.85)", margin: "0.2rem 0 0" }}>
                Học viên: <strong>{resultData.userName}</strong> • Tổng điểm: <strong>{resultData.score}/10.0</strong> ({resultData.passed ? "Đạt Chuẩn Tốt Nghiệp" : "Chưa Đạt"})
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button
              onClick={() => window.print()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "0.45rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <Printer size={15} />
              <span>In Bài Làm</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#ffffff"
              }}
              title="Đóng bảng tra cứu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* STATUS BANNER NẾU MÔN HỌC ĐÃ ĐƯỢC TỰ ĐỘNG KHÓA */}
        {resultData.passed && (
          <div style={{
            background: "#ecfdf5",
            borderBottom: "1px solid #a7f3d0",
            padding: "0.65rem 1.6rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.82rem",
            color: "#065f46"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Lock size={15} color="#059669" />
              <span>
                <strong>Khóa bảo lưu kết quả:</strong> Môn học đã hoàn thành với điểm số <strong>{resultData.score}đ</strong>. Kết quả đã đồng bộ an toàn lên MongoDB Atlas.
              </span>
            </div>
            {resultData.certificateCode && (
              <span style={{ fontWeight: 800, background: "#ffffff", padding: "2px 8px", borderRadius: "6px", border: "1px solid #10b981", color: "#047857" }}>
                Chứng chỉ: {resultData.certificateCode}
              </span>
            )}
          </div>
        )}

        {/* SUMMARY STATS STRIP */}
        <div style={{
          padding: "1rem 1.6rem",
          background: "var(--surface-subtle, #f8fafc)",
          borderBottom: "1px solid var(--border-light, #e2e8f0)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.85rem"
        }}>
          <div style={{ background: "#ffffff", padding: "0.65rem 0.9rem", borderRadius: "10px", border: "1px solid #bfdbfe", textAlign: "center" }}>
            <span style={{ fontSize: "0.7rem", color: "#2563eb", fontWeight: 800, textTransform: "uppercase", display: "block" }}>TỔNG ĐIỂM</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1e40af" }}>{resultData.score}</span>
            <span style={{ fontSize: "0.7rem", color: "#64748b", display: "block" }}>Thang 10.0</span>
          </div>

          <div style={{ background: "#ffffff", padding: "0.65rem 0.9rem", borderRadius: "10px", border: "1px solid #a7f3d0", textAlign: "center" }}>
            <span style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 800, textTransform: "uppercase", display: "block" }}>CÂU ĐÚNG</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#047857" }}>{correctMCQs}</span>
            <span style={{ fontSize: "0.7rem", color: "#059669", display: "block" }}>+{(correctMCQs * 0.14).toFixed(2)}đ trắc nghiệm</span>
          </div>

          <div style={{ background: "#ffffff", padding: "0.65rem 0.9rem", borderRadius: "10px", border: "1px solid #fecaca", textAlign: "center" }}>
            <span style={{ fontSize: "0.7rem", color: "#dc2626", fontWeight: 800, textTransform: "uppercase", display: "block" }}>CÂU SAI</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#b91c1c" }}>{incorrectMCQs}</span>
            <span style={{ fontSize: "0.7rem", color: "#dc2626", display: "block" }}>Cần ôn tập kỹ lại</span>
          </div>

          <div style={{ background: "#ffffff", padding: "0.65rem 0.9rem", borderRadius: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
            <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 800, textTransform: "uppercase", display: "block" }}>BỎ QUA / CHƯA LÀM</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#475569" }}>{unattemptedMCQs}</span>
            <span style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block" }}>0 điểm</span>
          </div>

          <div style={{ background: "#ffffff", padding: "0.65rem 0.9rem", borderRadius: "10px", border: "1px solid #cbd5e1", textAlign: "center" }}>
            <span style={{ fontSize: "0.7rem", color: "#0284c7", fontWeight: 800, textTransform: "uppercase", display: "block" }}>CODE THỰC HÀNH</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0369a1" }}>{practicalPassedCount} / 4</span>
            <span style={{ fontSize: "0.7rem", color: "#0284c7", display: "block" }}>+{(practicalPassedCount * 0.75).toFixed(2)}đ tự luận</span>
          </div>
        </div>

        {/* FILTER TOOLBAR & EXPAND ALL BUTTONS */}
        <div style={{
          padding: "0.75rem 1.6rem",
          background: "#ffffff",
          borderBottom: "1px solid var(--border-light, #e2e8f0)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.6rem"
        }}>
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                padding: "0.38rem 0.8rem",
                borderRadius: "8px",
                border: filter === "all" ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                background: filter === "all" ? "#eff6ff" : "#ffffff",
                color: filter === "all" ? "#1d4ed8" : "#475569",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer"
              }}
            >
              Tất Cả ({questions.length + practicals.length})
            </button>

            <button
              onClick={() => setFilter("correct")}
              style={{
                padding: "0.38rem 0.8rem",
                borderRadius: "8px",
                border: filter === "correct" ? "1.5px solid #059669" : "1px solid #cbd5e1",
                background: filter === "correct" ? "#ecfdf5" : "#ffffff",
                color: filter === "correct" ? "#047857" : "#475569",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer"
              }}
            >
              ✅ Đúng ({correctMCQs})
            </button>

            <button
              onClick={() => setFilter("incorrect")}
              style={{
                padding: "0.38rem 0.8rem",
                borderRadius: "8px",
                border: filter === "incorrect" ? "1.5px solid #dc2626" : "1px solid #cbd5e1",
                background: filter === "incorrect" ? "#fef2f2" : "#ffffff",
                color: filter === "incorrect" ? "#b91c1c" : "#475569",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer"
              }}
            >
              ❌ Sai ({incorrectMCQs})
            </button>

            <button
              onClick={() => setFilter("unattempted")}
              style={{
                padding: "0.38rem 0.8rem",
                borderRadius: "8px",
                border: filter === "unattempted" ? "1.5px solid #64748b" : "1px solid #cbd5e1",
                background: filter === "unattempted" ? "#f1f5f9" : "#ffffff",
                color: filter === "unattempted" ? "#334155" : "#64748b",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer"
              }}
            >
              ⚪ Chưa Làm ({unattemptedMCQs})
            </button>

            <button
              onClick={() => setFilter("practicals")}
              style={{
                padding: "0.38rem 0.8rem",
                borderRadius: "8px",
                border: filter === "practicals" ? "1.5px solid #0284c7" : "1px solid #cbd5e1",
                background: filter === "practicals" ? "#f0f9ff" : "#ffffff",
                color: filter === "practicals" ? "#0369a1" : "#475569",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer"
              }}
            >
              💻 Code Thực Hành ({practicals.length})
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              onClick={expandAll}
              style={{
                padding: "0.35rem 0.7rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#334155",
                fontSize: "0.74rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Mở Tất Cả Chi Tiết
            </button>
            <button
              onClick={collapseAll}
              style={{
                padding: "0.35rem 0.7rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#334155",
                fontSize: "0.74rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Thu Gọn
            </button>
          </div>
        </div>

        {/* SCROLLABLE QUESTION LIST */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.2rem 1.6rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
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
                    padding: "0.85rem 1.1rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: 1 }}>
                    <div style={{ marginTop: "2px" }}>
                      {correct ? (
                        <CheckCircle2 size={18} color="#059669" />
                      ) : attempted ? (
                        <XCircle size={18} color="#dc2626" />
                      ) : (
                        <AlertCircle size={18} color="#94a3b8" />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.82rem", color: "#1e293b" }}>
                          Câu #{idx + 1}
                        </span>
                        <span style={{ fontSize: "0.7rem", padding: "1px 6px", borderRadius: "4px", background: "#e2e8f0", color: "#475569", fontWeight: 700 }}>
                          {q.type_name || q.type}
                        </span>
                        <span style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: correct ? "#dcfce7" : attempted ? "#fee2e2" : "#f1f5f9",
                          color: correct ? "#15803d" : attempted ? "#b91c1c" : "#64748b"
                        }}>
                          {correct ? "+0.14 điểm (Đúng)" : attempted ? "0.0 điểm (Sai)" : "0.0 điểm (Chưa làm)"}
                        </span>
                      </div>

                      <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.45 }}>
                        {q.question}
                      </div>

                      {/* Summary text of answers */}
                      <div style={{ display: "flex", gap: "1rem", marginTop: "0.4rem", fontSize: "0.78rem", flexWrap: "wrap" }}>
                        <span>
                          Lựa chọn của bạn:{" "}
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
                      gap: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "4px 8px",
                      borderRadius: "6px"
                    }}
                  >
                    <span>{isExpanded ? "Thu gọn" : "Xem chi tiết"}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* EXPANDED ACCORDION: FULL OPTIONS & LOGIC EXPLANATION */}
                {isExpanded && (
                  <div style={{
                    padding: "1rem 1.2rem",
                    borderTop: "1px solid #e2e8f0",
                    background: "#ffffff"
                  }}>
                    {/* Code snippet if question has it */}
                    {q.code && (
                      <div style={{
                        background: "#0f172a",
                        color: "#38bdf8",
                        padding: "0.85rem",
                        borderRadius: "8px",
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "0.82rem",
                        marginBottom: "0.8rem",
                        overflowX: "auto"
                      }}>
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{q.code}</pre>
                      </div>
                    )}

                    {/* Options Breakdown */}
                    {q.options && q.options.length > 0 && (
                      <div style={{ marginBottom: "0.85rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                          CÁC PHƯƠNG ÁN LỰA CHỌN:
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          {q.options.map((opt, oIdx) => {
                            const optLetter = String.fromCharCode(65 + oIdx);
                            const isUserPick = String(uAns) === opt || String(uAns) === String(oIdx) || String(uAns) === optLetter;
                            const isAnswer = String(q.correct_answer) === opt || String(q.correct_answer) === String(oIdx) || String(q.correct_answer) === optLetter;

                            return (
                              <div
                                key={oIdx}
                                style={{
                                  padding: "0.55rem 0.8rem",
                                  borderRadius: "8px",
                                  fontSize: "0.82rem",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  border: isAnswer ? "1.5px solid #10b981" : isUserPick ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                                  background: isAnswer ? "#ecfdf5" : isUserPick ? "#fef2f2" : "#f8fafc"
                                }}
                              >
                                <span style={{
                                  width: "22px",
                                  height: "22px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.75rem",
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
                                  <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 800, display: "flex", alignItems: "center", gap: "3px" }}>
                                    <Check size={13} /> Đáp án đúng
                                  </span>
                                )}
                                {isUserPick && !isAnswer && (
                                  <span style={{ fontSize: "0.72rem", color: "#dc2626", fontWeight: 800 }}>
                                    Bạn đã chọn (Sai)
                                  </span>
                                )}
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
                        borderRadius: "8px",
                        padding: "0.75rem 0.9rem",
                        color: "#166534",
                        fontSize: "0.82rem"
                      }}>
                        <div style={{ fontWeight: 800, display: "flex", alignItems: "center", gap: "5px", marginBottom: "0.3rem" }}>
                          <Sparkles size={14} color="#15803d" />
                          <span>Giải Thích Logic Chuẩn Xác:</span>
                        </div>
                        <div style={{ lineHeight: 1.55 }}>
                          {q.explanation}
                        </div>
                      </div>
                    )}

                    {/* Option Explanations */}
                    {q.option_explanations && Object.keys(q.option_explanations).length > 0 && (
                      <div style={{ marginTop: "0.6rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.65rem 0.85rem", fontSize: "0.78rem" }}>
                        <div style={{ fontWeight: 800, color: "#475569", marginBottom: "0.3rem" }}>Phân tích từng phương án:</div>
                        {Object.entries(q.option_explanations).map(([optKey, expText]) => (
                          <div key={optKey} style={{ marginBottom: "0.2rem", color: "#334155" }}>
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
            <div style={{ marginTop: "1rem" }}>
              <div style={{
                fontSize: "0.95rem",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                <Code2 size={18} color="#2563eb" />
                <span>Phần 2: 4 Bài Tự Luận & Thực Hành Viết Code Python</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
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
                        borderRadius: "12px",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        onClick={() => toggleExpand(p.id + 10000)}
                        style={{
                          padding: "0.85rem 1.1rem",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: passed ? "#ecfdf5" : "#f1f5f9",
                            color: passed ? "#059669" : "#64748b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            <Terminal size={17} />
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontWeight: 800, fontSize: "0.82rem", color: "#1e293b" }}>
                                Tự Luận #{pIdx + 1}:
                              </span>
                              <span style={{
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                padding: "1px 6px",
                                borderRadius: "4px",
                                background: passed ? "#dcfce7" : "#fee2e2",
                                color: passed ? "#15803d" : "#b91c1c"
                              }}>
                                {passed ? "+0.75 điểm (ĐẠT CHUẨN)" : "0.0 điểm (CHƯA ĐẠT / LỖI TEST CASE)"}
                              </span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a", marginTop: "2px" }}>
                              {p.title}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>
                          <span>{isExpanded ? "Thu gọn" : "Xem code & test cases"}</span>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={{ padding: "1rem 1.2rem", borderTop: "1px solid #e2e8f0", background: "#ffffff" }}>
                          <p style={{ fontSize: "0.84rem", color: "#475569", marginBottom: "0.8rem" }}>
                            {p.description}
                          </p>

                          {/* Code comparison */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "0.8rem" }}>
                            <div style={{ background: "#0f172a", borderRadius: "8px", padding: "0.75rem", color: "#38bdf8", fontFamily: "var(--font-mono, monospace)", fontSize: "0.78rem" }}>
                              <div style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                                CODE HỌC VIÊN ĐÃ NỘP:
                              </div>
                              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                                {codeSubmitted || "# (Không có mã nguồn được nộp)"}
                              </pre>
                            </div>

                            <div style={{ background: "#0f172a", borderRadius: "8px", padding: "0.75rem", color: "#34d399", fontFamily: "var(--font-mono, monospace)", fontSize: "0.78rem" }}>
                              <div style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                                MÃ NGUỒN CHUẨN (THAM KHẢO):
                              </div>
                              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                                {p.solution_code}
                              </pre>
                            </div>
                          </div>

                          {/* Test Cases Results */}
                          {pRes && pRes.testCaseResults && pRes.testCaseResults.length > 0 && (
                            <div style={{ background: "#f8fafc", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.78rem" }}>
                              <div style={{ fontWeight: 800, color: "#334155", marginBottom: "0.4rem" }}>
                                KẾT QUẢ CHẠY TEST CASES:
                              </div>
                              {pRes.testCaseResults.map((tc: any, tIdx: number) => (
                                <div key={tIdx} style={{ display: "flex", gap: "1rem", marginBottom: "0.25rem", color: tc.passed ? "#15803d" : "#b91c1c" }}>
                                  <span>Test #{tIdx + 1}: {tc.passed ? "✅ PASS" : "❌ FAIL"}</span>
                                  <span>Đầu vào: <code>{tc.input || "None"}</code></span>
                                  <span>Kỳ vọng: <code>{tc.expected}</code></span>
                                  <span>Thực tế: <code>{tc.actual}</code></span>
                                </div>
                              ))}
                            </div>
                          )}
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
          padding: "0.9rem 1.6rem",
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
              gap: "6px",
              padding: "0.55rem 1.1rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              fontSize: "0.84rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            <ArrowLeft size={16} />
            <span>Quay Lại Bảng Điểm</span>
          </button>

          <button
            onClick={onClose}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.55rem 1.3rem",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#ffffff",
              fontSize: "0.84rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.35)"
            }}
          >
            <Check size={16} />
            <span>Hoàn Tất & Đóng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
