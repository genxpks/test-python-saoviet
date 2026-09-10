"use client";

import { SAOVIET_PILLARS } from "@/lib/saovietData";
import { 
  FileSpreadsheet, 
  Calculator, 
  Code2, 
  Palette, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Award
} from "lucide-react";
import Link from "next/link";

export default function TrainingPillarsLayer() {
  const pillarIcons = [FileSpreadsheet, Calculator, Code2, Palette];

  return (
    <section style={{ marginBottom: "4.5rem", position: "relative" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            borderRadius: "9999px",
            background: "rgba(37, 99, 235, 0.08)",
            border: "1px solid rgba(37, 99, 235, 0.2)",
            color: "var(--brand-primary)",
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "0.75rem"
          }}
        >
          <Award size={16} />
          <span>Hệ Thống Đào Tạo Đa Trọng Điểm</span>
        </div>

        <h2
          style={{
            fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
            lineHeight: 1.25,
            marginBottom: "0.8rem"
          }}
        >
          4 Trụ Cột Đào Tạo Nghề Thực Chiến Của Sao Việt
        </h2>

        <p
          style={{
            fontSize: "1.02rem",
            color: "var(--text-muted)",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: 1.6
          }}
        >
          Toàn bộ chương trình được thiết kế bám sát nhu cầu tuyển dụng thực tế của doanh nghiệp, cam kết học viên làm được việc ngay khi hoàn thành khóa.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
          gap: "1.8rem"
        }}
      >
        {SAOVIET_PILLARS.map((pillar, idx) => {
          const IconComponent = pillarIcons[idx % pillarIcons.length];
          return (
            <div
              key={pillar.id}
              className="pillar-card-hover"
              style={{
                background: "var(--surface-card)",
                borderRadius: "20px",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-card)",
                padding: "2rem 1.8rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              {/* Top Accent Gradient Bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: `linear-gradient(90deg, ${pillar.color}, transparent)`
                }}
              />

              <div>
                {/* Header: Icon + Badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.2rem"
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "14px",
                      background: `${pillar.color}14`,
                      border: `1px solid ${pillar.color}33`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: pillar.color
                    }}
                  >
                    <IconComponent size={26} />
                  </div>

                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.3rem 0.75rem",
                      borderRadius: "9999px",
                      background: `${pillar.color}12`,
                      color: pillar.color,
                      border: `1px solid ${pillar.color}25`
                    }}
                  >
                    {pillar.badge}
                  </span>
                </div>

                {/* Pillar Title & Tagline */}
                <h3
                  style={{
                    fontSize: "1.28rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-heading)",
                    lineHeight: 1.3,
                    marginBottom: "0.5rem"
                  }}
                >
                  {pillar.title}
                </h3>

                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.55,
                    marginBottom: "1.4rem"
                  }}
                >
                  {pillar.shortDesc}
                </p>

                {/* Featured Courses List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.8rem" }}>
                  {pillar.featuredCourses.map((course, cIdx) => (
                    <div
                      key={cIdx}
                      style={{
                        background: "var(--bg-deep)",
                        borderRadius: "12px",
                        padding: "0.9rem 1rem",
                        border: "1px solid var(--border-light)"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "0.35rem"
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.92rem",
                            fontWeight: 700,
                            color: "var(--text-primary)"
                          }}
                        >
                          {course.name}
                        </span>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            padding: "0.15rem 0.45rem",
                            borderRadius: "6px",
                            background: `${pillar.color}20`,
                            color: pillar.color
                          }}
                        >
                          {course.code}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          fontSize: "0.76rem",
                          color: "var(--text-muted)",
                          marginBottom: "0.5rem"
                        }}
                      >
                        <Clock size={12} />
                        <span>{course.duration}</span>
                      </div>

                      {/* Course Key Highlight */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                        <CheckCircle2 size={13} style={{ color: pillar.color, flexShrink: 0, marginTop: "2px" }} />
                        <span>{course.highlights[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action: Register Consultation */}
              <a
                href="#dang-ky-tu-van"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.8rem 1.2rem",
                  borderRadius: "10px",
                  background: `${pillar.color}14`,
                  color: pillar.color,
                  border: `1px solid ${pillar.color}33`,
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "all 0.2s ease"
                }}
              >
                <span>Nhận Tư Vấn Lộ Trình Môn Này</span>
                <ArrowRight size={15} />
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
