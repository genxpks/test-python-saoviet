"use client";

import { useState } from "react";
import { Question, QuestionType } from "@/types";
import { addQuestionData, updateQuestionData } from "@/lib/questionsData";
import { HelpCircle, X, CheckCircle2, Plus, Trash2, Code2, BookOpen } from "lucide-react";

interface QuestionFormModalProps {
  question?: Question | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function QuestionFormModal({ question, onClose, onSaved }: QuestionFormModalProps) {
  const isEdit = !!question;

  const [type, setType] = useState<QuestionType>(question?.type || "single_choice");
  const [questionText, setQuestionText] = useState(question?.question || "");
  const [explanation, setExplanation] = useState(question?.explanation || "");

  // Single choice / Multiple choice / True False options
  const [options, setOptions] = useState<string[]>(
    question?.options || ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"]
  );
  const [correctAnswer, setCorrectAnswer] = useState<any>(
    question?.correct_answer !== undefined ? question.correct_answer : 0
  );

  // Fill in the blank
  const [fillAnswer, setFillAnswer] = useState<string>(
    typeof question?.correct_answer === "string" ? question.correct_answer : ""
  );

  // Sequence order
  const [items, setItems] = useState<string[]>(
    question?.items || ["Dòng lệnh 1", "Dòng lệnh 2", "Dòng lệnh 3", "Dòng lệnh 4"]
  );

  // Matching
  const [leftItems, setLeftItems] = useState<string[]>(
    question?.left_items || ["len()", "append()", "pop()", "split()"]
  );
  const [rightItems, setRightItems] = useState<string[]>(
    question?.right_items || ["Đo độ dài", "Thêm phần tử", "Xóa phần tử cuối", "Tách chuỗi"]
  );

  const [isLoading, setIsLoading] = useState(false);

  const getTypeName = (t: QuestionType) => {
    switch (t) {
      case "single_choice": return "Trắc nghiệm ABCD (1 đáp án)";
      case "true_false": return "Đúng / Sai (True / False)";
      case "multiple_choice": return "Nhiều đáp án đúng (Checkbox)";
      case "fill_blank": return "Điền từ vào chỗ trống";
      case "sequence_order": return "Sắp xếp thứ tự logic";
      case "matching": return "Ghép cặp nối cột A - B";
      default: return "Câu hỏi trắc nghiệm";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let finalCorrectAnswer: any = correctAnswer;
    if (type === "fill_blank") {
      finalCorrectAnswer = fillAnswer.trim();
    } else if (type === "true_false") {
      finalCorrectAnswer = Number(correctAnswer);
    } else if (type === "single_choice") {
      finalCorrectAnswer = Number(correctAnswer);
    }

    const questionPayload: any = {
      type,
      type_name: getTypeName(type),
      question: questionText.trim(),
      explanation: explanation.trim()
    };

    if (type === "single_choice" || type === "true_false" || type === "multiple_choice") {
      questionPayload.options = options;
      questionPayload.correct_answer = finalCorrectAnswer;
    } else if (type === "fill_blank") {
      questionPayload.correct_answer = finalCorrectAnswer;
    } else if (type === "sequence_order") {
      questionPayload.items = items;
      questionPayload.correct_order = Array.from({ length: items.length }, (_, i) => i);
    } else if (type === "matching") {
      questionPayload.left_items = leftItems;
      questionPayload.right_items = rightItems;
      questionPayload.pairs = leftItems.map((l, i) => ({ left: l, right: rightItems[i] || "" }));
    }

    if (isEdit && question) {
      questionPayload.id = question.id;
      updateQuestionData(question.id, questionPayload);

      // Call API PUT
      try {
        await fetch("/api/questions", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: "question", data: questionPayload })
        });
      } catch (err) {
        console.warn("MongoDB API sync error, saved to local cache.");
      }
    } else {
      const created = addQuestionData(questionPayload);

      // Call API POST
      try {
        await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: "question", data: { ...questionPayload, id: created.id } })
        });
      } catch (err) {
        console.warn("MongoDB API sync error, saved to local cache.");
      }
    }

    setIsLoading(false);
    alert(`✅ ${isEdit ? "Cập nhật" : "Tạo mới"} câu hỏi thành công!`);
    onSaved();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <button
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b"
          }}
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: "rgba(37, 99, 235, 0.12)",
            color: "var(--brand-primary)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem auto"
          }}>
            <HelpCircle size={28} />
          </div>
          <h3 style={{ fontSize: "1.35rem", fontWeight: 800 }}>
            {isEdit ? `Chỉnh Sửa Câu Hỏi #${question?.id}` : "Thêm Câu Hỏi Trắc Nghiệm Mới"}
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Hỗ trợ đầy đủ 6 dạng tương tác chuẩn giáo trình Python Nâng Cao
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Question Type Selector */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
              Dạng Câu Hỏi:
            </label>
            <select
              className="form-input"
              value={type}
              onChange={(e) => {
                const newT = e.target.value as QuestionType;
                setType(newT);
                if (newT === "true_false") {
                  setOptions(["Đúng (True)", "Sai (False)"]);
                } else if (newT === "single_choice" || newT === "multiple_choice") {
                  if (options.length < 4) setOptions(["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"]);
                }
              }}
              disabled={isEdit}
            >
              <option value="single_choice">1. Trắc nghiệm ABCD (1 đáp án đúng)</option>
              <option value="true_false">2. Đúng / Sai (True / False)</option>
              <option value="multiple_choice">3. Nhiều đáp án đúng (Checkbox)</option>
              <option value="fill_blank">4. Điền từ khóa còn thiếu</option>
              <option value="sequence_order">5. Sắp xếp thứ tự dòng lệnh</option>
              <option value="matching">6. Ghép cặp câu lệnh & chức năng</option>
            </select>
          </div>

          {/* Question Title Textarea */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
              Nội Dung Đề Bài Câu Hỏi:
            </label>
            <textarea
              className="form-input"
              style={{ minHeight: "80px", resize: "vertical" }}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Nhập nội dung đề bài câu hỏi..."
              required
            />
          </div>

          {/* Dạng 1 & 3: ABCD / Checkbox */}
          {(type === "single_choice" || type === "multiple_choice" || type === "true_false") && (
            <div style={{ background: "var(--surface-subtle)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1rem", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.6rem" }}>
                Các Phương Án Lựa Chọn & Đáp Án Đúng:
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {options.map((opt, idx) => {
                  const labels = ["A", "B", "C", "D"];
                  const isChecked = type === "multiple_choice" 
                    ? Array.isArray(correctAnswer) && correctAnswer.includes(idx)
                    : Number(correctAnswer) === idx;

                  return (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ fontWeight: 800, width: "24px", color: "var(--brand-primary)" }}>{labels[idx] || idx + 1}.</span>
                      <input
                        type="text"
                        className="form-input"
                        value={opt}
                        onChange={(e) => {
                          const next = [...options];
                          next[idx] = e.target.value;
                          setOptions(next);
                        }}
                        style={{ flex: 1 }}
                        required
                      />

                      {type === "multiple_choice" ? (
                        <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.78rem", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              let list = Array.isArray(correctAnswer) ? [...correctAnswer] : [];
                              if (e.target.checked) list.push(idx);
                              else list = list.filter(x => x !== idx);
                              setCorrectAnswer(list);
                            }}
                          />
                          <span>Đúng</span>
                        </label>
                      ) : (
                        <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.78rem", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="correct_choice"
                            checked={isChecked}
                            onChange={() => setCorrectAnswer(idx)}
                          />
                          <span>Đáp án đúng</span>
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dạng 4: Điền từ */}
          {type === "fill_blank" && (
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                Từ Khóa Đáp Án Cần Điền Chính Xác:
              </label>
              <input
                type="text"
                className="form-input"
                value={fillAnswer}
                onChange={(e) => setFillAnswer(e.target.value)}
                placeholder="Ví dụ: len(s) hoặc return"
                required
              />
            </div>
          )}

          {/* Dạng 5: Sequence Order */}
          {type === "sequence_order" && (
            <div style={{ background: "var(--surface-subtle)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1rem", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.6rem" }}>
                Các dòng lệnh theo thứ tự chuẩn:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {items.map((it, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, width: "20px" }}>{idx + 1}.</span>
                    <input
                      type="text"
                      className="form-input"
                      value={it}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx] = e.target.value;
                        setItems(next);
                      }}
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.88rem" }}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dạng 6: Matching */}
          {type === "matching" && (
            <div style={{ background: "var(--surface-subtle)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1rem", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.6rem" }}>
                Các Cặp Nối Cột Trái (Câu lệnh) - Cột Phải (Chức năng):
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {leftItems.map((left, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                    <input
                      type="text"
                      className="form-input"
                      value={left}
                      onChange={(e) => {
                        const next = [...leftItems];
                        next[idx] = e.target.value;
                        setLeftItems(next);
                      }}
                      placeholder={`Lệnh ${idx + 1}`}
                      style={{ fontFamily: "var(--font-mono)" }}
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={rightItems[idx] || ""}
                      onChange={(e) => {
                        const next = [...rightItems];
                        next[idx] = e.target.value;
                        setRightItems(next);
                      }}
                      placeholder={`Ý nghĩa ${idx + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
              Phương Pháp Suy Luận Logic & Chú Thích Giảng Giải:
            </label>
            <textarea
              className="form-input"
              style={{ minHeight: "75px", resize: "vertical" }}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Giải thích vì sao đáp án này đúng để hỗ trợ học viên tự học..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={isLoading}>
            <CheckCircle2 size={18} />
            <span>{isLoading ? "Đang lưu..." : isEdit ? "Cập Nhật Câu Hỏi" : "Thêm Câu Hỏi Vào Ngân Hàng"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
