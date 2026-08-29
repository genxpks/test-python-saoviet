"use client";

import { useState } from "react";
import { PracticalProblem } from "@/types";
import { addPracticalData, updatePracticalData } from "@/lib/questionsData";
import { DEFAULT_SUBJECTS } from "@/lib/usersData";
import { Terminal, X, CheckCircle2, Code2 } from "lucide-react";

interface PracticalFormModalProps {
  problem?: PracticalProblem | null;
  defaultSubjectId?: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function PracticalFormModal({ 
  problem, 
  defaultSubjectId = "python",
  onClose, 
  onSaved 
}: PracticalFormModalProps) {
  const isEdit = !!problem;

  const [subjectId, setSubjectId] = useState(problem?.subjectId || defaultSubjectId);
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
      subjectId: subjectId,
      title: title.trim(),
      description: description.trim(),
      starter_code: starterCode,
      solution_code: solutionCode,
      test_cases: problem?.test_cases || [{ input: "demo", expected_output: "demo" }]
    };

    if (isEdit && problem) {
      problemPayload.id = problem.id;
      updatePracticalData(problem.id, problemPayload);

      try {
        await fetch("/api/questions", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: problem.id, target: "practical", data: problemPayload })
        });
      } catch (err) {}
    } else {
      const created = addPracticalData(problemPayload);

      try {
        await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: "practical", data: { ...problemPayload, id: created.id } })
        });
      } catch (err) {}
    }

    setIsLoading(false);
    alert(`✅ ${isEdit ? "Cập nhật" : "Tạo mới"} bài tập thực hành thành công!`);
    onSaved();
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.6)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div style={{
        background: "#ffffff",
        color: "#0f172a",
        maxWidth: "680px",
        width: "100%",
        maxHeight: "92vh",
        overflowY: "auto",
        padding: "2rem",
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)",
        position: "relative"
      }}>
        <button
          onClick={onClose}
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
        >
          <X size={18} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
          <div style={{
            width: "46px",
            height: "46px",
            borderRadius: "14px",
            background: "#ecfdf5",
            color: "#059669",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Terminal size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              {isEdit ? `Chỉnh Sửa Bài Thực Hành #${problem?.id}` : "Thêm Bài Toán Thực Hành Viết Hàm"}
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0.2rem 0 0" }}>
              Tích hợp vào phòng thi thực hành IDE và bài kiểm tra tốt nghiệp.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Thuộc Môn Học: *
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 600,
                  fontSize: "0.85rem"
                }}
              >
                {DEFAULT_SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Tiêu Đề Bài Toán: *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Hàm kiểm tra số nguyên tố đối xứng"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontSize: "0.88rem"
                }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
              Mô Tả Đề Bài & Yêu Cầu Thuật Toán: *
            </label>
            <textarea
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: "0.88rem",
                minHeight: "75px"
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả các tham số đầu vào, logic xử lý và giá trị trả về của hàm..."
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
              Mã Nguồn Khởi Tạo (Starter Code Cho Học Viên): *
            </label>
            <textarea
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#0f172a",
                color: "#38bdf8",
                fontFamily: "var(--font-mono)",
                fontSize: "0.86rem",
                minHeight: "90px"
              }}
              value={starterCode}
              onChange={(e) => setStarterCode(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
              Mã Nguồn Mẫu Chuẩn (Solution Code Đạt 10/10 Điểm): *
            </label>
            <textarea
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#0f172a",
                color: "#34d399",
                fontFamily: "var(--font-mono)",
                fontSize: "0.86rem",
                minHeight: "100px"
              }}
              value={solutionCode}
              onChange={(e) => setSolutionCode(e.target.value)}
              required
            />
          </div>

          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "0.5rem",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "1rem"
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.65rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#475569",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "0.65rem 1.35rem",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #059669, #047857)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              {isLoading ? "Đang lưu..." : isEdit ? "Lưu Thay Đổi Bài Toán" : "Thêm Bài Toán Vào Kho"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
