"use client";

import { useState, useEffect, useMemo } from "react";
import { User, Question, PracticalProblem, PausedExamState, ExamResult, Branch, Subject } from "@/types";
import { 
  getUsers, 
  deleteUser, 
  getCurrentUser, 
  loginUser,
  loginUserAsync,
  DEFAULT_BRANCHES,
  DEFAULT_SUBJECTS,
  logoutUser,
  formatStudyDuration,
  saveUsers
} from "@/lib/usersData";
import { 
  getQuestionsData, 
  deleteQuestionData, 
  getPracticalsData, 
  deletePracticalData 
} from "@/lib/questionsData";

import AddUserModal from "@/components/AddUserModal";
import UserEditModal from "@/components/admin/UserEditModal";
import QuestionFormModal from "@/components/admin/QuestionFormModal";
import PracticalFormModal from "@/components/admin/PracticalFormModal";
import ExcelQuestionImporter from "@/components/admin/ExcelQuestionImporter";
import BranchModal from "@/components/admin/BranchModal";
import SubjectModal from "@/components/admin/SubjectModal";

import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  BookOpen, 
  Terminal, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Lock, 
  Download, 
  Sparkles,
  GraduationCap,
  FileSpreadsheet,
  Building2,
  Code2,
  Eye,
  EyeOff,
  LogOut,
  Layers,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  AlertCircle,
  Crown,
  Phone,
  KeyRound,
  Award,
  Filter,
  X,
  ChevronRight,
  Info
} from "lucide-react";

