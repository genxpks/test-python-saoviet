"use client";

import { useState } from "react";
import { User, UserRole } from "@/types";
import { DEFAULT_BRANCHES, DEFAULT_SUBJECTS, getUsers, saveUsers, updateUser } from "@/lib/usersData";
import { UserCheck, X, Eye, EyeOff, ShieldCheck, Building2, GraduationCap } from "lucide-react";

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

    updateUser(user.id, {
      fullName: fullName.trim(),
      phone: phone.trim(),
      class: role === "student" ? className.trim() : undefined,
      password: password.trim(),
      role: role,
      branchId: branchId,
      branchName: selectedBranch?.name || "Chi Nhánh Thủ Đức",
      pin: role !== "student" ? pin.trim() : undefined,
      status: status,
      enrolledSubjects: role === "student" ? enrolledSubjects : ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"]
    });

    try {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          fullName: fullName.trim(),
          phone: phone.trim(),
          className: role === "student" ? className.trim() : undefined,
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
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        position: "relative"
      }}>
        {/* Close Button */}
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

        {/* Modal Header */}
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
            <UserCheck size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Chỉnh Sửa Tài Khoản
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0.2rem 0 0" }}>
              Tên đăng nhập: <strong style={{ color: "#2563eb", fontFamily: "var(--font-mono)" }}>{user.username}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Họ và Tên: *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                Số Điện Thoại:
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Vai Trò Tài Khoản:
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 600,
                  fontSize: "0.85rem"
                }}
                value={role}
                disabled={user.username === "admin"}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="student">🎓 Học Viên (Student)</option>
                <option value="branch_manager">🏢 Quản Lý Chi Nhánh (Manager)</option>
                <option value="admin">👑 Super Admin</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Trạng Thái Hoạt Động:
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: status === "active" ? "#15803d" : "#b91c1c",
                  fontWeight: 700,
                  fontSize: "0.85rem"
                }}
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "locked")}
              >
                <option value="active">🟢 Đang Hoạt Động</option>
                <option value="locked">🔴 Tạm Khóa Tài Khoản</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Mật Khẩu Đăng Nhập:
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 2.4rem 0.65rem 0.85rem",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontWeight: 600,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.88rem"
                  }}
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
                    color: "#94a3b8"
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Chi Nhánh Quản Lý:
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 600,
                  fontSize: "0.85rem"
                }}
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>🏢 {b.name}</option>
                ))}
              </select>
            </div>
          </div>

          {role === "student" ? (
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Lớp Học / Khóa Học:
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
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
          ) : (
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Mã PIN Quản Trị / Giáo Viên:
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
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
          )}

          {/* Subject Permissions for Student */}
          {role === "student" && (
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#2563eb", marginBottom: "0.4rem" }}>
                Phân Quyền Các Môn Học Được Phép (Chỉ được học/thi môn được tích):
              </label>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.45rem",
                background: "#f8fafc",
                padding: "0.85rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                {DEFAULT_SUBJECTS.map(subj => {
                  const isChecked = enrolledSubjects.includes(subj.id);
                  return (
                    <label
                      key={subj.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        padding: "0.35rem 0.5rem",
                        borderRadius: "8px",
                        background: isChecked ? "#eff6ff" : "transparent",
                        border: isChecked ? "1px solid #bfdbfe" : "1px solid transparent",
                        color: isChecked ? "#1d4ed8" : "#334155"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSubject(subj.id)}
                        style={{ accentColor: "#2563eb" }}
                      />
                      <span style={{ fontWeight: isChecked ? 700 : 500 }}>{subj.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

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
              disabled={isLoading}
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
              {isLoading ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
