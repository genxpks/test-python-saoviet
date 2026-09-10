"use client";

import { useState } from "react";

// 10 Atomic Micro-Components
import NetworkSectionHeader from "./network/NetworkSectionHeader";
import BranchGridContainer from "./network/BranchGridContainer";
import BranchMapLinkAction from "./network/BranchMapLinkAction";
import BranchSupportCallout from "./network/BranchSupportCallout";

import { SAOVIET_BRANCHES } from "@/lib/saovietData";

// Chuyển đổi dữ liệu chuẩn sang format component
const BRANCHES = SAOVIET_BRANCHES.map((b) => ({
  code: b.code,
  name: b.name,
  district: b.district,
  address: b.address,
  phone: b.phone,
  manager: b.manager,
  rooms: b.facilities,
  pin: b.pin
}));

export default function BranchNetworkLayer() {
  const [activeBranch, setActiveBranch] = useState(BRANCHES[0]);

  return (
    <section style={{ marginBottom: "4.5rem" }}>
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
