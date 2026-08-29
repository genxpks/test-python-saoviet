"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SyllabusActionFooter() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid var(--border-light)" }}>
      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
        Chứng nhận cấp bởi <strong>Tin Học Sao Việt</strong>
      </div>
      <Link href="/study" className="btn btn-primary btn-sm" style={{ gap: "0.4rem" }}>
        <span>Vào Ôn Luyện Bộ Môn Này</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
