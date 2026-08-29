"use client";

import { Database } from "lucide-react";

export default function DatabaseClusterHighlight() {
  return (
    <div style={{
      textAlign: "center",
      marginTop: "1.2rem",
      fontSize: "0.82rem",
      color: "var(--text-muted)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.4rem"
    }}>
      <Database size={14} color="var(--brand-emerald)" />
      <span>Hệ thống đồng bộ dữ liệu đa vùng với độ trễ dưới 15ms.</span>
    </div>
  );
}
