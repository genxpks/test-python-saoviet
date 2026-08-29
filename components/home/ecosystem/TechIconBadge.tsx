"use client";

interface TechIconBadgeProps {
  icon: any;
  color: string;
}

export default function TechIconBadge({ icon: Icon, color }: TechIconBadgeProps) {
  return (
    <div style={{
      width: "44px",
      height: "44px",
      borderRadius: "12px",
      background: `${color}15`,
      color: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Icon size={22} />
    </div>
  );
}
