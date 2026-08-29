"use client";

import { useState, useMemo, useEffect } from "react";
import { getQuestionsData, getPracticalsData } from "@/lib/questionsData";
import { Question, PracticalProblem } from "@/types";
import { DEFAULT_SUBJECTS } from "@/lib/usersData";
import QuestionCard from "@/components/QuestionCard";
import PracticalQuestionCard from "@/components/PracticalQuestionCard";
import StudyFilterBar from "@/components/StudyFilterBar";
import QuestionPagination from "@/components/QuestionPagination";
import AuthGate from "@/components/AuthGate";
import SubjectAccessGate from "@/components/SubjectAccessGate";
import { BookOpen, SearchX, Code2 } from "lucide-react";

const PAGE_SIZE = 10;

export default function StudyPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("python");
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [practicals, setPracticals] = useState<PracticalProblem[]>([]);

  useEffect(() => {
    setQuestions(getQuestionsData());
    setPracticals(getPracticalsData());
  }, []);

  const chips = [
    { id: "all", label: "Tất cả", count: questions.length },
    { id: "single_choice", label: "ABCD Trắc Nghiệm", count: questions.filter(q => q.type === "single_choice").length },
    { id: "true_false", label: "Đúng / Sai", count: questions.filter(q => q.type === "true_false").length },
    { id: "multiple_choice", label: "Nhiều Đáp Án", count: questions.filter(q => q.type === "multiple_choice").length },
    { id: "fill_blank", label: "Điền Từ", count: questions.filter(q => q.type === "fill_blank").length },
    { id: "sequence_order", label: "Sắp Xếp Dòng", count: questions.filter(q => q.type === "sequence_order").length },
    { id: "matching", label: "Ghép Cặp", count: questions.filter(q => q.type === "matching").length },
    { id: "practical", label: "Tự Luận Code", count: practicals.length },
  ];

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchType = filterType === "all" || q.type === filterType;
      const matchSearch =
        search === "" ||
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.explanation.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [questions, filterType, search]);

  const totalPages = Math.ceil(filteredQuestions.length / PAGE_SIZE);
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredQuestions.slice(start, start + PAGE_SIZE);
  }, [filteredQuestions, currentPage]);

  const handleFilterChange = (id: string) => {
    setFilterType(id);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const currentSubject = DEFAULT_SUBJECTS.find(s => s.id === selectedSubjectId) || DEFAULT_SUBJECTS[0];

  return (
    <AuthGate
      mode="study"
      subjectId={selectedSubjectId}
      pageTitle="Ngân Hàng Ôn Tập Lập Trình Chuẩn Hóa"
      pageDescription="Học viên vui lòng đăng nhập bằng SĐT và Mật khẩu (Tên+SĐT) để truy cập ngân hàng ôn tập."
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1.5rem 0.5rem" }}>
        {/* Subject Navigation Bar */}
        <div style={{
          background: "var(--surface-card)",
          padding: "0.85rem 1.1rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-light)",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          overflowX: "auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 800, color: "var(--text-muted)", marginRight: "0.5rem", whiteSpace: "nowrap" }}>
            <Code2 size={16} color="var(--brand-primary)" />
            <span>CHỌN MÔN HỌC:</span>
          </div>

          <div style={{ display: "flex", gap: "0.4rem" }}>
            {DEFAULT_SUBJECTS.map((subj) => {
              const isActive = selectedSubjectId === subj.id;
              return (
                <button
                  key={subj.id}
                  onClick={() => {
                    setSelectedSubjectId(subj.id);
                    setCurrentPage(1);
                  }}
                  className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
                  style={{
                    borderRadius: "var(--radius-full)",
                    padding: "0.35rem 0.85rem",
                    fontSize: "0.78rem",
                    whiteSpace: "nowrap"
                  }}
                >
                  <span>{subj.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Authorization RBAC Gate */}
        <SubjectAccessGate subjectId={selectedSubjectId}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{
              display: "inline-block",
              fontSize: "0.88rem",
              fontWeight: 700,
              color: "#00f5c8",
              letterSpacing: "0.04em",
              marginBottom: "0.5rem"
            }}>
              Study Page / Ôn Tập 120 Câu
            </div>
            
            <h1 style={{
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "-0.8px",
              color: "#ffffff",
              marginBottom: "0.5rem",
              fontFamily: "var(--font-heading)",
              textShadow: "0 0 30px rgba(0, 245, 200, 0.45)"
            }}>
              Ngân Hàng Ôn Tập 120 Câu
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "600px", margin: "0 auto" }}>
              {currentSubject.name} — Nền tảng ôn luyện kiến thức chuẩn hóa & bài tập thực chiến có giải thích chi tiết từ Thầy AI.
            </p>
          </div>

          <StudyFilterBar
            chips={chips}
            filterType={filterType}
            search={search}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
          />

          {filterType === "practical" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.5rem" }}>
              {practicals.map((p, idx) => (
                <PracticalQuestionCard key={p.id} problem={p} index={idx} />
              ))}
            </div>
          ) : (
            <div style={{ marginTop: "1.5rem" }}>
              {paginatedQuestions.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  {paginatedQuestions.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                  ))}
                </div>
              ) : (
                <div className="q-card" style={{ padding: "3rem 1rem", textAlign: "center" }}>
                  <SearchX size={42} color="#94a3b8" style={{ margin: "0 auto 1rem auto" }} />
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.4rem" }}>
                    Không tìm thấy câu hỏi phù hợp
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                    Thử đổi từ khóa tìm kiếm hoặc chọn lọc dạng câu hỏi khác.
                  </p>
                </div>
              )}

              {totalPages > 1 && (
                <QuestionPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredQuestions.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          )}
        </SubjectAccessGate>
      </div>
    </AuthGate>
  );
}
