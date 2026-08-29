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
  AlertCircle
} from "lucide-react";

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
    if (user && user.role === "branch_manager" && user.branchId) {
      setAdminBranchMode(user.branchId);
    }
    loadAllData();
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
          if (u.username) userMap.set(u.username.toLowerCase(), u);
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

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
      const effectiveBranchFilter = currentUser?.role === "branch_manager" ? currentUser.branchId : adminBranchMode;
      const matchBranch = effectiveBranchFilter === "all" || u.branchId === effectiveBranchFilter;
      const matchSearch =
        userSearch === "" ||
        u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.phone && u.phone.includes(userSearch)) ||
        (u.class && u.class.toLowerCase().includes(userSearch.toLowerCase()));
      return matchRole && matchBranch && matchSearch;
    });
  }, [users, userRoleFilter, adminBranchMode, currentUser, userSearch]);

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
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "1.5rem 1rem", color: "#0f172a" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", display: "grid", gridTemplateColumns: "270px 1fr", gap: "1.75rem", alignItems: "start" }}>
        
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
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
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
                    padding: "0.75rem 0.95rem",
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: isActive ? "#bfdbfe" : "transparent",
                    background: isActive ? "#eff6ff" : "transparent",
                    color: isActive ? "#1d4ed8" : "#475569",
                    fontWeight: isActive ? 800 : 600,
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <IconComponent size={17} color={isActive ? "#2563eb" : "#64748b"} />
                    <span>{tab.label}</span>
                  </div>
                  <span style={{
                    fontSize: "0.72rem",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "9999px",
                    background: isActive ? "#dbeafe" : "#f1f5f9",
                    color: isActive ? "#1e40af" : "#64748b",
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
            gap: "0.75rem"
          }}>
            <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                color: currentUser.role === "admin" ? "#7e22ce" : "#1d4ed8",
                textTransform: "uppercase",
                marginBottom: "0.15rem"
              }}>
                {currentUser.role === "admin" ? "👑 Super Admin" : "🏢 Quản Lý Chi Nhánh"}
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
                {currentUser.fullName}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                {currentUser.branchName || "Toàn Hệ Thống Sao Việt"}
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, color: "#475569", marginBottom: "0.3rem", textTransform: "uppercase" }}>
                Xem Dữ Liệu Theo Chi Nhánh:
              </label>
              {currentUser.role === "admin" ? (
                <select
                  value={adminBranchMode}
                  onChange={(e) => setAdminBranchMode(e.target.value)}
                  style={{
                    width: "100%",
                    fontSize: "0.78rem",
                    padding: "0.45rem 0.6rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontWeight: 600
                  }}
                >
                  <option value="all">🏢 Toàn Bộ Cơ Sở ({branches.length})</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>🏢 {b.name}</option>
                  ))}
                </select>
              ) : (
                <div style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 700, padding: "0.4rem 0.5rem", background: "#eff6ff", borderRadius: "6px" }}>
                  {currentUser.branchName || "Chi Nhánh Được Gán"}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                logoutUser();
                window.location.href = "/";
              }}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#dc2626",
                fontWeight: 700,
                fontSize: "0.82rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                cursor: "pointer"
              }}
            >
              <LogOut size={14} />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* 2. MAIN CONTENT AREA */}
        {/* ========================================================================= */}
        <main style={{ minWidth: 0 }}>
          
          {/* Top Bar Header */}
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            padding: "1.2rem 1.5rem",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
          }}>
            <div>
              <h1 style={{ fontSize: "1.45rem", fontWeight: 900, color: "#0f172a", margin: 0 }}>
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
                gap: "0.4rem",
                padding: "0.55rem 1rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#2563eb",
                fontWeight: 700,
                fontSize: "0.84rem",
                cursor: "pointer"
              }}
              title="Làm mới dữ liệu từ máy chủ"
            >
              <RefreshCw size={14} />
              <span>Làm Mới Dữ Liệu</span>
            </button>
          </div>

          {/* 4 STAT CARDS (High-Contrast Clean Light Mode) */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.1rem",
            marginBottom: "1.75rem"
          }}>
            <div style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderTop: "4px solid #2563eb",
              borderRadius: "16px",
              padding: "1.25rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
            }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Tổng Câu Hỏi Khảo Thí
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#1d4ed8", lineHeight: 1.2, marginTop: "0.2rem" }}>
                {questions.length || 120}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: 600, marginTop: "0.2rem" }}>
                🐍 Python: 120 câu chuẩn 6 dạng
              </div>
            </div>

            <div style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderTop: "4px solid #16a34a",
              borderRadius: "16px",
              padding: "1.25rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
            }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Học Viên Đang Học
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#15803d", lineHeight: 1.2, marginTop: "0.2rem" }}>
                {users.filter(u => u.role === "student").length || 87}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.2rem" }}>
                Phân quyền theo từng chi nhánh
              </div>
            </div>

            <div style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderTop: "4px solid #9333ea",
              borderRadius: "16px",
              padding: "1.25rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
            }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Môn Học & Ngôn Ngữ
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#7e22ce", lineHeight: 1.2, marginTop: "0.2rem" }}>
                {subjects.length || 7}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.2rem" }}>
                Tích hợp sẵn bộ đề & ngân hàng ôn
              </div>
            </div>

            <div style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderTop: "4px solid #ea580c",
              borderRadius: "16px",
              padding: "1.25rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
            }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Cơ Sở & Chi Nhánh
              </div>
              <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "#c2410c", lineHeight: 1.2, marginTop: "0.2rem" }}>
                {branches.length || 4}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.2rem" }}>
                4 Cơ sở phòng máy chuẩn
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
          {/* TAB 4: PHÂN CẤP TÀI KHOẢN (Users Hierarchy) */}
          {/* ========================================================================= */}
          {activeTab === "users" && (
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "1.5rem", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.8rem" }}>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
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
                      fontSize: "0.85rem"
                    }}
                  >
                    <option value="all">👥 Tất Cả Vai Trò ({users.length})</option>
                    <option value="admin">👑 Tổng Quản Trị (Super Admin)</option>
                    <option value="branch_manager">🏢 Quản Lý Chi Nhánh</option>
                    <option value="student">🎓 Học Viên</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowAddUserModal(true)}
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
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
                  }}
                >
                  <UserPlus size={16} />
                  <span>Cấp Tài Khoản Mới (Phân Cấp)</span>
                </button>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="🔍 Tìm kiếm tài khoản theo tên, SĐT, lớp học, chi nhánh..."
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

              {/* Table Users */}
              <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", background: "#ffffff" }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9", borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#334155" }}>
                      <th style={{ padding: "0.75rem 1rem" }}>Họ Và Tên</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Phân Cấp / Vai Trò</th>
                      <th style={{ padding: "0.75rem 1rem" }}>SĐT / Tên Đăng Nhập</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Cơ Sở Trực Thuộc & Lớp</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Môn Được Phép</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Mật Khẩu</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => {
                      const isSuperAdmin = u.role === "admin";
                      const isManager = u.role === "branch_manager";
                      const isStudent = u.role === "student" || !u.role;

                      return (
                        <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: 800, color: "#0f172a" }}>
                            {u.fullName}
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            {isSuperAdmin && (
                              <span style={{ padding: "0.2rem 0.55rem", borderRadius: "6px", background: "#f3e8ff", color: "#7e22ce", fontSize: "0.74rem", fontWeight: 800, border: "1px solid #d8b4fe" }}>
                                👑 Super Admin
                              </span>
                            )}
                            {isManager && (
                              <span style={{ padding: "0.2rem 0.55rem", borderRadius: "6px", background: "#eff6ff", color: "#1d4ed8", fontSize: "0.74rem", fontWeight: 800, border: "1px solid #bfdbfe" }}>
                                🏢 Quản Lý Chi Nhánh
                              </span>
                            )}
                            {isStudent && (
                              <span style={{ padding: "0.2rem 0.55rem", borderRadius: "6px", background: "#ecfdf5", color: "#15803d", fontSize: "0.74rem", fontWeight: 700, border: "1px solid #bbf7d0" }}>
                                🎓 Học Viên
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <code style={{ background: "#f8fafc", padding: "0.15rem 0.4rem", borderRadius: "4px", border: "1px solid #e2e8f0", color: "#0f172a", fontWeight: 700 }}>
                              {u.username}
                            </code>
                            {u.phone && <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "0.15rem" }}>SĐT: {u.phone}</div>}
                          </td>
                          <td style={{ padding: "0.75rem 1rem", color: "#334155" }}>
                            <div style={{ fontWeight: 600 }}>{u.branchName || "Chi Nhánh Thủ Đức"}</div>
                            {u.class && <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{u.class}</div>}
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                              {(u.enrolledSubjects || ["python"]).map((subId) => (
                                <span
                                  key={subId}
                                  style={{
                                    padding: "0.12rem 0.4rem",
                                    borderRadius: "4px",
                                    background: "#eff6ff",
                                    color: "#1d4ed8",
                                    fontSize: "0.72rem",
                                    fontWeight: 700
                                  }}
                                >
                                  {subId.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
                                {visiblePasswordIds.includes(u.id) ? u.password : "••••••••"}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(u.id)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
                              >
                                {visiblePasswordIds.includes(u.id) ? <EyeOff size={13} /> : <Eye size={13} />}
                              </button>
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                            <div style={{ display: "flex", gap: "0.35rem", justifyContent: "flex-end" }}>
                              <button
                                onClick={() => setEditingUser(u)}
                                style={{ padding: "0.35rem 0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#2563eb", cursor: "pointer" }}
                                title="Sửa tài khoản"
                              >
                                <Edit3 size={13} />
                              </button>
                              {u.username !== "admin" && (
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  style={{ padding: "0.35rem 0.5rem", borderRadius: "6px", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer" }}
                                  title="Xóa tài khoản"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
