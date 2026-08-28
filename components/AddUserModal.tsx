"use client";

import { useState } from "react";
import { addUser, generateStandardPassword, generateStandardUsername } from "@/lib/usersData";
import { UserPlus, X, CheckCircle2, Sparkles, Phone, User, KeyRound, Eye, EyeOff } from "lucide-react";

interface AddUserModalProps {
  onClose: () => void;
  onUserAdded: () => void;
}

export default function AddUserModal({ onClose, onUserAdded }: AddUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("Python Nâng Cao K26");
  const [showPassword, setShowPassword] = useState(false);
  const [autoGen, setAutoGen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Khi nhập Họ Tên hoặc SĐT -> Tự động sinh Username (SĐT) & Mật khẩu chuẩn (Tên + SĐT)
  const handleFullNameChange = (name: string) => {
    setFullName(name);
    if (autoGen) {
      const stdPass = generateStandardPassword(name, phone);
      setPassword(stdPass);
      if (phone) setUsername(generateStandardUsername(phone));
    }
  };

  const handlePhoneChange = (p: string) => {
    setPhone(p);
    if (autoGen) {
      const stdUser = generateStandardUsername(p);
      const stdPass = generateStandardPassword(fullName, p);
      setUsername(stdUser);
      setPassword(stdPass);
    }
  };

  const applyStandardCredentials = () => {
    const stdUser = generateStandardUsername(phone);
    const stdPass = generateStandardPassword(fullName, phone);
    setUsername(stdUser);
    setPassword(stdPass);
    setAutoGen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !password.trim()) {
      alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại/Tên đăng nhập và Mật khẩu!");
      return;
    }

    setIsLoading(true);
    const res = addUser({
      username: username.trim(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      class: className.trim(),
      password: password.trim(),
      role: "student"
    });

    if (res.success) {
      // Sync to MongoDB
      try {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            fullName: fullName.trim(),
            phone: phone.trim(),
            class: className.trim(),
            password: password.trim(),
            role: "student"
          })
        });
      } catch (err) {
        console.warn("MongoDB API sync warning, saved to local store.");
      }

      alert(`✅ Cấp tài khoản học viên thành công!\n👤 Tên đăng nhập: ${username}\n🔑 Mật khẩu chuẩn: ${password}`);
      onUserAdded();
      onClose();
    } else {
      alert("❌ " + res.message);
    }
    setIsLoading(false);
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
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.15))",
            color: "var(--brand-primary)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 0.8rem auto"
          }}>
            <UserPlus size={28} />
          </div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Cấp Tài Khoản Học Viên Mới</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Tự động khởi tạo Tên đăng nhập (SĐT) & Mật khẩu chuẩn (Tên + SĐT)
          </p>
        </div>

        {/* Standard Info Banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(6, 182, 212, 0.08))",
          border: "1px solid rgba(37, 99, 235, 0.2)",
          borderRadius: "var(--radius-sm)",
          padding: "0.75rem 1rem",
          marginBottom: "1.2rem",
          fontSize: "0.82rem",
          lineHeight: "1.5",
          color: "var(--text-secondary)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, color: "var(--brand-primary)", marginBottom: "0.25rem" }}>
            <Sparkles size={14} />
            <span>Quy Chuẩn Cấp Tài Khoản Sao Việt:</span>
          </div>
          <div>• <strong>Tên đăng nhập:</strong> Số điện thoại học viên (VD: <code>0912345671</code>)</div>
          <div>• <strong>Mật khẩu chuẩn:</strong> Tên không dấu + SĐT (VD: <code>Nam0912345671</code>)</div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Họ và tên */}
          <div style={{ marginBottom: "0.9rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
              Họ Và Tên Học Viên: <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => handleFullNameChange(e.target.value)}
              placeholder="Ví dụ: Nguyễn Bảo Nam"
              required
              autoFocus
            />
          </div>

          {/* Số điện thoại */}
          <div style={{ marginBottom: "0.9rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
              Số Điện Thoại Học Viên (SĐT): <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="tel"
              className="form-input"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="Ví dụ: 0912345671"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "0.9rem" }}>
            {/* Username */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                Tên Đăng Nhập (Username):
              </label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setAutoGen(false);
                }}
                placeholder="0912345671"
                required
              />
            </div>

            {/* Lớp học */}
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

          {/* Password with Eye Toggle */}
          <div style={{ marginBottom: "1.3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                Mật Khẩu Chuẩn (Tên + SĐT):
              </label>
              <button
                type="button"
                onClick={applyStandardCredentials}
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
                <span>Sinh lại chuẩn</span>
              </button>
            </div>

            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAutoGen(false);
                }}
                placeholder="VD: Nam0912345671"
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

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={isLoading}>
            <CheckCircle2 size={18} />
            <span>{isLoading ? "Đang tạo tài khoản..." : "Xác Nhận & Cấp Tài Khoản"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
