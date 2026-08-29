"use client";

import { useState } from "react";
import { Question, QuestionType, Subject } from "@/types";
import { addQuestionData, updateQuestionData } from "@/lib/questionsData";
import { DEFAULT_SUBJECTS } from "@/lib/usersData";
import { HelpCircle, X, CheckCircle2, Plus, Trash2, Code2, BookOpen } from "lucide-react";

interface QuestionFormModalProps {
  question?: Question | null;
  defaultSubjectId?: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function QuestionFormModal({ 
  question, 
  defaultSubjectId = "python",
  onClose, 
  onSaved 
}: QuestionFormModalProps) {
  const isEdit = !!question;

  const [subjectId, setSubjectId] = useState(question?.subjectId || defaultSubjectId);
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
      subjectId: subjectId,
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

      try {
        await fetch("/api/questions", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: question.id, target: "question", data: questionPayload })
        });
      } catch (err) {}
    } else {
      const created = addQuestionData(questionPayload);

      try {
        await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: "question", data: { ...questionPayload, id: created.id } })
        });
      } catch (err) {}
    }

    setIsLoading(false);
    alert(`✅ ${isEdit ? "Cập nhật" : "Tạo mới"} câu hỏi thành công!`);
    onSaved();
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.6)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div style={{
        background: "#ffffff",
        color: "#0f172a",
        maxWidth: "680px",
        width: "100%",
        maxHeight: "92vh",
        overflowY: "auto",
        padding: "2rem",
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)",
        position: "relative"
      }}>
        <button
          onClick={onClose}
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
        >
          <X size={18} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
          <div style={{
            width: "46px",
            height: "46px",
            borderRadius: "14px",
            background: "#eff6ff",
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <HelpCircle size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              {isEdit ? `Chỉnh Sửa Câu Hỏi #${question?.id}` : "Thêm Câu Hỏi Trắc Nghiệm Mới"}
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0.2rem 0 0" }}>
              Soạn thảo câu hỏi trắc nghiệm tương tác cao 6 dạng chuẩn khảo thí.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Thuộc Môn Học: *
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 600,
                  fontSize: "0.85rem"
                }}
              >
                {DEFAULT_SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Dạng Câu Hỏi: *
              </label>
              <select
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
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 600,
                  fontSize: "0.85rem"
                }}
              >
                <option value="single_choice">1. Trắc nghiệm ABCD (1 đáp án đúng)</option>
                <option value="true_false">2. Đúng / Sai (True / False)</option>
                <option value="multiple_choice">3. Nhiều đáp án đúng (Checkbox)</option>
                <option value="fill_blank">4. Điền từ khóa còn thiếu</option>
                <option value="sequence_order">5. Sắp xếp thứ tự dòng lệnh</option>
                <option value="matching">6. Ghép cặp câu lệnh & chức năng</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
              Nội Dung Đề Bài Câu Hỏi: *
            </label>
            <textarea
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: "0.88rem",
                minHeight: "75px"
              }}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Nhập nội dung đề bài câu hỏi..."
              required
            />
          </div>

          {/* Type ABCD / Checkbox / True False */}
          {(type === "single_choice" || type === "multiple_choice" || type === "true_false") && (
            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e40af", marginBottom: "0.6rem" }}>
                Các Phương Án Lựa Chọn & Đánh Dấu Đáp Án Đúng:
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {options.map((opt, idx) => {
                  const labels = ["A", "B", "C", "D"];
                  const isChecked = type === "multiple_choice" 
                    ? Array.isArray(correctAnswer) && correctAnswer.includes(idx)
                    : Number(correctAnswer) === idx;

                  return (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ fontWeight: 800, width: "24px", color: "#2563eb" }}>{labels[idx] || idx + 1}.</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const next = [...options];
                          next[idx] = e.target.value;
                          setOptions(next);
                        }}
                        style={{
                          flex: 1,
                          padding: "0.55rem 0.75rem",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          background: "#ffffff",
                          color: "#0f172a",
                          fontSize: "0.85rem"
                        }}
                        required
                      />

                      {type === "multiple_choice" ? (
                        <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600, color: "#334155" }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              let list = Array.isArray(correctAnswer) ? [...correctAnswer] : [];
                              if (e.target.checked) list.push(idx);
                              else list = list.filter(x => x !== idx);
                              setCorrectAnswer(list);
                            }}
                            style={{ accentColor: "#2563eb" }}
                          />
                          <span>Đúng</span>
                        </label>
                      ) : (
                        <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600, color: "#334155" }}>
                          <input
                            type="radio"
                            name="correct_choice"
                            checked={isChecked}
                            onChange={() => setCorrectAnswer(idx)}
                            style={{ accentColor: "#2563eb" }}
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

          {/* Type 4: Điền từ */}
          {type === "fill_blank" && (
            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#1e40af", marginBottom: "0.35rem" }}>
                Từ Khóa Đáp Án Cần Điền Chính Xác:
              </label>
              <input
                type="text"
                value={fillAnswer}
                onChange={(e) => setFillAnswer(e.target.value)}
                placeholder="Ví dụ: len(s) hoặc return"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.88rem"
                }}
                required
              />
            </div>
          )}

          {/* Type 5: Sequence Order */}
          {type === "sequence_order" && (
            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e40af", marginBottom: "0.6rem" }}>
                Các dòng lệnh theo thứ tự chuẩn:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {items.map((it, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, width: "20px", color: "#2563eb" }}>{idx + 1}.</span>
                    <input
                      type="text"
                      value={it}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx] = e.target.value;
                        setItems(next);
                      }}
                      style={{
                        flex: 1,
                        padding: "0.55rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        background: "#ffffff",
                        color: "#0f172a",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem"
                      }}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Type 6: Matching */}
          {type === "matching" && (
            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e40af", marginBottom: "0.6rem" }}>
                Các Cặp Nối Cột Trái (Câu lệnh) - Cột Phải (Chức năng):
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {leftItems.map((left, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                    <input
                      type="text"
                      value={left}
                      onChange={(e) => {
                        const next = [...leftItems];
                        next[idx] = e.target.value;
                        setLeftItems(next);
                      }}
                      placeholder={`Lệnh ${idx + 1}`}
                      style={{
                        padding: "0.55rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        background: "#ffffff",
                        color: "#0f172a",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem"
                      }}
                      required
                    />
                    <input
                      type="text"
                      value={rightItems[idx] || ""}
                      onChange={(e) => {
                        const next = [...rightItems];
                        next[idx] = e.target.value;
                        setRightItems(next);
                      }}
                      placeholder={`Ý nghĩa ${idx + 1}`}
                      style={{
                        padding: "0.55rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        background: "#ffffff",
                        color: "#0f172a",
                        fontSize: "0.85rem"
                      }}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
              Phương Pháp Suy Luận Logic & Chú Thích Giảng Giải:
            </label>
            <textarea
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: "0.85rem",
                minHeight: "70px"
              }}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Giải thích vì sao đáp án này đúng để hỗ trợ học viên tự học..."
              required
            />
          </div>

          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "0.5rem",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "1rem"
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.65rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#475569",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "0.65rem 1.35rem",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              {isLoading ? "Đang lưu..." : isEdit ? "Cập Nhật Câu Hỏi" : "Thêm Câu Hỏi Vào Ngân Hàng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
