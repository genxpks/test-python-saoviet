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
  const [studyAnswers, setStudyAnswers] = useState<Record<number, any>>({});

  useEffect(() => {
    setQuestions(getQuestionsData());
    setPracticals(getPracticalsData());

    fetch("/api/questions")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          if (Array.isArray(data.questions) && data.questions.length > 0) {
            setQuestions(data.questions);
          }
          if (Array.isArray(data.practical_problems) && data.practical_problems.length > 0) {
            setPracticals(data.practical_problems);
          }
        }
      })
    try {
      const saved = localStorage.getItem("SAOVIET_STUDY_ANSWERS");
      if (saved) setStudyAnswers(JSON.parse(saved));
    } catch (e) {}
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
              color: "var(--primary)",
              letterSpacing: "0.04em",
              marginBottom: "0.5rem"
            }}>
              Study Center / Trung Tâm Ôn Luyện Chuẩn Khảo Thí
            </div>
            
            <h1 style={{
              fontSize: "clamp(2rem, 4vw, 2.6rem)",
              fontWeight: 900,
              letterSpacing: "-0.8px",
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
              fontFamily: "var(--font-heading)"
            }}>
              {currentSubject.name} — Ôn Tập & Luyện Code Web
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "650px", margin: "0 auto" }}>
              Nền tảng ôn luyện 120 câu trắc nghiệm chuẩn hóa và các bài toán thực hành vừa viết code vừa build chạy thử trực tiếp trên trình duyệt.
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
                borderRadius: "12px",
                border: studyMode === "quiz" ? "1.5px solid #2563eb" : "1.5px solid var(--border-medium)",
                background: studyMode === "quiz" ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "var(--surface-card)",
                color: studyMode === "quiz" ? "#ffffff" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.92rem",
                cursor: "pointer",
                boxShadow: studyMode === "quiz" ? "0 4px 15px rgba(37, 99, 235, 0.35)" : "var(--shadow-card)",
                transition: "all 0.2s ease"
              }}
            >
              <BookOpen size={18} />
              <span>📚 120 Câu Hỏi Ôn Tập ({questions.length} câu)</span>
            </button>

            <button
              onClick={() => { setStudyMode("coding"); setCurrentPage(1); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.75rem 1.4rem",
                borderRadius: "12px",
                border: studyMode === "coding" ? "1.5px solid #2563eb" : "1.5px solid var(--border-medium)",
                background: studyMode === "coding" ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "var(--surface-card)",
                color: studyMode === "coding" ? "#ffffff" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.92rem",
                cursor: "pointer",
                boxShadow: studyMode === "coding" ? "0 4px 15px rgba(37, 99, 235, 0.35)" : "var(--shadow-card)",
                transition: "all 0.2s ease"
              }}
            >
              <Terminal size={18} />
              <span>💻 Luyện Code Web IDE ({practicals.length} bài)</span>
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
                {/* Study Answers Progress Bar Container */}
                <div style={{ minHeight: "44px", marginBottom: "1rem" }}>
                  {Object.keys(studyAnswers).length > 0 ? (
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.6rem 1.1rem",
                      background: "rgba(37, 99, 235, 0.08)",
                      border: "1px solid rgba(37, 99, 235, 0.25)",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      color: "var(--primary)"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}>
                        <CheckCircle2 size={16} color="#2563eb" />
                        Tiến độ ôn tập: Đã làm {Object.keys(studyAnswers).length} / {questions.length} câu hỏi
                      </span>
                      <button
                        onClick={() => {
                          setStudyAnswers({});
                          try { localStorage.removeItem("SAOVIET_STUDY_ANSWERS"); } catch (e) {}
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          fontSize: "0.78rem",
                          cursor: "pointer",
                          textDecoration: "underline"
                        }}
                      >
                        Làm mới kết quả ôn
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      padding: "0.55rem 1rem",
                      borderRadius: "8px",
                      background: "var(--surface-subtle)",
                      border: "1px dashed var(--border-medium)",
                      color: "var(--text-muted)",
                      fontSize: "0.82rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <BookOpen size={14} color="#2563eb" />
                      <span>💡 Chọn đáp án, điền từ khóa hoặc sắp xếp bên dưới để kiểm tra và ghi nhận tiến độ ôn tập.</span>
                    </div>
                  )}
                </div>

                {paginatedQuestions.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    {paginatedQuestions.map((q, idx) => (
                      <QuestionCard
                        key={q.id}
                        question={q}
                        index={(currentPage - 1) * PAGE_SIZE + idx}
                        userAnswer={studyAnswers[q.id]}
                        onAnswerChange={(ans) => {
                          setStudyAnswers((prev) => {
                            const next = { ...prev, [q.id]: ans };
                            try { localStorage.setItem("SAOVIET_STUDY_ANSWERS", JSON.stringify(next)); } catch (e) {}
                            return next;
                          });
                        }}
                      />
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
                background: "linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(99, 102, 241, 0.08))",
                border: "1px solid rgba(2, 132, 199, 0.25)",
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
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#0284c7", fontWeight: 800, fontSize: "1.05rem" }}>
                    <Cpu size={20} />
                    <span>Trình Biên Dịch & Chấm Điểm Python 3.12 Trên Trình Duyệt</span>
                  </div>
                  <div style={{ fontSize: "0.86rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
                    Học viên vừa gõ code trực tiếp trên Web IDE, vừa bấm <strong>▶️ Chạy Thử Code</strong> để xem kết quả Console tức thì, sau đó bấm <strong>Chấm Điểm</strong> để kiểm tra qua 4/4 Test Cases!
                  </div>
                </div>

                <div style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "8px",
                  background: "rgba(2, 132, 199, 0.12)",
                  border: "1px solid rgba(2, 132, 199, 0.3)",
                  color: "#0284c7",
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
