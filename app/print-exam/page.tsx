"use client";

import { useState, useEffect } from "react";
import { getQuestionsData, getPracticalsData } from "@/lib/questionsData";
import { Question, PracticalProblem } from "@/types";
import { DEFAULT_SUBJECTS } from "@/lib/usersData";
import PrintExamSheet from "@/components/PrintExamSheet";
import AuthGate from "@/components/AuthGate";
import SubjectAccessGate from "@/components/SubjectAccessGate";
import { Printer, Shuffle, FileText, KeyRound, BookOpen, Code2 } from "lucide-react";

export default function PrintExamPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("python");
  const [printMode, setPrintMode] = useState<"exam_student" | "exam_key" | "all_120">("exam_student");
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examPracticals, setExamPracticals] = useState<PracticalProblem[]>([]);
  const [allQuestionsPool, setAllQuestionsPool] = useState<Question[]>([]);
  const [allPracticalsPool, setAllPracticalsPool] = useState<PracticalProblem[]>([]);
  const [examCode, setExamCode] = useState("MÃ ĐỀ 101");

  useEffect(() => {
    fetch("/api/questions")
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          const qs: Question[] = data.questions || [];
          const ps: PracticalProblem[] = data.practical_problems || [];
          setAllQuestionsPool(qs);
          setAllPracticalsPool(ps);
          setExamQuestions([...qs].slice(0, 50));
          setExamPracticals([...ps].slice(0, 4));
        }
      })
      .catch(() => null);
  }, []);

  const handleShuffleNewExam = () => {
    const allQ = allQuestionsPool.length > 0 ? allQuestionsPool : getQuestionsData();
    const allP = allPracticalsPool.length > 0 ? allPracticalsPool : getPracticalsData();
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

  const currentSubject = DEFAULT_SUBJECTS.find(s => s.id === selectedSubjectId) || DEFAULT_SUBJECTS[0];

  return (
    <AuthGate
      mode="practice"
      subjectId={selectedSubjectId}
      pageTitle="Trình Xuất Bản & In Đề Thi Chuẩn A4"
      pageDescription="Vui lòng đăng nhập tài khoản học viên để tạo và xuất bản đề thi chuẩn khảo thí."
    >
      <div>
        <div className="filter-toolbar no-print">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                <Printer size={22} color="var(--brand-primary)" />
                <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Trình Xuất Bản & In Đề Thi Chuẩn A4</h2>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Môn học: <strong>{currentSubject.name}</strong> • Layout tối ưu khổ giấy A4.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <button className="btn btn-secondary" onClick={handleShuffleNewExam}>
                <Shuffle size={16} />
                <span>Trộn Đề Mới ({examCode})</span>
              </button>

              <button className="btn btn-primary" onClick={handlePrint}>
                <Printer size={16} />
                <span>In Bản Chuẩn Ngay (Ctrl + P)</span>
              </button>
            </div>
          </div>

          <div style={{
            background: "var(--surface-subtle)",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.8rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", overflowX: "auto" }}>
              <Code2 size={16} color="var(--brand-primary)" />
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-muted)", marginRight: "0.3rem" }}>MÔN THI:</span>
              {DEFAULT_SUBJECTS.map((subj) => (
                <button
                  key={subj.id}
                  onClick={() => setSelectedSubjectId(subj.id)}
                  className={`btn btn-sm ${selectedSubjectId === subj.id ? "btn-primary" : "btn-secondary"}`}
                  style={{ borderRadius: "var(--radius-full)", padding: "0.3rem 0.75rem", fontSize: "0.75rem" }}
                >
                  {subj.name}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className={`filter-chip ${printMode === "exam_student" ? "active" : ""}`}
                onClick={() => setPrintMode("exam_student")}
              >
                <FileText size={14} />
                <span>Đề Thi Cho Học Viên</span>
              </button>

              <button
                className={`filter-chip ${printMode === "exam_key" ? "active" : ""}`}
                onClick={() => setPrintMode("exam_key")}
              >
                <KeyRound size={14} />
                <span>Đề Kèm Đáp Án & Barem</span>
              </button>

              <button
                className={`filter-chip ${printMode === "all_120" ? "active" : ""}`}
                onClick={() => setPrintMode("all_120")}
              >
                <BookOpen size={14} />
                <span>Tài Liệu Toàn Bộ Câu Hỏi</span>
              </button>
            </div>
          </div>
        </div>

        <SubjectAccessGate subjectId={selectedSubjectId}>
          <div className="print-canvas">
            <PrintExamSheet
              questions={printMode === "all_120" ? getQuestionsData() : examQuestions}
              practicals={printMode === "all_120" ? getPracticalsData() : examPracticals}
              showAnswers={printMode === "exam_key" || printMode === "all_120"}
              title={`ĐỀ THI TỐT NGHIỆP: ${currentSubject.name.toUpperCase()} (${examCode})`}
            />
          </div>
        </SubjectAccessGate>
      </div>
    </AuthGate>
  );
}
