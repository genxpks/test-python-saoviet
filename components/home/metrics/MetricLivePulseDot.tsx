"use client";

export default function MetricLivePulseDot() {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px" }}>
      <span style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: "#10b981",
        opacity: 0.75,
        animation: "pulse-subtle 2s cubic-bezier(0, 0, 0.2, 1) infinite"
      }} />
      <span style={{
        position: "relative",
        display: "inline-flex",
        borderRadius: "50%",
        width: "8px",
        height: "8px",
        background: "#059669"
      }} />
    </span>
  );
}
