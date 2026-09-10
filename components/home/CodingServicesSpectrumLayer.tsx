"use client";

import { useState, useMemo } from "react";
import { 
  CODING_LANGUAGES, 
  CodingLanguageItem 
} from "@/lib/saovietData";
import { 
  Code2, 
  Terminal, 
  Layers, 
  Cpu, 
  Globe, 
  Smartphone, 
  Server, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Search, 
  X, 
  BookOpen, 
  Flame, 
  ShieldCheck, 
  Clock, 
  GraduationCap,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export default function CodingServicesSpectrumLayer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCurriculumModal, setActiveCurriculumModal] = useState<CodingLanguageItem | null>(null);

  const categories = [
    { id: "all", label: "Tất Cả (13 Khóa)", icon: Layers },
    { id: "core", label: "Ngôn Ngữ Cốt Lõi", icon: Cpu },
    { id: "frontend", label: "Web Frontend", icon: Globe },
    { id: "backend", label: "Backend & Microservices", icon: Server },
    { id: "fullstack", label: "Fullstack Next.js", icon: Code2 },
    { id: "mobile", label: "Di Động Android", icon: Smartphone },
  ];

  const filteredLanguages = useMemo(() => {
    return CODING_LANGUAGES.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchQuery = 
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.curriculumRef.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectCourseToBook = (courseName: string) => {
    // Cuộn xuống khu vực đăng ký tư vấn và tự điền
    const bookingEl = document.getElementById("dang-ky-tu-van");
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: "smooth" });
      const selectCourse = document.getElementById("select-course-input") as HTMLSelectElement | null;
      if (selectCourse) {
        selectCourse.value = courseName;
        // Kích hoạt event change
        selectCourse.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  };

  return (
    <section 
      id="dich-vu-coding" 
      style={{ 
        marginTop: "3rem", 
        marginBottom: "3rem",
        position: "relative" 
      }}
    >
      {/* SECTION HEADER: Thanh thoát, tỷ lệ 60% vừa vặn */}
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.25rem 0.75rem",
          borderRadius: "var(--radius-full)",
          background: "linear-gradient(135deg, rgba(0, 245, 200, 0.12), rgba(37, 99, 235, 0.1))",
          border: "1px solid rgba(0, 245, 200, 0.35)",
          color: "var(--brand-primary)",
          fontSize: "0.78rem",
          fontWeight: 800,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          marginBottom: "0.5rem"
        }}>
          <Code2 size={13} />
          <span>Hệ Thống Đào Tạo Lập Trình Thực Chiến Sao Việt</span>
        </div>

        <h2 style={{
          fontSize: "clamp(1.4rem, 2.3vw, 1.95rem)",
          fontWeight: 900,
          color: "var(--text-primary)",
          lineHeight: 1.25,
          letterSpacing: "-0.5px",
          marginBottom: "0.45rem"
        }}>
          13+ Ngôn Ngữ & Ngăn Xếp Công Nghệ Lập Trình Chủ Lực
        </h2>

        <p style={{
          fontSize: "0.86rem",
          color: "var(--text-secondary)",
          maxWidth: "780px",
          margin: "0 auto",
          lineHeight: 1.45
        }}>
          Từ nền tảng thuật toán <strong style={{ color: "var(--brand-primary)" }}>Python, C/C++, Java, C#</strong> đến chuyên sâu{" "}
          <strong style={{ color: "#38bdf8" }}>Web React, Next.js, Backend Spring Boot, .NET 8, Node.js, PHP Laravel & Di động Android</strong>. 
          Giáo trình chuẩn hóa bám sát đề cương các trường Đại học lớn và nhu cầu tuyển dụng doanh nghiệp.
        </p>
      </div>

      {/* FILTER & SEARCH BAR: Gọn gàng, linh hoạt */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        background: "var(--surface-card)",
        padding: "0.55rem 0.85rem",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-medium)",
        boxShadow: "var(--shadow-subtle)",
        marginBottom: "1.5rem"
      }}>
        {/* Category Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.3rem 0.65rem",
                  borderRadius: "var(--radius-full)",
                  border: isSelected ? "1.5px solid var(--brand-primary)" : "1px solid var(--border-light)",
                  background: isSelected 
                    ? "linear-gradient(135deg, rgba(0, 245, 200, 0.18), rgba(37, 99, 235, 0.12))" 
                    : "transparent",
                  color: isSelected ? "var(--brand-primary)" : "var(--text-secondary)",
                  fontSize: "0.78rem",
                  fontWeight: isSelected ? 800 : 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <IconComponent size={13} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          background: "var(--surface-sunken)",
          padding: "0.3rem 0.65rem",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-medium)",
          width: "100%",
          maxWidth: "260px"
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Tìm Python, C++, React, Spring..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.78rem",
              width: "100%"
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* GRID 13+ CARDS: Thẻ tinh gọn ~60%, thông tin dày đặc, không bị phình to */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
        gap: "0.95rem"
      }}>
        {filteredLanguages.map((item) => (
          <div
            key={item.id}
            style={{
              background: "var(--surface-card)",
              border: `1.5px solid ${item.borderColor}`,
              borderRadius: "var(--radius-md)",
              padding: "0.9rem",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "var(--shadow-subtle)"
            }}
            className="hover-card-elevation"
          >
            {/* Top Accent Gradient Bar */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: `linear-gradient(90deg, ${item.color}, transparent)`
            }} />

            {/* Header: Icon + Name + Badge */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem", marginBottom: "0.5rem" }}>
              <div style={{
                fontSize: "1.4rem",
                width: "36px",
                height: "36px",
                minWidth: "36px",
                borderRadius: "var(--radius-sm)",
                background: item.bgGradient,
                border: `1px solid ${item.borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {item.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.15rem" }}>
                  <span style={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.1rem 0.4rem",
                    borderRadius: "4px",
                    background: `${item.color}15`,
                    color: item.color,
                    border: `1px solid ${item.color}35`
                  }}>
                    {item.badge}
                  </span>
                  <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    {item.categoryLabel}
                  </span>
                </div>

                <h3 style={{
                  fontSize: "0.92rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  margin: 0,
                  lineHeight: 1.25
                }}>
                  {item.name}
                </h3>
              </div>
            </div>

            {/* Level & Duration Info */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.72rem",
              background: "var(--surface-sunken)",
              padding: "0.3rem 0.5rem",
              borderRadius: "4px",
              border: "1px solid var(--border-light)",
              marginBottom: "0.55rem",
              color: "var(--text-secondary)"
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <GraduationCap size={12} color={item.color} />
                <span>{item.level}</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "3px", fontWeight: 700, color: "var(--text-primary)" }}>
                <Clock size={11} />
                <span>{item.duration}</span>
              </span>
            </div>

            {/* Highlights List: 3 gạch đầu dòng cô đọng */}
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 0.6rem 0",
              display: "flex",
              flexDirection: "column",
              gap: "0.32rem",
              flex: 1
            }}>
              {item.highlights.slice(0, 3).map((hl, i) => (
                <li key={i} style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.35rem",
                  lineHeight: 1.35
                }}>
                  <CheckCircle2 size={12} color={item.color} style={{ minWidth: "12px", marginTop: "2px" }} />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>

            {/* Tech Stack Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.28rem", marginBottom: "0.6rem" }}>
              {item.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "0.66rem",
                    fontWeight: 700,
                    padding: "0.1rem 0.4rem",
                    borderRadius: "3px",
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-primary)"
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Output Project Banner */}
            <div style={{
              fontSize: "0.7rem",
              padding: "0.32rem 0.5rem",
              background: "linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,245,200,0.04))",
              borderLeft: `2.5px solid ${item.color}`,
              borderRadius: "0 4px 4px 0",
              color: "var(--text-secondary)",
              marginBottom: "0.75rem",
              lineHeight: 1.3
            }}>
              <strong style={{ color: "var(--text-primary)" }}>Đồ án:</strong> {item.outputProject}
            </div>

            {/* Action Buttons: 2 nút gọn gàng */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginTop: "auto" }}>
              <button
                onClick={() => setActiveCurriculumModal(item)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.25rem",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface-sunken)",
                  border: "1px solid var(--border-medium)",
                  color: "var(--text-primary)",
                  fontSize: "0.73rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background 0.15s ease"
                }}
              >
                <BookOpen size={12} />
                <span>Xem Đề Cương</span>
              </button>

              <button
                onClick={() => handleSelectCourseToBook(item.name)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.25rem",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "var(--radius-sm)",
                  background: `linear-gradient(135deg, ${item.color}, #0284c7)`,
                  border: "none",
                  color: "#ffffff",
                  fontSize: "0.73rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(2, 132, 199, 0.25)",
                  transition: "opacity 0.15s ease"
                }}
              >
                <span>Học Kèm 1-1</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CHI TIẾT ĐỀ CƯƠNG GIÁO TRÌNH CHUẨN SAO VIỆT */}
      {activeCurriculumModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(2, 6, 18, 0.78)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: "1rem"
        }}>
          <div style={{
            maxWidth: "580px",
            width: "100%",
            background: "var(--surface-card)",
            border: `1.5px solid ${activeCurriculumModal.borderColor}`,
            borderRadius: "var(--radius-lg)",
            padding: "1.4rem",
            position: "relative",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            {/* Close Button */}
            <button
              onClick={() => setActiveCurriculumModal(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "var(--surface-sunken)",
                border: "1px solid var(--border-medium)",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
                cursor: "pointer"
              }}
            >
              <X size={15} />
            </button>

            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <div style={{
                fontSize: "1.8rem",
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                background: activeCurriculumModal.bgGradient,
                border: `1.5px solid ${activeCurriculumModal.borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {activeCurriculumModal.icon}
              </div>

              <div>
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: activeCurriculumModal.color,
                  textTransform: "uppercase"
                }}>
                  {activeCurriculumModal.curriculumCode} • {activeCurriculumModal.categoryLabel}
                </span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>
                  {activeCurriculumModal.name}
                </h3>
              </div>
            </div>

            {/* Source Reference Tag */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "var(--surface-sunken)",
              padding: "0.35rem 0.65rem",
              borderRadius: "4px",
              border: "1px solid var(--border-light)",
              fontSize: "0.74rem",
              color: "var(--text-muted)",
              marginBottom: "1rem"
            }}>
              <ShieldCheck size={13} color="var(--brand-primary)" />
              <span>Học liệu đối chuẩn: <strong style={{ color: "var(--text-primary)" }}>{activeCurriculumModal.curriculumRef}</strong></span>
            </div>

            {/* Key Highlights */}
            <div style={{ marginBottom: "1rem" }}>
              <h4 style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                Khung Kiến Thức & Kỹ Năng Đạt Được:
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {activeCurriculumModal.highlights.map((hl, i) => (
                  <div key={i} style={{
                    fontSize: "0.78rem",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.4rem",
                    lineHeight: 1.4
                  }}>
                    <CheckCircle2 size={13} color={activeCurriculumModal.color} style={{ minWidth: "13px", marginTop: "2px" }} />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard 3-Tier Exercises Sao Viet */}
            <div style={{
              background: "var(--surface-sunken)",
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-light)",
              marginBottom: "1.1rem"
            }}>
              <h4 style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "4px" }}>
                <Flame size={13} color="#f59e0b" />
                <span>Quy Chuẩn Bài Tập 3 Cấp Độ (Chuẩn WEB-001 Sao Việt):</span>
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem", fontSize: "0.72rem" }}>
                <div style={{ padding: "0.35rem", background: "var(--surface-card)", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
                  <strong style={{ color: "#10b981", display: "block" }}>01. Cơ Bản</strong>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>Nền tảng & cú pháp chuẩn</span>
                </div>
                <div style={{ padding: "0.35rem", background: "var(--surface-card)", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
                  <strong style={{ color: "#0284c7", display: "block" }}>02. Mở Rộng</strong>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>Tình huống nghiệp vụ thực tế</span>
                </div>
                <div style={{ padding: "0.35rem", background: "var(--surface-card)", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
                  <strong style={{ color: "#8b5cf6", display: "block" }}>03. Nâng Cao</strong>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>Tối ưu bộ nhớ & kiến trúc</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.6rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Hotline tư vấn: <strong style={{ color: "var(--brand-primary)" }}>093 11 44 858</strong>
              </span>

              <button
                onClick={() => {
                  const courseName = activeCurriculumModal.name;
                  setActiveCurriculumModal(null);
                  handleSelectCourseToBook(courseName);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-full)",
                  background: `linear-gradient(135deg, ${activeCurriculumModal.color}, #0284c7)`,
                  border: "none",
                  color: "#ffffff",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 3px 12px rgba(2, 132, 199, 0.3)"
                }}
              >
                <span>Xếp Lớp Kèm Môn Này</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
