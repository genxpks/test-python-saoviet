"use client";

import { useState, useEffect } from "react";
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
  updateTeacherPin
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
  SlidersHorizontal,
  Bot,
  GraduationCap,
  Sparkles,
  Trophy,
  Filter,
  FileCode2
} from "lucide-react";

type AdminTab = "users" | "questions" | "practicals" | "exams_monitor" | "results" | "settings";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("users");

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [practicals, setPracticals] = useState<PracticalProblem[]>([]);
  const [pausedExam, setPausedExam] = useState<PausedExamState | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

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

  // Filters
  const filteredUsers = users.filter((u) => {
    const matchSearch = u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.class && u.class.toLowerCase().includes(userSearch.toLowerCase()));
    const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
    return matchSearch && matchRole;
  });

  const filteredQuestions = questions.filter((q) => {
    const matchSearch = q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.explanation.toLowerCase().includes(questionSearch.toLowerCase());
    const matchType = questionTypeFilter === "all" || q.type === questionTypeFilter;
    return matchSearch && matchType;
  });

  const filteredPracticals = practicals.filter((p) => {
    return p.title.toLowerCase().includes(practicalSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(practicalSearch.toLowerCase());
  });

  const filteredResults = examResults.filter((r) => {
    if (resultRankFilter === "all") return true;
    return r.rank.toLowerCase().includes(resultRankFilter.toLowerCase());
  });

  if (!currentUser || currentUser.role !== "teacher") {
    return (
      <div className="q-card" style={{ textAlign: "center", padding: "4rem 2rem", margin: "2rem auto", maxWidth: "600px" }}>
        <div style={{
          width: "64px",
          height: "64px",
          background: "#fff1f2",
          color: "#e11d48",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.2rem auto"
        }}>
          <Lock size={32} />
        </div>
        <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.4rem" }}>
          Khu Vực Quản Trị Giáo Viên
        </h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.8rem", fontSize: "0.92rem", lineHeight: "1.6" }}>
          Thầy/Cô cần đăng nhập bằng tài khoản Giáo viên Quản trị (Tài khoản: <code>admin</code> / <code>saoviet2026</code>) để truy cập bảng điều khiển này.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Admin Header */}
      <div className="section-hero" style={{ padding: "2.2rem 2rem", marginBottom: "1.8rem" }}>
        <div className="hero-content">
          <div className="hero-tagline">
            <ShieldCheck size={14} />
            <span>HỆ THỐNG QUẢN TRỊ TẬP TRUNG (SAO VIỆT ADMIN PORTAL)</span>
          </div>

          <h2 style={{ fontSize: "1.85rem", fontWeight: 900, marginBottom: "0.4rem" }}>
            Trung Tâm Quản Lý Học Liệu & Khảo Thí Python Nâng Cao
          </h2>

          <p style={{ color: "#94a3b8", fontSize: "0.95rem", maxWidth: "780px" }}>
            Toàn quyền quản lý danh sách học viên, chỉnh sửa ngân hàng 120 câu hỏi trắc nghiệm & 10 bài code tự luận, giám sát các bài thi đang tạm dừng và xuất báo cáo điểm số.
          </p>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            padding: "0.45rem 1rem",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.88rem",
            marginTop: "1.2rem"
          }}>
            <KeyRound size={16} color="#fbbf24" />
            <span>Mã PIN Phê Duyệt Giáo Viên Hiện Tại: <strong style={{ color: "#fbbf24", letterSpacing: "1px" }}>{currentUser.pin || "8888"}</strong></span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        overflowX: "auto",
        paddingBottom: "0.5rem",
        marginBottom: "1.8rem",
        borderBottom: "1px solid var(--border-light)"
      }}>
        <button
          className={`btn btn-sm ${activeTab === "users" ? "btn-primary" : "btn-secondary"}`}
          style={{ borderRadius: "var(--radius-full)", padding: "0.55rem 1.1rem" }}
          onClick={() => setActiveTab("users")}
        >
          <Users size={16} />
          <span>1. Quản Lý Học Viên ({users.length})</span>
        </button>

        <button
          className={`btn btn-sm ${activeTab === "questions" ? "btn-primary" : "btn-secondary"}`}
          style={{ borderRadius: "var(--radius-full)", padding: "0.55rem 1.1rem" }}
          onClick={() => setActiveTab("questions")}
        >
          <BookOpen size={16} />
          <span>2. Ngân Hàng 120 Câu Hỏi ({questions.length})</span>
        </button>

        <button
          className={`btn btn-sm ${activeTab === "practicals" ? "btn-primary" : "btn-secondary"}`}
          style={{ borderRadius: "var(--radius-full)", padding: "0.55rem 1.1rem" }}
          onClick={() => setActiveTab("practicals")}
        >
          <Terminal size={16} />
          <span>3. Bài Tập Tự Luận Code ({practicals.length})</span>
        </button>

        <button
          className={`btn btn-sm ${activeTab === "exams_monitor" ? "btn-primary" : "btn-secondary"}`}
          style={{ borderRadius: "var(--radius-full)", padding: "0.55rem 1.1rem" }}
          onClick={() => setActiveTab("exams_monitor")}
        >
          <Pause size={16} />
          <span>4. Giám Sát Phòng Thi {pausedExam && <span style={{ background: "#ef4444", color: "#fff", padding: "1px 6px", borderRadius: "10px", fontSize: "0.7rem", marginLeft: "4px" }}>1</span>}</span>
        </button>

        <button
          className={`btn btn-sm ${activeTab === "results" ? "btn-primary" : "btn-secondary"}`}
          style={{ borderRadius: "var(--radius-full)", padding: "0.55rem 1.1rem" }}
          onClick={() => setActiveTab("results")}
        >
          <Award size={16} />
          <span>5. Bảng Điểm & Kết Quả ({examResults.length})</span>
        </button>

        <button
          className={`btn btn-sm ${activeTab === "settings" ? "btn-primary" : "btn-secondary"}`}
          style={{ borderRadius: "var(--radius-full)", padding: "0.55rem 1.1rem" }}
          onClick={() => setActiveTab("settings")}
        >
          <Settings size={16} />
          <span>6. Cấu Hình Hệ Thống</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: USERS MANAGEMENT (CRUD)
          ========================================================================= */}
      {activeTab === "users" && (
        <div className="q-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>👥 Danh Sách Học Viên & Giáo Viên</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.86rem" }}>
                Thêm, sửa thông tin, đổi mật khẩu và phân quyền tài khoản
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Tìm theo tên, lớp..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ height: "38px", fontSize: "0.86rem", width: "200px" }}
                />
              </div>

              <select
                className="form-input"
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                style={{ height: "38px", fontSize: "0.86rem", width: "140px" }}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="student">Chỉ Học Viên</option>
                <option value="teacher">Chỉ Giáo Viên</option>
              </select>

              <button className="btn btn-primary btn-sm" onClick={() => setShowAddUserModal(true)}>
                <UserPlus size={15} />
                <span>+ Cấp Tài Khoản Mới</span>
              </button>
            </div>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên Đăng Nhập</th>
                  <th>Họ Và Tên</th>
                  <th>Lớp Học</th>
                  <th>Vai Trò</th>
                  <th>Mật Khẩu</th>
                  <th>Mã PIN</th>
                  <th style={{ textAlign: "right" }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <code style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand-primary)" }}>
                        {u.username}
                      </code>
                    </td>
                    <td><strong>{u.fullName}</strong></td>
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
                      <code style={{ background: "#f8fafc", padding: "2px 6px", borderRadius: "4px" }}>
                        {u.password}
                      </code>
                    </td>
                    <td>
                      {u.role === "teacher" ? <strong>{u.pin || "8888"}</strong> : <span style={{ color: "#94a3b8" }}>—</span>}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: QUESTIONS MANAGEMENT (CRUD)
          ========================================================================= */}
      {activeTab === "questions" && (
        <div className="q-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>📚 Ngân Hàng Câu Hỏi Trắc Nghiệm ({questions.length})</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.86rem" }}>
                Toàn bộ câu hỏi trắc nghiệm 6 dạng phục vụ ôn tập và thi trực tuyến
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Tìm nội dung câu hỏi..."
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                style={{ height: "38px", fontSize: "0.86rem", width: "220px" }}
              />

              <select
                className="form-input"
                value={questionTypeFilter}
                onChange={(e) => setQuestionTypeFilter(e.target.value)}
                style={{ height: "38px", fontSize: "0.86rem", width: "170px" }}
              >
                <option value="all">Tất cả dạng bài</option>
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
            {filteredQuestions.map((q, idx) => (
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
                    <strong>💡 Lời giải logic:</strong> {q.explanation}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditingQuestion(q);
                      setShowQuestionModal(true);
                    }}
                    title="Sửa câu hỏi"
                  >
                    <Edit3 size={14} />
                    <span>Sửa</span>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteQuestion(q.id)}
                    title="Xóa câu hỏi"
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
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>💻 Kho Bài Tập Tự Luận Thuật Toán ({practicals.length})</h3>
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
                style={{ height: "38px", fontSize: "0.86rem", width: "220px" }}
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {/* Live Paused Session Card */}
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

          {/* Teacher PIN Management Card */}
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
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>📊 Lịch Sử Nộp Bài & Bảng Điểm Tốt Nghiệp ({examResults.length})</h3>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {/* AI Settings */}
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

          {/* Center Info */}
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
