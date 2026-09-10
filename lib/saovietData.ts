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

export interface CodingLanguageItem {
  id: string;
  name: string;
  shortName: string;
  category: "core" | "frontend" | "backend" | "mobile" | "fullstack";
  categoryLabel: string;
  badge: string;
  icon: string;
  level: string;
  duration: string;
  curriculumCode: string;
  curriculumRef: string;
  highlights: string[];
  techStack: string[];
  outputProject: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  popularity: number;
}

export interface AcademicServiceItem {
  id: string;
  title: string;
  shortTitle: string;
  badge: string;
  tagline: string;
  description: string;
  targetStudents: string;
  deliverables: string[];
  commitment: string;
  ctaText: string;
  icon: string;
  accentColor: string;
  bgGradient: string;
  borderColor: string;
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

// 💻 MA TRẬN 13+ NGÔN NGỮ & CÔNG NGHỆ LẬP TRÌNH CHỦ LỰC TẠI TIN HỌC SAO VIỆT
export const CODING_LANGUAGES: CodingLanguageItem[] = [
  {
    id: "python",
    name: "Lập Trình Python Căn Bản Đến Nâng Cao",
    shortName: "Python",
    category: "core",
    categoryLabel: "Ngôn Ngữ Nền Tảng",
    badge: "Học Liệu 47 Bài Chuẩn",
    icon: "🐍",
    level: "Cơ Bản ➔ Nâng Cao",
    duration: "1.5 - 2 Tháng (Kèm đến khi thạo)",
    curriculumCode: "PY-SAOVIET-47",
    curriculumRef: "08_Giao_Trinh_Python_Sao_Viet",
    highlights: [
      "Làm chủ cú pháp chuẩn PEP 8, xử lý chuỗi, cấu trúc rẽ nhánh & vòng lặp tối ưu",
      "Cấu trúc dữ liệu List, Tuple, Set, Dictionary và lập trình hàm đệ quy",
      "Đồ họa rùa Turtle, lập trình hướng đối tượng OOP và xử lý tệp tin File I/O",
      "Tự động hóa tác vụ Excel/PDF, Web Scraping và luyện phản xạ thuật toán"
    ],
    techStack: ["Python 3.12", "VS Code", "Turtle Graphics", "Pandas", "PyAutoGUI"],
    outputProject: "Ứng dụng Quản lý Điểm thi & Phần mềm Tự động hóa Dữ liệu Văn phòng",
    color: "#38bdf8",
    borderColor: "rgba(56, 189, 248, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(37, 99, 235, 0.04))",
    popularity: 99
  },
  {
    id: "cpp",
    name: "Lập Trình C & C++ Cấu Trúc Dữ Liệu & Giải Thuật",
    shortName: "C / C++",
    category: "core",
    categoryLabel: "Ngôn Ngữ Cốt Lõi",
    badge: "Luyện Thi HSG & Olympic",
    icon: "⚡",
    level: "Nền Tảng Đại Học ➔ Thuật Toán Chuyên Sâu",
    duration: "2 - 2.5 Tháng",
    curriculumCode: "CPP-DSA-PRO",
    curriculumRef: "Kho Học Liệu C/C++ Thuật Toán Sao Việt",
    highlights: [
      "Bản chất quản lý bộ nhớ RAM, con trỏ Pointer, mảng động & cấp phát malloc/new",
      "Cấu trúc dữ liệu: Danh sách liên kết, Stack, Queue, Cây nhị phân tìm kiếm",
      "Lập trình Hướng đối tượng OOP: Kế thừa, Đa hình, Nạp chồng toán tử, Templates",
      "Luyện thuật toán: Đệ quy, Quay lui, Quy hoạch động, Đồ thị phục vụ thi HSG/Tin học trẻ"
    ],
    techStack: ["C++20", "GCC/G++", "Clang", "VS Code", "STL (Vector, Map, Set)"],
    outputProject: "Hệ thống Quản lý Sinh viên tối ưu bộ nhớ & Bộ giải thuật đồ thị Dijkstra/BFS/DFS",
    color: "#06b6d4",
    borderColor: "rgba(6, 182, 212, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(14, 165, 233, 0.04))",
    popularity: 96
  },
  {
    id: "csharp_core",
    name: "Lập Trình C# & Nền Tảng .NET Hiện Đại",
    shortName: "C# Core",
    category: "core",
    categoryLabel: "Nền Tảng Doanh Nghiệp",
    badge: "Chuẩn Microsoft",
    icon: "🔷",
    level: "Cơ Bản ➔ OOP Chuyên Nghiệp",
    duration: "1.5 - 2 Tháng",
    curriculumCode: "CSHARP-NET8",
    curriculumRef: "07_Backend_ASPNET_Core_MVC",
    highlights: [
      "Cú pháp C# 12, Type Safety, Nullable Reference Types, Linq to Objects",
      "Tư duy Lập trình hướng đối tượng OOP: Interface, Abstract Class, Polymorphism",
      "Xử lý ngoại lệ, File I/O, Serialization JSON/XML và Lập trình bất đồng bộ Async/Await",
      "Xây dựng ứng dụng Desktop WinForms / WPF kết nối cơ sở dữ liệu SQL Server"
    ],
    techStack: ["C# 12", ".NET 8 SDK", "VS Code", "SQL Server", "LINQ"],
    outputProject: "Phần mềm Quản lý Kho Hàng & Bán Hàng Desktop liên kết SQL Server",
    color: "#a855f7",
    borderColor: "rgba(168, 85, 247, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(147, 51, 234, 0.04))",
    popularity: 93
  },
  {
    id: "backend_csharp",
    name: "Lập Trình Backend C# (.NET 8 & ASP.NET Core MVC/API)",
    shortName: "Backend C# .NET",
    category: "backend",
    categoryLabel: "Backend Doanh Nghiệp",
    badge: "Doanh Nghiệp Tuyển Dụng",
    icon: "🚀",
    level: "Trung Cấp ➔ Chuyên Nghiệp",
    duration: "2 - 3 Tháng",
    curriculumCode: "ASPNET-MVC-API",
    curriculumRef: "07_Backend_ASPNET_Core_MVC (DKC CMP376, QSG)",
    highlights: [
      "Kiến trúc Clean Architecture / N-Tier Architecture chuẩn mực trong hệ thống lớn",
      "Xây dựng RESTful Web API tốc độ cao, Swagger/OpenAPI, Dependency Injection (DI)",
      "Entity Framework Core 8: Code-First, Migrations, Tối ưu hóa truy vấn SQL Server",
      "Bảo mật xác thực JWT Bearer, Role-based Authorization và Refresh Token"
    ],
    techStack: [".NET 8", "ASP.NET Core Web API", "EF Core 8", "SQL Server", "JWT", "Docker"],
    outputProject: "Hệ thống API Sàn Thương Mại Điện Tử đa người dùng tích hợp Cổng thanh toán",
    color: "#8b5cf6",
    borderColor: "rgba(139, 92, 246, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(99, 102, 241, 0.04))",
    popularity: 95
  },
  {
    id: "php_laravel",
    name: "Lập Trình PHP 8+ & Laravel 11 Framework",
    shortName: "PHP / Laravel",
    category: "backend",
    categoryLabel: "Backend & Web App",
    badge: "Xây Web Nhanh Đỉnh Cao",
    icon: "🐘",
    level: "Cơ Bản ➔ Fullstack Dự Án Thực Tế",
    duration: "2 - 2.5 Tháng",
    curriculumCode: "PHP-LARAVEL-11",
    curriculumRef: "04_Backend_Fullstack_PHP_Laravel (DKC, QST, SPK)",
    highlights: [
      "PHP 8.3 hướng đối tượng hiện đại, Composer, PSR-4, Namespaces, PDO & MySQL",
      "Framework Laravel 11: Routing, Controller, Blade Engine, Middleware, Migration, Seeder",
      "Eloquent ORM chuyên sâu: Quan hệ 1-1, 1-N, N-N, Eager Loading chống truy vấn N+1",
      "Xây dựng RESTful API cho Mobile App và tích hợp Cổng thanh toán VNPay / MoMo"
    ],
    techStack: ["PHP 8.3", "Laravel 11", "MySQL", "Composer", "VNPay SDK", "Bootstrap/Tailwind"],
    outputProject: "Website Thương mại điện tử Bán hàng trực tuyến Full tính năng & Giỏ hàng thanh toán",
    color: "#f43f5e",
    borderColor: "rgba(244, 63, 94, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.08), rgba(225, 29, 72, 0.04))",
    popularity: 94
  },
  {
    id: "java_core",
    name: "Lập Trình Java Core & Hướng Đối Tượng OOP",
    shortName: "Java Core",
    category: "core",
    categoryLabel: "Nền Tảng Đại Học",
    badge: "Vững Nền Tảng Chắc Nghề",
    icon: "☕",
    level: "Cơ Bản ➔ OOP Nâng Cao",
    duration: "1.5 - 2 Tháng",
    curriculumCode: "JAVA-CORE-21",
    curriculumRef: "03_Backend_Fullstack_Java_SpringBoot",
    highlights: [
      "Nền tảng Java 17/21 LTS, JVM, Garbage Collector, Memory Model",
      "4 Trụ cột OOP: Encapsulation, Inheritance, Polymorphism, Abstraction chuẩn xác",
      "Java Collections Framework: ArrayList, LinkedList, HashMap, HashSet, Generics",
      "Lập trình Đa luồng (Multithreading), Lambda Expressions, Stream API và I/O Streams"
    ],
    techStack: ["Java 21 LTS", "IntelliJ IDEA / VS Code", "Maven", "JUnit 5", "Stream API"],
    outputProject: "Ứng dụng Ngân hàng Mô phỏng (Core Banking CLI & GUI) xử lý đa luồng giao dịch",
    color: "#ea580c",
    borderColor: "rgba(234, 88, 12, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(234, 88, 12, 0.08), rgba(194, 65, 12, 0.04))",
    popularity: 92
  },
  {
    id: "java_springboot",
    name: "Lập Trình Web & Backend với Java Spring Boot 3",
    shortName: "Java Spring Boot",
    category: "backend",
    categoryLabel: "Enterprise Backend",
    badge: "Lương Top Đầu Thị Trường",
    icon: "🍃",
    level: "Trung Cấp ➔ Microservices",
    duration: "2.5 - 3 Tháng",
    curriculumCode: "SPRING-BOOT-3",
    curriculumRef: "03_Backend_Fullstack_Java_SpringBoot (BVH, QHI, IUH, FPT)",
    highlights: [
      "Kiến trúc Spring Framework: Inversion of Control (IoC), Dependency Injection (DI), Spring MVC",
      "Spring Boot 3 & Hibernate / Spring Data JPA: Mapping thực thể, Query Methods, Phân trang",
      "Bảo mật cấp độ ngân hàng với Spring Security 6 & Stateless JWT Authentication",
      "Kiến trúc Microservices, RESTful API hoàn chỉnh, kiểm thử tự động với Mockito & Swagger UI"
    ],
    techStack: ["Spring Boot 3", "Spring Data JPA", "Spring Security 6", "PostgreSQL", "Docker", "JWT"],
    outputProject: "Hệ thống Đặt vé Trực tuyến kiến trúc Microservices chịu tải cao",
    color: "#16a34a",
    borderColor: "rgba(22, 163, 74, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(21, 128, 61, 0.04))",
    popularity: 97
  },
  {
    id: "js_ts",
    name: "JavaScript Hiện Đại (ES6+) & TypeScript Pro",
    shortName: "JS & TypeScript",
    category: "core",
    categoryLabel: "Ngôn Ngữ Toàn Năng",
    badge: "Bắt Buộc Cho Lập Trình Web",
    icon: "💛",
    level: "Cơ Bản ➔ Type-Safe Nâng Cao",
    duration: "1.5 - 2 Tháng",
    curriculumCode: "JS-TS-PRO",
    curriculumRef: "01_Lap_Trinh_Co_Ban_HTML_CSS & 05_NextJS",
    highlights: [
      "Cơ chế Event Loop, Microtasks, Call Stack, Scope, Closure và Hoisting",
      "Lập trình bất đồng bộ: Promises, Async/Await, Fetch API, Xử lý Exception chuẩn",
      "TypeScript toàn diện: Static Typing, Interfaces, Types, Generics, Utility Types",
      "Module Bundling, ESLint, Prettier và thực hành viết Clean Code theo chuẩn Airbnb"
    ],
    techStack: ["JavaScript ES2024", "TypeScript 5", "Node.js", "VS Code", "Vite"],
    outputProject: "Thư viện tiện ích xử lý dữ liệu Type-Safe công bố lên npm registry",
    color: "#eab308",
    borderColor: "rgba(234, 179, 8, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(234, 179, 8, 0.08), rgba(202, 138, 4, 0.04))",
    popularity: 98
  },
  {
    id: "web_html_css_js",
    name: "Lập Trình Web Frontend Cơ Bản HTML5 / CSS3 / JavaScript",
    shortName: "HTML/CSS/JS",
    category: "frontend",
    categoryLabel: "Nhập Môn Lập Trình Web",
    badge: "Cửa Ngõ Bắt Đầu Lập Trình",
    icon: "🌐",
    level: "Người Mới Bắt Đầu ➔ Junior Web",
    duration: "1.5 - 2 Tháng",
    curriculumCode: "WEB-001-HTMLCSS",
    curriculumRef: "01_Lap_Trinh_Co_Ban_HTML_CSS (BKA, DKC, FPT, QSG, SPK)",
    highlights: [
      "Cấu trúc HTML5 ngữ nghĩa chuẩn SEO Google, tối ưu Accessibility A11y",
      "CSS3 hiện đại: Flexbox, CSS Grid 2 chiều, Typography, Hiệu ứng chuyển động Animation mượt mà",
      "Xây dựng giao diện Responsive chuẩn chỉnh hiển thị sắc nét trên Mobile, Tablet, Desktop",
      "Tương tác JavaScript DOM: Bắt sự kiện Click, Validate Form đăng ký, Modal Popup sinh động"
    ],
    techStack: ["HTML5", "CSS3", "JavaScript", "VS Code", "Live Server", "GitHub Pages"],
    outputProject: "Trang Landing Page Quảng bá Dịch vụ Thương hiệu tương tác cao chuẩn Responsive",
    color: "#0284c7",
    borderColor: "rgba(2, 132, 199, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(14, 165, 233, 0.04))",
    popularity: 99
  },
  {
    id: "reactjs",
    name: "Lập Trình Web React.js Chuyên Sâu",
    shortName: "React.js",
    category: "frontend",
    categoryLabel: "Frontend Hiện Đại",
    badge: "Số 1 Tuyển Dụng Frontend",
    icon: "⚛️",
    level: "Trung Cấp ➔ Senior Frontend",
    duration: "2 - 2.5 Tháng",
    curriculumCode: "REACT-PRO-18",
    curriculumRef: "05_Frontend_Framework_NextJS",
    highlights: [
      "Component Architecture: Functional Components, Props, State, Virtual DOM",
      "Làm chủ React Hooks: useState, useEffect, useCallback, useMemo, useRef, Custom Hooks",
      "Quản lý State toàn cục hiệu năng cao: Redux Toolkit hoặc Zustand, Context API",
      "React Router v6, tối ưu hiệu năng Render, kết nối RESTful API với TanStack Query / Axios"
    ],
    techStack: ["React 18/19", "Vite", "Zustand", "TailwindCSS", "Axios", "Lucide Icons"],
    outputProject: "Trang Dashboard Quản Trị Hệ Thống CRM & Bán hàng đa kênh Single Page Application (SPA)",
    color: "#00f5c8",
    borderColor: "rgba(0, 245, 200, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(0, 245, 200, 0.08), rgba(16, 185, 129, 0.04))",
    popularity: 99
  },
  {
    id: "nextjs",
    name: "Lập Trình Web Next.js 14 App Router (Fullstack React)",
    shortName: "Next.js",
    category: "fullstack",
    categoryLabel: "Fullstack Framework",
    badge: "Công Nghệ Web Thế Hệ Mới",
    icon: "▲",
    level: "Trung Cấp ➔ Fullstack Chuyên Nghiệp",
    duration: "2 - 2.5 Tháng",
    curriculumCode: "NEXTJS-14-PRO",
    curriculumRef: "05_Frontend_Framework_NextJS (QSG, FPT, OPEN)",
    highlights: [
      "Next.js App Router: Server Components (RSC) vs Client Components, Nested Layouts",
      "Server-Side Rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR)",
      "Tối ưu hóa SEO kỹ thuật đỉnh cao: Dynamic Metadata, OpenGraph, Sitemap XML, Robot.txt",
      "Server Actions, Route Handlers (API Routes), Tích hợp Prisma ORM và Triển khai lên Vercel"
    ],
    techStack: ["Next.js 14/15", "React Server Components", "TailwindCSS", "TypeScript", "Vercel"],
    outputProject: "Cổng Thông Tin Đào Tạo & Khảo Thí Trực Tuyến Tốc Độ Cao chuẩn SEO Điểm 100 Lighthouse",
    color: "#38bdf8",
    borderColor: "rgba(56, 189, 248, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(99, 102, 241, 0.04))",
    popularity: 96
  },
  {
    id: "android_native",
    name: "Lập Trình Di Động Android Native (Kotlin / Java)",
    shortName: "Android App",
    category: "mobile",
    categoryLabel: "Lập Trình Mobile",
    badge: "Thực Chiến Ứng Dụng Thực",
    icon: "🤖",
    level: "Cơ Bản ➔ Xuất Bản Google Play",
    duration: "2 - 2.5 Tháng",
    curriculumCode: "ANDROID-KOTLIN-PRO",
    curriculumRef: "Kho Học Liệu Android Sao Việt",
    highlights: [
      "Xây dựng giao diện hiện đại với Jetpack Compose & XML Layouts chuẩn Material 3",
      "Kiến trúc ứng dụng chuẩn Google: MVVM (Model - View - ViewModel) & LiveData / StateFlow",
      "Lưu trữ dữ liệu cục bộ: SQLite Database, Room DB, DataStore Preferences",
      "Kết nối Backend API thông qua Retrofit 2, Coroutines xử lý bất đồng bộ, Push Notification"
    ],
    techStack: ["Kotlin", "Android Studio", "Jetpack Compose", "Room DB", "Retrofit 2", "Firebase"],
    outputProject: "Ứng dụng Di động Đặt đồ ăn & Theo dõi đơn hàng theo thời gian thực đưa lên Google Play",
    color: "#22c55e",
    borderColor: "rgba(34, 197, 94, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(16, 185, 129, 0.04))",
    popularity: 91
  },
  {
    id: "backend_nodejs",
    name: "Lập Trình Backend Node.js & Express Framework",
    shortName: "Node.js & Express",
    category: "backend",
    categoryLabel: "Backend Hiệu Năng Cao",
    badge: "Thực Chiến API Realtime",
    icon: "🟢",
    level: "Cơ Bản ➔ Full API Microservices",
    duration: "2 - 2.5 Tháng",
    curriculumCode: "NODEJS-EXP-PRO",
    curriculumRef: "02_Backend_Fullstack_NodeJS_Express (QSG, BKA, FPT, OPEN)",
    highlights: [
      "Kiến trúc Non-blocking I/O, Event-driven, Cụm Module Node.js và NPM Scripts chuyên nghiệp",
      "Express.js Framework: Router, Middleware, Request/Response, Error Handling tập trung",
      "Kết nối Cơ sở dữ liệu: MongoDB (Mongoose ODM) & PostgreSQL / MySQL (Prisma ORM)",
      "Bảo mật API: JWT Token, Bcrypt mã hóa mật khẩu, Rate Limiting, Socket.io giao tiếp thời gian thực"
    ],
    techStack: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "Socket.io", "JWT", "Postman"],
    outputProject: "Hệ thống Backend Mạng xã hội thu nhỏ với Chat Realtime và Quản lý Phân quyền",
    color: "#10b981",
    borderColor: "rgba(16, 185, 129, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.04))",
    popularity: 95
  }
];

