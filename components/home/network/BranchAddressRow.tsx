"use client";

import { MapPin } from "lucide-react";

interface BranchAddressRowProps {
  address: string;
}

export default function BranchAddressRow({ address }: BranchAddressRowProps) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
      <MapPin size={15} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
      <span>{address}</span>
    </div>
  );
}
