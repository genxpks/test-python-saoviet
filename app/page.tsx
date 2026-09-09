"use client";

import { useEffect } from "react";
import Canvas3DBackground from "@/components/home/Canvas3DBackground";
import HeroLayer3D from "@/components/home/HeroLayer3D";
import LiveMetricsContainer from "@/components/home/metrics/LiveMetricsContainer";
import SubjectMatrixLayer from "@/components/home/SubjectMatrixLayer";
import InteractiveEngine3D from "@/components/home/InteractiveEngine3D";
import ExamRoadmapLayer from "@/components/home/ExamRoadmapLayer";
import BranchNetworkLayer from "@/components/home/BranchNetworkLayer";
import TechEcosystemLayer from "@/components/home/TechEcosystemLayer";

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
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
          {/* MEDIUM MODULE 1: 3D CYBER HERO & LIVE SANDBOX TERMINAL */}
          <HeroLayer3D />
        </div>

        {/* SUBJECT CARDS: Full-width edge-to-edge */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
          {/* MEDIUM MODULE 2: LIVE METRICS & REALTIME STATS */}
          <LiveMetricsContainer />

          {/* MEDIUM MODULE 3: 4-SUBJECT CURRICULUM MATRIX */}
          <SubjectMatrixLayer />

          {/* MEDIUM MODULE 4: 6-QUESTION INTERACTIVE ENGINE SIMULATOR */}
          <InteractiveEngine3D />

          {/* MEDIUM MODULE 5: 4-STEP EXAM & GRADUATION CERTIFICATION PIPELINE */}
          <ExamRoadmapLayer />

          {/* MEDIUM MODULE 6: 4 TRAINING BRANCHES NETWORK IN HCM CITY */}
          <BranchNetworkLayer />

          {/* MEDIUM MODULE 7: ENTERPRISE TECH STACK & AI REASONING INFRASTRUCTURE */}
          <TechEcosystemLayer />
        </div>
      </div>
    </>
  );
}

