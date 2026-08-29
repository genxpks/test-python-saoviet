"use client";

import { useState } from "react";
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
  ToggleLeft
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
  const [showExp, setShowExp] = useState(showExplanationInitially);
  const [order, setOrder] = useState<number[]>(
    Array.isArray(userAnswer) ? userAnswer : Array.from({ length: question.items?.length || 0 }, (_, i) => i)
  );
  const [pairs, setPairs] = useState<Record<string, string>>(userAnswer || {});

  // AI Explanation State
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSingleSelect = (idx: number) => {
    if (onAnswerChange) onAnswerChange(idx);
  };

  const handleMultiSelect = (idx: number) => {
    let list: number[] = Array.isArray(userAnswer) ? [...userAnswer] : [];
    if (list.includes(idx)) list = list.filter(x => x !== idx);
    else list.push(idx);
    if (onAnswerChange) onAnswerChange(list);
  };

  const handleFillChange = (val: string) => {
    if (onAnswerChange) onAnswerChange(val.trim());
  };

  const handleMoveOrder = (pos: number, dir: number) => {
    const targetPos = pos + dir;
    if (targetPos >= 0 && targetPos < order.length) {
      const next = [...order];
      const temp = next[pos];
      next[pos] = next[targetPos];
      next[targetPos] = temp;
      setOrder(next);
      if (onAnswerChange) onAnswerChange(next);
    }
  };

  const handleMatchSelect = (left: string, right: string) => {
    const next = { ...pairs, [left]: right };
    setPairs(next);
    if (onAnswerChange) onAnswerChange(next);
  };

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

  // Distinct high-contrast theme per question archetype
  const getBadgeTheme = (type?: string) => {
    switch (type) {
      case "single_choice":
        return { bg: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.4)", icon: HelpCircle };
      case "true_false":
        return { bg: "rgba(14, 165, 233, 0.15)", color: "#38bdf8", border: "rgba(14, 165, 233, 0.4)", icon: ToggleLeft };
      case "multiple_choice":
        return { bg: "rgba(168, 85, 247, 0.15)", color: "#c084fc", border: "rgba(168, 85, 247, 0.4)", icon: CheckCircle2 };
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

      {/* RENDER FORM BY TYPE */}
      {/* 1. SINGLE CHOICE & TRUE/FALSE */}
      {(question.type === "single_choice" || question.type === "true_false" || !question.type) && question.options && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", margin: "1rem 0" }}>
          {question.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = userAnswer === idx;
            const isCorrect = showExp && question.correct_answer === idx;
            const isWrong = showExp && isSelected && !isCorrect;

            let itemClass = "option-item";
            if (isSelected) itemClass += " selected";
            if (isCorrect) itemClass += " correct";
            if (isWrong) itemClass += " wrong";

            return (
              <div
                key={idx}
                className={itemClass}
                onClick={() => handleSingleSelect(idx)}
                role="button"
                tabIndex={0}
              >
                <div className="option-letter">{letter}</div>
                <div style={{ flex: 1, fontSize: "0.92rem", fontWeight: isSelected ? 700 : 500 }}>
                  {opt}
                </div>
                {showExp && isCorrect && <CheckCircle2 size={18} color="#059669" />}
                {showExp && isWrong && <X size={18} color="#e11d48" />}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. MULTIPLE CHOICE */}
      {question.type === "multiple_choice" && question.options && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", margin: "1rem 0" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--brand-violet)", fontWeight: 700, marginBottom: "0.3rem" }}>
            * Chọn tất cả các đáp án đúng:
          </div>
          {question.options.map((opt, idx) => {
            const isSelected = Array.isArray(userAnswer) && userAnswer.includes(idx);
            const isCorrect = showExp && Array.isArray(question.correct_answer) && question.correct_answer.includes(idx);

            let itemClass = "option-item";
            if (isSelected) itemClass += " selected";
            if (isCorrect) itemClass += " correct";

            return (
              <div
                key={idx}
                className={itemClass}
                onClick={() => handleMultiSelect(idx)}
                role="button"
                tabIndex={0}
              >
                <div style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "6px",
                  border: isSelected ? "2px solid var(--brand-violet)" : "1.5px solid var(--border-medium)",
                  background: isSelected ? "var(--brand-violet)" : "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff"
                }}>
                  {isSelected && <Check size={14} />}
                </div>
                <div style={{ flex: 1, fontSize: "0.92rem" }}>{opt}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. FILL IN THE BLANK */}
      {question.type === "fill_blank" && (
        <div style={{ margin: "1rem 0" }}>
          <label className="form-label" style={{ color: "var(--brand-amber-dark)" }}>
            Nhập kết quả hoặc từ khóa chính xác:
          </label>
          <input
            type="text"
            className="form-input"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1rem", color: "var(--brand-primary)" }}
            placeholder="Ví dụ: len, append, range, [1, 2, 3]..."
            value={userAnswer || ""}
            onChange={(e) => handleFillChange(e.target.value)}
          />
        </div>
      )}

      {/* 4. SEQUENCE ORDERING */}
      {question.type === "sequence_order" && question.items && (
        <div style={{ margin: "1rem 0" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--brand-emerald-dark)", fontWeight: 700, marginBottom: "0.4rem" }}>
            * Sắp xếp các dòng lệnh theo đúng logic thực thi:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {order.map((itemIdx, pos) => (
              <div
                key={pos}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  background: "var(--surface-subtle)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-sm)"
                }}
              >
                <span style={{ fontWeight: 800, color: "var(--brand-emerald)", fontSize: "0.85rem" }}>
                  #{pos + 1}
                </span>
                <span style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "0.88rem" }}>
                  {question.items![itemIdx]}
                </span>
                <div style={{ display: "flex", gap: "0.2rem" }}>
                  <button
                    disabled={pos === 0}
                    onClick={() => handleMoveOrder(pos, -1)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "0.25rem 0.4rem" }}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    disabled={pos === order.length - 1}
                    onClick={() => handleMoveOrder(pos, 1)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "0.25rem 0.4rem" }}
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MATCHING PAIRS */}
      {question.type === "matching" && (
        <div style={{ margin: "1rem 0" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--brand-rose)", fontWeight: 700, marginBottom: "0.4rem" }}>
            * Ghép cặp đúng giữa 2 cột:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {(() => {
              const leftList = Array.isArray(question.left_items) 
                ? question.left_items 
                : (Array.isArray(question.pairs) ? question.pairs.map(p => p.left) : (question.pairs as any)?.left || []);
              const rightList = Array.isArray(question.right_items) 
                ? question.right_items 
                : (Array.isArray(question.pairs) ? question.pairs.map(p => p.right) : (question.pairs as any)?.right || []);

              return leftList.map((lVal: string, idx: number) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "center" }}>
                  <div style={{ padding: "0.65rem 0.9rem", background: "rgba(30, 41, 59, 0.9)", color: "#ffffff", border: "1.5px solid #475569", borderRadius: "8px", fontSize: "0.88rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                    {lVal}
                  </div>
                  <select
                    className="form-select"
                    value={pairs[lVal] || ""}
                    onChange={(e) => handleMatchSelect(lVal, e.target.value)}
                    style={{
                      background: "rgba(15, 23, 42, 0.95)",
                      color: "#f8fafc",
                      border: "1.5px solid #475569",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "8px",
                      fontSize: "0.86rem"
                    }}
                  >
                    <option value="" style={{ background: "#0f172a", color: "#94a3b8" }}>-- Chọn ghép cặp --</option>
                    {rightList.map((rVal: string, rIdx: number) => (
                      <option key={rIdx} value={rVal} style={{ background: "#0f172a", color: "#f8fafc" }}>{rVal}</option>
                    ))}
                  </select>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* BOTTOM ACTIONS IN STUDY MODE */}
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
              background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(37, 99, 235, 0.15))",
              color: "#c084fc",
              border: "1px solid rgba(168, 85, 247, 0.35)"
            }}
          >
            <Bot size={15} />
            <span>{isAiLoading ? "AI Đang Soạn Giải Thích..." : "Hỏi Thầy AI Gemini"}</span>
          </button>
        </div>
      )}

      {/* STANDARD EXPLANATION ACCORDION */}
      {showExp && question.explanation && !isExamMode && (
        <div style={{
          marginTop: "1rem",
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-md)",
          background: "rgba(5, 150, 105, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          fontSize: "0.9rem",
          lineHeight: "1.6",
          color: "#bbf7d0"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, marginBottom: "0.4rem", color: "#34d399" }}>
            <CheckCircle2 size={16} />
            <span>Phân tích đáp án chuẩn:</span>
          </div>
          <div>{question.explanation}</div>
        </div>
      )}

      {/* AI EXPLANATION DRAWER */}
      {aiExplanation && !isExamMode && (
        <div style={{
          marginTop: "1rem",
          padding: "1.1rem 1.25rem",
          borderRadius: "var(--radius-md)",
          background: "rgba(124, 58, 237, 0.12)",
          border: "1px solid rgba(168, 85, 247, 0.3)",
          fontSize: "0.9rem",
          lineHeight: "1.6",
          color: "#e9d5ff"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: 800, color: "#c084fc" }}>
              <Sparkles size={16} />
              <span>Trợ Lý Sư Phạm AI Gemini:</span>
            </div>
            <button
              onClick={handleCopyExplanation}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
            >
              {copied ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
              <span>{copied ? "Đã chép" : "Sao chép"}</span>
            </button>
          </div>
          <div style={{ whiteSpace: "pre-line", color: "#f3e8ff" }}>{aiExplanation}</div>
        </div>
      )}
    </div>
  );
}
