"use client";

import { PracticalProblem } from "@/types";
import { Terminal, Code2, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { useState } from "react";

interface PracticalQuestionCardProps {
  problem: PracticalProblem;
  index?: number;
}

export default function PracticalQuestionCard({ problem, index }: PracticalQuestionCardProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pNum = index !== undefined ? index + 1 : problem.id;

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="q-card">
      <div className="q-card-header">
        <span
          className="q-badge"
          style={{
            background: "rgba(16, 185, 129, 0.1)",
            color: "var(--brand-emerald-dark)",
            borderColor: "rgba(16, 185, 129, 0.25)"
          }}
        >
          <Terminal size={14} />
          <span>BÀI TOÁN THỰC HÀNH {pNum}</span>
        </span>
        <span style={{ fontSize: "0.8rem", color: "var(--brand-primary)", fontWeight: 700 }}>
          Thuật toán & Viết hàm
        </span>
      </div>

      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.4rem", color: "var(--text-primary)" }}>
        {problem.title}
      </h3>

      <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", fontSize: "0.92rem", lineHeight: "1.6" }}>
        {problem.description}
      </p>

      {/* Starter Code Preview */}
      <div style={{
        background: "#090d16",
        color: "#f8fafc",
        padding: "0.9rem 1.1rem",
        borderRadius: "var(--radius-md)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.88rem",
        marginBottom: "1rem",
        border: "1px solid #1e293b",
        position: "relative"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem", color: "#94a3b8", fontSize: "0.76rem" }}>
          <span># Khung hàm khởi tạo (Starter Code):</span>
          <button
            onClick={() => handleCopyCode(problem.starter_code)}
            style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem" }}
          >
            {copied ? <Check size={12} color="green" /> : <Copy size={12} />}
            <span>{copied ? "Đã chép" : "Sao chép"}</span>
          </button>
        </div>
        <pre style={{ margin: 0, overflowX: "auto", color: "#38bdf8" }}>{problem.starter_code}</pre>
      </div>

      {/* Solution Code Accordion */}
      <div style={{
        background: "#ecfdf5",
        border: "1px solid #a7f3d0",
        borderRadius: "var(--radius-md)",
        overflow: "hidden"
      }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.85rem 1.1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            color: "var(--brand-emerald-dark)",
            fontSize: "0.9rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Code2 size={16} />
            <span>Xem Code Mẫu Chuẩn & Thuật Toán Tối Ưu</span>
          </div>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isOpen && (
          <div style={{ padding: "0 1.1rem 1.1rem 1.1rem" }}>
            <pre style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              padding: "0.9rem",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.86rem",
              color: "#0f172a",
              overflowX: "auto",
              lineHeight: "1.55"
            }}>
              {problem.solution_code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
