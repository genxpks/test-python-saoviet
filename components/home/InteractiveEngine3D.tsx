"use client";

import { useState } from "react";
import Link from "next/link";
import TiltCard3D from "./TiltCard3D";
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Check, 
  X, 
  RefreshCw, 
  ArrowRight,
  MousePointerClick,
  Code2
} from "lucide-react";

type Archetype = "single_choice" | "true_false" | "multiple_choice" | "fill_blank" | "sequence_order" | "matching";

export default function InteractiveEngine3D() {
  const [activeArchetype, setActiveArchetype] = useState<Archetype>("single_choice");

  // State for interactive test drives
  const [singleChoiceAnswer, setSingleChoiceAnswer] = useState<number | null>(null);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean | null>(null);
  const [multiChoiceAnswers, setMultiChoiceAnswers] = useState<number[]>([]);
  const [fillBlankInput, setFillBlankInput] = useState("");
  const [orderItems, setOrderItems] = useState(["print(total)", "total = a + b", "a = 10", "b = 20"]);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});

  const isSingleCorrect = singleChoiceAnswer === 2; // option C
  const isTFCorrect = trueFalseAnswer === false; // False
  const isMultiCorrect = multiChoiceAnswers.includes(0) && multiChoiceAnswers.includes(1) && !multiChoiceAnswers.includes(2);
  const isFillCorrect = fillBlankInput.trim().toLowerCase() === "def";
  const isOrderCorrect = JSON.stringify(orderItems) === JSON.stringify(["a = 10", "b = 20", "total = a + b", "print(total)"]);

  const moveOrderItem = (fromIndex: number, toIndex: number) => {
    const updated = [...orderItems];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setOrderItems(updated);
  };

  return (
    <section style={{ marginBottom: "4rem" }}>
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "2.2rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(16, 185, 129, 0.08)",
          color: "var(--brand-emerald-dark)",
          padding: "0.3rem 0.85rem",
          borderRadius: "var(--radius-full)",
          fontSize: "0.8rem",
          fontWeight: 800,
          marginBottom: "0.6rem"
        }}>
          <Sparkles size={14} />
          <span>CÔNG NGHỆ KHẢO THÍ TƯƠNG TÁC THẾ HỆ MỚI</span>
        </div>

        <h2 style={{ fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "0.4rem" }}>
          Trải Nghiệm Trực Tiếp 6 Dạng Khảo Thí Thông Minh
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "680px", margin: "0 auto" }}>
          Vượt xa trắc nghiệm truyền thống, hệ thống thiết kế các dạng bài tương tác rèn luyện phản xạ đọc hiểu, sắp xếp dòng lệnh và ghép nối thuật toán.
        </p>
      </div>

      {/* Tabs of 6 Archetypes */}
      <div style={{
        display: "flex",
        gap: "0.4rem",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: "1.5rem"
      }}>
        {[
          { id: "single_choice", label: "1. Trắc Nghiệm ABCD" },
          { id: "true_false", label: "2. Đúng / Sai" },
          { id: "multiple_choice", label: "3. Nhiều Lựa Chọn" },
          { id: "fill_blank", label: "4. Điền Từ Khuyết" },
          { id: "sequence_order", label: "5. Sắp Xếp Dòng Code" },
          { id: "matching", label: "6. Ghép Cặp Khái Niệm" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveArchetype(tab.id as Archetype)}
            className={`btn btn-sm ${activeArchetype === tab.id ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "var(--radius-full)", padding: "0.4rem 0.95rem" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive 3D Card Simulation Box */}
      <TiltCard3D maxTilt={4} scale={1.01}>
        <div className="q-card" style={{ maxWidth: "840px", margin: "0 auto", padding: "2.2rem", background: "var(--surface-card)", borderRadius: "var(--radius-lg)" }}>
          {/* ARCHETYPE 1: SINGLE CHOICE */}
          {activeArchetype === "single_choice" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                <span className="q-badge" style={{ background: "rgba(37, 99, 235, 0.1)", color: "var(--brand-primary)" }}>
                  DẠNG 1: SINGLE CHOICE
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Chọn 1 đáp án chính xác nhất</span>
              </div>

              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.6rem" }}>
                Trong Python, kết quả của biểu thức <code>type(3.14)</code> là gì?
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", margin: "1.2rem 0" }}>
                {["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'double'>"].map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSingleChoiceAnswer(idx)}
                    className={`option-item ${singleChoiceAnswer === idx ? "selected" : ""}`}
                  >
                    <div className="option-letter">{String.fromCharCode(65 + idx)}</div>
                    <div style={{ flex: 1, fontSize: "0.92rem", fontWeight: 600 }}>{opt}</div>
                    {singleChoiceAnswer === idx && (
                      idx === 2 ? <CheckCircle2 size={18} color="#10b981" /> : <X size={18} color="#ef4444" />
                    )}
                  </div>
                ))}
              </div>

              {singleChoiceAnswer !== null && (
                <div style={{
                  padding: "0.8rem 1rem",
                  borderRadius: "var(--radius-md)",
                  background: isSingleCorrect ? "#ecfdf5" : "#fef2f2",
                  border: isSingleCorrect ? "1px solid #a7f3d0" : "1px solid #fecaca",
                  color: isSingleCorrect ? "#047857" : "#b91c1c",
                  fontSize: "0.88rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem"
                }}>
                  {isSingleCorrect ? <CheckCircle2 size={18} /> : <X size={18} />}
                  <span>
                    {isSingleCorrect 
                      ? "Chính xác! Trong Python, số thực có dấu chấm thập phân thuộc kiểu float." 
                      : "Chưa chính xác! Python không có kiểu double, số thực luôn là float. Em hãy chọn lại câu C nhé!"}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ARCHETYPE 2: TRUE / FALSE */}
          {activeArchetype === "true_false" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                <span className="q-badge" style={{ background: "rgba(6, 182, 212, 0.1)", color: "var(--brand-cyan)" }}>
                  DẠNG 2: TRUE / FALSE
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Khẳng định Đúng hoặc Sai</span>
              </div>

              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.6rem" }}>
                "Trong Python, kiểu dữ liệu Tuple cho phép thay đổi giá trị của các phần tử sau khi đã tạo (Mutable)."
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "1.5rem 0" }}>
                <button
                  onClick={() => setTrueFalseAnswer(true)}
                  className={`btn ${trueFalseAnswer === true ? "btn-primary" : "btn-secondary"}`}
                  style={{ height: "54px", fontSize: "1rem" }}
                >
                  ĐÚNG (TRUE)
                </button>
                <button
                  onClick={() => setTrueFalseAnswer(false)}
                  className={`btn ${trueFalseAnswer === false ? "btn-primary" : "btn-secondary"}`}
                  style={{ height: "54px", fontSize: "1rem" }}
                >
                  SAI (FALSE)
                </button>
              </div>

              {trueFalseAnswer !== null && (
                <div style={{
                  padding: "0.8rem 1rem",
                  borderRadius: "var(--radius-md)",
                  background: isTFCorrect ? "#ecfdf5" : "#fef2f2",
                  border: isTFCorrect ? "1px solid #a7f3d0" : "1px solid #fecaca",
                  color: isTFCorrect ? "#047857" : "#b91c1c",
                  fontSize: "0.88rem"
                }}>
                  {isTFCorrect 
                    ? "🎉 Xuất sắc! Tuple là kiểu dữ liệu bất biến (Immutable), không thể sửa hay thêm bớt phần tử." 
                    : "Chưa đúng! Tuple là Immutable, chỉ có List mới là Mutable."}
                </div>
              )}
            </div>
          )}

          {/* ARCHETYPE 3: MULTIPLE CHOICE */}
          {activeArchetype === "multiple_choice" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                <span className="q-badge" style={{ background: "rgba(139, 92, 246, 0.1)", color: "var(--brand-violet)" }}>
                  DẠNG 3: MULTIPLE CHOICE
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Chọn tất cả các phương án đúng</span>
              </div>

              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.6rem" }}>
                Các phương thức nào sau đây thuộc cấu trúc dữ liệu List trong Python? (Chọn 2 đáp án)
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", margin: "1.2rem 0" }}>
                {["append(x) — Thêm phần tử vào cuối", "pop() — Xóa và lấy phần tử cuối", "push_back(x) — Thêm vào đuôi vector"].map((opt, idx) => {
                  const isChecked = multiChoiceAnswers.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (isChecked) setMultiChoiceAnswers(multiChoiceAnswers.filter(x => x !== idx));
                        else setMultiChoiceAnswers([...multiChoiceAnswers, idx]);
                      }}
                      className={`option-item ${isChecked ? "selected" : ""}`}
                    >
                      <div style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "4px",
                        border: isChecked ? "2px solid var(--brand-violet)" : "1.5px solid var(--border-medium)",
                        background: isChecked ? "var(--brand-violet)" : "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff"
                      }}>
                        {isChecked && <Check size={14} />}
                      </div>
                      <div style={{ flex: 1, fontSize: "0.92rem" }}>{opt}</div>
                    </div>
                  );
                })}
              </div>

              {multiChoiceAnswers.length > 0 && (
                <div style={{
                  padding: "0.8rem 1rem",
                  borderRadius: "var(--radius-md)",
                  background: isMultiCorrect ? "#ecfdf5" : "#fef2f2",
                  border: isMultiCorrect ? "1px solid #a7f3d0" : "1px solid #fecaca",
                  color: isMultiCorrect ? "#047857" : "#b91c1c",
                  fontSize: "0.88rem"
                }}>
                  {isMultiCorrect 
                    ? "Tuyệt vời! `append` và `pop` là phương thức chuẩn của List. `push_back` là của C++ std::vector." 
                    : "Em hãy chọn đúng 2 phương thức của Python List (append và pop) nhé!"}
                </div>
              )}
            </div>
          )}

          {/* ARCHETYPE 4: FILL IN BLANK */}
          {activeArchetype === "fill_blank" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                <span className="q-badge" style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--brand-amber)" }}>
                  DẠNG 4: FILL IN BLANK
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Gõ từ khóa định nghĩa</span>
              </div>

              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.6rem" }}>
                Điền từ khóa còn thiếu để định nghĩa hàm tính tổng trong Python:
              </h3>

              <div style={{
                background: "#070d19",
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-mono)",
                color: "#38bdf8",
                fontSize: "0.95rem",
                marginBottom: "1rem"
              }}>
                <span style={{ color: "#f59e0b", fontWeight: 800 }}>_____</span> calculate_sum(a, b):<br />
                &nbsp;&nbsp;&nbsp;&nbsp;return a + b
              </div>

              <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1rem" }}>
                <input
                  type="text"
                  placeholder="Gõ từ khóa vào đây (VD: def, function, fn...)"
                  className="form-input"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                  value={fillBlankInput}
                  onChange={(e) => setFillBlankInput(e.target.value)}
                />
              </div>

              {fillBlankInput && (
                <div style={{
                  padding: "0.8rem 1rem",
                  borderRadius: "var(--radius-md)",
                  background: isFillCorrect ? "#ecfdf5" : "#fef2f2",
                  border: isFillCorrect ? "1px solid #a7f3d0" : "1px solid #fecaca",
                  color: isFillCorrect ? "#047857" : "#b91c1c",
                  fontSize: "0.88rem"
                }}>
                  {isFillCorrect 
                    ? "Chính xác 100%! Từ khóa `def` (viết tắt của define) dùng để định nghĩa hàm trong Python." 
                    : "Chưa đúng. Gợi ý: từ khóa gồm 3 ký tự bắt đầu bằng chữ 'd'."}
                </div>
              )}
            </div>
          )}

          {/* ARCHETYPE 5: SEQUENCE ORDER */}
          {activeArchetype === "sequence_order" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                <span className="q-badge" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--brand-emerald-dark)" }}>
                  DẠNG 5: SEQUENCE ORDERING
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Sắp xếp các dòng lệnh theo logic</span>
              </div>

              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.6rem" }}>
                Kéo thả hoặc bấm nút để xếp lại đúng trình tự khai báo và tính toán:
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", margin: "1rem 0" }}>
                {orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      background: "var(--surface-subtle)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.9rem"
                    }}
                  >
                    <span style={{ color: "var(--brand-primary)", fontWeight: 800 }}>#{idx + 1}&nbsp;&nbsp;{item}</span>
                    <div style={{ display: "flex", gap: "0.3rem" }}>
                      <button
                        disabled={idx === 0}
                        onClick={() => moveOrderItem(idx, idx - 1)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "0.2rem 0.5rem" }}
                      >
                        ▲ Lên
                      </button>
                      <button
                        disabled={idx === orderItems.length - 1}
                        onClick={() => moveOrderItem(idx, idx + 1)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "0.2rem 0.5rem" }}
                      >
                        ▼ Xuống
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                padding: "0.8rem 1rem",
                borderRadius: "var(--radius-md)",
                background: isOrderCorrect ? "#ecfdf5" : "var(--surface-subtle)",
                border: isOrderCorrect ? "1px solid #a7f3d0" : "1px solid var(--border-light)",
                color: isOrderCorrect ? "#047857" : "var(--text-secondary)",
                fontSize: "0.88rem"
              }}>
                {isOrderCorrect 
                  ? "🎉 Logic hoàn hảo: `a = 10` -> `b = 20` -> `total = a + b` -> `print(total)`!" 
                  : "Chưa đúng thứ tự logic. Biến cần được khởi tạo trước khi cộng và in ra màn hình."}
              </div>
            </div>
          )}

          {/* ARCHETYPE 6: MATCHING PAIRS */}
          {activeArchetype === "matching" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                <span className="q-badge" style={{ background: "rgba(225, 29, 72, 0.1)", color: "var(--brand-rose)" }}>
                  DẠNG 6: MATCHING PAIRS
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Ghép nối thuật ngữ với ý nghĩa</span>
              </div>

              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.6rem" }}>
                Ghép nối các hàm tích hợp sẵn của Python với công dụng tương ứng:
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1.2rem 0" }}>
                {[
                  { key: "len()", label: "Đếm số lượng phần tử của đối tượng" },
                  { key: "type()", label: "Kiểm tra kiểu dữ liệu của biến" },
                  { key: "range()", label: "Tạo dãy số nguyên liên tiếp" }
                ].map((pair, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1rem", alignItems: "center" }}>
                    <div style={{ padding: "0.65rem 0.9rem", background: "#f8fafc", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--brand-primary)" }}>
                      {pair.key}
                    </div>
                    <select
                      className="form-select"
                      value={matchedPairs[pair.key] || ""}
                      onChange={(e) => setMatchedPairs({ ...matchedPairs, [pair.key]: e.target.value })}
                    >
                      <option value="">-- Chọn ý nghĩa tương ứng --</option>
                      <option value="Đếm số lượng phần tử của đối tượng">Đếm số lượng phần tử của đối tượng</option>
                      <option value="Kiểm tra kiểu dữ liệu của biến">Kiểm tra kiểu dữ liệu của biến</option>
                      <option value="Tạo dãy số nguyên liên tiếp">Tạo dãy số nguyên liên tiếp</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Callout */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-light)" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Hệ thống lưu trữ <strong>120 câu hỏi</strong> tương tác với giải thích chi tiết.
            </span>
            <Link href="/study" className="btn btn-primary btn-sm" style={{ gap: "0.4rem" }}>
              <span>Luyện Tập Đầy Đủ 120 Câu</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </TiltCard3D>
    </section>
  );
}
