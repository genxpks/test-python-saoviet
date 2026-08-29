"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function RoadmapActionCTA() {
  return (
    <div style={{ textAlign: "center", marginTop: "1.8rem" }}>
      <Link href="/study" className="btn btn-primary btn-md" style={{ gap: "0.5rem" }}>
        <BookOpen size={16} />
        <span>Bắt Đầu Hành Trình Ôn Thi Ngay</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
