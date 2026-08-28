"use client";

import { useState, useEffect } from "react";
import { User, PausedExamState, ExamResult } from "@/types";
import { getUsers, addUser, deleteUser, getPausedExam, clearPausedExam, getCurrentUser, getExamResults } from "@/lib/usersData";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pausedExam, setPausedExam] = useState<PausedExamState | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  // Add User Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newClass, setNewClass] = useState("Python Nâng Cao K26");
  const [newPassword, setNewPassword] = useState("123456");

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

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addUser({
      username: newUsername,
      fullName: newFullName,
      class: newClass,
      password: newPassword
    });
    if (res.success) {
      alert("✅ Cấp tài khoản mới thành công!");
      setShowAddModal(false);
      setNewUsername("");
      setNewFullName("");
      loadData();
    } else {
      alert("❌ " + res.message);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Thầy/Cô có chắc chắn muốn xóa tài khoản học viên này không?")) {
      deleteUser(id);
      loadData();
    }
  };

  const handleClearPaused = () => {
    if (confirm("Hủy bài thi tạm dừng này?")) {
      clearPausedExam();
      loadData();
    }
  };

  if (!currentUser || currentUser.role !== "teacher") {
    return (
      <div className="q-card" style={{ textAlign: "center", padding: "3rem", margin: "2rem auto", maxWidth: "600px" }}>
        <div style={{ fontSize: "3rem" }}>🔒</div>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0.8rem 0" }}>Khu Vực Quản Trị Giáo Viên</h3>
        <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
          Bạn cần đăng nhập bằng tài khoản Giáo viên (Admin: <code>admin</code> / <code>saoviet2026</code>) để truy cập chức năng này.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="section-hero">
        <div className="hero-text">
          <h2>Bảng Điều Khiển Quản Trị Giáo Viên</h2>
          <p>Quản lý tài khoản học viên, mở khóa bài thi tạm dừng và theo dõi kết quả thi.</p>
        </div>
        <div className="admin-pin-badge">
          <span>Mã PIN Mở Khóa Đề Thi: <strong>8888</strong></span>
        </div>
      </div>

      <div className="admin-grid">
        {/* User Management Card */}
        <div className="admin-card">
          <div className="card-header">
            <h3>👥 Danh Sách Học Viên ({users.filter(u => u.role === 'student').length})</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
              + Cấp Tài Khoản Mới
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên Đăng Nhập</th>
                  <th>Họ Và Tên</th>
                  <th>Lớp</th>
                  <th>Mật Khẩu</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.username}</strong></td>
                    <td>{u.fullName}</td>
                    <td>{u.class || (u.role === 'teacher' ? 'Admin' : 'Học viên')}</td>
                    <td><code>{u.password}</code></td>
                    <td>
                      {u.username !== "admin" ? (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)}>
                          Xóa
                        </button>
                      ) : (
                        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>(Hệ thống)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paused Exams Card */}
        <div className="admin-card">
          <div className="card-header">
            <h3>⏸️ Bài Thi Đang Tạm Dừng</h3>
            <button className="btn btn-secondary btn-sm" onClick={loadData}>
              Làm Mới
            </button>
          </div>

          {pausedExam ? (
            <div style={{ background: "#fffbeb", border: "1px solid #fef3c7", padding: "1rem", borderRadius: "8px" }}>
              <h4 style={{ color: "#92400e", marginBottom: "0.4rem" }}>
                📌 Học viên: {pausedExam.userName} ({pausedExam.userId})
              </h4>
              <p style={{ fontSize: "0.85rem", color: "#78350f", marginBottom: "0.8rem" }}>
                Thời gian lưu: {pausedExam.timestamp} | Thời gian còn lại: {Math.floor(pausedExam.timerSeconds / 60)} phút
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => alert(`Mã PIN phê duyệt là: 8888. Thầy/Cô hãy nhập mã này tại màn hình học viên.`)}
                >
                  Cấp Mã PIN (8888)
                </button>
                <button className="btn btn-danger btn-sm" onClick={handleClearPaused}>
                  Hủy Bài Thi Này
                </button>
              </div>
            </div>
          ) : (
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Hiện không có học viên nào đang tạm dừng bài thi.
            </p>
          )}
        </div>

        {/* Exam Results Card */}
        <div className="admin-card full-width">
          <div className="card-header">
            <h3>📊 Lịch Sử Nộp Bài & Điểm Thi Gần Đây</h3>
          </div>

          {examResults.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Chưa có bài thi nào được nộp.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Học Viên</th>
                    <th>Lớp</th>
                    <th>Trắc Nghiệm</th>
                    <th>Tự Luận</th>
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
                      <td>{r.practicalScore}/5.0đ</td>
                      <td><strong style={{ color: "var(--primary)", fontSize: "1rem" }}>{r.totalScore}/10</strong></td>
                      <td><span className="badge badge-success">{r.rank}</span></td>
                      <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{r.submittedAt}</td>
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
        <div className="modal-overlay">
          <div className="modal-card">
            <button
              className="close-modal-btn"
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
              onClick={() => setShowAddModal(false)}
            >
              &times;
            </button>
            <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
              <div style={{ fontSize: "2.5rem" }}>👤</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Cấp Tài Khoản Học Viên Mới</h3>
            </div>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: "0.8rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Tên đăng nhập:</label>
                <input
                  type="text"
                  className="form-input"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Ví dụ: hocvien04"
                  required
                />
              </div>
              <div style={{ marginBottom: "0.8rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Họ và tên học viên:</label>
                <input
                  type="text"
                  className="form-input"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ví dụ: Đặng Hoàng Yến"
                  required
                />
              </div>
              <div style={{ marginBottom: "0.8rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Lớp học:</label>
                <input
                  type="text"
                  className="form-input"
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: "1.2rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Mật khẩu khởi tạo:</label>
                <input
                  type="text"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                + Lưu Tài Khoản
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
