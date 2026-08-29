"use client";

import { Search, X, Filter, Sparkles } from "lucide-react";

interface FilterChip {
  id: string;
  label: string;
  count: number;
}

interface StudyFilterBarProps {
  filterType: string;
  search: string;
  onFilterChange: (id: string) => void;
  onSearchChange: (search: string) => void;
  chips: FilterChip[];
}

export default function StudyFilterBar({
  filterType,
  search,
  onFilterChange,
  onSearchChange,
  chips
}: StudyFilterBarProps) {
  return (
    <div className="filter-toolbar">
      {/* Search Input Box */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <div style={{
          position: "absolute",
          left: "1rem",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          pointerEvents: "none"
        }}>
          <Search size={18} />
        </div>

        <input
          type="text"
          className="form-input"
          style={{
            paddingLeft: "2.75rem",
            paddingRight: search ? "2.5rem" : "1rem",
            height: "46px",
            fontSize: "0.92rem",
            borderRadius: "var(--radius-md)"
          }}
          placeholder="Tìm kiếm theo từ khóa (Ví dụ: f-string, list.append, turtle, def, tuple, split...)"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        {search && (
          <button
            onClick={() => onSearchChange("")}
            style={{
              position: "absolute",
              right: "0.85rem",
              background: "#e2e8f0",
              border: "none",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#475569"
            }}
            title="Xóa tìm kiếm"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Chips Stream */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", alignItems: "center" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
          fontWeight: 700,
          marginRight: "0.3rem"
        }}>
          <Filter size={14} />
          <span>Phân loại câu:</span>
        </div>

        {chips.map((chip) => {
          const isActive = filterType === chip.id;
          return (
            <button
              key={chip.id}
              className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
              onClick={() => onFilterChange(chip.id)}
              style={{
                borderRadius: "var(--radius-full)",
                padding: "0.35rem 0.85rem",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <span>{chip.label}</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "0.1rem 0.4rem",
                  borderRadius: "var(--radius-full)",
                  background: isActive ? "rgba(255, 255, 255, 0.25)" : "rgba(15, 23, 42, 0.08)",
                  color: isActive ? "#ffffff" : "var(--text-secondary)",
                  fontWeight: 800
                }}
              >
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
