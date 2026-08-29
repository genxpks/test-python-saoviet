"use client";

import { 
  Bot, 
  Database, 
  FileSpreadsheet, 
  Cpu 
} from "lucide-react";

// 10 Atomic Micro-Components
import EcosystemSectionHeader from "./ecosystem/EcosystemSectionHeader";
import TechGridContainer from "./ecosystem/TechGridContainer";
import AiCapabilityHighlight from "./ecosystem/AiCapabilityHighlight";
import DatabaseClusterHighlight from "./ecosystem/DatabaseClusterHighlight";
import ExcelEngineHighlight from "./ecosystem/ExcelEngineHighlight";
import SandboxRunnerHighlight from "./ecosystem/SandboxRunnerHighlight";

export default function TechEcosystemLayer() {
  const stack = [
    {
      title: "Trợ Lý Gemini AI 2.0",
      desc: "Phân tích logic từng bước, gợi ý thuật toán và giải thích bẫy trắc nghiệm cho học viên 24/7 tức thời.",
      icon: Bot,
      color: "#2563eb",
      badge: "AI Native"
    },
    {
      title: "MongoDB Atlas Cloud",
      desc: "Hệ thống CSDL phân tán quản lý tập trung 4 cơ sở, lưu trữ 120+ câu hỏi và lịch sử học tập tức thời.",
      icon: Database,
      color: "#059669",
      badge: "Real-time DB"
    },
    {
      title: "Excel Importer / Exporter",
      desc: "Bộ xử lý bảng tính thông minh hỗ trợ nạp đề thi 6 dạng câu hỏi và trích xuất bảng điểm chuẩn nghiệp vụ.",
      icon: FileSpreadsheet,
      color: "#0891b2",
      badge: "Office Ready"
    },
    {
      title: "Trình Biên Dịch Sandbox",
      desc: "Thực thi mã nguồn Python trực tiếp trên trình duyệt, cách ly an toàn, hỗ trợ test case tự động.",
      icon: Cpu,
      color: "#7c3aed",
      badge: "Fast Sandbox"
    }
  ];

  return (
    <section style={{ marginBottom: "4rem" }}>
      {/* 1. Header Micro-Component */}
      <EcosystemSectionHeader />

      {/* 2. Grid Container with 3D Tech Cards */}
      <TechGridContainer stack={stack} />

      {/* 3. Highlight callouts & specs */}
      <AiCapabilityHighlight />
      <ExcelEngineHighlight />
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginTop: "1rem" }}>
        <DatabaseClusterHighlight />
        <SandboxRunnerHighlight />
      </div>
    </section>
  );
}
