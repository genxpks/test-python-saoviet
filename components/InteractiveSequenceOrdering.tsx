"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
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

  // Khởi tạo thứ tự xáo trộn ban đầu ổn định cho mỗi câu hỏi
  const initialScrambled = useMemo(() => {
    const list = Array.from({ length: totalItems }, (_, i) => i);
    if (totalItems <= 1) return list;
    if (totalItems === 4) return [2, 0, 3, 1];
    if (totalItems === 5) return [3, 1, 4, 0, 2];
    if (totalItems === 6) return [4, 1, 5, 0, 3, 2];
    return [...list.slice(1), list[0]];
  }, [totalItems]);

  // Khung bên phải: danh sách index các dòng đã đưa vào lắp ráp
  const [rightItems, setRightItems] = useState<number[]>(() => {
    if (Array.isArray(userAnswer) && userAnswer.length > 0) {
      return userAnswer.filter((idx): idx is number => typeof idx === "number" && idx >= 0 && idx < totalItems);
    }
    return [];
  });

  // Khung bên trái: danh sách index các dòng còn lại trong kho
  const [leftItems, setLeftItems] = useState<number[]>(() => {
    const inRight = new Set(Array.isArray(userAnswer) ? userAnswer : []);
    return initialScrambled.filter(idx => !inRight.has(idx));
  });

  // Trạng thái kiểm tra & chạy thử (chế độ ôn luyện)
  const [evaluated, setEvaluated] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [evalErrorMsg, setEvalErrorMsg] = useState<string>("");
  const [showRevealedSolution, setShowRevealedSolution] = useState<boolean>(false);

  // State quản lý kéo thả mượt mà (dùng Ref để không gây giật lag / re-render liên tục)
  const draggedItemRef = useRef<{ source: "left" | "right"; index: number } | null>(null);
  const [dragOverRightIdx, setDragOverRightIdx] = useState<number | null>(null);

  // Ref lưu giữ đáp án hiện tại để tránh render vòng lặp
  const currentRightRef = useRef<number[]>(rightItems);
  currentRightRef.current = rightItems;

  // Đồng bộ khi chuyển câu hỏi hoặc khi userAnswer thay đổi từ bên ngoài
  useEffect(() => {
    if (Array.isArray(userAnswer) && userAnswer.length > 0) {
      const validRight = userAnswer.filter((idx): idx is number => typeof idx === "number" && idx >= 0 && idx < totalItems);
      // Chỉ set nếu dữ liệu khác với state hiện tại để tránh layout thrashing
      const isSame = validRight.length === currentRightRef.current.length && 
                     validRight.every((v, i) => v === currentRightRef.current[i]);
      if (!isSame) {
        setRightItems(validRight);
        const rightSet = new Set(validRight);
        setLeftItems(initialScrambled.filter(idx => !rightSet.has(idx)));
      }
      if (!isExamMode && validRight.length === totalItems) {
        const correct = validRight.every((v, i) => v === targetOrder[i]);
        setIsCorrect(correct);
        setEvaluated(true);
      } else {
        setEvaluated(false);
      }
    } else if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
      if (currentRightRef.current.length > 0) {
        setRightItems([]);
        setLeftItems(initialScrambled);
        setEvaluated(false);
        setIsCorrect(false);
      }
    }
    setShowRevealedSolution(false);
  }, [question.id, userAnswer, totalItems, initialScrambled, targetOrder, isExamMode]);

  // Thông báo đáp án ra ngoài cho QuestionCard / ExamPage
  const emitAnswer = useCallback((newRight: number[]) => {
    if (onAnswerChange) {
      onAnswerChange(newRight);
    }
  }, [onAnswerChange]);

  // ---------------------------------------------------------------------------
  // THAO TÁC 1-CLICK MƯỢT MÀ (KHÔNG PHỤ THUỘC KÉO THẢ)
  // ---------------------------------------------------------------------------

  // Chuyển 1 dòng từ bên trái sang bên phải
  const handleAddToRight = (itemIdx: number) => {
    if (rightItems.includes(itemIdx)) return;
    const nextRight = [...rightItems, itemIdx];
    const nextLeft = leftItems.filter(i => i !== itemIdx);
    setRightItems(nextRight);
    setLeftItems(nextLeft);
    setEvaluated(false);
    emitAnswer(nextRight);
  };

  // Trả 1 dòng từ bên phải về lại kho bên trái
  const handleRemoveFromRight = (pos: number) => {
    const itemIdx = rightItems[pos];
    const nextRight = rightItems.filter((_, i) => i !== pos);
    const nextLeft = [...leftItems, itemIdx];
    setRightItems(nextRight);
    setLeftItems(nextLeft);
    setEvaluated(false);
    emitAnswer(nextRight);
  };

  // Di chuyển thứ tự dòng lên hoặc xuống
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

  // Đặt lại toàn bộ về kho ban đầu
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
  // XỬ LÝ KÉO THẢ TỐI ƯU (CHỐNG TREO/ĐƠ TRÌNH DUYỆT)
  // ---------------------------------------------------------------------------

  const handleDragStartLeft = (e: React.DragEvent, itemIdx: number) => {
    draggedItemRef.current = { source: "left", index: itemIdx };
    e.dataTransfer.setData("application/json", JSON.stringify({ source: "left", index: itemIdx }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragStartRight = (e: React.DragEvent, pos: number) => {
    draggedItemRef.current = { source: "right", index: pos };
    e.dataTransfer.setData("application/json", JSON.stringify({ source: "right", index: pos }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    draggedItemRef.current = null;
    setDragOverRightIdx(null);
  };

  const handleDragOverContainer = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragOverItem = (e: React.DragEvent, pos: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (dragOverRightIdx !== pos) {
      setDragOverRightIdx(pos);
    }
  };

  const handleDropOnContainer = (e: React.DragEvent, targetSlotIdx?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverRightIdx(null);

    let dragData = draggedItemRef.current;
    if (!dragData) {
      try {
        const raw = e.dataTransfer.getData("application/json");
        if (raw) dragData = JSON.parse(raw);
      } catch {}
    }

    if (!dragData) return;

    if (dragData.source === "left") {
      const itemIdx = dragData.index;
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
    } else if (dragData.source === "right") {
      const fromPos = dragData.index;
      const toPos = typeof targetSlotIdx === "number" ? targetSlotIdx : rightItems.length - 1;
      if (fromPos === toPos) return;

      const nextRight = [...rightItems];
      const [moved] = nextRight.splice(fromPos, 1);
      nextRight.splice(toPos, 0, moved);
      setRightItems(nextRight);
      setEvaluated(false);
      emitAnswer(nextRight);
    }

    draggedItemRef.current = null;
  };

  // ---------------------------------------------------------------------------
  // CHẠY THỬ & KIỂM TRA (DÙNG TRONG CHẾ ĐỘ ÔN LUYỆN)
  // ---------------------------------------------------------------------------

  const handleRunAndCheck = () => {
    if (rightItems.length < totalItems) {
      setEvalErrorMsg(`⚠️ Em cần đưa đủ tất cả ${totalItems} dòng lệnh sang khung lắp ráp bên phải trước khi chạy thử! (Hiện có ${rightItems.length}/${totalItems} dòng)`);
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
    <div style={{ margin: "0.85rem 0" }}>
      {/* Thanh Chỉ Dẫn & Nút Đặt Lại */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.65rem",
        padding: "0.45rem 0.75rem",
        background: "rgba(37, 99, 235, 0.06)",
        border: "1px solid rgba(37, 99, 235, 0.18)",
        borderRadius: "8px",
        flexWrap: "wrap",
        gap: "0.4rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Sparkles size={14} color="#2563eb" />
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Bấm nút <strong>[+ Thêm]</strong> hoặc kéo thả các khối lệnh sang khung bên phải theo đúng trình tự logic:
          </span>
        </div>
        <button
          type="button"
          onClick={handleResetAll}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            background: "var(--surface-card)",
            border: "1.5px solid var(--border-medium)",
            color: "var(--text-secondary)",
            padding: "0.22rem 0.6rem",
            borderRadius: "5px",
            fontSize: "0.74rem",
            fontWeight: 700,
            cursor: "pointer"
          }}
          title="Đưa tất cả dòng lệnh về kho ban đầu"
        >
          <RotateCcw size={12} />
          <span>Đặt lại ban đầu</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* BỐ CỤC 2 CỘT: TRÁI (KHO DÒNG LỆNH) & PHẢI (KHUNG LẮP RÁP CODE) */}
      {/* ===================================================================== */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
        gap: "0.9rem",
        alignItems: "start"
      }}>
        {/* ---------------- BÊN TRÁI: KHO DÒNG LỆNH ---------------- */}
        <div style={{
          background: "var(--surface-subtle)",
          border: "1.5px solid var(--border-medium)",
          borderRadius: "10px",
          padding: "0.75rem 0.85rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.55rem",
          minHeight: "200px"
        }}>
          {/* Header Bên Trái */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "0.45rem",
            borderBottom: "1.5px solid var(--border-light)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Boxes size={16} color="#2563eb" />
              <span style={{ fontWeight: 800, fontSize: "0.84rem", color: "var(--text-primary)" }}>
                📦 Kho Dòng Lệnh Chưa Xếp
              </span>
            </div>
            <span style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              padding: "0.15rem 0.45rem",
              borderRadius: "20px",
              background: leftItems.length > 0 ? "rgba(37, 99, 235, 0.12)" : "rgba(16, 185, 129, 0.12)",
              color: leftItems.length > 0 ? "#2563eb" : "#059669"
            }}>
              {leftItems.length > 0 ? `Còn ${leftItems.length} dòng` : "✓ Đã xếp hết"}
            </span>
          </div>

          {/* Danh sách các khối dòng lệnh lộn xộn */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {leftItems.length === 0 ? (
              <div style={{
                padding: "1.5rem 0.75rem",
                textAlign: "center",
                border: "2px dashed var(--border-medium)",
                borderRadius: "8px",
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem"
              }}>
                <CheckCircle2 size={20} color="#059669" />
                <span>Toàn bộ các dòng lệnh đã được chuyển sang khung lắp ráp bên phải.</span>
              </div>
            ) : (
              leftItems.map((itemIdx) => (
                <div
                  key={`left-item-${itemIdx}`}
                  draggable={true}
                  onDragStart={(e) => handleDragStartLeft(e, itemIdx)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleAddToRight(itemIdx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.55rem",
                    padding: "0.45rem 0.7rem",
                    background: "var(--surface-card)",
                    border: "1.5px solid var(--border-medium)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    userSelect: "none"
                  }}
                  title="Bấm hoặc kéo thả sang khung lắp ráp bên phải"
                >
                  <GripVertical size={14} color="var(--text-muted)" style={{ cursor: "grab", flexShrink: 0 }} />
                  <span style={{
                    flex: 1,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: "var(--text-primary)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all"
                  }}>
                    {items[itemIdx]}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToRight(itemIdx);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.2rem",
                      padding: "0.25rem 0.55rem",
                      borderRadius: "5px",
                      background: "rgba(37, 99, 235, 0.1)",
                      border: "1px solid rgba(37, 99, 235, 0.3)",
                      color: "#2563eb",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      flexShrink: 0
                    }}
                  >
                    <span>Thêm</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ---------------- BÊN PHẢI: KHUNG LẮP RÁP THỨ TỰ THỰC THI ---------------- */}
        <div
          onDragOver={handleDragOverContainer}
          onDrop={(e) => handleDropOnContainer(e)}
          style={{
            background: "var(--surface-card)",
            border: evaluated
              ? isCorrect
                ? "2px solid #059669"
                : "2px solid #dc2626"
              : "1.5px solid var(--border-medium)",
            borderRadius: "10px",
            padding: "0.75rem 0.85rem",
            boxShadow: "var(--shadow-card)",
            display: "flex",
            flexDirection: "column",
            gap: "0.55rem",
            minHeight: "200px"
          }}
        >
          {/* Header Bên Phải */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "0.45rem",
            borderBottom: "1.5px solid var(--border-light)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Layers size={16} color={evaluated ? (isCorrect ? "#059669" : "#dc2626") : "#059669"} />
              <span style={{ fontWeight: 800, fontSize: "0.84rem", color: "var(--text-primary)" }}>
                🛠️ Khung Lắp Ráp Đoạn Mã
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                padding: "0.15rem 0.45rem",
                borderRadius: "20px",
                background: rightItems.length === totalItems ? "rgba(16, 185, 129, 0.12)" : "rgba(217, 119, 6, 0.12)",
                color: rightItems.length === totalItems ? "#059669" : "#d97706"
              }}>
                {rightItems.length}/{totalItems} dòng
              </span>
            </div>
          </div>

          {/* Vùng Lắp Ráp & Các Vị Trí Slot */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {rightItems.length === 0 ? (
              <div
                style={{
                  padding: "1.8rem 0.75rem",
                  textAlign: "center",
                  border: "2px dashed var(--border-medium)",
                  borderRadius: "10px",
                  color: "var(--text-muted)",
                  fontSize: "0.82rem",
                  background: "var(--surface-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <Code2 size={24} color="#2563eb" />
                <span style={{ fontWeight: 700 }}>Khung mã nguồn đang trống</span>
                <span style={{ fontSize: "0.76rem" }}>
                  Bấm nút <strong>"Thêm"</strong> ở bên trái hoặc kéo thả các khối lệnh vào đây.
                </span>
              </div>
            ) : (
              rightItems.map((itemIdx, pos) => {
                const isLineCorrect = evaluated && itemIdx === targetOrder[pos];
                const isLineWrong = evaluated && itemIdx !== targetOrder[pos];
                const isHovered = dragOverRightIdx === pos;

                return (
                  <div
                    key={`right-item-${itemIdx}`}
                    draggable={true}
                    onDragStart={(e) => handleDragStartRight(e, pos)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOverItem(e, pos)}
                    onDrop={(e) => handleDropOnContainer(e, pos)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.55rem",
                      padding: "0.45rem 0.7rem",
                      background: isLineCorrect
                        ? "rgba(16, 185, 129, 0.08)"
                        : isLineWrong
                        ? "rgba(239, 68, 68, 0.08)"
                        : isHovered
                        ? "rgba(37, 99, 235, 0.08)"
                        : "var(--surface-subtle)",
                      border: isLineCorrect
                        ? "1.5px solid #10b981"
                        : isLineWrong
                        ? "1.5px solid #ef4444"
                        : isHovered
                        ? "1.5px solid #2563eb"
                        : "1.5px solid var(--border-medium)",
                      boxShadow: isHovered ? "0 0 0 2px rgba(37, 99, 235, 0.3)" : "none",
                      borderRadius: "8px",
                      cursor: "grab",
                      userSelect: "none"
                    }}
                  >
                    {/* Số thứ tự dòng */}
                    <span style={{
                      fontWeight: 900,
                      fontSize: "0.72rem",
                      width: "22px",
                      height: "22px",
                      borderRadius: "5px",
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
                      fontSize: "0.8rem",
                      color: "var(--text-primary)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all"
                    }}>
                      {items[itemIdx]}
                    </span>

                    {/* Nút điều hướng thứ tự Lên / Xuống & Nút Xóa */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", flexShrink: 0 }}>
                      <button
                        type="button"
                        disabled={pos === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveOrder(pos, -1);
                        }}
                        style={{
                          padding: "0.22rem 0.38rem",
                          borderRadius: "5px",
                          border: "1px solid var(--border-medium)",
                          background: "var(--surface-card)",
                          color: pos === 0 ? "var(--text-muted)" : "var(--text-primary)",
                          cursor: pos === 0 ? "not-allowed" : "pointer"
                        }}
                        title="Di chuyển lên trên"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={pos === rightItems.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveOrder(pos, 1);
                        }}
                        style={{
                          padding: "0.22rem 0.38rem",
                          borderRadius: "5px",
                          border: "1px solid var(--border-medium)",
                          background: "var(--surface-card)",
                          color: pos === rightItems.length - 1 ? "var(--text-muted)" : "var(--text-primary)",
                          cursor: pos === rightItems.length - 1 ? "not-allowed" : "pointer"
                        }}
                        title="Di chuyển xuống dưới"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromRight(pos);
                        }}
                        style={{
                          padding: "0.22rem 0.38rem",
                          borderRadius: "5px",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          background: "rgba(239, 68, 68, 0.08)",
                          color: "#dc2626",
                          cursor: "pointer"
                        }}
                        title="Bỏ dòng này khỏi đoạn code (trả về bên trái)"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Các ô chờ (Placeholders) cho các vị trí còn thiếu */}
            {rightItems.length > 0 && rightItems.length < totalItems && (
              Array.from({ length: Math.max(0, totalItems - rightItems.length) }).map((_, placeholderIdx) => {
                const slotNum = rightItems.length + placeholderIdx + 1;
                return (
                  <div
                    key={`placeholder-slot-${slotNum}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.55rem",
                      padding: "0.45rem 0.7rem",
                      background: "transparent",
                      border: "1.5px dashed var(--border-light)",
                      borderRadius: "8px",
                      color: "var(--text-muted)",
                      fontSize: "0.76rem"
                    }}
                  >
                    <span style={{
                      fontWeight: 800,
                      fontSize: "0.72rem",
                      width: "22px",
                      height: "22px",
                      borderRadius: "5px",
                      border: "1px dashed var(--border-medium)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      #{slotNum}
                    </span>
                    <span>[Chờ thêm dòng lệnh tiếp theo...]</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* KHỐI TRẠNG THÁI TRONG PHÒNG THI (EXAM MODE) */}
      {/* ===================================================================== */}
      {isExamMode ? (
        <div style={{ marginTop: "0.75rem" }}>
          {rightItems.length === totalItems ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.5rem 0.85rem",
              borderRadius: "8px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1.5px solid #10b981",
              color: "#065f46",
              fontSize: "0.82rem",
              fontWeight: 700
            }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>✅ Đã sắp xếp đầy đủ {totalItems}/{totalItems} dòng lệnh. Thứ tự bài làm đã được lưu tự động.</span>
            </div>
          ) : (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.5rem 0.85rem",
              borderRadius: "8px",
              background: "rgba(217, 119, 6, 0.08)",
              border: "1.5px solid #d97706",
              color: "#92400e",
              fontSize: "0.82rem",
              fontWeight: 700
            }}>
              <AlertTriangle size={15} color="#d97706" />
              <span>⚠️ Đang sắp xếp: Đã đưa vào {rightItems.length}/{totalItems} dòng lệnh. Hãy thêm nốt các dòng còn lại trước khi chuyển câu.</span>
            </div>
          )}
        </div>
      ) : (
        /* ===================================================================== */
        /* KHỐI HÀNH ĐỘNG TRONG CHẾ ĐỘ ÔN LUYỆN (STUDY MODE) */
        /* ===================================================================== */
        <>
          <div style={{ marginTop: "0.85rem", display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleRunAndCheck}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.48rem 1.2rem",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(135deg, #059669, #047857)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.82rem",
                cursor: "pointer",
                boxShadow: "0 3px 12px rgba(5, 150, 105, 0.35)",
                transition: "all 0.2s ease"
              }}
            >
              <Play size={14} fill="#ffffff" />
              <span>▶️ Chạy Thử & Kiểm Tra Logic (Run Code)</span>
            </button>

            {evalErrorMsg && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                color: "#d97706",
                fontSize: "0.78rem",
                fontWeight: 700
              }}>
                <AlertTriangle size={14} />
                <span>{evalErrorMsg}</span>
              </div>
            )}
          </div>

          {/* KẾT QUẢ SAU KHI BẤM CHẠY: BÁO ĐÚNG / SAI & PHÂN TÍCH SƯ PHẠM */}
          {evaluated && (
            <div style={{ marginTop: "0.85rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <div style={{
                padding: "0.6rem 0.95rem",
                borderRadius: "8px",
                background: isCorrect ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.08)",
                border: isCorrect ? "1.5px solid #059669" : "1.5px solid #dc2626",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.6rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {isCorrect ? (
                    <>
                      <CheckCircle2 size={17} color="#059669" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.86rem", color: "#065f46" }}>
                          HOÀN TOÀN CHÍNH XÁC! THỨ TỰ LOGIC CHUẨN XÁC 100%
                        </div>
                        <div style={{ fontSize: "0.76rem", color: "#047857", marginTop: "1px" }}>
                          Chương trình biên dịch và thực thi tuần tự không gặp bất kỳ lỗi cú pháp hay runtime nào.
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <X size={17} color="#dc2626" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.86rem", color: "#991b1b" }}>
                          THỨ TỰ CHƯA CHÍNH XÁC! ĐOẠN MÃ XẢY RA LỖI LOGIC
                        </div>
                        <div style={{ fontSize: "0.76rem", color: "#b91c1c", marginTop: "1px" }}>
                          Khi thực thi theo thứ tự này, chương trình sẽ phát sinh lỗi logic hoặc thiếu dữ liệu.
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {!isCorrect && (
                    <button
                      type="button"
                      onClick={() => setShowRevealedSolution(prev => !prev)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.3rem 0.7rem",
                        borderRadius: "6px",
                        border: "1.5px solid var(--border-medium)",
                        background: "var(--surface-card)",
                        color: "var(--text-primary)",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      <Eye size={13} />
                      <span>{showRevealedSolution ? "Ẩn đáp án chuẩn" : "Xem thứ tự chuẩn"}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setEvaluated(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.3rem 0.7rem",
                      borderRadius: "6px",
                      border: isCorrect ? "1.5px solid #059669" : "1.5px solid #dc2626",
                      background: isCorrect ? "#059669" : "#dc2626",
                      color: "#ffffff",
                      fontSize: "0.76rem",
                      fontWeight: 800,
                      cursor: "pointer"
                    }}
                  >
                    <RotateCcw size={13} />
                    <span>Thử chỉnh lại</span>
                  </button>
                </div>
              </div>

              {/* KHUNG PHÂN TÍCH VÌ SAO SAI */}
              {!isCorrect && (
                <div style={{
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  background: "rgba(239, 68, 68, 0.05)",
                  border: "1.5px solid rgba(239, 68, 68, 0.25)",
                  color: "#991b1b",
                  fontSize: "0.8rem",
                  lineHeight: "1.5"
                }}>
                  <div style={{ fontWeight: 800, marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.35rem", color: "#dc2626" }}>
                    <AlertTriangle size={14} />
                    <span>Phân tích vì sao thứ tự hiện tại chưa đúng:</span>
                  </div>
                  <div>
                    {analyzeSequenceOrderFailure(question, rightItems)}
                  </div>
                </div>
              )}

              {/* KHUNG TERMINAL MÔ PHỎNG (KHI ĐÚNG) */}
              {isCorrect && (
                <div style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1.5px solid #1e293b",
                  background: "#090d16",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3)"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.4rem 0.75rem",
                    background: "#0f172a",
                    borderBottom: "1px solid #1e293b",
                    color: "#94a3b8",
                    fontSize: "0.74rem",
                    fontWeight: 700
                  }}>
                    <Terminal size={13} color="#38bdf8" />
                    <span>🖥️ Cửa Sổ Terminal Thực Thi (Python 3.12 Output)</span>
                  </div>
                  <div style={{
                    padding: "0.65rem 0.85rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: "#34d399",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.5"
                  }}>
                    <div style={{ color: "#94a3b8", marginBottom: "0.3rem" }}>$ python main.py</div>
                    {getSimulatedExecutionOutput(question)}
                  </div>
                </div>
              )}

              {/* HIỂN THỊ ĐÁP ÁN CHUẨN */}
              {(isCorrect || showRevealedSolution) && question.explanation && (
                <div style={{
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1.5px solid rgba(16, 185, 129, 0.3)",
                  fontSize: "0.8rem",
                  lineHeight: "1.5",
                  color: "var(--text-primary)"
                }}>
                  <div style={{ fontWeight: 800, color: "#059669", marginBottom: "0.25rem" }}>
                    💡 Quy trình chuẩn & Phân tích giải thuật:
                  </div>
                  <div>{question.explanation}</div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
