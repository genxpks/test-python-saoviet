"use client";

import { useState } from "react";
import { Branch } from "@/types";
import { Building2, X, Check, Phone, MapPin, KeyRound, UserCheck } from "lucide-react";

interface BranchModalProps {
  branch?: Branch | null;
  onSave: (branch: Partial<Branch>) => void;
  onClose: () => void;
}

export default function BranchModal({ branch, onSave, onClose }: BranchModalProps) {
  const [name, setName] = useState(branch?.name || "");
  const [code, setCode] = useState(branch?.code || "");
  const [address, setAddress] = useState(branch?.address || "");
  const [phone, setPhone] = useState(branch?.phone || "");
  const [managerName, setManagerName] = useState(branch?.managerName || "");
  const [defaultTeacherPin, setDefaultTeacherPin] = useState(branch?.defaultTeacherPin || "8888");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      alert("Vui lòng nhập tên chi nhánh và mã định danh!");
      return;
    }

    onSave({
      id: branch?.id,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      address: address.trim(),
      phone: phone.trim(),
      managerName: managerName.trim(),
      defaultTeacherPin: defaultTeacherPin.trim() || "8888"
    });
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.6)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div style={{
        background: "#ffffff",
        color: "#0f172a",
        maxWidth: "580px",
        width: "100%",
        maxHeight: "92vh",
        overflowY: "auto",
        padding: "2rem",
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)",
        position: "relative"
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b"
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
          <div style={{
            width: "46px",
            height: "46px",
            borderRadius: "14px",
            background: "#eff6ff",
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              {branch ? "Chỉnh Sửa Chi Nhánh Đào Tạo" : "Thêm Chi Nhánh / Cơ Sở Mới"}
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0.2rem 0 0" }}>
              Cơ sở đào tạo thực hành Tin Học Sao Việt với phòng máy chuẩn.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
              Tên Chi Nhánh / Cơ Sở: *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Chi Nhánh TP. Thủ Đức"
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: "0.88rem"
              }}
              autoFocus
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Mã Chi Nhánh: *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: TD_HCM, Q1_HCM"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.88rem"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Số Điện Thoại Hotline:
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 0901.234.567"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontSize: "0.88rem"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
              Địa Chỉ Cơ Sở Phòng Máy:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="VD: Khu Đô Thị ĐHQG TP.HCM / Đường số 9, P. Linh Tây, TP. Thủ Đức"
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: "0.88rem"
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Thầy / Cô Phụ Trách Cơ Sở:
              </label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="VD: Thầy Nguyễn Duy Thiên"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontSize: "0.88rem"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Mã PIN Giáo Viên Mặc Định:
              </label>
              <input
                type="text"
                value={defaultTeacherPin}
                onChange={(e) => setDefaultTeacherPin(e.target.value)}
                placeholder="8888"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  letterSpacing: "0.1em"
                }}
              />
            </div>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "0.5rem",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "1rem"
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.65rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#475569",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: "0.65rem 1.35rem",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              {branch ? "Cập Nhật Chi Nhánh" : "Tạo Chi Nhánh Mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
