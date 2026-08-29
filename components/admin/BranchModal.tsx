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
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: "560px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.8rem", marginBottom: "1.2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Building2 size={20} color="var(--brand-primary)" />
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
              {branch ? "Chỉnh Sửa Chi Nhánh" : "Thêm Chi Nhánh Mới"}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: "0.3rem" }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              Tên Chi Nhánh Trung Tâm: *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Chi Nhánh TP. Thủ Đức"
              className="input"
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Mã Chi Nhánh: *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: TD_HCM, Q1_HCM"
                className="input"
                style={{ width: "100%", textTransform: "uppercase" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Số Điện Thoại Hotline:
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 0901.234.567"
                className="input"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              Địa Chỉ Cơ Sở:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="VD: Số 9 Đường số 9, P. Linh Tây, TP. Thủ Đức"
              className="input"
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Người Phụ Trách / Quản Lý:
              </label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="VD: Thầy Nguyễn Duy Thiên"
                className="input"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Mã PIN Giáo Viên Mở Khóa:
              </label>
              <input
                type="text"
                value={defaultTeacherPin}
                onChange={(e) => setDefaultTeacherPin(e.target.value)}
                placeholder="VD: 8888"
                className="input"
                style={{ width: "100%", fontWeight: 700, letterSpacing: "2px" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "1rem", borderTop: "1px solid var(--border-light)", paddingTop: "0.8rem" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={14} />
              <span>{branch ? "Cập Nhật Chi Nhánh" : "Tạo Chi Nhánh Mới"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
