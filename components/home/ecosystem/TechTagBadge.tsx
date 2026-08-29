"use client";

interface TechTagBadgeProps {
  badge: string;
  color: string;
}

export default function TechTagBadge({ badge, color }: TechTagBadgeProps) {
  return (
    <span style={{
      fontSize: "0.72rem",
      fontWeight: 800,
      color: color,
      background: `${color}10`,
      padding: "0.2rem 0.6rem",
      borderRadius: "var(--radius-full)",
      border: `1px solid ${color}30`
    }}>
      {badge}
    </span>
  );
}
