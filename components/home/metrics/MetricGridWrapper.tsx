"use client";

import MetricItemCard from "./MetricItemCard";

interface MetricGridWrapperProps {
  metrics: any[];
}

export default function MetricGridWrapper({ metrics }: MetricGridWrapperProps) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "1.2rem",
      marginBottom: "3.5rem"
    }}>
      {metrics.map((m, idx) => (
        <MetricItemCard key={idx} item={m} />
      ))}
    </div>
  );
}
