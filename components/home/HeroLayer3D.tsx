"use client";

import Link from "next/link";
import CyberPlanet3D from "./hero/CyberPlanet3D";
import CosmicSubjectDeck from "./hero/CosmicSubjectDeck";
import { BookOpen, Clock, Sparkles, CheckCircle2, ShieldCheck, Terminal, Bot } from "lucide-react";

export default function HeroLayer3D() {
  return (
    <section style={{ position: "relative", marginBottom: "2rem", perspective: "1200px" }}>
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
            <span>TIN HỌC SAO VIỆT — HỆ THỐNG HỌC VỤ & ĐÀO TẠO LẬP TRÌNH 1-1</span>
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
            Cổng Học Vụ & Dịch Vụ Đào Tạo Lập Trình{" "}
            <span style={{
              background: "linear-gradient(135deg, #00f5c8 0%, #2563eb 50%, #06b6d4 100%)",
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
            maxWidth: "540px"
          }}>
            Đào tạo thực chiến <strong>13+ ngôn ngữ & ngăn xếp công nghệ</strong>: <strong>Python, C/C++, Java Spring Boot, C# .NET 8, PHP Laravel, React, Next.js, Node.js & Android</strong>. Dạy kèm 1-1 cá nhân hóa, đỡ đầu đồ án ĐH, luyện thi HSG & Olympic — Cam kết học đến khi thành thạo!
          </p>

          {/* Compact Feature Tags Strip: Dải ngôn ngữ chủ lực */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.2rem" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: "5px", background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.25)" }}>
              🐍 Python & Auto
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: "5px", background: "rgba(6, 182, 212, 0.12)", color: "#06b6d4", border: "1px solid rgba(6, 182, 212, 0.25)" }}>
              ⚡ C/C++ Thuật Toán
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: "5px", background: "rgba(22, 163, 74, 0.12)", color: "#16a34a", border: "1px solid rgba(22, 163, 74, 0.25)" }}>
              🍃 Java Spring Boot
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: "5px", background: "rgba(139, 92, 246, 0.12)", color: "#8b5cf6", border: "1px solid rgba(139, 92, 246, 0.25)" }}>
              🚀 C# & .NET 8 API
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: "5px", background: "rgba(0, 245, 200, 0.12)", color: "var(--brand-primary)", border: "1px solid rgba(0, 245, 200, 0.25)" }}>
              ⚛️ React & Next.js
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: "5px", background: "rgba(16, 185, 129, 0.12)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
              🟢 Backend Node.js
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: "5px", background: "rgba(34, 197, 94, 0.12)", color: "#22c55e", border: "1px solid rgba(34, 197, 94, 0.25)" }}>
              🤖 Di Động Android
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: "5px", background: "rgba(244, 63, 94, 0.12)", color: "#f43f5e", border: "1px solid rgba(244, 63, 94, 0.25)" }}>
              🐘 PHP & Laravel 11
            </span>
          </div>

          {/* 3 Compact CTA Buttons (Giảm 40% padding) */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.1rem" }}>
            <a
              href="#dich-vu-coding"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                padding: "0.55rem 1.15rem",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.84rem",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                transition: "all 0.2s ease"
              }}
            >
              <Terminal size={15} />
              <span>Khám Phá 13+ Môn Coding</span>
            </a>

            <a
              href="#dich-vu-hoc-vu"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                padding: "0.55rem 1.15rem",
                borderRadius: "8px",
                background: "var(--surface-hover)",
                border: "1.5px solid var(--border-medium)",
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.84rem",
                textDecoration: "none",
                boxShadow: "var(--shadow-subtle)",
                transition: "all 0.2s ease"
              }}
            >
              <BookOpen size={15} />
              <span>5 Dịch Vụ Học Vụ 1-1</span>
            </a>

            <a
              href="#dang-ky-tu-van"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.25rem",
                padding: "0.55rem 0.85rem",
                borderRadius: "8px",
                background: "transparent",
                color: "var(--brand-primary)",
                fontWeight: 800,
                fontSize: "0.84rem",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
            >
              <span>Xếp Lịch Học Kèm →</span>
            </a>
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
