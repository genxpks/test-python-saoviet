"use client";

import { Award, CheckCircle2 } from "lucide-react";

export default function RoadmapCertHighlight() {
  return (
    <div style={{
      marginTop: "1.5rem",
      padding: "1rem 1.4rem",
      borderRadius: "var(--radius-md)",
      background: "linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.05))",
      border: "1px solid rgba(245, 158, 11, 0.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "1rem"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--brand-amber)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Award size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a" }}>Chứng Chỉ Tốt Nghiệp Khổ A4 Kèm Mã Tra Cứu Toàn Quốc</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Hợp thức hóa hồ sơ xin việc, chứng minh năng lực lập trình thực chiến.</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--brand-emerald-dark)", fontWeight: 700, fontSize: "0.84rem" }}>
        <CheckCircle2 size={16} />
        <span>Chứng nhận có giá trị vô thời hạn</span>
      </div>
    </div>
  );
}
