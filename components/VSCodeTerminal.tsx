"use client";

import { useState } from "react";
import { Terminal, Trash2, Copy, Check, Play, RotateCcw, AlertTriangle, CheckCircle2, Maximize2, Minimize2, Eye } from "lucide-react";

interface VSCodeTerminalProps {
  output: string;
  isRunning?: boolean;
  isError?: boolean;
  executionTimeMs?: number;
  turtleSvg?: string;
  onClear?: () => void;
  onRun?: () => void;
}

export default function VSCodeTerminal({
  output,
  isRunning = false,
  isError = false,
  executionTimeMs = 0,
  turtleSvg,
  onClear,
  onRun
}: VSCodeTerminalProps) {
  const [activeTab, setActiveTab] = useState<"terminal" | "canvas">("terminal");
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasExecuted = Boolean(
    output && 
    output !== "Sẵn sàng thực thi. Nhấn '▶️ Chạy Thử Code' để xem kết quả..." &&
    output !== "Đã xóa console."
  );

  return (
    <div
      style={{
        background: "#080d1a",
        border: "1px solid rgba(56, 189, 248, 0.25)",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.6)",
        fontFamily: "var(--font-mono)",
        transition: "all 0.2s ease"
      }}
    >
      <style>{`
        @keyframes vsTerminalCursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
      {/* 1. TOP TITLEBAR & TABS (VS Code Window Style) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.45rem 0.85rem",
          background: "rgba(13, 22, 45, 0.95)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}
      >
        {/* Left: Window Dots & Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          {/* Traffic Lights */}
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f56", display: "inline-block" }} />
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e", display: "inline-block" }} />
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27c93f", display: "inline-block" }} />
          </div>

          {/* Terminal Tabs */}
          <div style={{ display: "flex", gap: "0.2rem" }}>
            <button
              onClick={() => setActiveTab("terminal")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "0.25rem 0.65rem",
                borderRadius: "4px",
                border: "none",
                background: activeTab === "terminal" ? "rgba(56, 189, 248, 0.18)" : "transparent",
                color: activeTab === "terminal" ? "#38bdf8" : "#94a3b8",
                fontSize: "0.76rem",
                fontWeight: 700,
                cursor: "pointer",
                borderBottom: activeTab === "terminal" ? "2px solid #38bdf8" : "2px solid transparent"
              }}
            >
              <Terminal size={12} />
              <span>TERMINAL</span>
            </button>

            {turtleSvg && (
              <button
                onClick={() => setActiveTab("canvas")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "4px",
                  border: "none",
                  background: activeTab === "canvas" ? "rgba(0, 245, 200, 0.18)" : "transparent",
                  color: activeTab === "canvas" ? "#00f5c8" : "#94a3b8",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  borderBottom: activeTab === "canvas" ? "2px solid #00f5c8" : "2px solid transparent"
                }}
              >
                <Eye size={12} />
                <span>🎨 TURTLE CANVAS</span>
              </button>
            )}

            <div style={{ display: "flex", alignItems: "center", padding: "0.25rem 0.45rem", color: "#475569", fontSize: "0.72rem" }}>
              <span>PROBLEMS (0)</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {onRun && (
            <button
              onClick={onRun}
              disabled={isRunning}
              title="Chạy lại code (Ctrl+Enter)"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                fontSize: "0.72rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <Play size={11} fill="#34d399" />
              <span>Chạy lại</span>
            </button>
          )}

          {hasExecuted && (
            <button
              onClick={handleCopy}
              title="Sao chép toàn bộ kết quả terminal"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                padding: "0.2rem 0.45rem",
                borderRadius: "4px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#94a3b8",
                fontSize: "0.72rem",
                cursor: "pointer"
              }}
            >
              {copied ? <Check size={11} color="#34d399" /> : <Copy size={11} />}
              <span>{copied ? "Đã chép" : "Chép"}</span>
            </button>
          )}

          {onClear && (
            <button
              onClick={onClear}
              title="Xóa sạch màn hình Terminal"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                padding: "0.2rem 0.45rem",
                borderRadius: "4px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#94a3b8",
                fontSize: "0.72rem",
                cursor: "pointer"
              }}
            >
              <Trash2 size={11} />
              <span>Xóa</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Thu nhỏ" : "Phóng to cửa sổ Terminal"}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.2rem 0.35rem",
              borderRadius: "4px",
              border: "none",
              background: "transparent",
              color: "#64748b",
              cursor: "pointer"
            }}
          >
            {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT 1: VS CODE TERMINAL SCREEN */}
      {activeTab === "terminal" && (
        <div
          style={{
            padding: "0.85rem 1.1rem",
            background: "#050a16",
            minHeight: isExpanded ? "380px" : "160px",
            maxHeight: isExpanded ? "600px" : "260px",
            overflowY: "auto",
            fontSize: "0.86rem",
            lineHeight: "1.6",
            color: "#f8fafc"
          }}
        >
          {/* Shell Prompt Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ color: "#34d399", fontWeight: 800 }}>saoviet@edu</span>
            <span style={{ color: "#64748b" }}>:</span>
            <span style={{ color: "#38bdf8", fontWeight: 700 }}>~/python-lab</span>
            <span style={{ color: "#f8fafc", fontWeight: 800 }}>$</span>
            <span style={{ color: "#00f5c8", fontWeight: 800 }}>python3 main.py</span>
          </div>

          {/* Running Indicator */}
          {isRunning && (
            <div style={{ color: "#f59e0b", fontStyle: "italic", margin: "0.4rem 0" }}>
              ⏳ [Running] Đang biên dịch và thực thi trên Python 3.12 Engine...
            </div>
          )}

          {/* Output Display */}
          {!isRunning && !hasExecuted && (
            <div style={{ color: "#64748b", fontStyle: "italic", margin: "0.4rem 0" }}>
              # Nhấn &apos;▶️ Chạy Thử Code (F5)&apos; hoặc ấn phím Ctrl + Enter để xem kết quả thực thi Console tại đây...
            </div>
          )}

          {!isRunning && hasExecuted && (
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                color: isError ? "#fca5a5" : "#f8fafc",
                fontFamily: "var(--font-mono)"
              }}
            >
              {output}
            </pre>
          )}

          {/* Process Exited Footer */}
          {!isRunning && hasExecuted && (
            <div
              style={{
                marginTop: "0.75rem",
                paddingTop: "0.5rem",
                borderTop: "1px dashed rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                fontSize: "0.78rem"
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  color: isError ? "#ef4444" : "#10b981",
                  fontWeight: 800
                }}
              >
                {isError ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
                <span>[Done] exited with code={isError ? 1 : 0} in {(executionTimeMs / 1000).toFixed(3)}s</span>
              </span>
            </div>
          )}

          {/* Blinking Shell Prompt at the bottom */}
          {!isRunning && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
              <span style={{ color: "#34d399", fontWeight: 700 }}>saoviet@edu</span>
              <span style={{ color: "#64748b" }}>:</span>
              <span style={{ color: "#38bdf8", fontWeight: 700 }}>~/python-lab</span>
              <span style={{ color: "#f8fafc", fontWeight: 700 }}>$</span>
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "15px",
                  background: "#38bdf8",
                  animation: "vsTerminalCursor 1s infinite"
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* 2. TAB CONTENT 2: LIVE TURTLE GRAPHICS CANVAS */}
      {activeTab === "canvas" && turtleSvg && (
        <div
          style={{
            padding: "1rem",
            background: "#040814",
            minHeight: "240px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{ width: "100%", maxWidth: "550px", border: "1px solid rgba(0, 245, 200, 0.3)", borderRadius: "8px", overflow: "hidden" }}
            dangerouslySetInnerHTML={{ __html: turtleSvg }}
          />
        </div>
      )}
    </div>
  );
}
