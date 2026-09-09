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
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "1rem",
            color: "#ffffff",
            background: "#080e1e",
            border: "1.5px solid #38bdf8",
            padding: "0.75rem 1rem",
            borderRadius: "8px"
          }}
          value={input}
          onChange={(e) => onChangeInput(e.target.value)}
        />
      </div>

      {input && (
        <div style={{
          padding: "0.85rem 1.1rem",
          borderRadius: "var(--radius-md)",
          background: isCorrect ? "rgba(16, 185, 129, 0.18)" : "rgba(239, 68, 68, 0.18)",
          border: isCorrect ? "1px solid #10b981" : "1px solid #ef4444",
          color: isCorrect ? "#6ee7b7" : "#fca5a5",
          fontSize: "0.9rem",
          lineHeight: "1.5"
        }}>
          {isCorrect 
            ? "🎉 Chính xác 100%! Từ khóa `def` (viết tắt của define) dùng để định nghĩa hàm trong Python." 
            : "⚠️ Chưa đúng. Gợi ý: từ khóa gồm 3 ký tự bắt đầu bằng chữ 'd'."}
        </div>
      )}
    </div>
  );
}
