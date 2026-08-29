"use client";

import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export default function HeroActionCTAButtonGroup() {
  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.2rem" }}>
      <Link href="/study" className="btn btn-primary btn-lg" style={{ gap: "0.6rem" }}>
        <BookOpen size={18} />
        <span>Bắt Đầu Ôn Tập 120 Câu</span>
        <ArrowRight size={16} />
      </Link>

      <Link href="/exam" className="btn btn-secondary btn-lg" style={{ gap: "0.6rem" }}>
        <Clock size={18} color="var(--brand-primary)" />
        <span>Vào Phòng Thi Online 50P</span>
      </Link>
    </div>
  );
}
