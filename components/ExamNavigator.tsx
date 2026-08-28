"use client";

import { Question, PracticalProblem } from "@/types";

interface ExamNavigatorProps {
  questions: Question[];
  practicals: PracticalProblem[];
  currentPart: 1 | 2;
  currentIndex: number;
  userAnswers: Record<number, any>;
  practicalResults: Record<number, any>;
  onSelectMCQ: (idx: number) => void;
  onSelectPractical: (idx: number) => void;
}

export default function ExamNavigator({
  questions,
  practicals,
  currentPart,
  currentIndex,
  userAnswers,
  practicalResults,
  onSelectMCQ,
  onSelectPractical
}: ExamNavigatorProps) {
  const answeredMCQCount = Object.keys(userAnswers).length;
  const answeredPracticalCount = Object.keys(practicalResults).filter(k => practicalResults[Number(k)]?.passed).length;
  const totalAnswered = answeredMCQCount + answeredPracticalCount;
  const totalQuestions = questions.length + practicals.length;

  return (
    <aside className="exam-sidebar">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem", paddingBottom: "0.6rem", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Bản Đồ Câu Hỏi</h3>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)", background: "var(--primary-light)", padding: "2px 8px", borderRadius: "10px" }}>
          {totalAnswered} / {totalQuestions} Câu
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.8rem" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)", display: "inline-block" }}></span> Đã làm
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#e2e8f0", border: "1px solid #cbd5e1", display: "inline-block" }}></span> Chưa
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)", display: "inline-block" }}></span> Đang xem
        </span>
      </div>

      {/* Part 1 */}
      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.4rem" }}>
        Phần 1: Trắc Nghiệm ({questions.length} câu)
      </div>
      <div className="question-grid">
        {questions.map((q, idx) => {
          const isAnswered = userAnswers[q.id] !== undefined;
          const isCurrent = currentPart === 1 && currentIndex === idx;
          return (
            <button
              key={q.id}
              className={`grid-btn ${isAnswered ? "answered" : ""} ${isCurrent ? "current" : ""}`}
              onClick={() => onSelectMCQ(idx)}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Part 2 */}
      {practicals.length > 0 && (
        <>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginTop: "1rem", marginBottom: "0.4rem" }}>
            Phần 2: Tự Luận Viết Hàm ({practicals.length} bài)
          </div>
          <div className="question-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {practicals.map((p, idx) => {
              const isGraded = practicalResults[p.id]?.passed;
              const isCurrent = currentPart === 2 && currentIndex === idx;
              return (
                <button
                  key={p.id}
                  className={`grid-btn ${isGraded ? "answered" : ""} ${isCurrent ? "current" : ""}`}
                  onClick={() => onSelectPractical(idx)}
                >
                  TL {idx + 1}
                </button>
              );
            })}
          </div>
        </>
      )}
    </aside>
  );
}
