# HỆ THỐNG HỌC LIỆU & LUYỆN THI PYTHON NÂNG CAO
## TRUNG TÂM TIN HỌC SAO VIỆT — CHI NHÁNH THỦ ĐỨC

---

### 📂 Cấu Trúc Toàn Bộ Gói `Giaotrinh_pythonNC`

```
d:/tinhocsaoviet/GIAO_TRINH_LAP_TRINH_WEB_HUTECH/Giaotrinh_pythonNC/
├── Tai_Lieu_In_An/
│   ├── Giao_Trinh_Bai_Tap_Python_Nang_Cao_Sao_Viet.docx
│   └── Giao_Trinh_Bai_Tap_Python_Nang_Cao_Sao_Viet.pdf
├── Ngan_Hang_120_Cau_Hoi/
│   ├── Ngan_Hang_120_Cau_Trac_Nghiem_Va_10_Bai_Thuc_Hanh.docx
│   ├── Ngan_Hang_120_Cau_Trac_Nghiem_Va_10_Bai_Thuc_Hanh.pdf
│   └── questions_bank_full.json
├── Web_On_Thi_Trac_Nghiem/
│   ├── index.html            (Mở trực tiếp bằng trình duyệt Chrome, Edge, Cốc Cốc)
│   ├── style.css             (Giao diện EdTech cao cấp, responsive)
│   ├── app.js                (Logic thi 50 câu TN / 4 câu TL, tạm dừng thi, tính giờ)
│   ├── python_runner.js      (Trình chạy thử code Python & tự động chấm điểm)
│   ├── questions.js          (Kho dữ liệu 120 câu hỏi 6 dạng & 10 bài toán tự luận)
│   └── users.js              (Quản lý tài khoản Giáo viên & Học viên cấp sẵn)
└── scripts/
    ├── generate_master_curriculum.py
    └── generate_quiz_bank_doc.py
```

---

### 🚀 Hướng Dẫn Sử Dụng Ứng Dụng Web Thi & Luyện Thi

#### 1. Cách Mở Ứng Dụng:
- Truy cập vào thư mục `Web_On_Thi_Trac_Nghiem/` và click đúp chuột vào file **`index.html`** để mở trên bất kỳ trình duyệt nào (không cần cài đặt server hay môi trường phức tạp).

#### 2. Danh Sách Tài Khoản Cấp Sẵn:
* **Tài khoản Giáo viên (Admin):**
  - Tên đăng nhập: `admin`
  - Mật khẩu: `saoviet2026`
  - **Mã PIN Phê duyệt Mở khóa:** `8888`
  - *Quyền hạn:* Cấp tài khoản mới cho học viên, xem bài thi tạm dừng và mở khóa thi, thêm câu hỏi trắc nghiệm vào ngân hàng đề.
* **Tài khoản Học viên mẫu:**
  - `hocvien01` / Mật khẩu: `123456` (Nguyễn Bảo Nam)
  - `hocvien02` / Mật khẩu: `123456` (Trần Minh Khôi)
  - `saoviet01` / Mật khẩu: `123456` (Lê Thu Hà)
  - `saoviet02` / Mật khẩu: `123456` (Phạm Hoàng Long)
  - `saoviet03` / Mật khẩu: `123456` (Vũ Mỹ Linh)

#### 3. Chế Độ Ôn Tập (120 Câu Trắc Nghiệm & 10 Bài Tự Luận):
- Học viên lọc theo từng dạng câu hỏi (ABCD, Đúng/Sai, Nhiều đáp án, Điền từ, Sắp xếp, Ghép cặp, Tự luận).
- Bấm **"💡 Xem đáp án & chú thích suy luận logic"** để hiểu bản chất câu hỏi và học thuộc phương pháp giải.

#### 4. Chế Độ Thi Cuối Khóa:
- **Phần 1 - Trắc nghiệm (50 câu - 50 phút):** Tự động xáo trộn và bốc ngẫu nhiên 50 câu từ kho 120 câu.
- **Phần 2 - Tự luận thực hành (4 câu - 40 phút):** Tự động bốc ngẫu nhiên 4 câu từ kho 10 câu.
- Học viên viết code trên **Trình soạn thảo Python**, bấm **"▶️ Chạy Thử Code"** xem kết quả console rồi mới bấm **"💾 Nộp Bài"**.
- **Tính năng Tạm dừng thi:** Bấm **"⏸️ Tạm Dừng Thi"** để lưu bài. Khi tiếp tục làm lại, Giáo viên nhập mã PIN `8888` để phê duyệt.
- Tự động chấm điểm theo thang điểm 10 và in phiếu báo điểm hoàn thành.
