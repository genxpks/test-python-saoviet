"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Question } from "@/types";
import {
  GripVertical,
  ArrowUp,
  ArrowDown,
  Play,
  RotateCcw,
  CheckCircle2,
  X,
  Terminal,
  ArrowRight,
  Sparkles,
  Layers,
  Boxes,
  Eye,
  AlertTriangle,
  Code2
} from "lucide-react";
import {
  analyzeSequenceOrderFailure,
  getSimulatedExecutionOutput
} from "@/lib/quizFeedbackEngine";

interface InteractiveSequenceOrderingProps {
  question: Question;
  userAnswer?: any;
  onAnswerChange?: (answer: any) => void;
  isExamMode?: boolean;
}

export default function InteractiveSequenceOrdering({
  question,
  userAnswer,
  onAnswerChange,
  isExamMode = false
}: InteractiveSequenceOrderingProps) {
  const items = useMemo(() => question.items || [], [question.items]);
  const totalItems = items.length;
  const targetOrder = useMemo(
    () => question.correct_order || Array.from({ length: totalItems }, (_, i) => i),
    [question.correct_order, totalItems]
  );

  // Khởi tạo thứ tự lộn xộn cố định cho mỗi câu hỏi (deterministic scramble)
  const initialScrambled = useMemo(() => {
    const list = Array.from({ length: totalItems }, (_, i) => i);
    // Scramble bằng hoán vị luân phiên để chắc chắn khác targetOrder
    if (totalItems <= 1) return list;
    if (totalItems === 4) return [2, 0, 3, 1];
    if (totalItems === 5) return [3, 1, 4, 0, 2];
    if (totalItems === 6) return [4, 1, 5, 0, 3, 2];
    // Tổng quát: đảo ngược hoặc dịch chuyển
    return [...list.slice(1), list[0]];
  }, [totalItems]);

  // Danh sách các dòng lệnh bên phải (đã đưa vào khung lắp ráp)
  const [rightItems, setRightItems] = useState<number[]>(() => {
    if (Array.isArray(userAnswer) && userAnswer.length > 0) {
      return userAnswer.filter(idx => typeof idx === "number" && idx >= 0 && idx < totalItems);
    }
    return [];
  });

  // Danh sách các dòng lệnh bên trái (còn lại chưa đưa vào bên phải)
  const [leftItems, setLeftItems] = useState<number[]>(() => {
    const inRight = new Set(
      Array.isArray(userAnswer) ? userAnswer : []
    );
    return initialScrambled.filter(idx => !inRight.has(idx));
  });

  // Trạng thái kiểm tra & chạy thử
  const [evaluated, setEvaluated] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [evalErrorMsg, setEvalErrorMsg] = useState<string>("");
  const [showRevealedSolution, setShowRevealedSolution] = useState<boolean>(false);
  const [draggedItem, setDraggedItem] = useState<{ source: "left" | "right"; index: number } | null>(null);
  const [dragOverRightIdx, setDragOverRightIdx] = useState<number | null>(null);

  // Đồng bộ khi chuyển câu hỏi hoặc khi userAnswer thay đổi từ ngoài
  useEffect(() => {
    if (Array.isArray(userAnswer) && userAnswer.length > 0) {
      const validRight = userAnswer.filter(idx => typeof idx === "number" && idx >= 0 && idx < totalItems);
      setRightItems(validRight);
      const rightSet = new Set(validRight);
      setLeftItems(initialScrambled.filter(idx => !rightSet.has(idx)));
      
      if (validRight.length === totalItems) {
        const correct = validRight.every((v, i) => v === targetOrder[i]);
        setIsCorrect(correct);
        setEvaluated(true);
      } else {
        setEvaluated(false);
      }
    } else {
      setRightItems([]);
      setLeftItems(initialScrambled);
      setEvaluated(false);
      setIsCorrect(false);
    }
    setShowRevealedSolution(false);
  }, [question.id, initialScrambled, targetOrder, totalItems]);

  // Thông báo đáp án ra ngoài
  const emitAnswer = (newRight: number[]) => {
    if (onAnswerChange) {
      onAnswerChange(newRight);
    }
  };

  // ---------------------------------------------------------------------------
  // THAO TÁC CHUYỂN DÒNG LỆNH: TRÁI -> PHẢI & PHẢI -> TRÁI
  // ---------------------------------------------------------------------------

  // Bấm vào dòng lệnh bên trái để thêm sang bên phải
  const handleAddToRight = (itemIdx: number) => {
    if (rightItems.includes(itemIdx)) return;
    const nextRight = [...rightItems, itemIdx];
    const nextLeft = leftItems.filter(i => i !== itemIdx);
    setRightItems(nextRight);
    setLeftItems(nextLeft);
    setEvaluated(false);
    emitAnswer(nextRight);
  };

  // Bấm nút xóa/hoàn trả dòng lệnh từ bên phải về bên trái
  const handleRemoveFromRight = (pos: number) => {
    const itemIdx = rightItems[pos];
    const nextRight = rightItems.filter((_, i) => i !== pos);
    const nextLeft = [...leftItems, itemIdx];
    setRightItems(nextRight);
    setLeftItems(nextLeft);
    setEvaluated(false);
    emitAnswer(nextRight);
  };

  // Di chuyển lên / xuống trong khung bên phải
  const handleMoveOrder = (pos: number, dir: number) => {
    const targetPos = pos + dir;
    if (targetPos < 0 || targetPos >= rightItems.length) return;
    const nextRight = [...rightItems];
    const temp = nextRight[pos];
    nextRight[pos] = nextRight[targetPos];
    nextRight[targetPos] = temp;
    setRightItems(nextRight);
    setEvaluated(false);
    emitAnswer(nextRight);
  };

  // Đặt lại toàn bộ về bên trái
  const handleResetAll = () => {
    setRightItems([]);
    setLeftItems(initialScrambled);
    setEvaluated(false);
    setIsCorrect(false);
    setEvalErrorMsg("");
    setShowRevealedSolution(false);
    emitAnswer([]);
  };

  // ---------------------------------------------------------------------------
  // XỬ LÝ KÉO THẢ (DRAG & DROP)
  // ---------------------------------------------------------------------------

  const handleDragStartLeft = (e: React.DragEvent, itemIdx: number) => {
    setDraggedItem({ source: "left", index: itemIdx });
    e.dataTransfer.setData("text/plain", JSON.stringify({ source: "left", itemIdx }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragStartRight = (e: React.DragEvent, pos: number) => {
    setDraggedItem({ source: "right", index: pos });
    e.dataTransfer.setData("text/plain", JSON.stringify({ source: "right", pos }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverRightContainer = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnRightContainer = (e: React.DragEvent, targetSlotIdx?: number) => {
    e.preventDefault();
    setDragOverRightIdx(null);

    if (!draggedItem) return;

    if (draggedItem.source === "left") {
      const itemIdx = draggedItem.index;
      if (rightItems.includes(itemIdx)) return;

      let nextRight = [...rightItems];
      if (typeof targetSlotIdx === "number" && targetSlotIdx >= 0 && targetSlotIdx <= rightItems.length) {
        nextRight.splice(targetSlotIdx, 0, itemIdx);
      } else {
        nextRight.push(itemIdx);
      }

      const nextLeft = leftItems.filter(i => i !== itemIdx);
      setRightItems(nextRight);
      setLeftItems(nextLeft);
      setEvaluated(false);
      emitAnswer(nextRight);
    } else if (draggedItem.source === "right") {
      const fromPos = draggedItem.index;
      const toPos = typeof targetSlotIdx === "number" ? targetSlotIdx : rightItems.length - 1;
      if (fromPos === toPos) return;

      const nextRight = [...rightItems];
      const [moved] = nextRight.splice(fromPos, 1);
      nextRight.splice(toPos, 0, moved);
      setRightItems(nextRight);
      setEvaluated(false);
      emitAnswer(nextRight);
    }

    setDraggedItem(null);
  };

  // ---------------------------------------------------------------------------
  // CHẠY THỬ & KIỂM TRA ĐÚNG / SAI
  // ---------------------------------------------------------------------------

  const handleRunAndCheck = () => {
    if (rightItems.length < totalItems) {
      setEvalErrorMsg(`⚠️ Em cần kéo đủ tất cả ${totalItems} dòng lệnh sang khung bên phải trước khi chạy thử! (Hiện có ${rightItems.length}/${totalItems} dòng)`);
      setEvaluated(false);
      return;
    }

    setEvalErrorMsg("");
    const matches = rightItems.every((v, i) => v === targetOrder[i]);
    setIsCorrect(matches);
    setEvaluated(true);
    emitAnswer(rightItems);
  };

  return (
    <div style={{ margin: "1.2rem 0" }}>
      {/* Hướng Dẫn Tương Tác */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.85rem",
        padding: "0.55rem 0.9rem",
        background: "rgba(37, 99, 235, 0.06)",
        border: "1px solid rgba(37, 99, 235, 0.18)",
        borderRadius: "10px",
        flexWrap: "wrap",
        gap: "0.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Sparkles size={16} color="#2563eb" />
          <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Kéo thả hoặc bấm vào dòng lệnh bên trái để sắp xếp sang khung lắp ráp bên phải, sau đó bấm <strong>Chạy Thử</strong>:
          </span>
        </div>
        <button
          onClick={handleResetAll}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            background: "var(--surface-card)",
            border: "1.5px solid var(--border-medium)",
            color: "var(--text-secondary)",
            padding: "0.3rem 0.75rem",
            borderRadius: "6px",
            fontSize: "0.78rem",
            fontWeight: 700,
            cursor: "pointer"
          }}
          title="Đưa tất cả dòng lệnh về kho ban đầu"
        >
          <RotateCcw size={13} />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* BỐ CỤC CHIA 2 PHẦN: TRÁI (KHO LỘN XỘN) & PHẢI (KHUNG LẮP RÁP CODE) */}
      {/* ===================================================================== */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "1.2rem",
        alignItems: "start"
      }}>
        {/* ---------------- BÊN TRÁI: KHO DÒNG LỆNH CHƯA XẾP ---------------- */}
        <div style={{
          background: "var(--surface-subtle)",
          border: "1.5px solid var(--border-medium)",
          borderRadius: "14px",
          padding: "1rem",
          boxShadow: "var(--shadow-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          minHeight: "260px"
        }}>
          {/* Header Bên Trái */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "0.6rem",
            borderBottom: "1.5px solid var(--border-light)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <Boxes size={18} color="#2563eb" />
              <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--text-primary)" }}>
                📦 Dữ Kiện & Dòng Lệnh
              </span>
            </div>
            <span style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              padding: "0.2rem 0.55rem",
              borderRadius: "20px",
              background: leftItems.length > 0 ? "rgba(37, 99, 235, 0.12)" : "rgba(16, 185, 129, 0.12)",
              color: leftItems.length > 0 ? "#2563eb" : "#059669"
            }}>
              {leftItems.length > 0 ? `Còn ${leftItems.length} dòng` : "✓ Đã xếp hết"}
            </span>
          </div>

          {/* Danh sách các khối dòng lệnh lộn xộn */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {leftItems.length === 0 ? (
              <div style={{
                padding: "2rem 1rem",
                textAlign: "center",
                border: "2px dashed var(--border-medium)",
                borderRadius: "10px",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <CheckCircle2 size={24} color="#059669" />
                <span>Toàn bộ các dòng lệnh đã được chuyển sang khung lắp ráp bên phải.</span>
              </div>
            ) : (
              leftItems.map((itemIdx) => (
                <div
                  key={itemIdx}
                  draggable={true}
                  onDragStart={(e) => handleDragStartLeft(e, itemIdx)}
                  onClick={() => handleAddToRight(itemIdx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    padding: "0.75rem 0.9rem",
                    background: "var(--surface-card)",
                    border: "1.5px solid var(--border-medium)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.04)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2563eb";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-medium)";
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.04)";
                  }}
                  title="Bấm hoặc kéo thả sang khung bên phải"
                >
                  <GripVertical size={16} color="var(--text-muted)" style={{ cursor: "grab", flexShrink: 0 }} />
                  <span style={{
                    flex: 1,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.88rem",
                    color: "var(--text-primary)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all"
                  }}>
                    {items[itemIdx]}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToRight(itemIdx);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      background: "rgba(37, 99, 235, 0.08)",
                      border: "1px solid rgba(37, 99, 235, 0.25)",
                      color: "#2563eb",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      flexShrink: 0
                    }}
                  >
                    <span>Thêm</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ---------------- BÊN PHẢI: KHUNG LẮP RÁP THỨ TỰ THỰC THI ---------------- */}
        <div
          onDragOver={handleDragOverRightContainer}
          onDrop={(e) => handleDropOnRightContainer(e)}
          style={{
            background: "var(--surface-card)",
            border: evaluated
              ? isCorrect
                ? "2px solid #059669"
                : "2px solid #dc2626"
              : "1.5px solid var(--border-medium)",
            borderRadius: "14px",
            padding: "1rem",
            boxShadow: "var(--shadow-card)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            minHeight: "260px",
            transition: "all 0.25s ease"
          }}
        >
          {/* Header Bên Phải */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "0.6rem",
            borderBottom: "1.5px solid var(--border-light)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <Layers size={18} color={evaluated ? (isCorrect ? "#059669" : "#dc2626") : "#059669"} />
              <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--text-primary)" }}>
                🛠️ Khung Lắp Ráp Đoạn Mã
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                padding: "0.2rem 0.55rem",
                borderRadius: "20px",
                background: rightItems.length === totalItems ? "rgba(16, 185, 129, 0.12)" : "rgba(217, 119, 6, 0.12)",
                color: rightItems.length === totalItems ? "#059669" : "#d97706"
              }}>
                {rightItems.length}/{totalItems} dòng
              </span>
            </div>
          </div>

          {/* Vùng Lắp Ráp & Các Vị Trí Slot */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {rightItems.length === 0 ? (
              <div
                style={{
                  padding: "2.8rem 1rem",
                  textAlign: "center",
                  border: "2px dashed var(--border-medium)",
                  borderRadius: "12px",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  background: "var(--surface-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.6rem"
                }}
              >
                <Code2 size={28} color="#2563eb" />
                <span style={{ fontWeight: 700 }}>Khung mã nguồn đang trống</span>
                <span style={{ fontSize: "0.8rem" }}>
                  Kéo thả các khối lệnh từ cột bên trái vào đây hoặc bấm nút "Thêm".
                </span>
              </div>
            ) : (
              rightItems.map((itemIdx, pos) => {
                const isLineCorrect = evaluated && itemIdx === targetOrder[pos];
                const isLineWrong = evaluated && itemIdx !== targetOrder[pos];

                return (
                  <div
                    key={pos}
                    draggable={true}
                    onDragStart={(e) => handleDragStartRight(e, pos)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverRightIdx(pos);
                    }}
                    onDragLeave={() => setDragOverRightIdx(null)}
                    onDrop={(e) => {
                      e.stopPropagation();
                      handleDropOnRightContainer(e, pos);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.65rem",
                      padding: "0.65rem 0.85rem",
                      background: isLineCorrect
                        ? "rgba(16, 185, 129, 0.08)"
                        : isLineWrong
                        ? "rgba(239, 68, 68, 0.08)"
                        : dragOverRightIdx === pos
                        ? "rgba(37, 99, 235, 0.1)"
                        : "var(--surface-subtle)",
                      border: isLineCorrect
                        ? "1.5px solid #10b981"
                        : isLineWrong
                        ? "1.5px solid #ef4444"
                        : dragOverRightIdx === pos
                        ? "2px dashed #2563eb"
                        : "1.5px solid var(--border-medium)",
                      borderRadius: "10px",
                      transition: "all 0.15s ease",
                      cursor: "grab"
                    }}
                  >
                    {/* Số thứ tự dòng */}
                    <span style={{
                      fontWeight: 900,
                      fontSize: "0.82rem",
                      width: "28px",
                      height: "28px",
                      borderRadius: "7px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isLineCorrect
                        ? "#059669"
                        : isLineWrong
                        ? "#dc2626"
                        : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      color: "#ffffff",
                      flexShrink: 0
                    }}>
                      #{pos + 1}
                    </span>

                    {/* Nội dung code */}
                    <span style={{
                      flex: 1,
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.88rem",
                      color: "var(--text-primary)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all"
                    }}>
                      {items[itemIdx]}
                    </span>

                    {/* Nút điều hướng thứ tự Lên / Xuống & Nút Xóa */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>
                      <button
                        disabled={pos === 0}
                        onClick={() => handleMoveOrder(pos, -1)}
                        style={{
                          padding: "0.3rem 0.45rem",
                          borderRadius: "6px",
                          border: "1px solid var(--border-medium)",
                          background: "var(--surface-card)",
                          color: pos === 0 ? "var(--text-muted)" : "var(--text-primary)",
                          cursor: pos === 0 ? "not-allowed" : "pointer"
                        }}
                        title="Di chuyển lên trên"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        disabled={pos === rightItems.length - 1}
                        onClick={() => handleMoveOrder(pos, 1)}
                        style={{
                          padding: "0.3rem 0.45rem",
                          borderRadius: "6px",
                          border: "1px solid var(--border-medium)",
                          background: "var(--surface-card)",
                          color: pos === rightItems.length - 1 ? "var(--text-muted)" : "var(--text-primary)",
                          cursor: pos === rightItems.length - 1 ? "not-allowed" : "pointer"
                        }}
                        title="Di chuyển xuống dưới"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        onClick={() => handleRemoveFromRight(pos)}
                        style={{
                          padding: "0.3rem 0.45rem",
                          borderRadius: "6px",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          background: "rgba(239, 68, 68, 0.08)",
                          color: "#dc2626",
                          cursor: "pointer"
                        }}
                        title="Bỏ dòng này khỏi đoạn code (trả về bên trái)"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Các ô chờ (Placeholders) cho các vị trí còn thiếu */}
            {rightItems.length > 0 && rightItems.length < totalItems && (
              Array.from({ length: totalItems - rightItems.length }).map((_, placeholderIdx) => {
                const slotNum = rightItems.length + placeholderIdx + 1;
                return (
                  <div
                    key={`slot-${slotNum}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.6rem 0.85rem",
                      background: "transparent",
                      border: "1.5px dashed var(--border-light)",
                      borderRadius: "10px",
                      color: "var(--text-muted)",
                      fontSize: "0.82rem"
                    }}
                  >
                    <span style={{
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      width: "26px",
                      height: "26px",
                      borderRadius: "6px",
                      border: "1px dashed var(--border-medium)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      #{slotNum}
                    </span>
                    <span>[Chờ kéo thả hoặc bấm thêm dòng lệnh tiếp theo...]</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* KHỐI HÀNH ĐỘNG: NÚT BẤM "CHẠY THỬ & KIỂM TRA LOGIC" */}
      {/* ===================================================================== */}
      <div style={{ marginTop: "1.2rem", display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={handleRunAndCheck}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.7rem 1.6rem",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #059669, #047857)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "0.95rem",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(5, 150, 105, 0.4)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(5, 150, 105, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(5, 150, 105, 0.4)";
          }}
        >
          <Play size={17} fill="#ffffff" />
          <span>▶️ Chạy Thử & Kiểm Tra Logic (Run Code)</span>
        </button>

        {evalErrorMsg && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "#d97706",
            fontSize: "0.85rem",
            fontWeight: 700
          }}>
            <AlertTriangle size={16} />
            <span>{evalErrorMsg}</span>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* KẾT QUẢ SAU KHI BẤM CHẠY: BÁO ĐÚNG / SAI & PHÂN TÍCH SƯ PHẠM */}
      {/* ===================================================================== */}
      {evaluated && (
        <div style={{ marginTop: "1.2rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {/* BANNER THÀNH CÔNG HOẶC THẤT BẠI */}
          <div style={{
            padding: "0.9rem 1.2rem",
            borderRadius: "12px",
            background: isCorrect ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.08)",
            border: isCorrect ? "1.5px solid #059669" : "1.5px solid #dc2626",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.8rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              {isCorrect ? (
                <>
                  <CheckCircle2 size={22} color="#059669" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#065f46" }}>
                      HOÀN TOÀN CHÍNH XÁC! THỨ TỰ LOGIC CHUẨN XÁC 100%
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#047857", marginTop: "2px" }}>
                      Chương trình biên dịch và thực thi tuần tự không gặp bất kỳ lỗi cú pháp hay runtime nào.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <X size={22} color="#dc2626" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#991b1b" }}>
                      THỨ TỰ CHƯA CHÍNH XÁC! ĐOẠN MÃ XẢY RA LỖI LOGIC
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#b91c1c", marginTop: "2px" }}>
                      Khi thực thi theo thứ tự này, chương trình sẽ phát sinh lỗi logic hoặc thiếu dữ liệu.
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              {!isCorrect && (
                <button
                  onClick={() => setShowRevealedSolution(prev => !prev)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.45rem 0.9rem",
                    borderRadius: "8px",
                    border: "1.5px solid var(--border-medium)",
                    background: "var(--surface-card)",
                    color: "var(--text-primary)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  <Eye size={14} />
                  <span>{showRevealedSolution ? "Ẩn đáp án chuẩn" : "Xem thứ tự chuẩn"}</span>
                </button>
              )}

              <button
                onClick={() => setEvaluated(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "8px",
                  border: isCorrect ? "1.5px solid #059669" : "1.5px solid #dc2626",
                  background: isCorrect ? "#059669" : "#dc2626",
                  color: "#ffffff",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                <RotateCcw size={14} />
                <span>Thử chỉnh lại</span>
              </button>
            </div>
          </div>

          {/* KHUNG GIẢI THÍCH SƯ PHẠM VÌ SAO SAI */}
          {!isCorrect && (
            <div style={{
              padding: "1rem 1.2rem",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.05)",
              border: "1.5px solid rgba(239, 68, 68, 0.25)",
              color: "#991b1b",
              fontSize: "0.88rem",
              lineHeight: "1.6"
            }}>
              <div style={{ fontWeight: 800, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.45rem", color: "#dc2626" }}>
                <AlertTriangle size={16} />
                <span>Phân tích vì sao thứ tự hiện tại chưa đúng:</span>
              </div>
              <div>
                {analyzeSequenceOrderFailure(question, rightItems)}
              </div>
            </div>
          )}

          {/* KHUNG TERMINAL MÔ PHỎNG CHẠY THỬ (KHI ĐÚNG) */}
          {isCorrect && (
            <div style={{
              borderRadius: "10px",
              overflow: "hidden",
              border: "1.5px solid #1e293b",
              background: "#090d16",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.9rem",
                background: "#0f172a",
                borderBottom: "1px solid #1e293b",
                color: "#94a3b8",
                fontSize: "0.78rem",
                fontWeight: 700
              }}>
                <Terminal size={14} color="#38bdf8" />
                <span>🖥️ Cửa Sổ Terminal Thực Thi (Python 3.12 Output)</span>
              </div>
              <div style={{
                padding: "1rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.88rem",
                color: "#34d399",
                whiteSpace: "pre-wrap",
                lineHeight: "1.6"
              }}>
                <div style={{ color: "#94a3b8", marginBottom: "0.4rem" }}>$ python main.py</div>
                {getSimulatedExecutionOutput(question)}
              </div>
            </div>
          )}

          {/* HIỂN THỊ ĐÁP ÁN CHUẨN KHI HỌC VIÊN CHỦ ĐỘNG YÊU CẦU HOẶC KHI ĐÚNG */}
          {(isCorrect || showRevealedSolution) && question.explanation && (
            <div style={{
              padding: "0.9rem 1.1rem",
              borderRadius: "10px",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1.5px solid rgba(16, 185, 129, 0.3)",
              fontSize: "0.86rem",
              lineHeight: "1.6",
              color: "var(--text-primary)"
            }}>
              <div style={{ fontWeight: 800, color: "#059669", marginBottom: "0.3rem" }}>
                💡 Quy trình chuẩn & Phân tích giải thuật:
              </div>
              <div>{question.explanation}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
