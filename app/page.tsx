import Canvas3DBackground from "@/components/home/Canvas3DBackground";
import HeroLayer3D from "@/components/home/HeroLayer3D";
import LiveMetricsContainer from "@/components/home/metrics/LiveMetricsContainer";
import SubjectMatrixLayer from "@/components/home/SubjectMatrixLayer";
import InteractiveEngine3D from "@/components/home/InteractiveEngine3D";
import ExamRoadmapLayer from "@/components/home/ExamRoadmapLayer";
import BranchNetworkLayer from "@/components/home/BranchNetworkLayer";
import TechEcosystemLayer from "@/components/home/TechEcosystemLayer";

export default function HomePage() {
  return (
    <>
      {/* 3D PARTICLE & CODE CONSTELLATION GPU LAYER */}
      <Canvas3DBackground />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 0.5rem", position: "relative", zIndex: 1 }}>
        {/* MEDIUM MODULE 1: 3D CYBER HERO & LIVE SANDBOX TERMINAL (10 Micro-Components) */}
        <HeroLayer3D />

        {/* MEDIUM MODULE 2: LIVE METRICS & REALTIME STATS (10 Micro-Components) */}
        <LiveMetricsContainer />

        {/* MEDIUM MODULE 3: 4-SUBJECT CURRICULUM MATRIX (10 Micro-Components) */}
        <SubjectMatrixLayer />

        {/* MEDIUM MODULE 4: 6-QUESTION INTERACTIVE ENGINE SIMULATOR (10 Micro-Components) */}
        <InteractiveEngine3D />

        {/* MEDIUM MODULE 5: 4-STEP EXAM & GRADUATION CERTIFICATION PIPELINE (10 Micro-Components) */}
        <ExamRoadmapLayer />

        {/* MEDIUM MODULE 6: 4 TRAINING BRANCHES NETWORK IN HCM CITY (10 Micro-Components) */}
        <BranchNetworkLayer />

        {/* MEDIUM MODULE 7: ENTERPRISE TECH STACK & AI REASONING INFRASTRUCTURE (10 Micro-Components) */}
        <TechEcosystemLayer />
      </div>
    </>
  );
}