// 🎓 5 GÓI DỊCH VỤ HỌC VỤ LẬP TRÌNH TRỌNG TÂM CỦA TIN HỌC SAO VIỆT
export const ACADEMIC_SERVICES: AcademicServiceItem[] = [
  {
    id: "serv_1on1",
    title: "Dạy Kèm Lập Trình 1-1 Cá Nhân Hóa",
    shortTitle: "Kèm 1-1 Cá Nhân Hóa",
    badge: "Kèm Trực Tiếp Giảng Viên",
    tagline: "Lộ trình thiết kế riêng — Học linh hoạt rảnh ca nào kèm ca đó",
    description: "Chương trình huấn luyện lập trình kèm cặp sát sao 1 giảng viên kèm 1 học viên. Lộ trình bài giảng và tốc độ học được may đo theo đúng trình độ hiện tại và mục tiêu riêng của học viên (Python, C/C++, Java, C#, PHP, Web Frontend, Backend).",
    targetStudents: "Người mất gốc lập trình, người trái ngành chuyển nghề, học viên cần tiến bộ cấp tốc trong thời gian ngắn.",
    deliverables: [
      "Giảng viên ĐH/kỹ sư phần mềm kèm sát từng dòng code, sửa lỗi trực tiếp",
      "Tự do chọn thời gian học: Sáng (8h-11h), Chiều (14h-17h), Tối (18h-21h)",
      "Cam kết học đến khi thành thạo không giới hạn số buổi quy định",
      "Cấp tài khoản Cổng học vụ trực tuyến luyện code và làm bài tập 24/7"
    ],
    commitment: "Không giới hạn số buổi — Học đến khi làm chủ công nghệ và tự tay xây dựng được dự án phần mềm.",
    ctaText: "Đăng Ký Học Kèm 1-1",
    icon: "🎯",
    accentColor: "#0284c7",
    bgGradient: "linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(14, 165, 233, 0.03))",
    borderColor: "rgba(2, 132, 199, 0.3)"
  },
  {
    id: "serv_capstone",
    title: "Hướng Dẫn & Đỡ Đầu Đồ Án Tốt Nghiệp / Niên Luận CNTT",
    shortTitle: "Đỡ Đầu Đồ Án ĐH",
    badge: "Cam Kết Điểm Cao Hội Đồng",
    tagline: "Hỗ trợ kiến trúc hệ thống, fix bug, hoàn thiện báo cáo và diễn tập bảo vệ thử",
    description: "Dịch vụ đồng hành cùng sinh viên các trường ĐH Bách Khoa, Sư Phạm Kỹ Thuật, KHTN, HUTECH, FPT... từ khâu định hình đề tài, thiết kế Database, xây dựng Backend / Frontend / Mobile đến viết tài liệu báo cáo kỹ thuật.",
    targetStudents: "Sinh viên năm 3, năm cuối các ngành CNTT, Kỹ thuật Phần mềm, Hệ thống Thông tin đang làm đồ án cơ sở, niên luận hoặc khóa luận tốt nghiệp.",
    deliverables: [
      "Review và chuẩn hóa kiến trúc mã nguồn theo chuẩn Clean Code / Microservices",
      "Đỡ đầu giải quyết các lỗi hóc búa, tối ưu Database Indexing và truy vấn SQL",
      "Hỗ trợ hoàn thiện slide thuyết trình, sơ đồ ERD, Use Case, Sequence Diagram",
      "Tổ chức 2 buổi phản biện & bảo vệ thử mô phỏng hội đồng chấm điểm thật"
    ],
    commitment: "Cam kết đồng hành đến khi bảo vệ thành công trước Hội đồng chấm tốt nghiệp của trường.",
    ctaText: "Nhận Tư Vấn Đồ Án",
    icon: "🎓",
    accentColor: "#8b5cf6",
    bgGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(168, 85, 247, 0.03))",
    borderColor: "rgba(139, 92, 246, 0.3)"
  },
  {
    id: "serv_olympic",
    title: "Luyện Thi Học Sinh Giỏi & Olympic Tin Học Chuyên Sâu",
    shortTitle: "Luyện Thi HSG & Tin Học Trẻ",
    badge: "Chinh Phục Giải Thưởng",
    tagline: "Luyện tư duy giải thuật đỉnh cao trên C++ và Python",
    description: "Khóa huấn luyện chuyên biệt dành cho học sinh, sinh viên có đam mê thuật toán, chuẩn bị tham gia các kỳ thi Học sinh giỏi cấp Quận/Tỉnh/Quốc gia, Hội thi Tin học trẻ hoặc Kỳ thi Olympic Tin học Sinh viên Việt Nam.",
    targetStudents: "Học sinh chuyên Tin học, sinh viên đam mê thuật toán và lập trình thi đấu (Competitive Programming).",
    deliverables: [
      "Giáo trình chuyên sâu Cấu trúc dữ liệu nâng cao: Segment Tree, Fenwick, Trie, DSU",
      "Hệ thống chuyên đề thuật toán kinh điển: Quy hoạch động, Đồ thị nâng cao, Hình học tính toán",
      "Rèn luyện kỹ năng cày đề thực chiến trên nền tảng VNOI, Codeforces, LeetCode",
      "Chiến thuật phân bổ thời gian và mẹo tối ưu thời gian chạy (Time Limit) & bộ nhớ (Memory Limit)"
    ],
    commitment: "Đảm bảo bứt phá ít nhất 2 bậc thành tích trong các kỳ thi thuật toán chính thức.",
    ctaText: "Đăng Ký Luyện Đề Thi",
    icon: "🏆",
    accentColor: "#f59e0b",
    bgGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.03))",
    borderColor: "rgba(245, 158, 11, 0.3)"
  },
  {
    id: "serv_career_switch",
    title: "Đào Tạo Chuyển Nghề CNTT Cấp Tốc (Fast-track Career)",
    shortTitle: "Chuyển Nghề Lập Trình",
    badge: "Từ Con Số 0 Đến Có Việc",
    tagline: "Lộ trình thực chiến 4 - 6 tháng định hướng chuẩn tuyển dụng doanh nghiệp",
    description: "Chương trình đào tạo chuyển nghề trọn gói dành cho người đi làm trái ngành muốn gia nhập ngành công nghệ phần mềm. Học trực tiếp trên các bài toán và dự án thực tế của các công ty công nghệ.",
    targetStudents: "Nhân sự các ngành kinh tế, kỹ thuật, kế toán, ngân hàng... muốn đổi hướng nghề nghiệp sang lập trình viên Web Frontend, Backend hoặc Mobile.",
    deliverables: [
      "Bộ giáo trình tinh gọn loại bỏ 100% lý thuyết hàn lâm, tập trung viết code thực tế",
      "Xây dựng ít nhất 3 dự án cá nhân hoàn chỉnh đưa lên GitHub để làm Portfolio",
      "Huấn luyện viết CV chuẩn kỹ thuật, tối ưu hồ sơ LinkedIn và TopCV",
      "Luyện phỏng vấn kỹ thuật Mock Interview 1-1 và kết nối mạng lưới 200+ đối tác tuyển dụng"
    ],
    commitment: "Hỗ trợ học lại miễn phí 100% nếu sau khóa học chưa tự tin ứng tuyển phỏng vấn.",
    ctaText: "Nhận Lộ Trình Chuyển Nghề",
    icon: "💼",
    accentColor: "#10b981",
    bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.03))",
    borderColor: "rgba(16, 185, 129, 0.3)"
  },
  {
    id: "serv_exam_portal",
    title: "Cổng Học Vụ & Khảo Thí Lập Trình Tự Động Trực Tuyến",
    shortTitle: "Cổng Học Vụ & Khảo Thí",
    badge: "Hạ Tầng Khảo Thí 24/7",
    tagline: "Trình chấm code tự động, kho đề thi ngân hàng chuẩn hóa và cấp chứng chỉ số",
    description: "Hệ sinh thái học vụ số độc quyền của Tin Học Sao Việt cho phép học viên ôn tập lý thuyết, giải bài tập lập trình có chấm điểm tự động theo TestCase và tham gia các kỳ thi đánh giá năng lực định kỳ theo chuẩn ISO.",
    targetStudents: "Toàn bộ học viên đang theo học tại 6 cơ sở của Sao Việt và học viên học từ xa toàn quốc.",
    deliverables: [
      "Kho 47 bài giảng và 120+ câu hỏi giải thích tư duy thuật toán chuyên sâu",
      "Hệ thống mô phỏng 6 dạng câu hỏi khảo thí hiện đại (Code, Fill, Drag, Match, Order)",
      "Trình chạy code Sandbox bảo mật kiểm thử tức thì cú pháp và kết quả",
      "Bảng điểm tự động, phân tích điểm yếu kiến thức và cấp chứng chỉ chuẩn Sao Việt"
    ],
    commitment: "Hệ thống vận hành 24/7, đồng bộ tiến độ học tập tức thì giữa các thiết bị.",
    ctaText: "Trải Nghiệm Thi Thử Ngay",
    icon: "⚡",
    accentColor: "#00f5c8",
    bgGradient: "linear-gradient(135deg, rgba(0, 245, 200, 0.08), rgba(20, 184, 166, 0.03))",
    borderColor: "rgba(0, 245, 200, 0.3)"
  }
];
