"use client";

import { useState } from "react";
import { User } from "@/types";
import { updateUser, generateStandardPassword } from "@/lib/usersData";
import { UserCheck, X, CheckCircle2, Sparkles, Eye, EyeOff } from "lucide-react";

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
  const [role, setRole] = useState<'teacher' | 'student'>(user.role);
  const [pin, setPin] = useState(user.pin || "8888");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const applyStandardPassword = () => {
    const stdPass = generateStandardPassword(fullName, phone || user.username);
    setPassword(stdPass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatePayload = {
      fullName,
      phone,
      class: className,
      password,
      role,
      pin: role === "teacher" ? pin : undefined
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
          fullName,
          phone,
          className,
          password,
          role,
          pin
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
        <button
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
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: "rgba(37, 99, 235, 0.12)",
            color: "var(--brand-primary)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 0.8rem auto"
          }}>
            <UserCheck size={28} />
          </div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Chỉnh Sửa Tài Khoản</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Tên đăng nhập: <strong style={{ color: "var(--brand-primary)" }}>{user.username}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "0.9rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
              Họ Và Tên Học Viên:
            </label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "0.9rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                Số Điện Thoại (SĐT):
              </label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 0912345671"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                Lớp Học:
              </label>
              <input
                type="text"
                className="form-input"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
          </div>

          {/* Password with Eye and Standard Reset */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>
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
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: "40px" }}
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
                  color: "#64748b",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center"
                }}
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1.4rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                Vai Trò:
              </label>
              <select
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                disabled={user.username === "admin"}
              >
                <option value="student">Học Viên</option>
                <option value="teacher">Giáo Viên Quản Trị</option>
              </select>
            </div>

            {role === "teacher" && (
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                  Mã PIN Mở Khóa Đề:
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={6}
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={isLoading}>
            <CheckCircle2 size={18} />
            <span>{isLoading ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
