"use client";

import { 
  Bot, 
  Database, 
  FileSpreadsheet, 
  Cpu, 
  ShieldCheck, 
  Zap,
  Sparkles,
  Layers
} from "lucide-react";

export default function TechEcosystemLayer() {
  const stack = [
    {
      title: "Trợ Lý Gemini AI 2.0",
      desc: "Phân tích logic từng bước, gợi ý thuật toán và sửa lỗi code tự luận cho học viên 24/7 không giới hạn.",
      icon: Bot,
      color: "#2563eb",
      badge: "AI Native"
    },
    {
      title: "MongoDB Atlas Cloud",
      desc: "Hệ thống CSDL phân tán quản lý tập trung 4 cơ sở, lưu trữ 120+ câu hỏi và lịch sử học tập tức thời.",
      icon: Database,
      color: "#10b981",
      badge: "Real-time DB"
    },
    {
      title: "Excel Importer / Exporter",
      desc: "Bộ xử lý bảng tính thông minh hỗ trợ nạp đề thi 6 dạng câu hỏi và trích xuất bảng điểm chuẩn nghiệp vụ.",
      icon: FileSpreadsheet,
      color: "#059669",
      badge: "Office Ready"
    },
    {
      title: "Trình Biên Dịch Sandbox",
      desc: "Thực thi mã nguồn Python trực tiếp trên trình duyệt, cách ly an toàn, hỗ trợ test case tự động.",
      icon: Cpu,
      color: "#8b5cf6",
      badge: "Fast Sandbox"
    }
  ];

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
          <Zap size={14} />
          <span>HẠ TẦNG KỸ THUẬT & CÔNG NGHỆ NỀN TẢNG</span>
        </div>

        <h2 style={{ fontSize: "1.85rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "0.4rem" }}>
          Hệ Sinh Thái Kỹ Thuật Số Chuẩn Doanh Nghiệp
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "650px", margin: "0 auto" }}>
          Tích hợp các công nghệ điện toán đám mây và trí tuệ nhân tạo hiện đại nhất nhằm tối ưu trải nghiệm học lập trình.
        </p>
      </div>

      {/* Tech Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.2rem" }}>
        {stack.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="q-card"
              style={{
                padding: "1.6rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-subtle)",
                transition: "all 0.25s ease"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.9rem" }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: `${item.color}15`,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Icon size={22} />
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: item.color, background: `${item.color}10`, padding: "2px 8px", borderRadius: "4px" }}>
                    {item.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.4rem" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
