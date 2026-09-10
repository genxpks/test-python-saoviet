"use client";

import Link from "next/link";
import { 
  FileCode2, 
  FileSpreadsheet, 
  Calculator, 
  Layers, 
  ArrowRight, 
  Terminal, 
  Bot, 
  Printer, 
  ShieldCheck, 
  Sparkles,
  Cpu,
  Clock
} from "lucide-react";

interface SubjectFeatureCard {
  id: string;
  name: string;
  code: string;
  tagline: string;
  icon: any;
  color: string;
  accent: string;
  features: string[];
  href: string;
  badge: string;
  examDuration: string;
}

const FEATURED_TRACKS: SubjectFeatureCard[] = [
  {
    id: "python",
    name: "Python & Tự Động Hóa",
    code: "PY-312",
    tagline: "Xử lý dữ liệu, Turtle Graphics & giải thuật thực tế",
    icon: FileCode2,
    color: "#2563eb",
    accent: "rgba(37, 99, 235, 0.08)",
    features: ["47 Bài học lý thuyết", "120 Câu trắc nghiệm", "Sandbox chạy trực tiếp"],
    href: "/study?subject=python",
    badge: "Phòng Thi Sandbox",
    examDuration: "50 Phút Thi"
  },
  {
    id: "thvp",
    name: "Tin Học Văn Phòng THVP-32",
    code: "THVP-32",
    tagline: "Word Nghị định 30, 25+ hàm Excel & Slide chuyên nghiệp",
    icon: FileSpreadsheet,
    color: "#059669",
    accent: "rgba(5, 150, 105, 0.08)",
    features: ["32 Chuyên đề thực tế", "Luyện thi MOS 2019/365", "Dashboard PivotTable"],
    href: "/study",
    badge: "Thực Chiến 1:1",
    examDuration: "Cấp Tốc 15 Buổi"
  },
  {
    id: "ketoan",
    name: "Kế Toán Thuế & BCTC",
    code: "KT-MISA",
    tagline: "Thực hành 100% chứng từ đỏ, lên BCTC trên MISA SME",
    icon: Calculator,
    color: "#d97706",
    accent: "rgba(217, 119, 6, 0.08)",
    features: ["Hóa đơn GTGT/TNCN", "Sổ sách Excel động", "Giải trình quyết toán thuế"],
    href: "#dang-ky-tu-van",
    badge: "Chứng Từ Thực",
    examDuration: "Học Đến Thành Thạo"
  },
  {
    id: "web",
    name: "Lập Trình Web Fullstack",
    code: "WEB-FS",
    tagline: "Next.js 14, Node.js Express, Tailwind CSS & Database",
    icon: Layers,
    color: "#7c3aed",
    accent: "rgba(124, 58, 237, 0.08)",
    features: ["React Server Action", "RESTful API / JWT", "Docker & Vercel Deploy"],
    href: "/study?subject=web",
    badge: "Fullstack Modern",
    examDuration: "Dự Án Doanh Nghiệp"
  }
];

export default function CosmicSubjectDeck() {
  return (
    <div style={{ marginTop: "1.6rem", marginBottom: "2.5rem", position: "relative", zIndex: 2 }}>
      {/* 1. Feature Highlights Ribbon — Gọn gàng, giảm 40%, tinh tế */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.6rem 1rem",
          padding: "0.75rem 1.25rem",
          borderRadius: "12px",
          background: "var(--surface-glass, rgba(255, 255, 255, 0.85))",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--border-light)",
          marginBottom: "1.2rem",
          boxShadow: "var(--shadow-subtle)",
          maxWidth: "100%",
          boxSizing: "border-box"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, color: "var(--brand-primary)" }}>
          <Sparkles size={14} />
          <span>TÍNH NĂNG NỀN TẢNG:</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem 1.2rem", flexWrap: "wrap", fontSize: "0.76rem", color: "var(--text-secondary)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <Cpu size={13} style={{ color: "#2563eb" }} />
            <strong>Sandbox Python Trực Tiếp</strong>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <Bot size={13} style={{ color: "#059669" }} />
            <strong>AI Chữa Bài Tức Thì</strong>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <Printer size={13} style={{ color: "#d97706" }} />
            <strong>In Đề Thi Chuẩn A4</strong>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <ShieldCheck size={13} style={{ color: "#7c3aed" }} />
            <strong>Khóa PIN Giáo Viên (8888)</strong>
          </span>
        </div>
      </div>

      {/* 2. 4 Compact, Feature-Rich Subject Cards (Giảm 40% kích thước, tỷ lệ 60% so với trước) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem"
        }}
      >
        {FEATURED_TRACKS.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="mockup-subject-card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textDecoration: "none",
                background: "var(--surface-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "14px",
                padding: "1.1rem 1.25rem",
                boxShadow: "var(--shadow-card)",
                transition: "all 0.22s ease",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Top Shimmer Accent Line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2.5px",
                  background: `linear-gradient(90deg, ${item.color}, transparent)`
                }}
              />

              <div>
                {/* Header: Icon + Code Badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.65rem"
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "9px",
                      background: `${item.color}14`,
                      border: `1px solid ${item.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.color
                    }}
                  >
                    <IconComponent size={18} />
                  </div>

                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "0.15rem 0.5rem",
                      borderRadius: "6px",
                      background: `${item.color}15`,
                      color: item.color
                    }}
                  >
                    {item.code}
                  </span>
                </div>

                {/* Track Name — Giảm kích thước còn 1.05rem (thay vì 1.75rem to đùng trước đây) */}
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-heading)",
                    lineHeight: 1.3,
                    marginBottom: "0.3rem"
                  }}
                >
                  {item.name}
                </h3>

                {/* Tagline */}
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.45,
                    marginBottom: "0.75rem"
                  }}
                >
                  {item.tagline}
                </p>

                {/* Micro Features Pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.85rem" }}>
                  {item.features.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        padding: "0.15rem 0.45rem",
                        borderRadius: "5px",
                        background: "var(--bg-deep)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border-light)"
                      }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Strip */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid var(--border-light)",
                  paddingTop: "0.6rem",
                  fontSize: "0.76rem"
                }}
              >
                <span style={{ color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                  <Clock size={11} />
                  {item.examDuration}
                </span>

                <span
                  style={{
                    color: item.color,
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem"
                  }}
                >
                  Luyện ngay <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
