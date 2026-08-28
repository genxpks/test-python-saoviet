"use client";

import { useState } from "react";
import { QUESTIONS_DATA, PRACTICAL_DATA } from "@/lib/questionsData";
import QuestionCard from "@/components/QuestionCard";

export default function StudyPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const filteredQuestions = QUESTIONS_DATA.filter((q) => {
    const matchType = filterType === "all" || q.type === filterType;
    const matchSearch =
      search === "" ||
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.explanation.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div>
      <div className="section-hero">
        <div className="hero-text">
          <h2>Kho 120 Câu Hỏi Ôn Tập & 10 Bài Thực Hành Tự Luận</h2>
          <p>
            Bám sát 100% giáo trình. Học viên có thể làm thử và bấm <strong>"Xem đáp án & suy luận logic"</strong> để nắm chắc kiến thức.
          </p>
        </div>
        <div className="stats-badge-group">
          <span className="badge badge-primary">120 Câu Trắc Nghiệm</span>
          <span className="badge badge-success">6 Dạng Tương Tác</span>
          <span className="badge badge-warning">10 Bài Tự Luận</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="filter-toolbar">
        <div style={{ position: "relative" }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Tìm kiếm câu hỏi theo từ khóa, cú pháp, hàm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { id: "all", label: "Tất cả (120)" },
            { id: "single_choice", label: "ABCD (40)" },
            { id: "true_false", label: "Đúng/Sai (20)" },
            { id: "multiple_choice", label: "Nhiều đáp án (20)" },
            { id: "fill_blank", label: "Điền từ (15)" },
            { id: "sequence_order", label: "Sắp xếp (15)" },
            { id: "matching", label: "Ghép cặp (10)" },
            { id: "practical", label: "Tự Luận Code (10)" },
          ].map((chip) => (
            <button
              key={chip.id}
              className={`btn btn-sm ${filterType === chip.id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setFilterType(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Stream */}
      {filterType === "practical" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {PRACTICAL_DATA.map((p) => (
            <div key={p.id} className="q-card">
              <div className="q-card-header">
                <span className="q-badge">💻 TỰ LUẬN THỰC HÀNH {p.id}</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{p.title}</h3>
              <p style={{ color: "#475569", marginBottom: "0.8rem" }}>{p.description}</p>
              
              <div style={{ background: "#0f172a", color: "#f8fafc", padding: "0.8rem", borderRadius: "6px", fontFamily: "monospace", fontSize: "0.88rem", marginBottom: "0.8rem" }}>
                <small style={{ color: "#94a3b8", display: "block", marginBottom: "0.2rem" }}># Khung hàm khởi tạo:</small>
                {p.starter_code}
              </div>

              <details style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "0.8rem", borderRadius: "6px" }}>
                <summary style={{ cursor: "pointer", fontWeight: 700, color: "#166534" }}>
                  💡 Bấm để xem code mẫu chuẩn & giải thích logic ▼
                </summary>
                <pre style={{ marginTop: "0.5rem", background: "#ffffff", border: "1px solid #cbd5e1", padding: "0.6rem", borderRadius: "4px", fontFamily: "monospace", fontSize: "0.85rem", color: "#0f172a" }}>
                  {p.solution_code}
                </pre>
              </details>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredQuestions.length === 0 ? (
            <div className="q-card" style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
              Không tìm thấy câu hỏi nào phù hợp với bộ lọc tìm kiếm.
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} isExamMode={false} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
