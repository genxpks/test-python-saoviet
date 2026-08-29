"use client";

import { UserCheck } from "lucide-react";

interface BranchManagerRowProps {
  manager: string;
}

export default function BranchManagerRow({ manager }: BranchManagerRowProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "0.8rem" }}>
      <UserCheck size={15} color="var(--brand-violet)" />
      <span>Phụ trách: <strong>{manager}</strong></span>
    </div>
  );
}
