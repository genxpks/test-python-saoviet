"use client";

import { useState, useEffect, useRef } from "react";
import { Question, PracticalProblem, User, PausedExamState, ExamResult } from "@/types";
import { getQuestionsData, getPracticalsData } from "@/lib/questionsData";
import { getCurrentUser, DEFAULT_SUBJECTS } from "@/lib/usersData";
import QuestionCard from "@/components/QuestionCard";
import PythonEditor from "@/components/PythonEditor";
import ExamNavigator from "@/components/ExamNavigator";
import PinUnlockModal from "@/components/PinUnlockModal";
import ExamResultModal from "@/components/ExamResultModal";
import AuthGate from "@/components/AuthGate";
import SubjectAccessGate from "@/components/SubjectAccessGate";
import { 
  Clock, 
  BookOpen, 
  Terminal, 
  AlertCircle, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Code2
} from "lucide-react";

export default function ExamPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("python");
  const [isExamActive, setIsExamActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [examAccessCode, setExamAccessCode] = useState("");
  const [accessError, setAccessError] = useState("");

  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examPracticals, setExamPracticals] = useState<PracticalProblem[]>([]);
  const [currentPart, setCurrentPart] = useState<1 | 2>(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [userPracticalCode, setUserPracticalCode] = useState<Record<number, string>>({});
  const [practicalResults, setPracticalResults] = useState<Record<number, any>>({});

  const [timerSeconds, setTimerSeconds] = useState(50 * 60);
  const [showResultModal, setShowResultModal] = useState(false);
  const [finalScoreData, setFinalScoreData] = useState<ExamResult | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (isExamActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExamActive, isPaused]);

  const handleStartExam = () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập tài khoản học viên trước khi bắt đầu thi!");
      return;
    }

    const cleanCode = examAccessCode.trim().toUpperCase();
    const validCodes = ["SAOVIET2026", "PYTHON2026", "SV2026", "SAOVIET", "8888"];
    if (currentUser.pin) validCodes.push(currentUser.pin.trim().toUpperCase());

    const isPrivileged = currentUser.role === "admin" || currentUser.role === "branch_manager" || currentUser.role === "teacher";

    if (!isPrivileged) {
      if (!cleanCode) {
        setAccessError("⚠️ Vui lòng nhập Mã Phòng Thi do Giáo viên / Giám thị cấp để mở đề thi!");
        return;
      }
      if (!validCodes.includes(cleanCode)) {
        setAccessError("❌ Mã phòng thi không chính xác! Vui lòng hỏi Giáo viên / Giám thị để nhận mã thi.");
        return;
      }
    }

    setAccessError("");
    const allQ = getQuestionsData();
    const allP = getPracticalsData();

    const shuffledQ = [...allQ].sort(() => Math.random() - 0.5).slice(0, Math.min(50, allQ.length));
    const shuffledP = [...allP].sort(() => Math.random() - 0.5).slice(0, Math.min(4, allP.length));

    setExamQuestions(shuffledQ);
    setExamPracticals(shuffledP);
    setCurrentPart(1);
    setCurrentIndex(0);
    setUserAnswers({});
    setUserPracticalCode({});
    setPracticalResults({});
    setTimerSeconds(50 * 60);
    setIsExamActive(true);
    setIsPaused(false);
  };

  const handlePauseExam = () => {
    if (!isExamActive || !currentUser) return;
    setIsPaused(true);
    setShowPinModal(true);
  };

  const handleAutoSubmit = () => {
    alert("Đã hết giờ làm bài! Hệ thống tự động chấm điểm bài thi.");
    calculateAndShowScore();
  };

  const handleManualSubmit = () => {
    if (confirm("Em có chắc chắn muốn nộp toàn bộ bài thi không?")) {
      calculateAndShowScore();
    }
  };

  const calculateAndShowScore = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsExamActive(false);

    let mcqCorrect = 0;
    examQuestions.forEach((q) => {
      const uAns = userAnswers[q.id];
      if (uAns !== undefined) {
        if (q.type === "single_choice" || q.type === "true_false") {
          if (uAns === q.correct_answer) mcqCorrect++;
        } else if (q.type === "multiple_choice") {
          if (Array.isArray(uAns) && Array.isArray(q.correct_answer)) {
            const sortedU = [...uAns].sort().join(",");
            const sortedC = [...q.correct_answer].sort().join(",");
            if (sortedU === sortedC) mcqCorrect++;
          }
        } else if (q.type === "fill_blank") {
          if (String(uAns).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase()) {
            mcqCorrect++;
          }
        } else if (q.type === "sequence_order") {
          if (Array.isArray(uAns) && Array.isArray(q.correct_order)) {
            if (uAns.join(",") === q.correct_order.join(",")) mcqCorrect++;
          }
        }
      }
    });

    const mcqScore = examQuestions.length > 0 ? (mcqCorrect / examQuestions.length) * 7.0 : 0;

    let practicalScore = 0;
    examPracticals.forEach((p) => {
      const pRes = practicalResults[p.id];
      if (pRes && pRes.passed) {
        practicalScore += 3.0 / Math.max(1, examPracticals.length);
      }
    });

    const totalFinalScore = Number(Math.min(10, mcqScore + practicalScore).toFixed(2));
    const isPass = totalFinalScore >= 5.0;

    const certCode = isPass
      ? `SV-${currentUser?.branchId === "branch_thuduc" ? "TD" : currentUser?.branchId === "branch_quan1" ? "Q1" : "HCM"}-${Math.floor(100000 + Math.random() * 900000)}`
      : undefined;

    const resData: ExamResult = {
      id: `exam_${Date.now()}`,
      userId: currentUser?.id || "anonymous",
      userName: currentUser?.fullName || "Học Viên",
      branchId: currentUser?.branchId || "branch_thuduc",
      subjectId: selectedSubjectId,
      score: totalFinalScore,
      totalQuestions: examQuestions.length + examPracticals.length,
      correctCount: mcqCorrect,
      timeSpentSeconds: 50 * 60 - timerSeconds,
      passed: isPass,
      certificateCode: certCode,
      completedDate: new Date().toLocaleDateString("vi-VN")
    };

    setFinalScoreData(resData);
    setShowResultModal(true);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentSubject = DEFAULT_SUBJECTS.find(s => s.id === selectedSubjectId) || DEFAULT_SUBJECTS[0];

  return (
    <AuthGate
      mode="exam"
      subjectId={selectedSubjectId}
      pageTitle="Phòng Thi Trực Tuyến 50 Phút"
      pageDescription="Học viên vui lòng đăng nhập bằng SĐT và Mật khẩu (Tên+SĐT) để làm bài thi có giám sát."
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1rem 0.5rem" }}>
        {!isExamActive ? (
          <div>
            <div style={{
              background: "var(--surface-card)",
              padding: "0.85rem 1.1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-light)",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              overflowX: "auto"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 800, color: "var(--text-muted)", marginRight: "0.5rem", whiteSpace: "nowrap" }}>
                <Code2 size={16} color="var(--brand-primary)" />
                <span>CHỌN MÔN THI:</span>
              </div>

              <div style={{ display: "flex", gap: "0.4rem" }}>
                {DEFAULT_SUBJECTS.map((subj) => {
                  const isActive = selectedSubjectId === subj.id;
                  return (
                    <button
                      key={subj.id}
                      onClick={() => setSelectedSubjectId(subj.id)}
                      className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
                      style={{
                        borderRadius: "var(--radius-full)",
                        padding: "0.35rem 0.85rem",
                        fontSize: "0.78rem",
                        whiteSpace: "nowrap"
                      }}
                    >
                      <span>{subj.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <SubjectAccessGate subjectId={selectedSubjectId}>
              <div className="q-card" style={{ padding: "2.5rem 2rem", textAlign: "center", maxWidth: "750px", margin: "0 auto", border: "1.5px solid rgba(0, 245, 200, 0.3)", background: "rgba(6, 14, 36, 0.85)" }}>
                <div style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, rgba(0, 245, 200, 0.2), rgba(14, 165, 233, 0.2))",
                  color: "#00f5c8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.2rem",
                  border: "1px solid rgba(0, 245, 200, 0.4)",
                  boxShadow: "0 0 25px rgba(0, 245, 200, 0.25)"
                }}>
                  <Clock size={32} />
                </div>

                <h1 style={{ fontSize: "1.75rem", fontWeight: 900, marginBottom: "0.5rem", color: "#ffffff" }}>
                  Kỳ Thi Đánh Giá Chuẩn Đầu Ra: {currentSubject.name}
                </h1>
                <p style={{ color: "#94a3b8", fontSize: "0.92rem", marginBottom: "1.5rem", lineHeight: "1.6" }}>
                  Đề thi gồm <strong>50 câu trắc nghiệm</strong> (7.0 điểm) và <strong>4 bài tập thực hành code</strong> (3.0 điểm). 
                  Thời gian làm bài: <strong>50 phút</strong>. Đạt từ 5.0 điểm trở lên được cấp Chứng chỉ Sao Việt.
                </p>

                <div style={{
                  background: "rgba(15, 23, 42, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "1rem 1.2rem",
                  marginBottom: "1.5rem",
                  textAlign: "left",
                  fontSize: "0.85rem"
                }}>
                  <div style={{ fontWeight: 800, color: "#38bdf8", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <AlertCircle size={16} />
                    <span>Quy Định Phòng Thi Nghiêm Túc:</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", color: "#cbd5e1" }}>
                    <div>• Học viên cần có <strong>Mã Phòng Thi / Mã Kích Hoạt</strong> do Giám thị hoặc Giáo viên chi nhánh cấp.</div>
                    <div>• Không chuyển tab hoặc mở tài liệu ngoài phạm vi cho phép.</div>
                    <div>• Nếu gặp sự cố phòng máy, chọn <strong>Tạm Dừng Thi</strong> để Giáo viên nhập mã PIN mở khóa.</div>
                    <div>• Hết 50 phút hệ thống sẽ tự động thu bài và chấm điểm tức thời.</div>
                  </div>
                </div>

                {/* Exam Access Code Input */}
                <div style={{
                  background: "rgba(2, 6, 18, 0.8)",
                  border: "1.5px solid rgba(0, 245, 200, 0.35)",
                  borderRadius: "14px",
                  padding: "1.2rem",
                  marginBottom: "1.5rem",
                  textAlign: "center"
                }}>
                  <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 800, color: "#00f5c8", marginBottom: "0.6rem" }}>
                    🔑 NHẬP MÃ PHÒNG THI / MÃ ĐỀ THI ĐỂ MỞ KHÓA:
                  </label>
                  <input
                    type="text"
                    value={examAccessCode}
                    onChange={(e) => { setExamAccessCode(e.target.value); setAccessError(""); }}
                    placeholder="Nhập mã thi (VD: SAOVIET2026, PYTHON2026 hoặc PIN 8888)"
                    style={{
                      width: "100%",
                      maxWidth: "420px",
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      border: "1.5px solid rgba(0, 245, 200, 0.4)",
                      background: "rgba(10, 20, 48, 0.8)",
                      color: "#ffffff",
                      fontSize: "1rem",
                      fontWeight: 800,
                      textAlign: "center",
                      letterSpacing: "0.08em",
                      outline: "none"
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleStartExam();
                    }}
                  />
                  {accessError && (
                    <div style={{ color: "#fb7185", fontSize: "0.82rem", fontWeight: 700, marginTop: "0.5rem" }}>
                      {accessError}
                    </div>
                  )}
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.4rem" }}>
                    (Mã phòng thi chuẩn: <code>SAOVIET2026</code>, <code>PYTHON2026</code> hoặc mã PIN Giám thị: <code>8888</code>)
                  </div>
                </div>

                <button
                  onClick={handleStartExam}
                  className="btn btn-primary btn-lg"
                  style={{
                    padding: "0.95rem 2.8rem",
                    fontSize: "1.05rem",
                    fontWeight: 900,
                    borderRadius: "9999px",
                    background: "linear-gradient(135deg, #00f5c8, #0ea5e9)",
                    color: "#020a14",
                    boxShadow: "0 0 25px rgba(0, 245, 200, 0.4)"
                  }}
                >
                  <BookOpen size={20} />
                  <span>XÁC NHẬN MÃ & VÀO LÀM BÀI THI</span>
                </button>
              </div>
            </SubjectAccessGate>
          </div>
        ) : (
          <div>
            <div style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              padding: "0.8rem 1.4rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              position: "sticky",
              top: "70px",
              zIndex: 30,
              boxShadow: "var(--shadow-card)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)" }}>
                  {currentSubject.name}
                </span>
                <span style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: currentPart === 1 ? "var(--brand-primary)" : "var(--brand-emerald)",
                  background: currentPart === 1 ? "var(--brand-primary-light)" : "var(--brand-emerald-light)",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "var(--radius-full)"
                }}>
                  {currentPart === 1 ? `Phần 1: Trắc Nghiệm (${currentIndex + 1}/50)` : `Phần 2: Tự Luận (${currentIndex + 1}/4)`}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 900,
                  fontSize: "1.25rem",
                  color: timerSeconds < 300 ? "var(--brand-rose)" : "var(--brand-primary)"
                }}>
                  <Clock size={20} />
                  <span>{formatTimer(timerSeconds)}</span>
                </div>

                <button
                  onClick={handlePauseExam}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: "0.3rem" }}
                  title="Tạm dừng làm bài để gọi giáo viên"
                >
                  <Pause size={14} />
                  <span>Tạm Dừng</span>
                </button>

                <button
                  onClick={handleManualSubmit}
                  className="btn btn-primary btn-sm"
                  style={{ gap: "0.3rem" }}
                >
                  <span>Nộp Bài</span>
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.5rem", alignItems: "start" }}>
              <div>
                {currentPart === 1 && examQuestions[currentIndex] && (
                  <div>
                    <QuestionCard
                      question={examQuestions[currentIndex]}
                      index={currentIndex}
                      userAnswer={userAnswers[examQuestions[currentIndex].id]}
                      isExamMode={true}
                      onAnswerChange={(ans) => {
                        setUserAnswers((prev) => ({
                          ...prev,
                          [examQuestions[currentIndex].id]: ans
                        }));
                      }}
                    />

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.2rem" }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                      >
                        <ChevronLeft size={16} />
                        <span>Câu Trước</span>
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          if (currentIndex < examQuestions.length - 1) {
                            setCurrentIndex((prev) => prev + 1);
                          } else {
                            setCurrentPart(2);
                            setCurrentIndex(0);
                          }
                        }}
                      >
                        <span>{currentIndex === examQuestions.length - 1 ? "Sang Phần Tự Luận Code" : "Câu Tiếp Theo"}</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {currentPart === 2 && examPracticals[currentIndex] && (
                  <div className="q-card" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                      <span className="q-badge" style={{ background: "rgba(5, 150, 105, 0.1)", color: "var(--brand-emerald)" }}>
                        TỰ LUẬN BÀI {currentIndex + 1} / 4
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Điểm tối đa: 0.75 điểm / bài</span>
                    </div>

                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.6rem" }}>
                      {examPracticals[currentIndex]?.title}
                    </h3>

                    <p style={{ color: "var(--text-secondary)", marginBottom: "1.2rem", fontSize: "0.92rem", lineHeight: "1.6" }}>
                      {examPracticals[currentIndex]?.description}
                    </p>

                    <PythonEditor
                      problem={examPracticals[currentIndex]}
                      initialCode={userPracticalCode[examPracticals[currentIndex]?.id]}
                      isExamMode={true}
                      onCodeChange={(code) => {
                        setUserPracticalCode((prev) => ({
                          ...prev,
                          [examPracticals[currentIndex].id]: code
                        }));
                      }}
                      onSubmitGrade={(grade) => {
                        setPracticalResults((prev) => ({
                          ...prev,
                          [examPracticals[currentIndex].id]: grade
                        }));
                      }}
                    />

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.4rem", paddingTop: "1.2rem", borderTop: "1px solid var(--border-light)" }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                      >
                        <ChevronLeft size={16} />
                        <span>Bài Trước</span>
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          if (currentIndex < examPracticals.length - 1) setCurrentIndex((prev) => prev + 1);
                          else handleManualSubmit();
                        }}
                      >
                        <span>{currentIndex === examPracticals.length - 1 ? "Hoàn Thành & Nộp Bài" : "Bài Kế Tiếp"}</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <ExamNavigator
                questions={examQuestions}
                practicals={examPracticals}
                currentPart={currentPart}
                currentIndex={currentIndex}
                userAnswers={userAnswers}
                practicalResults={practicalResults}
                onSelectMCQ={(idx) => {
                  setCurrentPart(1);
                  setCurrentIndex(idx);
                }}
                onSelectPractical={(idx) => {
                  setCurrentPart(2);
                  setCurrentIndex(idx);
                }}
              />
            </div>
          </div>
        )}

        {showPinModal && (
          <PinUnlockModal
            onSuccess={() => {
              setIsPaused(false);
              setShowPinModal(false);
            }}
            onCancel={() => {
              setShowPinModal(false);
              setIsExamActive(false);
            }}
          />
        )}

        {showResultModal && finalScoreData && (
          <ExamResultModal
            resultData={finalScoreData}
            onClose={() => {
              setShowResultModal(false);
              setIsExamActive(false);
            }}
          />
        )}
      </div>
    </AuthGate>
  );
}
