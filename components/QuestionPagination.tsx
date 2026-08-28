"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function QuestionPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange
}: QuestionPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        padding: "1.1rem 1.4rem",
        background: "#ffffff",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-light)",
        marginTop: "1.8rem",
        boxShadow: "var(--shadow-subtle)"
      }}
    >
      <span style={{ fontSize: "0.88rem", color: "var(--text-muted)", fontWeight: 600 }}>
        Đang xem câu <strong style={{ color: "var(--text-primary)" }}>{startItem} – {endItem}</strong> trong tổng số <strong style={{ color: "var(--brand-primary)" }}>{totalItems}</strong> câu
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={15} />
          <span>Trước</span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            className={`btn btn-sm ${currentPage === pageNum ? "btn-primary" : "btn-secondary"}`}
            onClick={() => onPageChange(pageNum)}
            style={{
              minWidth: "36px",
              height: "34px",
              padding: "0 0.5rem",
              fontWeight: currentPage === pageNum ? 800 : 600
            }}
          >
            {pageNum}
          </button>
        ))}

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span>Sau</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
