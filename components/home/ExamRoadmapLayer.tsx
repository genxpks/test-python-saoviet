"use client";

import { 
  UserCheck, 
  BookOpen, 
  Clock, 
  Award
} from "lucide-react";

// 10 Atomic Micro-Components
import RoadmapSectionHeader from "./roadmap/RoadmapSectionHeader";
import RoadmapGridContainer from "./roadmap/RoadmapGridContainer";
import RoadmapCertHighlight from "./roadmap/RoadmapCertHighlight";
import RoadmapActionCTA from "./roadmap/RoadmapActionCTA";
import RoadmapSummaryFooter from "./roadmap/RoadmapSummaryFooter";

export default function ExamRoadmapLayer() {
  const steps = [
    {
      step: "BƯỚC 1",
      title: "Đăng Nhập Khóa Học",
      desc: "Xác thực danh tính học viên, đồng bộ chi nhánh phòng Lab và bắt đầu phiên học có giám sát thời lượng 3 giờ.",
      icon: UserCheck,
      color: "#2563eb"
    },
    {
      step: "BƯỚC 2",
      title: "Luyện Tập 120 Câu",
      desc: "Cọ xát toàn bộ 6 archetype câu hỏi có giải thích chi tiết và gợi ý logic sư phạm từ trợ lý Gemini 2.0 AI.",
      icon: BookOpen,
      color: "#059669"
    },
    {
      step: "BƯỚC 3",
      title: "Thi Thật 50 Phút",
      desc: "Làm bài thi chuẩn hóa bấm giờ, hệ thống tự động ghi nhận chống gian lận và tính điểm trung thực khách quan.",
      icon: Clock,
      color: "#7c3aed"
    },
    {
      step: "BƯỚC 4",
      title: "Nhận Chứng Nhận",
      desc: "Đạt từ 5.0/10 điểm trở lên được cấp ngay Chứng chỉ Tốt nghiệp Tin Học Sao Việt chuẩn khổ A4 in ấn sắc nét.",
      icon: Award,
      color: "#d97706"
    }
  ];

  return (
    <section style={{ marginBottom: "4rem" }}>
      {/* 1. Header Micro-Component */}
      <RoadmapSectionHeader />

      {/* 2. Grid of 4 Roadmap Step Cards */}
      <RoadmapGridContainer steps={steps} />

      {/* 3. Certificate Gold Highlight Bar */}
      <RoadmapCertHighlight />

      {/* 4. Action CTA & Summary Footnotes */}
      <RoadmapActionCTA />
      <RoadmapSummaryFooter />
    </section>
  );
}
