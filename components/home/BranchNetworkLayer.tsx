"use client";

import { useState } from "react";

// 10 Atomic Micro-Components
import NetworkSectionHeader from "./network/NetworkSectionHeader";
import BranchGridContainer from "./network/BranchGridContainer";
import BranchMapLinkAction from "./network/BranchMapLinkAction";
import BranchSupportCallout from "./network/BranchSupportCallout";

interface BranchItem {
  code: string;
  name: string;
  district: string;
  address: string;
  phone: string;
  manager: string;
  rooms: string;
  pin: string;
}

const BRANCHES: BranchItem[] = [
  {
    code: "CN_THUDUC",
    name: "Trung Tâm Tin Học Sao Việt — Cơ Sở Thủ Đức",
    district: "TP. Thủ Đức",
    address: "Số 15, Đường Số 9, P. Linh Tây, TP. Thủ Đức, TP.HCM",
    phone: "0901.888.666",
    manager: "ThS. Nguyễn Văn A",
    rooms: "04 Phòng máy chuyên dụng (Core i7, 32GB RAM)",
    pin: "8888"
  },
  {
    code: "CN_QUAN1",
    name: "Trung Tâm Tin Học Sao Việt — Cơ Sở Quận 1",
    district: "Quận 1",
    address: "Số 45, Đường Lê Duẩn, P. Bến Nghé, Quận 1, TP.HCM",
    phone: "0902.777.888",
    manager: "ThS. Trần Thị B",
    rooms: "03 Phòng Lab cao cấp trang bị macOS & Linux",
    pin: "9999"
  },
  {
    code: "CN_GOVAP",
    name: "Trung Tâm Tin Học Sao Việt — Cơ Sở Gò Vấp",
    district: "Gò Vấp",
    address: "Số 120, Đường Quang Trung, P. 10, Q. Gò Vấp, TP.HCM",
    phone: "0903.666.999",
    manager: "KSTK. Lê Hoàng C",
    rooms: "04 Phòng máy lạnh tiêu chuẩn ISO",
    pin: "6666"
  },
  {
    code: "CN_BINHTHANH",
    name: "Trung Tâm Tin Học Sao Việt — Cơ Sở Bình Thạnh",
    district: "Bình Thạnh",
    address: "Số 88, Đường Điện Biên Phủ, P. 25, Q. Bình Thạnh, TP.HCM",
    phone: "0904.555.444",
    manager: "ThS. Phạm Quốc D",
    rooms: "05 Phòng máy kết nối mạng Gigabit băng thông cao",
    pin: "7777"
  }
];

export default function BranchNetworkLayer() {
  const [activeBranch, setActiveBranch] = useState(BRANCHES[0]);

  return (
    <section style={{ marginBottom: "4rem" }}>
      {/* 1. Header Micro-Component */}
      <NetworkSectionHeader />

      {/* 2. Grid Container with 3D Branch Cards */}
      <BranchGridContainer
        branches={BRANCHES}
        activeBranchCode={activeBranch.code}
        onSelectBranch={setActiveBranch}
      />

      {/* 3. Support Callout & Footnotes */}
      <BranchSupportCallout />
      <BranchMapLinkAction />
    </section>
  );
}
