"use client";

import { MapPin, ExternalLink } from "lucide-react";

export default function BranchMapLinkAction() {
  return (
    <div style={{ textAlign: "center", marginTop: "1.8rem" }}>
      <span style={{ fontSize: "0.86rem", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
        <MapPin size={15} color="var(--brand-primary)" />
        Học viên có thể linh hoạt chuyển đổi ca học giữa 4 cơ sở phòng Lab.
      </span>
    </div>
  );
}
