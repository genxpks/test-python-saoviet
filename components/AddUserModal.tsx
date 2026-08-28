"use client";

import { useState } from "react";
import { addUser } from "@/lib/usersData";

interface AddUserModalProps {
  onClose: () => void;
  onUserAdded: () => void;
}

export default function AddUserModal({ onClose, onUserAdded }: AddUserModalProps) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("Python Nâng Cao K26");
  const [password, setPassword] = useState("123456");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addUser({
      username,
      fullName,
      class: className,
      password
    });
    if (res.success) {
      alert("✅ Cấp tài khoản mới thành công!");
      onUserAdded();
      onClose();
    } else {
      alert("❌ " + res.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button
          style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "var(--text-muted)" }}
          onClick={onClose}
        >
          &times;
        </button>

        <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.4rem" }}>👤</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Cấp Tài Khoản Học Viên Mới</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "0.8rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
              Tên đăng nhập:
            </label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ví dụ: hocvien06"
              required
            />
          </div>

          <div style={{ marginBottom: "0.8rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
              Họ và tên học viên:
            </label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ví dụ: Hoàng Minh Nhật"
              required
            />
          </div>

          <div style={{ marginBottom: "0.8rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
              Lớp học:
            </label>
            <input
              type="text"
              className="form-input"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
              Mật khẩu khởi tạo:
            </label>
            <input
              type="text"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            + Lưu & Cấp Tài Khoản
          </button>
        </form>
      </div>
    </div>
  );
}
