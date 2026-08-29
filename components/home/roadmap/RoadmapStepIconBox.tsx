"use client";

interface RoadmapStepIconBoxProps {
  icon: any;
  color: string;
}

export default function RoadmapStepIconBox({ icon: Icon, color }: RoadmapStepIconBoxProps) {
  return (
    <div style={{
      width: "48px",
      height: "48px",
      borderRadius: "14px",
      background: `${color}15`,
      color: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 4px 14px ${color}20`
    }}>
      <Icon size={24} />
    </div>
  );
}
