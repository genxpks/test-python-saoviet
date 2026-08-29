"use client";

import { Play, Copy, Check } from "lucide-react";

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
      background: "#090f1d",
      padding: "0.75rem 1.25rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: "1px solid #1e293b"
    }}>
      <button
        onClick={onCopy}
        style={{
          background: "none",
          border: "none",
          color: "#94a3b8",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          fontSize: "0.78rem"
        }}
      >
        {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
        <span>{copied ? "Đã sao chép" : "Sao chép code"}</span>
      </button>

      <button
        onClick={onRun}
        disabled={isRunning}
        className="btn btn-success btn-sm"
        style={{ padding: "0.35rem 1rem", fontSize: "0.82rem", borderRadius: "6px" }}
      >
        <Play size={14} />
        <span>{isRunning ? "Đang chạy..." : "Chạy Sandbox"}</span>
      </button>
    </div>
  );
}
