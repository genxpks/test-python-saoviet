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
import { BookOpen, SearchX, Code2, Terminal, Sparkles, Cpu, CheckCircle2 } from "lucide-react";

const PAGE_SIZE = 10;

export default function StudyPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("python");
  const [studyMode, setStudyMode] = useState<"quiz" | "coding">("quiz");
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

  const filteredPracticals = useMemo(() => {
    return practicals.filter((p) => {
      return search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    });
  }, [practicals, search]);

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
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              display: "inline-block",
              fontSize: "0.88rem",
              fontWeight: 700,
              color: "#00f5c8",
              letterSpacing: "0.04em",
              marginBottom: "0.5rem"
            }}>
              Study Center / Trung Tâm Ôn Luyện Chuẩn Khảo Thí
            </div>
            
            <h1 style={{
              fontSize: "clamp(2rem, 4vw, 2.6rem)",
              fontWeight: 900,
              letterSpacing: "-0.8px",
              color: "#ffffff",
              marginBottom: "0.5rem",
              fontFamily: "var(--font-heading)",
              textShadow: "0 0 30px rgba(0, 245, 200, 0.45)"
            }}>
              {currentSubject.name} — Ôn Tập & Luyện Code Web
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "650px", margin: "0 auto" }}>
              Nền tảng ôn luyện 120 câu trắc nghiệm chuẩn hóa và 10 bài toán thực hành vừa viết code vừa build chạy thử trực tiếp trên trình duyệt.
            </p>
          </div>

          {/* Mode Switch: 120 Câu Trắc Nghiệm vs Luyện Code Thực Hành */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.8rem",
            marginBottom: "2rem",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => { setStudyMode("quiz"); setCurrentPage(1); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.75rem 1.4rem",
                borderRadius: "14px",
                border: studyMode === "quiz" ? "1.5px solid #00f5c8" : "1px solid rgba(255,255,255,0.12)",
                background: studyMode === "quiz" ? "linear-gradient(135deg, rgba(0,245,200,0.2), rgba(14,165,233,0.2))" : "rgba(15,23,42,0.6)",
                color: studyMode === "quiz" ? "#00f5c8" : "#94a3b8",
                fontWeight: 800,
                fontSize: "0.92rem",
                cursor: "pointer",
                boxShadow: studyMode === "quiz" ? "0 0 20px rgba(0,245,200,0.25)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <BookOpen size={18} />
              <span>📚 120 Câu Hỏi Ôn Tập Chuẩn Hóa ({questions.length} câu)</span>
            </button>

            <button
              onClick={() => { setStudyMode("coding"); setCurrentPage(1); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.75rem 1.4rem",
                borderRadius: "14px",
                border: studyMode === "coding" ? "1.5px solid #00f5c8" : "1px solid rgba(255,255,255,0.12)",
                background: studyMode === "coding" ? "linear-gradient(135deg, rgba(0,245,200,0.2), rgba(14,165,233,0.2))" : "rgba(15,23,42,0.6)",
                color: studyMode === "coding" ? "#00f5c8" : "#94a3b8",
                fontWeight: 800,
                fontSize: "0.92rem",
                cursor: "pointer",
                boxShadow: studyMode === "coding" ? "0 0 20px rgba(0,245,200,0.25)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <Terminal size={18} />
              <span>💻 Luyện Code & Chạy Thử Web IDE ({practicals.length} bài)</span>
            </button>
          </div>

          {/* VIEW 1: 120 CÂU HỎI TRẮC NGHIỆM */}
          {studyMode === "quiz" && (
            <div>
              <StudyFilterBar
                chips={chips}
                filterType={filterType}
                search={search}
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
              />

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
            </div>
          )}

          {/* VIEW 2: LUYỆN VIẾT CODE & BIÊN DỊCH TRỰC TIẾP TRÊN TRÌNH DUYỆT */}
          {studyMode === "coding" && (
            <div>
              {/* Instructions banner */}
              <div style={{
                background: "linear-gradient(135deg, rgba(0, 245, 200, 0.1), rgba(14, 165, 233, 0.1))",
                border: "1px solid rgba(0, 245, 200, 0.3)",
                borderRadius: "14px",
                padding: "1rem 1.4rem",
                marginBottom: "1.8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#00f5c8", fontWeight: 800, fontSize: "1.05rem" }}>
                    <Cpu size={20} />
                    <span>Trình Biên Dịch & Chấm Điểm Python 3.12 Trên Trình Duyệt</span>
                  </div>
                  <div style={{ fontSize: "0.86rem", color: "#cbd5e1", marginTop: "0.3rem" }}>
                    Học viên vừa gõ code trực tiếp trên Web IDE, vừa bấm <strong>▶️ Chạy Thử Code</strong> để xem kết quả Console tức thì, sau đó bấm <strong>Chấm Điểm</strong> để kiểm tra qua 4/4 Test Cases!
                  </div>
                </div>

                <div style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "8px",
                  background: "rgba(0, 245, 200, 0.15)",
                  border: "1px solid rgba(0, 245, 200, 0.4)",
                  color: "#00f5c8",
                  fontSize: "0.82rem",
                  fontWeight: 800
                }}>
                  {filteredPracticals.length} Bài Thực Hành Sẵn Sàng
                </div>
              </div>

              {/* Practicals List with Embedded IDEs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
                {filteredPracticals.map((p, idx) => (
                  <PracticalQuestionCard key={p.id} problem={p} index={idx} />
                ))}
              </div>
            </div>
          )}
        </SubjectAccessGate>
      </div>
    </AuthGate>
  );
}
