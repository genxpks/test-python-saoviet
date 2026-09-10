export interface BranchInfo {
  code: string;
  name: string;
  shortName: string;
  district: string;
  address: string;
  phone: string;
  hotline: string;
  manager: string;
  facilities: string;
  landmark: string;
  mapUrl: string;
  pin: string;
}

export interface TrainingPillar {
  id: string;
  title: string;
  shortDesc: string;
  tagline: string;
  badge: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  featuredCourses: {
    name: string;
    code: string;
    duration: string;
    target: string;
    highlights: string[];
  }[];
}

export interface GuaranteeItem {
  id: string;
  title: string;
  desc: string;
  badge: string;
  stat: string;
  statLabel: string;
  color: string;
  glowColor: string;
}

export interface TestimonialItem {
  id: string;
  studentName: string;
  course: string;
  scoreOrOutcome: string;
  avatar: string;
  workplace: string;
  comment: string;
  year: string;
}

// 🏢 MẠNG LƯỚI 6 CƠ SỞ THỰC TẾ CỦA TIN HỌC SAO VIỆT (THEO CHUẨN BIÊN SOẠN SAO VIỆT)
export const SAOVIET_BRANCHES: BranchInfo[] = [
  {
    code: "CN_THUDUC",
    name: "Tin Học Sao Việt — Cơ Sở Thủ Đức (Trụ Sở Đào Tạo)",
    shortName: "Cơ Sở Thủ Đức",
    district: "TP. Thủ Đức, TP.HCM",
    address: "Số 15, Đường Số 9, P. Linh Tây, TP. Thủ Đức, TP.HCM",
    phone: "093 11 44 858",
    hotline: "093 11 44 858",
    manager: "ThS. Lê Trọng Phúc & Đội ngũ Giảng viên ĐH",
    facilities: "04 Phòng máy lạnh cấu hình cao, màn hình IPS 24 inch, mạng cáp quang Gigabit",
    landmark: "Liền kề ĐH Ngân Hàng, ĐH Sư Phạm Kỹ Thuật, Chợ Thủ Đức",
    mapUrl: "https://maps.google.com/?q=Tin+Học+Sao+Việt+Thủ+Đức",
    pin: "8888"
  },
  {
    code: "CN_QUAN1",
    name: "Tin Học Sao Việt — Cơ Sở Quận 1 (Trung Tâm Tài Chính)",
    shortName: "Cơ Sở Quận 1",
    district: "Quận 1, TP.HCM",
    address: "Số 45, Đường Đinh Tiên Hoàng, P. Bến Nghé, Quận 1, TP.HCM",
    phone: "093 11 44 858",
    hotline: "093 11 44 858",
    manager: "ThS. Hoàng Thị Mai (Trưởng bộ môn THVP & Kế Toán)",
    facilities: "03 Phòng Lab chuyên đề trang bị hệ điều hành kép Windows / macOS",
    landmark: "Gần Đài truyền hình HTV, Thảo Cầm Viên, ĐH KHXH&NV",
    mapUrl: "https://maps.google.com/?q=Tin+Học+Sao+Việt+Quận+1",
    pin: "9999"
  },
  {
    code: "CN_BINHTHANH",
    name: "Tin Học Sao Việt — Cơ Sở Bình Thạnh",
    shortName: "Cơ Sở Bình Thạnh",
    district: "Bình Thạnh, TP.HCM",
    address: "Số 88, Đường Điện Biên Phủ, P. 25, Q. Bình Thạnh, TP.HCM",
    phone: "093 11 44 858",
    hotline: "093 11 44 858",
    manager: "ThS. Nguyễn Duy Khang (Chuyên gia Phân tích dữ liệu & Excel)",
    facilities: "04 Phòng máy chuẩn văn phòng doanh nghiệp, máy chiếu tương tác",
    landmark: "Ngay Vòng xoay Hàng Xanh, gần ĐH HUTECH, ĐH Ngoại Thương",
    mapUrl: "https://maps.google.com/?q=Tin+Học+Sao+Việt+Bình+Thạnh",
    pin: "7777"
  },
  {
    code: "CN_GOVAP",
    name: "Tin Học Sao Việt — Cơ Sở Gò Vấp",
    shortName: "Cơ Sở Gò Vấp",
    district: "Gò Vấp, TP.HCM",
    address: "Số 120, Đường Quang Trung, P. 10, Q. Gò Vấp, TP.HCM",
    phone: "093 11 44 858",
    hotline: "093 11 44 858",
    manager: "ThS. Trần Quốc Hưng (Chuyên gia Lập trình Web & Python)",
    facilities: "04 Phòng thực hành máy tính Intel Core i7, 32GB RAM",
    landmark: "Đối diện Vincom Plaza Quang Trung, gần Ngã 6 Gò Vấp",
    mapUrl: "https://maps.google.com/?q=Tin+Học+Sao+Việt+Gò+Vấp",
    pin: "6666"
  },
  {
    code: "CN_DIAN",
    name: "Tin Học Sao Việt — Cơ Sở Dĩ An (Bình Dương)",
    shortName: "Cơ Sở Dĩ An",
    district: "TP. Dĩ An, Bình Dương",
    address: "Khu dân cư Vietsing, P. An Phú, TP. Thuận An - giáp Dĩ An, Bình Dương",
    phone: "093 11 44 858",
    hotline: "093 11 44 858",
    manager: "KS. Phạm Thành Đạt (Phụ trách khu vực công nghiệp)",
    facilities: "03 Phòng Lab đào tạo Kế toán thuế & Tin học văn phòng KCN",
    landmark: "Liền kề KCN VSIP 1, Aeon Mall Bình Dương Canary",
    mapUrl: "https://maps.google.com/?q=Tin+Học+Sao+Việt+Dĩ+An",
    pin: "5555"
  },
  {
    code: "CN_BIENHOA",
    name: "Tin Học Sao Việt — Cơ Sở Biên Hòa (Đồng Nai)",
    shortName: "Cơ Sở Biên Hòa",
    district: "TP. Biên Hòa, Đồng Nai",
    address: "Số 26, Đường Đồng Khởi, P. Tân Hiệp, TP. Biên Hòa, Đồng Nai",
    phone: "093 11 44 858",
    hotline: "093 11 44 858",
    manager: "ThS. Đỗ Thị Thu Trang (Giảng viên Kế toán máy & MOS)",
    facilities: "03 Phòng máy chuẩn khảo thí quốc tế Certiport",
    landmark: "Gần Ngã tư Tân Phong, ĐH Đồng Nai",
    mapUrl: "https://maps.google.com/?q=Tin+Học+Sao+Việt+Biên+Hòa",
    pin: "4444"
  }
];

