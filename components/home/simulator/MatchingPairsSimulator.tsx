"use client";

interface MatchingPairsSimulatorProps {
  matchedPairs: Record<string, string>;
  onMatch: (key: string, val: string) => void;
}

export default function MatchingPairsSimulator({ matchedPairs, onMatch }: MatchingPairsSimulatorProps) {
  return (
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
              onChange={(e) => onMatch(pair.key, e.target.value)}
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
  );
}
