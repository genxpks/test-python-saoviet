import Link from "next/link";
import { 
  BookOpen, 
  Clock, 
  Printer, 
  ShieldCheck, 
  Terminal, 
  Sparkles, 
  Code2, 
  Bot, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Cpu,
  Layers,
  FileCode2
} from "lucide-react";

export default function HomePage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Hero Studio Banner */}
      <section className="section-hero">
        <div className="hero-content">
          <div className="hero-tagline">
            <Sparkles size={14} />
            <span>TRUNG TÂM TIN HỌC SAO VIỆT — CHI NHÁNH THỦ ĐỨC</span>
          </div>

          <h1 className="hero-title">
            HỆ THỐNG LUYỆN THI & IN ĐỀ PYTHON NÂNG CAO
          </h1>

          <p className="hero-subtitle">
            Nền tảng học liệu chuẩn hóa toàn diện: Ôn luyện 120 câu hỏi 6 dạng tương tác, thi tốt nghiệp trực tuyến tính giờ tự động, trình chạy thử mã nguồn Python trực tiếp trên trình duyệt và xuất bản in đề thi A4 chuyên nghiệp.
          </p>

          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/study" className="btn btn-primary btn-lg">
              <BookOpen size={18} />
              <span>Vào Ôn Tập Ngay</span>
              <ArrowRight size={16} />
            </Link>

            <Link href="/exam" className="btn btn-success btn-lg">
              <Clock size={18} />
              <span>Bắt Đầu Thi Trực Tuyến</span>
            </Link>
          </div>

          {/* Dynamic Metrics Strip */}
          <div className="hero-stats-strip">
            <div className="stat-item">
              <span className="stat-number">120+</span>
              <span className="stat-label">Câu Hỏi Trắc Nghiệm Phân Loại</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">06</span>
              <span className="stat-label">Dạng Tương Tác Hiện Đại</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10</span>
              <span className="stat-label">Bài Tự Luận Thuật Toán & IDE</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Trợ Lý AI Sao Việt Chữa Bài</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
          <Layers size={20} color="var(--brand-primary)" />
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Các Phân Hệ Chính Của Nền Tảng</h2>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
          Học viên và giáo viên dễ dàng lựa chọn module học tập hoặc quản trị phù hợp.
        </p>
      </div>

      <div className="bento-grid">
        {/* Bento 1: Ôn Tập */}
        <div className="bento-card">
          <div>
            <div className="bento-icon-wrapper" style={{ background: "rgba(37, 99, 235, 0.1)", color: "var(--brand-primary)" }}>
              <BookOpen size={26} />
            </div>
            <h3 className="bento-title">Ôn Tập 120 Câu Hỏi</h3>
            <p className="bento-desc">
              Kho câu hỏi phân cấp 6 dạng (ABCD, Đúng/Sai, Checkbox, Điền từ, Sắp xếp thứ tự, Ghép cặp) kèm lời giải và phương pháp tư duy logic từng bước.
            </p>
          </div>
          <Link href="/study" className="btn btn-primary btn-block">
            <span>Truy Cập Kho Ôn Tập</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Bento 2: Thi Online */}
        <div className="bento-card">
          <div>
            <div className="bento-icon-wrapper" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--brand-emerald)" }}>
              <Clock size={26} />
            </div>
            <h3 className="bento-title">Thi Thử Trực Tuyến</h3>
            <p className="bento-desc">
              Bài thi chuẩn tốt nghiệp: Ngẫu nhiên 50 câu trắc nghiệm (50 phút) và 4 bài tự luận viết hàm (40 phút). Tích hợp đồng hồ điện tử và tạm dừng có mã PIN.
            </p>
          </div>
          <Link href="/exam" className="btn btn-success btn-block">
            <span>Làm Bài Thi Ngay</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Bento 3: In Đề Chuẩn A4 */}
        <div className="bento-card">
          <div>
            <div className="bento-icon-wrapper" style={{ background: "rgba(139, 92, 246, 0.1)", color: "var(--brand-violet)" }}>
              <Printer size={26} />
            </div>
            <h3 className="bento-title">In Đề Thi Chuẩn A4</h3>
            <p className="bento-desc">
              Bộ công cụ xuất bản đề thi in giấy A4 2 cột chuyên nghiệp, tự động tạo phiếu chấm đáp án cho giám khảo và tối ưu ngắt trang không bị cắt câu hỏi.
            </p>
          </div>
          <Link href="/print-exam" className="btn btn-secondary btn-block">
            <span>Tạo & In Đề Thi</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Bento 4: Quản Trị Giáo Viên */}
        <div className="bento-card">
          <div>
            <div className="bento-icon-wrapper" style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--brand-amber)" }}>
              <ShieldCheck size={26} />
            </div>
            <h3 className="bento-title">Quản Trị & Bảng Điểm</h3>
            <p className="bento-desc">
              Bảng điều khiển cho Giáo viên: Quản lý danh sách học viên, phê duyệt mã PIN mở khóa bài thi tạm dừng và theo dõi phổ điểm bài thi của các lớp.
            </p>
          </div>
          <Link href="/admin" className="btn btn-warning btn-block">
            <span>Bảng Quản Trị</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Curriculum & Technology Focus */}
      <div style={{ marginTop: "3rem" }}>
        <div className="q-card" style={{ background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <Cpu size={22} color="var(--brand-primary)" />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Chương Trình Lập Trình Python Nâng Cao Bao Gồm Những Gì?</h3>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Khung kiến thức được thiết kế chuẩn sư phạm, kết hợp thực chiến cho học viên từ cơ bản đến nâng cao:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem", color: "var(--brand-primary)" }}>
                <FileCode2 size={18} />
                <span>1. Cấu Trúc Dữ Liệu Nâng Cao</span>
              </div>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                Thao tác chuyên sâu List Comprehension, Dictionary đa tầng, Tuple bất biến, Set loại trừ trùng lặp và chuỗi ký tự String Slicing.
              </p>
            </div>

            <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem", color: "var(--brand-emerald-dark)" }}>
                <Terminal size={18} />
                <span>2. Hàm, Scope & Đệ Quy</span>
              </div>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                Tham số *args/**kwargs, Lambda functions, biến toàn cục/cục bộ (global/local) và kỹ thuật đệ quy tính toán toán học.
              </p>
            </div>

            <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem", color: "var(--brand-violet)" }}>
                <Code2 size={18} />
                <span>3. Đồ Họa Turtle & OOP Cơ Bản</span>
              </div>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                Vẽ hình đa giác, vòng lặp lồng nhau, màu sắc RGB, tọa độ sân chơi Turtle và làm quen với Lớp (Class), Đối tượng (Object).
              </p>
            </div>

            <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem", color: "var(--brand-amber)" }}>
                <Bot size={18} />
                <span>4. Xử Lý Tệp & Trợ Lý AI</span>
              </div>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                Đọc/ghi file văn bản (File I/O), xử lý ngoại lệ `try...except` và ứng dụng AI tự động phát hiện lỗi cú pháp logic.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info & Center Notice Footer */}
      <div style={{
        marginTop: "2.5rem",
        padding: "1.5rem 1.8rem",
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(8px)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-subtle)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
          <Award size={18} color="var(--brand-primary)" />
          <h4 style={{ fontWeight: 800, fontSize: "0.95rem" }}>Thông Tin Đơn Vị & Bản Quyền Học Liệu:</h4>
        </div>
        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
          <strong>Trung Tâm Tin Học Sao Việt — Chi Nhánh TP. Thủ Đức, TP. Hồ Chí Minh</strong> • Hệ thống đào tạo Lập trình Python trẻ em & Lập trình Ứng dụng thực chiến. Mọi thắc mắc về nội dung ôn tập và hỗ trợ kỹ thuật phòng thi, học viên vui lòng liên hệ Giáo viên phụ trách bộ môn.
        </p>
      </div>
    </div>
  );
}
