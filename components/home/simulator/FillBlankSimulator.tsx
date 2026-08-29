"use client";

interface FillBlankSimulatorProps {
  input: string;
  onChangeInput: (val: string) => void;
}

export default function FillBlankSimulator({ input, onChangeInput }: FillBlankSimulatorProps) {
  const isCorrect = input.trim().toLowerCase() === "def";

  return (
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
          value={input}
          onChange={(e) => onChangeInput(e.target.value)}
        />
      </div>

      {input && (
        <div style={{
          padding: "0.8rem 1rem",
          borderRadius: "var(--radius-md)",
          background: isCorrect ? "#ecfdf5" : "#fef2f2",
          border: isCorrect ? "1px solid #a7f3d0" : "1px solid #fecaca",
          color: isCorrect ? "#047857" : "#b91c1c",
          fontSize: "0.88rem"
        }}>
          {isCorrect 
            ? "Chính xác 100%! Từ khóa `def` (viết tắt của define) dùng để định nghĩa hàm trong Python." 
            : "Chưa đúng. Gợi ý: từ khóa gồm 3 ký tự bắt đầu bằng chữ 'd'."}
        </div>
      )}
    </div>
  );
}
