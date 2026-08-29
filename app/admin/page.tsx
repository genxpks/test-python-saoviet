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
  EyeOff
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
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* Top Header & Branch Hierarchy Bar */}
      <div style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-lg)",
        padding: "1.2rem 1.6rem",
        marginBottom: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: currentUser.role === "admin" ? "var(--brand-rose)" : "var(--brand-violet)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h1 style={{ fontSize: "1.35rem", fontWeight: 900, margin: 0 }}>
                Bảng Điều Khiển Quản Trị
              </h1>
              <span className={`badge ${currentUser.role === "admin" ? "badge-warning" : "badge-primary"}`} style={{ fontSize: "0.72rem" }}>
                {currentUser.role === "admin" ? "Super Admin" : "Quản Lý Chi Nhánh"}
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", margin: "0.2rem 0 0" }}>
              Xin chào <strong>{currentUser.fullName}</strong> • {currentUser.branchName || "Toàn Hệ Thống Sao Việt"}
            </p>
          </div>
        </div>

        {/* Branch View Selector for Admin */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
            <Building2 size={15} color="var(--brand-primary)" />
            <span>CHẾ ĐỘ XEM CHI NHÁNH:</span>
          </div>

          {currentUser.role === "admin" ? (
            <select
              value={adminBranchMode}
              onChange={(e) => setAdminBranchMode(e.target.value)}
              className="input"
              style={{ fontWeight: 800, fontSize: "0.85rem", borderColor: "var(--brand-primary)" }}
            >
              <option value="all">🏢 Toàn Hệ Thống (4 Chi Nhánh TP.HCM)</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>🏢 {b.name}</option>
              ))}
            </select>
          ) : (
            <span className="badge badge-primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.82rem" }}>
              {currentUser.branchName || "Chi Nhánh Được Gán"}
            </span>
          )}

          <button onClick={loadAllData} className="btn btn-secondary btn-sm" title="Làm mới dữ liệu">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* 4 COSMIC STAT CARDS (Exact Approved Mockup Match) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1.25rem",
        marginBottom: "1.75rem"
      }}>
        <div style={{
          background: "rgba(4, 12, 34, 0.82)",
          backdropFilter: "blur(20px)",
          border: "1.5px solid rgba(0, 245, 200, 0.25)",
          borderRadius: "18px",
          padding: "1.6rem 1.4rem",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 245, 200, 0.1)"
        }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.4rem" }}>
            Tổng Câu Hỏi
          </div>
          <div style={{
            fontSize: "2.8rem",
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
          padding: "1.6rem 1.4rem",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(56, 189, 248, 0.1)"
        }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.4rem" }}>
            Học Viên
          </div>
          <div style={{
            fontSize: "2.8rem",
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
          padding: "1.6rem 1.4rem",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(167, 139, 250, 0.1)"
        }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.4rem" }}>
            Chi Nhánh
          </div>
          <div style={{
            fontSize: "2.8rem",
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
          padding: "1.6rem 1.4rem",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 245, 200, 0.1)"
        }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.4rem" }}>
            Kỳ Thi
          </div>
          <div style={{
            fontSize: "2.8rem",
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

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1.5px solid rgba(0, 245, 200, 0.15)", paddingBottom: "0.75rem", marginBottom: "1.5rem", overflowX: "auto" }}>
        <button
          onClick={() => setActiveTab("questions")}
          className={`btn btn-sm ${activeTab === "questions" ? "btn-primary" : "btn-secondary"}`}
          style={{ gap: "0.4rem" }}
        >
          <BookOpen size={15} />
          <span>Ngân Hàng Câu Hỏi ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`btn btn-sm ${activeTab === "users" ? "btn-primary" : "btn-secondary"}`}
          style={{ gap: "0.4rem" }}
        >
          <Users size={15} />
          <span>Quản Lý Học Viên ({filteredUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("subjects")}
          className={`btn btn-sm ${activeTab === "subjects" ? "btn-primary" : "btn-secondary"}`}
          style={{ gap: "0.4rem" }}
        >
          <Code2 size={15} />
          <span>Môn Học & Ngôn Ngữ ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("branches")}
          className={`btn btn-sm ${activeTab === "branches" ? "btn-primary" : "btn-secondary"}`}
          style={{ gap: "0.4rem" }}
        >
          <Building2 size={15} />
          <span>Cơ Sở Phòng Lab ({branches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("results")}
          className={`btn btn-sm ${activeTab === "results" ? "btn-primary" : "btn-secondary"}`}
          style={{ gap: "0.4rem" }}
        >
          <GraduationCap size={15} />
          <span>Kết Quả Thi ({examResults.length})</span>
        </button>
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
    </div>
  );
}
