"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bot, Send, X, Sparkles, Terminal, Copy, Check, MessageSquare } from "lucide-react";

export default function AIChatAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    {
      role: "ai",
      text: "👋 Chào em! Thầy là **Trợ Lý AI Tin Học Sao Việt**. Thầy có thể giúp em chữa bài tập, tìm lỗi sai trong code Python, giải thích thuật toán đệ quy, đồ họa Turtle hoặc xử lý danh sách List/Dict. Em đang vướng chỗ nào hãy nhắn cho Thầy nhé!"
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Disable & Hide AI completely in Exam mode
  if (pathname === "/exam") {
    return null;
  }

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user" as const, text: textToSend }];
    setMessages(newMessages);
    if (!customText) setInputPrompt("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend, mode: "chat" })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...newMessages, { role: "ai", text: data.reply }]);
      } else {
        setMessages([...newMessages, { role: "ai", text: "❌ Có chút gián đoạn kết nối tới AI. Em thử hỏi lại nhé!" }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: "ai", text: "❌ Không thể kết nối tới máy chủ AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <>
      {/* Floating Glowing Button */}
      <button
        className="no-print"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 999,
          background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #8b5cf6 100%)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "var(--radius-full)",
          padding: "12px 22px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: 800,
          fontSize: "0.95rem",
          boxShadow: "0 10px 30px rgba(37, 99, 235, 0.45)",
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      >
        <div style={{
          width: "28px",
          height: "28px",
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Bot size={18} />
        </div>
        <span>{isOpen ? "Đóng Trợ Lý AI" : "Hỏi Thầy AI Sao Việt"}</span>
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div
          className="no-print"
          style={{
            position: "fixed",
            bottom: "85px",
            right: "24px",
            width: "410px",
            maxWidth: "calc(100vw - 48px)",
            height: "560px",
            maxHeight: "calc(100vh - 120px)",
            background: "rgba(15, 23, 42, 0.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 999,
            overflow: "hidden",
            animation: "slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #090d16 0%, #0f172a 100%)",
              color: "#ffffff",
              padding: "14px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #1e293b"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #2563eb, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff"
              }}>
                <Bot size={20} />
              </div>
              <div>
                <strong style={{ fontSize: "0.95rem", display: "block", color: "#ffffff" }}>
                  Trợ Lý AI Tin Học Sao Việt
                </strong>
                <small style={{ fontSize: "0.74rem", color: "#38bdf8", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Sparkles size={11} />
                  <span>Google Gemini 2.0 Flash Engine</span>
                </small>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Feed */}
          <div
            style={{
              flex: 1,
              padding: "14px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "#0a0f1d"
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "90%",
                  background: m.role === "user" 
                    ? "linear-gradient(135deg, #2563eb, #1d4ed8)" 
                    : "rgba(30, 41, 59, 0.95)",
                  color: m.role === "user" ? "#ffffff" : "#f8fafc",
                  padding: "11px 15px",
                  borderRadius: m.role === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                  border: m.role === "user" ? "none" : "1px solid #334155",
                  fontSize: "0.88rem",
                  lineHeight: "1.6",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.25)",
                  position: "relative"
                }}
              >
                <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                {m.role === "ai" && (
                  <button
                    onClick={() => handleCopy(m.text, idx)}
                    style={{
                      position: "absolute",
                      bottom: "4px",
                      right: "6px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      fontSize: "0.7rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "2px"
                    }}
                    title="Sao chép câu trả lời"
                  >
                    {copiedIdx === idx ? <Check size={11} color="#34d399" /> : <Copy size={11} />}
                  </button>
                )}
              </div>
            ))}

            {isLoading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "rgba(30, 41, 59, 0.9)",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  border: "1px solid #334155",
                  fontSize: "0.84rem",
                  color: "#cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Sparkles size={14} color="#38bdf8" />
                <span>Thầy AI đang đối chiếu bài học và soạn lời giảng...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div
            style={{
              padding: "8px 12px",
              background: "rgba(15, 23, 42, 0.95)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              whiteSpace: "nowrap"
            }}
          >
            <button
              onClick={() => handleSendMessage("Em muốn hiểu rõ cách hoạt động của hàm len() và chỉ số âm s[-1] trong Python.")}
              style={{
                fontSize: "0.76rem",
                padding: "4px 10px",
                borderRadius: "8px",
                background: "rgba(30, 41, 59, 0.85)",
                color: "#e2e8f0",
                border: "1px solid #334155",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              len() & chỉ số âm
            </button>
            <button
              onClick={() => handleSendMessage("Giải thích cách dùng Turtle: penup, pendown và vòng lặp for vẽ đa giác.")}
              style={{
                fontSize: "0.76rem",
                padding: "4px 10px",
                borderRadius: "8px",
                background: "rgba(30, 41, 59, 0.85)",
                color: "#e2e8f0",
                border: "1px solid #334155",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Đồ họa Turtle
            </button>
            <button
              onClick={() => handleSendMessage("Chỉ cho em mẹo phân biệt List, Tuple, Set và Dictionary trong Python.")}
              style={{
                fontSize: "0.76rem",
                padding: "4px 10px",
                borderRadius: "8px",
                background: "rgba(30, 41, 59, 0.85)",
                color: "#e2e8f0",
                border: "1px solid #334155",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              List vs Dict vs Tuple
            </button>
          </div>

          {/* Message Input Box */}
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(15, 23, 42, 0.98)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              gap: "8px",
              alignItems: "center"
            }}
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Nhập câu hỏi cần Thầy AI giải đáp..."
              style={{
                fontSize: "0.9rem",
                height: "40px",
                flex: 1,
                padding: "0 12px",
                borderRadius: "8px",
                background: "rgba(30, 41, 59, 0.8)",
                border: "1.5px solid #334155",
                color: "#ffffff",
                outline: "none"
              }}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputPrompt.trim()}
              style={{ height: "40px", padding: "0 14px" }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
