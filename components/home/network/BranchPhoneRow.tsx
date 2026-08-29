"use client";

import { Phone } from "lucide-react";

interface BranchPhoneRowProps {
  phone: string;
}

export default function BranchPhoneRow({ phone }: BranchPhoneRowProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
      <Phone size={15} color="var(--brand-emerald)" />
      <span>Hotline: <strong>{phone}</strong></span>
    </div>
  );
}
