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
      gap: "1rem",
      flexWrap: "wrap",
      marginBottom: "2rem",
      background: "var(--surface-card)",
      border: "1px solid var(--border-light)",
      borderRadius: "16px",
      padding: "0.85rem 1.25rem",
      boxShadow: "var(--shadow-card)"
    }}>
      {/* Search Input Box */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", flex: "1 1 320px" }}>
        <div style={{
          position: "absolute",
          left: "1rem",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          pointerEvents: "none"
        }}>
          <Search size={17} />
        </div>

        <input
          type="text"
          style={{
            width: "100%",
            paddingLeft: "2.75rem",
            paddingRight: search ? "2.5rem" : "1rem",
            height: "42px",
            fontSize: "0.9rem",
            borderRadius: "10px",
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
              right: "0.85rem",
              background: "var(--border-medium)",
              border: "none",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-primary)"
            }}
            title="Xóa tìm kiếm"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
        {chips.map((chip) => {
          const isActive = filterType === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => onFilterChange(chip.id)}
              style={{
                borderRadius: "8px",
                padding: "0.5rem 1rem",
                fontSize: "0.84rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                border: "1.5px solid",
                borderColor: isActive ? "#2563eb" : "var(--border-medium)",
                background: isActive ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "var(--surface-subtle)",
                color: isActive ? "#ffffff" : "var(--text-secondary)",
                cursor: "pointer",
                boxShadow: isActive ? "0 2px 10px rgba(37, 99, 235, 0.3)" : "none",
                transition: "all 0.15s ease"
              }}
            >
              <span>{chip.label}</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "0.1rem 0.45rem",
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
