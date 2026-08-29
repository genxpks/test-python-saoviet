"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  ChevronRight, 
  Copy, 
  Check 
} from "lucide-react";

const CODE_SNIPPETS = {
  python: {
    title: "python_curriculum_master.py",
    language: "Python 3.12",
    code: `# Tin Học Sao Việt — Đào tạo Python Nâng Cao
def calculate_scholarship(scores: list[float]) -> dict:
    avg = sum(scores) / len(scores)
    rank = "Xuất Sắc" if avg >= 9.0 else "Giỏi" if avg >= 8.0 else "Khá"
    return {
        "average": round(avg, 2),
        "rank": rank,
        "certificate": "SaoViet_Gold_Cert_2026"
    }

# Chạy thử nghiệm với điểm số học viên
results = calculate_scholarship([9.5, 9.0, 9.2, 9.8])
print(f"🎓 Kết quả: {results['rank']} | Điểm TB: {results['average']}")`,
    output: `>>> Executing python_curriculum_master.py ...
[OK] Sandbox Python Engine v3.12.2 Initialized
🎓 Kết quả: Xuất Sắc | Điểm TB: 9.38
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
    title: "InteractiveCanvas.tsx",
    language: "Next.js / TypeScript",
    code: `// Frontend Modern Web Studio
export default function CyberMatrix() {
  return (
    <div className="cyber-studio-glow">
      <h1>Tin Học Sao Việt Web Tech</h1>
      <p>HTML5 Semantics • CSS3 3D Keyframes • React</p>
    </div>
  );
}`,
    output: `>>> Fast Refresh loaded in 42ms
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
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{ position: "relative", marginBottom: "3.5rem", perspective: "1200px" }}>
      {/* Background Ambient Glows */}
      <div style={{
        position: "absolute",
        top: "-80px",
        left: "10%",
        width: "350px",
        height: "350px",
        background: "radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div style={{
        position: "absolute",
        top: "20%",
        right: "5%",
        width: "320px",
        height: "320px",
        background: "radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)",
        filter: "blur(55px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Hero Grid Content */}
      <div 
        className="hero-grid-responsive"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "2.5rem",
          alignItems: "center",
          background: "linear-gradient(145deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.98) 100%)",
          border: "1px solid rgba(226, 232, 240, 0.9)",
          borderRadius: "var(--radius-xl)",
          padding: "3rem 2.5rem",
          boxShadow: "0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0,0,0,0.02)",
          backdropFilter: "blur(12px)"
        }}
      >
        {/* Left Column: Typography & CTAs */}
        <div>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(16, 185, 129, 0.1))",
            border: "1px solid rgba(37, 99, 235, 0.25)",
            padding: "0.4rem 0.9rem",
            borderRadius: "var(--radius-full)",
            fontSize: "0.82rem",
            fontWeight: 800,
            color: "var(--brand-primary)",
            marginBottom: "1.2rem",
            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.08)"
          }}>
            <Sparkles size={14} className="spin-slow" />
            <span>HỆ THỐNG ĐÀO TẠO & KHẢO THÍ CHUẨN QUỐC TẾ 2026</span>
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-0.035em",
            marginBottom: "1.1rem",
            color: "#0f172a"
          }}>
            Luyện Thi Lập Trình <br />
            <span style={{
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 50%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Đa Ngôn Ngữ & Đa Cơ Sở
            </span>
          </h1>

          <p style={{
            fontSize: "1rem",
            color: "#475569",
            lineHeight: 1.65,
            marginBottom: "1.8rem",
            maxWidth: "520px"
          }}>
            Học viện công nghệ <strong>Tin Học Sao Việt</strong>: Ôn luyện 120 câu hỏi 6 dạng tương tác, viết code trực tiếp trên Sandbox IDE, thi trực tuyến bấm giờ và cấp chứng nhận năng lực theo chuẩn giáo trình.
          </p>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <Link 
              href="/study" 
              className="btn btn-primary btn-lg"
              style={{
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                boxShadow: "0 8px 20px -4px rgba(37, 99, 235, 0.4)",
                padding: "0.8rem 1.6rem",
                borderRadius: "var(--radius-md)"
              }}
            >
              <BookOpen size={18} />
              <span>Bắt Đầu Ôn Tập</span>
              <ArrowRight size={16} />
            </Link>

            <Link 
              href="/exam" 
              className="btn btn-success btn-lg"
              style={{
                background: "linear-gradient(135deg, #10b981, #047857)",
                boxShadow: "0 8px 20px -4px rgba(16, 185, 129, 0.35)",
                padding: "0.8rem 1.6rem",
                borderRadius: "var(--radius-md)"
              }}
            >
              <Clock size={18} />
              <span>Vào Thi Online 50 Phút</span>
            </Link>
          </div>

          {/* Micro Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.8rem",
            borderTop: "1px solid var(--border-light)",
            paddingTop: "1.2rem"
          }}>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--brand-primary)" }}>120+</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Câu Hỏi Phân Loại</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--brand-emerald)" }}>06 Dạng</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Tương Tác Logic</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--brand-violet)" }}>04 Cơ Sở</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>TP.HCM Phủ Rộng</div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive Terminal Window */}
        <div style={{
          transform: "rotateY(-4deg) rotateX(2deg)",
          transition: "transform 0.4s ease, box-shadow 0.4s ease",
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.1)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          background: "#0b1120"
        }}>
          {/* Terminal Header */}
          <div style={{
            background: "#070d19",
            padding: "0.75rem 1rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            {/* Window Traffic Dots */}
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#10b981" }} />
            </div>

            {/* Language Switcher Tabs */}
            <div style={{ display: "flex", gap: "4px", background: "rgba(255, 255, 255, 0.06)", padding: "2px", borderRadius: "6px" }}>
              {(["python", "cpp", "web"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  style={{
                    padding: "3px 10px",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: "4px",
                    background: activeTab === lang ? "var(--brand-primary)" : "transparent",
                    color: activeTab === lang ? "#ffffff" : "#94a3b8",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                onClick={handleCopyCode}
                title="Sao chép mã"
                style={{
                  background: "transparent",
                  border: "none",
                  color: copied ? "#10b981" : "#94a3b8",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  border: "none",
                  borderRadius: "4px",
                  color: "#ffffff",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "3px 8px",
                  cursor: "pointer"
                }}
              >
                <Play size={11} fill="#ffffff" />
                <span>{isRunning ? "Running..." : "Run Code"}</span>
              </button>
            </div>
          </div>

          {/* Code Editor Body */}
          <div style={{
            padding: "1rem 1.2rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
            lineHeight: 1.6,
            color: "#e2e8f0",
            maxHeight: "240px",
            overflowY: "auto",
            background: "#0b1120"
          }}>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              <code>{CODE_SNIPPETS[activeTab].code}</code>
            </pre>
          </div>

          {/* Live Terminal Output Console */}
          <div style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "#050811",
            padding: "0.8rem 1.2rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--brand-cyan)", marginBottom: "0.3rem", fontWeight: 700 }}>
              <Terminal size={12} />
              <span>TERMINAL OUTPUT</span>
            </div>
            {isRunning ? (
              <div style={{ color: "var(--brand-amber)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="dot-pulse">●</span> Đang biên dịch mã nguồn qua Sandbox Engine...
              </div>
            ) : showOutput ? (
              <pre style={{ margin: 0, color: "#4ade80", whiteSpace: "pre-wrap" }}>
                {CODE_SNIPPETS[activeTab].output}
              </pre>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
