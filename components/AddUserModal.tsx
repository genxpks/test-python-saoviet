"use client";

import { useState } from "react";
import { addUser, generateStandardPassword, generateStandardUsername, getBranches } from "@/lib/usersData";
import { UserRole } from "@/types";
import { UserPlus, X, CheckCircle2, Sparkles, Eye, EyeOff, Building2 } from "lucide-react";

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
  const [role, setRole] = useState<UserRole>("student");
  const [branchId, setBranchId] = useState("branch_thuduc");
  const [pin, setPin] = useState("8888");
  const [showPassword, setShowPassword] = useState(false);
  const [autoGen, setAutoGen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const branches = getBranches();

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
    const selectedBranch = branches.find(b => b.id === branchId);

    const res = addUser({
      username: username.trim(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      class: className.trim(),
      password: password.trim(),
      role: role,
      branchId: branchId,
      branchName: selectedBranch?.name || "Chi Nhánh Thủ Đức",
      pin: role !== "student" ? pin.trim() : undefined
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
            className: className.trim(),
            password: password.trim(),
            role: role,
            branchId: branchId,
            branchName: selectedBranch?.name || "Chi Nhánh Thủ Đức",
            pin: role !== "student" ? pin.trim() : undefined
          })
        });
      } catch (err) {
        console.warn("MongoDB API sync warning, saved to local store.");
      }

      alert(`✅ Cấp tài khoản thành công!\n👤 Tên đăng nhập: ${username}\n🔑 Mật khẩu: ${password}`);
      onUserAdded();
      onClose();
    } else {
      alert("❌ " + res.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: "540px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.8rem", marginBottom: "1.2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ padding: "0.4rem", background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.15))", color: "var(--brand-primary)", borderRadius: "var(--radius-md)" }}>
              <UserPlus size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>Cấp Tài Khoản Mới</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                Hỗ trợ 3 Roles: Học viên, Quản lý chi nhánh, Admin
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: "0.3rem" }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Vai Trò (Role): *
              </label>
              <select
                className="input"
                style={{ width: "100%", fontWeight: 600 }}
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="student">🎓 Học Viên</option>
                <option value="branch_manager">🏫 Quản Lý Chi Nhánh</option>
                <option value="admin">👑 Tổng Quản Trị (Admin)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Thuộc Chi Nhánh: *
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

          <div>
            <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              Họ Và Tên: <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              className="input"
              style={{ width: "100%" }}
              value={fullName}
              onChange={(e) => handleFullNameChange(e.target.value)}
              placeholder="Ví dụ: Nguyễn Bảo Nam"
              required
              autoFocus
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Số Điện Thoại (SĐT): <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="tel"
                className="input"
                style={{ width: "100%" }}
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="Ví dụ: 0912345671"
                required
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
                Tên Đăng Nhập:
              </label>
              <input
                type="text"
                className="input"
                style={{ width: "100%" }}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setAutoGen(false);
                }}
                placeholder="0912345671"
                required
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                <label style={{ fontSize: "0.84rem", fontWeight: 700 }}>
                  Mật Khẩu:
                </label>
                <button
                  type="button"
                  onClick={applyStandardCredentials}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--brand-primary)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px"
                  }}
                >
                  <Sparkles size={11} />
                  <span>Sinh chuẩn</span>
                </button>
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input"
                  style={{ width: "100%", paddingRight: "35px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "8px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    padding: "2px"
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          {role !== "student" && (
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Mã PIN Quản Lý / Giáo Viên (mở khóa đề):
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
              <span>{isLoading ? "Đang tạo..." : "Tạo Tài Khoản"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
