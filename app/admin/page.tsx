"use client";

import { useState, useEffect, useMemo } from "react";
import { User, Question, PracticalProblem, PausedExamState, ExamResult, Branch, Subject } from "@/types";
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
  loginUser,
  getBranches,
  saveBranches,
  getSubjects,
  saveSubjects,
  addUser,
  formatStudyDuration
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
  EyeOff,
  Building2,
  Code2,
  Layers,
  Upload,
  Filter,
  Check,
  X
} from "lucide-react";

type AdminTab = "overview" | "branches" | "subjects" | "questions" | "practicals" | "users" | "exams_monitor" | "results" | "settings";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("questions");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Auth form inside admin page if not logged in
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
  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [practicals, setPracticals] = useState<PracticalProblem[]>([]);
  const [pausedExam, setPausedExam] = useState<PausedExamState | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  // Selection for bulk actions
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);

  // Search & Filter states
  const [selectedSubjectId, setSelectedSubjectId] = useState("python_advanced");
  const [selectedBranchId, setSelectedBranchId] = useState("all");

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userBranchFilter, setUserBranchFilter] = useState("all");

  const [questionSearch, setQuestionSearch] = useState("");
  const [questionTypeFilter, setQuestionTypeFilter] = useState("all");
  const [practicalSearch, setPracticalSearch] = useState("");
  const [resultRankFilter, setResultRankFilter] = useState("all");

  // Modals
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

  // Settings states
  const [teacherPinInput, setTeacherPinInput] = useState("8888");

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    loadAllData();
  }, []);

  const loadAllData = async () => {
    // 1. Load Local
    setBranches(getBranches());
    setSubjects(getSubjects());
    setUsers(getUsers());
    setQuestions(getQuestionsData());
    setPracticals(getPracticalsData());
    setPausedExam(getPausedExam());
    setExamResults(getExamResults());

    // 2. Sync from MongoDB Atlas
    try {
      const [resB, resS, resQ, resU, resE] = await Promise.all([
        fetch("/api/branches").then(r => r.json()).catch(() => null),
        fetch("/api/subjects").then(r => r.json()).catch(() => null),
        fetch("/api/questions").then(r => r.json()).catch(() => null),
        fetch("/api/users").then(r => r.json()).catch(() => null),
        fetch("/api/exams").then(r => r.json()).catch(() => null)
      ]);

      if (resB?.success && resB.branches?.length > 0) {
        setBranches(resB.branches);
        saveBranches(resB.branches);
      }
      if (resS?.success && resS.subjects?.length > 0) {
        setSubjects(resS.subjects);
        saveSubjects(resS.subjects);
      }
      if (resQ?.success && resQ.questions?.length > 0) {
        setQuestions(resQ.questions);
      }
      if (resU?.success && resU.users?.length > 0) {
        setUsers(resU.users);
      }
      if (resE?.success && resE.results?.length > 0) {
        setExamResults(resE.results);
      }
    } catch (err) {
      console.log("Local fallback mode:", err);
    }
  };

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginUser(loginUsername, loginPassword);
    if (res.success && res.user && (res.user.role === "admin" || res.user.role === "branch_manager" || res.user.role === "teacher")) {
      setCurrentUser(res.user);
      setLoginError("");
      loadAllData();
    } else {
      setLoginError("Tài khoản hoặc mật khẩu không chính xác, hoặc không có quyền Quản trị / Giáo viên!");
    }
  };

  // Branch CRUD
  const handleSaveBranch = async (branchData: Partial<Branch>) => {
    try {
      if (branchData.id && branches.some(b => b.id === branchData.id)) {
        // Update
        await fetch("/api/branches", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(branchData)
        });
      } else {
        // Create
        await fetch("/api/branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(branchData)
        });
      }
      setShowBranchModal(false);
      setEditingBranch(null);
      loadAllData();
    } catch (e: any) {
      alert("Lỗi lưu chi nhánh: " + e.message);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (confirm("Thầy/Cô có chắc chắn muốn xóa chi nhánh này?")) {
      try {
        await fetch(`/api/branches?id=${id}`, { method: "DELETE" });
        loadAllData();
      } catch (e: any) {
        alert("Lỗi xóa chi nhánh: " + e.message);
      }
    }
  };

  // Subject CRUD
  const handleSaveSubject = async (subjectData: Partial<Subject>) => {
    try {
      if (subjectData.id && subjects.some(s => s.id === subjectData.id)) {
        await fetch("/api/subjects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subjectData)
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
    } catch (e: any) {
      alert("Lỗi lưu môn học: " + e.message);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (confirm("Thầy/Cô có chắc muốn xóa môn học này?")) {
      try {
        await fetch(`/api/subjects?id=${id}`, { method: "DELETE" });
        loadAllData();
      } catch (e: any) {
        alert("Lỗi xóa môn học: " + e.message);
      }
    }
  };

  // User Actions
  const handleDeleteUser = async (id: string) => {
    if (confirm("Thầy/Cô có chắc chắn muốn xóa tài khoản này không?")) {
      deleteUser(id);
      try {
        await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      } catch (e) {}
      loadAllData();
    }
  };

  // Question Actions
  const handleDeleteQuestion = async (id: number) => {
    if (confirm(`Thầy/Cô có chắc chắn muốn xóa câu hỏi #${id}?`)) {
      deleteQuestionData(id);
      try {
        await fetch(`/api/questions?id=${id}&target=question`, { method: "DELETE" });
      } catch (e) {}
      loadAllData();
    }
  };

  // Export Excel
  const handleExportQuestionsExcel = () => {
    window.open(`/api/questions/export-excel?subjectId=${selectedSubjectId}&branchId=${selectedBranchId}`, "_blank");
  };

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchSubject = !selectedSubjectId || selectedSubjectId === "all" || q.subjectId === selectedSubjectId || (!q.subjectId && selectedSubjectId === "python_advanced");
      const matchBranch = selectedBranchId === "all" || !q.branchId || q.branchId === "all" || q.branchId === selectedBranchId;
      const matchSearch = !questionSearch || 
        q.question.toLowerCase().includes(questionSearch.toLowerCase()) || 
        q.explanation.toLowerCase().includes(questionSearch.toLowerCase()) ||
        String(q.id).includes(questionSearch);
      const matchType = questionTypeFilter === "all" || q.type === questionTypeFilter;

      return matchSubject && matchBranch && matchSearch && matchType;
    });
  }, [questions, selectedSubjectId, selectedBranchId, questionSearch, questionTypeFilter]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !userSearch || 
        u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.phone && u.phone.includes(userSearch));
      const matchRole = userRoleFilter === "all" || u.role === userRoleFilter || (userRoleFilter === "teacher" && (u.role === "admin" || u.role === "branch_manager"));
      const matchBranch = userBranchFilter === "all" || u.branchId === userBranchFilter;

      return matchSearch && matchRole && matchBranch;
    });
  }, [users, userSearch, userRoleFilter, userBranchFilter]);

  // Calculated Stats
  const stats = useMemo(() => {
    const totalStudents = users.filter(u => u.role === "student").length;
    const totalBranches = branches.length;
    const totalSubjects = subjects.length;
    const completedCount = examResults.length;
    const avgScore = completedCount > 0 
      ? (examResults.reduce((acc, r) => acc + r.totalScore, 0) / completedCount).toFixed(1)
      : "0.0";
    const passCount = examResults.filter(r => r.totalScore >= 5.0).length;
    const passRate = completedCount > 0 ? ((passCount / completedCount) * 100).toFixed(0) : "0";

    return {
      totalStudents,
      totalBranches,
      totalSubjects,
      totalQuestions: questions.length,
      completedCount,
      avgScore,
      passRate
    };
  }, [users, branches, subjects, questions, examResults]);

  // Nếu chưa đăng nhập quyền Admin/Giáo viên, hiển thị màn hình khóa
  const isAuthorized = currentUser && (currentUser.role === "admin" || currentUser.role === "branch_manager" || currentUser.role === "teacher");

  if (!isAuthorized) {
    return (
      <div style={{ maxWidth: "480px", margin: "4rem auto", padding: "0 1rem" }}>
        <div className="q-card" style={{ textAlign: "center", padding: "2.5rem 2rem" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem", color: "var(--brand-amber)" }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}>Khu Vực Quản Trị Hệ Thống</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.8rem" }}>
            Vui lòng đăng nhập với tài khoản <strong>Tổng Quản Trị (Admin)</strong> hoặc <strong>Quản Lý Chi Nhánh</strong> để truy cập.
          </p>

          <form onSubmit={handleInlineLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
            {loginError && (
              <div style={{ padding: "0.75rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "var(--radius-md)", color: "#b91c1c", fontSize: "0.85rem" }}>
                {loginError}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Tên Đăng Nhập / Mã Quản Lý:
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="VD: admin hoặc quanly_thuduc"
                className="input"
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Mật Khẩu Quản Trị:
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Mật khẩu bảo mật"
                className="input"
                style={{ width: "100%" }}
              />
            </div>

            <button type="submit" className="btn btn-warning btn-block btn-lg" style={{ marginTop: "0.5rem" }}>
              <ShieldCheck size={18} />
              <span>Đăng Nhập Quản Trị</span>
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-light)", paddingTop: "1rem" }}>
            Hệ thống xác thực quản trị viên bảo mật. Liên hệ ban giám đốc trung tâm để được cấp quyền truy cập.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 0.5rem" }}>
      {/* Top Banner & User Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
            <span className="badge badge-warning" style={{ fontSize: "0.78rem" }}>
              {currentUser.role === "admin" ? "👑 TỔNG QUẢN TRỊ (ADMIN)" : `🏫 QUẢN LÝ: ${currentUser.branchName || "Chi Nhánh"}`}
            </span>
            <span style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
              Hệ Thống Đào Tạo & Khảo Thí Lập Trình — Tin Học Sao Việt
            </span>
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.5px", margin: 0 }}>
            Bảng Điều Khiển Quản Trị & Khảo Thí
          </h1>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <button onClick={loadAllData} className="btn btn-secondary btn-sm" title="Làm mới dữ liệu từ MongoDB">
            <RefreshCw size={15} />
            <span>Làm Mới Data</span>
          </button>
          <button onClick={() => setShowExcelModal(true)} className="btn btn-primary btn-sm" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-emerald))" }}>
            <FileSpreadsheet size={15} />
            <span>📥 Nhập Câu Hỏi Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.85rem", marginBottom: "1.5rem" }}>
        <div className="q-card" style={{ padding: "1rem 1.2rem", borderLeft: "4px solid var(--brand-primary)" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Chi Nhánh</div>
          <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "var(--brand-primary)", marginTop: "0.2rem" }}>{stats.totalBranches}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>Cơ sở hoạt động</div>
        </div>

        <div className="q-card" style={{ padding: "1rem 1.2rem", borderLeft: "4px solid var(--brand-violet)" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Môn Học</div>
          <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "var(--brand-violet)", marginTop: "0.2rem" }}>{stats.totalSubjects}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>Ngôn ngữ đào tạo</div>
        </div>

        <div className="q-card" style={{ padding: "1rem 1.2rem", borderLeft: "4px solid var(--brand-emerald)" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Học Viên</div>
          <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "var(--brand-emerald)", marginTop: "0.2rem" }}>{stats.totalStudents}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>Tài khoản đang học</div>
        </div>

        <div className="q-card" style={{ padding: "1rem 1.2rem", borderLeft: "4px solid var(--brand-amber)" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Ngân Hàng Đề</div>
          <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "var(--brand-amber)", marginTop: "0.2rem" }}>{stats.totalQuestions}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>Câu hỏi 6 dạng</div>
        </div>

        <div className="q-card" style={{ padding: "1rem 1.2rem", borderLeft: "4px solid #ec4899" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Tỷ Lệ Đậu</div>
          <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "#ec4899", marginTop: "0.2rem" }}>{stats.passRate}%</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>Điểm TB: {stats.avgScore}/10</div>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div style={{ display: "flex", gap: "0.4rem", borderBottom: "2px solid var(--border-light)", paddingBottom: "0.5rem", marginBottom: "1.5rem", overflowX: "auto" }}>
        {currentUser.role === "admin" && (
          <>
            <button
              onClick={() => setActiveTab("branches")}
              className={`btn btn-sm ${activeTab === "branches" ? "btn-primary" : "btn-secondary"}`}
            >
              <Building2 size={15} />
              <span>🏢 Quản Lý Chi Nhánh ({branches.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("subjects")}
              className={`btn btn-sm ${activeTab === "subjects" ? "btn-primary" : "btn-secondary"}`}
            >
              <BookOpen size={15} />
              <span>📚 Danh Mục Môn Học ({subjects.length})</span>
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab("questions")}
          className={`btn btn-sm ${activeTab === "questions" ? "btn-primary" : "btn-secondary"}`}
        >
          <Layers size={15} />
          <span>❓ Ngân Hàng Câu Hỏi ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("practicals")}
          className={`btn btn-sm ${activeTab === "practicals" ? "btn-primary" : "btn-secondary"}`}
        >
          <Terminal size={15} />
          <span>💻 Bài Thực Hành IDE ({practicals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`btn btn-sm ${activeTab === "users" ? "btn-primary" : "btn-secondary"}`}
        >
          <Users size={15} />
          <span>👥 Quản Lý Người Dùng ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("exams_monitor")}
          className={`btn btn-sm ${activeTab === "exams_monitor" ? "btn-primary" : "btn-secondary"}`}
        >
          <Pause size={15} />
          <span>⏱️ Giám Sát Phòng Thi</span>
        </button>

        <button
          onClick={() => setActiveTab("results")}
          className={`btn btn-sm ${activeTab === "results" ? "btn-primary" : "btn-secondary"}`}
        >
          <Award size={15} />
          <span>🏆 Sổ Bảng Điểm ({examResults.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`btn btn-sm ${activeTab === "settings" ? "btn-primary" : "btn-secondary"}`}
        >
          <Settings size={15} />
          <span>⚙️ Cài Đặt Hệ Thống</span>
        </button>
      </div>

      {/* TAB 1: QUẢN LÝ CHI NHÁNH */}
      {activeTab === "branches" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Danh Sách Chi Nhánh Trung Tâm</h2>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: 0 }}>
                Quản lý các cơ sở đào tạo, cấp mã PIN giáo viên và phân quyền dữ liệu theo chi nhánh.
              </p>
            </div>
            <button onClick={() => { setEditingBranch(null); setShowBranchModal(true); }} className="btn btn-primary btn-sm">
              <Plus size={15} />
              <span>Thêm Chi Nhánh Mới</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {branches.map(b => (
              <div key={b.id} className="q-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <div>
                      <span className="badge badge-primary" style={{ fontSize: "0.72rem", marginBottom: "0.3rem", display: "inline-block" }}>
                        Mã: {b.code}
                      </span>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>{b.name}</h3>
                    </div>
                    <div style={{ display: "flex", gap: "0.3rem" }}>
                      <button onClick={() => { setEditingBranch(b); setShowBranchModal(true); }} className="btn btn-secondary btn-sm" style={{ padding: "0.3rem" }}>
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDeleteBranch(b.id)} className="btn btn-danger btn-sm" style={{ padding: "0.3rem" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    📍 {b.address}
                  </p>
                  <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    📞 Hotline: {b.phone || "Chưa cập nhật"}
                  </p>
                  <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "0.8rem" }}>
                    👤 Phụ trách: <strong>{b.managerName || "Giáo viên chi nhánh"}</strong>
                  </p>
                </div>

                <div style={{ background: "var(--bg-light)", padding: "0.6rem 0.8rem", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem" }}>
                  <span>Mã PIN mở khóa:</span>
                  <span style={{ fontWeight: 800, letterSpacing: "2px", color: "var(--brand-emerald-dark)" }}>
                    {b.defaultTeacherPin || "8888"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DANH MỤC MÔN HỌC */}
      {activeTab === "subjects" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Danh Mục Môn Học & Ngôn Ngữ Lập Trình</h2>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: 0 }}>
                Hỗ trợ đa ngôn ngữ (Python, C++, Java, Web, ASP.NET) với môi trường thực thi chuyên biệt.
              </p>
            </div>
            <button onClick={() => { setEditingSubject(null); setShowSubjectModal(true); }} className="btn btn-primary btn-sm">
              <Plus size={15} />
              <span>Thêm Môn Học Mới</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {subjects.map(s => (
              <div key={s.id} className="q-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ padding: "0.4rem", background: "rgba(37, 99, 235, 0.1)", borderRadius: "var(--radius-md)", color: "var(--brand-primary)" }}>
                        <Code2 size={20} />
                      </div>
                      <div>
                        <span className="badge badge-primary" style={{ fontSize: "0.72rem" }}>{s.code}</span>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0.2rem 0 0" }}>{s.name}</h3>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.3rem" }}>
                      <button onClick={() => { setEditingSubject(s); setShowSubjectModal(true); }} className="btn btn-secondary btn-sm" style={{ padding: "0.3rem" }}>
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDeleteSubject(s.id)} className="btn btn-danger btn-sm" style={{ padding: "0.3rem" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: "0.5rem 0" }}>
                    {s.description}
                  </p>
                </div>

                <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "0.6rem", display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span>Runtime: <code>{s.runtime}</code></span>
                  <span>Chương: <strong>{s.totalModules} bài</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NGÂN HÀNG CÂU HỎI & EXCEL IMPORT/EXPORT */}
      {activeTab === "questions" && (
        <div>
          {/* Action Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.8rem" }}>
            {/* Filter Subjects & Branches */}
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
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="input"
                style={{ fontWeight: 600, fontSize: "0.85rem" }}
              >
                <option value="all">🏢 Toàn Hệ Thống (Ngân hàng chung)</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>🏢 {b.name}</option>
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
                <option value="matching">Nối cặp / Ghép quy trình</option>
              </select>
            </div>

            {/* Excel & Create Buttons */}
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
                title="Xuất câu hỏi ra file Excel .xlsx"
              >
                <Download size={15} />
                <span>📤 Xuất Ra Excel</span>
              </button>

              <button
                onClick={() => { setEditingQuestion(null); setShowQuestionModal(true); }}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={15} />
                <span>Thêm Câu Thủ Công</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              value={questionSearch}
              onChange={(e) => setQuestionSearch(e.target.value)}
              placeholder="🔍 Tìm kiếm câu hỏi theo nội dung, mã ID hoặc giải thích..."
              className="input"
              style={{ width: "100%" }}
            />
          </div>

          {/* Table List */}
          <div className="q-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "0.8rem 1.2rem", background: "var(--bg-light)", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: 700 }}>
                Hiển thị {filteredQuestions.length} / {questions.length} câu hỏi
              </span>
            </div>

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

      {/* TAB 4: QUẢN LÝ NGƯỜI DÙNG 3 ROLES */}
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
                <option value="admin">👑 Tổng Quản Trị (Admin)</option>
                <option value="branch_manager">🏫 Quản Lý Chi Nhánh</option>
                <option value="student">🎓 Học Viên</option>
              </select>

              <select
                value={userBranchFilter}
                onChange={(e) => setUserBranchFilter(e.target.value)}
                className="input"
                style={{ fontSize: "0.85rem" }}
              >
                <option value="all">🏢 Tất Cả Chi Nhánh</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <button onClick={() => setShowAddUserModal(true)} className="btn btn-primary btn-sm">
              <UserPlus size={15} />
              <span>Cấp Tài Khoản Mới</span>
            </button>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="🔍 Tìm kiếm học viên theo họ tên, số điện thoại, lớp học..."
              className="input"
              style={{ width: "100%" }}
            />
          </div>

          <div className="q-card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "var(--bg-light)", borderBottom: "1px solid var(--border-light)", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem 1rem" }}>Họ Và Tên</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Tên Đăng Nhập</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Vai Trò</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Chi Nhánh / Lớp</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Thời Lượng Học</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Mật Khẩu</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{u.fullName}</td>
                    <td style={{ padding: "0.75rem 1rem" }}><code>{u.username}</code></td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span className={`badge ${u.role === "admin" ? "badge-warning" : u.role === "branch_manager" ? "badge-primary" : "badge-emerald"}`} style={{ fontSize: "0.72rem" }}>
                        {u.role === "admin" ? "Admin" : u.role === "branch_manager" ? "Quản Lý Chi Nhánh" : "Học Viên"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "var(--text-secondary)" }}>
                      {u.branchName || "Chi Nhánh Thủ Đức"} • {u.class || "Khóa 26"}
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

      {/* TAB 5: GIÁM SÁT PHÒNG THI & KẾT QUẢ */}
      {activeTab === "exams_monitor" && (
        <div>
          <div className="q-card" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              Trạng Thái Phòng Thi & Bài Thi Đang Tạm Dừng
            </h3>
            {pausedExam ? (
              <div style={{ padding: "1rem", background: "rgba(245, 158, 11, 0.1)", border: "1px solid var(--brand-amber)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 800 }}>Học viên: {pausedExam.userName}</h4>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Thời gian tạm dừng: {pausedExam.timestamp} • Phần thi: {pausedExam.examPart === 1 ? "Trắc nghiệm" : "Tự luận"} • Thời gian còn lại: {Math.floor(pausedExam.timerSeconds / 60)} phút {pausedExam.timerSeconds % 60} giây
                    </p>
                  </div>
                  <button onClick={() => { clearPausedExam(); loadAllData(); }} className="btn btn-danger btn-sm">
                    Hủy Bài Tạm Dừng
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                Hiện tại không có học viên nào đang tạm dừng bài thi.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: SỔ BẢNG ĐIỂM */}
      {activeTab === "results" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>Lịch Sử Nộp Bài & Phổ Điểm</h3>
            <button
              onClick={() => {
                if (confirm("Xóa toàn bộ lịch sử bảng điểm?")) {
                  clearExamResults();
                  loadAllData();
                }
              }}
              className="btn btn-danger btn-sm"
            >
              Xóa Toàn Bộ Lịch Sử
            </button>
          </div>

          <div className="q-card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "var(--bg-light)", borderBottom: "1px solid var(--border-light)", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem 1rem" }}>Học Viên</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Lớp</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Điểm TN (Thang 10)</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Điểm TL (Thang 10)</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Tổng Điểm</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Xếp Loại</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Thời Gian Nộp</th>
                </tr>
              </thead>
              <tbody>
                {examResults.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{r.studentName}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>{r.studentClass}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>{r.mcqScore}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>{r.practicalScore}</td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 800, color: r.totalScore >= 8 ? "var(--brand-emerald-dark)" : r.totalScore >= 5 ? "var(--brand-primary)" : "#dc2626" }}>
                      {r.totalScore}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span className="badge badge-primary">{r.rank}</span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {r.submittedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: CÀI ĐẶT HỆ THỐNG */}
      {activeTab === "settings" && (
        <div className="q-card" style={{ maxWidth: "600px" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem" }}>
            Cấu Hình & Mã PIN Giáo Viên
          </h3>

          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
              Mã PIN Phê Duyệt Mở Khóa Bài Thi Tạm Dừng:
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={teacherPinInput}
                onChange={(e) => setTeacherPinInput(e.target.value)}
                className="input"
                style={{ width: "160px", fontWeight: 800, letterSpacing: "2px", fontSize: "1.1rem" }}
              />
              <button
                onClick={() => {
                  updateTeacherPin(teacherPinInput);
                  alert("✅ Đã cập nhật mã PIN giáo viên: " + teacherPinInput);
                }}
                className="btn btn-primary"
              >
                Lưu Mã PIN
              </button>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
              Giáo viên dùng mã PIN này để mở khóa bài thi khi học sinh tạm dừng và xin làm tiếp.
            </p>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showExcelModal && (
        <ExcelQuestionImporter
          subjects={subjects}
          branches={branches}
          currentSubjectId={selectedSubjectId}
          onImportSuccess={(count) => {
            loadAllData();
          }}
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

      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onUserAdded={() => { setShowAddUserModal(false); loadAllData(); }}
        />
      )}

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={() => { setEditingUser(null); loadAllData(); }}
        />
      )}

      {showQuestionModal && (
        <QuestionFormModal
          question={editingQuestion}
          onClose={() => { setShowQuestionModal(false); setEditingQuestion(null); }}
          onSaved={() => { setShowQuestionModal(false); setEditingQuestion(null); loadAllData(); }}
        />
      )}

      {showPracticalModal && (
        <PracticalFormModal
          problem={editingPractical}
          onClose={() => { setShowPracticalModal(false); setEditingPractical(null); }}
          onSaved={() => { setShowPracticalModal(false); setEditingPractical(null); loadAllData(); }}
        />
      )}
    </div>
  );
}
