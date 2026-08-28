"use client";

import { Question, PracticalProblem } from "@/types";
import { Layers, CheckCircle2, CircleDot, Clock, Award } from "lucide-react";

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
  const progressPercent = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  return (
    <aside className="exam-sidebar-card">
      {/* Title & Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, fontSize: "0.95rem" }}>
          <Layers size={17} color="var(--brand-primary)" />
          <span>Bản Đồ Câu Hỏi</span>
        </div>

        <span style={{
          fontSize: "0.78rem",
          fontWeight: 800,
          color: "var(--brand-primary)",
          background: "var(--brand-primary-light)",
          padding: "2px 8px",
          borderRadius: "var(--radius-full)",
          border: "1px solid rgba(37, 99, 235, 0.2)"
        }}>
          {totalAnswered}/{totalQuestions} ({progressPercent}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ width: "100%", height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden", marginBottom: "1rem" }}>
        <div
          style={{
            width: `${progressPercent}%`,
            height: "100%",
            background: "linear-gradient(90deg, var(--brand-primary), var(--brand-emerald))",
            borderRadius: "3px",
            transition: "width 0.3s ease"
          }}
        />
      </div>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem", paddingBottom: "0.6rem", borderBottom: "1px solid var(--border-light)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--brand-emerald)", display: "inline-block" }} /> Đã làm
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#cbd5e1", display: "inline-block" }} /> Chưa làm
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--brand-primary)", display: "inline-block" }} /> Đang xem
        </span>
      </div>

      {/* Part 1: MCQs Grid */}
      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
        <span>Phần 1: Trắc Nghiệm ({questions.length} câu)</span>
      </div>

      <div className="q-grid-matrix">
        {questions.map((q, idx) => {
          const isAnswered = userAnswers[q.id] !== undefined;
          const isCurrent = currentPart === 1 && currentIndex === idx;
          return (
            <button
              key={q.id}
              className={`q-grid-btn ${isAnswered ? "answered" : ""} ${isCurrent ? "current" : ""}`}
              onClick={() => onSelectMCQ(idx)}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Part 2: Practical Coding Grid */}
      {practicals.length > 0 && (
        <div style={{ marginTop: "1.2rem", paddingTop: "0.8rem", borderTop: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
            Phần 2: Tự Luận Code ({practicals.length} bài)
          </div>
          <div className="q-grid-matrix" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {practicals.map((p, idx) => {
              const isGraded = practicalResults[p.id]?.passed;
              const isCurrent = currentPart === 2 && currentIndex === idx;
              return (
                <button
                  key={p.id}
                  className={`q-grid-btn ${isGraded ? "answered" : ""} ${isCurrent ? "current" : ""}`}
                  onClick={() => onSelectPractical(idx)}
                >
                  TL {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
