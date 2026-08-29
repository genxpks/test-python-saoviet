"use client";

interface MetricIconGlowProps {
  icon: any;
  color: string;
}

export default function MetricIconGlow({ icon: Icon, color }: MetricIconGlowProps) {
  return (
    <div style={{
      width: "42px",
      height: "42px",
      borderRadius: "12px",
      background: `${color}15`,
      color: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 4px 12px ${color}20`
    }}>
      <Icon size={20} />
    </div>
  );
}