// 🌟 4 CAM KẾT VÀNG ĐỘC QUYỀN CỦA SAO VIỆT (THEO CHUẨN THƯƠNG HIỆU & SOP-ADM-01)
export const SAOVIET_GUARANTEES: GuaranteeItem[] = [
  {
    id: "thanh_thao",
    title: "Học Đến Khi Thành Thạo — Không Giới Hạn Buổi",
    desc: "Không ép số buổi cứng nhắc. Học viên được học và thực hành tại trung tâm cho đến khi tự tin làm được việc 100% mới kết thúc khóa mà không phát sinh thêm chi phí.",
    badge: "Cam Kết Độc Quyền",
    stat: "100%",
    statLabel: "Đảm bảo kỹ năng đầu ra",
    color: "#2563eb",
    glowColor: "rgba(37, 99, 235, 0.2)"
  },
  {
    id: "kem_1_1",
    title: "Phương Pháp Cầm Tay Chỉ Việc 1 Kèm 1",
    desc: "Giảng viên giàu kinh nghiệm thực chiến trực tiếp hướng dẫn từng thao tác, sửa lỗi ngay tại bàn máy tính, phù hợp tuyệt đối cho cả người mới bắt đầu và mất gốc.",
    badge: "Hiệu Quả Cao Nhất",
    stat: "1-on-1",
    statLabel: "Hướng dẫn cá nhân hóa",
    color: "#059669",
    glowColor: "rgba(5, 150, 105, 0.2)"
  },
  {
    id: "gio_linh_hoat",
    title: "Lịch Học Linh Hoạt — Rảnh Giờ Nào Học Giờ Đó",
    desc: "Mở lớp liên tục Sáng (8h-11h), Chiều (14h-17h), Tối (18h-21h) từ Thứ 2 đến Chủ Nhật. Học viên bận công tác được bảo lưu và học bù thoải mái không lo mất bài.",
    badge: "Tiện Lợi Tối Đa",
    stat: "3 Ca/Ngày",
    statLabel: "Linh động sáng - chiều - tối",
    color: "#d97706",
    glowColor: "rgba(217, 119, 6, 0.2)"
  },
  {
    id: "chung_nhan",
    title: "Cấp Chứng Chỉ Uy Tín & Học Lại Miễn Phí Trọn Đời",
    desc: "Cấp chứng nhận hoàn thành khóa học có giá trị xin việc toàn quốc. Học viên tốt nghiệp được quyền quay lại trung tâm cập nhật kiến thức mới hoàn toàn miễn phí trọn đời.",
    badge: "Đồng Hành Dài Lâu",
    stat: "Trọn Đời",
    statLabel: "Bảo lưu & hỗ trợ vĩnh viễn",
    color: "#7c3aed",
    glowColor: "rgba(124, 58, 237, 0.2)"
  }
];

