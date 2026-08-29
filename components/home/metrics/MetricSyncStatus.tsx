"use client";

import MetricLivePulseDot from "./MetricLivePulseDot";

export default function MetricSyncStatus() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.75rem",
      color: "var(--text-muted)",
      marginBottom: "0.8rem"
    }}>
      <MetricLivePulseDot />
      <span>HỆ THỐNG ĐỒNG BỘ THỜI GIAN THỰC 4 CƠ SỞ</span>
    </div>
  );
}
