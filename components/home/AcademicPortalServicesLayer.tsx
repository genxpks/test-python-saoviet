"use client";

import { useState } from "react";
import { ACADEMIC_SERVICES, AcademicServiceItem } from "@/lib/saovietData";
import { 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  UserCheck, 
  FileCode2, 
  Award, 
  Laptop, 
  PhoneCall 
} from "lucide-react";

export default function AcademicPortalServicesLayer() {
  const [selectedService, setSelectedService] = useState<AcademicServiceItem>(ACADEMIC_SERVICES[0]);

  const handleBookingClick = (serviceTitle: string) => {
    const bookingEl = document.getElementById("dang-ky-tu-van");
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: "smooth" });
      const noteInput = document.getElementById("consultation-note-input") as HTMLTextAreaElement | null;
      if (noteInput) {
        noteInput.value = `Quan tâm dịch vụ: ${serviceTitle}. Cần hỗ trợ xếp lịch học kèm sớm nhất.`;
      }
    }
  };

  return (
    <section 
      id="dich-vu-hoc-vu" 
      style={{ 
        marginTop: "3rem", 
        marginBottom: "3rem",
        position: "relative" 
      }}
    >
      {/* SECTION HEADER */}
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.25rem 0.75rem",
          borderRadius: "var(--radius-full)",
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(37, 99, 235, 0.1))",
          border: "1px solid rgba(139, 92, 246, 0.35)",
          color: "#8b5cf6",
          fontSize: "0.78rem",
          fontWeight: 800,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          marginBottom: "0.5rem"
        }}>
          <GraduationCap size={13} />
          <span>Hệ Thống Học Vụ & Dịch Vụ Đào Tạo Toàn Diện</span>
        </div>

        <h2 style={{
          fontSize: "clamp(1.4rem, 2.3vw, 1.95rem)",
          fontWeight: 900,
          color: "var(--text-primary)",
          lineHeight: 1.25,
          letterSpacing: "-0.5px",
          marginBottom: "0.45rem"
        }}>
          5 Dịch Vụ Học Vụ Lập Trình Chuyên Biệt Tại Sao Việt
        </h2>

        <p style={{
          fontSize: "0.86rem",
          color: "var(--text-secondary)",
          maxWidth: "760px",
          margin: "0 auto",
          lineHeight: 1.45
        }}>
          Giải pháp học vụ trọn gói từ kèm cặp 1-1, đồng hành bảo vệ đồ án tốt nghiệp đại học, 
          luyện thi Olympic giải thưởng đến đào tạo chuyển nghề thực chiến với cam kết học đến khi thành thạo.
        </p>
      </div>

      {/* 5 SERVICE CARDS: Thẻ tinh giản tỷ lệ 60%, phối màu nhận diện sang trọng */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "0.95rem"
      }}>
        {ACADEMIC_SERVICES.map((service, index) => {
          const isHighlighted = service.id === "serv_1on1" || service.id === "serv_capstone";
          return (
            <div
              key={service.id}
              style={{
                background: "var(--surface-card)",
                border: isHighlighted ? `1.5px solid ${service.accentColor}` : "1.5px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                boxShadow: isHighlighted ? `0 4px 20px ${service.accentColor}18` : "var(--shadow-subtle)",
                transition: "all 0.2s ease"
              }}
              className="hover-card-elevation"
            >
              {/* Badge trên cùng */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  padding: "0.15rem 0.45rem",
                  borderRadius: "4px",
                  background: `${service.accentColor}18`,
                  color: service.accentColor,
                  border: `1px solid ${service.accentColor}35`
                }}>
                  {service.badge}
                </span>

                <span style={{ fontSize: "1.25rem" }}>
                  {service.icon}
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 style={{
                fontSize: "0.96rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.3,
                marginBottom: "0.35rem"
              }}>
                {service.title}
              </h3>

              <p style={{
                fontSize: "0.76rem",
                color: "var(--text-muted)",
                lineHeight: 1.4,
                marginBottom: "0.65rem",
                minHeight: "38px"
              }}>
                {service.tagline}
              </p>

              {/* Target Students Box */}
              <div style={{
                background: "var(--surface-sunken)",
                padding: "0.38rem 0.55rem",
                borderRadius: "4px",
                border: "1px solid var(--border-light)",
                fontSize: "0.71rem",
                color: "var(--text-secondary)",
                marginBottom: "0.75rem",
                lineHeight: 1.35
              }}>
                <strong style={{ color: "var(--text-primary)" }}>Phù hợp:</strong> {service.targetStudents}
              </div>

              {/* Deliverables List (3 điểm nhấn) */}
              <div style={{ flex: 1, marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
                  Quyền Lợi & Sản Phẩm Đạt Được:
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {service.deliverables.slice(0, 3).map((d, i) => (
                    <li key={i} style={{
                      fontSize: "0.73rem",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.35rem",
                      lineHeight: 1.35
                    }}>
                      <CheckCircle2 size={12} color={service.accentColor} style={{ minWidth: "12px", marginTop: "2px" }} />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cam kết của Sao Việt */}
              <div style={{
                fontSize: "0.7rem",
                padding: "0.35rem 0.5rem",
                borderRadius: "4px",
                background: "linear-gradient(135deg, rgba(0,245,200,0.04), rgba(2,132,199,0.04))",
                borderLeft: `2.5px solid ${service.accentColor}`,
                color: "var(--text-secondary)",
                marginBottom: "0.85rem",
                lineHeight: 1.35
              }}>
                <strong style={{ color: "var(--text-primary)" }}>Cam kết:</strong> {service.commitment}
              </div>

              {/* Nút hành động trực tiếp */}
              <button
                onClick={() => handleBookingClick(service.title)}
                style={{
                  width: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.35rem",
                  padding: "0.45rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  background: isHighlighted 
                    ? `linear-gradient(135deg, ${service.accentColor}, #0284c7)` 
                    : "var(--surface-sunken)",
                  border: isHighlighted ? "none" : "1px solid var(--border-medium)",
                  color: isHighlighted ? "#ffffff" : "var(--text-primary)",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: isHighlighted ? `0 2px 10px ${service.accentColor}35` : "none",
                  transition: "all 0.15s ease",
                  marginTop: "auto"
                }}
              >
                <span>{service.ctaText}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {/* QUICK TRUST BARNER: 4 Trụ Cột Học Vụ */}
      <div style={{
        marginTop: "1.25rem",
        background: "var(--surface-sunken)",
        border: "1px solid var(--border-medium)",
        borderRadius: "var(--radius-md)",
        padding: "0.75rem 1rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "0.75rem",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ padding: "0.35rem", borderRadius: "50%", background: "rgba(0, 245, 200, 0.15)", color: "var(--brand-primary)" }}>
            <UserCheck size={16} />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-primary)" }}>Giảng Viên Đại Học</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>ThS & Kỹ sư trên 5 năm kinh nghiệm</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ padding: "0.35rem", borderRadius: "50%", background: "rgba(37, 99, 235, 0.15)", color: "#38bdf8" }}>
            <Calendar size={16} />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-primary)" }}>Lịch Học Tự Chọn</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>3 ca/ngày (Sáng - Chiều - Tối) linh động</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ padding: "0.35rem", borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            <ShieldCheck size={16} />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-primary)" }}>Học Đến Khi Thành Thạo</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Không giới hạn số buổi đến khi làm được</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ padding: "0.35rem", borderRadius: "50%", background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            <PhoneCall size={16} />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-primary)" }}>Hotline Học Vụ 24/7</div>
            <div style={{ fontSize: "0.7rem", color: "var(--brand-primary)", fontWeight: 800 }}>093 11 44 858 (Zalo)</div>
          </div>
        </div>
      </div>
    </section>
  );
}
