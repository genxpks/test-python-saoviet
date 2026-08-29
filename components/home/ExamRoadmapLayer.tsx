"use client";

import Link from "next/link";
import { 
  Trophy, 
  BookOpen, 
  Terminal, 
  Clock, 
  Printer, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export default function ExamRoadmapLayer() {
  const steps = [
    {
      num: "01",
      title: "Ôn Luyện Đa Dạng 120 Câu",
      desc: "Luyện tập 6 dạng câu hỏi tương tác với gợi ý logic từng bước & trợ lý Gemini AI đồng hành 24/7.",
      icon: BookOpen,
      color: "#2563eb",
      badge: "Giai Đoạn 1"
    },
    {
      num: "02",
      title: "Thực Chiến 10 Bài Thuật Toán",
      desc: "Viết hàm, chạy thử nghiệm code với test case tự động trên Sandbox IDE trực tiếp trên trình duyệt.",
      icon: Terminal,
      color: "#059669",
      badge: "Giai Đoạn 2"
    },
    {
      num: "03",
      title: "Khảo Thí Tốt Nghiệp 50 Phút",
      desc: "Đề thi chuẩn hóa: 50 câu trắc nghiệm + 4 bài tự luận code, tính giờ tự động và bảo mật mã PIN.",
      icon: Clock,
      color: "#d97706",
      badge: "Giai Đoạn 3"
    },
    {
      num: "04",
      title: "Cấp Bằng & Xuất Đề Chuẩn A4",
      desc: "Lưu sổ điểm điện tử, cấp chứng chỉ tốt nghiệp Sao Việt và xuất bản in đề thi định dạng A4.",
      icon: Award,
      color: "#7c3aed",
      badge: "Hoàn Thành"
    }
  ];

  return (
    <section style={{ marginBottom: "3.5rem" }}>
      {/* Section Title */}
      <div style={{ textAlign: "center", marginBottom: "2.2rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(139, 92, 246, 0.08)",
          color: "var(--brand-violet)",
          padding: "0.3rem 0.8rem",
          borderRadius: "var(--radius-full)",
          fontSize: "0.8rem",
          fontWeight: 800,
          marginBottom: "0.6rem"
        }}>
          <Trophy size={14} />
          <span>LỘ TRÌNH ĐÀO TẠO & CHỨNG NHẬN</span>
        </div>

        <h2 style={{ fontSize: "1.85rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "0.4rem" }}>
          Quy Trình 4 Bước Tốt Nghiệp Chuẩn Quốc Tế
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "620px", margin: "0 auto" }}>
          Cam kết chất lượng chuẩn đầu ra, học viên làm chủ hoàn toàn kỹ năng lập trình và tư duy thuật toán.
        </p>
      </div>

      {/* 4-Step Pipeline Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.2rem"
      }}>
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="q-card"
              style={{
                position: "relative",
                padding: "1.8rem 1.4rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderTop: `4px solid ${s.color}`,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "1.8rem", fontWeight: 900, color: s.color, opacity: 0.8, fontFamily: "var(--font-mono)" }}>
                    {s.num}
                  </span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, background: "rgba(0,0,0,0.05)", color: s.color, padding: "2px 8px", borderRadius: "4px" }}>
                    {s.badge}
                  </span>
                </div>

                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: `${s.color}15`,
                  color: s.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem"
                }}>
                  <Icon size={24} />
                </div>

                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