// Helper lấy chữ cái đầu cho Avatar người dùng
function getInitials(name: string): string {
  if (!name) return "SV";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Helper sinh màu gradient phong thủy hài hòa cho từng người dùng
function getAvatarGradient(name: string): string {
  const gradients = [
    "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    "linear-gradient(135deg, #047857, #10b981)",
    "linear-gradient(135deg, #6d28d9, #8b5cf6)",
    "linear-gradient(135deg, #b45309, #f59e0b)",
    "linear-gradient(135deg, #0e7490, #06b6d4)",
    "linear-gradient(135deg, #4338ca, #6366f1)"
  ];
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

type AdminTab = "questions" | "practicals" | "users" | "subjects" | "branches" | "results";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("questions");

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [visiblePasswordIds, setVisiblePasswordIds] = useState<string[]>([]);
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswordIds((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [practicals, setPracticals] = useState<PracticalProblem[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  const [adminBranchMode, setAdminBranchMode] = useState<string>("all");
  const [selectedSubjectId, setSelectedSubjectId] = useState("all");

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [questionSearch, setQuestionSearch] = useState("");
  const [questionTypeFilter, setQuestionTypeFilter] = useState("all");

  // Modals state
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelTargetSubject, setExcelTargetSubject] = useState("python");

  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [showPracticalModal, setShowPracticalModal] = useState(false);
  const [editingPractical, setEditingPractical] = useState<PracticalProblem | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    // Mặc định cho phép xem tất cả chi nhánh hoặc lọc theo nhu cầu
    setAdminBranchMode("all");
    loadAllData();

    // Kích hoạt admin full-width: xóa giới hạn max-width của app-container
    const appContainer = document.querySelector(".app-container");
    if (appContainer) {
      appContainer.classList.add("admin-active");
    }
    return () => {
      // Cleanup: gỡ bỏ khi rời trang admin
      const el = document.querySelector(".app-container");
      if (el) el.classList.remove("admin-active");
    };
  }, []);

  const loadAllData = async () => {
    const initialUsers = getUsers();
    setBranches(DEFAULT_BRANCHES);
    setSubjects(DEFAULT_SUBJECTS);
    setUsers(initialUsers);
    setQuestions(getQuestionsData());
    setPracticals(getPracticalsData());

    try {
      const [resB, resS, resQ, resU, resE] = await Promise.all([
        fetch("/api/branches").then(r => r.json()).catch(() => null),
        fetch("/api/subjects").then(r => r.json()).catch(() => null),
        fetch("/api/questions").then(r => r.json()).catch(() => null),
        fetch("/api/users").then(r => r.json()).catch(() => null),
        fetch("/api/exams").then(r => r.json()).catch(() => null)
      ]);

      if (resB?.success && resB.branches?.length > 0) setBranches(resB.branches);
      if (resS?.success && resS.subjects?.length > 0) setSubjects(resS.subjects);
      if (resQ?.success && resQ.questions?.length > 0) setQuestions(resQ.questions);
      if (resU?.success && Array.isArray(resU.users) && resU.users.length > 0 && !resU.isFallback) {
        const currentLocals = getUsers();
        const userMap = new Map<string, User>();
        resU.users.forEach((u: User) => {
          if (u.username) userMap.set(u.username.toLowerCase(), u);
        });
        currentLocals.forEach((u: User) => {
          if (u.username && !userMap.has(u.username.toLowerCase())) {
            userMap.set(u.username.toLowerCase(), u);
          }
        });
        const merged = Array.from(userMap.values());
        setUsers(merged);
        saveUsers(merged);
      } else {
        setUsers(getUsers());
      }
      if (resE?.success && resE.results?.length > 0) setExamResults(resE.results);
    } catch {
      setUsers(getUsers());
    }
  };

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginUserAsync(loginUsername, loginPassword);
    if (res.success && res.user && (res.user.role === "admin" || res.user.role === "branch_manager" || res.user.role === "teacher")) {
      setCurrentUser(res.user);
      if (res.user.role === "branch_manager" && res.user.branchId) {
        setAdminBranchMode(res.user.branchId);
      }
      setLoginError("");
      loadAllData();
    } else {
      setLoginError("Tài khoản hoặc mật khẩu không chính xác hoặc không có quyền quản lý!");
    }
  };

  const handleExportQuestionsExcel = async () => {
    try {
      const res = await fetch("/api/questions/export-excel");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Ngan_Hang_Cau_Hoi_SaoViet_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e: any) {
      alert("Lỗi tải Excel: " + e.message);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (confirm(`Bạn có chắc chắn muốn xóa câu hỏi #${id}?`)) {
      deleteQuestionData(id);
      try {
        await fetch(`/api/questions?id=${id}&target=question`, { method: "DELETE" });
      } catch {}
      loadAllData();
    }
  };

  const handleDeletePractical = async (id: number) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài thực hành #${id}?`)) {
      deletePracticalData(id);
      try {
        await fetch(`/api/questions?id=${id}&target=practical`, { method: "DELETE" });
      } catch {}
      loadAllData();
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      deleteUser(id);
      try {
        await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      } catch {}
      loadAllData();
    }
  };

  const handleSaveBranch = async (branchData: Partial<Branch>) => {
    try {
      if (editingBranch) {
        await fetch("/api/branches", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingBranch.id, ...branchData })
        });
      } else {
        await fetch("/api/branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(branchData)
        });
      }
      setShowBranchModal(false);
      setEditingBranch(null);
      loadAllData();
    } catch (err: any) {
      alert("Lỗi lưu chi nhánh: " + err.message);
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) {
      try {
        await fetch(`/api/branches?id=${branchId}`, { method: "DELETE" });
        loadAllData();
      } catch (err: any) {
        alert("Lỗi xóa chi nhánh: " + err.message);
      }
    }
  };

  const handleSaveSubject = async (subjectData: Partial<Subject>, initOption?: string) => {
    try {
      if (editingSubject) {
        await fetch("/api/subjects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingSubject.id, ...subjectData })
        });
      } else {
        await fetch("/api/subjects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subjectData)
        });
      }
      setShowSubjectModal(false);
      setEditingSubject(null);
      loadAllData();
      alert(`✅ Môn học ${subjectData.name} đã được lưu thành công!`);
    } catch (err: any) {
      alert("Lỗi lưu môn học: " + err.message);
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa môn học này khỏi chương trình?")) {
      try {
        await fetch(`/api/subjects?id=${subjectId}`, { method: "DELETE" });
        loadAllData();
      } catch (err: any) {
        alert("Lỗi xóa môn học: " + err.message);
      }
    }
  };

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchType = questionTypeFilter === "all" || q.type === questionTypeFilter;
      const matchSubject = selectedSubjectId === "all" || q.subjectId === selectedSubjectId || (!q.subjectId && selectedSubjectId === "python");
      const matchSearch =
        questionSearch === "" ||
        q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
        q.explanation.toLowerCase().includes(questionSearch.toLowerCase()) ||
        String(q.id).includes(questionSearch);
      return matchType && matchSubject && matchSearch;
    });
  }, [questions, questionTypeFilter, selectedSubjectId, questionSearch]);

  // Quick helper: đếm số người dùng theo từng chi nhánh
  const getBranchUserCount = (branchId: string) => {
    if (branchId === "all") return users.length;
    return users.filter(u => u.branchId === branchId).length;
  };

  // Filtered Users: Xem được tất cả chi nhánh hoặc bất kỳ chi nhánh nào
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
      const matchBranch = adminBranchMode === "all" || u.branchId === adminBranchMode;
      const matchSearch =
        userSearch === "" ||
        u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.phone && u.phone.includes(userSearch)) ||
        (u.class && u.class.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.branchName && u.branchName.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.branchId && u.branchId.toLowerCase().includes(userSearch.toLowerCase()));
      return matchRole && matchBranch && matchSearch;
    });
  }, [users, userRoleFilter, adminBranchMode, userSearch]);

  // Quick stats by subject
  const getSubjectQuestionCount = (subId: string) => {
    return questions.filter(q => q.subjectId === subId || (!q.subjectId && subId === "python")).length;
  };

  const getSubjectPracticalCount = (subId: string) => {
    return practicals.filter(p => p.subjectId === subId || (!p.subjectId && subId === "python")).length;
  };

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "branch_manager" && currentUser.role !== "teacher")) {
    return (
      <div style={{ maxWidth: "480px", margin: "4rem auto", padding: "0 1rem" }}>
        <div style={{
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          padding: "2.5rem 2rem",
          textAlign: "center"
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "16px",
            background: "#fee2e2",
            color: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.2rem"
          }}>
            <ShieldCheck size={32} />
          </div>

          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.4rem" }}>
            Khu Vực Quản Trị Hệ Thống
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.86rem", marginBottom: "1.5rem" }}>
            Vui lòng đăng nhập tài khoản Tổng Quản Trị (Admin) hoặc Quản Lý Chi Nhánh.
          </p>

          <form onSubmit={handleInlineLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
            {loginError && (
              <div style={{ color: "#b91c1c", fontSize: "0.82rem", background: "#fef2f2", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #fecaca" }}>
                {loginError}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Tên Đăng Nhập:
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin hoặc quanly_thuduc"
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
                Mật Khẩu:
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
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

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "0.5rem"
              }}
            >
              <Lock size={16} />
              <span>Đăng Nhập Quản Trị</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-full-page" style={{ background: "#f8fafc", minHeight: "100vh", padding: "1rem 1.25rem", color: "#0f172a", width: "100%", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "100%", margin: 0, display: "grid", gridTemplateColumns: "280px minmax(0, 1fr)", gap: "1.25rem", alignItems: "start" }}>
        
        {/* ========================================================================= */}
        {/* 1. LEFT SIDEBAR (Clean Corporate Light Mode) */}
        {/* ========================================================================= */}
        <aside style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "1.5rem 1.1rem",
          position: "sticky",
          top: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)"
        }}>
          {/* Brand Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingBottom: "1.2rem", borderBottom: "1px solid #e2e8f0" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#0f172a", fontFamily: "var(--font-heading)" }}>
                Admin Portal
              </div>
              <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 800, letterSpacing: "0.04em" }}>
                TIN HỌC SAO VIỆT
              </div>
            </div>
          </div>

          {/* Sidebar Menu Navigation */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {[
              { id: "questions", label: "Ngân Hàng Câu Hỏi", count: questions.length, icon: BookOpen },
              { id: "practicals", label: "Bài Thi Thực Hành", count: practicals.length, icon: Terminal },
              { id: "subjects", label: "Môn Học & Ngân Hàng Đề", count: subjects.length, icon: Code2 },
              { id: "users", label: "Phân Cấp Tài Khoản", count: filteredUsers.length, icon: Users },
              { id: "branches", label: "Cơ Sở & Phòng Lab", count: branches.length, icon: Building2 },
              { id: "results", label: "Kết Quả Khảo Thí", count: examResults.length, icon: GraduationCap }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    border: isActive ? "1px solid #1d4ed8" : "1px solid transparent",
                    background: isActive ? "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)" : "transparent",
                    color: isActive ? "#ffffff" : "#475569",
                    fontWeight: isActive ? 800 : 600,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isActive ? "0 6px 16px -3px rgba(37, 99, 235, 0.4)" : "none"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <IconComponent size={18} color={isActive ? "#ffffff" : "#64748b"} />
                    <span>{tab.label}</span>
                  </div>
                  <span style={{
                    fontSize: "0.74rem",
                    padding: "0.15rem 0.55rem",
                    borderRadius: "9999px",
                    background: isActive ? "rgba(255, 255, 255, 0.22)" : "#f1f5f9",
                    color: isActive ? "#ffffff" : "#475569",
                    fontWeight: 800
                  }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Admin Profile & Branch Filter at Sidebar Bottom */}
          <div style={{
            marginTop: "auto",
            paddingTop: "1.2rem",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem"
          }}>
            {/* User Profile Card */}
            <div style={{
              background: "#f8fafc",
              padding: "0.85rem 1rem",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: getAvatarGradient(currentUser.fullName),
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "0.85rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                flexShrink: 0
              }}>
                {getInitials(currentUser.fullName)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: currentUser.role === "admin" ? "#7c3aed" : "#2563eb",
                  background: currentUser.role === "admin" ? "#f5f3ff" : "#eff6ff",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  marginBottom: "2px",
                  whiteSpace: "nowrap"
                }}>
                  {currentUser.role === "admin" ? <Crown size={10} /> : <Building2 size={10} />}
                  <span>{currentUser.role === "admin" ? "SUPER ADMIN" : "QUẢN LÝ CƠ SỞ"}</span>
                </div>
                <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {currentUser.fullName}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {currentUser.branchName || "Toàn Hệ Thống Sao Việt"}
                </div>
              </div>
            </div>

            {/* Branch Selector Dropdown */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.7rem", fontWeight: 800, color: "#475569", textTransform: "uppercase" }}>
                  <Building2 size={12} color="#2563eb" />
                  <span>Chi Nhánh Đang Xem:</span>
                </label>
                {adminBranchMode !== "all" && (
                  <button
                    onClick={() => setAdminBranchMode("all")}
                    style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.68rem", fontWeight: 800, cursor: "pointer", padding: 0 }}
                  >
                    Xem tất cả ({users.length})
                  </button>
                )}
              </div>
              <select
                value={adminBranchMode}
                onChange={(e) => setAdminBranchMode(e.target.value)}
                style={{
                  width: "100%",
                  fontSize: "0.82rem",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 700,
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="all">🏢 Toàn Bộ Chi Nhánh ({users.length} TK)</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    🏢 {b.name} ({getBranchUserCount(b.id)} TK)
                  </option>
                ))}
              </select>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                logoutUser();
                window.location.href = "/";
              }}
              style={{
                width: "100%",
                padding: "0.55rem",
                borderRadius: "10px",
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#dc2626",
                fontWeight: 700,
                fontSize: "0.82rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              <LogOut size={14} />
              <span>Đăng Xuất Khỏi Portal</span>
            </button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* 2. MAIN CONTENT AREA */}
        {/* ========================================================================= */}
        <main style={{ minWidth: 0 }}>
          
          {/* Top Bar Header (Breadcrumb & Action Bar) */}
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            padding: "1.2rem 1.6rem",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            boxShadow: "0 2px 10px -2px rgba(0, 0, 0, 0.04)"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", fontWeight: 700, color: "#64748b", marginBottom: "0.2rem" }}>
                <span>Trang Chủ</span>
                <ChevronRight size={12} />
                <span>Quản Trị Hệ Thống</span>
                <ChevronRight size={12} />
                <span style={{ color: "#2563eb" }}>
                  {activeTab === "questions" && "Ngân Hàng Câu Hỏi"}
                  {activeTab === "practicals" && "Bài Thi Thực Hành"}
                  {activeTab === "subjects" && "Môn Học & Ngân Hàng Đề"}
                  {activeTab === "users" && "Phân Cấp Tài Khoản"}
                  {activeTab === "branches" && "Cơ Sở & Phòng Lab"}
                  {activeTab === "results" && "Kết Quả Khảo Thí"}
                </span>
              </div>
              <h1 style={{ fontSize: "1.45rem", fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>
                Hệ Thống Quản Trị & Khảo Thí Trực Tuyến
              </h1>
              <p style={{ color: "#64748b", fontSize: "0.84rem", margin: "0.2rem 0 0" }}>
                Trung tâm điều hành dữ liệu học phần, ngân hàng đề thi và phân cấp tài khoản Tin Học Sao Việt.
              </p>
            </div>

            <button
              onClick={loadAllData}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.1rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#2563eb",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "all 0.15s"
              }}
              title="Làm mới dữ liệu từ máy chủ"
            >
              <RefreshCw size={15} />
              <span>Làm Mới Dữ Liệu</span>
            </button>
          </div>

          {/* 4 STAT CARDS (SaaS Enterprise Style) */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "1.2rem",
            marginBottom: "1.75rem"
          }}>
            {/* Stat 1 */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.3rem 1.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 10px -2px rgba(0,0,0,0.04)"
            }}>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Tổng Câu Hỏi Khảo Thí
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#1e3a8a", lineHeight: 1.1, marginTop: "0.25rem" }}>
                  {questions.length || 140}
                </div>
                <div style={{ fontSize: "0.74rem", color: "#2563eb", fontWeight: 600, marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={12} />
                  <span>Chuẩn 6 định dạng đề</span>
                </div>
              </div>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <BookOpen size={24} />
              </div>
            </div>

            {/* Stat 2 */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.3rem 1.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 10px -2px rgba(0,0,0,0.04)"
            }}>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Học Viên & Quản Lý
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#065f46", lineHeight: 1.1, marginTop: "0.25rem" }}>
                  {users.length}
                </div>
                <div style={{ fontSize: "0.74rem", color: "#059669", fontWeight: 600, marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Users size={12} />
                  <span>Phân cấp theo từng cơ sở</span>
                </div>
              </div>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <GraduationCap size={24} />
              </div>
            </div>

            {/* Stat 3 */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.3rem 1.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 10px -2px rgba(0,0,0,0.04)"
            }}>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Học Phần & Ngôn Ngữ
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#581c87", lineHeight: 1.1, marginTop: "0.25rem" }}>
                  {subjects.length || 7}
                </div>
                <div style={{ fontSize: "0.74rem", color: "#7c3aed", fontWeight: 600, marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Terminal size={12} />
                  <span>{practicals.length} bài thực hành 3D</span>
                </div>
              </div>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
                color: "#7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Code2 size={24} />
              </div>
            </div>

            {/* Stat 4 */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.3rem 1.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 10px -2px rgba(0,0,0,0.04)"
            }}>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Cơ Sở & Chi Nhánh
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#9a3412", lineHeight: 1.1, marginTop: "0.25rem" }}>
                  {branches.length}
                </div>
                <div style={{ fontSize: "0.74rem", color: "#ea580c", fontWeight: 600, marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Building2 size={12} />
                  <span>TP.HCM & Bình Dương & BRVT</span>
                </div>
              </div>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
                color: "#ea580c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Building2 size={24} />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: NGÂN HÀNG CÂU HỎI (Questions) */}
          {/* ========================================================================= */}
          {activeTab === "questions" && (
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "1.5rem", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.8rem" }}>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    style={{
                      padding: "0.55rem 0.85rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#0f172a",
                      fontWeight: 700,
                      fontSize: "0.85rem"
                    }}
                  >
                    <option value="all">📚 Tất Cả Môn Học ({questions.length})</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code}) - {getSubjectQuestionCount(s.id)} câu</option>
                    ))}
                  </select>

                  <select
                    value={questionTypeFilter}
                    onChange={(e) => setQuestionTypeFilter(e.target.value)}
                    style={{
                      padding: "0.55rem 0.85rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#0f172a",
                      fontSize: "0.85rem"
                    }}
                  >
                    <option value="all">Tất Cả 6 Dạng</option>
                    <option value="single_choice">Trắc nghiệm ABCD</option>
                    <option value="true_false">Đúng / Sai</option>
                    <option value="multiple_choice">Nhiều đáp án</option>
                    <option value="fill_blank">Điền từ</option>
                    <option value="sequence_order">Sắp xếp dòng lệnh</option>
                    <option value="matching">Ghép cặp</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      setExcelTargetSubject(selectedSubjectId === "all" ? "python" : selectedSubjectId);
                      setShowExcelModal(true);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.55rem 1rem",
                      borderRadius: "10px",
                      border: "none",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "0.84rem",
                      cursor: "pointer"
                    }}
                  >
                    <FileSpreadsheet size={15} />
                    <span>📥 Nhập Từ Excel</span>
                  </button>

                  <button
                    onClick={handleExportQuestionsExcel}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.55rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#334155",
                      fontWeight: 600,
                      fontSize: "0.84rem",
                      cursor: "pointer"
                    }}
                  >
                    <Download size={15} />
                    <span>📤 Xuất Excel</span>
                  </button>

                  <button
                    onClick={() => { setEditingQuestion(null); setShowQuestionModal(true); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.55rem 1rem",
                      borderRadius: "10px",
                      border: "none",
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "0.84rem",
                      cursor: "pointer"
                    }}
                  >
                    <Plus size={15} />
                    <span>Thêm Câu Mới</span>
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  placeholder="🔍 Tìm kiếm câu hỏi theo nội dung, ID, giải thích logic..."
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.9rem",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontSize: "0.88rem"
                  }}
                />
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", background: "#ffffff" }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9", borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#334155" }}>
                      <th style={{ padding: "0.75rem 1rem", width: "60px" }}>ID</th>
                      <th style={{ padding: "0.75rem 1rem", width: "130px" }}>Dạng Câu</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Nội Dung Câu Hỏi & Các Lựa Chọn</th>
                      <th style={{ padding: "0.75rem 1rem", width: "120px" }}>Đáp Án</th>
                      <th style={{ padding: "0.75rem 1rem", width: "90px", textAlign: "right" }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.map((q) => (
                      <tr key={q.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "0.75rem 1rem", fontWeight: 800, color: "#64748b" }}>#{q.id}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <span style={{
                            padding: "0.2rem 0.5rem",
                            borderRadius: "6px",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            fontSize: "0.72rem",
                            fontWeight: 700
                          }}>
                            {q.type}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
                            {q.question}
                          </div>
                          {q.options && q.options.length > 0 && (
                            <div style={{ fontSize: "0.78rem", color: "#64748b", display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                              {q.options.map((opt, i) => (
                                <span key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "0.15rem 0.45rem", borderRadius: "6px", color: "#334155" }}>
                                  <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
                                </span>
                              ))}
                            </div>
                          )}
                          <div style={{ fontSize: "0.75rem", color: "#059669", marginTop: "0.3rem", fontWeight: 500 }}>
                            💡 {q.explanation}
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#059669" }}>
                          {JSON.stringify(q.correct_answer)}
                        </td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "0.35rem", justifyContent: "flex-end" }}>
                            <button
                              onClick={() => { setEditingQuestion(q); setShowQuestionModal(true); }}
                              style={{ padding: "0.35rem 0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#2563eb", cursor: "pointer" }}
                              title="Sửa câu hỏi"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              style={{ padding: "0.35rem 0.5rem", borderRadius: "6px", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer" }}
                              title="Xóa câu hỏi"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: BÀI THI THỰC HÀNH (Practicals) */}
          {/* ========================================================================= */}
          {activeTab === "practicals" && (
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "1.5rem", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.8rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                    Ngân Hàng 10 Bài Thi Thực Hành Viết Code
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0.2rem 0 0" }}>
                    Các đề thi tự luận lập trình chấm điểm qua test cases tự động.
                  </p>
                </div>

                <button
                  onClick={() => { setEditingPractical(null); setShowPracticalModal(true); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.55rem 1.1rem",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #059669, #047857)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  <Plus size={15} />
                  <span>Thêm Bài Thực Hành Mới</span>
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
                {practicals.map((p) => (
                  <div key={p.id} style={{ border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.2rem", background: "#ffffff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.6rem" }}>
                      <div>
                        <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: "6px", background: "#ecfdf5", color: "#059669", fontWeight: 800 }}>
                          Bài Thực Hành #{p.id}
                        </span>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0.3rem 0 0" }}>
                          {p.title}
                        </h3>
                      </div>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => { setEditingPractical(p); setShowPracticalModal(true); }}
                          style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#2563eb", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem" }}
                        >
                          <Edit3 size={13} />
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleDeletePractical(p.id)}
                          style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem" }}
                        >
                          <Trash2 size={13} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "0.8rem", lineHeight: 1.5 }}>
                      {p.description}
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                      <div style={{ background: "#0f172a", borderRadius: "10px", padding: "0.8rem", color: "#38bdf8", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
                        <div style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.3rem" }}>MÃ KHỞI TẠO (STARTER CODE):</div>
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{p.starter_code}</pre>
                      </div>

                      <div style={{ background: "#0f172a", borderRadius: "10px", padding: "0.8rem", color: "#34d399", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
                        <div style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.3rem" }}>MÃ NGUỒN CHUẨN (SOLUTION):</div>
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{p.solution_code}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MÔN HỌC & NGÂN HÀNG ĐỀ THI (Subjects Hub) */}
          {/* ========================================================================= */}
          {activeTab === "subjects" && (
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "1.5rem", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                    Quản Lý Môn Học & Bộ Đề Khảo Thí
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0.2rem 0 0" }}>
                    Mỗi môn học gắn liền với ngân hàng câu hỏi ôn tập, đề thi trắc nghiệm và bài thực hành.
                  </p>
                </div>

                <button
                  onClick={() => { setEditingSubject(null); setShowSubjectModal(true); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
                  }}
                >
                  <Plus size={16} />
                  <span>Thêm Môn Học & Ngân Hàng Đề</span>
                </button>
              </div>

              {/* Grid of Subject Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.25rem" }}>
                {subjects.map(s => {
                  const qCount = getSubjectQuestionCount(s.id);
                  const pCount = getSubjectPracticalCount(s.id);
                  const isPython = s.id === "python";

                  return (
                    <div
                      key={s.id}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "1.3rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
                      }}
                    >
                      <div>
                        {/* Top Meta */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.6rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <div style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "10px",
                              background: isPython ? "#ecfdf5" : "#eff6ff",
                              color: isPython ? "#059669" : "#2563eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}>
                              <Code2 size={20} />
                            </div>
                            <div>
                              <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "6px", background: "#f1f5f9", color: "#475569" }}>
                                {s.code}
                              </span>
                              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0.15rem 0 0" }}>
                                {s.name}
                              </h3>
                            </div>
                          </div>

                          <span style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "0.2rem 0.55rem",
                            borderRadius: "9999px",
                            background: s.isActive !== false ? "#ecfdf5" : "#fef2f2",
                            color: s.isActive !== false ? "#15803d" : "#b91c1c"
                          }}>
                            {s.isActive !== false ? "Đang Mở" : "Tạm Đóng"}
                          </span>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0.6rem 0 0.8rem", lineHeight: 1.5, minHeight: "38px" }}>
                          {s.description}
                        </p>

                        {/* Question Bank & Exam Status Metrics */}
                        <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "1rem" }}>
                          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#334155", marginBottom: "0.4rem", textTransform: "uppercase" }}>
                            📊 NGÂN HÀNG HỌC LIỆU & ĐỀ THI:
                          </div>
                          
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.8rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <BookOpen size={14} color="#2563eb" />
                              <span>Câu hỏi ôn: <strong style={{ color: qCount > 0 ? "#15803d" : "#ea580c" }}>{qCount} câu</strong></span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <Terminal size={14} color="#059669" />
                              <span>Thực hành: <strong style={{ color: pCount > 0 ? "#15803d" : "#64748b" }}>{pCount} bài</strong></span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <Clock size={14} color="#9333ea" />
                              <span>Đề thi: <strong>40 câu / 45p</strong></span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <Layers size={14} color="#d97706" />
                              <span>Chương học: <strong>{s.totalModules || 5} bài</strong></span>
                            </div>
                          </div>

                          {qCount === 0 && (
                            <div style={{ marginTop: "0.5rem", fontSize: "0.74rem", color: "#d97706", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <AlertCircle size={13} />
                              <span>Chưa có câu hỏi ôn tập. Nhấn "Nạp Đề" bên dưới để bổ sung.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button Strip */}
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <button
                            onClick={() => {
                              setExcelTargetSubject(s.id);
                              setShowExcelModal(true);
                            }}
                            style={{
                              padding: "0.45rem 0.6rem",
                              borderRadius: "8px",
                              border: "1px solid #10b981",
                              background: "#ecfdf5",
                              color: "#059669",
                              fontWeight: 700,
                              fontSize: "0.78rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.3rem",
                              cursor: "pointer"
                            }}
                          >
                            <FileSpreadsheet size={13} />
                            <span>Nạp Đề & Câu Hỏi</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedSubjectId(s.id);
                              setActiveTab("questions");
                            }}
                            style={{
                              padding: "0.45rem 0.6rem",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              background: "#ffffff",
                              color: "#2563eb",
                              fontWeight: 700,
                              fontSize: "0.78rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.3rem",
                              cursor: "pointer"
                            }}
                          >
                            <BookOpen size={13} />
                            <span>Soạn Câu Hỏi Ôn</span>
                          </button>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.4rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.6rem" }}>
                          <button
                            onClick={() => { setEditingSubject(s); setShowSubjectModal(true); }}
                            style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#475569", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}
                          >
                            Sửa Thông Tin
                          </button>
                          {s.id !== "python" && (
                            <button
                              onClick={() => handleDeleteSubject(s.id)}
                              style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}
                            >
                              Xóa Môn
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: PHÂN CẤP TÀI KHOẢN (Users Hierarchy - Modern SaaS Redesign) */}
          {/* ========================================================================= */}
          {activeTab === "users" && (
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "1.6rem", boxShadow: "0 2px 10px -2px rgba(0,0,0,0.04)" }}>
              {/* Header Title & Actions Strip */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.28rem", fontWeight: 800, margin: 0, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Users size={22} color="#2563eb" />
                    <span>Quản Lý Phân Cấp Tài Khoản</span>
                    <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "9999px", background: "#eff6ff", color: "#2563eb", fontWeight: 800 }}>
                      {filteredUsers.length} tài khoản
                    </span>
                  </h2>
                  <p style={{ fontSize: "0.83rem", color: "#64748b", margin: "0.25rem 0 0" }}>
                    Phân quyền truy cập Tổng quản trị, Quản lý các cơ sở chi nhánh, Giảng viên và Học viên hệ thống.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      padding: "0.65rem 1.3rem",
                      borderRadius: "11px",
                      border: "none",
                      background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "0.86rem",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px -2px rgba(37, 99, 235, 0.35)",
                      transition: "all 0.15s"
                    }}
                  >
                    <UserPlus size={16} />
                    <span>Cấp Tài Khoản Mới</span>
                  </button>
                </div>
              </div>

              {/* Advanced Filter Toolbar */}
              <div style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "0.85rem 1rem",
                marginBottom: "1.2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                flexWrap: "wrap"
              }}>
                {/* Search Bar with Icon */}
                <div style={{ position: "relative", flex: "1 1 280px", minWidth: "220px" }}>
                  <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Tìm kiếm theo họ tên, username, SĐT, lớp..."
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.85rem 0.6rem 2.3rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#0f172a",
                      fontSize: "0.86rem",
                      outline: "none"
                    }}
                  />
                  {userSearch && (
                    <button
                      onClick={() => setUserSearch("")}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Role Filter Dropdown */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Filter size={15} color="#64748b" />
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    style={{
                      padding: "0.55rem 0.85rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#0f172a",
                      fontWeight: 700,
                      fontSize: "0.84rem",
                      outline: "none",
                      cursor: "pointer"
                    }}
                  >
                    <option value="all">Tất Cả Vai Trò ({users.length})</option>
                    <option value="admin">Super Admin (Tổng Quản Trị)</option>
                    <option value="branch_manager">Quản Lý Chi Nhánh</option>
                    <option value="teacher">Giảng Viên Lập Trình</option>
                    <option value="student">Học Viên Khóa Học</option>
                  </select>
                </div>

                {/* Branch Direct Filter for Everyone */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Building2 size={15} color="#64748b" />
                  <select
                    value={adminBranchMode}
                    onChange={(e) => setAdminBranchMode(e.target.value)}
                    style={{
                      padding: "0.55rem 0.85rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#0f172a",
                      fontWeight: 700,
                      fontSize: "0.84rem",
                      outline: "none",
                      cursor: "pointer"
                    }}
                  >
                    <option value="all">🏢 Toàn Bộ Chi Nhánh ({users.length} tài khoản)</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>
                        🏢 {b.name} ({getBranchUserCount(b.id)} tài khoản)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Branch Filter Chips / Pills (Chọn nhanh chi nhánh bất kỳ) */}
              <div style={{
                display: "flex",
                gap: "0.45rem",
                overflowX: "auto",
                paddingBottom: "0.85rem",
                marginBottom: "0.85rem",
                alignItems: "center",
                whiteSpace: "nowrap"
              }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "4px", paddingRight: "4px" }}>
                  <Building2 size={13} color="#2563eb" /> Lọc nhanh cơ sở:
                </span>

                <button
                  onClick={() => setAdminBranchMode("all")}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    border: adminBranchMode === "all" ? "1px solid #2563eb" : "1px solid #e2e8f0",
                    background: adminBranchMode === "all" ? "linear-gradient(135deg, #1e40af, #2563eb)" : "#ffffff",
                    color: adminBranchMode === "all" ? "#ffffff" : "#475569",
                    fontWeight: 700,
                    fontSize: "0.76rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: adminBranchMode === "all" ? "0 2px 8px rgba(37, 99, 235, 0.3)" : "none",
                    transition: "all 0.15s"
                  }}
                >
                  <span>Toàn Bộ Cơ Sở</span>
                  <span style={{
                    padding: "1px 6px",
                    borderRadius: "9999px",
                    fontSize: "0.68rem",
                    background: adminBranchMode === "all" ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                    color: adminBranchMode === "all" ? "#ffffff" : "#64748b",
                    fontWeight: 800
                  }}>
                    {users.length}
                  </span>
                </button>

                {branches.map(b => {
                  const count = getBranchUserCount(b.id);
                  const isSelected = adminBranchMode === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setAdminBranchMode(b.id)}
                      style={{
                        padding: "4px 11px",
                        borderRadius: "9999px",
                        border: isSelected ? "1px solid #2563eb" : "1px solid #e2e8f0",
                        background: isSelected ? "linear-gradient(135deg, #1e40af, #2563eb)" : (count > 0 ? "#ffffff" : "#f8fafc"),
                        color: isSelected ? "#ffffff" : (count > 0 ? "#0f172a" : "#94a3b8"),
                        fontWeight: isSelected || count > 0 ? 700 : 500,
                        fontSize: "0.76rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        boxShadow: isSelected ? "0 2px 8px rgba(37, 99, 235, 0.3)" : "none",
                        transition: "all 0.15s"
                      }}
                      title={`Xem ${count} tài khoản tại ${b.name}`}
                    >
                      <span>{b.name.replace("Chi Nhánh ", "")}</span>
                      <span style={{
                        padding: "1px 5px",
                        borderRadius: "9999px",
                        fontSize: "0.68rem",
                        background: isSelected ? "rgba(255,255,255,0.25)" : (count > 0 ? "#eff6ff" : "#f1f5f9"),
                        color: isSelected ? "#ffffff" : (count > 0 ? "#2563eb" : "#94a3b8"),
                        fontWeight: 800
                      }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Modern Enterprise Data Table */}
              <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.02)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem", background: "#ffffff", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                      <th style={{ padding: "0.9rem 1.1rem", fontWeight: 800, textTransform: "uppercase", fontSize: "0.74rem", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                        Họ Và Tên
                      </th>
                      <th style={{ padding: "0.9rem 1.1rem", fontWeight: 800, textTransform: "uppercase", fontSize: "0.74rem", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                        Phân Cấp / Vai Trò
                      </th>
                      <th style={{ padding: "0.9rem 1.1rem", fontWeight: 800, textTransform: "uppercase", fontSize: "0.74rem", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                        Tài Khoản & Liên Hệ
                      </th>
                      <th style={{ padding: "0.9rem 1.1rem", fontWeight: 800, textTransform: "uppercase", fontSize: "0.74rem", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                        Cơ Sở Trực Thuộc
                      </th>
                      <th style={{ padding: "0.9rem 1.1rem", fontWeight: 800, textTransform: "uppercase", fontSize: "0.74rem", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                        Học Phần Cho Phép
                      </th>
                      <th style={{ padding: "0.9rem 1.1rem", fontWeight: 800, textTransform: "uppercase", fontSize: "0.74rem", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                        Mật Khẩu
                      </th>
                      <th style={{ padding: "0.9rem 1.1rem", fontWeight: 800, textTransform: "uppercase", fontSize: "0.74rem", letterSpacing: "0.04em", textAlign: "right", whiteSpace: "nowrap" }}>
                        Thao Tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: "3rem 1rem", textAlign: "center", color: "#64748b" }}>
                          <Users size={36} color="#cbd5e1" style={{ margin: "0 auto 0.6rem" }} />
                          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#334155" }}>Không tìm thấy tài khoản phù hợp</div>
                          <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc vai trò/chi nhánh.</div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isSuperAdmin = u.role === "admin";
                        const isManager = u.role === "branch_manager";
                        const isTeacher = u.role === "teacher";
                        const isStudent = u.role === "student" || (!u.role && !isSuperAdmin && !isManager && !isTeacher);
                        const enrolled = u.enrolledSubjects && u.enrolledSubjects.length > 0 ? u.enrolledSubjects : ["python"];

                        return (
                          <tr
                            key={u.id}
                            style={{
                              borderBottom: "1px solid #f1f5f9",
                              transition: "background 0.15s"
                            }}
                          >
                            {/* Họ Và Tên + Avatar */}
                            <td style={{ padding: "0.85rem 1.1rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "10px",
                                  background: getAvatarGradient(u.fullName),
                                  color: "#ffffff",
                                  fontWeight: 800,
                                  fontSize: "0.82rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                                  flexShrink: 0
                                }}>
                                  {getInitials(u.fullName)}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.88rem", whiteSpace: "nowrap" }}>
                                    {u.fullName}
                                  </div>
                                  {u.email ? (
                                    <div style={{ fontSize: "0.74rem", color: "#64748b", whiteSpace: "nowrap" }}>
                                      {u.email}
                                    </div>
                                  ) : (
                                    <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                                      Mã: #{u.id.substring(0, 8)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Phân Cấp / Vai Trò (No-Wrap SVG Badges) */}
                            <td style={{ padding: "0.85rem 1.1rem", whiteSpace: "nowrap" }}>
                              {isSuperAdmin && (
                                <span style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  padding: "4px 10px",
                                  borderRadius: "9999px",
                                  background: "#f5f3ff",
                                  color: "#6d28d9",
                                  fontSize: "0.75rem",
                                  fontWeight: 800,
                                  border: "1px solid #ddd6fe",
                                  whiteSpace: "nowrap"
                                }}>
                                  <Crown size={13} color="#7c3aed" />
                                  <span>Super Admin</span>
                                </span>
                              )}
                              {isManager && (
                                <span style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  padding: "4px 10px",
                                  borderRadius: "9999px",
                                  background: "#eff6ff",
                                  color: "#1d4ed8",
                                  fontSize: "0.75rem",
                                  fontWeight: 800,
                                  border: "1px solid #bfdbfe",
                                  whiteSpace: "nowrap"
                                }}>
                                  <Building2 size={13} color="#2563eb" />
                                  <span>Quản Lý Chi Nhánh</span>
                                </span>
                              )}
                              {isTeacher && (
                                <span style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  padding: "4px 10px",
                                  borderRadius: "9999px",
                                  background: "#f0fdfa",
                                  color: "#0f766e",
                                  fontSize: "0.75rem",
                                  fontWeight: 800,
                                  border: "1px solid #99f6e4",
                                  whiteSpace: "nowrap"
                                }}>
                                  <Award size={13} color="#0d9488" />
                                  <span>Giảng Viên</span>
                                </span>
                              )}
                              {isStudent && (
                                <span style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  padding: "4px 10px",
                                  borderRadius: "9999px",
                                  background: "#ecfdf5",
                                  color: "#047857",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  border: "1px solid #a7f3d0",
                                  whiteSpace: "nowrap"
                                }}>
                                  <GraduationCap size={13} color="#059669" />
                                  <span>Học Viên</span>
                                </span>
                              )}
                            </td>

                            {/* SĐT / Tên Đăng Nhập */}
                            <td style={{ padding: "0.85rem 1.1rem" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                  <KeyRound size={12} color="#64748b" />
                                  <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontWeight: 700,
                                    color: "#0f172a",
                                    fontSize: "0.82rem",
                                    background: "#f1f5f9",
                                    padding: "2px 7px",
                                    borderRadius: "6px",
                                    border: "1px solid #e2e8f0"
                                  }}>
                                    {u.username}
                                  </span>
                                </div>
                                {u.phone && (
                                  <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.74rem", color: "#64748b" }}>
                                    <Phone size={11} color="#94a3b8" />
                                    <span>{u.phone}</span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Cơ Sở Trực Thuộc & Lớp (Biết rõ tài khoản thuộc chi nhánh nào + Bấm để lọc) */}
                            <td style={{ padding: "0.85rem 1.1rem" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <button
                                  onClick={() => setAdminBranchMode(u.branchId || "all")}
                                  title={`Nhấn để chỉ xem danh sách tài khoản thuộc ${u.branchName || "Toàn Hệ Thống"}`}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "3px 8px",
                                    borderRadius: "8px",
                                    background: u.branchId ? "#eff6ff" : "#f5f3ff",
                                    border: u.branchId ? "1px solid #bfdbfe" : "1px solid #ddd6fe",
                                    color: u.branchId ? "#1d4ed8" : "#6d28d9",
                                    fontWeight: 700,
                                    fontSize: "0.82rem",
                                    cursor: "pointer",
                                    width: "fit-content",
                                    textAlign: "left",
                                    transition: "all 0.15s"
                                  }}
                                >
                                  <Building2 size={13} color={u.branchId ? "#2563eb" : "#7c3aed"} />
                                  <span>{u.branchName || "Toàn Hệ Thống Sao Việt"}</span>
                                </button>
                                
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                  {u.branchId && (
                                    <span style={{
                                      fontFamily: "var(--font-mono)",
                                      fontSize: "0.68rem",
                                      color: "#64748b",
                                      background: "#f1f5f9",
                                      padding: "1px 5px",
                                      borderRadius: "4px",
                                      border: "1px solid #e2e8f0"
                                    }}>
                                      #{branches.find(b => b.id === u.branchId)?.code || u.branchId.replace("branch_", "").toUpperCase()}
                                    </span>
                                  )}
                                  {u.class && (
                                    <span style={{ fontSize: "0.72rem", color: "#475569", background: "#f8fafc", padding: "1px 6px", borderRadius: "4px", width: "fit-content", border: "1px solid #e2e8f0" }}>
                                      {u.class}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Môn Được Phép (Compact Tag Badges) */}
                            <td style={{ padding: "0.85rem 1.1rem" }}>
                              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center", maxWidth: "230px" }}>
                                {enrolled.slice(0, 3).map((subId) => (
                                  <span
                                    key={subId}
                                    style={{
                                      padding: "2px 7px",
                                      borderRadius: "5px",
                                      background: "#eff6ff",
                                      color: "#1d4ed8",
                                      fontSize: "0.7rem",
                                      fontWeight: 700,
                                      border: "1px solid #dbeafe"
                                    }}
                                  >
                                    {subId.toUpperCase()}
                                  </span>
                                ))}
                                {enrolled.length > 3 && (
                                  <span
                                    title={enrolled.slice(3).join(", ").toUpperCase()}
                                    style={{
                                      padding: "2px 6px",
                                      borderRadius: "5px",
                                      background: "#f1f5f9",
                                      color: "#475569",
                                      fontSize: "0.68rem",
                                      fontWeight: 700,
                                      cursor: "pointer"
                                    }}
                                  >
                                    +{enrolled.length - 3} môn
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Mật Khẩu */}
                            <td style={{ padding: "0.85rem 1.1rem", whiteSpace: "nowrap" }}>
                              <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "#f8fafc",
                                padding: "3px 8px",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0"
                              }}>
                                <span style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "0.82rem",
                                  letterSpacing: visiblePasswordIds.includes(u.id) ? "normal" : "2px",
                                  color: "#334155"
                                }}>
                                  {visiblePasswordIds.includes(u.id) ? u.password : "••••••••"}
                                </span>
                                <button
                                  onClick={() => togglePasswordVisibility(u.id)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#64748b",
                                    padding: "2px",
                                    display: "flex",
                                    alignItems: "center"
                                  }}
                                  title={visiblePasswordIds.includes(u.id) ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                  {visiblePasswordIds.includes(u.id) ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                              </div>
                            </td>

                            {/* Thao Tác (Actions) */}
                            <td style={{ padding: "0.85rem 1.1rem", textAlign: "right", whiteSpace: "nowrap" }}>
                              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                                <button
                                  onClick={() => setEditingUser(u)}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "8px",
                                    border: "1px solid #bfdbfe",
                                    background: "#eff6ff",
                                    color: "#2563eb",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.15s"
                                  }}
                                  title="Chỉnh sửa tài khoản"
                                >
                                  <Edit3 size={14} />
                                </button>
                                {u.username !== "admin" && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      borderRadius: "8px",
                                      border: "1px solid #fecaca",
                                      background: "#fef2f2",
                                      color: "#dc2626",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      transition: "all 0.15s"
                                    }}
                                    title="Xóa tài khoản"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CƠ SỞ PHÒNG LAB (Branches) */}
          {/* ========================================================================= */}
          {activeTab === "branches" && (
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "1.5rem", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.8rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                    Danh Sách 4 Cơ Sở Đào Tạo Thực Hành
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0.2rem 0 0" }}>
                    Phân bổ quản lý chi nhánh, phòng lab và mã PIN giáo viên.
                  </p>
                </div>

                {currentUser.role === "admin" && (
                  <button
                    onClick={() => { setEditingBranch(null); setShowBranchModal(true); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.55rem 1.1rem",
                      borderRadius: "10px",
                      border: "none",
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer"
                    }}
                  >
                    <Plus size={15} />
                    <span>Thêm Chi Nhánh Mới</span>
                  </button>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
                {branches.map((b) => (
                  <div key={b.id} style={{ border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.2rem", background: "#ffffff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.6rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Building2 size={20} />
                        </div>
                        <div>
                          <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "6px", background: "#f1f5f9", color: "#475569" }}>{b.code}</span>
                          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: "0.15rem 0 0" }}>{b.name}</h3>
                        </div>
                      </div>
                      {currentUser.role === "admin" && (
                        <div style={{ display: "flex", gap: "0.3rem" }}>
                          <button
                            onClick={() => { setEditingBranch(b); setShowBranchModal(true); }}
                            style={{ padding: "0.3rem 0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#2563eb", cursor: "pointer", fontSize: "0.75rem" }}
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteBranch(b.id)}
                            style={{ padding: "0.3rem 0.5rem", borderRadius: "6px", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontSize: "0.75rem" }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: "0.82rem", color: "#475569", display: "flex", flexDirection: "column", gap: "0.35rem", marginTop: "0.8rem" }}>
                      <div>📍 {b.address}</div>
                      <div>📞 Hotline: <strong>{b.phone}</strong></div>
                      <div>👤 Phụ trách: <strong>{b.managerName}</strong></div>
                      <div>🔢 Mã PIN GV: <strong style={{ color: "#2563eb", letterSpacing: "2px" }}>{b.defaultTeacherPin}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: KẾT QUẢ KHẢO THÍ (Exam Results) */}
          {/* ========================================================================= */}
          {activeTab === "results" && (
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "1.5rem", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1rem", color: "#0f172a" }}>
                Bảng Điểm & Kết Quả Thi Khảo Thí Online
              </h2>

              <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", background: "#ffffff" }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9", borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#334155" }}>
                      <th style={{ padding: "0.75rem 1rem" }}>Học Viên</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Chi Nhánh</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Điểm Số</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Số Câu Đúng</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Thời Gian Làm</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examResults.length > 0 ? (
                      examResults.map((r, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{r.studentName}</td>
                          <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>{r.branchName || "Thủ Đức"}</td>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: 900, color: (r.score || 0) >= 8 ? "#15803d" : "#ea580c", fontSize: "1rem" }}>
                            {r.score} / 10
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>{r.correctCount} / {r.totalQuestions} câu</td>
                          <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>{Math.floor((r.timeSpentSeconds || 0) / 60)} phút</td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <span style={{
                              padding: "0.2rem 0.5rem",
                              borderRadius: "6px",
                              background: (r.score || 0) >= 5 ? "#ecfdf5" : "#fef2f2",
                              color: (r.score || 0) >= 5 ? "#15803d" : "#b91c1c",
                              fontWeight: 700,
                              fontSize: "0.74rem"
                            }}>
                              {(r.score || 0) >= 8 ? "🏆 Xuất Sắc" : (r.score || 0) >= 5 ? "✅ Đạt Yêu Cầu" : "⚠️ Cần Ôn Lại"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
                          Chưa có lịch sử bài thi nào được nộp gần đây.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onUserAdded={loadAllData}
          defaultBranchId={currentUser?.role === "branch_manager" ? currentUser.branchId : "branch_thuduc"}
          isBranchLocked={currentUser?.role === "branch_manager"}
        />
      )}

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={loadAllData}
        />
      )}

      {showQuestionModal && (
        <QuestionFormModal
          question={editingQuestion}
          defaultSubjectId={selectedSubjectId === "all" ? "python" : selectedSubjectId}
          onClose={() => { setShowQuestionModal(false); setEditingQuestion(null); }}
          onSaved={loadAllData}
        />
      )}

      {showPracticalModal && (
        <PracticalFormModal
          problem={editingPractical}
          defaultSubjectId={selectedSubjectId === "all" ? "python" : selectedSubjectId}
          onClose={() => { setShowPracticalModal(false); setEditingPractical(null); }}
          onSaved={loadAllData}
        />
      )}

      {showExcelModal && (
        <ExcelQuestionImporter
          subjects={subjects}
          branches={branches}
          currentSubjectId={excelTargetSubject}
          onImportSuccess={() => loadAllData()}
          onClose={() => setShowExcelModal(false)}
        />
      )}

      {showBranchModal && (
        <BranchModal
          branch={editingBranch}
          onSave={handleSaveBranch}
          onClose={() => { setShowBranchModal(false); setEditingBranch(null); }}
        />
      )}

      {showSubjectModal && (
        <SubjectModal
          subject={editingSubject}
          onSave={handleSaveSubject}
          onClose={() => { setShowSubjectModal(false); setEditingSubject(null); }}
        />
      )}
    </div>
  );
}
