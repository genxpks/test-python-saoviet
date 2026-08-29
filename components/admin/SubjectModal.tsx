"use client";

import { useState } from "react";
import { Subject, ProgrammingRuntime } from "@/types";
import { BookOpen, X, Check, Code2, Layers, Cpu, Terminal } from "lucide-react";

interface SubjectModalProps {
  subject?: Subject | null;
  onSave: (subject: Partial<Subject>) => void;
  onClose: () => void;
}

export default function SubjectModal({ subject, onSave, onClose }: SubjectModalProps) {
  const [name, setName] = useState(subject?.name || "");
  const [code, setCode] = useState(subject?.code || "");
  const [runtime, setRuntime] = useState<ProgrammingRuntime>(subject?.runtime || "python3");
  const [description, setDescription] = useState(subject?.description || "");
  const [totalModules, setTotalModules] = useState(subject?.totalModules || 5);
  const [isActive, setIsActive] = useState(subject?.isActive !== undefined ? subject.isActive : true);

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
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: "560px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.8rem", marginBottom: "1.2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BookOpen size={20} color="var(--brand-primary)" />
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
              {subject ? "Chỉnh Sửa Môn Học" : "Thêm Môn Học / Ngôn Ngữ Mới"}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: "0.3rem" }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              Tên Môn Học / Ngôn Ngữ: *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Lập Trình Python Nâng Cao"
              className="input"
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Mã Môn Học: *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: PY_NC, CPP_CB"
                className="input"
                style={{ width: "100%", textTransform: "uppercase" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Môi Trường Thực Thi (Runtime):
              </label>
              <select
                value={runtime}
                onChange={(e) => setRuntime(e.target.value as ProgrammingRuntime)}
                className="input"
                style={{ width: "100%", fontWeight: 600 }}
              >
                <option value="python3">🐍 Python 3.12 (Sandbox Engine)</option>
                <option value="cpp">⚙️ C / C++ 17</option>
                <option value="java">☕ Java 17 (OOP)</option>
                <option value="javascript">🌐 JavaScript (Node.js)</option>
                <option value="html_css">🎨 HTML5 / CSS3 / DOM</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Số Chương Học (Modules):
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={totalModules}
                onChange={(e) => setTotalModules(parseInt(e.target.value) || 1)}
                className="input"
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingTop: "1.2rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span>Kích hoạt môn học này</span>
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              Mô Tả Khóa Học:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tóm tắt nội dung học phần, mục tiêu đầu ra..."
              className="input"
              style={{ width: "100%", fontSize: "0.85rem" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "1rem", borderTop: "1px solid var(--border-light)", paddingTop: "0.8rem" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={14} />
              <span>{subject ? "Cập Nhật Môn Học" : "Tạo Môn Học Mới"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
