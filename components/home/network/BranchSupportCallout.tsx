"use client";

import { Phone, Mail, Clock, MapPin, MessageCircle, Globe, Sparkles, ArrowRight } from "lucide-react";

export default function BranchSupportCallout() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(14, 165, 233, 0.05) 50%, rgba(5, 150, 105, 0.06) 100%)",
        border: "1px solid rgba(37, 99, 235, 0.2)",
        borderRadius: "18px",
        padding: "1.4rem 1.8rem",
        marginTop: "2rem",
        boxShadow: "var(--shadow-card)",
        position: "relative"
      }}
    >
      {/* Top Title & Subtitle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.2rem",
          borderBottom: "1px solid var(--border-light)",
          paddingBottom: "1rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(37, 99, 235, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--brand-primary)"
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <h4
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                fontFamily: "var(--font-heading)",
                margin: 0
              }}
            >
              Thông Tin Liên Hệ & Đăng Ký Học Tập — Tin Học Sao Việt
            </h4>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "0.2rem 0 0 0" }}>
              Tiếp nhận tư vấn xếp lớp, kiểm tra trình độ đầu vào và hỗ trợ kỹ thuật học viên 24/7
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <a
            href="tel:0931144858"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.55rem 1.1rem",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#ffffff",
              fontSize: "0.86rem",
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
              transition: "all 0.2s ease"
            }}
          >
            <Phone size={14} />
            <span>Gọi 093 11 44 858</span>
          </a>

          <a
            href="https://zalo.me/0931144858"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.55rem 1.1rem",
              borderRadius: "10px",
              background: "rgba(5, 150, 105, 0.1)",
              border: "1px solid rgba(5, 150, 105, 0.3)",
              color: "var(--brand-emerald)",
              fontSize: "0.86rem",
              fontWeight: 800,
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
          >
            <MessageCircle size={14} />
            <span>Chat Zalo</span>
          </a>

          <a
            href="#dang-ky-tu-van"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.55rem 1rem",
              borderRadius: "10px",
              background: "var(--surface-hover)",
              border: "1px solid var(--border-medium)",
              color: "var(--text-primary)",
              fontSize: "0.86rem",
              fontWeight: 700,
              textDecoration: "none"
            }}
          >
            <span>Đặt Lịch Học Thử</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>

      {/* Contact Metadata Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem"
        }}
      >
        {/* Item 1: Hotline */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
          <Phone size={16} style={{ color: "var(--brand-primary)", marginTop: "2px", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Hotline Tư Vấn Toàn Hệ Thống
            </div>
            <a
              href="tel:0931144858"
              style={{
                fontSize: "0.98rem",
                fontWeight: 800,
                color: "var(--brand-primary)",
                textDecoration: "none"
              }}
            >
              093 11 44 858
            </a>
          </div>
        </div>

        {/* Item 2: Giờ làm việc */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
          <Clock size={16} style={{ color: "var(--brand-amber)", marginTop: "2px", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Thời Gian Tiếp Nhận Học Viên
            </div>
            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-primary)" }}>
              08h00 — 21h00 (T2 — CN)
            </div>
          </div>
        </div>

        {/* Item 3: Email */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
          <Mail size={16} style={{ color: "var(--brand-emerald)", marginTop: "2px", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Email Tiếp Nhận & Học Vụ
            </div>
            <a
              href="mailto:contact@tinhocsaoviet.com"
              style={{
                fontSize: "0.92rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                textDecoration: "none"
              }}
            >
              contact@tinhocsaoviet.com
            </a>
          </div>
        </div>

        {/* Item 4: Website & Chuyển ca */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
          <MapPin size={16} style={{ color: "var(--brand-violet)", marginTop: "2px", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Chính Sách Chuyển Đổi Phòng Lab
            </div>
            <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Linh hoạt đổi ca giữa 6 cơ sở
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
