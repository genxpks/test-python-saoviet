"use client";

import { Phone, Sparkles } from "lucide-react";

export default function BranchSupportCallout() {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(6, 182, 212, 0.05))",
      border: "1px solid rgba(37, 99, 235, 0.15)",
      borderRadius: "var(--radius-md)",
      padding: "0.8rem 1.2rem",
      marginTop: "1.5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "0.8rem"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Sparkles size={16} color="var(--brand-primary)" />
        <span style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Đăng ký học trực tiếp tại phòng Lab máy tính cấu hình cao:
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--brand-primary)", fontWeight: 800, fontSize: "0.92rem" }}>
        <Phone size={15} />
        <span>Hotline Tổng Đài: 0901.888.666</span>
      </div>
    </div>
  );
}
