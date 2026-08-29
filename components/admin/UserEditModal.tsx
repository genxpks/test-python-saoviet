"use client";

import { useState } from "react";
import { User, UserRole } from "@/types";
import { updateUser, generateStandardPassword, getBranches } from "@/lib/usersData";
import { UserCheck, X, CheckCircle2, Sparkles, Eye, EyeOff, Building2 } from "lucide-react";

interface UserEditModalProps {
  user: User;
  onClose: () => void;
  onUserUpdated: () => void;
}

export default function UserEditModal({ user, onClose, onUserUpdated }: UserEditModalProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone || "");
  const [className, setClassName] = useState(user.class || "Python Nâng Cao");
  const [password, setPassword] = useState(user.password || "123456");
  const [role, setRole] = useState<UserRole>(user.role || "student");
  const [branchId, setBranchId] = useState(user.branchId || "branch_thuduc");
  const [pin, setPin] = useState(user.pin || "8888");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const branches = getBranches();

  const applyStandardPassword = () => {
    const stdPass = generateStandardPassword(fullName, phone || user.username);
    setPassword(stdPass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedBranch = branches.find(b => b.id === branchId);

    const updatePayload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      class: className.trim(),
      password: password.trim(),
      role: role,
      branchId: branchId,
      branchName: selectedBranch?.name || "Chi Nhánh Thủ Đức",
      pin: role !== "student" ? pin.trim() : undefined
    };

    // Update LocalStorage
    updateUser(user.id, updatePayload);

    // Call API PUT
    try {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          fullName: fullName.trim(),
          phone: phone.trim(),
          className: className.trim(),
          password: password.trim(),
          role: role,
          branchId: branchId,
          branchName: selectedBranch?.name || "Chi Nhánh Thủ Đức",
          pin: role !== "student" ? pin.trim() : undefined
        })
      });
    } catch (err) {
      console.warn("MongoDB update sync failed, updated local cache.");
    }

    setIsLoading(false);
    alert("✅ Cập nhật thông tin tài khoản thành công!");
    onUserUpdated();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: "540px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.8rem", marginBottom: "1.2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ padding: "0.4rem", background: "rgba(37, 99, 235, 0.12)", color: "var(--brand-primary)", borderRadius: "var(--radius-md)" }}>
              <UserCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>Chỉnh Sửa Tài Khoản</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                Tên đăng nhập: <strong style={{ color: "var(--brand-primary)" }}>{user.username}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: "0.3rem" }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              Họ Và Tên: *
            </label>
            <input
              type="text"
              className="input"
              style={{ width: "100%" }}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Số Điện Thoại (SĐT):
              </label>
              <input
                type="tel"
                className="input"
                style={{ width: "100%" }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 0912345671"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Lớp Học / Khóa:
              </label>
              <input
                type="text"
                className="input"
                style={{ width: "100%" }}
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Vai Trò (Role):
              </label>
              <select
                className="input"
                style={{ width: "100%", fontWeight: 600 }}
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                disabled={user.username === "admin"}
              >
                <option value="student">🎓 Học Viên</option>
                <option value="branch_manager">🏫 Quản Lý Chi Nhánh</option>
                <option value="admin">👑 Tổng Quản Trị (Admin)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Chi Nhánh:
              </label>
              <select
                className="input"
                style={{ width: "100%" }}
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Password with Eye and Standard Reset */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
              <label style={{ fontSize: "0.84rem", fontWeight: 700 }}>
                Mật Khẩu Đăng Nhập:
              </label>
              <button
                type="button"
                onClick={applyStandardPassword}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--brand-primary)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px"
                }}
              >
                <Sparkles size={12} />
                <span>Đặt lại chuẩn (Tên + SĐT)</span>
              </button>
            </div>

            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                style={{ width: "100%", paddingRight: "40px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "4px"
                }}
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {role !== "student" && (
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Mã PIN Giáo Viên Mở Khóa Đề:
              </label>
              <input
                type="text"
                className="input"
                style={{ width: "160px", fontWeight: 800, letterSpacing: "2px" }}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
              />
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "1rem", borderTop: "1px solid var(--border-light)", paddingTop: "0.8rem" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>
              <CheckCircle2 size={14} />
              <span>{isLoading ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
