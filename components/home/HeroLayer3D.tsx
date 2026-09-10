"use client";

import Link from "next/link";
import CyberPlanet3D from "./hero/CyberPlanet3D";
import CosmicSubjectDeck from "./hero/CosmicSubjectDeck";
import { BookOpen, Clock, Sparkles, CheckCircle2, ShieldCheck, Terminal, Bot } from "lucide-react";

export default function HeroLayer3D() {
  return (
    <section style={{ position: "relative", marginBottom: "2rem", perspective: "1200px", overflow: "hidden", maxWidth: "100%" }}>
      {/* Adaptive Aurora Glows — dịu mắt, thu gọn */}
      <div style={{
        position: "absolute",
        top: "-50px",
        left: "0%",
        width: "350px",
        height: "350px",
        background: "radial-gradient(circle, var(--hero-glow-teal, rgba(37, 99, 235, 0.1)) 0%, transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div style={{
        position: "absolute",
        top: "5%",
        right: "0%",
        width: "380px",
        height: "380px",
        background: "radial-gradient(circle, var(--hero-glow-blue, rgba(14, 165, 233, 0.12)) 0%, rgba(99, 102, 241, 0.06) 50%, transparent 70%)",
        filter: "blur(55px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div
        className="hero-grid-responsive"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "1.5rem",
          alignItems: "center",
          minHeight: "360px"
        }}
      >
        {/* Left Column: Typography & CTAs (Thu gọn 40%, còn 60% hiện tại) */}
        <div className="animate-left" style={{ paddingRight: "0.5rem" }}>
          {/* Eyebrow label — Compact & Chuyên nghiệp */}
          <div style={{
            fontSize: "0.76rem",
            fontWeight: 800,
            color: "var(--brand-primary)",
            letterSpacing: "0.03em",
            marginBottom: "0.75rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            background: "rgba(37, 99, 235, 0.08)",
            border: "1px solid rgba(37, 99, 235, 0.2)"
          }}>
            <span style={{ color: "#f59e0b" }}>★</span>
            <span>TIN HỌC SAO VIỆT — 10+ NĂM ĐÀO TẠO THỰC CHIẾN</span>
          </div>

          {/* Main Title — Giảm 40% (từ 3.7rem xuống ~2.2rem) */}
          <h1 style={{
            fontSize: "clamp(1.55rem, 2.7vw, 2.25rem)",
            fontWeight: 900,
            lineHeight: 1.2,
            letterSpacing: "-0.8px",
            color: "var(--text-primary)",
            marginBottom: "0.75rem",
            fontFamily: "var(--font-heading)"
          }}>
            Hệ Thống Đào Tạo & Khảo Thí Thực Chiến{" "}
            <span style={{
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Sao Việt
            </span>
          </h1>

          {/* Subtitle — Giảm kích thước còn 0.88rem */}
          <p style={{
            fontSize: "0.88rem",
            color: "var(--text-muted)",
            lineHeight: 1.55,
            marginBottom: "1.2rem",
            maxWidth: "520px"
          }}>
            Đào tạo thực chiến <strong>THVP-32</strong>, chứng chỉ quốc tế <strong>MOS/IC3</strong>, <strong>Kế Toán Thuế MISA</strong> & <strong>Lập Trình Python Sandbox</strong>. Phương pháp 1 kèm 1 — Cam kết học đến khi thành thạo!
          </p>

          {/* Compact Feature Tags Strip (Bổ sung thêm nhiều tính năng nổi bật) */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.2rem" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "6px", background: "rgba(37, 99, 235, 0.08)", color: "var(--brand-primary)", border: "1px solid rgba(37, 99, 235, 0.2)" }}>
              ⚡ Sandbox Python Tự Chấm
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "6px", background: "rgba(5, 150, 105, 0.08)", color: "var(--brand-emerald)", border: "1px solid rgba(5, 150, 105, 0.2)" }}>
              🤖 AI Chữa Lỗi Logic 24/7
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "6px", background: "rgba(217, 119, 6, 0.08)", color: "var(--brand-amber)", border: "1px solid rgba(217, 119, 6, 0.2)" }}>
              🖨️ In Đề Thi Chuẩn A4
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "6px", background: "rgba(124, 58, 237, 0.08)", color: "var(--brand-violet)", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
              🔒 Khóa PIN Thi Giáo Viên
            </span>
          </div>

          {/* 3 Compact CTA Buttons (Giảm 40% padding) */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap", marginBottom: "1.1rem" }}>
            <a
              href="#dang-ky-tu-van"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.65rem 1.25rem",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.86rem",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                transition: "all 0.2s ease"
              }}
            >
              <BookOpen size={15} />
              <span>Đăng Ký Tư Vấn Lớp</span>
            </a>

            <Link
              href="/exam"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.65rem 1.25rem",
                borderRadius: "10px",
                background: "var(--surface-hover)",
                border: "1px solid var(--border-medium)",
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.86rem",
                textDecoration: "none",
                boxShadow: "var(--shadow-subtle)",
                transition: "all 0.2s ease"
              }}
            >
              <Clock size={15} />
              <span>Phòng Thi 50P</span>
            </Link>

            <Link
              href="/study"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.3rem",
                padding: "0.65rem 1rem",
                borderRadius: "10px",
                background: "transparent",
                color: "var(--brand-primary)",
                fontWeight: 700,
                fontSize: "0.85rem",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
            >
              <span>Ôn tập 120 câu →</span>
            </Link>
          </div>

          {/* Quick Trust Pills — Giảm kích thước */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flexWrap: "wrap", fontSize: "0.76rem", color: "var(--text-secondary)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              <span style={{ color: "var(--brand-emerald)", fontWeight: 900 }}>✓</span> Học đến khi làm được việc
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              <span style={{ color: "var(--brand-emerald)", fontWeight: 900 }}>✓</span> Lịch học linh hoạt 3 ca
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              <span style={{ color: "var(--brand-emerald)", fontWeight: 900 }}>✓</span> 6 Cơ sở TP.HCM & BD
            </span>
          </div>
        </div>

        {/* Right Column: 3D Holographic Cyber Planet (Thu nhỏ chiều cao còn 360px) */}
        <div className="animate-right" style={{ position: "relative", minHeight: "360px" }}>
          <CyberPlanet3D />
        </div>
      </div>

      {/* Compact, Feature-Rich Subject Deck at Bottom of Hero */}
      <CosmicSubjectDeck />
    </section>
  );
}
