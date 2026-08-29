"use client";

type Archetype = "single_choice" | "true_false" | "multiple_choice" | "fill_blank" | "sequence_order" | "matching";

interface ArchetypeNavTabsProps {
  activeArchetype: Archetype;
  onSelectArchetype: (tab: Archetype) => void;
}

const TABS = [
  { id: "single_choice", label: "1. Trắc Nghiệm ABCD" },
  { id: "true_false", label: "2. Đúng / Sai" },
  { id: "multiple_choice", label: "3. Nhiều Lựa Chọn" },
  { id: "fill_blank", label: "4. Điền Từ Khuyết" },
  { id: "sequence_order", label: "5. Sắp Xếp Dòng Code" },
  { id: "matching", label: "6. Ghép Cặp Khái Niệm" }
];

export default function ArchetypeNavTabs({ activeArchetype, onSelectArchetype }: ArchetypeNavTabsProps) {
  return (
    <div style={{
      display: "flex",
      gap: "0.4rem",
      justifyContent: "center",
      flexWrap: "wrap",
      marginBottom: "1.5rem"
    }}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelectArchetype(tab.id as Archetype)}
          className={`btn btn-sm ${activeArchetype === tab.id ? "btn-primary" : "btn-secondary"}`}
          style={{ borderRadius: "var(--radius-full)", padding: "0.4rem 0.95rem" }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
