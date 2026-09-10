"use client";

import Link from "next/link";
import { SAOVIET_BRANCHES } from "@/lib/saovietData";
import { 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Clock, 
  Award, 
  ShieldCheck, 
  BookOpen, 
  Printer, 
  Terminal, 
  Heart 
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--surface-dark, #0f172a)",
        color: "#cbd5e1",
        borderTop: "1px solid var(--border-medium, rgba(255, 255, 255, 0.1))",
        marginTop: "5rem",
        position: "relative",
        zIndex: 10
      }}
    >
      {/* Top Banner Strip */}
      <div
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "1.5rem 2rem",
          background: "rgba(37, 99, 235, 0.08)"
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.2rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #2563eb, #38bdf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "1.2rem"
              }}
            >
              ★
            </div>
            <div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ffffff", fontFamily: "var(--font-heading)" }}>
                HỆ THỐNG ĐÀO TẠO TIN HỌC & KẾ TOÁN SAO VIỆT
              </div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                Đào tạo thực chiến — Cầm tay chỉ việc 1 kèm 1 — Học đến khi thành thạo
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#e2e8f0" }}>
              <Clock size={16} style={{ color: "#38bdf8" }} />
              <span>Mở cửa: <strong>08h00 — 21h00</strong> (Thứ 2 — Chủ Nhật)</span>
            </div>

            <a
              href="tel:0931144858"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1.1rem",
                borderRadius: "9999px",
                background: "#2563eb",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.88rem",
                fontWeight: 700
              }}
            >
              <Phone size={14} />
              <span>Hotline: 093 11 44 858</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Content */}
      <div className="footer-inner-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "2.5rem"
          }}
        >
          {/* Cột 1: Thông tin pháp nhân & Tiêu chuẩn */}
          <div>
            <h4
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: "1.2rem",
                fontFamily: "var(--font-heading)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <Award size={18} style={{ color: "#38bdf8" }} />
              <span>VỀ SAO VIỆT EDUCATION</span>
            </h4>

            <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: "#94a3b8", marginBottom: "1.2rem" }}>
              Hệ thống đào tạo Tin Học & Kế Toán uy tín hàng đầu khu vực phía Nam. Chuyên sâu Tin học văn phòng thực chiến, luyện thi chứng chỉ quốc tế MOS/IC3, Kế toán doanh nghiệp và Lập trình ứng dụng.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.84rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1" }}>
                <ShieldCheck size={16} style={{ color: "#10b981" }} />
                <span>Tiêu chuẩn quản lý chất lượng: <strong>ISO 9001:2015</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1" }}>
                <Globe size={16} style={{ color: "#38bdf8" }} />
                <span>Website: <strong>tinhocsaoviet.com</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1" }}>
                <Mail size={16} style={{ color: "#f59e0b" }} />
                <span>Email: <strong>contact@tinhocsaoviet.com</strong></span>
              </div>
            </div>
          </div>

          {/* Cột 2: Danh mục khóa học trọng điểm */}
          <div>
            <h4
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: "1.2rem",
                fontFamily: "var(--font-heading)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <BookOpen size={18} style={{ color: "#38bdf8" }} />
              <span>CHƯƠNG TRÌNH ĐÀO TẠO</span>
            </h4>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.88rem" }}>
              <li>
                <Link href="/study" style={{ color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }} className="footer-link">
                  • Khóa Cấp Tốc Thực Chiến THVP-32
                </Link>
              </li>
              <li>
                <Link href="/study" style={{ color: "#94a3b8", textDecoration: "none" }} className="footer-link">
                  • Luyện Thi Chứng Chỉ MOS (Word / Excel / PPT)
                </Link>
              </li>
              <li>
                <Link href="/study" style={{ color: "#94a3b8", textDecoration: "none" }} className="footer-link">
                  • Kế Toán Thực Hành Thuế & Báo Cáo Tài Chính
                </Link>
              </li>
              <li>
                <Link href="/study" style={{ color: "#94a3b8", textDecoration: "none" }} className="footer-link">
                  • Kế Toán Excel Chuyên Sâu Tự Động Hóa
                </Link>
              </li>
              <li>
                <Link href="/study" style={{ color: "#94a3b8", textDecoration: "none" }} className="footer-link">
                  • Lập Trình Python Nâng Cao & Tự Động Hóa
                </Link>
              </li>
              <li>
                <Link href="/study" style={{ color: "#94a3b8", textDecoration: "none" }} className="footer-link">
                  • Lập Trình Web Fullstack (Next.js / Node.js / Laravel)
                </Link>
              </li>
              <li>
                <Link href="/study" style={{ color: "#94a3b8", textDecoration: "none" }} className="footer-link">
                  • Thiết Kế Đồ Họa Photoshop, AI & AutoCAD
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Mạng lưới 6 Cơ sở đào tạo */}
          <div>
            <h4
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: "1.2rem",
                fontFamily: "var(--font-heading)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <MapPin size={18} style={{ color: "#38bdf8" }} />
              <span>HỆ THỐNG CƠ SỞ ĐÀO TẠO</span>
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.82rem" }}>
              {SAOVIET_BRANCHES.map((b) => (
                <div key={b.code} style={{ borderLeft: "2px solid rgba(56, 189, 248, 0.4)", paddingLeft: "0.6rem" }}>
                  <div style={{ color: "#ffffff", fontWeight: 700 }}>
                    {b.shortName} ({b.district})
                  </div>
                  <div style={{ color: "#94a3b8", lineHeight: 1.4 }}>
                    {b.address}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột 4: Khảo thí trực tuyến & Liên kết nhanh */}
          <div>
            <h4
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: "1.2rem",
                fontFamily: "var(--font-heading)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <Terminal size={18} style={{ color: "#38bdf8" }} />
              <span>CỔNG KHẢO THÍ SỐ HÓA</span>
            </h4>

            <p style={{ fontSize: "0.86rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              Hệ thống khảo thí thông minh với 120+ câu hỏi đa tương tác, phòng thi Python Sandbox tự động chấm điểm và hỗ trợ xuất bản in đề thi chuẩn A4.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <Link
                href="/exam"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.55rem 1rem",
                  borderRadius: "8px",
                  background: "rgba(37, 99, 235, 0.15)",
                  color: "#38bdf8",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  border: "1px solid rgba(56, 189, 248, 0.25)"
                }}
              >
                <Terminal size={15} />
                <span>Vào Phòng Thi Trực Tuyến</span>
              </Link>

              <Link
                href="/study"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.55rem 1rem",
                  borderRadius: "8px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#34d399",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  border: "1px solid rgba(52, 211, 153, 0.25)"
                }}
              >
                <BookOpen size={15} />
                <span>Ôn Tập 120 Câu Hỏi & Giải Thích</span>
              </Link>

              <Link
                href="/print-exam"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.55rem 1rem",
                  borderRadius: "8px",
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#fbbf24",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  border: "1px solid rgba(251, 191, 36, 0.25)"
                }}
              >
                <Printer size={15} />
                <span>In Đề Thi Chuẩn A4 (Giáo Viên & Trò)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Credit */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            marginTop: "3rem",
            paddingTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.82rem",
            color: "#64748b"
          }}
        >
          <div>
            © {new Date().getFullYear()} <strong>Tin Học & Kế Toán Sao Việt (PKS Education)</strong>. Bảo lưu mọi quyền.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <span>Cố vấn học thuật: <strong>ThS. Lê Trọng Phúc</strong></span>
            <span>•</span>
            <span>Quy chuẩn: <strong>WEB-001 Standard</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
