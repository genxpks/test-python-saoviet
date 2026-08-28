"use client";

import { useState } from "react";
import { Question } from "@/types";

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

  const qNum = index !== undefined ? index + 1 : question.id;

  return (
    <div className="q-card">
      <div className="q-card-header">
        <span className="q-badge">CÂU {qNum} • {question.type_name.toUpperCase()}</span>
      </div>

      <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0f172a", marginBottom: "1rem" }}>
        {question.question}
      </div>

      {/* Render Single Choice or True / False */}
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
                <span style={{ fontWeight: 700, width: "24px" }}>
                  {question.type === "true_false" ? (idx === 0 ? "✓" : "✗") : labels[idx]}.
                </span>
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Render Multiple Choice Checkbox */}
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
                <input type="checkbox" checked={isChecked} readOnly style={{ accentColor: "var(--primary)", width: "16px", height: "16px" }} />
                <span style={{ fontWeight: 700, width: "20px" }}>{labels[idx]}.</span>
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Render Fill in the blank */}
      {question.type === "fill_blank" && (
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
            Nhập câu trả lời vào ô dưới đây:
          </label>
          <input
            type="text"
            className="form-input"
            defaultValue={userAnswer || ""}
            onChange={(e) => handleFillChange(e.target.value)}
            placeholder="Gõ từ khóa còn thiếu..."
            style={{ maxWidth: "350px" }}
          />
        </div>
      )}

      {/* Render Sequence Order */}
      {question.type === "sequence_order" && question.items && (
        <div style={{ background: "#f8fafc", padding: "0.8rem", borderRadius: "8px", marginBottom: "1rem", border: "1px solid #e2e8f0" }}>
          <small style={{ color: "#64748b", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
            Bấm nút ▲ / ▼ để sắp xếp lại các dòng lệnh theo thứ tự logic:
          </small>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {order.map((itemIdx, pos) => (
              <div
                key={pos}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ffffff", padding: "0.45rem 0.8rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
              >
                <span style={{ fontFamily: "monospace", fontSize: "0.88rem" }}>
                  {pos + 1}. {question.items![itemIdx]}
                </span>
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleMoveOrder(pos, -1)} disabled={pos === 0}>
                    ▲
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleMoveOrder(pos, 1)} disabled={pos === order.length - 1}>
                    ▼
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render Matching */}
      {question.type === "matching" && question.left_items && question.right_items && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
          <small style={{ color: "#64748b", fontWeight: 600 }}>Chọn chức năng tương ứng cho mỗi câu lệnh:</small>
          {question.left_items.map((left, idx) => (
            <div
              key={idx}
              style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1rem", alignItems: "center", background: "#f8fafc", padding: "0.5rem 0.8rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
            >
              <strong style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>{left}</strong>
              <select
                className="form-input"
                value={pairs[left] || ""}
                onChange={(e) => handleMatchSelect(left, e.target.value)}
              >
                <option value="">-- Chọn chức năng ghép cặp --</option>
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

      {/* Explanation Toggle (Only in Study Mode or after Exam Submit) */}
      {!isExamMode && (
        <>
          <button className="exp-toggle-btn" onClick={() => setShowExp(!showExp)}>
            💡 {showExp ? "Thu gọn giải thích ▲" : "Xem đáp án & chú thích suy luận logic ▼"}
          </button>
          {showExp && (
            <div className="exp-box">
              <div style={{ fontWeight: 700, color: "#15803d", marginBottom: "0.3rem" }}>
                {question.type === "single_choice" && `Đáp án đúng: ${["A", "B", "C", "D"][question.correct_answer]}. ${question.options?.[question.correct_answer]}`}
                {question.type === "true_false" && `Đáp án đúng: ${question.correct_answer === 0 ? "Đúng (True)" : "Sai (False)"}`}
                {question.type === "multiple_choice" && `Các đáp án đúng: ${question.correct_answer.map((i: number) => ["A", "B", "C", "D"][i]).join(", ")}`}
                {question.type === "fill_blank" && `Từ khóa cần điền: '${question.correct_answer}'`}
                {question.type === "sequence_order" && `Thứ tự đúng: ${question.correct_order?.map((i: number) => question.items?.[i]).join(" ➔ ")}`}
                {question.type === "matching" && `Ghép cặp: ${question.pairs?.map((p: any) => `${p.left} ➔ ${p.right}`).join(" | ")}`}
              </div>
              <div style={{ fontSize: "0.86rem" }}>
                🔍 <em>Phương pháp suy luận logic:</em> {question.explanation}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
