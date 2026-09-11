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
  CheckSquare,
  Eye,
  AlertCircle
} from "lucide-react";
import { getWhyWrongExplanation } from "@/lib/quizFeedbackEngine";
import InteractiveSequenceOrdering from "./InteractiveSequenceOrdering";
import AIMarkdownRenderer from "./AIMarkdownRenderer";

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
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // 1. FILL IN THE BLANK STATES
  const [fillInput, setFillInput] = useState<string>(
    userAnswer !== undefined && userAnswer !== null ? String(userAnswer) : ""
  );
  const [fillChecked, setFillChecked] = useState<boolean>(
    !isExamMode && (userAnswer !== undefined && userAnswer !== null && userAnswer !== "")
  );

  // 2. MULTIPLE CHOICE STATES
  const [multiSelected, setMultiSelected] = useState<number[]>(
    Array.isArray(userAnswer) ? userAnswer : []
  );
  const [multiChecked, setMultiChecked] = useState<boolean>(
    !isExamMode && (Array.isArray(userAnswer) && userAnswer.length > 0)
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

  // Reset question-level state only when switching to a different question
  useEffect(() => {
    setAiExplanation(null);
    setShowSolution(false);
    if (!isExamMode && userAnswer !== undefined && userAnswer !== null && userAnswer !== "") {
      setShowExp(true);
    } else {
      setShowExp(showExplanationInitially);
    }
  }, [question.id, showExplanationInitially]);

  // Re-sync states when external userAnswer changes
  useEffect(() => {
    setLocalAnswer(userAnswer);
    setFillInput(userAnswer !== undefined && userAnswer !== null ? String(userAnswer) : "");
    setFillChecked(!isExamMode && userAnswer !== undefined && userAnswer !== null && userAnswer !== "");
    setMultiSelected(Array.isArray(userAnswer) ? userAnswer : []);
    setMultiChecked(!isExamMode && Array.isArray(userAnswer) && userAnswer.length > 0);
    setOrder(
      Array.isArray(userAnswer) && userAnswer.length > 0 
        ? userAnswer 
        : Array.from({ length: question.items?.length || 0 }, (_, i) => i)
    );
    setOrderChecked(!isExamMode && Array.isArray(userAnswer) && userAnswer.length > 0);
    setPairs(typeof userAnswer === "object" && userAnswer !== null && !Array.isArray(userAnswer) ? userAnswer : {});
    setMatchingChecked(!isExamMode && typeof userAnswer === "object" && userAnswer !== null && Object.keys(userAnswer).length > 0);

    const hasAns = userAnswer !== undefined && userAnswer !== null && userAnswer !== "" && 
      (Array.isArray(userAnswer) ? userAnswer.length > 0 : true);

    const isAnsCorrect = (() => {
      if (!hasAns) return false;
      if (Array.isArray(question.correct_answer)) {
        const corr = [...question.correct_answer].sort().join(",");
        const user = (Array.isArray(userAnswer) ? [...userAnswer] : []).sort().join(",");
        return corr === user;
      }
      return String(userAnswer).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase();
    })();

    if (!isExamMode && hasAns && isAnsCorrect) {
      setShowExp(true);
      setShowSolution(true);
    }
  }, [question.id, userAnswer, isExamMode]);

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
    const isCorrect = String(idx) === String(question.correct_answer);
    if (!isExamMode) {
      if (isCorrect) {
        setShowExp(true);
        setShowSolution(true);
      } else {
        // Khi chọn sai: KHÔNG mở đáp án chuẩn và giải thích chuẩn để tránh spoil đáp án
        setShowExp(false);
        setShowSolution(false);
      }
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
    const corr = Array.isArray(question.correct_answer) ? [...question.correct_answer].sort().join(",") : "";
    const user = [...multiSelected].sort().join(",");
    const isAll = corr === user;
    if (!isExamMode) {
      if (isAll) {
        setShowExp(true);
        setShowSolution(true);
      } else {
        setShowExp(false);
        setShowSolution(false);
      }
    }
  };

  // C. Fill in the blank
  const handleCheckFill = () => {
    const val = fillInput.trim();
    if (!val) return;
    setFillChecked(true);
    updateAnswer(val);
    const isCorr = val.toLowerCase() === String(question.correct_answer || "").trim().toLowerCase();
    if (!isExamMode) {
      if (isCorr) {
        setShowExp(true);
        setShowSolution(true);
      } else {
        setShowExp(false);
        setShowSolution(false);
      }
    }
  };

  const handleResetFill = () => {
    setFillInput("");
    setFillChecked(false);
    updateAnswer("");
    setShowExp(false);
    setShowSolution(false);
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
      <h3 style={{ fontSize: "0.98rem", fontWeight: 800, marginBottom: "0.65rem", color: "var(--text-primary)", lineHeight: "1.45" }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", margin: "1rem 0" }}>
          {(() => {
            const hasAnswered = currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== "";
            const isAnswerCorrect = hasAnswered && String(currentAnswer) === String(question.correct_answer);
            const shouldRevealCorrect = isExamMode ? false : (isAnswerCorrect || showSolution || (showExplanationInitially && !hasAnswered));

            return (
              <>
                {question.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = hasAnswered && String(currentAnswer) === String(idx);
                  const isOptionCorrect = String(question.correct_answer) === String(idx);

                  let itemClass = "option-item";
                  if (isExamMode) {
                    if (isSelected) itemClass += " selected";
                  } else {
                    if (isSelected) {
                      itemClass += isOptionCorrect ? " correct" : " wrong";
                    } else if (shouldRevealCorrect && isOptionCorrect) {
                      itemClass += " correct";
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
                      <div style={{ flex: 1, fontSize: "0.84rem", fontWeight: isSelected ? 700 : 500 }}>
                        {opt}
                      </div>

                      {/* Khi học viên chọn đúng */}
                      {!isExamMode && isSelected && isOptionCorrect && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: "999px",
                            background: "rgba(16, 185, 129, 0.12)",
                            color: "#059669"
                          }}>
                            Chính xác (Em đã chọn)
                          </span>
                          <CheckCircle2 size={15} color="#10b981" />
                        </div>
                      )}

                      {/* Khi học viên chọn sai: chỉ làm nổi bật phương án này là sai, KHÔNG lộ phương án đúng */}
                      {!isExamMode && isSelected && !isOptionCorrect && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: "999px",
                            background: "rgba(239, 68, 68, 0.12)",
                            color: "#dc2626"
                          }}>
                            Em đã chọn (Chưa đúng)
                          </span>
                          <X size={15} color="#ef4444" />
                        </div>
                      )}

                      {/* Chỉ hiển thị nhãn Đáp án chuẩn khi đã chọn đúng hoặc bấm 'Xem đáp án chuẩn' */}
                      {!isExamMode && !isSelected && shouldRevealCorrect && isOptionCorrect && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: "999px",
                            background: "rgba(16, 185, 129, 0.12)",
                            color: "#059669"
                          }}>
                            Đáp án chuẩn
                          </span>
                          <CheckCircle2 size={15} color="#10b981" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Phản hồi sư phạm chế độ Ôn tập */}
                {!isExamMode && hasAnswered && (
                  <div>
                    {isAnswerCorrect ? (
                      /* 1. Khi học viên chọn đúng */
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "rgba(16, 185, 129, 0.1)",
                        border: "1.5px solid #059669",
                        borderRadius: "8px",
                        padding: "0.45rem 0.85rem",
                        marginTop: "0.4rem",
                        color: "#065f46",
                        fontSize: "0.82rem",
                        fontWeight: 700
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0 }} />
                          <span>🎉 HOÀN TOÀN CHÍNH XÁC! Em đã chọn đúng phương án {String.fromCharCode(65 + Number(question.correct_answer))}.</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); updateAnswer(undefined); setShowExp(false); setShowSolution(false); }}
                          className="btn-retry btn-retry-correct"
                        >
                          <RotateCcw size={12} />
                          <span>Làm lại</span>
                        </button>
                      </div>
                    ) : (
                      /* 2. Khi học viên chọn sai: Giảng giải TẠI SAO SAI, không vội vàng tiết lộ đáp án đúng */
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        background: "rgba(239, 68, 68, 0.08)",
                        border: "1.5px solid #dc2626",
                        borderRadius: "8px",
                        padding: "0.6rem 0.85rem",
                        marginTop: "0.45rem"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.4rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#991b1b", fontWeight: 800, fontSize: "0.84rem" }}>
                            <X size={16} color="#dc2626" style={{ flexShrink: 0 }} />
                            <span>LỰA CHỌN CHƯA CHÍNH XÁC: Em đã chọn "{String.fromCharCode(65 + Number(currentAnswer))}. {question.options[Number(currentAnswer)]}"</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateAnswer(undefined); setShowExp(false); setShowSolution(false); }}
                              className="btn-retry btn-retry-wrong"
                            >
                              <RotateCcw size={13} />
                              <span>Thử chọn lại</span>
                            </button>
                            {!showSolution && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setShowSolution(true); setShowExp(true); }}
                                className="btn btn-sm"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  padding: "5px 12px",
                                  borderRadius: "6px",
                                  fontSize: "0.8rem",
                                  fontWeight: 700,
                                  background: "var(--surface-card)",
                                  border: "1px solid var(--border-medium)",
                                  color: "var(--text-secondary)",
                                  cursor: "pointer",
                                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                }}
                              >
                                <Eye size={13} />
                                <span>Xem đáp án chuẩn</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Hộp phân tích TẠI SAO PHƯƠNG ÁN HỌC VIÊN VỪA CHỌN LÀ SAI */}
                        <div style={{
                          background: "var(--surface-card)",
                          border: "1px solid rgba(220, 38, 38, 0.25)",
                          borderRadius: "8px",
                          padding: "0.55rem 0.8rem",
                          fontSize: "0.8rem",
                          lineHeight: "1.5",
                          color: "var(--text-primary)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#b91c1c", fontWeight: 800, marginBottom: "0.25rem" }}>
                            <AlertCircle size={14} />
                            <span>Phân tích vì sao phương án này chưa đúng:</span>
                          </div>
                          <div style={{ color: "var(--text-secondary)" }}>
                            {getWhyWrongExplanation(question, currentAnswer)}
                          </div>
                        </div>

                        {/* Nếu học viên bấm Xem đáp án chuẩn thì mới hiển thị đáp án đúng */}
                        {showSolution && (
                          <div style={{
                            background: "rgba(16, 185, 129, 0.08)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            borderRadius: "8px",
                            padding: "0.55rem 0.8rem",
                            fontSize: "0.8rem",
                            lineHeight: "1.5",
                            color: "var(--text-primary)",
                            animation: "fadeIn 0.2s ease"
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#059669", fontWeight: 800 }}>
                              <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                              <span>Đáp án chuẩn xác là: <strong style={{ color: "#047857" }}>{String.fromCharCode(65 + Number(question.correct_answer))}. {question.options[Number(question.correct_answer)]}</strong> (Xem phân tích suy luận chi tiết bên dưới)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            );
          })()}
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
            const isAllCorrect = (() => {
              const corr = Array.isArray(question.correct_answer) ? [...question.correct_answer].sort().join(",") : "";
              const user = [...multiSelected].sort().join(",");
              return corr === user;
            })();
            const shouldReveal = isAllCorrect || showSolution;

            let itemClass = "option-item";
            if (isExamMode) {
              if (isSelected) itemClass += " selected";
            } else {
              if (multiChecked) {
                if (isOptionCorrect && (isSelected || shouldReveal)) itemClass += " correct";
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
                  border: isSelected ? "2px solid #7c3aed" : "1.5px solid var(--border-medium)",
                  background: isSelected ? "#7c3aed" : "var(--surface-card)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  transition: "all 0.15s ease"
                }}>
                  {isSelected && <Check size={14} />}
                </div>
                <div style={{ flex: 1, fontSize: "0.84rem", fontWeight: isSelected ? 700 : 500 }}>
                  {opt}
                </div>
                {!isExamMode && multiChecked && isOptionCorrect && (isSelected || shouldReveal) && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: "999px",
                      background: "rgba(16, 185, 129, 0.12)",
                      color: "#059669"
                    }}>
                      {isSelected ? "Đã chọn đúng" : "Đáp án chuẩn"}
                    </span>
                    <CheckCircle2 size={15} color="#10b981" />
                  </div>
                )}
                {!isExamMode && multiChecked && isSelected && !isOptionCorrect && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: "999px",
                      background: "rgba(239, 68, 68, 0.12)",
                      color: "#dc2626"
                    }}>
                      Em đã chọn (Chưa đúng)
                    </span>
                    <X size={15} color="#ef4444" />
                  </div>
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
                    padding: "0.4rem 0.95rem",
                    fontSize: "0.8rem",
                    borderRadius: "8px",
                    boxShadow: multiSelected.length > 0 ? "0 3px 10px rgba(124, 58, 237, 0.35)" : "none",
                    cursor: multiSelected.length > 0 ? "pointer" : "not-allowed"
                  }}
                >
                  <CheckSquare size={15} />
                  <span>Kiểm Tra Các Đáp Án Đã Chọn ({multiSelected.length} lựa chọn)</span>
                </button>
              ) : (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.55rem",
                  background: (() => {
                    const corr = Array.isArray(question.correct_answer) ? [...question.correct_answer].sort().join(",") : "";
                    const user = [...multiSelected].sort().join(",");
                    return corr === user ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.08)";
                  })(),
                  border: `1.5px solid ${(() => {
                    const corr = Array.isArray(question.correct_answer) ? [...question.correct_answer].sort().join(",") : "";
                    const user = [...multiSelected].sort().join(",");
                    return corr === user ? "#059669" : "#dc2626";
                  })()}`,
                  borderRadius: "8px",
                  padding: "0.55rem 0.85rem"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0.4rem"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      color: (() => {
                        const corr = Array.isArray(question.correct_answer) ? [...question.correct_answer].sort().join(",") : "";
                        const user = [...multiSelected].sort().join(",");
                        return corr === user ? "#065f46" : "#991b1b";
                      })()
                    }}>
                      {(() => {
                        const corr = Array.isArray(question.correct_answer) ? [...question.correct_answer].sort().join(",") : "";
                        const user = [...multiSelected].sort().join(",");
                        if (corr === user) {
                          return (
                            <>
                              <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                              <span>🎉 CHÍNH XÁC 100%! Em đã chọn đầy đủ các phương án đúng.</span>
                            </>
                          );
                        }
                        return (
                          <>
                            <X size={18} color="#dc2626" style={{ flexShrink: 0 }} />
                            <span>LỰA CHỌN CHƯA ĐẦY ĐỦ / CHƯA ĐÚNG: Em hãy xem các phương án được đánh dấu đỏ/xanh hoặc thử chọn lại.</span>
                          </>
                        );
                      })()}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        onClick={() => {
                          setMultiSelected([]);
                          setMultiChecked(false);
                          updateAnswer([]);
                          setShowExp(false);
                          setShowSolution(false);
                        }}
                        className={(() => {
                          const corr = Array.isArray(question.correct_answer) ? [...question.correct_answer].sort().join(",") : "";
                          const user = [...multiSelected].sort().join(",");
                          return corr === user ? "btn-retry btn-retry-correct" : "btn-retry btn-retry-wrong";
                        })()}
                      >
                        <RotateCcw size={13} />
                        <span>Thử chọn lại</span>
                      </button>
                      {!showSolution && (() => {
                        const corr = Array.isArray(question.correct_answer) ? [...question.correct_answer].sort().join(",") : "";
                        const user = [...multiSelected].sort().join(",");
                        return corr !== user;
                      })() && (
                        <button
                          onClick={() => { setShowSolution(true); setShowExp(true); }}
                          className="btn btn-sm"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "5px 12px",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            background: "var(--surface-card)",
                            border: "1px solid var(--border-medium)",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                          }}
                        >
                          <Eye size={13} />
                          <span>Xem đáp án chuẩn</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {showSolution && (
                    <div style={{
                      background: "rgba(16, 185, 129, 0.08)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      borderRadius: "6px",
                      padding: "0.6rem 0.85rem",
                      fontSize: "0.86rem",
                      color: "var(--text-primary)"
                    }}>
                      <strong style={{ color: "#059669" }}>Tất cả đáp án đúng gồm: </strong>
                      {Array.isArray(question.correct_answer) ? question.correct_answer.map(i => `${String.fromCharCode(65 + i)} (${question.options![i]})`).join(", ") : ""}
                    </div>
                  )}
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

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="text"
              className="form-input"
              style={{
                flex: "1 1 240px",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "var(--text-primary)",
                background: "var(--surface-card)",
                border: (!isExamMode && fillChecked) 
                  ? (fillInput.trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase() ? "2px solid #10b981" : "2px solid #ef4444")
                  : "1.5px solid var(--border-medium)",
                padding: "0.45rem 0.8rem",
                borderRadius: "6px",
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
                  padding: "0.45rem 0.95rem",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  borderRadius: "6px",
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
                      padding: "0.65rem 1rem",
                      borderRadius: "8px",
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1.5px solid #059669",
                      color: "#065f46",
                      fontSize: "0.88rem",
                      fontWeight: 700
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <CheckCircle2 size={17} color="#059669" style={{ flexShrink: 0 }} />
                        <span>CHÍNH XÁC 100%! Từ khóa '{fillInput}' khớp hoàn toàn với đáp án.</span>
                      </div>
                      <button
                        onClick={handleResetFill}
                        className="btn-retry btn-retry-correct"
                      >
                        <RotateCcw size={13} />
                        <span>Điền lại</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.65rem 1rem",
                    borderRadius: "8px",
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1.5px solid #dc2626",
                    color: "#991b1b",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    flexWrap: "wrap",
                    gap: "0.5rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <X size={17} color="#dc2626" style={{ flexShrink: 0 }} />
                      <span>CHƯA CHÍNH XÁC! Từ khóa "{fillInput}" chưa đúng với cú pháp Python.</span>
                      {showSolution && (
                        <span>Từ khóa chuẩn xác: <strong style={{ color: "#ffffff", fontFamily: "var(--font-mono)", background: "#059669", padding: "2px 8px", borderRadius: "4px" }}>{question.correct_answer}</strong></span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        onClick={handleResetFill}
                        className="btn-retry btn-retry-wrong"
                      >
                        <RotateCcw size={13} />
                        <span>Thử điền lại</span>
                      </button>
                      {!showSolution && (
                        <button
                          onClick={() => { setShowSolution(true); setShowExp(true); }}
                          className="btn btn-sm"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "5px 12px",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            background: "var(--surface-card)",
                            border: "1px solid var(--border-medium)",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                          }}
                        >
                          <Eye size={13} />
                          <span>Xem đáp án chuẩn</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SEQUENCE ORDERING (2 CỘT TƯƠNG TÁC KÉO THẢ & CHẠY THỬ) */}
      {/* ========================================================================= */}
      {question.type === "sequence_order" && question.items && (
        <InteractiveSequenceOrdering
          question={question}
          userAnswer={currentAnswer}
          onAnswerChange={updateAnswer}
          isExamMode={isExamMode}
        />
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
                  <div key={idx} className="matching-pair-row">
                    <div style={{ padding: "0.45rem 0.75rem", background: "var(--surface-subtle)", color: "var(--text-primary)", border: rowBorder, borderRadius: "6px", fontSize: "0.82rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
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
                        padding: "0.45rem 0.75rem",
                        borderRadius: "6px",
                        fontSize: "0.82rem",
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
            <div style={{ marginTop: "0.6rem" }}>
              {!matchingChecked ? (
                <button
                  onClick={handleCheckMatching}
                  className="btn btn-sm"
                  style={{
                    background: "linear-gradient(135deg, #e11d48, #be123c)",
                    color: "#ffffff",
                    fontWeight: 800,
                    padding: "0.4rem 0.95rem",
                    fontSize: "0.8rem",
                    borderRadius: "6px",
                    boxShadow: "0 3px 10px rgba(225, 29, 72, 0.35)",
                    cursor: "pointer"
                  }}
                >
                  <LinkIcon size={15} />
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
                    return correctCount === total ? "rgba(16, 185, 129, 0.1)" : "rgba(225, 29, 72, 0.08)";
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
                  padding: "0.65rem 1rem",
                  fontSize: "0.88rem",
                  fontWeight: 700
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
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: isAll ? "#065f46" : "#9f1239" }}>
                          {isAll ? <CheckCircle2 size={17} color="#059669" style={{ flexShrink: 0 }} /> : <X size={17} color="#e11d48" style={{ flexShrink: 0 }} />}
                          <span>{isAll ? `TUYỆT VỜI! Ghép đúng toàn bộ ${correctCount}/${total} cặp.` : `Ghép đúng ${correctCount}/${total} cặp. Xem đáp án chuẩn bên dưới:`}</span>
                        </div>
                        <button
                          onClick={() => {
                            setPairs({});
                            setMatchingChecked(false);
                            setShowExp(false);
                          }}
                          className={isAll ? "btn-retry btn-retry-correct" : "btn-retry btn-retry-wrong"}
                        >
                          <RotateCcw size={13} />
                          <span>Ghép lại</span>
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STANDARD EXPLANATION ACCORDION (Revealed under feedback banner in Study Mode) */}
      {(() => {
        const hasAnswered = currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== "";
        const isAnswerCorrect = (() => {
          if (!hasAnswered) return false;
          if (Array.isArray(question.correct_answer)) {
            const corr = [...question.correct_answer].sort().join(",");
            const user = (Array.isArray(currentAnswer) ? [...currentAnswer] : []).sort().join(",");
            return corr === user;
          }
          return String(currentAnswer).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase();
        })();
        const shouldShowStandardExp = showExp && !isExamMode && (isAnswerCorrect || showSolution || !hasAnswered);

        if (!shouldShowStandardExp) return null;

        return (
          <div style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.95rem",
            borderRadius: "var(--radius-sm)",
            background: "rgba(16, 185, 129, 0.08)",
            border: "1.5px solid rgba(16, 185, 129, 0.3)",
            fontSize: "0.82rem",
            lineHeight: "1.55",
            color: "var(--text-primary)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, marginBottom: "0.3rem", color: "#059669" }}>
              <Lightbulb size={15} color="#059669" />
              <span>Phân tích đáp án chuẩn & Phương pháp suy luận:</span>
            </div>
            <div style={{ color: "var(--text-secondary)", whiteSpace: "pre-line" }}>{question.explanation}</div>

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
        );
      })()}

      {/* BOTTOM ACTIONS IN STUDY MODE */}
      {!isExamMode && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--border-light)",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}>
          {(() => {
            const hasAnswered = currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== "";
            const isAnswerCorrect = (() => {
              if (!hasAnswered) return false;
              if (Array.isArray(question.correct_answer)) {
                const corr = [...question.correct_answer].sort().join(",");
                const user = (Array.isArray(currentAnswer) ? [...currentAnswer] : []).sort().join(",");
                return corr === user;
              }
              return String(currentAnswer).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase();
            })();
            const isRevealed = showExp && (isAnswerCorrect || showSolution || !hasAnswered);

            return (
              <button
                onClick={() => {
                  const next = !isRevealed;
                  setShowExp(next);
                  if (next) setShowSolution(true);
                  else setShowSolution(false);
                }}
                className="btn btn-secondary btn-sm"
              >
                <Lightbulb size={15} color="var(--brand-amber-dark)" />
                <span>{isRevealed ? "Ẩn Phân Tích Logic" : "Xem Phân Tích Logic"}</span>
              </button>
            );
          })()}

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

      {/* AI EXPLANATION DRAWER */}
      {aiExplanation && !isExamMode && (
        <div style={{
          marginTop: "0.85rem",
          padding: "0.75rem 0.95rem",
          borderRadius: "var(--radius-sm)",
          background: "rgba(124, 58, 237, 0.08)",
          border: "1.5px solid rgba(124, 58, 237, 0.25)",
          fontSize: "0.82rem",
          lineHeight: "1.55",
          color: "var(--text-primary)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, color: "#7c3aed" }}>
              <Sparkles size={15} />
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
          <AIMarkdownRenderer content={aiExplanation} />
        </div>
      )}
    </div>
  );
}
