"use client";

import TiltCard3D from "../TiltCard3D";
import BranchHeaderBadge from "./BranchHeaderBadge";
import BranchAddressRow from "./BranchAddressRow";
import BranchPhoneRow from "./BranchPhoneRow";
import BranchManagerRow from "./BranchManagerRow";
import BranchLabSpecBadge from "./BranchLabSpecBadge";

interface BranchCard3DProps {
  branch: any;
  isSelected: boolean;
  onSelect: () => void;
}

export default function BranchCard3D({ branch, isSelected, onSelect }: BranchCard3DProps) {
  return (
    <TiltCard3D maxTilt={6} scale={1.015}>
      <div
        onClick={onSelect}
        className="q-card"
        style={{
          cursor: "pointer",
          padding: "1.5rem",
          border: isSelected ? "2px solid var(--brand-primary)" : "1px solid var(--border-light)",
          background: isSelected ? "linear-gradient(145deg, rgba(37, 99, 235, 0.04), rgba(255, 255, 255, 0.95))" : "var(--surface-card)",
          boxShadow: isSelected ? "0 14px 30px -8px rgba(37, 99, 235, 0.15)" : "var(--shadow-subtle)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          borderRadius: "var(--radius-md)"
        }}
      >
        <div>
          <BranchHeaderBadge district={branch.district} code={branch.code} />

          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.6rem", color: "var(--text-primary)" }}>
            {branch.name}
          </h3>

          <BranchAddressRow address={branch.address} />
          <BranchPhoneRow phone={branch.phone} />
          <BranchManagerRow manager={branch.manager} />
        </div>

        <BranchLabSpecBadge rooms={branch.rooms} />
      </div>
    </TiltCard3D>
  );
}
