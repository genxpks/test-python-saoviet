"use client";

interface RoadmapStepNumberBadgeProps {
  step: string;
}

export default function RoadmapStepNumberBadge({ step }: RoadmapStepNumberBadgeProps) {
  return (
    <span style={{
      fontSize: "0.75rem",
      fontWeight: 800,
      color: "var(--brand-primary)",
      background: "var(--brand-primary-light)",
      padding: "0.2rem 0.6rem",
      borderRadius: "var(--radius-full)"
    }}>
      {step}
    </span>
  );
}
