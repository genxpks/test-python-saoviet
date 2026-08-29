"use client";

import { useState } from "react";
import TiltCard3D from "@/components/home/TiltCard3D";

// 10 Atomic Micro-Components
import HeroEyebrowBadge3D from "./hero/HeroEyebrowBadge3D";
import HeroTitleDisplay from "./hero/HeroTitleDisplay";
import HeroValueProposition from "./hero/HeroValueProposition";
import HeroActionCTAButtonGroup from "./hero/HeroActionCTAButtonGroup";
import HeroFeatureMicroBadges from "./hero/HeroFeatureMicroBadges";
import TerminalTopBar from "./hero/TerminalTopBar";
import TerminalCodeEditor from "./hero/TerminalCodeEditor";
import TerminalActionControls from "./hero/TerminalActionControls";
import TerminalOutputConsole from "./hero/TerminalOutputConsole";
import FloatingBadgeWidgets3D from "./hero/FloatingBadgeWidgets3D";

const CODE_SNIPPETS = {
  python: {
    title: "python_curriculum_master.py",
    language: "Python 3.12",
    code: `# Tin Học Sao Việt — Đào tạo Python Nâng Cao
def evaluate_student(scores: list[float]) -> dict:
    avg = sum(scores) / len(scores)
    rank = "Xuất Sắc" if avg >= 9.0 else "Giỏi" if avg >= 8.0 else "Khá"
    return {
        "average": round(avg, 2),
        "rank": rank,
        "certificate": "SaoViet_Gold_Cert_2026",
        "eligible_exam": True
    }

# Chạy kiểm thử tự động
results = evaluate_student([9.5, 9.0, 9.2, 9.8])
print(f"🎓 Xếp loại: {results['rank']} | Điểm TB: {results['average']}")`,
    output: `>>> Executing python_curriculum_master.py ...
[OK] Sandbox Python Engine v3.12.2 Initialized
🎓 Xếp loại: Xuất Sắc | Điểm TB: 9.38
🏆 Đạt chuẩn Chứng Chỉ Tốt Nghiệp Tin Học Sao Việt!`
  },
  cpp: {
    title: "algorithm_binary_tree.cpp",
    language: "C++ 17",
    code: `// Tin Học Sao Việt — C/C++ Thuật Toán Nâng Cao
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {45, 12, 89, 34, 99, 23};
    std::sort(numbers.begin(), numbers.end());
    
    std::cout << "🚀 Mảng sau sắp xếp: ";
    for (int num : numbers) std::cout << num << " ";
    return 0;
}`,
    output: `>>> Compiling with g++ -std=c++17 ...
🚀 Mảng sau sắp xếp: 12 23 34 45 89 99 
[Execution time: 0.002s — Memory: 2.1MB]`
  },
  web: {
    title: "InteractiveCanvas3D.tsx",
    language: "Next.js / TypeScript",
    code: `// Frontend Modern Web Studio
export default function CyberMatrix3D() {
  return (
    <div className="cyber-studio-glow">
      <h1>Tin Học Sao Việt Web Tech</h1>
      <p>3D Perspective Canvas • GPU Acceleration</p>
    </div>
  );
}`,
    output: `>>> Fast Refresh loaded in 38ms
[Vite/Next.js] 19 route modules optimized
✨ Rendering 3D interactive layout smoothly!`
  }
};

export default function HeroLayer3D() {
  const [activeTab, setActiveTab] = useState<"python" | "cpp" | "web">("python");
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setShowOutput(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowOutput(true);
    }, 550);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{ position: "relative", marginBottom: "4rem", perspective: "1200px" }}>
      {/* Aurora Ambient Glows */}
      <div style={{
        position: "absolute",
        top: "-100px",
        left: "5%",
        width: "420px",
        height: "420px",
        background: "radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, transparent 70%)",
        filter: "blur(70px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div style={{
        position: "absolute",
        top: "10%",
        right: "5%",
        width: "380px",
        height: "380px",
        background: "radial-gradient(circle, rgba(5, 150, 105, 0.2) 0%, transparent 70%)",
        filter: "blur(65px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div 
        className="hero-grid-responsive"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1.08fr 0.92fr",
          gap: "2.5rem",
          alignItems: "center"
        }}
      >
        {/* Left Column: Composed of 5 Micro-Components */}
        <div>
          <HeroEyebrowBadge3D />
          <HeroTitleDisplay />
          <HeroValueProposition />
          <HeroActionCTAButtonGroup />
          <HeroFeatureMicroBadges />
        </div>

        {/* Right Column: Composed of Terminal Sandbox & Floating 3D Widgets */}
        <div style={{ position: "relative" }}>
          <TiltCard3D maxTilt={10} perspective={1200} scale={1.02} glowColor="rgba(37, 99, 235, 0.2)">
            <div style={{
              background: "#070d19",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 35px rgba(37, 99, 235, 0.2)",
              overflow: "hidden"
            }}>
              <TerminalTopBar
                title={CODE_SNIPPETS[activeTab].title}
                activeLanguage={activeTab}
                onLanguageChange={setActiveTab}
              />
              <TerminalCodeEditor code={CODE_SNIPPETS[activeTab].code} />
              <TerminalActionControls
                isRunning={isRunning}
                copied={copied}
                onCopy={handleCopyCode}
                onRun={handleRunCode}
              />
              {showOutput && (
                <TerminalOutputConsole output={CODE_SNIPPETS[activeTab].output} />
              )}
            </div>
          </TiltCard3D>

          {/* Floating 3D Badges */}
          <FloatingBadgeWidgets3D />
        </div>
      </div>
    </section>
  );
}
