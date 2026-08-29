"use client";

import { useState } from "react";
import { User, UserRole } from "@/types";
import { DEFAULT_BRANCHES, DEFAULT_SUBJECTS, getUsers, saveUsers } from "@/lib/usersData";
import { UserCheck, X, Eye, EyeOff } from "lucide-react";

interface UserEditModalProps {
  user: User;
  onClose: () => void;
  onUserUpdated: () => void;
}

export default function UserEditModal({ user, onClose, onUserUpdated }: UserEditModalProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone || "");
  const [className, setClassName] = useState(user.class || "Python Nâng Cao");
  const [password, setPassword] = useState(user.password || "");
  const [role, setRole] = useState<UserRole>(user.role || "student");
  const [branchId, setBranchId] = useState(user.branchId || "branch_thuduc");
  const [pin, setPin] = useState(user.pin || "8888");
  const [status, setStatus] = useState<"active" | "locked">(user.status || "active");
  const [enrolledSubjects, setEnrolledSubjects] = useState<string[]>(user.enrolledSubjects || ["python"]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const branches = DEFAULT_BRANCHES;

  const toggleSubject = (subId: string) => {
    if (enrolledSubjects.includes(subId)) {
      setEnrolledSubjects(enrolledSubjects.filter(s => s !== subId));
    } else {
      setEnrolledSubjects([...enrolledSubjects, subId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedBranch = branches.find(b => b.id === branchId);

    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = {
        ...users[idx],
        fullName: fullName.trim(),
        phone: phone.trim(),
        class: className.trim(),
        password: password.trim(),
        role: role,
        branchId: branchId,
        branchName: selectedBranch?.name || "Chi Nhánh Thủ Đức",
        pin: role !== "student" ? pin.trim() : undefined,
        status: status,
        enrolledSubjects: role === "student" ? enrolledSubjects : ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"]
      };
      saveUsers(users);
    }

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
          pin: role !== "student" ? pin.trim() : undefined,
          status: status,
          enrolledSubjects: enrolledSubjects
        })
      });
    } catch {}

    setIsLoading(false);
    alert("✅ Cập nhật thông tin tài khoản thành công!");
    onUserUpdated();
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.65)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div className="q-card" style={{ maxWidth: "560px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "2rem", position: "relative" }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)"
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.8rem", marginBottom: "1.2rem" }}>
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Họ và Tên:
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Số Điện Thoại:
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Mật Khẩu Đăng Nhập:
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  style={{ width: "100%", paddingRight: "38px", fontFamily: "var(--font-mono)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "8px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Trạng Thái Hoạt Động:
              </label>
              <select
                className="input"
                style={{ width: "100%" }}
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "locked")}
              >
                <option value="active">Hoạt Động Bình Thường</option>
                <option value="locked">Tạm Khóa Tài Khoản</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Chi Nhánh Trực Thuộc:
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

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Lớp Học / Khóa Học:
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="input"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--brand-primary)" }}>
              Phân Quyền Các Môn Học Được Phép:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", background: "var(--surface-subtle)", padding: "0.8rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)" }}>
              {DEFAULT_SUBJECTS.map(subj => {
                const isChecked = enrolledSubjects.includes(subj.id);
                return (
                  <label key={subj.id} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSubject(subj.id)}
                    />
                    <span style={{ fontWeight: isChecked ? 700 : 500 }}>{subj.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.6rem" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-md">
              Hủy
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-primary btn-md">
              <span>{isLoading ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
