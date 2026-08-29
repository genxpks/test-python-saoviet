"use client";

interface MetricLabelBadgeProps {
  label: string;
}

export default function MetricLabelBadge({ label }: MetricLabelBadgeProps) {
  return (
    <div style={{
      fontSize: "0.82rem",
      fontWeight: 600,
      color: "var(--text-muted)",
      textTransform: "uppercase",
      letterSpacing: "0.03em"
    }}>
      {label}
    </div>
  );
}
