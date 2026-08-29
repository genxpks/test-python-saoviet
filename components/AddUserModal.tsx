"use client";

import { useState } from "react";
import { generateDefaultStudentPassword, DEFAULT_BRANCHES, DEFAULT_SUBJECTS, getUsers, saveUsers } from "@/lib/usersData";
import { User, UserRole } from "@/types";
import { UserPlus, X, CheckCircle2, Sparkles, Eye, EyeOff, Building2, Code2 } from "lucide-react";

interface AddUserModalProps {
  onClose: () => void;
  onUserAdded: () => void;
  defaultBranchId?: string;
  isBranchLocked?: boolean;
}

export default function AddUserModal({ 
  onClose, 
  onUserAdded,
  defaultBranchId = "branch_thuduc",
  isBranchLocked = false
}: AddUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("Python Nâng Cao K26");
  const [role, setRole] = useState<UserRole>("student");
  const [branchId, setBranchId] = useState(defaultBranchId);
  const [pin, setPin] = useState("8888");
  const [showPassword, setShowPassword] = useState(false);
  const [enrolledSubjects, setEnrolledSubjects] = useState<string[]>(["python", "web_basic"]);
  const [isLoading, setIsLoading] = useState(false);

  const branches = DEFAULT_BRANCHES;

  const handleFullNameChange = (name: string) => {
    setFullName(name);
    if (phone) {
      const stdPass = generateDefaultStudentPassword(name, phone);
      setPassword(stdPass);
      setUsername(phone.replace(/\D/g, ""));
    }
  };

  const handlePhoneChange = (p: string) => {
    setPhone(p);
    const clean = p.replace(/\D/g, "");
    setUsername(clean);
    if (fullName) {
      const stdPass = generateDefaultStudentPassword(fullName, p);
      setPassword(stdPass);
    }
  };

  const toggleSubject = (subId: string) => {
    if (enrolledSubjects.includes(subId)) {
      setEnrolledSubjects(enrolledSubjects.filter(s => s !== subId));
    } else {
      setEnrolledSubjects([...enrolledSubjects, subId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !password.trim()) {
      alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Mật khẩu!");
      return;
    }

    setIsLoading(true);
    const selectedBranch = branches.find(b => b.id === branchId);

    const newUser: User = {
      id: `u_${Date.now()}`,
      username: username.trim(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      class: className.trim(),
      password: password.trim(),
      role: role,
      branchId: branchId,
      branchName: selectedBranch?.name || "Chi Nhánh Thủ Đức",
      pin: role !== "student" ? pin.trim() : undefined,
      status: "active",
      enrolledSubjects: role === "student" ? enrolledSubjects : ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
      totalStudySeconds: 0,
      createdDate: new Date().toISOString().split("T")[0]
    };

    const users = getUsers();
    users.unshift(newUser);
    saveUsers(users);

    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
    } catch {}

    alert(`✅ Cấp tài khoản thành công!\n👤 Tên đăng nhập (SĐT): ${username}\n🔑 Mật khẩu: ${password}\n📚 Môn được cấp: ${enrolledSubjects.join(", ")}`);
    onUserAdded();
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

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.2rem" }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "rgba(37, 99, 235, 0.1)",
            color: "var(--brand-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <UserPlus size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Tạo Mới Tài Khoản Học Viên</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Hệ thống tự động sinh tài khoản theo SĐT & mật khẩu Tên+SĐT
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Họ và Tên:
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => handleFullNameChange(e.target.value)}
                placeholder="VD: Nguyễn Duy Thiên"
                className="input"
                style={{ width: "100%" }}
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Số Điện Thoại (SĐT):
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="VD: 0937482673"
                className="input"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Tên Đăng Nhập (Tự Động):
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                style={{ width: "100%", background: "#f8fafc", fontFamily: "var(--font-mono)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Mật Khẩu (Tên + SĐT):
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
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
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Chi Nhánh Quản Lý:
              </label>
              <select
                className="input"
                style={{ width: "100%" }}
                value={branchId}
                disabled={isBranchLocked}
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
                placeholder="VD: Python Nâng Cao K26"
                className="input"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Subject RBAC Authorization checkboxes */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--brand-primary)" }}>
              Phân Quyền Các Môn Học Được Phép (Chỉ được học/thi môn được tích chọn):
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
              <UserPlus size={16} />
              <span>{isLoading ? "Đang tạo..." : "Tạo & Cấp Quyền Học Viên"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
