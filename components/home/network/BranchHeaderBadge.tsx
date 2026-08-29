"use client";

interface BranchHeaderBadgeProps {
  district: string;
  code: string;
}

export default function BranchHeaderBadge({ district, code }: BranchHeaderBadgeProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
      <span style={{
        fontSize: "0.72rem",
        fontWeight: 800,
        color: "var(--brand-primary)",
        background: "var(--brand-primary-light)",
        padding: "0.2rem 0.6rem",
        borderRadius: "var(--radius-full)",
        border: "1px solid rgba(37, 99, 235, 0.2)"
      }}>
        {district}
      </span>
      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)" }}>
        MÃ: {code}
      </span>
    </div>
  );
}
