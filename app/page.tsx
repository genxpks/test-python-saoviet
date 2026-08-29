import Canvas3DBackground from "@/components/home/Canvas3DBackground";
import HeroLayer3D from "@/components/home/HeroLayer3D";
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
        {/* LAYER 1: 3D CYBER HERO & LIVE SANDBOX TERMINAL */}
        <HeroLayer3D />

        {/* LAYER 2: 4-SUBJECT CURRICULUM MATRIX */}
        <SubjectMatrixLayer />

        {/* LAYER 3: 6-QUESTION INTERACTIVE ENGINE SIMULATOR */}
        <InteractiveEngine3D />

        {/* LAYER 4: 4-STEP EXAM & GRADUATION CERTIFICATION PIPELINE */}
        <ExamRoadmapLayer />

        {/* LAYER 5: 4 TRAINING BRANCHES NETWORK IN HCM CITY */}
        <BranchNetworkLayer />

        {/* LAYER 6: ENTERPRISE TECH STACK & AI REASONING INFRASTRUCTURE */}
        <TechEcosystemLayer />
      </div>
    </>
  );
}
