"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  MoveRight, 
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
    <section style={{ marginBottom: "3.5rem" }}>
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(16, 185, 129, 0.08)",
          color: "var(--brand-emerald-dark)",
          padding: "0.3rem 0.8rem",
          borderRadius: "var(--radius-full)",
          fontSize: "0.8rem",
          fontWeight: 800,
          marginBottom: "0.6rem"
        }}>
          <Sparkles size={14} />
          <span>CÔNG NGHỆ KHẢO THÍ TƯƠNG TÁC THẾ HỆ MỚI</span>
        </div>

        <h2 style={{ fontSize: "1.85rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "0.4rem" }}>
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
            style={{
              borderRadius: "var(--radius-full)",
              fontWeight: 700,
              fontSize: "0.82rem",
              padding: "0.45rem 1rem"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive Simulator Stage Card */}
      <div className="q-card" style={{
        maxWidth: "840px",
        margin: "0 auto",
        padding: "2.2rem",
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.07)",
        border: "1px solid var(--border-light)",
        position: "relative"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.8rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MousePointerClick size={18} color="var(--brand-primary)" />
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-secondary)" }}>
              THỬ NGHIỆM TƯƠNG TÁC TRỰC TIẾP
            </span>
          </div>

          <button
            onClick={() => {
              setSingleChoiceAnswer(null);
              setTrueFalseAnswer(null);
              setMultiChoiceAnswers([]);
              setFillBlankInput("");
              setOrderItems(["print(total)", "total = a + b", "a = 10", "b = 20"]);
            }}
            className="btn btn-secondary btn-sm"
            style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }}
          >
            <RefreshCw size={12} />
            <span>Làm Lại</span>
          </button>
        </div>

        {/* 1. SINGLE CHOICE */}
        {activeArchetype === "single_choice" && (
          <div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.4rem" }}>
              Kết quả xuất ra màn hình của đoạn code Python sau là gì?
            </h4>
            <pre style={{ background: "#0f172a", color: "#38bdf8", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.84rem", fontFamily: "var(--font-mono)", marginBottom: "1rem" }}>
              <code>{`text = "TinHocSaoViet"\nprint(len(text))`}</code>
            </pre>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1rem" }}>
              {["A. 10", "B. 12", "C. 13", "D. 15"].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSingleChoiceAnswer(idx)}
                  className="q-option-btn"
                  style={{
                    padding: "0.8rem 1rem",
                    borderRadius: "var(--radius-md)",
                    border: singleChoiceAnswer === idx ? (idx === 2 ? "2px solid #10b981" : "2px solid #ef4444") : "1px solid var(--border-light)",
                    background: singleChoiceAnswer === idx ? (idx === 2 ? "#ecfdf5" : "#fef2f2") : "var(--bg-light)",
                    fontWeight: 700,
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span>{opt}</span>
                  {singleChoiceAnswer === idx && (
                    idx === 2 ? <Check size={16} color="#10b981" /> : <X size={16} color="#ef4444" />
                  )}
                </button>
              ))}
            </div>

            {singleChoiceAnswer !== null && (
              <div style={{ padding: "0.8rem", borderRadius: "8px", background: isSingleCorrect ? "#ecfdf5" : "#fef2f2", color: isSingleCorrect ? "#065f46" : "#991b1b", fontSize: "0.85rem" }}>
                {isSingleCorrect ? "🎉 Chính xác! Chuỗi 'TinHocSaoViet' có đúng 13 ký tự." : "❌ Chưa chính xác. Đếm từng ký tự trong chuỗi (3 + 3 + 7 = 13 ký tự)."}
              </div>
            )}
          </div>
        )}

        {/* 2. TRUE / FALSE */}
        {activeArchetype === "true_false" && (
          <div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.4rem" }}>
              Phát biểu sau đây là Đúng hay Sai?
            </h4>
            <div style={{ background: "var(--bg-light)", padding: "1rem", borderRadius: "8px", fontSize: "0.92rem", fontWeight: 600, marginBottom: "1.2rem", borderLeft: "4px solid var(--brand-primary)" }}>
              "Trong Python, kiểu dữ liệu <code>tuple</code> cho phép thay đổi, thêm hoặc xóa phần tử sau khi đã khởi tạo."
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <button
                onClick={() => setTrueFalseAnswer(true)}
                className="btn btn-lg"
                style={{
                  flex: 1,
                  background: trueFalseAnswer === true ? "#fef2f2" : "var(--bg-light)",
                  border: trueFalseAnswer === true ? "2px solid #ef4444" : "1px solid var(--border-light)",
                  color: "#0f172a"
                }}
              >
                Đúng (True)
              </button>

              <button
                onClick={() => setTrueFalseAnswer(false)}
                className="btn btn-lg"
                style={{
                  flex: 1,
                  background: trueFalseAnswer === false ? "#ecfdf5" : "var(--bg-light)",
                  border: trueFalseAnswer === false ? "2px solid #10b981" : "1px solid var(--border-light)",
                  color: "#0f172a"
                }}
              >
                Sai (False)
              </button>
            </div>

            {trueFalseAnswer !== null && (
              <div style={{ padding: "0.8rem", borderRadius: "8px", background: isTFCorrect ? "#ecfdf5" : "#fef2f2", color: isTFCorrect ? "#065f46" : "#991b1b", fontSize: "0.85rem" }}>
                {isTFCorrect ? "🎉 Chính xác! Tuple trong Python là kiểu bất biến (Immutable), không thể sửa đổi sau khi tạo." : "❌ Sai rồi! Tuple là kiểu dữ liệu bất biến (Immutable)."}
              </div>
            )}
          </div>
        )}

        {/* 3. MULTIPLE CHOICE */}
        {activeArchetype === "multiple_choice" && (
          <div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.4rem" }}>
              Chọn tất cả các kiểu dữ liệu có thể thay đổi (Mutable) trong Python:
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
              {[
                { id: 0, label: "A. List (Danh sách)" },
                { id: 1, label: "B. Dictionary (Từ điển)" },
                { id: 2, label: "C. Tuple (Bộ dữ liệu)" },
                { id: 3, label: "D. String (Chuỗi ký tự)" }
              ].map((item) => {
                const isChecked = multiChoiceAnswers.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMultiChoiceAnswers(prev => 
                        isChecked ? prev.filter(x => x !== item.id) : [...prev, item.id]
                      );
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      border: isChecked ? "2px solid var(--brand-primary)" : "1px solid var(--border-light)",
                      background: isChecked ? "rgba(37, 99, 235, 0.08)" : "var(--bg-light)",
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <span>{item.label}</span>
                    <span>{isChecked ? "☑️" : "⬜"}</span>
                  </button>
                );
              })}
            </div>

            {multiChoiceAnswers.length > 0 && (
              <div style={{ padding: "0.8rem", borderRadius: "8px", background: isMultiCorrect ? "#ecfdf5" : "rgba(245, 158, 11, 0.1)", color: isMultiCorrect ? "#065f46" : "#b45309", fontSize: "0.85rem" }}>
                {isMultiCorrect ? "🎉 Xuất sắc! Cả List và Dictionary đều là Mutable types." : "💡 Gợi ý: Hãy chọn cả List và Dictionary, không chọn Tuple/String."}
              </div>
            )}
          </div>
        )}

        {/* 4. FILL IN THE BLANK */}
        {activeArchetype === "fill_blank" && (
          <div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.4rem" }}>
              Điền từ khóa thích hợp vào chỗ trống để định nghĩa hàm trong Python:
            </h4>
            <div style={{ background: "#0f172a", padding: "1rem", borderRadius: "8px", marginBottom: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "#e2e8f0" }}>
              <span style={{ color: "#f59e0b" }}>________</span> tinh_tong(a, b):<br />
              &nbsp;&nbsp;&nbsp;&nbsp;return a + b
            </div>

            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem" }}>
              <input
                type="text"
                value={fillBlankInput}
                onChange={(e) => setFillBlankInput(e.target.value)}
                placeholder="Nhập từ khóa (VD: def, function...)"
                className="input"
                style={{ flex: 1, fontFamily: "var(--font-mono)", fontWeight: 700 }}
              />
            </div>

            {fillBlankInput && (
              <div style={{ padding: "0.8rem", borderRadius: "8px", background: isFillCorrect ? "#ecfdf5" : "#fef2f2", color: isFillCorrect ? "#065f46" : "#991b1b", fontSize: "0.85rem" }}>
                {isFillCorrect ? "🎉 Tuyệt vời! Từ khóa 'def' được dùng để khai báo hàm trong Python." : "❌ Chưa đúng. Từ khóa gồm 3 chữ cái bắt đầu bằng chữ 'd'."}
              </div>
            )}
          </div>
        )}

        {/* 5. SEQUENCE ORDER */}
        {activeArchetype === "sequence_order" && (
          <div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.4rem" }}>
              Sắp xếp các dòng lệnh sau theo đúng thứ tự thực thi hợp lệ:
            </h4>
            <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginBottom: "0.8rem" }}>
              Bấm nút mũi tên ⬆️ / ⬇️ để di chuyển dòng lệnh lên xuống.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginBottom: "1rem" }}>
              {orderItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--bg-light)",
                    border: "1px solid var(--border-light)",
                    padding: "0.65rem 0.9rem",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem"
                  }}
                >
                  <span><strong>{idx + 1}.</strong> {item}</span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      disabled={idx === 0}
                      onClick={() => moveOrderItem(idx, idx - 1)}
                      style={{ background: "#ffffff", border: "1px solid var(--border-light)", borderRadius: "4px", padding: "2px 8px", cursor: "pointer" }}
                    >
                      ⬆️
                    </button>
                    <button
                      disabled={idx === orderItems.length - 1}
                      onClick={() => moveOrderItem(idx, idx + 1)}
                      style={{ background: "#ffffff", border: "1px solid var(--border-light)", borderRadius: "4px", padding: "2px 8px", cursor: "pointer" }}
                    >
                      ⬇️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "0.8rem", borderRadius: "8px", background: isOrderCorrect ? "#ecfdf5" : "rgba(37, 99, 235, 0.06)", color: isOrderCorrect ? "#065f46" : "var(--brand-primary)", fontSize: "0.85rem" }}>
              {isOrderCorrect ? "🎉 Hoàn hảo! Biến phải được gán giá trị trước khi tính tổng và in ra." : "💡 Hãy đưa dòng 'a = 10' và 'b = 20' lên đầu tiên."}
            </div>
          </div>
        )}

        {/* 6. MATCHING */}
        {activeArchetype === "matching" && (
          <div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.4rem" }}>
              Ghép nối khái niệm ở cột Trái với mô tả chính xác ở cột Phải:
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem", fontSize: "0.84rem" }}>
              <div style={{ background: "var(--bg-light)", padding: "0.8rem", borderRadius: "8px" }}>
                <strong>Cột A (Khái Niệm):</strong>
                <div style={{ marginTop: "0.4rem" }}>• <strong>1.</strong> <code>random.randint(a, b)</code></div>
                <div style={{ marginTop: "0.4rem" }}>• <strong>2.</strong> <code>math.sqrt(x)</code></div>
                <div style={{ marginTop: "0.4rem" }}>• <strong>3.</strong> <code>turtle.forward(d)</code></div>
              </div>
              <div style={{ background: "var(--bg-light)", padding: "0.8rem", borderRadius: "8px" }}>
                <strong>Cột B (Ý Nghĩa):</strong>
                <div style={{ marginTop: "0.4rem" }}>• <strong>A.</strong> Tính căn bậc hai của số dương</div>
                <div style={{ marginTop: "0.4rem" }}>• <strong>B.</strong> Điều khiển rùa di chuyển tiến về trước</div>
                <div style={{ marginTop: "0.4rem" }}>• <strong>C.</strong> Sinh số nguyên ngẫu nhiên trong đoạn [a, b]</div>
              </div>
            </div>

            <div style={{ padding: "0.8rem", borderRadius: "8px", background: "#ecfdf5", color: "#065f46", fontSize: "0.85rem" }}>
              ✅ Đáp án ghép nối chuẩn: <strong>1 - C | 2 - A | 3 - B</strong>
            </div>
          </div>
        )}

        {/* Bottom Call to Action */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.4rem", borderTop: "1px solid var(--border-light)", paddingTop: "1rem" }}>
          <span style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
            Ngân hàng chứa <strong>120 câu hỏi</strong> thuộc 6 dạng tương tác này.
          </span>
          <Link href="/study" className="btn btn-primary btn-sm">
            <span>Truy Cập Kho 120 Câu</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
