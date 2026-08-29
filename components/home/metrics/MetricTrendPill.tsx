"use client";

import { TrendingUp } from "lucide-react";

interface MetricTrendPillProps {
  trend: string;
}

export default function MetricTrendPill({ trend }: MetricTrendPillProps) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.25rem",
      fontSize: "0.72rem",
      fontWeight: 700,
      color: "var(--brand-emerald-dark)",
      background: "rgba(16, 185, 129, 0.1)",
      padding: "0.15rem 0.5rem",
      borderRadius: "var(--radius-full)"
    }}>
      <TrendingUp size={12} />
      <span>{trend}</span>
    </span>
  );
}
