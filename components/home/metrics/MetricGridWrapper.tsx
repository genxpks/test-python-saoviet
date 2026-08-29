"use client";

import MetricItemCard from "./MetricItemCard";

interface MetricGridWrapperProps {
  metrics: any[];
}

const DELAY_CLASSES = ["animate-item-d1", "animate-item-d2", "animate-item-d3", "animate-item-d4", "animate-item-d5", "animate-item-d6"];

export default function MetricGridWrapper({ metrics }: MetricGridWrapperProps) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "1.2rem",
      marginBottom: "3.5rem"
    }}>
      {metrics.map((m, idx) => (
        <div key={idx} className={`animate-item ${DELAY_CLASSES[idx] || ""}`}>
          <MetricItemCard item={m} />
        </div>
      ))}
    </div>
  );
}
