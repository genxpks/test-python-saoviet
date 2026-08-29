"use client";

interface TrueFalseSimulatorProps {
  answer: boolean | null;
  onSelectAnswer: (val: boolean) => void;
}

export default function TrueFalseSimulator({ answer, onSelectAnswer }: TrueFalseSimulatorProps) {
  const isCorrect = answer === false;

  return (
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
          onClick={() => onSelectAnswer(true)}
          className={`btn ${answer === true ? "btn-primary" : "btn-secondary"}`}
          style={{ height: "54px", fontSize: "1rem" }}
        >
          ĐÚNG (TRUE)
        </button>
        <button
          onClick={() => onSelectAnswer(false)}
          className={`btn ${answer === false ? "btn-primary" : "btn-secondary"}`}
          style={{ height: "54px", fontSize: "1rem" }}
        >
          SAI (FALSE)
        </button>
      </div>

      {answer !== null && (
        <div style={{
          padding: "0.8rem 1rem",
          borderRadius: "var(--radius-md)",
          background: isCorrect ? "#ecfdf5" : "#fef2f2",
          border: isCorrect ? "1px solid #a7f3d0" : "1px solid #fecaca",
          color: isCorrect ? "#047857" : "#b91c1c",
          fontSize: "0.88rem"
        }}>
          {isCorrect 
            ? "🎉 Xuất sắc! Tuple là kiểu dữ liệu bất biến (Immutable), không thể sửa hay thêm bớt phần tử." 
            : "Chưa đúng! Tuple là Immutable, chỉ có List mới là Mutable."}
        </div>
      )}
    </div>
  );
}
