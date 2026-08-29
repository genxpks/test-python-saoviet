"use client";

import { Play, Copy, Check, Terminal } from "lucide-react";

interface TerminalActionControlsProps {
  isRunning: boolean;
  copied: boolean;
  onCopy: () => void;
  onRun: () => void;
}

export default function TerminalActionControls({
  isRunning,
  copied,
  onCopy,
  onRun
}: TerminalActionControlsProps) {
  return (
    <div style={{
      background: "#0c1424",
      padding: "0.65rem 1.1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: "1px solid rgba(255, 255, 255, 0.08)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
        <button
          onClick={onCopy}
          style={{
            background: "transparent",
            border: "none",
            color: copied ? "#10b981" : "#94a3b8",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "0.75rem",
            fontWeight: 600,
            transition: "color 0.2s ease"
          }}
        >
          {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
          <span>{copied ? "Đã sao chép" : "Sao chép"}</span>
        </button>

        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>• UTF-8 Ready</span>
      </div>

      <button
        onClick={onRun}
        disabled={isRunning}
        style={{
          background: isRunning ? "#059669" : "linear-gradient(135deg, #059669 0%, #10b981 100%)",
          color: "#ffffff",
          border: "none",
          borderRadius: "6px",
          padding: "0.38rem 0.95rem",
          fontSize: "0.8rem",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          cursor: isRunning ? "wait" : "pointer",
          boxShadow: "0 2px 10px rgba(16, 185, 129, 0.3)",
          transition: "all 0.2s ease"
        }}
      >
        <Play size={13} />
        <span>{isRunning ? "Đang chạy..." : "Chạy Sandbox"}</span>
      </button>
    </div>
  );
}
