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
          {/* Eyebrow label — dùng brand color, readable cả 2 theme */}
          <div style={{
            fontSize: "0.92rem",
            fontWeight: 700,
            color: "var(--brand-primary)",
            letterSpacing: "0.04em",
            marginBottom: "1rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem"
          }}>
            <span>Tin Học Sao Việt</span>
          </div>

          {/* Main Title — adaptive: dark trên light bg, trắng trên dark bg */}
          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-1.5px",
            color: "var(--text-primary)",
            marginBottom: "1.2rem",
            fontFamily: "var(--font-heading)"
          }}>
            Hệ Thống Đào Tạo &<br />
            Khảo Thí Lập Trình{" "}
            <span style={{
              background: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              3D
            </span>
          </h1>

          {/* Subtitle — dùng text-secondary thay vì hardcode màu nhạt */}
          <p style={{
            fontSize: "1.02rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: "2rem",
            maxWidth: "540px"
          }}>
            Tin Học Sao Việt — Hệ thống Đào tạo & Khảo thí Lập trình chuẩn hóa, đánh giá năng lực thực tế học viên với 120+ câu hỏi và mô phỏng 3D trực quan.
          </p>

          {/* 2 CTA Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/study"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.85rem 1.8rem",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow: "0 4px 18px rgba(37, 99, 235, 0.4)",
                transition: "all 0.2s ease"
              }}
            >
              <BookOpen size={17} />
              <span>Bắt Đầu Ngay</span>
            </Link>

            {/* Nút thứ 2: adaptive border button — đẹp cả light & dark */}
            <Link
              href="/exam"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.85rem 1.8rem",
                borderRadius: "10px",
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
              <span>Phòng Thi 50P</span>
            </Link>
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
