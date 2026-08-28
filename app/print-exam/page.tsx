"use client";

import { useState } from "react";
import { QUESTIONS_DATA, PRACTICAL_DATA } from "@/lib/questionsData";
import { Question, PracticalProblem } from "@/types";
import PrintExamSheet from "@/components/PrintExamSheet";

export default function PrintExamPage() {
  const [printMode, setPrintMode] = useState<"exam_student" | "exam_key" | "all_120">("exam_student");
  const [examQuestions, setExamQuestions] = useState<Question[]>(() => {
    return [...QUESTIONS_DATA].slice(0, 50);
  });
  const [examPracticals, setExamPracticals] = useState<PracticalProblem[]>(() => {
    return [...PRACTICAL_DATA].slice(0, 4);
  });
  const [examCode, setExamCode] = useState("MÃ ĐỀ 101");

  const handleShuffleNewExam = () => {
    const shuffledQ = [...QUESTIONS_DATA].sort(() => Math.random() - 0.5).slice(0, 50);
    const shuffledP = [...PRACTICAL_DATA].sort(() => Math.random() - 0.5).slice(0, 4);
    const randCode = "MÃ ĐỀ " + Math.floor(100 + Math.random() * 900);
    setExamQuestions(shuffledQ);
    setExamPracticals(shuffledP);
    setExamCode(randCode);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Print Control Toolbar (Hidden in Print Mode) */}
      <div className="filter-toolbar no-print">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>🖨️ Trình Xuất Bản & In Đề Thi Chuẩn A4</h2>
            <p style={{ color: "#64748b", fontSize: "0.88rem" }}>
              Tối ưu cho khổ giấy A4, ngắt trang thông minh, ẩn thanh điều hướng khi bấm In.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button className="btn btn-secondary" onClick={handleShuffleNewExam}>
              🎲 Trộn Đề Mới ({examCode})
            </button>
            <button className="btn btn-primary" onClick={handlePrint}>
              🖨️ In Đề Này Ngay (Ctrl + P)
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem", borderTop: "1px solid var(--border)", paddingTop: "0.8rem" }}>
          <button
            className={`btn btn-sm ${printMode === "exam_student" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setPrintMode("exam_student")}
          >
            📄 Đề Thi Học Sinh (50 TN + 4 TL)
          </button>
          <button
            className={`btn btn-sm ${printMode === "exam_key" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setPrintMode("exam_key")}
          >
            🔑 Phiếu Đáp Án Giáo Viên
          </button>
          <button
            className={`btn btn-sm ${printMode === "all_120" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setPrintMode("all_120")}
          >
            📚 Trọn Bộ 120 Câu Ôn Tập
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid var(--border)", padding: "1rem", boxShadow: "var(--shadow-sm)" }}>
        {printMode === "exam_student" && (
          <PrintExamSheet
            questions={examQuestions}
            practicals={examPracticals}
            showAnswers={false}
            title={`ĐỀ THI TỐT NGHIỆP PYTHON NÂNG CAO — ${examCode}`}
          />
        )}

        {printMode === "exam_key" && (
          <PrintExamSheet
            questions={examQuestions}
            practicals={examPracticals}
            showAnswers={true}
            title={`PHIẾU ĐÁP ÁN & SUY LUẬN LOGIC — ${examCode}`}
          />
        )}

        {printMode === "all_120" && (
          <PrintExamSheet
            questions={QUESTIONS_DATA}
            practicals={PRACTICAL_DATA}
            showAnswers={true}
            title="NGÂN HÀNG TOÀN DIỆN 120 CÂU HỎI & 10 BÀI THỰC HÀNH PYTHON NÂNG CAO"
          />
        )}
      </div>
    </div>
  );
}
