"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SimulatorFooterCallout() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-light)" }}>
      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
        Hệ thống lưu trữ <strong>120 câu hỏi</strong> tương tác với giải thích chi tiết.
      </span>
      <Link href="/study" className="btn btn-primary btn-sm" style={{ gap: "0.4rem" }}>
        <span>Luyện Tập Đầy Đủ 120 Câu</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
