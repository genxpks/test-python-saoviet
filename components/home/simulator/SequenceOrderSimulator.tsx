"use client";

interface SequenceOrderSimulatorProps {
  orderItems: string[];
  onMoveItem: (fromIdx: number, toIdx: number) => void;
}

export default function SequenceOrderSimulator({ orderItems, onMoveItem }: SequenceOrderSimulatorProps) {
  const isOrderCorrect = JSON.stringify(orderItems) === JSON.stringify(["a = 10", "b = 20", "total = a + b", "print(total)"]);

  return (
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
                onClick={() => onMoveItem(idx, idx - 1)}
                className="btn btn-secondary btn-sm"
                style={{ padding: "0.2rem 0.5rem" }}
              >
                ▲ Lên
              </button>
              <button
                disabled={idx === orderItems.length - 1}
                onClick={() => onMoveItem(idx, idx + 1)}
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
  );
}
