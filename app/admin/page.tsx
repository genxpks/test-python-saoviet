"use client";

import { useState, useEffect, useMemo } from "react";
import { User, Question, PracticalProblem, PausedExamState, ExamResult, Branch, Subject } from "@/types";
import { 
  getUsers, 
  deleteUser, 
  getCurrentUser, 
  loginUser,
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
  LogOut
} from "lucide-react";

type AdminTab = "questions" | "practicals" | "users" | "branches" | "subjects" | "results";

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

  const [showExcelModal, setShowExcelModal] = useState(false);
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
    setBranches(DEFAULT_BRANCHES);
    setSubjects(DEFAULT_SUBJECTS);
    setUsers(getUsers());
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
      if (resU?.success && resU.users?.length > 0) setUsers(resU.users);
      if (resE?.success && resE.results?.length > 0) setExamResults(resE.results);
    } catch {}
  };

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginUser(loginUsername, loginPassword);
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
      loadAllData();
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản học viên này?")) {
      deleteUser(id);
      loadAllData();
    }
  };

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

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "branch_manager" && currentUser.role !== "teacher")) {
    return (
      <div style={{ maxWidth: "480px", margin: "4rem auto", padding: "0 1rem" }}>
        <div className="q-card" style={{ padding: "2.5rem 2rem", textAlign: "center" }}>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "16px",
            background: "rgba(225, 29, 72, 0.1)",
            color: "var(--brand-rose)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.2rem"
          }}>
            <ShieldCheck size={30} />
          </div>

          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.4rem" }}>
            Khu Vực Quản Trị Hệ Thống
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            Vui lòng đăng nhập tài khoản Tổng Quản Trị (Admin) hoặc Quản Lý Chi Nhánh.
          </p>

          <form onSubmit={handleInlineLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
            {loginError && (
              <div style={{ color: "#b91c1c", fontSize: "0.82rem", background: "#fef2f2", padding: "0.6rem 0.8rem", borderRadius: "var(--radius-sm)" }}>
                {loginError}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Tài Khoản Quản Trị:
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="VD: admin hoặc quanly_thuduc"
                className="input"
                style={{ width: "100%" }}
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Mật Khẩu:
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="input"
                style={{ width: "100%" }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: "0.4rem" }}>
              <Lock size={16} />
              <span>Đăng Nhập Quản Trị</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1550px", margin: "0 auto", padding: "1.5rem 1rem", minHeight: "calc(100vh - 80px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "270px 1fr", gap: "1.75rem", alignItems: "start" }}>
        
        {/* ========================================================================= */}
        {/* 1. LEFT SIDEBAR (Matching Approved Mockup) */}
        {/* ========================================================================= */}
        <aside style={{
          background: "rgba(4, 12, 34, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1.5px solid rgba(0, 245, 200, 0.22)",
          borderRadius: "24px",
          padding: "1.5rem 1.1rem",
          position: "sticky",
          top: "85px",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          boxShadow: "0 12px 35px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 245, 200, 0.08)"
        }}>
          {/* Brand Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingBottom: "1.2rem", borderBottom: "1.5px solid rgba(0, 245, 200, 0.15)" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #00f5c8, #0ea5e9)",
              color: "#020617",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(0, 245, 200, 0.4)"
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 900, color: "#ffffff", fontFamily: "var(--font-heading)" }}>
                Admin Panel
              </div>
              <div style={{ fontSize: "0.7rem", color: "#00f5c8", fontWeight: 800, letterSpacing: "0.05em" }}>
                TIN HỌC SAO VIỆT
              </div>
            </div>
          </div>

          {/* Sidebar Menu Items (Vertical Tabs) */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {[
              { id: "questions", label: "Ngân Hàng Câu Hỏi", count: questions.length, icon: BookOpen },
              { id: "users", label: "Quản Lý Học Viên", count: filteredUsers.length, icon: Users },
              { id: "subjects", label: "Môn Học & Ngôn Ngữ", count: subjects.length, icon: Code2 },
              { id: "branches", label: "Cơ Sở Phòng Lab", count: branches.length, icon: Building2 },
              { id: "results", label: "Kết Quả Thi Online", count: examResults.length, icon: GraduationCap }
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
                    borderRadius: "14px",
                    border: "1.5px solid",
                    borderColor: isActive ? "#00f5c8" : "transparent",
                    background: isActive ? "linear-gradient(135deg, rgba(0, 245, 200, 0.16), rgba(14, 165, 233, 0.12))" : "transparent",
                    color: isActive ? "#00f5c8" : "#94a3b8",
                    fontWeight: isActive ? 800 : 600,
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                    boxShadow: isActive ? "0 4px 18px rgba(0, 245, 200, 0.18)" : "none"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <IconComponent size={17} color={isActive ? "#00f5c8" : "#64748b"} />
                    <span>{tab.label}</span>
                  </div>
                  <span style={{
                    fontSize: "0.72rem",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "9999px",
                    background: isActive ? "rgba(0, 245, 200, 0.22)" : "rgba(255, 255, 255, 0.06)",
                    color: isActive ? "#00f5c8" : "#64748b",
                    fontWeight: 800
                  }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Admin Info Card & Branch Switcher at Sidebar Bottom */}
          <div style={{
            marginTop: "auto",
            paddingTop: "1.2rem",
            borderTop: "1.5px solid rgba(0, 245, 200, 0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#00f5c8", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                {currentUser.role === "admin" ? "Super Admin" : "Quản Lý Chi Nhánh"}
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#ffffff" }}>
                {currentUser.fullName}
              </div>
              <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                {currentUser.branchName || "Toàn Hệ Thống Sao Việt"}
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.3rem" }}>
                XEM THEO CHI NHÁNH:
              </label>
              {currentUser.role === "admin" ? (
                <select
                  value={adminBranchMode}
                  onChange={(e) => setAdminBranchMode(e.target.value)}
                  className="input"
                  style={{ width: "100%", fontSize: "0.78rem", padding: "0.4rem 0.5rem", borderColor: "rgba(0, 245, 200, 0.3)" }}
                >
                  <option value="all">🏢 Toàn Bộ (4 Cơ Sở)</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>🏢 {b.name}</option>
                  ))}
                </select>
              ) : (
                <div style={{ fontSize: "0.78rem", color: "#00f5c8", fontWeight: 700 }}>
                  {currentUser.branchName || "Chi Nhánh Được Gán"}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                logoutUser();
                window.location.href = "/";
              }}
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", justifyContent: "center", color: "#f43f5e", borderColor: "rgba(244, 63, 94, 0.3)", padding: "0.45rem" }}
            >
              <LogOut size={14} />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* 2. RIGHT MAIN CONTENT AREA */}
        {/* ========================================================================= */}
        <main style={{ minWidth: 0 }}>
          {/* Top Header Bar */}
          <div style={{
            background: "rgba(4, 12, 34, 0.82)",
            backdropFilter: "blur(20px)",
            border: "1.5px solid rgba(0, 245, 200, 0.22)",
            borderRadius: "20px",
            padding: "1.1rem 1.5rem",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 245, 200, 0.06)"
          }}>
            <div>
              <h1 style={{ fontSize: "1.4rem", fontWeight: 900, margin: 0, color: "#ffffff", fontFamily: "var(--font-heading)" }}>
                Bảng Điều Khiển Quản Trị Hệ Thống
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: "0.2rem 0 0" }}>
                Trung tâm kiểm soát dữ liệu, học viên và khảo thí trực tuyến Tin Học Sao Việt.
              </p>
            </div>

            <button
              onClick={loadAllData}
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", borderColor: "rgba(0, 245, 200, 0.3)", color: "#00f5c8" }}
              title="Làm mới dữ liệu từ máy chủ"
            >
              <RefreshCw size={14} />
              <span>Làm Mới Dữ Liệu</span>
            </button>
          </div>

          {/* 4 COSMIC STAT CARDS (Exact Approved Mockup Match) */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "1.1rem",
            marginBottom: "1.75rem"
          }}>
            <div style={{
              background: "rgba(4, 12, 34, 0.82)",
              backdropFilter: "blur(20px)",
              border: "1.5px solid rgba(0, 245, 200, 0.25)",
              borderRadius: "18px",
              padding: "1.4rem 1.2rem",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 245, 200, 0.1)"
            }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.3rem" }}>
                Tổng Câu Hỏi
              </div>
              <div style={{
                fontSize: "2.6rem",
                fontWeight: 900,
                color: "#00f5c8",
                fontFamily: "var(--font-heading)",
                textShadow: "0 0 25px rgba(0, 245, 200, 0.5)",
                lineHeight: 1.1
              }}>
                {questions.length || 120}
              </div>
            </div>

            <div style={{
              background: "rgba(4, 12, 34, 0.82)",
              backdropFilter: "blur(20px)",
              border: "1.5px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "18px",
              padding: "1.4rem 1.2rem",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(56, 189, 248, 0.1)"
            }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.3rem" }}>
                Học Viên
              </div>
              <div style={{
                fontSize: "2.6rem",
                fontWeight: 900,
                color: "#38bdf8",
                fontFamily: "var(--font-heading)",
                textShadow: "0 0 25px rgba(56, 189, 248, 0.5)",
                lineHeight: 1.1
              }}>
                {users.filter(u => u.role === "student").length || 87}
              </div>
            </div>

            <div style={{
              background: "rgba(4, 12, 34, 0.82)",
              backdropFilter: "blur(20px)",
              border: "1.5px solid rgba(167, 139, 250, 0.25)",
              borderRadius: "18px",
              padding: "1.4rem 1.2rem",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(167, 139, 250, 0.1)"
            }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.3rem" }}>
                Chi Nhánh
              </div>
              <div style={{
                fontSize: "2.6rem",
                fontWeight: 900,
                color: "#a78bfa",
                fontFamily: "var(--font-heading)",
                textShadow: "0 0 25px rgba(167, 139, 250, 0.5)",
                lineHeight: 1.1
              }}>
                {branches.length || 4}
              </div>
            </div>

            <div style={{
              background: "rgba(4, 12, 34, 0.82)",
              backdropFilter: "blur(20px)",
              border: "1.5px solid rgba(0, 245, 200, 0.25)",
              borderRadius: "18px",
              padding: "1.4rem 1.2rem",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 245, 200, 0.1)"
            }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.3rem" }}>
                Kỳ Thi
              </div>
              <div style={{
                fontSize: "2.6rem",
                fontWeight: 900,
                color: "#00f5c8",
                fontFamily: "var(--font-heading)",
                textShadow: "0 0 25px rgba(0, 245, 200, 0.5)",
                lineHeight: 1.1
              }}>
                {examResults.length > 0 ? examResults.length : 23}
              </div>
            </div>
          </div>

      {/* TAB 1: QUESTIONS */}
      {activeTab === "questions" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.8rem" }}>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="input"
                style={{ fontWeight: 700, fontSize: "0.85rem" }}
              >
                <option value="all">📚 Tất Cả Môn Học ({questions.length})</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>

              <select
                value={questionTypeFilter}
                onChange={(e) => setQuestionTypeFilter(e.target.value)}
                className="input"
                style={{ fontSize: "0.85rem" }}
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

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setShowExcelModal(true)}
                className="btn btn-primary btn-sm"
                style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-emerald))" }}
              >
                <FileSpreadsheet size={15} />
                <span>📥 Nhập Từ Excel</span>
              </button>

              <button
                onClick={handleExportQuestionsExcel}
                className="btn btn-secondary btn-sm"
              >
                <Download size={15} />
                <span>📤 Xuất Ra Excel</span>
              </button>

              <button
                onClick={() => { setEditingQuestion(null); setShowQuestionModal(true); }}
                className="btn btn-secondary btn-sm"
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
              placeholder="🔍 Tìm kiếm câu hỏi..."
              className="input"
              style={{ width: "100%" }}
            />
          </div>

          <div className="q-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "var(--bg-light)", borderBottom: "1px solid var(--border-light)", textAlign: "left" }}>
                    <th style={{ padding: "0.75rem 1rem", width: "60px" }}>ID</th>
                    <th style={{ padding: "0.75rem 1rem", width: "130px" }}>Dạng Câu</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Nội Dung Câu Hỏi & Các Lựa Chọn</th>
                    <th style={{ padding: "0.75rem 1rem", width: "110px" }}>Đáp Án</th>
                    <th style={{ padding: "0.75rem 1rem", width: "90px", textAlign: "right" }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((q) => (
                    <tr key={q.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>#{q.id}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span className="badge badge-primary" style={{ fontSize: "0.72rem" }}>
                          {q.type}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                          {q.question}
                        </div>
                        {q.options && q.options.length > 0 && (
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                            {q.options.map((opt, i) => (
                              <span key={i} style={{ background: "var(--bg-light)", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>
                                {String.fromCharCode(65 + i)}. {opt}
                              </span>
                            ))}
                          </div>
                        )}
                        <div style={{ fontSize: "0.75rem", color: "var(--brand-emerald-dark)", marginTop: "0.2rem", fontStyle: "italic" }}>
                          💡 {q.explanation}
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "var(--brand-emerald-dark)" }}>
                        {JSON.stringify(q.correct_answer)}
                      </td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.3rem", justifyContent: "flex-end" }}>
                          <button onClick={() => { setEditingQuestion(q); setShowQuestionModal(true); }} className="btn btn-secondary btn-sm" style={{ padding: "0.3rem" }}>
                            <Edit3 size={13} />
                          </button>
                          <button onClick={() => handleDeleteQuestion(q.id)} className="btn btn-danger btn-sm" style={{ padding: "0.3rem" }}>
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
        </div>
      )}

      {/* TAB 2: USERS */}
      {activeTab === "users" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.8rem" }}>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="input"
                style={{ fontSize: "0.85rem", fontWeight: 700 }}
              >
                <option value="all">👥 Tất Cả Vai Trò ({users.length})</option>
                <option value="admin">👑 Tổng Quản Trị</option>
                <option value="branch_manager">🏫 Quản Lý Chi Nhánh</option>
                <option value="student">🎓 Học Viên</option>
              </select>
            </div>

            <button onClick={() => setShowAddUserModal(true)} className="btn btn-primary btn-sm">
              <UserPlus size={15} />
              <span>Cấp Tài Khoản Học Viên Mới</span>
            </button>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="🔍 Tìm kiếm học viên theo tên, SĐT, lớp..."
              className="input"
              style={{ width: "100%" }}
            />
          </div>

          <div className="q-card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "var(--bg-light)", borderBottom: "1px solid var(--border-light)", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem 1rem" }}>Họ Và Tên</th>
                  <th style={{ padding: "0.75rem 1rem" }}>SĐT / Tên Đăng Nhập</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Chi Nhánh & Lớp</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Môn Được Cấp</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Thời Lượng Học</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Mật Khẩu</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{u.fullName}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <code>{u.username}</code>
                      {u.phone && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>SĐT: {u.phone}</div>}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "var(--text-secondary)" }}>
                      <div>{u.branchName || "Chi Nhánh Thủ Đức"}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{u.class || "Khóa 26"}</div>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                        {(u.enrolledSubjects || ["python"]).map((subId) => (
                          <span
                            key={subId}
                            style={{
                              padding: "0.15rem 0.45rem",
                              borderRadius: "4px",
                              background: "rgba(37, 99, 235, 0.1)",
                              color: "var(--brand-primary)",
                              fontSize: "0.72rem",
                              fontWeight: 700
                            }}
                          >
                            {subId.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "var(--brand-primary)", fontWeight: 700 }}>
                      ⏱️ {formatStudyDuration(u.totalStudySeconds || 0)}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span>{visiblePasswordIds.includes(u.id) ? u.password : "••••••••"}</span>
                        <button onClick={() => togglePasswordVisibility(u.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                          {visiblePasswordIds.includes(u.id) ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.3rem", justifyContent: "flex-end" }}>
                        <button onClick={() => setEditingUser(u)} className="btn btn-secondary btn-sm" style={{ padding: "0.3rem" }}>
                          <Edit3 size={13} />
                        </button>
                        {u.username !== "admin" && (
                          <button onClick={() => handleDeleteUser(u.id)} className="btn btn-danger btn-sm" style={{ padding: "0.3rem" }}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SUBJECTS */}
      {activeTab === "subjects" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {subjects.map(s => (
            <div key={s.id} className="q-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ padding: "0.4rem", background: "rgba(37, 99, 235, 0.1)", borderRadius: "var(--radius-md)", color: "var(--brand-primary)" }}>
                    <Code2 size={20} />
                  </div>
                  <div>
                    <span className="badge badge-primary" style={{ fontSize: "0.72rem" }}>{s.code}</span>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0.2rem 0 0" }}>{s.name}</h3>
                  </div>
                </div>
                <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: "0.5rem 0" }}>
                  {s.description}
                </p>
              </div>
              <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "0.6rem", display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                <span>Runtime: <code>{s.runtime}</code></span>
                <span>Khóa: <strong>{s.totalModules} bài</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: BRANCHES */}
      {activeTab === "branches" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {branches.map(b => (
            <div key={b.id} className="q-card">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Building2 size={18} color="var(--brand-primary)" />
                <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: 0 }}>{b.name}</h3>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                📍 {b.address}
              </p>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                📞 Hotline: {b.phone}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: RESULTS */}
      {activeTab === "results" && (
        <div className="q-card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-light)", borderBottom: "1px solid var(--border-light)", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 1rem" }}>Học Viên</th>
                <th style={{ padding: "0.75rem 1rem" }}>Môn Thi</th>
                <th style={{ padding: "0.75rem 1rem" }}>Tổng Điểm</th>
                <th style={{ padding: "0.75rem 1rem" }}>Kết Quả</th>
                <th style={{ padding: "0.75rem 1rem" }}>Mã Chứng Chỉ</th>
                <th style={{ padding: "0.75rem 1rem" }}>Ngày Thi</th>
              </tr>
            </thead>
            <tbody>
              {examResults.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{r.userName}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{r.subjectId?.toUpperCase()}</td>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 800 }}>{r.score} / 10</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span className={`badge ${r.passed ? "badge-emerald" : "badge-rose"}`} style={{ fontSize: "0.72rem" }}>
                      {r.passed ? "ĐẠT CHUẨN" : "CHƯA ĐẠT"}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}><code>{r.certificateCode || "---"}</code></td>
                  <td style={{ padding: "0.75rem 1rem" }}>{r.completedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showExcelModal && (
        <ExcelQuestionImporter
          subjects={subjects}
          branches={branches}
          currentSubjectId={selectedSubjectId}
          onClose={() => setShowExcelModal(false)}
          onImportSuccess={() => {
            setShowExcelModal(false);
            loadAllData();
          }}
        />
      )}

      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onUserAdded={() => {
            setShowAddUserModal(false);
            loadAllData();
          }}
          defaultBranchId={currentUser.role === "branch_manager" && currentUser.branchId ? currentUser.branchId : "branch_thuduc"}
          isBranchLocked={currentUser.role === "branch_manager"}
        />
      )}

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={() => {
            setEditingUser(null);
            loadAllData();
          }}
        />
      )}

      {showQuestionModal && (
        <QuestionFormModal
          question={editingQuestion}
          onClose={() => {
            setShowQuestionModal(false);
            setEditingQuestion(null);
          }}
          onSaved={() => {
            setShowQuestionModal(false);
            setEditingQuestion(null);
            loadAllData();
          }}
        />
      )}
        </main>
      </div>
    </div>
  );
}
