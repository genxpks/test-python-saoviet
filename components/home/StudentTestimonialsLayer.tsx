"use client";

import { SAOVIET_TESTIMONIALS, SAOVIET_STATS } from "@/lib/saovietData";
import { Quote, Star, CheckCircle2, TrendingUp, Sparkles, Building2 } from "lucide-react";

export default function StudentTestimonialsLayer() {
  return (
    <section style={{ marginBottom: "4.5rem", position: "relative" }}>
      {/* 1. Header & Social Proof Intro */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            borderRadius: "9999px",
            background: "rgba(5, 150, 105, 0.08)",
            border: "1px solid rgba(5, 150, 105, 0.2)",
            color: "var(--brand-emerald)",
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "0.75rem"
          }}
        >
          <Sparkles size={16} />
          <span>Bằng Chứng Xã Hội & Phản Hồi Học Viên</span>
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
          Hơn 50.000 Học Viên Đã Thành Công Cùng Sao Việt
        </h2>

        <p
          style={{
            fontSize: "1.02rem",
            color: "var(--text-muted)",
            maxWidth: "680px",
            margin: "0 auto",
            lineHeight: 1.6
          }}
        >
          Những câu chuyện thực tế từ sinh viên chuẩn bị tốt nghiệp, người đi làm muốn nâng cao năng suất đến các kỹ sư, kế toán viên tại các doanh nghiệp hàng đầu.
        </p>
      </div>

      {/* 2. Key Stats Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.2rem",
          marginBottom: "3rem",
          background: "var(--surface-card)",
          border: "1px solid var(--border-light)",
          borderRadius: "20px",
          padding: "2rem 1.5rem",
          boxShadow: "var(--shadow-card)"
        }}
      >
        {SAOVIET_STATS.map((stat, idx) => (
          <div
            key={idx}
            style={{
              textAlign: "center",
              borderRight: idx < SAOVIET_STATS.length - 1 ? "1px solid var(--border-light)" : "none",
              padding: "0.5rem"
            }}
          >
            <div
              style={{
                fontSize: "clamp(1.8rem, 2.8vw, 2.5rem)",
                fontWeight: 900,
                color: idx === 0 ? "var(--brand-primary)" : idx === 1 ? "var(--brand-emerald)" : idx === 2 ? "var(--brand-amber)" : "var(--brand-violet)",
                fontFamily: "var(--font-heading)",
                lineHeight: 1.1,
                marginBottom: "0.3rem"
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "0.92rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.2rem"
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                lineHeight: 1.4
              }}
            >
              {stat.subtext}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Testimonials Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem"
        }}
      >
        {SAOVIET_TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="testimonial-card"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "16px",
              padding: "1.8rem 1.6rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "var(--shadow-card)",
              position: "relative"
            }}
          >
            <div>
              {/* Star Rating & Course Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem"
                }}
              >
                <div style={{ display: "flex", gap: "2px", color: "#f59e0b" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" />
                  ))}
                </div>

                <span
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.6rem",
                    borderRadius: "9999px",
                    background: "rgba(37, 99, 235, 0.08)",
                    color: "var(--brand-primary)",
                    border: "1px solid rgba(37, 99, 235, 0.15)"
                  }}
                >
                  {t.year}
                </span>
              </div>

              {/* Comment with Quote icon */}
              <div style={{ position: "relative", marginBottom: "1.4rem" }}>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                    fontStyle: "italic"
                  }}
                >
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>
            </div>

            {/* Student Info & Outcome badge */}
            <div
              style={{
                borderTop: "1px solid var(--border-light)",
                paddingTop: "1rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "var(--bg-deep)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    border: "1px solid var(--border-light)"
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {t.studentName}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {t.workplace}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.78rem",
                  padding: "0.4rem 0.75rem",
                  background: "rgba(5, 150, 105, 0.08)",
                  borderRadius: "8px",
                  color: "var(--brand-emerald)",
                  fontWeight: 600
                }}
              >
                <span>{t.course}</span>
                <span style={{ fontWeight: 800 }}>★ {t.scoreOrOutcome}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
