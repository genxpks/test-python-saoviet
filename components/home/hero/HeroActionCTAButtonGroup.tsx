"use client";

import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export default function HeroActionCTAButtonGroup() {
  return (
    <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", marginBottom: "2rem" }}>
      <Link
        href="/study"
        className="btn btn-lg"
        style={{
          gap: "0.6rem",
          background: "linear-gradient(135deg, #0ea5e9, #3b82f6, #6366f1)",
          color: "#ffffff",
          boxShadow: "0 8px 28px rgba(59, 130, 246, 0.45), 0 0 0 1px rgba(59,130,246,0.3)",
          border: "none",
          transition: "all 0.25s ease"
        }}
      >
        <BookOpen size={18} />
        <span>Bắt Đầu Ôn Tập 120 Câu</span>
        <ArrowRight size={16} />
      </Link>

      <Link
        href="/exam"
        className="btn btn-lg"
        style={{
          gap: "0.6rem",
          background: "rgba(0, 245, 200, 0.08)",
          color: "#00f5c8",
          border: "1px solid rgba(0, 245, 200, 0.3)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 20px rgba(0, 245, 200, 0.1)"
        }}
      >
        <Clock size={18} />
        <span>Vào Phòng Thi Online 50P</span>
      </Link>
    </div>
  );
}
