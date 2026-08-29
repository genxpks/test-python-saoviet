"use client";

import TiltCard3D from "../TiltCard3D";
import MetricNumberCounter from "./MetricNumberCounter";
import MetricLabelBadge from "./MetricLabelBadge";
import MetricTrendPill from "./MetricTrendPill";
import MetricIconGlow from "./MetricIconGlow";

interface MetricItemCardProps {
  item: {
    label: string;
    value: string;
    trend: string;
    icon: any;
    color: string;
  };
}

export default function MetricItemCard({ item }: MetricItemCardProps) {
  return (
    <TiltCard3D maxTilt={5} scale={1.015}>
      <div
        className="q-card"
        style={{
          padding: "1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid var(--border-light)",
          background: "var(--surface-card)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-subtle)"
        }}
      >
        <div>
          <MetricLabelBadge label={item.label} />
          <MetricNumberCounter value={item.value} />
          <MetricTrendPill trend={item.trend} />
        </div>

        <MetricIconGlow icon={item.icon} color={item.color} />
      </div>
    </TiltCard3D>
  );
}
