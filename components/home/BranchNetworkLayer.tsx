"use client";

import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Phone, 
  UserCheck, 
  ShieldCheck, 
  KeyRound, 
  ExternalLink,
  Sparkles
} from "lucide-react";

interface BranchItem {
  code: string;
  name: string;
  district: string;
  address: string;
  phone: string;
  manager: string;
  rooms: string;
  pin: string;
}

const BRANCHES: BranchItem[] = [
  {
    code: "CN_THUDUC",
    name: "Trung Tâm Tin Học Sao Việt — Cơ Sở Thủ Đức",
    district: "TP. Thủ Đức",
    address: "Số 15, Đường Số 9, P. Linh Tây, TP. Thủ Đức, TP.HCM",
    phone: "0901.888.666",
    manager: "ThS. Nguyễn Văn A",
    rooms: "04 Phòng máy chuyên dụng (Máy tính cấu hình Core i7, 32GB RAM)",
    pin: "8888"
  },
  {
    code: "CN_QUAN1",
    name: "Trung Tâm Tin Học Sao Việt — Cơ Sở Quận 1",
    district: "Quận 1",
    address: "Số 45, Đường Lê Duẩn, P. Bến Nghé, Quận 1, TP.HCM",
    phone: "0902.777.888",
    manager: "ThS. Trần Thị B",
    rooms: "03 Phòng Lab cao cấp trang bị macOS & Linux",
    pin: "9999"
  },
  {
    code: "CN_GOVAP",
    name: "Trung Tâm Tin Học Sao Việt — Cơ Sở Gò Vấp",
    district: "Gò Vấp",
    address: "Số 120, Đường Quang Trung, P. 10, Q. Gò Vấp, TP.HCM",
    phone: "0903.666.999",
    manager: "KSTK. Lê Hoàng C",
    rooms: "04 Phòng máy lạnh tiêu chuẩn ISO",
    pin: "6666"
  },
  {
    code: "CN_BINHTHANH",
    name: "Trung Tâm Tin Học Sao Việt — Cơ Sở Bình Thạnh",
    district: "Bình Thạnh",
    address: "Số 88, Đường Điện Biên Phủ, P. 25, Q. Bình Thạnh, TP.HCM",
    phone: "0904.555.444",
    manager: "ThS. Phạm Quốc D",
    rooms: "05 Phòng máy kết nối mạng Gigabit băng thông cao",
    pin: "7777"
  }
];

export default function BranchNetworkLayer() {
  const [activeBranch, setActiveBranch] = useState(BRANCHES[0]);

  return (
    <section style={{ marginBottom: "3.5rem" }}>
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(37, 99, 235, 0.08)",
          color: "var(--brand-primary)",
          padding: "0.3rem 0.8rem",
          borderRadius: "var(--radius-full)",
          fontSize: "0.8rem",
          fontWeight: 800,
          marginBottom: "0.6rem"
        }}>
          <Building2 size={14} />
          <span>MẠNG LƯỚI CHI NHÁNH ĐÀO TẠO</span>
        </div>

        <h2 style={{ fontSize: "1.85rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "0.4rem" }}>
          Hệ Thống 4 Cơ Sở Đào Tạo Chuẩn Phòng Lab Tại TP.HCM
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "650px", margin: "0 auto" }}>
          Phòng máy lạnh hiện đại 100%, kết nối mạng riêng bảo mật, hỗ trợ giáo viên kèm 1:1 trong suốt quá trình ôn tập và thi cử.
        </p>
      </div>

      {/* 4 Branch Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "1.2rem" }}>
        {BRANCHES.map((b) => {
          const isSelected = activeBranch.code === b.code;

          return (
            <div
              key={b.code}
              onClick={() => setActiveBranch(b)}
              className="q-card"
              style={{
                cursor: "pointer",
                padding: "1.5rem",
                border: isSelected ? "2px solid var(--brand-primary)" : "1px solid var(--border-light)",
                background: isSelected ? "linear-gradient(145deg, rgba(37, 99, 235, 0.04), rgba(255, 255, 255, 0.9))" : "var(--surface-card)",
                boxShadow: isSelected ? "0 14px 30px -8px rgba(37, 99, 235, 0.15)" : "var(--shadow-subtle)",
                transition: "all 0.25s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                  <span className="badge badge-primary" style={{ fontSize: "0.72rem" }}>
                    {b.district}
                  </span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)" }}>
                    MÃ: {b.code}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.6rem" }}>
                  {b.name}
                </h3>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  <MapPin size={15} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{b.address}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  <Phone size={15} color="var(--brand-emerald)" />
                  <span>Hotline: <strong>{b.phone}</strong></span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "0.8rem" }}>
                  <UserCheck size={15} color="var(--brand-violet)" />
                  <span>Phụ trách: <strong>{b.manager}</strong></span>
                </div>
              </div>

              <div style={{
                background: "var(--bg-light)",
                padding: "0.6rem 0.8rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>{b.rooms}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