// 📚 4 TRỤ CỘT ĐÀO TẠO THỰC CHIẾN CỦA SAO VIỆT
export const SAOVIET_PILLARS: TrainingPillar[] = [
  {
    id: "pillar_thvp",
    title: "Tin Học Văn Phòng Thực Chiến & MOS / IC3",
    shortDesc: "Chuẩn hóa kỹ năng Word, Excel, PowerPoint từ cơ bản đến đỉnh cao chuyên nghiệp cho người đi làm và sinh viên.",
    tagline: "Xử lý văn bản chuẩn thể thức, lập bảng tính tự động và thuyết trình lôi cuốn",
    badge: "Khóa Học Quốc Dân",
    color: "#2563eb",
    bgGradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(14, 165, 233, 0.04))",
    borderColor: "rgba(37, 99, 235, 0.3)",
    featuredCourses: [
      {
        name: "Khóa Thực Chiến Cấp Tốc THVP-32",
        code: "THVP-32",
        duration: "Học đến khi thành thạo (Trung bình 15-20 buổi)",
        target: "Sinh viên sắp ra trường, người đi làm muốn bứt phá năng suất",
        highlights: [
          "Soạn thảo hợp đồng, tờ trình, công văn chuẩn Nghị định 30/2020/NĐ-CP",
          "Thành thạo 25+ hàm Excel thực tế: VLOOKUP, XLOOKUP, INDEX/MATCH, SUMIFS",
          "Xây dựng Dashboard phân tích báo cáo PivotTable tự động cập nhật",
          "Thiết kế Slide thuyết trình PowerPoint hiện đại, hoạt họa chuyên nghiệp"
        ]
      },
      {
        name: "Luyện Thi Chứng Chỉ Quốc Tế MOS (Word / Excel / PPT)",
        code: "MOS-INT",
        duration: "10 - 15 buổi kèm thi",
        target: "Học sinh, sinh viên chuẩn đầu ra ĐH, người tìm việc doanh nghiệp FDI",
        highlights: [
          "Bám sát 100% ma trận đề thi Certiport quốc tế phiên bản 2019 / 365",
          "Luyện giải đề trên phần mềm thi thử GMetrix sát đề thi thật 99%",
          "Cam kết điểm thi từ 850 - 1000 điểm đạt chứng chỉ ngay lần thi đầu"
        ]
      },
      {
        name: "Tin Học Văn Phòng Căn Bản Cho Người Mất Gốc",
        code: "THVP-CB",
        duration: "Cầm tay chỉ việc đến khi tự tin làm chủ máy tính",
        target: "Người lớn tuổi, người chưa từng dùng máy tính hoặc mất gốc hoàn toàn",
        highlights: [
          "Làm quen hệ điều hành Windows, gõ 10 ngón chuẩn tiếng Việt",
          "Quản lý thư mục, bảo mật dữ liệu và tìm kiếm thông tin hiệu quả",
          "Định dạng văn bản căn bản, in ấn và gửi nhận email công việc"
        ]
      }
    ]
  },
  {
    id: "pillar_ketoan",
    title: "Kế Toán Doanh Nghiệp & Kế Toán Máy Thực Hành",
    shortDesc: "Đào tạo thực hành trên hóa đơn, chứng từ đỏ thực tế của doanh nghiệp; lên báo cáo tài chính và quyết toán thuế.",
    tagline: "Học từ nghiệp vụ phát sinh đến lên Báo Cáo Tài Chính & Quyết Toán Thuế",
    badge: "100% Chứng Từ Thực",
    color: "#059669",
    bgGradient: "linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(16, 185, 129, 0.04))",
    borderColor: "rgba(5, 150, 105, 0.3)",
    featuredCourses: [
      {
        name: "Kế Toán Thực Hành Thuế & Báo Cáo Tài Chính Tổng Hợp",
        code: "KT-THUE",
        duration: "Học đến khi tự tay lập được trọn bộ BCTC",
        target: "Sinh viên kế toán mới ra trường, người chuyển ngành sang kế toán",
        highlights: [
          "Xử lý hóa đơn điện tử, kê khai thuế GTGT, TNCN, TNDN trên HTKK",
          "Lập bảng tính lương, trích bảo hiểm xã hội chuẩn luật lao động mới",
          "Thực hành ghi sổ và lên Báo Cáo Tài Chính trên phần mềm MISA SME",
          "Kỹ năng giải trình thanh tra thuế và tối ưu chi phí hợp lý hợp lệ"
        ]
      },
      {
        name: "Kế Toán Excel Chuyên Sâu Thực Chiến",
        code: "KT-EXCEL",
        duration: "12 - 18 buổi",
        target: "Kế toán viên muốn thiết kế sổ sách kế toán tự động trên Excel",
        highlights: [
          "Tự động hóa sổ Nhật ký chung, Sổ Cái, Sổ chi tiết bằng công thức Excel",
          "Lập bảng cân đối phát sinh tài khoản tự động kiểm tra sai lệch",
          "Xây dựng hệ thống quản lý kho, công nợ phải thu / phải trả động"
        ]
      }
    ]
  },
  {
    id: "pillar_laptrinh",
    title: "Lập Trình Ứng Dụng & Công Nghệ Thông Tin",
    shortDesc: "Lộ trình từ tư duy thuật toán nền tảng đến lập trình ứng dụng Python, Web Fullstack và khảo thí trực tuyến.",
    tagline: "Học thực hành dự án, kết hợp bài tập kiểm thử tự động trên VS Code",
    badge: "Công Nghệ Hiện Đại",
    color: "#7c3aed",
    bgGradient: "linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(99, 102, 241, 0.04))",
    borderColor: "rgba(124, 58, 237, 0.3)",
    featuredCourses: [
      {
        name: "Lập Trình Python Nâng Cao & Tự Động Hóa (Automation)",
        code: "PY-NC",
        duration: "Trọn bộ 47 bài giảng + 10 bài thực hành thi",
        target: "Học sinh THPT ôn thi Tin học trẻ, sinh viên, người làm data/tự động hóa",
        highlights: [
          "Nắm vững cú pháp Python 3.12, xử lý chuỗi, mảng danh sách List & Dict",
          "Đồ họa hình học Turtle Graphics & thư viện toán học math/random",
          "Tự động hóa xử lý bảng tính Excel, crawl dữ liệu web và gửi email",
          "Tích hợp luyện thi 120 câu trắc nghiệm & sandbox chấm code tự động"
        ]
      },
      {
        name: "Lập Trình Web Fullstack (Next.js / Node.js / Laravel / ASP.NET)",
        code: "WEB-FS",
        duration: "Dự án thực tế từ Frontend đến Backend",
        target: "Học viên định hướng trở thành Web Developer chuyên nghiệp",
        highlights: [
          "HTML5 Semantic, CSS3 Responsive chuẩn Mobile-first & Bootstrap 5",
          "Backend RESTful API với Express/Node.js, Laravel 11 hoặc ASP.NET Core 8",
          "Triển khai dự án lên Vercel, Docker và kết nối cơ sở dữ liệu MongoDB/SQL"
        ]
      }
    ]
  },
  {
    id: "pillar_dohoa",
    title: "Thiết Kế Đồ Họa & Bản Vẽ Kỹ Thuật",
    shortDesc: "Làm chủ bộ công cụ Adobe Photoshop, Illustrator và AutoCAD phục vụ thiết kế truyền thông và vẽ kỹ thuật.",
    tagline: "Biến ý tưởng thành sản phẩm thị giác ấn tượng & bản vẽ chuẩn mực",
    badge: "Sáng Tạo Thực Tiễn",
    color: "#d97706",
    bgGradient: "linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(245, 158, 11, 0.04))",
    borderColor: "rgba(217, 119, 6, 0.3)",
    featuredCourses: [
      {
        name: "Thiết Kế Đồ Họa Truyền Thông (Photoshop & Illustrator)",
        code: "GRAPHIC-2D",
        duration: "Học thực hành dự án quảng cáo thực tế",
        target: "Chủ shop online, nhân viên Marketing, người đam mê thiết kế banner/poster",
        highlights: [
          "Chỉnh sửa ảnh sản phẩm, cắt ghép banner quảng cáo Facebook/TikTok",
          "Thiết kế bộ nhận diện thương hiệu: Logo, Namecard, Standee, Catalogue",
          "Xuất file chuẩn in ấn offset và tối ưu hình ảnh đăng mạng xã hội"
        ]
      },
      {
        name: "AutoCAD 2D & 3D Bản Vẽ Kỹ Thuật",
        code: "AUTOCAD-PRO",
        duration: "Từ lệnh vẽ cơ bản đến triển khai hồ sơ hoàn chỉnh",
        target: "Sinh viên ngành xây dựng, cơ khí, kiến trúc và kỹ sư công trình",
        highlights: [
          "Thiết lập Layer, DimStyle, Textstyle chuẩn quy chuẩn xây dựng Việt Nam",
          "Triển khai bản vẽ mặt bằng kiến trúc, kết cấu và chi tiết máy chính xác",
          "In ấn bản vẽ đúng tỷ lệ trên các khổ giấy A4, A3, A1"
        ]
      }
    ]
  }
];

