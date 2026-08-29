"use client";

import { CheckCircle2 } from "lucide-react";

interface SyllabusTopicItemProps {
  topic: string;
  color: string;
}

export default function SyllabusTopicItem({ topic, color }: SyllabusTopicItemProps) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
      <CheckCircle2 size={16} color={color} style={{ minWidth: "16px", marginTop: "3px" }} />
      <span>{topic}</span>
    </div>
  );
}
