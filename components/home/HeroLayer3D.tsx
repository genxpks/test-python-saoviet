"use client";

import { useState } from "react";
import TiltCard3D from "@/components/home/TiltCard3D";
import CyberPlanet3D from "./hero/CyberPlanet3D";
import CosmicSubjectDeck from "./hero/CosmicSubjectDeck";

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
import { Orbit, Terminal, Sparkles } from "lucide-react";

const CODE_SNIPPETS = {
  python: {
    title: "python_curriculum_master.py",
    language: "Python 3.12",
    code: `# Tin Học Sao Việt — Đào tạo Python Nâng Cao
def evaluate_student(scores: list[float]) -> dict:
    avg = sum(scores) / len(scores)
    return {
        "average": round(avg, 2),
        "rank": "Xuất Sắc" if avg >= 9.0 else "Giỏi",
        "certificate": "SaoViet_Gold_Cert_2026"
    }

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
  const [heroMode, setHeroMode] = useState<"planet" | "editor">("planet");
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
    }, 450);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{ position: "relative", marginBottom: "3.5rem", perspective: "1200px" }}>
      {/* Aurora Ambient Glows */}
      <div style={{
        position: "absolute",
        top: "-80px",
        left: "5%",
        width: "420px",
        height: "420px",
        background: "radial-gradient(circle, rgba(0, 245, 200, 0.16) 0%, transparent 70%)",
        filter: "blur(65px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div style={{
        position: "absolute",
        top: "10%",
        right: "5%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div 
        className="hero-grid-responsive"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1.02fr 0.98fr",
          gap: "2.5rem",
          alignItems: "center"
        }}
      >
        {/* Left Column: Composed of 5 Micro-Components */}
        <div className="animate-left">
          <HeroEyebrowBadge3D />
          <HeroTitleDisplay />
          <HeroValueProposition />
          <HeroActionCTAButtonGroup />
          <HeroFeatureMicroBadges />
        </div>

        {/* Right Column: 3D Holographic Planet or Live Sandbox Terminal */}
        <div className="animate-right">
          {/* Mode Switcher Tabs (3D Planet vs Terminal) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginBottom: "0.75rem"
          }}>
            <button
              onClick={() => setHeroMode("planet")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.9rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.78rem",
                fontWeight: 800,
                border: "1px solid",
                borderColor: heroMode === "planet" ? "#00f5c8" : "rgba(255,255,255,0.1)",
                background: heroMode === "planet" ? "rgba(0, 245, 200, 0.15)" : "rgba(8, 16, 38, 0.6)",
                color: heroMode === "planet" ? "#00f5c8" : "var(--text-muted)",
                cursor: "pointer",
                boxShadow: heroMode === "planet" ? "0 0 15px rgba(0, 245, 200, 0.25)" : "none",
                transition: "all 0.25s ease"
              }}
            >
              <Orbit size={13} />
              <span>Hành Tinh 3D</span>
            </button>

            <button
              onClick={() => setHeroMode("editor")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.9rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.78rem",
                fontWeight: 800,
                border: "1px solid",
                borderColor: heroMode === "editor" ? "#38bdf8" : "rgba(255,255,255,0.1)",
                background: heroMode === "editor" ? "rgba(56, 189, 248, 0.15)" : "rgba(8, 16, 38, 0.6)",
                color: heroMode === "editor" ? "#38bdf8" : "var(--text-muted)",
                cursor: "pointer",
                boxShadow: heroMode === "editor" ? "0 0 15px rgba(56, 189, 248, 0.25)" : "none",
                transition: "all 0.25s ease"
              }}
            >
              <Terminal size={13} />
              <span>Code Sandbox</span>
            </button>
          </div>

          {heroMode === "planet" ? (
            <div style={{
              background: "radial-gradient(ellipse at center, rgba(6, 16, 42, 0.8) 0%, rgba(2, 6, 18, 0.9) 100%)",
              border: "1px solid rgba(0, 245, 200, 0.22)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(0, 245, 200, 0.15)",
              overflow: "hidden"
            }}>
              <CyberPlanet3D />
            </div>
          ) : (
            <TiltCard3D maxTilt={6} perspective={1200} scale={1.015} glowColor="rgba(56, 189, 248, 0.2)">
              <div style={{
                background: "#070d19",
                border: "1px solid rgba(0, 245, 200, 0.2)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 245, 200, 0.12)",
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
          )}

          {/* Cleanly Docked Feature Badges Below */}
          <FloatingBadgeWidgets3D />
        </div>
      </div>

      {/* QUICK SUBJECT SELECTION CARDS (Matching User Mockup) */}
      <CosmicSubjectDeck />
    </section>
  );
}
