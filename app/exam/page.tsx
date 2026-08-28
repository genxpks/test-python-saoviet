"use client";

import { useState, useEffect, useRef } from "react";
import { Question, PracticalProblem, User, PausedExamState, ExamResult } from "@/types";
import { QUESTIONS_DATA, PRACTICAL_DATA } from "@/lib/questionsData";
import { getCurrentUser, savePausedExam, getPausedExam, clearPausedExam, saveExamResult } from "@/lib/usersData";
import QuestionCard from "@/components/QuestionCard";
import PythonEditor from "@/components/PythonEditor";
import ExamNavigator from "@/components/ExamNavigator";
import PinUnlockModal from "@/components/PinUnlockModal";
import ExamResultModal from "@/components/ExamResultModal";

export default function ExamPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isExamActive, setIsExamActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

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

    const paused = getPausedExam();
    if (paused && user && paused.userId === user.id) {
      if (confirm(`Chào ${user.fullName}, em có bài thi đang tạm dừng lúc ${paused.timestamp}. Em có muốn tiếp tục làm bài không?`)) {
        restoreExam(paused);
      }
    }
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

    const shuffledQ = [...QUESTIONS_DATA].sort(() => Math.random() - 0.5).slice(0, 50);
    const shuffledP = [...PRACTICAL_DATA].sort(() => Math.random() - 0.5).slice(0, 4);

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

    const pausedState: PausedExamState = {
      userId: currentUser.id,
      userName: currentUser.fullName,
      examQuestions,
      examPracticalProblems: examPracticals,
      currentQuestionIndex: currentIndex,
      examPart: currentPart,
      userAnswers,
      userPracticalCode,
      practicalResults,
      timerSeconds,
      timestamp: new Date().toLocaleString()
    };
    savePausedExam(pausedState);
    setShowPinModal(true);
  };

  const restoreExam = (saved: PausedExamState) => {
    setExamQuestions(saved.examQuestions);
    setExamPracticals(saved.examPracticalProblems);
    setCurrentIndex(saved.currentQuestionIndex);
    setCurrentPart(saved.examPart);
    setUserAnswers(saved.userAnswers);
    setUserPracticalCode(saved.userPracticalCode);
    setPracticalResults(saved.practicalResults);
    setTimerSeconds(saved.timerSeconds);
    setIsExamActive(true);
    setIsPaused(true);
    setShowPinModal(true);
  };

  const handleAutoSubmit = () => {
    alert("⏱️ Đã hết giờ làm bài! Hệ thống tự động chấm điểm bài thi của em.");
    calculateAndShowScore();
  };

  const handleManualSubmit = () => {
    if (confirm("Em có chắc chắn muốn nộp toàn bộ bài thi cuối khóa không?")) {
      calculateAndShowScore();
    }
  };

  const calculateAndShowScore = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsExamActive(false);
    clearPausedExam();

    // Grade MCQ
    let mcqCorrect = 0;
    examQuestions.forEach((q) => {
      const userAns = userAnswers[q.id];
      if (userAns !== undefined) {
        if (q.type === "single_choice" || q.type === "true_false") {
          if (userAns === q.correct_answer) mcqCorrect++;
        } else if (q.type === "multiple_choice") {
          if (Array.isArray(userAns) && JSON.stringify(userAns.sort()) === JSON.stringify(q.correct_answer.sort())) mcqCorrect++;
        } else if (q.type === "fill_blank") {
          if (typeof userAns === "string" && userAns.toLowerCase() === q.correct_answer.toLowerCase()) mcqCorrect++;
        } else if (q.type === "sequence_order") {
          if (Array.isArray(userAns) && JSON.stringify(userAns) === JSON.stringify(q.correct_order)) mcqCorrect++;
        } else if (q.type === "matching") {
          let ok = true;
          q.pairs?.forEach((p) => {
            if (userAns[p.left] !== p.right) ok = false;
          });
          if (ok) mcqCorrect++;
        }
      }
    });

    const mcqScore = (mcqCorrect / 50) * 5.0;

    // Grade Practical
    let practicalScore = 0;
    examPracticals.forEach((p) => {
      const res = practicalResults[p.id];
      if (res && res.passed) {
        practicalScore += (res.score / 10) * 1.25;
      }
    });

    const totalScore = parseFloat((mcqScore + practicalScore).toFixed(1));
    let rank = "ĐẠT";
    if (totalScore >= 9.0) rank = "XUẤT SẮC 🏆";
    else if (totalScore >= 8.0) rank = "GIỎI ⭐⭐⭐";
    else if (totalScore >= 6.5) rank = "KHÁ ⭐⭐";
    else if (totalScore >= 5.0) rank = "TRUNG BÌNH ⭐";
    else rank = "CẦN RÈN LUYỆN THÊM 📚";

    const resultData: ExamResult = {
      id: "res_" + Date.now(),
      studentId: currentUser?.id || "unknown",
      studentName: currentUser?.fullName || "Học viên",
      studentClass: currentUser?.class || "Python Nâng Cao",
      mcqCorrect,
      mcqScore: parseFloat(mcqScore.toFixed(1)),
      practicalScore: parseFloat(practicalScore.toFixed(1)),
      totalScore,
      rank,
      submittedAt: new Date().toLocaleString()
    };

    saveExamResult(resultData);
    setFinalScoreData(resultData);
    setShowResultModal(true);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      {!isExamActive ? (
        /* Exam Lobby Card */
        <div className="q-card" style={{ maxWidth: "750px", margin: "1.5rem auto", padding: "2.5rem 2rem", textAlign: "center" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>🏆</div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.3rem" }}>
            BÀI THI TỐT NGHIỆP LẬP TRÌNH PYTHON NÂNG CAO
          </h2>
          <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
            Trung Tâm Tin Học Sao Việt — Chi Nhánh Thủ Đức
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem", textAlign: "left" }}>
            <div style={{ background: "var(--primary-light)", border: "1px solid var(--primary-border)", padding: "1.2rem", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)" }}>50 CÂU</div>
              <h4 style={{ fontWeight: 700, margin: "0.2rem 0" }}>Phần 1: Trắc Nghiệm</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>50 Câu ngẫu nhiên từ kho 120 câu</p>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)", display: "block", marginTop: "0.4rem" }}>⏱️ Thời gian: 50 Phút</span>
            </div>
            <div style={{ background: "var(--success-light)", border: "1px solid var(--success-border)", padding: "1.2rem", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--success-dark)" }}>04 BÀI</div>
              <h4 style={{ fontWeight: 700, margin: "0.2rem 0" }}>Phần 2: Tự Luận Thực Hành</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>4 Bài toán viết hàm từ kho 10 bài</p>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--success-dark)", display: "block", marginTop: "0.4rem" }}>⏱️ Thời gian: 40 Phút</span>
            </div>
          </div>

          <div style={{ background: "#f8fafc", border: "1px solid var(--border)", padding: "1rem 1.2rem", borderRadius: "var(--radius-sm)", textAlign: "left", marginBottom: "1.5rem", fontSize: "0.88rem" }}>
            <h4 style={{ fontWeight: 700, marginBottom: "0.4rem" }}>📌 Quy Chế & Hướng Dẫn Làm Bài:</h4>
            <ul style={{ paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.3rem", color: "var(--text-muted)" }}>
              <li>Học viên làm bài độc lập, hệ thống tự động ghi nhận thời gian và lưu kết quả.</li>
              <li>Có thể bấm <strong>"⏸️ Tạm Dừng Thi"</strong> khi cần (Mã PIN giáo viên mở khóa: <code>8888</code>).</li>
              <li>Tại Phần Tự Luận: Bé có thể bấm <strong>"▶️ Chạy Thử Code"</strong> và <strong>"🤖 Nhờ AI Phân Tích"</strong> trước khi nộp bài.</li>
            </ul>
          </div>

          <button className="btn btn-primary btn-lg btn-block" onClick={handleStartExam}>
            🚀 BẮT ĐẦU LÀM BÀI THI NGAY
          </button>
        </div>
      ) : (
        /* Active Exam Workspace */
        <div>
          {/* Top Control Bar */}
          <div className="exam-top-bar">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, background: "#f1f5f9", padding: "0.3rem 0.8rem", borderRadius: "var(--radius-sm)" }}>
                Học viên: {currentUser?.fullName} ({currentUser?.username})
              </span>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  className={`btn btn-sm ${currentPart === 1 ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => {
                    setCurrentPart(1);
                    setCurrentIndex(0);
                  }}
                >
                  Phần 1: Trắc Nghiệm (50 câu)
                </button>
                <button
                  className={`btn btn-sm ${currentPart === 2 ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => {
                    setCurrentPart(2);
                    setCurrentIndex(0);
                  }}
                >
                  Phần 2: Tự Luận Code (4 câu)
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div className={`timer-box ${timerSeconds <= 300 ? "danger" : ""}`}>
                <span>⏳</span>
                <span>{formatTimer(timerSeconds)}</span>
              </div>
              <button className="btn btn-warning btn-sm" onClick={handlePauseExam}>
                ⏸️ Tạm Dừng Thi
              </button>
              <button className="btn btn-success btn-sm" onClick={handleManualSubmit}>
                💾 Nộp Bài Thi
              </button>
            </div>
          </div>

          {/* Exam Content Workspace */}
          <div className="exam-workspace">
            {/* Main Area */}
            <div>
              {currentPart === 1 ? (
                <div>
                  <QuestionCard
                    question={examQuestions[currentIndex]}
                    index={currentIndex}
                    isExamMode={true}
                    userAnswer={userAnswers[examQuestions[currentIndex]?.id]}
                    onAnswerChange={(ans) => {
                      setUserAnswers((prev) => ({
                        ...prev,
                        [examQuestions[currentIndex].id]: ans
                      }));
                    }}
                  />

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.2rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                    >
                      ◀ Câu Trước
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (currentIndex < 49) setCurrentIndex((prev) => prev + 1);
                        else {
                          setCurrentPart(2);
                          setCurrentIndex(0);
                        }
                      }}
                    >
                      {currentIndex === 49 ? "Sang Phần Tự Luận ▶" : "Câu Kế Tiếp ▶"}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span className="q-badge">💻 BÀI TỰ LUẬN THỰC HÀNH {currentIndex + 1} / 4</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--success-dark)" }}>(Điểm: 1.25đ / bài)</span>
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                    {examPracticals[currentIndex]?.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.92rem" }}>
                    {examPracticals[currentIndex]?.description}
                  </p>

                  <PythonEditor
                    problem={examPracticals[currentIndex]}
                    initialCode={userPracticalCode[examPracticals[currentIndex]?.id]}
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

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.2rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                    >
                      ◀ Bài Trước
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (currentIndex < 3) setCurrentIndex((prev) => prev + 1);
                        else handleManualSubmit();
                      }}
                    >
                      {currentIndex === 3 ? "Hoàn Thành & Nộp Bài" : "Bài Kế Tiếp ▶"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Navigator Grid */}
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

      {/* PIN Unlock Modal */}
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

      {/* Result Modal */}
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
  );
}
