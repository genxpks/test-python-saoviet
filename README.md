# HỆ THỐNG LUYỆN THI, IN ĐỀ & CHẤM ĐIỂM PYTHON NÂNG CAO
## TRUNG TÂM TIN HỌC SAO VIỆT — CHI NHÁNH THỦ ĐỨC

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgenxpks%2Ftest-python-saoviet.git)

Ứng dụng web toàn diện được xây dựng bằng **Next.js 14 (App Router) + TypeScript + React**, phục vụ công tác giảng dạy, ôn tập, thi thử trực tuyến và xuất bản đề thi chuẩn in ấn A4 của **Trung Tâm Tin Học Sao Việt Thủ Đức**.

---

## 🌟 Các Tính Năng Cốt Lõi

### 1. 📖 Chế Độ Ôn Tập (120 Câu Trắc Nghiệm & 10 Bài Thực Hành)
- Kho **120 câu hỏi** trắc nghiệm được phân loại thành **6 dạng tương tác**:
  1. *Trắc nghiệm ABCD (40 câu)*
  2. *Trắc nghiệm Đúng / Sai (20 câu)*
  3. *Trắc nghiệm chọn nhiều đáp án đúng (20 câu)*
  4. *Điền vào chỗ trống (15 câu)*
  5. *Sắp xếp thứ tự các dòng lệnh (15 câu)*
  6. *Nối quy trình / Ghép cặp khái niệm (10 câu)*
- Mỗi câu hỏi đều tích hợp nút **"💡 Xem đáp án & chú thích suy luận logic"** giải thích chi tiết phương pháp giải.

### 2. ⏱️ Chế Độ Thi Trực Tuyến (Testing Online)
- **Cấu trúc bài thi tốt nghiệp:**
  - **Phần 1 - Trắc nghiệm:** Random **50 câu** từ kho 120 câu (Thời gian: **50 phút**).
  - **Phần 2 - Tự luận thực hành:** Random **4 bài** từ kho 10 bài nâng cao (Thời gian: **40 phút**).
- **Trình soạn thảo Python Sandbox trực tiếp:** Học viên gõ code, bấm **"▶️ Chạy Thử Code"** xem kết quả console và bấm **"💾 Nộp Bài"** để hệ thống tự động chấm điểm theo test case.
- **Tính năng Tạm dừng bài thi (Pause Exam):** Cho phép lưu trạng thái bài thi, khóa màn hình và yêu cầu **Mã PIN Giáo viên (`8888`)** mới cho mở khóa đếm giờ làm tiếp.

### 3. 🖨️ Chế Độ In Đề Thi Chuẩn A4 (Print Mode)
- Trang chuyên biệt `/print-exam` cho phép:
  - In **Đề thi học sinh** (50 câu trắc nghiệm + 4 bài tự luận) có sẵn khung Họ tên, Lớp, SBD, Điểm số và lời phê.
  - In **Phiếu đáp án giáo viên** kèm lời giải suy luận logic.
  - In **Toàn bộ kho 120 câu hỏi** ôn tập.
  - Hỗ trợ nút **"🎲 Trộn Đề Mới"** tạo nhiều mã đề khác nhau (Mã đề 101, 102...).
  - Tối ưu CSS `@media print` A4 ngắt trang chuẩn xác, ẩn các thanh điều hướng khi in.

### 4. 🛡️ Khu Vực Quản Trị Giáo Viên
- Quản lý danh sách học viên (Thêm, sửa, xóa tài khoản).
- Mở khóa các bài thi đang tạm dừng.
- Theo dõi bảng điểm và lịch sử nộp bài.

---

## 👥 Danh Sách Tài Khoản Cấp Sẵn

| Loại Tài Khoản | Tên Đăng Nhập | Mật Khẩu | Mã PIN Mở Khóa | Quyền Hạn |
| :--- | :---: | :---: | :---: | :---: |
| **Giáo Viên (Admin)** | `admin` | `saoviet2026` | `8888` | Toàn quyền quản trị & mở khóa thi |
| **Học viên 01** | `hocvien01` | `123456` | — | Học sinh: Nguyễn Bảo Nam |
| **Học viên 02** | `hocvien02` | `123456` | — | Học sinh: Trần Minh Khôi |
| **Học viên 03** | `saoviet01` | `123456` | — | Học sinh: Lê Thu Hà |
| **Học viên 04** | `saoviet02` | `123456` | — | Học sinh: Phạm Hoàng Long |
| **Học viên 05** | `saoviet03` | `123456` | — | Học sinh: Vũ Mỹ Linh |

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local Development)

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Chạy môi trường phát triển
npm run dev

# 3. Mở trình duyệt tại địa chỉ
http://localhost:3000
```

---

## 🌐 Hướng Dẫn Triển Khai Lên Vercel (1-Click Deployment)

1. Truy cập [Vercel](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Chọn **"Add New Project"** ➔ **"Import Git Repository"**.
3. Chọn repository `genxpks/test-python-saoviet`.
4. Giữ nguyên các cấu hình mặc định (Framework Preset: **Next.js**).
5. Nhấn **"Deploy"**. Vercel sẽ tự động build và cấp phát tên miền `https://test-python-saoviet.vercel.app` hoàn toàn miễn phí.
