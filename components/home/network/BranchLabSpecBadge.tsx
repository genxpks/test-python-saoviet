"use client";

interface BranchLabSpecBadgeProps {
  rooms: string;
}

export default function BranchLabSpecBadge({ rooms }: BranchLabSpecBadgeProps) {
  return (
    <div style={{
      background: "var(--surface-subtle)",
      padding: "0.6rem 0.8rem",
      borderRadius: "var(--radius-sm)",
      fontSize: "0.78rem",
      color: "var(--text-muted)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <span>{rooms}</span>
    </div>
  );
}
