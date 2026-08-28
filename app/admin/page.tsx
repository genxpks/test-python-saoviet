"use client";

import { useState, useEffect } from "react";
import { User, PausedExamState, ExamResult } from "@/types";
import { getUsers, deleteUser, getPausedExam, clearPausedExam, getCurrentUser, getExamResults } from "@/lib/usersData";
import AddUserModal from "@/components/AddUserModal";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pausedExam, setPausedExam] = useState<PausedExamState | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

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
    if (confirm("Hủy bài thi tạm dừng này?")) {
      clearPausedExam();
      loadData();
    }
  };

  if (!currentUser || currentUser.role !== "teacher") {
    return (
      <div className="q-card" style={{ textAlign: "center", padding: "3rem", margin: "2rem auto", maxWidth: "600px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🔒</div>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>Khu Vực Quản Trị Giáo Viên</h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Bạn cần đăng nhập bằng tài khoản Giáo viên (Admin: <code>admin</code> / <code>saoviet2026</code>) để truy cập chức năng này.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div className="section-hero">
        <div className="hero-text">
          <h2>Bảng Điều Khiển Quản Trị Giáo Viên</h2>
          <p>Quản lý tài khoản học viên, phê duyệt mở khóa bài thi tạm dừng và theo dõi kết quả thi.</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", padding: "0.5rem 1rem", borderRadius: "var(--radius-sm)", fontSize: "0.9rem" }}>
          <span>Mã PIN Mở Khóa Đề Thi: <strong>8888</strong></span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {/* User Management Card */}
        <div className="q-card" style={{ gridColumn: "span 2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              👥 Danh Sách Học Viên ({users.filter(u => u.role === 'student').length})
            </h3>
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
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>(Hệ thống)</span>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>⏸️ Bài Thi Đang Tạm Dừng</h3>
            <button className="btn btn-secondary btn-sm" onClick={loadData}>
              Làm Mới
            </button>
          </div>

          {pausedExam ? (
            <div style={{ background: "var(--warning-light)", border: "1px solid #fef3c7", padding: "1rem", borderRadius: "var(--radius-sm)" }}>
              <h4 style={{ color: "#92400e", marginBottom: "0.4rem", fontWeight: 700 }}>
                📌 Học viên: {pausedExam.userName} ({pausedExam.userId})
              </h4>
              <p style={{ fontSize: "0.85rem", color: "#78350f", marginBottom: "0.8rem" }}>
                Thời gian lưu: {pausedExam.timestamp} | Còn lại: {Math.floor(pausedExam.timerSeconds / 60)} phút
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => alert(`Mã PIN phê duyệt là: 8888. Thầy/Cô hãy nhập mã này tại màn hình học viên.`)}
                >
                  Cấp PIN (8888)
                </button>
                <button className="btn btn-danger btn-sm" onClick={handleClearPaused}>
                  Hủy Bài Này
                </button>
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Hiện không có học viên nào đang tạm dừng bài thi.
            </p>
          )}
        </div>

        {/* Exam Results Card */}
        <div className="q-card" style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>📊 Lịch Sử Nộp Bài & Bảng Điểm</h3>
          </div>

          {examResults.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Chưa có bài thi nào được nộp.</p>
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
                      <td><strong style={{ color: "var(--primary)", fontSize: "1.05rem" }}>{r.totalScore}/10</strong></td>
                      <td><span className="badge badge-success">{r.rank}</span></td>
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
