"use client";

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
      <div style={{ position: "relative" }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Tìm kiếm theo từ khóa (ví dụ: f-string, list.append, turtle.speed, for...)"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {chips.map((chip) => {
          const isActive = filterType === chip.id;
          return (
            <button
              key={chip.id}
              className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
              onClick={() => onFilterChange(chip.id)}
            >
              <span>{chip.label}</span>
              <span
                style={{
                  background: isActive ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  fontSize: "0.72rem",
                  marginLeft: "4px"
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
