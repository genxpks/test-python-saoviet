import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <div className="section-hero" style={{ padding: "2.5rem 2rem", background: "linear-gradient(135deg, #0f172a, #1e293b)", color: "#ffffff" }}>
        <div>
          <span style={{ background: "#2563eb", color: "#ffffff", padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700 }}>
            TIN HỌC SAO VIỆT THỦ ĐỨC
          </span>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginTop: "0.8rem", marginBottom: "0.5rem" }}>
            HỆ THỐNG LUYỆN THI & IN ĐỀ PYTHON NÂNG CAO
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: "700px" }}>
            Nền tảng học liệu toàn diện: Ôn tập 120 câu hỏi 6 dạng tương tác, thi trực tuyến tính giờ tự động, chạy thử Python ngay trên trình duyệt và in đề thi A4 chuyên nghiệp.
          </p>
        </div>
      </div>

      {/* Feature Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
        
        {/* Card 1 */}
        <div className="q-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>📖</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>Ôn Tập 120 Câu</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1rem" }}>
              Kho 120 câu hỏi trắc nghiệm chia thành 6 dạng tương tác (ABCD, Đúng/Sai, Checkbox, Điền từ, Sắp xếp, Ghép cặp) kèm chú thích suy luận logic.
            </p>
          </div>
          <Link href="/study" className="btn btn-primary btn-block">
            Vào Ôn Tập Ngay ➔
          </Link>
        </div>

        {/* Card 2 */}
        <div className="q-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>⏱️</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>Thi Trực Tuyến</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1rem" }}>
              Bài thi chuẩn tốt nghiệp: Random 50 câu trắc nghiệm (50p) & 4 câu tự luận viết hàm (40p), có chạy thử code và tạm dừng có mã PIN giáo viên.
            </p>
          </div>
          <Link href="/exam" className="btn btn-success btn-block">
            Bắt Đầu Làm Bài Thi ➔
          </Link>
        </div>

        {/* Card 3 */}
        <div className="q-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>🖨️</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>In Đề Chuẩn A4</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1rem" }}>
              Trình tạo đề thi in ấn giấy A4 tự động, xuất phiếu đáp án cho giáo viên, tối ưu ngắt trang và hiển thị sắc nét khi in trực tiếp.
            </p>
          </div>
          <Link href="/print-exam" className="btn btn-secondary btn-block">
            Xem & In Đề Thi ➔
          </Link>
        </div>

        {/* Card 4 */}
        <div className="q-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>🛡️</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>Quản Trị Giáo Viên</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1rem" }}>
              Bảng điều khiển cho Thầy/Cô quản lý danh sách tài khoản học viên, mở khóa đề thi tạm dừng và bổ sung câu hỏi mới.
            </p>
          </div>
          <Link href="/admin" className="btn btn-warning btn-block">
            Bảng Quản Trị ➔
          </Link>
        </div>

      </div>

      {/* Info Banner */}
      <div style={{ marginTop: "2.5rem", padding: "1.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
        <h4 style={{ fontWeight: 700, marginBottom: "0.4rem" }}>📌 Thông Tin Trung Tâm & Bản Quyền Học Liệu:</h4>
        <p style={{ fontSize: "0.9rem", color: "#475569" }}>
          <strong>Trung Tâm Tin Học Sao Việt — Chi Nhánh Thủ Đức</strong> • Đào tạo lập trình Python trẻ em & nâng cao thực chiến.
          Mọi thắc mắc và hỗ trợ kỹ thuật xin liên hệ Giáo viên phụ trách bộ môn.
        </p>
      </div>
    </div>
  );
}
