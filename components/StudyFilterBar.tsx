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
      background: "rgba(15, 23, 42, 0.88)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "16px",
      padding: "0.85rem 1.25rem",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.35)"
    }}>
      {/* Search Input Box */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", flex: "1 1 320px" }}>
        <div style={{
          position: "absolute",
          left: "1rem",
          color: "#94a3b8",
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
            background: "rgba(30, 41, 59, 0.8)",
            border: "1.5px solid #334155",
            color: "#ffffff",
            outline: "none",
            transition: "all 0.2s ease"
          }}
          placeholder="Tìm kiếm câu hỏi, từ khóa, lệnh Python..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3b82f6";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#334155";
            e.currentTarget.style.boxShadow = "none";
          }}
        />

        {search && (
          <button
            onClick={() => onSearchChange("")}
            style={{
              position: "absolute",
              right: "0.85rem",
              background: "rgba(255, 255, 255, 0.15)",
              border: "none",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#94a3b8"
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
                borderColor: isActive ? "#3b82f6" : "#334155",
                background: isActive ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "rgba(30, 41, 59, 0.7)",
                color: isActive ? "#ffffff" : "#cbd5e1",
                cursor: "pointer",
                boxShadow: isActive ? "0 2px 10px rgba(37, 99, 235, 0.35)" : "none",
                transition: "all 0.15s ease"
              }}
            >
              <span>{chip.label}</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "0.1rem 0.45rem",
                  borderRadius: "9999px",
                  background: isActive ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.08)",
                  color: isActive ? "#ffffff" : "#94a3b8",
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
