"use client";

interface RoadmapStepContentProps {
  title: string;
  desc: string;
}

export default function RoadmapStepContent({ title, desc }: RoadmapStepContentProps) {
  return (
    <>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.55" }}>
        {desc}
      </p>
    </>
  );
}
