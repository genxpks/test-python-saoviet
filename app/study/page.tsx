"use client";

import { useState, useMemo, useEffect } from "react";
import { getQuestionsData, getPracticalsData } from "@/lib/questionsData";
import { Question, PracticalProblem } from "@/types";
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

  // Filtered List
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
      <div className="section-hero" style={{ padding: "2.4rem 2rem", marginBottom: "1.8rem" }}>
        <div className="hero-content">
          <div className="hero-tagline">
            <BookOpen size={14} />
            <span>NGÂN HÀNG ÔN TẬP TOÀN DIỆN</span>
          </div>

          <h2 style={{ fontSize: "1.9rem", fontWeight: 900, marginBottom: "0.5rem" }}>
            Ôn Tập & Khảo Sát Kiến Thức Python Nâng Cao
          </h2>

          <p style={{ color: "#94a3b8", fontSize: "0.95rem", maxWidth: "760px", lineHeight: "1.6" }}>
            Hệ thống ngân hàng câu hỏi đa dạng 6 dạng tương tác kết hợp 10 bài toán tự luận thuật toán. 
            Mỗi câu đều tích hợp phân tích logic chuyên sâu và trợ lý AI giải thích tức thời.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#cbd5e1" }}>
              <Layers size={16} color="var(--brand-cyan)" />
              <span>{questions.length} Câu Trắc Nghiệm Đa Dạng</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#cbd5e1" }}>
              <Code2 size={16} color="var(--brand-emerald)" />
              <span>{practicals.length} Bài Tập Viết Hàm Tự Luận</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#cbd5e1" }}>
              <Bot size={16} color="#fbbf24" />
              <span>Trợ Lý Gemini AI Chữa Bài 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <StudyFilterBar
        chips={chips}
        filterType={filterType}
        search={search}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
      />

      {/* Questions List */}
      {filterType === "practical" ? (
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "var(--radius-md)",
            padding: "1rem 1.4rem",
            marginBottom: "1.4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.8rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Code2 size={24} color="var(--brand-emerald-dark)" />
              <div>
                <strong style={{ fontSize: "1rem", color: "#065f46" }}>10 Bài Toán Thuật Toán Thực Hành Tự Luận</strong>
                <p style={{ margin: 0, fontSize: "0.84rem", color: "#047857" }}>
                  Tập trung kỹ năng viết hàm <code>def</code>, vòng lặp, xử lý cấu trúc dữ liệu và giải quyết bài toán thực tế.
                </p>
              </div>
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#065f46", background: "#d1fae5", padding: "4px 10px", borderRadius: "var(--radius-full)" }}>
              {practicals.length} Thử thách
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
            {practicals.map((p) => (
              <PracticalQuestionCard key={p.id} problem={p} />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "1.5rem" }}>
          {filteredQuestions.length === 0 ? (
            <div className="q-card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <SearchX size={48} color="var(--text-muted)" style={{ margin: "0 auto 1rem auto", display: "block" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.3rem" }}>Không tìm thấy câu hỏi phù hợp</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Vui lòng thử tìm kiếm với từ khóa khác hoặc chọn xem danh mục "Tất cả".
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
                {paginatedQuestions.map((q) => (
                  <QuestionCard key={q.id} question={q} />
                ))}
              </div>

              {/* Pagination Controls */}
              <QuestionPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredQuestions.length}
                pageSize={PAGE_SIZE}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 380, behavior: "smooth" });
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
