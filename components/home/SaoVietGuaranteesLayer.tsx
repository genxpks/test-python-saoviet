"use client";

import { SAOVIET_GUARANTEES } from "@/lib/saovietData";
import { ShieldCheck, Award, Users, Clock, RotateCcw, Sparkles } from "lucide-react";

export default function SaoVietGuaranteesLayer() {
  const icons = [Award, Users, Clock, RotateCcw];

  return (
    <section style={{ marginBottom: "4.5rem", position: "relative" }}>
      {/* Background glow decoration */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.08) 0%, rgba(217, 119, 6, 0.04) 50%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
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
            <ShieldCheck size={16} />
            <span>Bảo Chứng Chất Lượng Đào Tạo Sao Việt</span>
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
            4 Cam Kết Vàng Độc Quyền Cho Mọi Học Viên
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
            Hơn 10 năm đồng hành cùng hơn 50.000 học viên, Tin Học Sao Việt khẳng định chất lượng đào tạo thực chiến bằng những chính sách cam kết quyền lợi cao nhất.
          </p>
        </div>

        {/* 4 Guarantees Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem"
          }}
        >
          {SAOVIET_GUARANTEES.map((item, index) => {
            const IconComponent = icons[index % icons.length];
            return (
              <div
                key={item.id}
                className="guarantee-card-hover"
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "16px",
                  padding: "1.8rem 1.6rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "var(--shadow-card)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              >
                {/* Accent top line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(90deg, ${item.color}, transparent)`
                  }}
                />

                <div>
                  {/* Top Bar: Icon + Badge */}
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
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: `${item.color}14`,
                        border: `1px solid ${item.color}33`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.color
                      }}
                    >
                      <IconComponent size={24} />
                    </div>

                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.65rem",
                        borderRadius: "9999px",
                        background: `${item.color}12`,
                        color: item.color,
                        border: `1px solid ${item.color}25`
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-heading)",
                      lineHeight: 1.35,
                      marginBottom: "0.75rem"
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "0.92rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                      marginBottom: "1.5rem"
                    }}
                  >
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Stat pill */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    background: "var(--bg-deep)",
                    borderRadius: "10px",
                    border: "1px solid var(--border-light)"
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 900,
                      color: item.color,
                      fontFamily: "var(--font-heading)"
                    }}
                  >
                    {item.stat}
                  </span>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)"
                    }}
                  >
                    {item.statLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