// 💬 PHẢN HỒI THỰC TẾ TỪ HỌC VIÊN TỐT NGHIỆP TẠI SAO VIỆT
export const SAOVIET_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "testi_1",
    studentName: "Nguyễn Thị Thu Hương",
    course: "Khóa Thực Chiến THVP-32 & Kế Toán MISA",
    scoreOrOutcome: "Đi làm ngay sau 1 tháng",
    avatar: "👩‍💼",
    workplace: "Kế toán viên tại Công ty CP Vận Tải Sài Gòn",
    comment: "Trước đây mình học trái ngành nên rất sợ kế toán và hàm Excel. Đến Sao Việt Thủ Đức được thầy Phúc và cô Mai cầm tay chỉ việc từng tờ hóa đơn, rảnh ca nào đến ca đó. Sau hơn 1 tháng mình đã tự tin lên được Báo Cáo Tài Chính và được nhận vào làm chính thức ngay!",
    year: "Khóa 2025"
  },
  {
    id: "testi_2",
    studentName: "Trần Minh Hoàng",
    course: "Luyện Thi Chứng Chỉ MOS Excel 2019",
    scoreOrOutcome: "Đạt 980 / 1000 điểm",
    avatar: "👨‍🎓",
    workplace: "Sinh viên năm cuối ĐH Ngân Hàng TP.HCM",
    comment: "Mình ôn thi MOS cấp tốc tại Sao Việt để nộp chuẩn đầu ra tốt nghiệp. Trung tâm cho luyện đề trên máy sát đề thi thật 100%, có trang web thi thử trực tuyến rất tiện. Đi thi mình làm bài chỉ mất 25 phút và đạt 980 điểm!",
    year: "Khóa 2026"
  },
  {
    id: "testi_3",
    studentName: "Lê Văn Dũng",
    course: "Lập Trình Python Nâng Cao & Tự Động Hóa",
    scoreOrOutcome: "Giải Nhì Hội Thi Tin Học Trẻ",
    avatar: "🧑‍💻",
    workplace: "Học sinh Chuyên Tin & Học viên Sao Việt",
    comment: "Hệ thống bài giảng 47 bài và kho 120 câu hỏi có phần giải thích suy luận cực kỳ sâu. Trình chạy thử code Python ngay trên web của trung tâm giúp em rèn phản xạ thuật toán và sửa lỗi cú pháp rất nhanh.",
    year: "Khóa 2026"
  },
  {
    id: "testi_4",
    studentName: "Phạm Thảo Nguyên",
    course: "Tin Học Văn Phòng Nâng Cao Cho Người Đi Làm",
    scoreOrOutcome: "Tăng 50% hiệu suất làm việc",
    avatar: "👩‍💻",
    workplace: "Chuyên viên Nhân sự tại Tập đoàn Bất Động Sản",
    comment: "Ấn tượng nhất là chính sách học đến khi thành thạo không giới hạn số buổi. Mình làm nhân sự cần xử lý bảng lương và hợp đồng hàng ngàn nhân viên, các kỹ thuật Mail Merge và PivotTable học được ở Sao Việt giúp mình tiết kiệm hàng giờ mỗi ngày.",
    year: "Khóa 2025"
  }
];

// 📈 SỐ LIỆU THÀNH TỰU BẢO CHỨNG UY TÍN (TRUST SIGNALS)
export const SAOVIET_STATS = [
  { value: "10+", label: "Năm Kinh Nghiệm Đào Tạo", subtext: "Thành lập và phát triển vững mạnh từ năm 2015" },
  { value: "50.000+", label: "Học Viên Tốt Nghiệp", subtext: "Đã thành thạo nghề và ứng dụng tốt trong công việc" },
  { value: "98.5%", label: "Tỷ Lệ Hài Lòng Tuyệt Đối", subtext: "Đánh giá 5 sao về chất lượng giảng viên và phòng máy" },
  { value: "06", label: "Cơ Sở TP.HCM & Bình Dương", subtext: "Phòng Lab chuẩn máy lạnh, cấu hình cao hiện đại" },
  { value: "200+", label: "Doanh Nghiệp Hợp Tác", subtext: "Đào tạo nội bộ cho ngân hàng, tập đoàn, KCN" }
];
