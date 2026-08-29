"use client";

import SyllabusTopicItem from "./SyllabusTopicItem";

interface SyllabusTopicListProps {
  topics: string[];
  color: string;
}

export default function SyllabusTopicList({ topics, color }: SyllabusTopicListProps) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h4 style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.6rem", letterSpacing: "0.04em" }}>
        Lộ Trình Các Chương Trọng Điểm:
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
        {topics.map((topic, idx) => (
          <SyllabusTopicItem key={idx} topic={topic} color={color} />
        ))}
      </div>
    </div>
  );
}
