"use client";

import { useEffect } from "react";
import Canvas3DBackground from "@/components/home/Canvas3DBackground";
import HeroLayer3D from "@/components/home/HeroLayer3D";
import LiveMetricsContainer from "@/components/home/metrics/LiveMetricsContainer";
import SaoVietGuaranteesLayer from "@/components/home/SaoVietGuaranteesLayer";
import TrainingPillarsLayer from "@/components/home/TrainingPillarsLayer";
import SubjectMatrixLayer from "@/components/home/SubjectMatrixLayer";
import InteractiveEngine3D from "@/components/home/InteractiveEngine3D";
import ExamRoadmapLayer from "@/components/home/ExamRoadmapLayer";
import BranchNetworkLayer from "@/components/home/BranchNetworkLayer";
import StudentTestimonialsLayer from "@/components/home/StudentTestimonialsLayer";
import TechEcosystemLayer from "@/components/home/TechEcosystemLayer";
import ConsultationBookingLayer from "@/components/home/ConsultationBookingLayer";

export default function HomePage() {
  useEffect(() => {
    // Kích hoạt full-width cho trang chủ — override max-width 1280px của app-container
    const appContainer = document.querySelector(".app-container");
    if (appContainer) appContainer.classList.add("homepage-active");
    return () => {
      const el = document.querySelector(".app-container");
      if (el) el.classList.remove("homepage-active");
    };
  }, []);

  return (
    <>
      {/* 3D PARTICLE & CODE CONSTELLATION GPU LAYER */}
      <Canvas3DBackground />

      <div className="homepage-full" style={{ position: "relative", zIndex: 1 }}>
        {/* HERO: Full-bleed, edge-to-edge với padding nội bộ */}
        <div className="homepage-section-container">
          {/* MODULE 1: 3D CYBER HERO & LIVE SANDBOX TERMINAL */}
          <HeroLayer3D />
        </div>

        {/* NỘI DUNG CHÍNH TRANG CHỦ */}
        <div className="homepage-section-container">
          {/* MODULE 2: LIVE METRICS & REALTIME STATS */}
          <LiveMetricsContainer />

          {/* MODULE 3: 4 CAM KẾT VÀNG ĐỘC QUYỀN CỦA SAO VIỆT */}
          <SaoVietGuaranteesLayer />

          {/* MODULE 4: 4 TRỤ CỘT ĐÀO TẠO THỰC CHIẾN (THVP-32, KẾ TOÁN, LẬP TRÌNH, ĐỒ HỌA) */}
          <TrainingPillarsLayer />

          {/* MODULE 5: MA TRẬN 4 BỘ MÔN CODE TRỌNG ĐIỂM & INSPECTOR BÀI GIẢNG */}
          <SubjectMatrixLayer />

          {/* MODULE 6: 6-DẠNG CÂU HỎI MÔ PHỎNG KHẢO THÍ TƯƠNG TÁC */}
          <InteractiveEngine3D />

          {/* MODULE 7: QUY TRÌNH 4 BƯỚC THI & TỐT NGHIỆP CHUẨN ISO */}
          <ExamRoadmapLayer />

          {/* MODULE 8: MẠNG LƯỚI 6 CƠ SỞ ĐÀO TẠO TẠI TP.HCM & BÌNH DƯƠNG, ĐỒNG NAI */}
          <BranchNetworkLayer />

          {/* MODULE 9: BẰNG CHỨNG XÃ HỘI & PHẢN HỒI HỌC VIÊN TỐT NGHIỆP */}
          <StudentTestimonialsLayer />

          {/* MODULE 10: HẠ TẦNG CÔNG NGHỆ & AI REASONING */}
          <TechEcosystemLayer />

          {/* MODULE 11: FORM ĐĂNG KÝ NHẬN TƯ VẤN & XẾP LỚP HỌC THỬ MIỄN PHÍ */}
          <ConsultationBookingLayer />
        </div>
      </div>
    </>
  );
}

