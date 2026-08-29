"use client";

interface MetricNumberCounterProps {
  value: string;
}

export default function MetricNumberCounter({ value }: MetricNumberCounterProps) {
  return (
    <div style={{
      fontSize: "1.75rem",
      fontWeight: 900,
      color: "var(--text-primary)",
      letterSpacing: "-0.5px",
      lineHeight: 1.1,
      margin: "0.2rem 0"
    }}>
      {value}
    </div>
  );
}
