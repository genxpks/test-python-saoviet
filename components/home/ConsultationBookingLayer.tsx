"use client";

import { useState } from "react";
import { SAOVIET_BRANCHES, SAOVIET_PILLARS } from "@/lib/saovietData";
import { Send, CheckCircle2, PhoneCall, Shield, Sparkles, MapPin, BookOpen, Clock } from "lucide-react";

export default function ConsultationBookingLayer() {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState(SAOVIET_BRANCHES[0].code);
  const [courseInterest, setCourseInterest] = useState("THVP-32");
  const [shiftTime, setShiftTime] = useState("Tối (18h00 - 21h00)");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim() || !phone.trim()) return;

    // Giả lập gửi thông tin tư vấn thành công & lưu localStorage
    try {
      const savedLeads = JSON.parse(localStorage.getItem("saoviet_consultation_leads") || "[]");
      savedLeads.push({
        fullname,
        phone,
        branch,
        courseInterest,
        shiftTime,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem("saoviet_consultation_leads", JSON.stringify(savedLeads));
    } catch (err) {}

    setSubmitted(true);
  };

  return (
    <section
      id="dang-ky-tu-van"
      style={{
        marginBottom: "4.5rem",
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(14, 165, 233, 0.05) 50%, rgba(5, 150, 105, 0.06) 100%)",
        border: "1px solid rgba(37, 99, 235, 0.2)",
        boxShadow: "var(--shadow-card)",
        padding: "clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 3vw, 3rem)"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2.5rem",
          alignItems: "center"
        }}
      >
        {/* Left Column: Value Proposition & Contact */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 0.9rem",
              borderRadius: "9999px",
              background: "rgba(37, 99, 235, 0.12)",
              border: "1px solid rgba(37, 99, 235, 0.25)",
              color: "var(--brand-primary)",
              fontSize: "0.82rem",
              fontWeight: 700,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              marginBottom: "1rem"
            }}
          >
            <Sparkles size={15} />
            <span>Tư Vấn Miễn Phí & Xếp Lớp Ngay</span>
          </div>

          <h2
            style={{
              fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)",
              fontWeight: 900,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
              lineHeight: 1.2,
              marginBottom: "1rem"
            }}
          >
            Bắt Đầu Hành Trình Nâng Cao Kỹ Năng Cùng Sao Việt
          </h2>

          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-muted)",
              lineHeight: 1.65,
              marginBottom: "2rem"
            }}
          >
            Để lại thông tin để nhận tư vấn lộ trình học phù hợp với trình độ hiện tại, lịch học linh hoạt và nhận ưu đãi học phí mới nhất từ Trung Tâm Tin Học Sao Việt.
          </p>

          {/* Quick Perks List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ color: "var(--brand-emerald)" }}>
                <CheckCircle2 size={18} />
              </div>
              <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                Kiểm tra trình độ đầu vào & học thử 01 buổi hoàn toàn miễn phí
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ color: "var(--brand-emerald)" }}>
                <CheckCircle2 size={18} />
              </div>
              <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                Giảng viên trực tiếp tư vấn lộ trình học phù hợp mục tiêu đi làm / thi cử
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ color: "var(--brand-emerald)" }}>
                <CheckCircle2 size={18} />
              </div>
              <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                Cam kết hỗ trợ giải đáp bài tập & nghiệp vụ thực tế trọn đời
              </span>
            </div>
          </div>

          {/* Direct Hotline Box */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.8rem 1.4rem",
              background: "var(--surface-card)",
              borderRadius: "14px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-subtle)"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "rgba(5, 150, 105, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--brand-emerald)"
              }}
            >
              <PhoneCall size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Hotline Tư Vấn Trực Tiếp 24/7
              </div>
              <a
                href="tel:0931144858"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 900,
                  color: "var(--brand-primary)",
                  textDecoration: "none",
                  fontFamily: "var(--font-heading)"
                }}
              >
                093 11 44 858
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Consultation Form */}
        <div
          style={{
            background: "var(--surface-card)",
            borderRadius: "20px",
            padding: "2.2rem 2rem",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-hover-3d)"
          }}
        >
          {submitted ? (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(5, 150, 105, 0.12)",
                  color: "var(--brand-emerald)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.2rem auto"
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "0.6rem",
                  fontFamily: "var(--font-heading)"
                }}
              >
                Đăng Ký Thành Công!
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                  marginBottom: "1.8rem"
                }}
              >
                Cảm ơn bạn <strong>{fullname}</strong>. Chuyên viên tư vấn của Tin Học Sao Việt sẽ liên hệ lại qua số điện thoại <strong>{phone}</strong> trong vòng 15 phút để tư vấn lịch học và ưu đãi tốt nhất cho bạn!
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFullname("");
                  setPhone("");
                }}
                style={{
                  padding: "0.75rem 1.6rem",
                  background: "var(--brand-primary)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Gửi Thêm Đăng Ký Khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-heading)",
                  marginBottom: "0.4rem"
                }}
              >
                Phiếu Đăng Ký Tư Vấn & Xếp Lớp
              </h3>
              <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Điền thông tin bên dưới để được giữ chỗ và nhận ưu đãi học phí:
              </p>

              {/* 1. Họ và tên */}
              <div style={{ marginBottom: "1.1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    marginBottom: "0.4rem"
                  }}
                >
                  Họ và tên học viên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-medium)",
                    background: "var(--bg-main)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "border-color 0.2s ease"
                  }}
                />
              </div>

              {/* 2. Số điện thoại */}
              <div style={{ marginBottom: "1.1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    marginBottom: "0.4rem"
                  }}
                >
                  Số điện thoại liên hệ (Zalo) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-medium)",
                    background: "var(--bg-main)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* 3. Khóa học quan tâm */}
              <div style={{ marginBottom: "1.1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    marginBottom: "0.4rem"
                  }}
                >
                  Khóa học bạn quan tâm
                </label>
                <select
                  value={courseInterest}
                  onChange={(e) => setCourseInterest(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-medium)",
                    background: "var(--bg-main)",
                    color: "var(--text-primary)",
                    fontSize: "0.92rem",
                    outline: "none"
                  }}
                >
                  <option value="THVP-32">Khóa Thực Chiến Cấp Tốc THVP-32 (Word, Excel, PPT)</option>
                  <option value="MOS-INT">Luyện Thi Chứng Chỉ Quốc Tế MOS (Word, Excel, PPT)</option>
                  <option value="KT-THUE">Kế Toán Thực Hành Thuế & Báo Cáo Tài Chính Tổng Hợp</option>
                  <option value="KT-EXCEL">Kế Toán Excel Chuyên Sâu Tự Động Hóa Sổ Sách</option>
                  <option value="PY-NC">Lập Trình Python Nâng Cao & Tự Động Hóa (Automation)</option>
                  <option value="WEB-FS">Lập Trình Web Fullstack (Next.js, Node.js, Laravel)</option>
                  <option value="GRAPHIC-2D">Thiết Kế Đồ Họa Truyền Thông (Photoshop, AI)</option>
                  <option value="AUTOCAD-PRO">AutoCAD 2D & 3D Bản Vẽ Kỹ Thuật Chuyên Nghiệp</option>
                  <option value="THVP-CB">Tin Học Văn Phòng Căn Bản Cho Người Mất Gốc</option>
                </select>
              </div>

              {/* 4. Chọn cơ sở gần bạn nhất */}
              <div style={{ marginBottom: "1.1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    marginBottom: "0.4rem"
                  }}
                >
                  Cơ sở gần bạn nhất
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-medium)",
                    background: "var(--bg-main)",
                    color: "var(--text-primary)",
                    fontSize: "0.92rem",
                    outline: "none"
                  }}
                >
                  {SAOVIET_BRANCHES.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.shortName} — {b.district}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Khung giờ mong muốn */}
              <div style={{ marginBottom: "1.6rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    marginBottom: "0.4rem"
                  }}
                >
                  Ca học mong muốn
                </label>
                <select
                  value={shiftTime}
                  onChange={(e) => setShiftTime(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-medium)",
                    background: "var(--bg-main)",
                    color: "var(--text-primary)",
                    fontSize: "0.92rem",
                    outline: "none"
                  }}
                >
                  <option value="Sáng (08h30 - 11h00)">Ca Sáng (08h30 - 11h00)</option>
                  <option value="Chiều (14h00 - 17h00)">Ca Chiều (14h00 - 17h00)</option>
                  <option value="Tối (18h00 - 21h00)">Ca Tối (18h00 - 21h00)</option>
                  <option value="Cuối Tuần (T7 - CN)">Lớp Thứ 7 - Chủ Nhật</option>
                  <option value="Linh hoạt theo ca làm">Lịch linh hoạt đổi ca tự do</option>
                </select>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.95rem 1.5rem",
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                  transition: "all 0.2s ease"
                }}
              >
                <span>Nhận Tư Vấn & Xếp Lớp Ngay</span>
                <Send size={18} />
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  marginTop: "1rem",
                  fontSize: "0.78rem",
                  color: "var(--text-muted)"
                }}
              >
                <Shield size={14} color="var(--brand-emerald)" />
                <span>Cam kết bảo mật thông tin học viên tuyệt đối</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
