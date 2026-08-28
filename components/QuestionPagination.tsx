"use client";

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
        padding: "1rem 1.2rem",
        background: "#ffffff",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
        marginTop: "1.5rem",
        boxShadow: "var(--shadow-sm)"
      }}
    >
      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
        Hiển thị câu <strong>{startItem} – {endItem}</strong> trên tổng số <strong>{totalItems}</strong> câu
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ◀ Trang Trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            className={`btn btn-sm ${currentPage === pageNum ? "btn-primary" : "btn-secondary"}`}
            onClick={() => onPageChange(pageNum)}
            style={{ minWidth: "34px", padding: "0.35rem 0.6rem" }}
          >
            {pageNum}
          </button>
        ))}

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Trang Kế ▶
        </button>
      </div>
    </div>
  );
}
