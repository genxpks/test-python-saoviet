"use client";

import { useState } from "react";

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    {
      role: "ai",
      text: "👋 Chào em! Thầy là **Trợ Lý AI Tin Học Sao Việt**. Thầy có thể giúp em chữa bài tập, tìm lỗi sai trong code Python hoặc giải thích kiến thức bài học. Em đang vướng chỗ nào hãy hỏi Thầy nhé!"
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        setMessages([...newMessages, { role: "ai", text: "❌ Có chút gián đoạn kết nối AI. Em thử hỏi lại nhé!" }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: "ai", text: "❌ Không thể kết nối tới máy chủ AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="no-print"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 999,
          background: "linear-gradient(135deg, #2563eb, #8b5cf6)",
          color: "#ffffff",
          border: "none",
          borderRadius: "50px",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: 700,
          fontSize: "0.95rem",
          boxShadow: "0 10px 25px rgba(37, 99, 235, 0.4)",
          cursor: "pointer",
          transition: "transform 0.2s ease"
        }}
      >
        <span style={{ fontSize: "1.3rem" }}>🤖</span>
        <span>{isOpen ? "Đóng Trợ Lý AI" : "Hỏi Trợ Lý AI Sao Việt"}</span>
      </button>

      {/* Chat Drawer / Popup */}
      {isOpen && (
        <div
          className="no-print"
          style={{
            position: "fixed",
            bottom: "85px",
            right: "24px",
            width: "390px",
            maxWidth: "calc(100vw - 48px)",
            height: "540px",
            maxHeight: "calc(100vh - 120px)",
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.25)",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            zIndex: 999,
            overflow: "hidden"
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              color: "#ffffff",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.3rem" }}>🤖</span>
              <div>
                <strong style={{ fontSize: "0.92rem", display: "block" }}>Trợ Lý AI Sao Việt</strong>
                <small style={{ fontSize: "0.72rem", color: "#38bdf8" }}>Tự động chữa bài & sửa lỗi code</small>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.3rem", cursor: "pointer" }}
            >
              &times;
            </button>
          </div>

          {/* Messages Stream */}
          <div
            style={{
              flex: 1,
              padding: "14px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              background: "#f8fafc"
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  background: m.role === "user" ? "#2563eb" : "#ffffff",
                  color: m.role === "user" ? "#ffffff" : "#0f172a",
                  padding: "10px 14px",
                  borderRadius: m.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                  border: m.role === "user" ? "none" : "1px solid #e2e8f0",
                  fontSize: "0.88rem",
                  lineHeight: "1.5",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  whiteSpace: "pre-wrap"
                }}
              >
                {m.text}
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "#ffffff",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.82rem",
                  color: "#64748b"
                }}
              >
                ⏳ Thầy AI đang phân tích và soạn câu trả lời...
              </div>
            )}
          </div>

          {/* Quick Questions Suggestions */}
          <div
            style={{
              padding: "6px 12px",
              background: "#f1f5f9",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              whiteSpace: "nowrap"
            }}
          >
            <button
              className="btn-chip"
              style={{ fontSize: "0.75rem", padding: "3px 8px" }}
              onClick={() => handleSendMessage("Em muốn hiểu rõ cách dùng hàm len() trong Python")}
            >
              len() là gì?
            </button>
            <button
              className="btn-chip"
              style={{ fontSize: "0.75rem", padding: "3px 8px" }}
              onClick={() => handleSendMessage("Giải thích cách hoạt động của Turtle penup và pendown")}
            >
              penup & pendown
            </button>
            <button
              className="btn-chip"
              style={{ fontSize: "0.75rem", padding: "3px 8px" }}
              onClick={() => handleSendMessage("Mẹo nhớ chỉ số âm s[-1] trong cắt chuỗi String")}
            >
              Chỉ số s[-1]
            </button>
          </div>

          {/* Input Box */}
          <div
            style={{
              padding: "10px",
              background: "#ffffff",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              gap: "8px"
            }}
          >
            <input
              type="text"
              className="form-input"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Nhập câu hỏi cho Thầy AI..."
              style={{ fontSize: "0.88rem", padding: "8px 12px" }}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleSendMessage()}
              disabled={isLoading}
              style={{ padding: "0 14px" }}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
