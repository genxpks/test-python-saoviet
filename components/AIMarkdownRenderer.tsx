"use client";

import React, { useState } from "react";
import { Copy, Check, Sparkles, FileCode, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { cleanAiText, extractCodeFromAiReply } from "@/lib/aiMarkdownHelper";

interface AIMarkdownRendererProps {
  content: string;
  onApplyCode?: (code: string) => void;
  applyButtonLabel?: string;
}

export default function AIMarkdownRenderer({
  content,
  onApplyCode,
  applyButtonLabel = "Áp Dụng Vào Trình Soạn Thảo"
}: AIMarkdownRendererProps) {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [applied, setApplied] = useState(false);

  if (!content) return null;

  const parsed = extractCodeFromAiReply(content);
  const rawCleaned = parsed.cleanExplanation;

  // Tách nội dung thành các đoạn và khối mã nguồn
  // Cắt theo các khối ``` ... ```
  const parts: Array<{ type: "text" | "code"; lang?: string; content: string }> = [];
  const regex = /```([a-zA-Z0-9_-]*)\s*([\s\S]*?)```/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(rawCleaned)) !== null) {
    if (match.index > lastIdx) {
      parts.push({
        type: "text",
        content: rawCleaned.substring(lastIdx, match.index)
      });
    }
    parts.push({
      type: "code",
      lang: match[1] || "python",
      content: match[2].trim()
    });
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < rawCleaned.length) {
    parts.push({
      type: "text",
      content: rawCleaned.substring(lastIdx)
    });
  }

  const handleCopy = (codeText: string, idx: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const handleApply = (codeText: string) => {
    if (onApplyCode) {
      onApplyCode(codeText);
      setApplied(true);
      setTimeout(() => setApplied(false), 3000);
    }
  };

  // Hàm render từng dòng text kèm in đậm, inline code, bullet list
  const renderFormattedText = (textChunk: string) => {
    const lines = textChunk.split("\n");
    return lines.map((line, lIdx) => {
      let trimmed = line.trim();
      if (!trimmed) return <div key={lIdx} style={{ height: "0.45rem" }} />;

      // Tiêu đề dạng ### hoặc ## hoặc #
      const headerMatch = trimmed.match(/^(#{1,4})\s*(.*)$/);
      if (headerMatch) {
        const titleText = headerMatch[2].replace(/\*{2,}/g, ""); // sạch dấu sao
        return (
          <div
            key={lIdx}
            style={{
              fontWeight: 800,
              fontSize: "0.92rem",
              color: "#c084fc",
              marginTop: "0.65rem",
              marginBottom: "0.35rem",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Sparkles size={14} color="#e879f9" />
            <span>{titleText}</span>
          </div>
        );
      }

      // Phát hiện dòng cảnh báo sửa lỗi (vd: Dòng 3: ..., Bước 2: ...)
      const isLineNotice = /(?:dòng|line|bước)\s*\d+[:\s-]/i.test(trimmed);

      // Bullet list
      const isBullet = /^[*-•]\s+/.test(trimmed);
      let coreText = isBullet ? trimmed.replace(/^[*-•]\s+/, "") : trimmed;

      // Xử lý in đậm **...** và inline code `...`
      const parsedInline: React.ReactNode[] = [];
      const inlineRegex = /(\*\*.*?\*\*|`.*?`)/g;
      let inlineLast = 0;
      let im;

      while ((im = inlineRegex.exec(coreText)) !== null) {
        if (im.index > inlineLast) {
          parsedInline.push(coreText.substring(inlineLast, im.index));
        }
        const token = im[1];
        if (token.startsWith("**") && token.endsWith("**")) {
          parsedInline.push(
            <strong key={im.index} style={{ color: "#fdf4ff", fontWeight: 800 }}>
              {token.slice(2, -2).replace(/\*{2,}/g, "")}
            </strong>
          );
        } else if (token.startsWith("`") && token.endsWith("`")) {
          parsedInline.push(
            <code
              key={im.index}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                padding: "2px 6px",
                borderRadius: "4px",
                color: "#38bdf8",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.82em"
              }}
            >
              {token.slice(1, -1)}
            </code>
          );
        }
        inlineLast = inlineRegex.lastIndex;
      }
      if (inlineLast < coreText.length) {
        parsedInline.push(coreText.substring(inlineLast));
      }

      if (isLineNotice) {
        return (
          <div
            key={lIdx}
            style={{
              margin: "0.35rem 0",
              padding: "0.35rem 0.65rem",
              borderRadius: "6px",
              background: "rgba(234, 179, 8, 0.12)",
              borderLeft: "3px solid #eab308",
              color: "#fef08a",
              fontSize: "0.84rem",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <AlertTriangle size={14} color="#facc15" style={{ flexShrink: 0 }} />
            <div>{parsedInline}</div>
          </div>
        );
      }

      return (
        <div
          key={lIdx}
          style={{
            margin: "0.2rem 0",
            paddingLeft: isBullet ? "1rem" : "0",
            position: "relative",
            lineHeight: 1.55,
            color: "#f1f5f9",
            fontSize: "0.85rem"
          }}
        >
          {isBullet && (
            <span
              style={{
                position: "absolute",
                left: "0.2rem",
                top: "0.45rem",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#c084fc",
                display: "inline-block"
              }}
            />
          )}
          {parsedInline}
        </div>
      );
    });
  };

  return (
    <div className="ai-markdown-container" style={{ width: "100%" }}>
      {parts.map((p, idx) => {
        if (p.type === "text") {
          return <div key={idx}>{renderFormattedText(p.content)}</div>;
        }

        // Khối mã nguồn Code Block
        return (
          <div
            key={idx}
            style={{
              margin: "0.75rem 0",
              borderRadius: "8px",
              background: "#090d16",
              border: "1px solid rgba(168, 85, 247, 0.35)",
              overflow: "hidden",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)"
            }}
          >
            {/* Thanh tiêu đề Code Block */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.4rem 0.8rem",
                background: "#121829",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                fontSize: "0.74rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontWeight: 700 }}>
                <FileCode size={13} />
                <span>MÃ PYTHON GỢI Ý ĐÃ SỬA CHUẨN:</span>
              </div>

              <div style={{ display: "flex", gap: "0.45rem" }}>
                <button
                  type="button"
                  onClick={() => handleCopy(p.content, idx)}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#e2e8f0",
                    fontSize: "0.72rem",
                    padding: "0.2rem 0.55rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                  title="Sao chép toàn bộ đoạn code này"
                >
                  {copiedCodeIdx === idx ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  <span>{copiedCodeIdx === idx ? "Đã chép" : "Sao chép"}</span>
                </button>

                {onApplyCode && (
                  <button
                    type="button"
                    onClick={() => handleApply(p.content)}
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      border: "none",
                      color: "#ffffff",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.65rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.35)"
                    }}
                    title="Thay thế đoạn code hiện tại bằng code gợi ý của AI"
                  >
                    {applied ? <CheckCircle2 size={13} /> : <Sparkles size={13} />}
                    <span>{applied ? "✅ Đã Áp Dụng Code!" : `✨ ${applyButtonLabel}`}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Thân Code */}
            <pre
              style={{
                margin: 0,
                padding: "0.85rem 1rem",
                color: "#e2e8f0",
                fontFamily: "var(--font-mono, Consolas, monospace)",
                fontSize: "0.82rem",
                lineHeight: "1.5",
                overflowX: "auto",
                whiteSpace: "pre"
              }}
            >
              {p.content}
            </pre>
          </div>
        );
      })}
    </div>
  );
}
