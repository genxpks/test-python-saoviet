"use client";

import Link from "next/link";
import CyberPlanet3D from "./hero/CyberPlanet3D";
import CosmicSubjectDeck from "./hero/CosmicSubjectDeck";
import { Sparkles, ArrowRight, BookOpen, Clock } from "lucide-react";

export default function HeroLayer3D() {
  return (
    <section style={{ position: "relative", marginBottom: "2.5rem", perspective: "1200px" }}>
      {/* Dynamic Cosmic Aurora Glows */}
      <div style={{
        position: "absolute",
        top: "-80px",
        left: "0%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(0, 245, 200, 0.18) 0%, transparent 70%)",
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
        background: "radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(99, 102, 241, 0.12) 50%, transparent 70%)",
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
        {/* Left Column: Typography & CTAs (Exact Mockup Layout) */}
        <div className="animate-left" style={{ paddingRight: "1rem" }}>
          {/* Eyebrow label */}
          <div style={{
            fontSize: "0.92rem",
            fontWeight: 700,
            color: "#00f5c8",
            letterSpacing: "0.04em",
            marginBottom: "1rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem"
          }}>
            <span>Tin Học Sao Việt</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-1.5px",
            color: "#ffffff",
            marginBottom: "1.2rem",
            fontFamily: "var(--font-heading)"
          }}>
            Hệ Thống Đào Tạo &<br />
            Khảo Thí Lập Trình{" "}
            <span style={{
              background: "linear-gradient(135deg, #00f5c8 0%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 35px rgba(0, 245, 200, 0.45)"
            }}>
              3D
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "1.02rem",
            color: "rgba(203, 213, 225, 0.85)",
            lineHeight: 1.6,
            marginBottom: "2rem",
            maxWidth: "540px"
          }}>
            - Tin Học Sao Việt — Hệ thống Đào tạo & Khảo thí Lập trình chuẩn hóa, đánh giá năng lực thực tế học viên với 120+ câu hỏi và mô phỏng 3D trực quan.
          </p>

          {/* 2 CTA Buttons (Matching Mockup) */}
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
                background: "linear-gradient(135deg, #00f5c8 0%, #0ea5e9 100%)",
                color: "#020a14",
                fontWeight: 800,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow: "0 6px 25px rgba(0, 245, 200, 0.4), 0 0 0 1px rgba(0, 245, 200, 0.3)",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
              className="mockup-btn-primary"
            >
              <BookOpen size={17} />
              <span>Bắt Đầu Ngay</span>
            </Link>

            <Link
              href="/exam"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.85rem 1.8rem",
                borderRadius: "10px",
                background: "rgba(6, 16, 40, 0.6)",
                border: "1.5px solid rgba(0, 245, 200, 0.35)",
                color: "#00f5c8",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
              className="mockup-btn-secondary"
            >
              <Clock size={17} />
              <span>Phòng Thi 50P</span>
            </Link>
          </div>
        </div>

        {/* Right Column: 3D Holographic Cyber Planet (Borderless Floating in Space) */}
        <div className="animate-right" style={{ position: "relative", minHeight: "520px" }}>
          <CyberPlanet3D />
        </div>
      </div>

      {/* EXACT 3 CARDS AT BOTTOM OF HERO (Matching Mockup) */}
      <CosmicSubjectDeck />
    </section>
  );
}
