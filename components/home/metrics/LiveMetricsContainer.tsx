"use client";

import { 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle2 
} from "lucide-react";

// 10 Atomic Micro-Components
import MetricSyncStatus from "./MetricSyncStatus";
import MetricGridWrapper from "./MetricGridWrapper";

export default function LiveMetricsContainer() {
  const metrics = [
    {
      label: "Học Viên Đang Luyện Tập",
      value: "1,248+",
      trend: "+14.2% tuần này",
      icon: Users,
      color: "#2563eb"
    },
    {
      label: "Ngân Hàng Câu Hỏi Chuẩn",
      value: "120 Câu",
      trend: "6 Dạng tương tác",
      icon: BookOpen,
      color: "#059669"
    },
    {
      label: "Tỉ Lệ Đạt Chứng Chỉ",
      value: "94.6%",
      trend: "Chuẩn đầu ra Sao Việt",
      icon: Award,
      color: "#7c3aed"
    },
    {
      label: "Phòng Lab Đang Hoạt Động",
      value: "16 Phòng",
      trend: "4 Cơ sở TP.HCM",
      icon: CheckCircle2,
      color: "#d97706"
    }
  ];

  return (
    <section style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <MetricSyncStatus />
      </div>
      <MetricGridWrapper metrics={metrics} />
    </section>
  );
}
