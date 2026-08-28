"use client";

import { useState } from "react";
import { PracticalProblem } from "@/types";
import { addPracticalData, updatePracticalData } from "@/lib/questionsData";
import { Terminal, X, CheckCircle2, Code2 } from "lucide-react";

interface PracticalFormModalProps {
  problem?: PracticalProblem | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function PracticalFormModal({ problem, onClose, onSaved }: PracticalFormModalProps) {
  const isEdit = !!problem;

  const [title, setTitle] = useState(problem?.title || "");
  const [description, setDescription] = useState(problem?.description || "");
  const [starterCode, setStarterCode] = useState(
    problem?.starter_code || "def my_function():\n    # Viết code của em ở đây\n    pass\n"
  );
  const [solutionCode, setSolutionCode] = useState(
    problem?.solution_code || "def my_function():\n    return True\n"
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const problemPayload: any = {
      title: title.trim(),
      description: description.trim(),
      starter_code: starterCode,
      solution_code: solutionCode,
      test_cases: problem?.test_cases || [{ input: "demo", expected_output: "demo" }]
    };

    if (isEdit && problem) {
      problemPayload.id = problem.id;
      updatePracticalData(problem.id, problemPayload);

      // Call API PUT
      try {
        await fetch("/api/questions", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: "practical", data: problemPayload })
        });
      } catch (err) {
        console.warn("API sync warning, updated in local cache.");
      }
    } else {
      const created = addPracticalData(problemPayload);

      // Call API POST
      try {
        await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: "practical", data: { ...problemPayload, id: created.id } })
        });
      } catch (err) {
        console.warn("API sync warning, updated in local cache.");
      }
    }

    setIsLoading(false);
    alert(`✅ ${isEdit ? "Cập nhật" : "Tạo mới"} bài tập thực hành thành công!`);
    onSaved();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <button
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b"
          }}
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: "rgba(16, 185, 129, 0.12)",
            color: "var(--brand-emerald-dark)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem auto"
          }}>
            <Terminal size={28} />
          </div>
          <h3 style={{ fontSize: "1.35rem", fontWeight: 800 }}>
            {isEdit ? `Chỉnh Sửa Bài Thực Hành #${problem?.id}` : "Thêm Bài Toán Thực Hành Viết Hàm"}
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Tích hợp vào phòng thi trực tuyến IDE và bài kiểm tra tự luận tốt nghiệp
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
              Tiêu Đề Bài Toán:
            </label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Hàm kiểm tra số nguyên tố đối xứng"
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
              Mô Tả Đề Bài & Yêu Cầu Thuật Toán:
            </label>
            <textarea
              className="form-input"
              style={{ minHeight: "75px", resize: "vertical" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả các tham số đầu vào, logic xử lý và giá trị trả về của hàm..."
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
              Mã Nguồn Khởi Tạo (Starter Code Cho Học Viên):
            </label>
            <textarea
              className="form-input"
              style={{ minHeight: "100px", fontFamily: "var(--font-mono)", fontSize: "0.88rem", background: "#090d16", color: "#38bdf8", border: "1px solid #1e293b", resize: "vertical" }}
              value={starterCode}
              onChange={(e) => setStarterCode(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--text-secondary)" }}>
              Mã Nguồn Mẫu Chuẩn (Solution Code Đạt 10/10 Điểm):
            </label>
            <textarea
              className="form-input"
              style={{ minHeight: "110px", fontFamily: "var(--font-mono)", fontSize: "0.88rem", background: "#090d16", color: "#a7f3d0", border: "1px solid #1e293b", resize: "vertical" }}
              value={solutionCode}
              onChange={(e) => setSolutionCode(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success btn-block btn-lg" disabled={isLoading}>
            <CheckCircle2 size={18} />
            <span>{isLoading ? "Đang lưu..." : isEdit ? "Lưu Thay Đổi Bài Toán" : "Thêm Bài Toán Vào Kho"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
