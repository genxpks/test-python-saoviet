"use client";

import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export default function HeroActionCTAButtonGroup() {
  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
      <Link
        href="/study"
        className="btn btn-primary btn-lg"
        style={{
          gap: "0.6rem",
          boxShadow: "0 8px 24px -4px rgba(37, 99, 235, 0.4)",
          transform: "translateY(0)",
          transition: "all 0.25s ease"
        }}
      >
        <BookOpen size={18} />
        <span>Bắt Đầu Ôn Tập 120 Câu</span>
        <ArrowRight size={16} />
      </Link>

      <Link
        href="/exam"
        className="btn btn-secondary btn-lg"
        style={{
          gap: "0.6rem",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          border: "1.5px solid var(--border-medium)"
        }}
      >
        <Clock size={18} color="var(--brand-primary)" />
        <span>Vào Phòng Thi Online 50P</span>
      </Link>
    </div>
  );
}
