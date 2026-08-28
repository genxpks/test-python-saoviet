"use client";

import { useState, useMemo } from "react";
import { QUESTIONS_DATA, PRACTICAL_DATA } from "@/lib/questionsData";
import QuestionCard from "@/components/QuestionCard";
import PracticalQuestionCard from "@/components/PracticalQuestionCard";
import StudyFilterBar from "@/components/StudyFilterBar";
import QuestionPagination from "@/components/QuestionPagination";
import { BookOpen, Sparkles, Code2, Bot, Layers, SearchX } from "lucide-react";

const PAGE_SIZE = 10;

export default function StudyPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const chips = [
    { id: "all", label: "Tất cả", count: QUESTIONS_DATA.length },
    { id: "single_choice", label: "ABCD Trắc Nghiệm", count: QUESTIONS_DATA.filter(q => q.type === "single_choice").length },
    { id: "true_false", label: "Đúng / Sai", count: QUESTIONS_DATA.filter(q => q.type === "true_false").length },
    { id: "multiple_choice", label: "Nhiều Đáp Án", count: QUESTIONS_DATA.filter(q => q.type === "multiple_choice").length },
    { id: "fill_blank", label: "Điền Từ", count: QUESTIONS_DATA.filter(q => q.type === "fill_blank").length },
    { id: "sequence_order", label: "Sắp Xếp Dòng", count: QUESTIONS_DATA.filter(q => q.type === "sequence_order").length },
    { id: "matching", label: "Ghép Cặp", count: QUESTIONS_DATA.filter(q => q.type === "matching").length },
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
      <div className="section-hero" style={{ padding: "2.2rem 2rem", marginBottom: "1.5rem" }}>
        <div className="hero-content">
          <div className="hero-tagline">
            <BookOpen size={14} />
            <span>NGÂN HÀNG HỌC LIỆU CHÍNH THỨC</span>
          </div>

          <h2 style={{ fontSize: "1.85rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Kho 120 Câu Hỏi Ôn Tập & 10 Bài Thực Hành Tự Luận
          </h2>

          <p style={{ color: "#94a3b8", fontSize: "0.98rem", maxWidth: "780px" }}>
            Bám sát 100% giáo trình Python Nâng Cao. Học viên có thể tự làm bài, bấm <strong>"💡 Xem đáp án & suy luận logic"</strong> hoặc gọi <strong>"🤖 Thầy AI Chữa Bài Chi Tiết"</strong> để hiểu sâu bản chất vấn đề.
          </p>

          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1.2rem" }}>
            <span style={{
              background: "rgba(37, 99, 235, 0.2)",
              color: "#60a5fa",
              border: "1px solid rgba(37, 99, 235, 0.4)",
              padding: "0.3rem 0.8rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 700
            }}>
              120 Câu Trắc Nghiệm
            </span>

            <span style={{
              background: "rgba(16, 185, 129, 0.2)",
              color: "#34d399",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              padding: "0.3rem 0.8rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 700
            }}>
              06 Dạng Tương Tác
            </span>

            <span style={{
              background: "rgba(245, 158, 11, 0.2)",
              color: "#fbbf24",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              padding: "0.3rem 0.8rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 700
            }}>
              10 Bài Tự Luận Code
            </span>
          </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          {PRACTICAL_DATA.map((p, idx) => (
            <PracticalQuestionCard key={p.id} problem={p} index={idx} />
          ))}
        </div>
      ) : (
        <div>
          {filteredQuestions.length === 0 ? (
            <div className="q-card" style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
              <div style={{
                width: "60px",
                height: "60px",
                background: "rgba(244, 63, 94, 0.1)",
                color: "var(--brand-rose)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem auto"
              }}>
                <SearchX size={30} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.4rem" }}>
                Không tìm thấy câu hỏi phù hợp
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "450px", margin: "0 auto 1.2rem auto" }}>
                Không có câu hỏi nào khớp với từ khóa "<strong>{search}</strong>" trong dạng bài đang chọn.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearch("");
                  setFilterType("all");
                }}
              >
                Xóa Bộ Lọc Tìm Kiếm
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
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
