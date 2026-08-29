"use client";

import { Award } from "lucide-react";

export default function RoadmapSectionHeader() {
  return (
    <div style={{ textAlign: "center", marginBottom: "2.2rem" }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "rgba(124, 58, 237, 0.08)",
        color: "var(--brand-violet)",
        padding: "0.3rem 0.85rem",
        borderRadius: "var(--radius-full)",
        fontSize: "0.8rem",
        fontWeight: 800,
        marginBottom: "0.6rem"
      }}>
        <Award size={14} />
        <span>LỘ TRÌNH KHẢO THÍ & TỐT NGHIỆP</span>
      </div>

      <h2 style={{ fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "0.4rem" }}>
        Quy Trình 4 Bước Đạt Chuẩn Chứng Chỉ Tin Học Sao Việt
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "650px", margin: "0 auto" }}>
        Quy chuẩn đánh giá năng lực minh bạch, tự động chấm điểm và cấp chứng chỉ chuẩn khổ A4 ngay sau khi hoàn thành.
      </p>
    </div>
  );
}
