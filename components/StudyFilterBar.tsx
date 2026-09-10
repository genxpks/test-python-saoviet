"use client";

import { Search, X, Sparkles } from "lucide-react";

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
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.75rem",
      flexWrap: "wrap",
      marginBottom: "1.1rem",
      background: "var(--surface-card)",
      border: "1px solid var(--border-light)",
      borderRadius: "12px",
      padding: "0.6rem 1rem",
      boxShadow: "var(--shadow-card)"
    }}>
      {/* Search Input Box */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", flex: "1 1 280px" }}>
        <div style={{
          position: "absolute",
          left: "0.75rem",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          pointerEvents: "none"
        }}>
          <Search size={15} />
        </div>

        <input
          type="text"
          style={{
            width: "100%",
            paddingLeft: "2.3rem",
            paddingRight: search ? "2.2rem" : "0.75rem",
            height: "36px",
            fontSize: "0.82rem",
            borderRadius: "8px",
            background: "var(--surface-subtle)",
            border: "1.5px solid var(--border-medium)",
            color: "var(--text-primary)",
            outline: "none",
            transition: "all 0.2s ease"
          }}
          placeholder="Tìm kiếm câu hỏi, từ khóa, lệnh Python..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#2563eb";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-medium)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />

        {search && (
          <button
            onClick={() => onSearchChange("")}
            style={{
              position: "absolute",
              right: "0.65rem",
              background: "var(--border-medium)",
              border: "none",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-primary)"
            }}
            title="Xóa tìm kiếm"
          >
            <X size={11} />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", alignItems: "center" }}>
        {chips.map((chip) => {
          const isActive = filterType === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => onFilterChange(chip.id)}
              style={{
                borderRadius: "7px",
                padding: "0.32rem 0.72rem",
                fontSize: "0.78rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                border: "1.5px solid",
                borderColor: isActive ? "#2563eb" : "var(--border-medium)",
                background: isActive ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "var(--surface-subtle)",
                color: isActive ? "#ffffff" : "var(--text-secondary)",
                cursor: "pointer",
                boxShadow: isActive ? "0 2px 8px rgba(37, 99, 235, 0.25)" : "none",
                transition: "all 0.15s ease"
              }}
            >
              <span>{chip.label}</span>
              <span
                style={{
                  fontSize: "0.68rem",
                  padding: "0.06rem 0.38rem",
                  borderRadius: "9999px",
                  background: isActive ? "rgba(255, 255, 255, 0.25)" : "var(--surface-card)",
                  border: isActive ? "none" : "1px solid var(--border-light)",
                  color: isActive ? "#ffffff" : "var(--text-muted)",
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
