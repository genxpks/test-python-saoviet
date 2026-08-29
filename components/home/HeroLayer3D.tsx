"use client";

import { useState } from "react";
import Link from "next/link";
import TiltCard3D from "./TiltCard3D";
import { 
  Sparkles, 
  Terminal, 
  Play, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Award, 
  ArrowRight, 
  Code2, 
  Layers, 
  Bot, 
  Cpu, 
  Copy, 
  Check,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";

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
      {/* Dynamic Aurora Glow Backdrops */}
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

      {/* Hero Grid Layout */}
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
        {/* Left Column: Thesis Statement & Value Prop */}
        <div>
          {/* Eyebrow Pill */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 0.9rem",
            borderRadius: "var(--radius-full)",
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(6, 182, 212, 0.1))",
            border: "1px solid rgba(37, 99, 235, 0.25)",
            color: "var(--brand-primary)",
            fontSize: "0.82rem",
            fontWeight: 800,
            marginBottom: "1.2rem",
            boxShadow: "0 2px 10px rgba(37, 99, 235, 0.1)"
          }}>
            <Sparkles size={15} />
            <span>NỀN TẢNG KHẢO THÍ & ĐÀO TẠO CHUẨN DOANH NGHIỆP 2026</span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: "1.2rem",
            letterSpacing: "-0.04em",
            color: "#0f172a"
          }}>
            Hệ Thống Đào Tạo & <br />
            <span style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #06b6d4 50%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block"
            }}>
              Khảo Thí Lập Trình 3D
            </span>
          </h1>

          <p style={{
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            marginBottom: "2rem",
            maxWidth: "580px"
          }}>
            Trải nghiệm học tập và khảo sát năng lực trực quan với <strong>120+ câu hỏi đa dạng 6 archetype</strong>, 
            trình giả lập <strong>Python Live Sandbox</strong> trực tiếp trên trình duyệt, đồng hồ kiểm soát phiên 3 giờ và cấp chứng chỉ chuẩn hóa Tin Học Sao Việt.
          </p>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.2rem" }}>
            <Link href="/study" className="btn btn-primary btn-lg" style={{ gap: "0.6rem" }}>
              <BookOpen size={18} />
              <span>Bắt Đầu Ôn Tập 120 Câu</span>
              <ArrowRight size={16} />
            </Link>

            <Link href="/exam" className="btn btn-secondary btn-lg" style={{ gap: "0.6rem" }}>
              <Clock size={18} color="var(--brand-primary)" />
              <span>Vào Phòng Thi Online 50P</span>
            </Link>
          </div>

          {/* Live Feature Badges */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.8rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border-light)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(37, 99, 235, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-primary)" }}>
                <Code2 size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>120+ Câu Hỏi</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>6 Archetype chuẩn</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(5, 150, 105, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-emerald)" }}>
                <Award size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>Chứng Chỉ Vàng</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Sao Việt Cert A4</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(124, 58, 237, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-violet)" }}>
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>Gemini 2.0 AI</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Sư phạm tự động</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Perspective Live Terminal Sandbox */}
        <div style={{ position: "relative" }}>
          <TiltCard3D maxTilt={10} perspective={1200} scale={1.02} glowColor="rgba(37, 99, 235, 0.2)">
            <div style={{
              background: "#070d19",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 35px rgba(37, 99, 235, 0.2)",
              overflow: "hidden"
            }}>
              {/* Terminal Window Top Bar */}
              <div style={{
                background: "#0d1527",
                padding: "0.8rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #1e293b"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div className="terminal-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#94a3b8", fontWeight: 600 }}>
                    {CODE_SNIPPETS[activeTab].title}
                  </span>
                </div>

                {/* Language Switcher Tabs */}
                <div style={{ display: "flex", gap: "0.3rem", background: "rgba(15, 23, 42, 0.8)", padding: "2px", borderRadius: "6px" }}>
                  <button
                    onClick={() => setActiveTab("python")}
                    style={{
                      background: activeTab === "python" ? "var(--brand-primary)" : "transparent",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.2rem 0.55rem",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Python
                  </button>
                  <button
                    onClick={() => setActiveTab("cpp")}
                    style={{
                      background: activeTab === "cpp" ? "var(--brand-primary)" : "transparent",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.2rem 0.55rem",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    C++
                  </button>
                  <button
                    onClick={() => setActiveTab("web")}
                    style={{
                      background: activeTab === "web" ? "var(--brand-primary)" : "transparent",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.2rem 0.55rem",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    TypeScript
                  </button>
                </div>
              </div>

              {/* Code Editor Body */}
              <div style={{ padding: "1.25rem 1.4rem", maxHeight: "250px", overflowY: "auto", fontFamily: "var(--font-mono)", fontSize: "0.88rem", lineHeight: "1.6" }}>
                <pre style={{ margin: 0, color: "#38bdf8", overflowX: "auto" }}>
                  {CODE_SNIPPETS[activeTab].code}
                </pre>
              </div>

              {/* Terminal Bottom Controls */}
              <div style={{
                background: "#090f1d",
                padding: "0.75rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid #1e293b"
              }}>
                <button
                  onClick={handleCopyCode}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.78rem" }}
                >
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copied ? "Đã sao chép" : "Sao chép code"}</span>
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="btn btn-success btn-sm"
                  style={{ padding: "0.35rem 1rem", fontSize: "0.82rem", borderRadius: "6px" }}
                >
                  <Play size={14} />
                  <span>{isRunning ? "Đang chạy..." : "Chạy Sandbox"}</span>
                </button>
              </div>

              {/* Terminal Output Console */}
              {showOutput && (
                <div style={{
                  background: "#040711",
                  borderTop: "1px solid #1e293b",
                  padding: "0.9rem 1.25rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  color: "#10b981",
                  lineHeight: "1.5"
                }}>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{CODE_SNIPPETS[activeTab].output}</pre>
                </div>
              )}
            </div>
          </TiltCard3D>

          {/* Floating 3D Widget 1: Sao Viet Cert Gold */}
          <div style={{
            position: "absolute",
            top: "-25px",
            right: "-20px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(226, 232, 240, 0.9)",
            borderRadius: "var(--radius-md)",
            padding: "0.6rem 1rem",
            boxShadow: "0 14px 28px rgba(15, 23, 42, 0.12)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            zIndex: 20,
            transform: "translateZ(30px)"
          }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Award size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#0f172a" }}>Chứng Nhận Sao Việt</div>
              <div style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 700 }}>Đạt chuẩn ISO Khảo Thí</div>
            </div>
          </div>

          {/* Floating 3D Widget 2: Live AI Gemini */}
          <div style={{
            position: "absolute",
            bottom: "-20px",
            left: "-20px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(226, 232, 240, 0.9)",
            borderRadius: "var(--radius-md)",
            padding: "0.6rem 1rem",
            boxShadow: "0 14px 28px rgba(15, 23, 42, 0.12)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            zIndex: 20,
            transform: "translateZ(30px)"
          }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#0f172a" }}>AI Sư Phạm 2.0</div>
              <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Giải thích logic tức thì</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
