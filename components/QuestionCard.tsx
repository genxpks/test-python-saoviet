"use client";

import { useState, useEffect } from "react";
import { Question } from "@/types";
import { 
  CheckCircle2, 
  HelpCircle, 
  Lightbulb, 
  Bot, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Check, 
  X, 
  Copy,
  ChevronRight,
  Code2,
  ListOrdered,
  Link as LinkIcon,
  ToggleLeft,
  RotateCcw,
  CheckSquare
} from "lucide-react";

interface QuestionCardProps {
  question: Question;
  index?: number;
  showExplanationInitially?: boolean;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
  isExamMode?: boolean;
}

export default function QuestionCard({
  question,
  index,
  showExplanationInitially = false,
  userAnswer,
  onAnswerChange,
  isExamMode = false
}: QuestionCardProps) {
  const [localAnswer, setLocalAnswer] = useState<any>(userAnswer);
  const [showExp, setShowExp] = useState(showExplanationInitially);

  // 1. FILL IN THE BLANK STATES
  const [fillInput, setFillInput] = useState<string>(
    userAnswer !== undefined && userAnswer !== null ? String(userAnswer) : ""
  );
  const [fillChecked, setFillChecked] = useState<boolean>(
    userAnswer !== undefined && userAnswer !== null && userAnswer !== ""
  );

  // 2. MULTIPLE CHOICE STATES
  const [multiSelected, setMultiSelected] = useState<number[]>(
    Array.isArray(userAnswer) ? userAnswer : []
  );
  const [multiChecked, setMultiChecked] = useState<boolean>(
    Array.isArray(userAnswer) && userAnswer.length > 0
  );

  // 3. SEQUENCE ORDER STATES
  const [order, setOrder] = useState<number[]>(
    Array.isArray(userAnswer) && userAnswer.length > 0 
      ? userAnswer 
      : Array.from({ length: question.items?.length || 0 }, (_, i) => i)
  );
  const [orderChecked, setOrderChecked] = useState<boolean>(false);

  // 4. MATCHING PAIRS STATES
  const [pairs, setPairs] = useState<Record<string, string>>(
    typeof userAnswer === "object" && userAnswer !== null && !Array.isArray(userAnswer) ? userAnswer : {}
  );
  const [matchingChecked, setMatchingChecked] = useState<boolean>(false);

  // AI Explanation State
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Re-sync states when question.id or external userAnswer changes
  useEffect(() => {
    setLocalAnswer(userAnswer);
    setFillInput(userAnswer !== undefined && userAnswer !== null ? String(userAnswer) : "");
    setFillChecked(userAnswer !== undefined && userAnswer !== null && userAnswer !== "");
    setMultiSelected(Array.isArray(userAnswer) ? userAnswer : []);
    setMultiChecked(Array.isArray(userAnswer) && userAnswer.length > 0);
    setOrder(
      Array.isArray(userAnswer) && userAnswer.length > 0 
        ? userAnswer 
        : Array.from({ length: question.items?.length || 0 }, (_, i) => i)
    );
    setOrderChecked(false);
    setPairs(typeof userAnswer === "object" && userAnswer !== null && !Array.isArray(userAnswer) ? userAnswer : {});
    setMatchingChecked(false);
    setShowExp(showExplanationInitially);
    setAiExplanation(null);
  }, [question.id, userAnswer, showExplanationInitially]);

  const currentAnswer = userAnswer !== undefined ? userAnswer : localAnswer;

  const updateAnswer = (newAns: any) => {
    setLocalAnswer(newAns);
    if (onAnswerChange) {
      onAnswerChange(newAns);
    }
  };

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  // A. Single Choice / True-False
  const handleSingleSelect = (idx: number) => {
    updateAnswer(idx);
    if (!isExamMode) {
      setShowExp(true);
    }
  };

  // B. Multiple Choice
  const handleToggleMulti = (idx: number) => {
    const next = multiSelected.includes(idx)
      ? multiSelected.filter(x => x !== idx)
      : [...multiSelected, idx];
    setMultiSelected(next);
    setMultiChecked(false);
    if (isExamMode) {
      updateAnswer(next);
    }
  };

  const handleCheckMulti = () => {
    if (multiSelected.length === 0) return;
    setMultiChecked(true);
    updateAnswer(multiSelected);
    setShowExp(true);
  };

  // C. Fill in the blank
  const handleCheckFill = () => {
    const val = fillInput.trim();
    if (!val) return;
    setFillChecked(true);
    updateAnswer(val);
    if (!isExamMode) {
      setShowExp(true);
    }
  };

  const handleResetFill = () => {
    setFillInput("");
    setFillChecked(false);
    updateAnswer("");
    setShowExp(false);
  };

  // D. Sequence Order
  const handleMoveOrder = (pos: number, dir: number) => {
    const targetPos = pos + dir;
    if (targetPos >= 0 && targetPos < order.length) {
      const next = [...order];
      const temp = next[pos];
      next[pos] = next[targetPos];
      next[targetPos] = temp;
      setOrder(next);
      setOrderChecked(false);
      if (isExamMode) {
        updateAnswer(next);
      }
    }
  };

  const handleCheckOrder = () => {
    setOrderChecked(true);
    updateAnswer(order);
    setShowExp(true);
  };

  // E. Matching Pairs
  const handleMatchSelect = (left: string, right: string) => {
    const next = { ...pairs, [left]: right };
    setPairs(next);
    setMatchingChecked(false);
    if (isExamMode) {
      updateAnswer(next);
    }
  };

  const handleCheckMatching = () => {
    setMatchingChecked(true);
    updateAnswer(pairs);
    setShowExp(true);
  };

  // F. Ask AI Explanation
  const handleAskAIExplanation = async () => {
    setIsAiLoading(true);
    setAiExplanation("⏳ Thầy AI đang đối chiếu giáo trình, phân tích logic và soạn lời giải chi tiết...");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "explain_question",
          prompt: "Hãy giải thích chi tiết vì sao đáp án đúng, chỉ ra bẫy logic của các đáp án còn lại và đưa ra mẹo ghi nhớ cho học viên.",
          context: {
            question_id: question.id,
            question_text: question.question,
            question_type: question.type_name,
            options: question.options,
            correct_answer: question.correct_answer,
            correct_order: question.correct_order,
            pairs: question.pairs,
            standard_explanation: question.explanation
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiExplanation(data.reply);
      } else {
        setAiExplanation("❌ Gián đoạn kết nối tới Trợ lý AI. Em hãy thử lại nhé!");
      }
    } catch (e: any) {
      setAiExplanation("❌ Lỗi khi gửi yêu cầu tới AI: " + e.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyExplanation = () => {
    if (aiExplanation) {
      navigator.clipboard.writeText(aiExplanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const qNum = index !== undefined ? index + 1 : question.id;

  const getBadgeTheme = (type?: string) => {
    switch (type) {
      case "single_choice":
        return { bg: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.4)", icon: HelpCircle };
      case "true_false":
        return { bg: "rgba(14, 165, 233, 0.15)", color: "#38bdf8", border: "rgba(14, 165, 233, 0.4)", icon: ToggleLeft };
      case "multiple_choice":
        return { bg: "rgba(168, 85, 247, 0.15)", color: "#c084fc", border: "rgba(168, 85, 247, 0.4)", icon: CheckSquare };
      case "fill_blank":
        return { bg: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.4)", icon: Code2 };
      case "sequence_order":
        return { bg: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "rgba(16, 185, 129, 0.4)", icon: ListOrdered };
      case "matching":
        return { bg: "rgba(244, 63, 94, 0.15)", color: "#fb7185", border: "rgba(244, 63, 94, 0.4)", icon: LinkIcon };
      default:
        return { bg: "rgba(148, 163, 184, 0.15)", color: "#cbd5e1", border: "rgba(148, 163, 184, 0.3)", icon: HelpCircle };
    }
  };

  const badgeTheme = getBadgeTheme(question.type);
  const BadgeIcon = badgeTheme.icon;

  return (
    <div className="q-card" id={`question-${qNum}`}>
      {/* Question Header */}
      <div className="q-card-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span
            className="q-badge"
            style={{
              background: badgeTheme.bg,
              color: badgeTheme.color,
              borderColor: badgeTheme.border
            }}
          >
            <BadgeIcon size={14} />
            <span>CÂU {qNum}</span>
          </span>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
            {question.type_name || "Trắc nghiệm"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {question.chapter && (
            <span style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "0.2rem 0.55rem",
              borderRadius: "var(--radius-xs)",
              background: "var(--surface-subtle)",
              color: "var(--text-secondary)"
            }}>
              Chương {question.chapter}
            </span>
          )}
        </div>
      </div>

      {/* Question Title */}
      <h3 style={{ fontSize: "1.08rem", fontWeight: 800, marginBottom: "0.85rem", color: "var(--text-primary)", lineHeight: "1.5" }}>
        {question.question}
      </h3>

      {/* Code Snippet if present */}
      {question.code && (
        <div className="code-container-dark">
          <div className="code-header-bar">
            <div className="terminal-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <span>Python 3.12 Engine</span>
          </div>
          <pre style={{ margin: 0, overflowX: "auto", color: "#38bdf8", lineHeight: "1.5" }}>
            {question.code}
          </pre>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SINGLE CHOICE & TRUE/FALSE */}
      {/* ========================================================================= */}
      {(question.type === "single_choice" || question.type === "true_false" || !question.type) && question.options && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", margin: "1rem 0" }}>
          {question.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const hasAnswered = currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== "";
            const isSelected = hasAnswered && String(currentAnswer) === String(idx);
            const isOptionCorrect = String(question.correct_answer) === String(idx);

            let itemClass = "option-item";
            if (isExamMode) {
              if (isSelected) itemClass += " selected";
            } else {
              if (hasAnswered || showExp) {
                if (isOptionCorrect) {
                  itemClass += " correct";
                } else if (isSelected) {
                  itemClass += " wrong";
                }
              } else if (isSelected) {
                itemClass += " selected";
              }
            }

            return (
              <div
                key={idx}
                className={itemClass}
                onClick={() => handleSingleSelect(idx)}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                <div className="option-letter">{letter}</div>
                <div style={{ flex: 1, fontSize: "0.92rem", fontWeight: isSelected ? 700 : 500 }}>
                  {opt}
                </div>
                {!isExamMode && (hasAnswered || showExp) && isOptionCorrect && (
                  <CheckCircle2 size={18} color="#10b981" />
                )}
                {!isExamMode && hasAnswered && isSelected && !isOptionCorrect && (
                  <X size={18} color="#ef4444" />
                )}
              </div>
            );
          })}

          {/* Feedback Banner in Study Mode */}
          {!isExamMode && currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== "" && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: String(currentAnswer) === String(question.correct_answer) ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
              border: `1.5px solid ${String(currentAnswer) === String(question.correct_answer) ? "#059669" : "#dc2626"}`,
              borderRadius: "8px",
              padding: "0.6rem 1rem",
              marginTop: "0.4rem",
              color: String(currentAnswer) === String(question.correct_answer) ? "#065f46" : "#991b1b",
              fontSize: "0.86rem",
              fontWeight: 800
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {String(currentAnswer) === String(question.correct_answer) ? (
                  <>
                    <CheckCircle2 size={16} color="#059669" />
                    <span>🎉 CHÍNH XÁC! Em đã chọn đúng đáp án {String.fromCharCode(65 + Number(question.correct_answer))}.</span>
                  </>
                ) : (
                  <>
                    <X size={16} color="#dc2626" />
                    <span>⚠️ CHƯA CHÍNH XÁC! Đáp án đúng là {String.fromCharCode(65 + Number(question.correct_answer))}. Xem phân tích bên dưới:</span>
                  </>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); updateAnswer(undefined); setShowExp(false); }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: String(currentAnswer) === String(question.correct_answer) ? "#047857" : "#b91c1c",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "underline",
                  whiteSpace: "nowrap"
                }}
              >
                🔄 Chọn lại
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MULTIPLE CHOICE */}
      {/* ========================================================================= */}
      {question.type === "multiple_choice" && question.options && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", margin: "1rem 0" }}>
          <div style={{ fontSize: "0.82rem", color: "#c084fc", fontWeight: 700, marginBottom: "0.2rem" }}>
            * Chọn tất cả các phương án đúng (Có thể chọn nhiều đáp án):
          </div>

          {question.options.map((opt, idx) => {
            const isSelected = multiSelected.includes(idx);
            const isOptionCorrect = Array.isArray(question.correct_answer) && question.correct_answer.includes(idx);

            let itemClass = "option-item";
            if (isExamMode) {
              if (isSelected) itemClass += " selected";
            } else {
              if (multiChecked) {
                if (isOptionCorrect) itemClass += " correct";
                else if (isSelected && !isOptionCorrect) itemClass += " wrong";
              } else if (isSelected) {
                itemClass += " selected";
              }
            }

            return (
              <div
                key={idx}
                className={itemClass}
                onClick={() => handleToggleMulti(idx)}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                <div style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "6px",
                  border: isSelected ? "2px solid #a855f7" : "1.5px solid #475569",
                  background: isSelected ? "#7c3aed" : "rgba(15, 23, 42, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  transition: "all 0.15s ease"
                }}>
                  {isSelected && <Check size={14} />}
                </div>
                <div style={{ flex: 1, fontSize: "0.92rem", fontWeight: isSelected ? 700 : 500 }}>
                  {opt}
                </div>
                {!isExamMode && multiChecked && isOptionCorrect && (
                  <CheckCircle2 size={18} color="#10b981" />
                )}
                {!isExamMode && multiChecked && isSelected && !isOptionCorrect && (
                  <X size={18} color="#ef4444" />
                )}
              </div>
            );
          })}

          {/* Action & Feedback Buttons in Study Mode */}
          {!isExamMode && (
            <div style={{ marginTop: "0.5rem" }}>
              {!multiChecked ? (
                <button
                  onClick={handleCheckMulti}
                  disabled={multiSelected.length === 0}
                  className="btn btn-sm"
                  style={{
                    background: multiSelected.length > 0 ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "rgba(51, 65, 85, 0.5)",
                    color: "#ffffff",
                    fontWeight: 800,
                    padding: "0.55rem 1.2rem",
                    borderRadius: "8px",
                    boxShadow: multiSelected.length > 0 ? "0 4px 12px rgba(124, 58, 237, 0.35)" : "none",
                    cursor: multiSelected.length > 0 ? "pointer" : "not-allowed"
                  }}
                >
                  <CheckSquare size={16} />
                  <span>✅ Kiểm Tra Các Đáp Án Đã Chọn ({multiSelected.length} lựa chọn)</span>
                </button>
              ) : (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: (() => {
                    const corr = Array.isArray(question.correct_answer) ? [...question.correct_answer].sort().join(",") : "";
                    const user = [...multiSelected].sort().join(",");
                    return corr === user ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)";
                  })(),
                  border: `1.5px solid ${(() => {
                    const corr = Array.isArray(question.correct_answer) ? [...question.correct_answer].sort().join(",") : "";
                    const user = [...multiSelected].sort().join(",");
                    return corr === user ? "#059669" : "#dc2626";
                  })()}`,
                  borderRadius: "8px",
                  padding: "0.6rem 1rem",
                  color: (() => {
                    const corr = Array.isArray(question.correct_answer) ? [...question.correct_answer].sort().join(",") : "";
                    const user = [...multiSelected].sort().join(",");
                    return corr === user ? "#065f46" : "#991b1b";
                  })(),
                  fontSize: "0.86rem",
                  fontWeight: 800
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {(() => {
                      const corr = Array.isArray(question.correct_answer) ? [...question.correct_answer].sort().join(",") : "";
                      const user = [...multiSelected].sort().join(",");
                      if (corr === user) {
                        return (
                          <>
                            <CheckCircle2 size={16} color="#059669" />
                            <span>🎉 CHÍNH XÁC 100%! Em đã chọn đầy đủ các phương án đúng.</span>
                          </>
                        );
                      }
                      return (
                        <>
                          <X size={16} color="#dc2626" />
                          <span>⚠️ CHƯA CHÍNH XÁC! Các đáp án đúng gồm: {Array.isArray(question.correct_answer) ? question.correct_answer.map(i => String.fromCharCode(65 + i)).join(", ") : ""}</span>
                        </>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => {
                      setMultiSelected([]);
                      setMultiChecked(false);
                      updateAnswer([]);
                      setShowExp(false);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-secondary)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      textDecoration: "underline",
                      whiteSpace: "nowrap"
                    }}
                  >
                    🔄 Chọn lại
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FILL IN THE BLANK */}
      {/* ========================================================================= */}
      {question.type === "fill_blank" && (
        <div style={{ margin: "1.2rem 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.55rem", flexWrap: "wrap", gap: "0.4rem" }}>
            <label className="form-label" style={{ color: "#fbbf24", fontWeight: 800, fontSize: "0.9rem", margin: 0 }}>
              ✍️ Nhập kết quả hoặc từ khóa chính xác:
            </label>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              (Nhấn <strong>Enter</strong> hoặc nút <strong>Kiểm Tra</strong> bên dưới)
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="text"
              className="form-input"
              style={{
                flex: "1 1 280px",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--text-primary)",
                background: "var(--surface-card)",
                border: fillChecked 
                  ? (fillInput.trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase() ? "2px solid #10b981" : "2px solid #ef4444")
                  : "2px solid var(--border-medium)",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                boxShadow: "var(--shadow-subtle)",
                outline: "none"
              }}
              placeholder="Ví dụ: def, len, append, range, [1, 2, 3]..."
              value={fillInput}
              onChange={(e) => {
                setFillInput(e.target.value);
                if (isExamMode) {
                  updateAnswer(e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!isExamMode) handleCheckFill();
                }
              }}
              onBlur={() => {
                if (isExamMode) updateAnswer(fillInput.trim());
              }}
            />

            {!isExamMode && (
              <button
                onClick={handleCheckFill}
                className="btn btn-primary"
                style={{
                  padding: "0.75rem 1.3rem",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  borderRadius: "8px",
                  whiteSpace: "nowrap",
                  background: "linear-gradient(135deg, #0284c7, #0369a1)"
                }}
              >
                <span>🔍 Kiểm Tra</span>
              </button>
            )}
          </div>

          {/* Fill Blank Feedback Badge in Study Mode */}
          {!isExamMode && fillChecked && (
            <div style={{ marginTop: "0.75rem" }}>
              {(() => {
                const cleanUser = fillInput.trim().toLowerCase();
                const cleanCorrect = String(question.correct_answer).trim().toLowerCase();
                const isMatched = cleanUser === cleanCorrect;

                if (isMatched) {
                  return (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.6rem 1rem",
                      borderRadius: "8px",
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1.5px solid #059669",
                      color: "#065f46",
                      fontSize: "0.86rem",
                      fontWeight: 800
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Check size={16} color="#059669" />
                        <span>🎉 CHÍNH XÁC 100%! Từ khóa '{fillInput}' khớp hoàn toàn với đáp án.</span>
                      </div>
                      <button
                        onClick={handleResetFill}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#047857",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          textDecoration: "underline"
                        }}
                      >
                        🔄 Điền lại
                      </button>
                    </div>
                  );
                }

                return (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    background: "rgba(239, 68, 68, 0.12)",
                    border: "1.5px solid #dc2626",
                    color: "#991b1b",
                    fontSize: "0.86rem",
                    fontWeight: 800
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                      <X size={16} color="#dc2626" />
                      <span>⚠️ CHƯA CHÍNH XÁC! Từ khóa chuẩn cần điền:</span>
                      <strong style={{ color: "#ffffff", fontFamily: "var(--font-mono)", background: "#dc2626", padding: "2px 8px", borderRadius: "4px" }}>
                        {question.correct_answer}
                      </strong>
                    </div>
                    <button
                      onClick={handleResetFill}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#b91c1c",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                    >
                      🔄 Điền lại
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SEQUENCE ORDERING */}
      {/* ========================================================================= */}
      {question.type === "sequence_order" && question.items && (
        <div style={{ margin: "1rem 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#34d399", fontWeight: 700 }}>
              * Dùng mũi tên ▲ ▼ để sắp xếp các dòng lệnh theo đúng logic thực thi:
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {order.map((itemIdx, pos) => (
              <div
                key={pos}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  background: "var(--surface-subtle)",
                  border: orderChecked 
                    ? (order[pos] === (question.correct_order || [])[pos] ? "1.5px solid #10b981" : "1.5px solid #ef4444")
                    : "1.5px solid var(--border-medium)",
                  borderRadius: "var(--radius-sm)",
                  transition: "all 0.2s ease"
                }}
              >
                <span style={{ fontWeight: 800, color: "#2563eb", fontSize: "0.85rem", width: "26px" }}>
                  #{pos + 1}
                </span>
                <span style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "0.88rem", color: "var(--text-primary)" }}>
                  {question.items![itemIdx]}
                </span>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  <button
                    disabled={pos === 0}
                    onClick={() => handleMoveOrder(pos, -1)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "0.3rem 0.5rem", borderRadius: "6px" }}
                    title="Di chuyển lên trên"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    disabled={pos === order.length - 1}
                    onClick={() => handleMoveOrder(pos, 1)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "0.3rem 0.5rem", borderRadius: "6px" }}
                    title="Di chuyển xuống dưới"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sequence Order Check Button in Study Mode */}
          {!isExamMode && (
            <div style={{ marginTop: "0.75rem" }}>
              {!orderChecked ? (
                <button
                  onClick={handleCheckOrder}
                  className="btn btn-sm"
                  style={{
                    background: "linear-gradient(135deg, #059669, #047857)",
                    color: "#ffffff",
                    fontWeight: 800,
                    padding: "0.55rem 1.2rem",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.35)",
                    cursor: "pointer"
                  }}
                >
                  <ListOrdered size={16} />
                  <span>🔍 Kiểm Tra Thứ Tự Đã Xếp</span>
                </button>
              ) : (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: (() => {
                    const target = question.correct_order || Array.from({ length: question.items?.length || 0 }, (_, i) => i);
                    const isExact = order.every((v, i) => v === target[i]);
                    return isExact ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)";
                  })(),
                  border: `1.5px solid ${(() => {
                    const target = question.correct_order || Array.from({ length: question.items?.length || 0 }, (_, i) => i);
                    const isExact = order.every((v, i) => v === target[i]);
                    return isExact ? "#059669" : "#dc2626";
                  })()}`,
                  borderRadius: "8px",
                  padding: "0.6rem 1rem",
                  color: (() => {
                    const target = question.correct_order || Array.from({ length: question.items?.length || 0 }, (_, i) => i);
                    const isExact = order.every((v, i) => v === target[i]);
                    return isExact ? "#065f46" : "#991b1b";
                  })(),
                  fontSize: "0.86rem",
                  fontWeight: 800
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {(() => {
                      const target = question.correct_order || Array.from({ length: question.items?.length || 0 }, (_, i) => i);
                      const isExact = order.every((v, i) => v === target[i]);
                      if (isExact) {
                        return (
                          <>
                            <CheckCircle2 size={16} color="#059669" />
                            <span>🎉 HOÀN TOÀN CHÍNH XÁC! Quy trình logic và thứ tự thực thi đã chuẩn 100%.</span>
                          </>
                        );
                      }
                      return (
                        <>
                          <X size={16} color="#dc2626" />
                          <span>⚠️ THỨ TỰ CHƯA CHÍNH XÁC! Hãy xem thứ tự quy trình chuẩn trong mục phân tích bên dưới:</span>
                        </>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => {
                      setOrder(Array.from({ length: question.items?.length || 0 }, (_, i) => i));
                      setOrderChecked(false);
                      setShowExp(false);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-secondary)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      textDecoration: "underline",
                      whiteSpace: "nowrap"
                    }}
                  >
                    🔄 Sắp xếp lại
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MATCHING PAIRS */}
      {/* ========================================================================= */}
      {question.type === "matching" && (
        <div style={{ margin: "1rem 0" }}>
          <div style={{ fontSize: "0.82rem", color: "#e11d48", fontWeight: 800, marginBottom: "0.5rem" }}>
            * Chọn chức năng bên phải tương ứng với từng khái niệm / câu lệnh bên trái:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {(() => {
              const leftList = Array.isArray(question.left_items) 
                ? question.left_items 
                : (Array.isArray(question.pairs) ? question.pairs.map(p => p.left) : (question.pairs as any)?.left || []);
              const rightList = Array.isArray(question.right_items) 
                ? question.right_items 
                : (Array.isArray(question.pairs) ? question.pairs.map(p => p.right) : (question.pairs as any)?.right || []);

              return leftList.map((lVal: string, idx: number) => {
                const userChoice = pairs[lVal] || "";
                const correctPair = Array.isArray(question.pairs) ? question.pairs.find(p => p.left === lVal) : null;
                const isMatched = correctPair ? userChoice === correctPair.right : false;

                let rowBorder = "1.5px solid var(--border-medium)";
                if (!isExamMode && matchingChecked) {
                  rowBorder = isMatched ? "1.5px solid #10b981" : "1.5px solid #ef4444";
                }

                return (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "center" }}>
                    <div style={{ padding: "0.7rem 0.9rem", background: "var(--surface-subtle)", color: "var(--text-primary)", border: rowBorder, borderRadius: "8px", fontSize: "0.88rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                      {lVal}
                    </div>
                    <select
                      className="form-select"
                      value={userChoice}
                      onChange={(e) => handleMatchSelect(lVal, e.target.value)}
                      style={{
                        background: "var(--surface-card)",
                        color: "var(--text-primary)",
                        border: rowBorder,
                        padding: "0.7rem 0.85rem",
                        borderRadius: "8px",
                        fontSize: "0.86rem",
                        outline: "none"
                      }}
                    >
                      <option value="">-- Chọn ghép cặp --</option>
                      {rightList.map((rVal: string, rIdx: number) => (
                        <option key={rIdx} value={rVal}>{rVal}</option>
                      ))}
                    </select>
                  </div>
                );
              });
            })()}
          </div>

          {/* Matching Check Button in Study Mode */}
          {!isExamMode && (
            <div style={{ marginTop: "0.75rem" }}>
              {!matchingChecked ? (
                <button
                  onClick={handleCheckMatching}
                  className="btn btn-sm"
                  style={{
                    background: "linear-gradient(135deg, #e11d48, #be123c)",
                    color: "#ffffff",
                    fontWeight: 800,
                    padding: "0.55rem 1.2rem",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(225, 29, 72, 0.35)",
                    cursor: "pointer"
                  }}
                >
                  <LinkIcon size={16} />
                  <span>🔍 Kiểm Tra Ghép Cặp</span>
                </button>
              ) : (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: (() => {
                    const total = Array.isArray(question.pairs) ? question.pairs.length : 4;
                    let correctCount = 0;
                    if (Array.isArray(question.pairs)) {
                      question.pairs.forEach(p => {
                        if (pairs[p.left] === p.right) correctCount++;
                      });
                    }
                    return correctCount === total ? "rgba(16, 185, 129, 0.12)" : "rgba(225, 29, 72, 0.12)";
                  })(),
                  border: (() => {
                    const total = Array.isArray(question.pairs) ? question.pairs.length : 4;
                    let correctCount = 0;
                    if (Array.isArray(question.pairs)) {
                      question.pairs.forEach(p => {
                        if (pairs[p.left] === p.right) correctCount++;
                      });
                    }
                    return correctCount === total ? "1.5px solid #059669" : "1.5px solid #e11d48";
                  })(),
                  borderRadius: "8px",
                  padding: "0.6rem 1rem",
                  fontSize: "0.86rem",
                  fontWeight: 800
                }}>
                  {(() => {
                    const total = Array.isArray(question.pairs) ? question.pairs.length : 4;
                    let correctCount = 0;
                    if (Array.isArray(question.pairs)) {
                      question.pairs.forEach(p => {
                        if (pairs[p.left] === p.right) correctCount++;
                      });
                    }
                    const isAll = correctCount === total;
                    return (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: isAll ? "#065f46" : "#9f1239" }}>
                        {isAll ? <CheckCircle2 size={16} color="#059669" /> : <X size={16} color="#e11d48" />}
                        <span>{isAll ? `🎉 TUYỆT VỜI! Ghép đúng toàn bộ ${correctCount}/${total} cặp.` : `⚠️ Ghép đúng ${correctCount}/${total} cặp. Xem đáp án chuẩn bên dưới:`}</span>
                      </div>
                    );
                  })()}
                  <button
                    onClick={() => {
                      setPairs({});
                      setMatchingChecked(false);
                      setShowExp(false);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-secondary)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      textDecoration: "underline",
                      whiteSpace: "nowrap"
                    }}
                  >
                    🔄 Ghép lại
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOTTOM ACTIONS IN STUDY MODE */}
      {/* ========================================================================= */}
      {!isExamMode && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1.25rem",
          paddingTop: "0.85rem",
          borderTop: "1px solid var(--border-light)",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}>
          <button
            onClick={() => setShowExp(!showExp)}
            className="btn btn-secondary btn-sm"
          >
            <Lightbulb size={15} color="var(--brand-amber-dark)" />
            <span>{showExp ? "Ẩn Phân Tích Logic" : "Xem Phân Tích Logic"}</span>
          </button>

          <button
            onClick={handleAskAIExplanation}
            disabled={isAiLoading}
            className="btn btn-sm"
            style={{
              background: "rgba(124, 58, 237, 0.1)",
              color: "#7c3aed",
              fontWeight: 800,
              border: "1.5px solid rgba(124, 58, 237, 0.35)"
            }}
          >
            <Bot size={15} />
            <span>{isAiLoading ? "AI Đang Soạn Giải Thích..." : "Hỏi Thầy AI Gemini"}</span>
          </button>
        </div>
      )}

      {/* STANDARD EXPLANATION ACCORDION */}
      {showExp && !isExamMode && (
        <div style={{
          marginTop: "1rem",
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-md)",
          background: "rgba(16, 185, 129, 0.08)",
          border: "1.5px solid rgba(16, 185, 129, 0.3)",
          fontSize: "0.9rem",
          lineHeight: "1.6",
          color: "var(--text-primary)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, marginBottom: "0.4rem", color: "#059669" }}>
            <CheckCircle2 size={16} />
            <span>Phân tích đáp án chuẩn & Phương pháp suy luận:</span>
          </div>
          <div style={{ color: "var(--text-secondary)" }}>{question.explanation}</div>

          {question.type === "sequence_order" && question.items && question.correct_order && (
            <div style={{ marginTop: "0.6rem", padding: "0.6rem 0.8rem", background: "var(--surface-card)", border: "1px solid var(--border-light)", borderRadius: "6px", fontFamily: "var(--font-mono)", fontSize: "0.84rem", color: "var(--text-primary)" }}>
              <div style={{ color: "#2563eb", fontWeight: 700, marginBottom: "0.3rem" }}>Thứ tự logic chuẩn:</div>
              {question.correct_order.map((itIdx, pos) => (
                <div key={pos} style={{ padding: "0.15rem 0" }}>
                  <span style={{ color: "#059669", fontWeight: 700 }}>#{pos + 1}. </span>
                  {question.items![itIdx]}
                </div>
              ))}
            </div>
          )}

          {question.type === "matching" && Array.isArray(question.pairs) && (
            <div style={{ marginTop: "0.6rem", padding: "0.6rem 0.8rem", background: "var(--surface-card)", border: "1px solid var(--border-light)", borderRadius: "6px", fontSize: "0.84rem", color: "var(--text-primary)" }}>
              <div style={{ color: "#e11d48", fontWeight: 700, marginBottom: "0.3rem" }}>Ghép cặp chuẩn xác:</div>
              {question.pairs.map((p, pIdx) => (
                <div key={pIdx} style={{ padding: "0.2rem 0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <strong style={{ fontFamily: "var(--font-mono)", color: "#2563eb" }}>{p.left}</strong>
                  <span style={{ color: "var(--text-muted)" }}>──▶</span>
                  <span style={{ color: "var(--text-secondary)" }}>{p.right}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI EXPLANATION DRAWER */}
      {aiExplanation && !isExamMode && (
        <div style={{
          marginTop: "1rem",
          padding: "1.1rem 1.25rem",
          borderRadius: "var(--radius-md)",
          background: "rgba(124, 58, 237, 0.08)",
          border: "1.5px solid rgba(124, 58, 237, 0.25)",
          fontSize: "0.9rem",
          lineHeight: "1.6",
          color: "var(--text-primary)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: 800, color: "#7c3aed" }}>
              <Sparkles size={16} />
              <span>Trợ Lý Sư Phạm AI Gemini:</span>
            </div>
            <button
              onClick={handleCopyExplanation}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
            >
              {copied ? <Check size={12} color="#059669" /> : <Copy size={12} />}
              <span>{copied ? "Đã chép" : "Sao chép"}</span>
            </button>
          </div>
          <div style={{ whiteSpace: "pre-line", color: "var(--text-primary)" }}>{aiExplanation}</div>
        </div>
      )}
    </div>
  );
}
