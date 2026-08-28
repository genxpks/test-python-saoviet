"use client";

import { useState } from "react";
import { User } from "@/types";
import { updateUser } from "@/lib/usersData";
import { UserCheck, X, CheckCircle2 } from "lucide-react";

interface UserEditModalProps {
  user: User;
  onClose: () => void;
  onUserUpdated: () => void;
}

export default function UserEditModal({ user, onClose, onUserUpdated }: UserEditModalProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [className, setClassName] = useState(user.class || "Python Nâng Cao");
  const [password, setPassword] = useState(user.password || "123456");
  const [role, setRole] = useState<'teacher' | 'student'>(user.role);
  const [pin, setPin] = useState(user.pin || "8888");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatePayload = {
      fullName,
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
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
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

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: "rgba(37, 99, 235, 0.12)",
            color: "var(--brand-primary)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem auto"
          }}>
            <UserCheck size={28} />
          </div>
          <h3 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Chỉnh Sửa Tài Khoản</h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Tên đăng nhập: <strong style={{ color: "var(--brand-primary)" }}>{user.username}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
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

          <div style={{ marginBottom: "1rem" }}>
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

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
              Mật Khẩu Đăng Nhập:
            </label>
            <input
              type="text"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1.5rem" }}>
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
