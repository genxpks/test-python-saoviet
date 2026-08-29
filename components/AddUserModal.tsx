"use client";

import { useState } from "react";
import { generateDefaultStudentPassword, DEFAULT_BRANCHES, DEFAULT_SUBJECTS, getUsers, saveUsers, addUser } from "@/lib/usersData";
import { User, UserRole } from "@/types";
import { UserPlus, X, CheckCircle2, Sparkles, Eye, EyeOff, Building2, GraduationCap, ShieldCheck, KeyRound, Check } from "lucide-react";

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
  // Target account type: "student" or "branch_manager"
  const [accountType, setAccountType] = useState<"student" | "branch_manager">("student");
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("Python Nâng Cao K26");
  const [branchId, setBranchId] = useState(defaultBranchId);
  const [pin, setPin] = useState("8888");
  const [showPassword, setShowPassword] = useState(false);
  const [enrolledSubjects, setEnrolledSubjects] = useState<string[]>(["python", "web_basic"]);
  const [isLoading, setIsLoading] = useState(false);

  const branches = DEFAULT_BRANCHES;

  const handleAccountTypeSwitch = (type: "student" | "branch_manager") => {
    if (isBranchLocked && type === "branch_manager") return;
    setAccountType(type);
    if (type === "branch_manager") {
      if (!password) setPassword("saoviet2026");
      if (phone) setUsername(phone.replace(/\D/g, ""));
    } else {
      if (fullName && phone) {
        setPassword(generateDefaultStudentPassword(fullName, phone));
      }
    }
  };

  const handleFullNameChange = (name: string) => {
    setFullName(name);
    if (phone) {
      if (accountType === "student") {
        const stdPass = generateDefaultStudentPassword(name, phone);
        setPassword(stdPass);
      }
      setUsername(phone.replace(/\D/g, ""));
    }
  };

  const handlePhoneChange = (p: string) => {
    setPhone(p);
    const clean = p.replace(/\D/g, "");
    setUsername(clean);
    if (fullName) {
      if (accountType === "student") {
        const stdPass = generateDefaultStudentPassword(fullName, p);
        setPassword(stdPass);
      }
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
    const finalFullName = fullName.trim();
    const finalPhone = phone.trim();
    const cleanPhone = finalPhone.replace(/\D/g, "");
    const finalUsername = (username.trim() || cleanPhone || finalPhone).trim();
    const finalPassword = (password.trim() || generateDefaultStudentPassword(finalFullName, finalPhone) || "123456").trim();

    if (!finalFullName || !finalUsername) {
      alert("Vui lòng điền đầy đủ Họ tên và Số điện thoại!");
      return;
    }

    setIsLoading(true);
    const selectedBranch = branches.find(b => b.id === branchId);

    const newUser: User = {
      id: accountType === "branch_manager" ? `mgr_${Date.now()}` : `hv_${Date.now()}`,
      username: finalUsername,
      fullName: finalFullName,
      phone: finalPhone,
      class: accountType === "student" ? className.trim() : undefined,
      password: finalPassword,
      role: accountType === "branch_manager" ? "branch_manager" : "student",
      branchId: branchId,
      branchName: selectedBranch?.name || "Chi Nhánh TP. Thủ Đức",
      pin: accountType === "branch_manager" ? pin.trim() : undefined,
      status: "active",
      enrolledSubjects: accountType === "student" ? enrolledSubjects : ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
      totalStudySeconds: 0,
      createdDate: new Date().toISOString().split("T")[0]
    };

    // 1. Save locally immediately
    addUser(newUser);

    // 2. Sync to MongoDB Atlas API
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (!data.success) {
        console.warn("Server user create warning:", data.message);
      }
    } catch (err: any) {
      console.error("User create network error:", err);
    }

    setIsLoading(false);
    if (accountType === "branch_manager") {
      alert(`✅ Cấp quyền QUẢN LÝ CHI NHÁNH thành công!\n🏢 Phụ trách: ${newUser.branchName}\n👤 Tên đăng nhập (SĐT): ${finalUsername}\n🔑 Mật khẩu: ${finalPassword}\n🔢 Mã PIN Quản lý: ${pin}`);
    } else {
      alert(`✅ Cấp tài khoản HỌC VIÊN thành công!\n🏫 Chi nhánh: ${newUser.branchName}\n👤 Tên đăng nhập (SĐT): ${finalUsername}\n🔑 Mật khẩu: ${finalPassword}\n📚 Môn được cấp: ${enrolledSubjects.join(", ")}`);
    }

    onUserAdded();
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
        maxWidth: "600px",
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
            color: "#64748b",
            transition: "all 0.15s"
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
            background: accountType === "branch_manager" ? "#f3e8ff" : "#eff6ff",
            color: accountType === "branch_manager" ? "#9333ea" : "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {accountType === "branch_manager" ? <Building2 size={24} /> : <GraduationCap size={24} />}
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              {accountType === "branch_manager" ? "Cấp Quyền Quản Lý Chi Nhánh" : "Tạo Mới Tài Khoản Học Viên"}
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0.2rem 0 0" }}>
              {accountType === "branch_manager" 
                ? "Gán quyền điều hành chi nhánh, quản lý học viên và ngân hàng đề thi."
                : "Phân cấp học viên theo cơ sở đào tạo, cấp mật khẩu tự động & phân quyền môn."}
            </p>
          </div>
        </div>

        {/* Account Type Selector (Hierarchy Clarification) */}
        {!isBranchLocked ? (
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: "0.45rem", letterSpacing: "0.03em" }}>
              1. BẠN MUỐN TẠO TÀI KHOẢN CHO AI?
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
              <button
                type="button"
                onClick={() => handleAccountTypeSwitch("student")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.75rem 0.9rem",
                  borderRadius: "12px",
                  border: "2px solid",
                  borderColor: accountType === "student" ? "#2563eb" : "#e2e8f0",
                  background: accountType === "student" ? "#eff6ff" : "#ffffff",
                  color: accountType === "student" ? "#1d4ed8" : "#475569",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s"
                }}
              >
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: accountType === "student" ? "#2563eb" : "#f1f5f9",
                  color: accountType === "student" ? "#ffffff" : "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <GraduationCap size={16} />
                </div>
                <div>
                  <div>🎓 Học Viên (Student)</div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 500, color: "#64748b" }}>Học & thi trắc nghiệm</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleAccountTypeSwitch("branch_manager")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.75rem 0.9rem",
                  borderRadius: "12px",
                  border: "2px solid",
                  borderColor: accountType === "branch_manager" ? "#9333ea" : "#e2e8f0",
                  background: accountType === "branch_manager" ? "#faf5ff" : "#ffffff",
                  color: accountType === "branch_manager" ? "#7e22ce" : "#475569",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s"
                }}
              >
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: accountType === "branch_manager" ? "#9333ea" : "#f1f5f9",
                  color: accountType === "branch_manager" ? "#ffffff" : "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Building2 size={16} />
                </div>
                <div>
                  <div>🏢 Quản Lý Chi Nhánh</div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 500, color: "#64748b" }}>Quản trị cơ sở & đề thi</div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            padding: "0.75rem 1rem",
            borderRadius: "12px",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "0.82rem",
            color: "#1e40af"
          }}>
            <ShieldCheck size={18} />
            <div>
              <strong>Phân cấp Quản lý Chi nhánh:</strong> Bạn đang tạo tài khoản cho <strong>Học viên</strong> thuộc chi nhánh của mình.
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Họ và Tên {accountType === "branch_manager" ? "Quản Lý" : "Học Viên"}: *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => handleFullNameChange(e.target.value)}
                placeholder={accountType === "branch_manager" ? "VD: Thầy Nguyễn Duy Thiên" : "VD: Nguyễn Duy Thiên"}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontSize: "0.88rem"
                }}
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Số Điện Thoại (SĐT): *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="VD: 0937482673"
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
                Tên Đăng Nhập (Tự động = SĐT):
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#1e293b",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.88rem"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Mật Khẩu Đăng Nhập: *
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
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
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Chi Nhánh Trực Thuộc: *
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: isBranchLocked ? "#f8fafc" : "#ffffff",
                  color: "#0f172a",
                  fontWeight: 600,
                  fontSize: "0.85rem"
                }}
                value={branchId}
                disabled={isBranchLocked}
                onChange={(e) => setBranchId(e.target.value)}
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>🏢 {b.name}</option>
                ))}
              </select>
            </div>

            {accountType === "student" ? (
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                  Lớp Học / Khóa Đào Tạo:
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="VD: Python Nâng Cao K26"
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
                  Mã PIN Giáo Viên / Quản Lý:
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
          </div>

          {/* Subject RBAC Authorization for Students */}
          {accountType === "student" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2563eb" }}>
                  Phân Quyền Các Môn Học Được Phép (Chỉ được học/thi môn được tích):
                </label>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Đã chọn: <strong>{enrolledSubjects.length} môn</strong></span>
              </div>
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
                        color: isChecked ? "#1d4ed8" : "#334155",
                        transition: "all 0.1s"
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

          {/* Action Buttons */}
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
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "0.65rem 1.35rem",
                borderRadius: "10px",
                border: "none",
                background: accountType === "branch_manager" 
                  ? "linear-gradient(135deg, #9333ea, #7e22ce)" 
                  : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: accountType === "branch_manager"
                  ? "0 4px 12px rgba(147, 51, 234, 0.25)"
                  : "0 4px 12px rgba(37, 99, 235, 0.25)"
              }}
            >
              <UserPlus size={16} />
              <span>{isLoading ? "Đang xử lý..." : accountType === "branch_manager" ? "Cấp Quyền Quản Lý" : "Tạo & Cấp Quyền Học Viên"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
