"use client";

import { useState, useEffect, useMemo } from "react";
import { User, Question, PracticalProblem, PausedExamState, ExamResult } from "@/types";
import { 
  getUsers, 
  deleteUser, 
  getPausedExam, 
  clearPausedExam, 
  getCurrentUser, 
  getExamResults, 
  deleteExamResult, 
  clearExamResults,
  updateTeacherPin,
  loginUser
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

import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  BookOpen, 
  Terminal, 
  Pause, 
  Award, 
  Settings, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  Download, 
  Printer, 
  LayoutGrid,
  List,
  Sparkles,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Bot,
  Eye,
  EyeOff
} from "lucide-react";

type AdminTab = "users" | "questions" | "practicals" | "exams_monitor" | "results" | "settings";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Auth form inside admin page if not logged in (empty by default for security)
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Password visibility toggle per user ID
  const [visiblePasswordIds, setVisiblePasswordIds] = useState<string[]>([]);
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswordIds((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [practicals, setPracticals] = useState<PracticalProblem[]>([]);
  const [pausedExam, setPausedExam] = useState<PausedExamState | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  // Selection for bulk actions
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);

  // Search & Filter states
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  const [questionSearch, setQuestionSearch] = useState("");
  const [questionTypeFilter, setQuestionTypeFilter] = useState("all");

  const [practicalSearch, setPracticalSearch] = useState("");
  const [resultRankFilter, setResultRankFilter] = useState("all");

  // Modal States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [showPracticalModal, setShowPracticalModal] = useState(false);
  const [editingPractical, setEditingPractical] = useState<PracticalProblem | null>(null);

  // Settings states
  const [teacherPinInput, setTeacherPinInput] = useState("8888");
  const [aiModelSelected, setAiModelSelected] = useState("google/gemini-2.0-flash-001");

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    loadAllData();
  }, []);

  const loadAllData = () => {
    setUsers(getUsers());
    setQuestions(getQuestionsData());
    setPracticals(getPracticalsData());
    setPausedExam(getPausedExam());
    setExamResults(getExamResults());
  };

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginUser(loginUsername, loginPassword);
    if (res.success && res.user && res.user.role === "teacher") {
      setCurrentUser(res.user);
      setLoginError("");
      loadAllData();
    } else {
      setLoginError("Tài khoản hoặc mật khẩu không chính xác, hoặc không có quyền Giáo viên!");
    }
  };

  // User Actions
  const handleDeleteUser = async (id: string) => {
    if (confirm("Thầy/Cô có chắc chắn muốn xóa tài khoản học viên này không?")) {
      deleteUser(id);
      try {
        await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      } catch (e) {}
      loadAllData();
    }
  };

  const handleBulkDeleteUsers = async () => {
    if (selectedUserIds.length === 0) return;
    if (confirm(`Thầy/Cô có chắc muốn xóa ${selectedUserIds.length} tài khoản đã chọn?`)) {
      selectedUserIds.forEach((id) => deleteUser(id));
      setSelectedUserIds([]);
      loadAllData();
    }
  };

  // Question Actions
  const handleDeleteQuestion = async (id: number) => {
    if (confirm(`Thầy/Cô có chắc chắn muốn xóa câu hỏi #${id} khỏi ngân hàng câu hỏi?`)) {
      deleteQuestionData(id);
      try {
        await fetch(`/api/questions?id=${id}&target=question`, { method: "DELETE" });
      } catch (e) {}
      loadAllData();
    }
  };

  // Practical Actions
  const handleDeletePractical = async (id: number) => {
    if (confirm(`Thầy/Cô có chắc chắn muốn xóa bài thực hành #${id}?`)) {
      deletePracticalData(id);
      try {
        await fetch(`/api/questions?id=${id}&target=practical`, { method: "DELETE" });
      } catch (e) {}
      loadAllData();
    }
  };

  // Result Actions
  const handleDeleteResult = async (id: string) => {
    if (confirm("Xóa bản ghi kết quả bài thi này?")) {
      deleteExamResult(id);
      try {
        await fetch(`/api/exams?id=${id}`, { method: "DELETE" });
      } catch (e) {}
      loadAllData();
    }
  };

  const handleClearAllResults = async () => {
    if (confirm("⚠️ CẢNH BÁO: Thầy/Cô có chắc chắn muốn xóa toàn bộ lịch sử nộp bài thi?")) {
      clearExamResults();
      try {
        await fetch(`/api/exams`, { method: "DELETE" });
      } catch (e) {}
      loadAllData();
    }
  };

  const handleClearPausedExam = () => {
    if (confirm("Hủy bỏ bài thi đang tạm dừng này?")) {
      clearPausedExam();
      try {
        fetch(`/api/pause`, { method: "DELETE" });
      } catch (e) {}
      loadAllData();
    }
  };

  const handleUpdatePin = () => {
    if (teacherPinInput.trim().length < 4) {
      alert("Mã PIN phải có ít nhất 4 ký tự!");
      return;
    }
    updateTeacherPin(teacherPinInput.trim());
    alert(`✅ Đã cập nhật mã PIN giáo viên thành công: ${teacherPinInput}`);
  };

  const handleExportCSV = () => {
    if (examResults.length === 0) {
      alert("Chưa có kết quả nào để xuất báo cáo!");
      return;
    }
    const headers = "Họ và tên,Lớp,Điểm Trắc Nghiệm,Điểm Tự Luận,Tổng Điểm,Xếp Loại,Thời Gian Nộp\n";
    const rows = examResults.map(r => 
      `"${r.studentName}","${r.studentClass}",${r.mcqScore},${r.practicalScore},${r.totalScore},"${r.rank}","${r.submittedAt}"`
    ).join("\n");
    const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Bang_Diem_Python_SaoViet_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Performance Statistics (Calculated KPI metrics)
  const stats = useMemo(() => {
    const totalStudents = users.filter(u => u.role === "student").length;
    const completedCount = examResults.length;
    const avgScore = completedCount > 0 
      ? (examResults.reduce((acc, r) => acc + r.totalScore, 0) / completedCount).toFixed(1)
      : "0.0";
    const passCount = examResults.filter(r => r.totalScore >= 5.0).length;
    const passRate = completedCount > 0 ? Math.round((passCount / completedCount) * 100) : 100;

    return { totalStudents, completedCount, avgScore, passRate };
  }, [users, examResults]);

  // Filters
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.class && u.class.toLowerCase().includes(userSearch.toLowerCase()));
      const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
      return matchSearch && matchRole;
    });
  }, [users, userSearch, userRoleFilter]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch = q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
        q.explanation.toLowerCase().includes(questionSearch.toLowerCase());
      const matchType = questionTypeFilter === "all" || q.type === questionTypeFilter;
      return matchSearch && matchType;
    });
  }, [questions, questionSearch, questionTypeFilter]);

  const filteredPracticals = useMemo(() => {
    return practicals.filter((p) => {
      return p.title.toLowerCase().includes(practicalSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(practicalSearch.toLowerCase());
    });
  }, [practicals, practicalSearch]);

  const filteredResults = useMemo(() => {
    return examResults.filter((r) => {
      if (resultRankFilter === "all") return true;
      return r.rank.toLowerCase().includes(resultRankFilter.toLowerCase());
    });
  }, [examResults, resultRankFilter]);

  // If user is not logged in as teacher, display elegant login card
  if (!currentUser || currentUser.role !== "teacher") {
    return (
      <div style={{ maxWidth: "520px", margin: "3rem auto", padding: "0 1rem" }}>
        <div className="q-card" style={{ padding: "2.5rem 2rem", textAlign: "center", boxShadow: "var(--shadow-card)" }}>
          <div style={{
            width: "68px",
            height: "68px",
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.15))",
            color: "var(--brand-primary)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.2rem auto",
            border: "1px solid rgba(37, 99, 235, 0.2)"
          }}>
            <ShieldCheck size={36} />
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "0.4rem" }}>
            Cổng Quản Trị Giáo Viên
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.8rem", lineHeight: "1.5" }}>
            Vui lòng xác thực tài khoản Giáo Viên Quản Trị để truy cập toàn bộ hệ thống CRUD học liệu & bảng điểm.
          </p>

          <form onSubmit={handleInlineLogin} style={{ textAlign: "left" }}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                Tài Khoản Giáo Viên:
              </label>
              <input
                type="text"
                className="form-input"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "1.4rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
                Mật Khẩu:
              </label>
              <input
                type="password"
                className="form-input"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            {loginError && (
              <div style={{
                color: "#e11d48",
                fontSize: "0.85rem",
                marginBottom: "1.2rem",
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                padding: "0.65rem 0.9rem",
                borderRadius: "var(--radius-xs)"
              }}>
                {loginError}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block btn-lg">
              <KeyRound size={18} />
              <span>Mở Bảng Điều Khiển Quản Trị</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Top Banner Header */}
      <div className="section-hero" style={{ padding: "2.2rem 2rem", marginBottom: "1.8rem" }}>
        <div className="hero-content">
          <div className="hero-tagline">
            <ShieldCheck size={14} />
            <span>SAO VIET ENTERPRISE ADMIN DASHBOARD</span>
          </div>

          <h2 style={{ fontSize: "1.85rem", fontWeight: 900, marginBottom: "0.4rem" }}>
            Trung Tâm Khảo Thí & Quản Trị Học Liệu Python Nâng Cao
          </h2>

          <p style={{ color: "#94a3b8", fontSize: "0.95rem", maxWidth: "780px" }}>
            Toàn quyền quản lý danh sách học viên, ngân hàng 120 câu hỏi trắc nghiệm, 10 bài toán tự luận, phê duyệt bài thi tạm dừng và xuất báo cáo điểm số.
          </p>
        </div>
      </div>

      {/* KPI Stats Strip — Multi-dimensional Interactive Filters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.1rem", marginBottom: "1.8rem" }}>
        {/* KPI 1 */}
        <div 
          className="metric-card" 
          style={{ cursor: "pointer", border: activeTab === "users" ? "2px solid var(--brand-primary)" : "1px solid var(--border-light)" }}
          onClick={() => setActiveTab("users")}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Học Viên Khóa Học</span>
            <Users size={18} color="var(--brand-primary)" />
          </div>
          <div className="metric-val" style={{ color: "var(--brand-primary)" }}>{stats.totalStudents}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--brand-emerald-dark)", marginTop: "0.3rem", display: "flex", alignItems: "center", gap: "4px" }}>
            <TrendingUp size={14} />
            <span>Đang tham gia ôn tập & khảo thí</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          className="metric-card"
          style={{ cursor: "pointer", border: activeTab === "questions" ? "2px solid var(--brand-cyan)" : "1px solid var(--border-light)" }}
          onClick={() => setActiveTab("questions")}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Ngân Hàng Câu Hỏi</span>
            <BookOpen size={18} color="var(--brand-cyan)" />
          </div>
          <div className="metric-val" style={{ color: "var(--brand-cyan)" }}>{questions.length}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
            6 Dạng bài + {practicals.length} bài code tự luận
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          className="metric-card"
          style={{ cursor: "pointer", border: activeTab === "exams_monitor" ? "2px solid var(--brand-amber)" : "1px solid var(--border-light)" }}
          onClick={() => setActiveTab("exams_monitor")}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Bài Thi Tạm Dừng</span>
            <Pause size={18} color="var(--brand-amber)" />
          </div>
          <div className="metric-val" style={{ color: pausedExam ? "#ef4444" : "var(--brand-amber)" }}>
            {pausedExam ? "1 Đang Chờ" : "0"}
          </div>
          <div style={{ fontSize: "0.8rem", color: pausedExam ? "#ef4444" : "var(--brand-emerald-dark)", marginTop: "0.3rem" }}>
            {pausedExam ? "⚠️ Cần cấp mã PIN phê duyệt" : "Phòng thi đang ổn định"}
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          className="metric-card"
          style={{ cursor: "pointer", border: activeTab === "results" ? "2px solid var(--brand-emerald)" : "1px solid var(--border-light)" }}
          onClick={() => setActiveTab("results")}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Điểm TB / Tỷ Lệ Đạt</span>
            <Award size={18} color="var(--brand-emerald)" />
          </div>
          <div className="metric-val" style={{ color: "var(--brand-emerald-dark)" }}>{stats.avgScore} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/10</span></div>
          <div style={{ fontSize: "0.8rem", color: "var(--brand-emerald-dark)", marginTop: "0.3rem" }}>
            Tỷ lệ tốt nghiệp: <strong>{stats.passRate}%</strong> ({stats.completedCount} bài nộp)
          </div>
        </div>
      </div>

      {/* Main Workspace Layout (Sidebar Navigation + Workspace Canvas) */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.5rem", alignItems: "start" }}>
        
        {/* Modern Collapsible Sidebar Navigation */}
        <aside style={{
          background: "#ffffff",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-light)",
          padding: "1rem 0.8rem",
          boxShadow: "var(--shadow-subtle)",
          position: "sticky",
          top: "80px"
        }}>
          <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", padding: "0.4rem 0.8rem 0.8rem 0.8rem" }}>
            Menu Quản Trị
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <button
              className={`btn btn-block ${activeTab === "users" ? "btn-primary" : "btn-secondary"}`}
              style={{ justifyContent: "space-between", padding: "0.6rem 0.9rem", textAlign: "left" }}
              onClick={() => setActiveTab("users")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Users size={16} />
                <span>Học Viên</span>
              </div>
              <span style={{ fontSize: "0.75rem", background: activeTab === "users" ? "rgba(255,255,255,0.25)" : "#e2e8f0", padding: "2px 7px", borderRadius: "10px", fontWeight: 700 }}>
                {users.length}
              </span>
            </button>

            <button
              className={`btn btn-block ${activeTab === "questions" ? "btn-primary" : "btn-secondary"}`}
              style={{ justifyContent: "space-between", padding: "0.6rem 0.9rem", textAlign: "left" }}
              onClick={() => setActiveTab("questions")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <BookOpen size={16} />
                <span>Câu Trắc Nghiệm</span>
              </div>
              <span style={{ fontSize: "0.75rem", background: activeTab === "questions" ? "rgba(255,255,255,0.25)" : "#e2e8f0", padding: "2px 7px", borderRadius: "10px", fontWeight: 700 }}>
                {questions.length}
              </span>
            </button>

            <button
              className={`btn btn-block ${activeTab === "practicals" ? "btn-primary" : "btn-secondary"}`}
              style={{ justifyContent: "space-between", padding: "0.6rem 0.9rem", textAlign: "left" }}
              onClick={() => setActiveTab("practicals")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Terminal size={16} />
                <span>Tự Luận Code</span>
              </div>
              <span style={{ fontSize: "0.75rem", background: activeTab === "practicals" ? "rgba(255,255,255,0.25)" : "#e2e8f0", padding: "2px 7px", borderRadius: "10px", fontWeight: 700 }}>
                {practicals.length}
              </span>
            </button>

            <button
              className={`btn btn-block ${activeTab === "exams_monitor" ? "btn-primary" : "btn-secondary"}`}
              style={{ justifyContent: "space-between", padding: "0.6rem 0.9rem", textAlign: "left" }}
              onClick={() => setActiveTab("exams_monitor")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Pause size={16} />
                <span>Phòng Thi & PIN</span>
              </div>
              {pausedExam && (
                <span style={{ fontSize: "0.75rem", background: "#ef4444", color: "#fff", padding: "2px 7px", borderRadius: "10px", fontWeight: 700 }}>
                  1
                </span>
              )}
            </button>

            <button
              className={`btn btn-block ${activeTab === "results" ? "btn-primary" : "btn-secondary"}`}
              style={{ justifyContent: "space-between", padding: "0.6rem 0.9rem", textAlign: "left" }}
              onClick={() => setActiveTab("results")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Award size={16} />
                <span>Bảng Điểm Thi</span>
              </div>
              <span style={{ fontSize: "0.75rem", background: activeTab === "results" ? "rgba(255,255,255,0.25)" : "#e2e8f0", padding: "2px 7px", borderRadius: "10px", fontWeight: 700 }}>
                {examResults.length}
              </span>
            </button>

            <button
              className={`btn btn-block ${activeTab === "settings" ? "btn-primary" : "btn-secondary"}`}
              style={{ justifyContent: "space-between", padding: "0.6rem 0.9rem", textAlign: "left" }}
              onClick={() => setActiveTab("settings")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Settings size={16} />
                <span>Cấu Hình & AI</span>
              </div>
            </button>
          </div>

          <div style={{ borderTop: "1px solid var(--border-light)", marginTop: "1.2rem", paddingTop: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.4rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--brand-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem" }}>
                A
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{currentUser.fullName}</div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Quyền Quản Trị Hệ Thống</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Workspace Canvas */}
        <main>
          {/* =========================================================================
              TAB 1: USERS MANAGEMENT (CRUD)
              ========================================================================= */}
          {activeTab === "users" && (
            <div className="q-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>👥 Danh Sách Học Viên & Tài Khoản</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.86rem" }}>
                    Hiển thị {filteredUsers.length} trên tổng số {users.length} tài khoản
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Tìm tên, username, lớp..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    style={{ height: "38px", fontSize: "0.86rem", width: "190px" }}
                  />

                  <select
                    className="form-input"
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    style={{ height: "38px", fontSize: "0.86rem", width: "135px" }}
                  >
                    <option value="all">Tất cả vai trò</option>
                    <option value="student">Chỉ Học Viên</option>
                    <option value="teacher">Chỉ Giáo Viên</option>
                  </select>

                  <div style={{ display: "flex", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                    <button
                      className="btn btn-sm"
                      style={{ background: viewMode === "table" ? "var(--brand-primary)" : "#ffffff", color: viewMode === "table" ? "#fff" : "var(--text-secondary)", borderRadius: 0, padding: "0.4rem 0.6rem" }}
                      onClick={() => setViewMode("table")}
                      title="Chế độ bảng"
                    >
                      <List size={15} />
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ background: viewMode === "grid" ? "var(--brand-primary)" : "#ffffff", color: viewMode === "grid" ? "#fff" : "var(--text-secondary)", borderRadius: 0, padding: "0.4rem 0.6rem" }}
                      onClick={() => setViewMode("grid")}
                      title="Chế độ thẻ lưới"
                    >
                      <LayoutGrid size={15} />
                    </button>
                  </div>

                  <button className="btn btn-primary btn-sm" onClick={() => setShowAddUserModal(true)}>
                    <UserPlus size={15} />
                    <span>+ Thêm Học Viên</span>
                  </button>
                </div>
              </div>

              {/* Bulk Actions Toolbar */}
              {selectedUserIds.length > 0 && (
                <div style={{
                  background: "linear-gradient(135deg, #1e293b, #0f172a)",
                  color: "#fff",
                  padding: "0.75rem 1.2rem",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "var(--shadow-card)"
                }}>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>
                    Đã chọn: <span style={{ color: "var(--brand-cyan)" }}>{selectedUserIds.length}</span> học viên
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    <button className="btn btn-danger btn-sm" onClick={handleBulkDeleteUsers}>
                      <Trash2 size={14} />
                      <span>Xóa các mục đã chọn</span>
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelectedUserIds([])}>
                      Bỏ chọn
                    </button>
                  </div>
                </div>
              )}

              {/* Table or Grid View */}
              {viewMode === "table" ? (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>
                          <input
                            type="checkbox"
                            checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedUserIds(filteredUsers.map(u => u.id));
                              else setSelectedUserIds([]);
                            }}
                          />
                        </th>
                        <th>Tài Khoản (SĐT)</th>
                        <th>Họ Và Tên</th>
                        <th>Số Điện Thoại</th>
                        <th>Lớp Học</th>
                        <th>Vai Trò</th>
                        <th>Mật Khẩu Chuẩn</th>
                        <th>Mã PIN</th>
                        <th style={{ textAlign: "right" }}>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => {
                        const isSelected = selectedUserIds.includes(u.id);
                        return (
                          <tr key={u.id} style={{ background: isSelected ? "rgba(37, 99, 235, 0.05)" : undefined }}>
                            <td>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedUserIds([...selectedUserIds, u.id]);
                                  else setSelectedUserIds(selectedUserIds.filter(id => id !== u.id));
                                }}
                              />
                            </td>
                            <td>
                              <code style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand-primary)" }}>
                                {u.username}
                              </code>
                            </td>
                            <td><strong>{u.fullName}</strong></td>
                            <td>
                              {u.phone ? (
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.86rem", color: "var(--brand-emerald-dark)", fontWeight: 600 }}>
                                  {u.phone}
                                </span>
                              ) : (
                                <span style={{ color: "#94a3b8" }}>—</span>
                              )}
                            </td>
                            <td>{u.class || (u.role === 'teacher' ? 'Admin Trung Tâm' : 'Học Viên')}</td>
                            <td>
                              <span style={{
                                background: u.role === "teacher" ? "#eff6ff" : "#f1f5f9",
                                color: u.role === "teacher" ? "var(--brand-primary)" : "var(--text-secondary)",
                                padding: "2px 8px",
                                borderRadius: "var(--radius-full)",
                                fontSize: "0.76rem",
                                fontWeight: 700
                              }}>
                                {u.role === "teacher" ? "⭐ Giáo Viên" : "🎓 Học Viên"}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <code style={{ background: "#f8fafc", padding: "2px 6px", borderRadius: "4px", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                                  {visiblePasswordIds.includes(u.id) ? u.password : "••••••••"}
                                </code>
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility(u.id)}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "2px", display: "flex", alignItems: "center" }}
                                  title={visiblePasswordIds.includes(u.id) ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                  {visiblePasswordIds.includes(u.id) ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                              </div>
                            </td>
                            <td>
                              {u.role === "teacher" ? (
                                <span style={{ fontFamily: "var(--font-mono)" }}>
                                  {visiblePasswordIds.includes(u.id) ? <strong>{u.pin || "8888"}</strong> : "••••"}
                                </span>
                              ) : (
                                <span style={{ color: "#94a3b8" }}>—</span>
                              )}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }}
                                  onClick={() => setEditingUser(u)}
                                  title="Sửa thông tin"
                                >
                                  <Edit3 size={13} />
                                  <span>Sửa</span>
                                </button>

                                {u.username !== "admin" && (
                                  <button
                                    className="btn btn-danger btn-sm"
                                    style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }}
                                    onClick={() => handleDeleteUser(u.id)}
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
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="q-card" style={{ padding: "1.1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: u.role === "teacher" ? "var(--brand-primary)" : "var(--brand-cyan)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <h4 style={{ fontSize: "0.95rem", fontWeight: 800 }}>{u.fullName}</h4>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>@{u.username}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: "0.72rem", background: "#f1f5f9", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>
                          {u.role === "teacher" ? "Giáo viên" : "Học viên"}
                        </span>
                      </div>

                      <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: "1.6" }}>
                        <div>SĐT: <strong style={{ color: "var(--brand-emerald-dark)", fontFamily: "var(--font-mono)" }}>{u.phone || u.username}</strong></div>
                        <div>Lớp: <strong>{u.class || "Chưa phân lớp"}</strong></div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                          <span>Mật khẩu:</span>
                          <code>{visiblePasswordIds.includes(u.id) ? u.password : "••••••••"}</code>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(u.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "2px" }}
                          >
                            {visiblePasswordIds.includes(u.id) ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.4rem", borderTop: "1px solid var(--border-light)", paddingTop: "0.8rem" }}>
                        <button className="btn btn-secondary btn-sm btn-block" onClick={() => setEditingUser(u)}>
                          <Edit3 size={13} />
                          <span>Chỉnh sửa</span>
                        </button>
                        {u.username !== "admin" && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 2: QUESTIONS MANAGEMENT (CRUD)
              ========================================================================= */}
          {activeTab === "questions" && (
            <div className="q-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>📚 Ngân Hàng Câu Hỏi Trắc Nghiệm ({questions.length})</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.86rem" }}>
                    Quản lý toàn bộ 6 dạng bài tập trắc nghiệm và câu hỏi khảo thí
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Tìm câu hỏi, lời giải..."
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    style={{ height: "38px", fontSize: "0.86rem", width: "200px" }}
                  />

                  <select
                    className="form-input"
                    value={questionTypeFilter}
                    onChange={(e) => setQuestionTypeFilter(e.target.value)}
                    style={{ height: "38px", fontSize: "0.86rem", width: "165px" }}
                  >
                    <option value="all">Tất cả 6 dạng bài</option>
                    <option value="single_choice">1. Trắc nghiệm ABCD</option>
                    <option value="true_false">2. Đúng / Sai</option>
                    <option value="multiple_choice">3. Nhiều đáp án</option>
                    <option value="fill_blank">4. Điền từ</option>
                    <option value="sequence_order">5. Sắp xếp thứ tự</option>
                    <option value="matching">6. Ghép cặp</option>
                  </select>

                  <button className="btn btn-primary btn-sm" onClick={() => {
                    setEditingQuestion(null);
                    setShowQuestionModal(true);
                  }}>
                    <Plus size={15} />
                    <span>+ Thêm Câu Hỏi</span>
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                {filteredQuestions.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      background: "#ffffff",
                      border: "1px solid var(--border-light)",
                      borderRadius: "var(--radius-md)",
                      padding: "1.1rem 1.3rem",
                      boxShadow: "var(--shadow-subtle)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem"
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                        <span className="q-badge" style={{ fontSize: "0.72rem" }}>
                          CÂU #{q.id} • {q.type_name}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.98rem", marginBottom: "0.5rem" }}>
                        {q.question}
                      </div>
                      <div style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                        <strong>💡 Phân tích logic:</strong> {q.explanation}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setEditingQuestion(q);
                          setShowQuestionModal(true);
                        }}
                      >
                        <Edit3 size={14} />
                        <span>Sửa</span>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteQuestion(q.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: PRACTICAL PROBLEMS MANAGEMENT (CRUD)
              ========================================================================= */}
          {activeTab === "practicals" && (
            <div className="q-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>💻 Kho Bài Tập Tự Luận Thuật Toán ({practicals.length})</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.86rem" }}>
                    Các bài toán viết hàm chấm điểm tự động trong phòng thi trực tuyến IDE
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Tìm bài thực hành..."
                    value={practicalSearch}
                    onChange={(e) => setPracticalSearch(e.target.value)}
                    style={{ height: "38px", fontSize: "0.86rem", width: "200px" }}
                  />

                  <button className="btn btn-success btn-sm" onClick={() => {
                    setEditingPractical(null);
                    setShowPracticalModal(true);
                  }}>
                    <Plus size={15} />
                    <span>+ Thêm Bài Thực Hành</span>
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {filteredPracticals.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: "#ffffff",
                      border: "1px solid var(--border-light)",
                      borderRadius: "var(--radius-md)",
                      padding: "1.2rem",
                      boxShadow: "var(--shadow-subtle)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                      <div>
                        <span className="q-badge" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--brand-emerald-dark)", borderColor: "rgba(16, 185, 129, 0.25)", marginBottom: "0.3rem" }}>
                          BÀI TỰ LUẬN #{p.id}
                        </span>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 800, marginTop: "0.2rem" }}>{p.title}</h4>
                      </div>

                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingPractical(p);
                            setShowPracticalModal(true);
                          }}
                        >
                          <Edit3 size={14} />
                          <span>Sửa</span>
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeletePractical(p.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.8rem" }}>
                      {p.description}
                    </p>

                    <div style={{ background: "#090d16", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", color: "#38bdf8", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                      <pre style={{ margin: 0, overflowX: "auto" }}>{p.starter_code}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: EXAM MONITOR & PAUSED SESSIONS
              ========================================================================= */}
          {activeTab === "exams_monitor" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              <div className="q-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Pause size={20} color="var(--brand-amber)" />
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>Bài Thi Đang Tạm Dừng</h3>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={loadAllData} title="Làm mới">
                    <RefreshCw size={14} />
                  </button>
                </div>

                {pausedExam ? (
                  <div style={{
                    background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                    border: "1px solid #fde68a",
                    padding: "1.4rem",
                    borderRadius: "var(--radius-md)"
                  }}>
                    <h4 style={{ color: "#92400e", marginBottom: "0.4rem", fontWeight: 800, fontSize: "1.05rem" }}>
                      📌 Thí sinh: {pausedExam.userName} ({pausedExam.userId})
                    </h4>
                    <p style={{ fontSize: "0.88rem", color: "#78350f", marginBottom: "1.2rem", lineHeight: "1.6" }}>
                      Thời điểm lưu: <strong>{pausedExam.timestamp}</strong><br />
                      Thời gian còn lại: <strong>{Math.floor(pausedExam.timerSeconds / 60)} phút {pausedExam.timerSeconds % 60} giây</strong><br />
                      Đang làm: {pausedExam.examPart === 1 ? `Phần 1 (Câu ${pausedExam.currentQuestionIndex + 1}/50)` : `Phần 2 (Bài ${pausedExam.currentQuestionIndex + 1}/4)`}
                    </p>

                    <div style={{ display: "flex", gap: "0.6rem" }}>
                      <button
                        className="btn btn-success btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => alert(`Mã PIN mở khóa phê duyệt cho học viên ${pausedExam.userName} là: ${currentUser.pin || "8888"}`)}
                      >
                        <KeyRound size={15} />
                        <span>Cấp PIN ({currentUser.pin || "8888"})</span>
                      </button>

                      <button className="btn btn-danger btn-sm" onClick={handleClearPausedExam}>
                        <Trash2 size={15} />
                        <span>Hủy Bài Này</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                    <CheckCircle2 size={36} color="var(--brand-emerald)" style={{ margin: "0 auto 0.6rem auto", display: "block" }} />
                    <h4 style={{ fontWeight: 700, marginBottom: "0.2rem" }}>Phòng Thi Ổn Định</h4>
                    <p style={{ fontSize: "0.88rem" }}>Hiện không có thí sinh nào đang tạm dừng bài thi.</p>
                  </div>
                )}
              </div>

              <div className="q-card">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
                  <KeyRound size={20} color="var(--brand-primary)" />
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>Đổi Mã PIN Giáo Viên</h3>
                </div>

                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1.2rem" }}>
                  Mã PIN này được dùng để phê duyệt cho học sinh tiếp tục làm bài sau khi tạm dừng trong phòng thi.
                </p>

                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--text-secondary)" }}>
                    Mã PIN Giáo Viên Mới:
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={teacherPinInput}
                    onChange={(e) => setTeacherPinInput(e.target.value)}
                    maxLength={6}
                    style={{ fontSize: "1.3rem", letterSpacing: "4px", fontWeight: 800, textAlign: "center" }}
                  />
                </div>

                <button className="btn btn-primary btn-block" onClick={handleUpdatePin}>
                  <CheckCircle2 size={16} />
                  <span>Cập Nhật Mã PIN</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: GRADING RESULTS & EXPORT (CRUD)
              ========================================================================= */}
          {activeTab === "results" && (
            <div className="q-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>📊 Lịch Sử Nộp Bài & Bảng Điểm Tốt Nghiệp ({examResults.length})</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.86rem" }}>
                    Tổng hợp kết quả đánh giá 50 câu trắc nghiệm và 4 câu tự luận thực hành
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                  <select
                    className="form-input"
                    value={resultRankFilter}
                    onChange={(e) => setResultRankFilter(e.target.value)}
                    style={{ height: "38px", fontSize: "0.86rem", width: "160px" }}
                  >
                    <option value="all">Tất cả xếp loại</option>
                    <option value="XUẤT SẮC">Xuất Sắc (≥ 9.0)</option>
                    <option value="GIỎI">Giỏi (≥ 8.0)</option>
                    <option value="KHÁ">Khá (≥ 6.5)</option>
                    <option value="TRUNG BÌNH">Trung Bình (≥ 5.0)</option>
                  </select>

                  <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
                    <Download size={15} />
                    <span>Xuất File CSV</span>
                  </button>

                  <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                    <Printer size={15} />
                    <span>In Bảng Điểm</span>
                  </button>

                  {examResults.length > 0 && (
                    <button className="btn btn-danger btn-sm" onClick={handleClearAllResults}>
                      <Trash2 size={15} />
                      <span>Xóa Tất Cả</span>
                    </button>
                  )}
                </div>
              </div>

              {filteredResults.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", textAlign: "center", padding: "3rem" }}>
                  Chưa có kết quả bài thi nào trong hệ thống.
                </p>
              ) : (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Học Viên</th>
                        <th>Lớp Học</th>
                        <th>Trắc Nghiệm (5.0đ)</th>
                        <th>Tự Luận Code (5.0đ)</th>
                        <th>Tổng Điểm</th>
                        <th>Xếp Loại</th>
                        <th>Thời Gian Nộp</th>
                        <th style={{ textAlign: "right" }}>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map((r) => (
                        <tr key={r.id}>
                          <td><strong>{r.studentName}</strong></td>
                          <td>{r.studentClass}</td>
                          <td>{r.mcqCorrect}/50 ({r.mcqScore}đ)</td>
                          <td>{r.practicalScore} / 5.0đ</td>
                          <td>
                            <strong style={{ color: "var(--brand-primary)", fontSize: "1.1rem" }}>
                              {r.totalScore} / 10
                            </strong>
                          </td>
                          <td>
                            <span style={{
                              background: r.totalScore >= 8.0 ? "#ecfdf5" : r.totalScore >= 5.0 ? "#eff6ff" : "#fff1f2",
                              color: r.totalScore >= 8.0 ? "#047857" : r.totalScore >= 5.0 ? "#1d4ed8" : "#be123c",
                              border: `1px solid ${r.totalScore >= 8.0 ? "#a7f3d0" : r.totalScore >= 5.0 ? "#bfdbfe" : "#fecdd3"}`,
                              padding: "2px 8px",
                              borderRadius: "var(--radius-full)",
                              fontSize: "0.76rem",
                              fontWeight: 800
                            }}>
                              {r.rank}
                            </span>
                          </td>
                          <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{r.submittedAt}</td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className="btn btn-danger btn-sm"
                              style={{ padding: "0.25rem 0.5rem" }}
                              onClick={() => handleDeleteResult(r.id)}
                              title="Xóa kết quả này"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 6: SETTINGS & AI ENGINE
              ========================================================================= */}
          {activeTab === "settings" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              <div className="q-card">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
                  <Bot size={20} color="var(--brand-primary)" />
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>Cấu Hình Trợ Lý AI Chữa Bài</h3>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--text-secondary)" }}>
                    Mô Hình AI (OpenRouter Engine):
                  </label>
                  <select
                    className="form-input"
                    value={aiModelSelected}
                    onChange={(e) => setAiModelSelected(e.target.value)}
                  >
                    <option value="google/gemini-2.0-flash-001">Google Gemini 2.0 Flash (Khuyên dùng - Nhanh & Chính xác)</option>
                    <option value="google/gemini-pro-1.5">Google Gemini 1.5 Pro</option>
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
                  </select>
                </div>

                <div style={{ background: "var(--surface-subtle)", padding: "0.9rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)", fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "1.2rem" }}>
                  Trợ lý AI tự động giảng giải phương pháp logic cho 120 câu hỏi trắc nghiệm và tìm lỗi cú pháp trong code Python của học viên.
                </div>

                <button className="btn btn-primary" onClick={() => alert("✅ Đã lưu cấu hình AI!")}>
                  <CheckCircle2 size={16} />
                  <span>Lưu Cấu Hình AI</span>
                </button>
              </div>

              <div className="q-card">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
                  <GraduationCap size={20} color="var(--brand-emerald-dark)" />
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>Thông Tin Đơn Vị Đào Tạo</h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "0.9rem" }}>
                  <div>
                    <strong>Đơn vị:</strong> Trung Tâm Tin Học Sao Việt
                  </div>
                  <div>
                    <strong>Chi nhánh:</strong> TP. Thủ Đức, TP. Hồ Chí Minh
                  </div>
                  <div>
                    <strong>Khóa học:</strong> Lập Trình Python Nâng Cao (Thực Chiến & Chứng Chỉ)
                  </div>
                  <div>
                    <strong>Thời lượng bài thi:</strong> 90 Phút (50 phút TN + 40 phút TL)
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onUserAdded={loadAllData}
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
          onClose={() => {
            setShowQuestionModal(false);
            setEditingQuestion(null);
          }}
          onSaved={loadAllData}
        />
      )}

      {showPracticalModal && (
        <PracticalFormModal
          problem={editingPractical}
          onClose={() => {
            setShowPracticalModal(false);
            setEditingPractical(null);
          }}
          onSaved={loadAllData}
        />
      )}
    </div>
  );
}
