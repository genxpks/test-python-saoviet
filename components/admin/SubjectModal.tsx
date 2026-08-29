"use client";

import { useState } from "react";
import { Subject, ProgrammingRuntime } from "@/types";
import { BookOpen, X, Check, Code2, Layers, Cpu, Terminal, FileSpreadsheet, Sparkles, CheckCircle2 } from "lucide-react";

interface SubjectModalProps {
  subject?: Subject | null;
  onSave: (subject: Partial<Subject>, initialQuestionsOption?: string) => void;
  onClose: () => void;
}

export default function SubjectModal({ subject, onSave, onClose }: SubjectModalProps) {
  const [name, setName] = useState(subject?.name || "");
  const [code, setCode] = useState(subject?.code || "");
  const [runtime, setRuntime] = useState<ProgrammingRuntime>(subject?.runtime || "python3");
  const [description, setDescription] = useState(subject?.description || "");
  const [totalModules, setTotalModules] = useState(subject?.totalModules || 5);
  const [isActive, setIsActive] = useState(subject?.isActive !== undefined ? subject.isActive : true);
  const [initQuestionOption, setInitQuestionOption] = useState<"standard" | "import_later" | "custom_exam">("standard");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      alert("Vui lòng nhập tên môn học và mã môn!");
      return;
    }

    onSave({
      id: subject?.id || code.toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
      name: name.trim(),
      code: code.trim().toUpperCase(),
      runtime: runtime,
      description: description.trim(),
      totalModules: Number(totalModules) || 5,
      isActive: isActive,
      icon: runtime === "python3" ? "FileCode2" : runtime === "cpp" ? "Terminal" : runtime === "java" ? "Cpu" : "Layers"
    }, initQuestionOption);
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
        maxWidth: "600px",
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
            background: "#eff6ff",
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              {subject ? "Chỉnh Sửa Môn Học & Ngân Hàng Đề" : "Thêm Môn Học Mới Kèm Ngân Hàng Đề Thi"}
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0.2rem 0 0" }}>
              Môn học được thiết lập trọn gói cùng bộ câu hỏi ôn tập và cấu hình kỳ thi trắc nghiệm.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
              Tên Môn Học / Ngôn Ngữ: *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Lập Trình Python Nâng Cao"
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: "0.88rem"
              }}
              autoFocus
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Mã Môn Học: *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: PY_NC, CPP_DSA"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.88rem"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Môi Trường Thực Thi (Runtime):
              </label>
              <select
                value={runtime}
                onChange={(e) => setRuntime(e.target.value as ProgrammingRuntime)}
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
                <option value="python3">🐍 Python 3.12 (Sandbox Engine)</option>
                <option value="cpp">⚙️ C / C++ 17</option>
                <option value="java">☕ Java 17 (OOP)</option>
                <option value="csharp">🔷 C# .NET 8</option>
                <option value="javascript">🌐 JavaScript (Node.js)</option>
                <option value="typescript">📘 TypeScript Fullstack</option>
                <option value="html_css">🎨 HTML5 / CSS3 / DOM</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Số Chương Học (Modules):
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={totalModules}
                onChange={(e) => setTotalModules(parseInt(e.target.value) || 1)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontSize: "0.88rem"
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", paddingTop: "1.2rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600, color: "#1e293b" }}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ accentColor: "#2563eb", width: "16px", height: "16px" }}
                />
                <span>Kích hoạt giảng dạy môn này</span>
              </label>
            </div>
          </div>

          {/* Question Bank & Exam Configuration Section */}
          {!subject && (
            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, color: "#1e40af", marginBottom: "0.45rem" }}>
                📦 KHỞI TẠO BỘ CÂU HỎI ÔN & ĐỀ THI CHO MÔN NÀY:
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", cursor: "pointer", color: "#334155" }}>
                  <input
                    type="radio"
                    name="initOption"
                    value="standard"
                    checked={initQuestionOption === "standard"}
                    onChange={() => setInitQuestionOption("standard")}
                    style={{ accentColor: "#2563eb" }}
                  />
                  <span>Tự động nạp bộ câu hỏi mẫu chuẩn theo các chương học của môn</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", cursor: "pointer", color: "#334155" }}>
                  <input
                    type="radio"
                    name="initOption"
                    value="import_later"
                    checked={initQuestionOption === "import_later"}
                    onChange={() => setInitQuestionOption("import_later")}
                    style={{ accentColor: "#2563eb" }}
                  />
                  <span>Tạo môn học trước, sau đó nạp file Excel / JSON ngân hàng đề thi sau</span>
                </label>
              </div>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
              Mô Tả Khóa Học & Mục Tiêu Đào Tạo:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tóm tắt nội dung học phần, chuẩn đầu ra, cấu trúc bài tập thực hành..."
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: "0.85rem",
                lineHeight: 1.5
              }}
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
              style={{
                padding: "0.65rem 1.35rem",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              {subject ? "Lưu Thay Đổi" : "Tạo Môn & Kích Hoạt Ngân Hàng Đề"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
