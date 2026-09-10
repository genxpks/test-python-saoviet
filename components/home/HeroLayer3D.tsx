"use client";

import Link from "next/link";
import CyberPlanet3D from "./hero/CyberPlanet3D";
import CosmicSubjectDeck from "./hero/CosmicSubjectDeck";
import { BookOpen, Clock } from "lucide-react";

export default function HeroLayer3D() {
  return (
    <section style={{ position: "relative", marginBottom: "2.5rem", perspective: "1200px" }}>
      {/* Adaptive Aurora Glows — hoạt động tốt cả dark & light */}
      <div style={{
        position: "absolute",
        top: "-80px",
        left: "0%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, var(--hero-glow-teal, rgba(37, 99, 235, 0.12)) 0%, transparent 70%)",
        filter: "blur(75px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div style={{
        position: "absolute",
        top: "5%",
        right: "0%",
        width: "550px",
        height: "550px",
        background: "radial-gradient(circle, var(--hero-glow-blue, rgba(14, 165, 233, 0.15)) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%)",
        filter: "blur(70px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div
        className="hero-grid-responsive"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: "2rem",
          alignItems: "center",
          minHeight: "520px"
        }}
      >
        {/* Left Column: Typography & CTAs */}
        <div className="animate-left" style={{ paddingRight: "1rem" }}>
          {/* Eyebrow label — Trust signal 10+ năm */}
          <div style={{
            fontSize: "0.85rem",
            fontWeight: 800,
            color: "var(--brand-primary)",
            letterSpacing: "0.04em",
            marginBottom: "1.1rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 0.95rem",
            borderRadius: "9999px",
            background: "rgba(37, 99, 235, 0.08)",
            border: "1px solid rgba(37, 99, 235, 0.2)"
          }}>
            <span style={{ color: "#f59e0b" }}>★</span>
            <span>TIN HỌC SAO VIỆT — 10+ NĂM ĐÀO TẠO THỰC CHIẾN</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: "clamp(2.4rem, 4.8vw, 3.7rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-1.5px",
            color: "var(--text-primary)",
            marginBottom: "1.2rem",
            fontFamily: "var(--font-heading)"
          }}>
            Hệ Thống Đào Tạo &<br />
            Khảo Thí Thực Chiến{" "}
            <span style={{
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Sao Việt
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "1.05rem",
            color: "var(--text-muted)",
            lineHeight: 1.65,
            marginBottom: "1.8rem",
            maxWidth: "560px"
          }}>
            Chuyên sâu Tin Học Văn Phòng <strong>THVP-32</strong>, Luyện thi chứng chỉ quốc tế <strong>MOS / IC3</strong>, <strong>Kế Toán Doanh Nghiệp</strong> & <strong>Lập Trình Ứng Dụng</strong>. Phương pháp cầm tay chỉ việc 1 kèm 1 — Cam kết học đến khi thành thạo!
          </p>

          {/* 3 CTA Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap", marginBottom: "1.8rem" }}>
            <a
              href="#dang-ky-tu-van"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.85rem 1.6rem",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
                transition: "all 0.2s ease"
              }}
            >
              <BookOpen size={17} />
              <span>Đăng Ký Tư Vấn Lớp</span>
            </a>

            <Link
              href="/exam"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.85rem 1.6rem",
                borderRadius: "12px",
                background: "var(--surface-hover)",
                border: "1.5px solid var(--surface-glass-border)",
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                transition: "all 0.2s ease"
              }}
            >
              <Clock size={17} />
              <span>Thi Trực Tuyến</span>
            </Link>

            <Link
              href="/study"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.85rem 1.2rem",
                borderRadius: "12px",
                background: "transparent",
                color: "var(--brand-primary)",
                fontWeight: 700,
                fontSize: "0.92rem",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
            >
              <span>Ôn tập 120 câu →</span>
            </Link>
          </div>

          {/* Quick Trust Pills */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ color: "var(--brand-emerald)", fontWeight: 900 }}>✓</span> Học đến khi làm được việc
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ color: "var(--brand-emerald)", fontWeight: 900 }}>✓</span> Lịch học linh hoạt 3 ca
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ color: "var(--brand-emerald)", fontWeight: 900 }}>✓</span> 6 Cơ sở TP.HCM & BD
            </span>
          </div>
        </div>

        {/* Right Column: 3D Holographic Cyber Planet */}
        <div className="animate-right" style={{ position: "relative", minHeight: "520px" }}>
          <CyberPlanet3D />
        </div>
      </div>

      {/* 3 Subject Cards at Bottom of Hero */}
      <CosmicSubjectDeck />
    </section>
  );
}
