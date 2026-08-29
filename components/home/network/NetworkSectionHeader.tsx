"use client";

import { Building2 } from "lucide-react";

export default function NetworkSectionHeader() {
  return (
    <div style={{ textAlign: "center", marginBottom: "2.2rem" }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "rgba(37, 99, 235, 0.08)",
        color: "var(--brand-primary)",
        padding: "0.3rem 0.85rem",
        borderRadius: "var(--radius-full)",
        fontSize: "0.8rem",
        fontWeight: 800,
        marginBottom: "0.6rem"
      }}>
        <Building2 size={14} />
        <span>MẠNG LƯỚI CHI NHÁNH ĐÀO TẠO</span>
      </div>

      <h2 style={{ fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "0.4rem" }}>
        Hệ Thống 4 Cơ Sở Đào Tạo Chuẩn Phòng Lab Tại TP.HCM
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "650px", margin: "0 auto" }}>
        Phòng máy lạnh hiện đại 100%, kết nối mạng riêng bảo mật, hỗ trợ giáo viên kèm 1:1 trong suốt quá trình ôn tập và thi cử.
      </p>
    </div>
  );
}
