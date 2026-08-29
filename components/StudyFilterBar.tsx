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
      background: "rgba(6, 14, 36, 0.75)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      border: "1.5px solid rgba(0, 245, 200, 0.22)",
      borderRadius: "20px",
      padding: "0.85rem 1.25rem",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 245, 200, 0.08)"
    }}>
      {/* Search Input Box */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", flex: "1 1 320px" }}>
        <div style={{
          position: "absolute",
          left: "1rem",
          color: "rgba(0, 245, 200, 0.65)",
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
            height: "44px",
            fontSize: "0.9rem",
            borderRadius: "12px",
            background: "rgba(3, 10, 26, 0.8)",
            border: "1.5px solid rgba(0, 245, 200, 0.3)",
            color: "#ffffff",
            outline: "none",
            boxShadow: "inset 0 0 10px rgba(0, 245, 200, 0.05)",
            transition: "all 0.2s ease"
          }}
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#00f5c8";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 245, 200, 0.3)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(0, 245, 200, 0.3)";
            e.currentTarget.style.boxShadow = "inset 0 0 10px rgba(0, 245, 200, 0.05)";
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

      {/* Filter Chips (Matching Approved Mockup Tabs) */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
        {chips.map((chip) => {
          const isActive = filterType === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => onFilterChange(chip.id)}
              style={{
                borderRadius: "10px",
                padding: "0.55rem 1.1rem",
                fontSize: "0.84rem",
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                border: "1.5px solid",
                borderColor: isActive ? "#00f5c8" : "rgba(255, 255, 255, 0.08)",
                background: isActive ? "linear-gradient(135deg, #00f5c8, #0ea5e9)" : "rgba(3, 10, 26, 0.6)",
                color: isActive ? "#020a14" : "#94a3b8",
                cursor: "pointer",
                boxShadow: isActive ? "0 4px 18px rgba(0, 245, 200, 0.4)" : "none",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <span>{chip.label}</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "0.1rem 0.45rem",
                  borderRadius: "9999px",
                  background: isActive ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.08)",
                  color: isActive ? "#020a14" : "#64748b",
                  fontWeight: 900
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
