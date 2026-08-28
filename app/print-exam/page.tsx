"use client";

import { useState } from "react";
import { getQuestionsData, getPracticalsData } from "@/lib/questionsData";
import { Question, PracticalProblem } from "@/types";
import PrintExamSheet from "@/components/PrintExamSheet";
import { Printer, Shuffle, FileText, KeyRound, BookOpen, CheckCircle2 } from "lucide-react";

export default function PrintExamPage() {
  const [printMode, setPrintMode] = useState<"exam_student" | "exam_key" | "all_120">("exam_student");
  const [examQuestions, setExamQuestions] = useState<Question[]>(() => {
    return [...getQuestionsData()].slice(0, 50);
  });
  const [examPracticals, setExamPracticals] = useState<PracticalProblem[]>(() => {
    return [...getPracticalsData()].slice(0, 4);
  });
  const [examCode, setExamCode] = useState("MÃ ĐỀ 101");

  const handleShuffleNewExam = () => {
    const allQ = getQuestionsData();
    const allP = getPracticalsData();
    const shuffledQ = [...allQ].sort(() => Math.random() - 0.5).slice(0, Math.min(50, allQ.length));
    const shuffledP = [...allP].sort(() => Math.random() - 0.5).slice(0, Math.min(4, allP.length));
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
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
              <Printer size={22} color="var(--brand-primary)" />
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Trình Xuất Bản & In Đề Thi Chuẩn A4</h2>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Tối ưu hóa layout khổ giấy A4, ngắt trang thông minh, tự động ẩn giao diện web khi bấm In.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <button className="btn btn-secondary" onClick={handleShuffleNewExam}>
              <Shuffle size={16} />
              <span>Trộn Đề Mới ({examCode})</span>
            </button>

            <button className="btn btn-primary btn-lg" onClick={handlePrint}>
              <Printer size={18} />
              <span>In Đề Này Ngay (Ctrl + P)</span>
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.6rem", borderTop: "1px solid var(--border-light)", paddingTop: "0.9rem" }}>
          <button
            className={`btn btn-sm ${printMode === "exam_student" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "var(--radius-full)" }}
            onClick={() => setPrintMode("exam_student")}
          >
            <FileText size={15} />
            <span>Đề Thi Học Sinh (50 TN + 4 TL)</span>
          </button>

          <button
            className={`btn btn-sm ${printMode === "exam_key" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "var(--radius-full)" }}
            onClick={() => setPrintMode("exam_key")}
          >
            <KeyRound size={15} />
            <span>Phiếu Đáp Án Cho Giáo Viên</span>
          </button>

          <button
            className={`btn btn-sm ${printMode === "all_120" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "var(--radius-full)" }}
            onClick={() => setPrintMode("all_120")}
          >
            <BookOpen size={15} />
            <span>Toàn Bộ Ngân Hàng 120 Câu Hỏi</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Viewport */}
      <div style={{
        background: "#ffffff",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-light)",
        padding: "1.5rem",
        boxShadow: "var(--shadow-card)"
      }}>
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
            questions={getQuestionsData()}
            practicals={getPracticalsData()}
            showAnswers={true}
            title="NGÂN HÀNG TOÀN DIỆN 120 CÂU HỎI & 10 BÀI THỰC HÀNH PYTHON NÂNG CAO"
          />
        )}
      </div>
    </div>
  );
}
