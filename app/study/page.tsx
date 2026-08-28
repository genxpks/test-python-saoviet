"use client";

import { useState, useMemo } from "react";
import { QUESTIONS_DATA, PRACTICAL_DATA } from "@/lib/questionsData";
import QuestionCard from "@/components/QuestionCard";
import PracticalQuestionCard from "@/components/PracticalQuestionCard";
import StudyFilterBar from "@/components/StudyFilterBar";
import QuestionPagination from "@/components/QuestionPagination";

const PAGE_SIZE = 10;

export default function StudyPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const chips = [
    { id: "all", label: "Tất cả", count: QUESTIONS_DATA.length },
    { id: "single_choice", label: "ABCD", count: QUESTIONS_DATA.filter(q => q.type === "single_choice").length },
    { id: "true_false", label: "Đúng/Sai", count: QUESTIONS_DATA.filter(q => q.type === "true_false").length },
    { id: "multiple_choice", label: "Nhiều đáp án", count: QUESTIONS_DATA.filter(q => q.type === "multiple_choice").length },
    { id: "fill_blank", label: "Điền từ", count: QUESTIONS_DATA.filter(q => q.type === "fill_blank").length },
    { id: "sequence_order", label: "Sắp xếp", count: QUESTIONS_DATA.filter(q => q.type === "sequence_order").length },
    { id: "matching", label: "Ghép cặp", count: QUESTIONS_DATA.filter(q => q.type === "matching").length },
    { id: "practical", label: "Tự Luận Code", count: PRACTICAL_DATA.length },
  ];

  // Filtered List
  const filteredQuestions = useMemo(() => {
    return QUESTIONS_DATA.filter((q) => {
      const matchType = filterType === "all" || q.type === filterType;
      const matchSearch =
        search === "" ||
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.explanation.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [filterType, search]);

  // Paginated Slices (Only renders 10 items at a time for high performance)
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

  return (
    <div>
      {/* Header Banner */}
      <div className="section-hero">
        <div className="hero-text">
          <h2>Kho 120 Câu Hỏi Ôn Tập & 10 Bài Thực Hành Tự Luận</h2>
          <p>
            Bám sát 100% giáo trình. Học viên có thể làm thử và bấm <strong>"💡 Xem đáp án & suy luận logic"</strong> hoặc <strong>"🤖 Nhờ Thầy AI Chữa Bài"</strong> để nắm chắc kiến thức.
          </p>
        </div>
        <div className="badge-group">
          <span className="badge badge-primary">120 Câu Trắc Nghiệm</span>
          <span className="badge badge-success">6 Dạng Tương Tác</span>
          <span className="badge badge-warning">10 Bài Tự Luận</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <StudyFilterBar
        filterType={filterType}
        search={search}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        chips={chips}
      />

      {/* Questions Stream */}
      {filterType === "practical" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {PRACTICAL_DATA.map((p, idx) => (
            <PracticalQuestionCard key={p.id} problem={p} index={idx} />
          ))}
        </div>
      ) : (
        <div>
          {filteredQuestions.length === 0 ? (
            <div className="q-card" style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔍</div>
              Không tìm thấy câu hỏi nào phù hợp với bộ lọc tìm kiếm của bạn.
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {paginatedQuestions.map((q) => (
                  <QuestionCard key={q.id} question={q} isExamMode={false} />
                ))}
              </div>

              {/* Pagination Controls */}
              <QuestionPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredQuestions.length}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 180, behavior: "smooth" });
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
