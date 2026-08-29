"use client";

interface SubjectTrackIconBadgeProps {
  icon: any;
  color: string;
  isSelected: boolean;
}

export default function SubjectTrackIconBadge({ icon: Icon, color, isSelected }: SubjectTrackIconBadgeProps) {
  return (
    <div style={{
      width: "44px",
      height: "44px",
      borderRadius: "12px",
      background: isSelected ? color : "var(--surface-subtle)",
      color: isSelected ? "#ffffff" : color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.25s ease",
      boxShadow: isSelected ? `0 4px 12px ${color}40` : "none"
    }}>
      <Icon size={22} />
    </div>
  );
}
