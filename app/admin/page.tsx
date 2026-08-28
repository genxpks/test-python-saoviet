"use client";

import { useState, useEffect } from "react";
import { User, PausedExamState, ExamResult } from "@/types";
import { getUsers, deleteUser, getPausedExam, clearPausedExam, getCurrentUser, getExamResults } from "@/lib/usersData";
import AddUserModal from "@/components/AddUserModal";
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Pause, 
  Trash2, 
  RefreshCw, 
  KeyRound, 
  Award, 
  Trophy, 
  Lock, 
  Search,
  CheckCircle2,
  TrendingUp,
  GraduationCap
} from "lucide-react";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pausedExam, setPausedExam] = useState<PausedExamState | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    loadData();
  }, []);

  const loadData = () => {
    setUsers(getUsers());
    setPausedExam(getPausedExam());
    setExamResults(getExamResults());
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Thầy/Cô có chắc chắn muốn xóa tài khoản học viên này không?")) {
      deleteUser(id);
      loadData();
    }
  };

  const handleClearPaused = () => {
    if (confirm("Hủy bỏ bài thi đang tạm dừng này?")) {
      clearPausedExam();
      loadData();
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    return (
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.class && u.class.toLowerCase().includes(userSearch.toLowerCase()))
    );
  });

  // Calculate statistics
  const studentCount = users.filter(u => u.role === 'student').length;
  const completedCount = examResults.length;
  const avgScore = completedCount > 0 
    ? (examResults.reduce((acc, r) => acc + r.totalScore, 0) / completedCount).toFixed(1)
    : "0.0";
  const passCount = examResults.filter(r => r.totalScore >= 5.0).length;
  const passRate = completedCount > 0 ? Math.round((passCount / completedCount) * 100) : 0;

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
          Thầy/Cô cần đăng nhập bằng tài khoản Giáo viên Quản trị (Tài khoản: <code>admin</code> / <code>saoviet2026</code>) để truy cập chức năng này.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Banner */}
      <div className="section-hero" style={{ padding: "2.2rem 2rem", marginBottom: "1.8rem" }}>
        <div className="hero-content">
          <div className="hero-tagline">
            <ShieldCheck size={14} />
            <span>TRUNG TÂM ĐIỀU HÀNH GIÁO VIÊN</span>
          </div>

          <h2 style={{ fontSize: "1.85rem", fontWeight: 800, marginBottom: "0.4rem" }}>
            Bảng Điều Khiển Quản Trị & Đánh Giá Kỳ Thi
          </h2>

          <p style={{ color: "#94a3b8", fontSize: "0.95rem", maxWidth: "750px" }}>
            Quản lý danh sách tài khoản học viên các lớp, phê duyệt mở khóa bài thi tạm dừng bằng mã PIN và thống kê phổ điểm kết quả thi tốt nghiệp.
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
            <span>Mã PIN Mở Khóa Đề Thi: <strong style={{ color: "#fbbf24", letterSpacing: "1px" }}>8888</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Dashboard Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.2rem", marginBottom: "1.8rem" }}>
        <div className="q-card" style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(37, 99, 235, 0.1)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Tổng Học Viên</span>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-primary)" }}>{studentCount} Học Viên</div>
          </div>
        </div>

        <div className="q-card" style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", color: "var(--brand-emerald)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Bài Thi Đã Nộp</span>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--brand-emerald-dark)" }}>{completedCount} Bài</div>
          </div>
        </div>

        <div className="q-card" style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.1)", color: "var(--brand-violet)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trophy size={24} />
          </div>
          <div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Điểm Trung Bình</span>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--brand-violet)" }}>{avgScore} / 10</div>
          </div>
        </div>

        <div className="q-card" style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.1)", color: "var(--brand-amber)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Tỷ Lệ Đạt Chuẩn</span>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--brand-amber)" }}>{passRate}%</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {/* User Management Card */}
        <div className="q-card" style={{ gridColumn: "span 2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.8rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Users size={20} color="var(--brand-primary)" />
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                Danh Sách Tài Khoản Học Viên ({users.filter(u => u.role === 'student').length})
              </h3>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Tìm học viên..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ height: "36px", paddingLeft: "1rem", fontSize: "0.84rem", width: "180px" }}
                />
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
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
                  <th>Mật Khẩu</th>
                  <th>Thao Tác</th>
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
                    <td>{u.class || (u.role === 'teacher' ? 'Quản Trị Viên' : 'Học Viên')}</td>
                    <td>
                      <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                        {u.password}
                      </code>
                    </td>
                    <td>
                      {u.username !== "admin" ? (
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }}
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          <Trash2 size={12} />
                          <span>Xóa</span>
                        </button>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>(Hệ thống)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paused Exams Card */}
        <div className="q-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Pause size={18} color="var(--brand-amber)" />
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>Bài Thi Đang Tạm Dừng</h3>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={loadData} title="Làm mới">
              <RefreshCw size={13} />
            </button>
          </div>

          {pausedExam ? (
            <div style={{
              background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
              border: "1px solid #fde68a",
              padding: "1.2rem",
              borderRadius: "var(--radius-md)"
            }}>
              <h4 style={{ color: "#92400e", marginBottom: "0.3rem", fontWeight: 800, fontSize: "0.95rem" }}>
                Học viên: {pausedExam.userName} ({pausedExam.userId})
              </h4>
              <p style={{ fontSize: "0.85rem", color: "#78350f", marginBottom: "1rem" }}>
                Thời gian lưu: {pausedExam.timestamp} • Thời gian còn lại: <strong>{Math.floor(pausedExam.timerSeconds / 60)} phút</strong>
              </p>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="btn btn-success btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => alert(`Mã PIN phê duyệt là: 8888. Thầy/Cô hãy nhập mã này tại màn hình máy học viên.`)}
                >
                  <KeyRound size={14} />
                  <span>Cấp PIN (8888)</span>
                </button>

                <button className="btn btn-danger btn-sm" onClick={handleClearPaused}>
                  <Trash2 size={14} />
                  <span>Hủy Bài Này</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
              <CheckCircle2 size={32} color="var(--brand-emerald)" style={{ margin: "0 auto 0.5rem auto", display: "block" }} />
              <p style={{ fontSize: "0.88rem" }}>Hiện không có học viên nào đang tạm dừng bài thi.</p>
            </div>
          )}
        </div>

        {/* Exam Results History */}
        <div className="q-card" style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Award size={20} color="var(--brand-primary)" />
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>Lịch Sử Nộp Bài & Bảng Điểm Tốt Nghiệp ({examResults.length})</h3>
            </div>
          </div>

          {examResults.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", textAlign: "center", padding: "2rem" }}>
              Chưa có bài thi nào được nộp vào hệ thống.
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
                  </tr>
                </thead>
                <tbody>
                  {examResults.map((r) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onUserAdded={loadData}
        />
      )}
    </div>
  );
}
