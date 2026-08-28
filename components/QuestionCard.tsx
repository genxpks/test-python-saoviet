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
  Code2
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

  // Type badge styling
  const getTypeBadgeColor = () => {
    switch (question.type) {
      case "single_choice": return { bg: "rgba(37, 99, 235, 0.1)", text: "var(--brand-primary)", border: "rgba(37, 99, 235, 0.25)" };
      case "true_false": return { bg: "rgba(16, 185, 129, 0.1)", text: "var(--brand-emerald)", border: "rgba(16, 185, 129, 0.25)" };
      case "multiple_choice": return { bg: "rgba(139, 92, 246, 0.1)", text: "var(--brand-violet)", border: "rgba(139, 92, 246, 0.25)" };
      case "fill_blank": return { bg: "rgba(245, 158, 11, 0.1)", text: "var(--brand-amber)", border: "rgba(245, 158, 11, 0.25)" };
      case "sequence_order": return { bg: "rgba(6, 182, 212, 0.1)", text: "var(--brand-cyan)", border: "rgba(6, 182, 212, 0.25)" };
      case "matching": return { bg: "rgba(244, 63, 94, 0.1)", text: "var(--brand-rose)", border: "rgba(244, 63, 94, 0.25)" };
      default: return { bg: "rgba(100, 116, 139, 0.1)", text: "var(--text-muted)", border: "rgba(100, 116, 139, 0.25)" };
    }
  };

  const badgeStyle = getTypeBadgeColor();

  return (
    <div className="q-card">
      {/* Header Info */}
      <div className="q-card-header">
        <span
          className="q-badge"
          style={{
            background: badgeStyle.bg,
            color: badgeStyle.text,
            borderColor: badgeStyle.border
          }}
        >
          <Code2 size={13} />
          <span>CÂU {qNum} • {question.type_name.toUpperCase()}</span>
        </span>

        {!isExamMode && (
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
            Kho 120 Câu Sao Việt
          </span>
        )}
      </div>

      {/* Question Title */}
      <div style={{ fontSize: "1.08rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.2rem", lineHeight: "1.55" }}>
        {question.question}
      </div>

      {/* 1. Single Choice or True / False */}
      {(question.type === "single_choice" || question.type === "true_false") && question.options && (
        <div className="options-list">
          {question.options.map((opt, idx) => {
            const isSelected = userAnswer === idx;
            const labels = ["A", "B", "C", "D"];
            return (
              <div
                key={idx}
                className={`option-item ${isSelected ? "selected" : ""}`}
                onClick={() => handleSingleSelect(idx)}
              >
                <div className="opt-prefix">
                  {question.type === "true_false" ? (idx === 0 ? "✓" : "✗") : labels[idx]}
                </div>
                <span style={{ flex: 1 }}>{opt}</span>
                {isSelected && (
                  <CheckCircle2 size={18} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Multiple Choice Checkbox */}
      {question.type === "multiple_choice" && question.options && (
        <div className="options-list">
          {question.options.map((opt, idx) => {
            const isChecked = Array.isArray(userAnswer) && userAnswer.includes(idx);
            const labels = ["A", "B", "C", "D"];
            return (
              <div
                key={idx}
                className={`option-item ${isChecked ? "selected" : ""}`}
                onClick={() => handleMultiSelect(idx)}
              >
                <div className="opt-prefix">
                  {labels[idx]}
                </div>
                <span style={{ flex: 1 }}>{opt}</span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "var(--brand-primary)",
                    cursor: "pointer"
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Fill in the Blank */}
      {question.type === "fill_blank" && (
        <div style={{ margin: "1.2rem 0" }}>
          <label style={{ display: "block", fontSize: "0.86rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--text-secondary)" }}>
            Nhập câu trả lời hoặc từ khóa vào ô bên dưới:
          </label>
          <input
            type="text"
            className="form-input"
            defaultValue={userAnswer || ""}
            onChange={(e) => handleFillChange(e.target.value)}
            placeholder="Gõ từ khóa còn thiếu..."
            style={{ maxWidth: "420px" }}
          />
        </div>
      )}

      {/* 4. Sequence Order */}
      {question.type === "sequence_order" && question.items && (
        <div style={{
          background: "var(--surface-subtle)",
          padding: "1rem 1.2rem",
          borderRadius: "var(--radius-md)",
          margin: "1.2rem 0",
          border: "1px solid var(--border-light)"
        }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Sparkles size={14} color="var(--brand-cyan)" />
            <span>Bấm nút ▲ / ▼ để di chuyển sắp xếp lại các dòng lệnh theo logic thực thi:</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {order.map((itemIdx, pos) => (
              <div
                key={pos}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#ffffff",
                  padding: "0.6rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-light)",
                  boxShadow: "var(--shadow-subtle)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "rgba(6, 182, 212, 0.15)",
                    color: "var(--brand-cyan)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: 800
                  }}>
                    {pos + 1}
                  </span>
                  <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "#0f172a" }}>
                    {question.items![itemIdx]}
                  </code>
                </div>

                <div style={{ display: "flex", gap: "0.35rem" }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleMoveOrder(pos, -1)}
                    disabled={pos === 0}
                    title="Lên trên"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleMoveOrder(pos, 1)}
                    disabled={pos === order.length - 1}
                    title="Xuống dưới"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Matching */}
      {question.type === "matching" && question.left_items && question.right_items && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1.2rem 0" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.84rem", fontWeight: 700 }}>
            Chọn chức năng ghép cặp tương ứng cho mỗi câu lệnh:
          </div>

          {question.left_items.map((left, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "1rem",
                alignItems: "center",
                background: "var(--surface-subtle)",
                padding: "0.65rem 1rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-light)"
              }}
            >
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", fontWeight: 700, color: "var(--brand-rose)" }}>
                {left}
              </code>
              <select
                className="form-input"
                value={pairs[left] || ""}
                onChange={(e) => handleMatchSelect(left, e.target.value)}
                style={{ height: "38px" }}
              >
                <option value="">-- Chọn chức năng phù hợp --</option>
                {question.right_items!.map((r, rIdx) => (
                  <option key={rIdx} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Study Mode Explanations & AI Buttons */}
      {!isExamMode && (
        <div style={{ marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <button className="exp-toggle-btn" onClick={() => setShowExp(!showExp)}>
              <Lightbulb size={16} />
              <span>{showExp ? "Thu gọn phân tích logic" : "Xem đáp án & suy luận logic"}</span>
            </button>

            <button
              className="btn btn-ai btn-sm"
              onClick={handleAskAIExplanation}
              disabled={isAiLoading}
            >
              <Bot size={15} />
              <span>Thầy AI Chữa Bài Chi Tiết</span>
            </button>
          </div>

          {/* Standard Logic Explanation */}
          {showExp && (
            <div className="exp-box">
              <div style={{ fontWeight: 800, color: "#065f46", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Check size={16} />
                <span>
                  {question.type === "single_choice" && `Đáp án chuẩn: ${["A", "B", "C", "D"][question.correct_answer]}. ${question.options?.[question.correct_answer]}`}
                  {question.type === "true_false" && `Đáp án chuẩn: ${question.correct_answer === 0 ? "Đúng (True)" : "Sai (False)"}`}
                  {question.type === "multiple_choice" && `Các đáp án đúng: ${question.correct_answer.map((i: number) => ["A", "B", "C", "D"][i]).join(", ")}`}
                  {question.type === "fill_blank" && `Từ khóa cần điền: '${question.correct_answer}'`}
                  {question.type === "sequence_order" && `Thứ tự chuẩn: ${question.correct_order?.map((i: number) => question.items?.[i]).join(" ➔ ")}`}
                  {question.type === "matching" && `Ghép cặp: ${question.pairs?.map((p: any) => `${p.left} ➔ ${p.right}`).join(" | ")}`}
                </span>
              </div>
              <div style={{ fontSize: "0.88rem", lineHeight: "1.6" }}>
                <strong>🔍 Phương pháp tư duy logic:</strong> {question.explanation}
              </div>
            </div>
          )}

          {/* AI Explanation Box */}
          {aiExplanation && (
            <div className="ai-feedback-box">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800, color: "#86198f" }}>
                  <Bot size={18} />
                  <span>Lời Giảng & Bí Quyết Nhớ Lâu Của Thầy AI Sao Việt:</span>
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    onClick={handleCopyExplanation}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem" }}
                  >
                    {copied ? <Check size={12} color="green" /> : <Copy size={12} />}
                    <span>{copied ? "Đã chép" : "Sao chép"}</span>
                  </button>
                  <button
                    onClick={() => setAiExplanation(null)}
                    style={{ background: "none", border: "none", color: "#a21caf", cursor: "pointer", padding: "0.2rem" }}
                    title="Đóng"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div style={{ whiteSpace: "pre-wrap", fontSize: "0.88rem", lineHeight: "1.65" }}>
                {aiExplanation}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
