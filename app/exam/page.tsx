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
import { 
  Trophy, 
  Clock, 
  BookOpen, 
  Terminal, 
  AlertCircle, 
  Pause, 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  Sparkles,
  Award,
  Layers
} from "lucide-react";

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
      alert("Vui lòng đăng nhập tài khoản học viên (ở góc trên thanh menu) trước khi bắt đầu làm bài thi!");
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
    if (confirm("Em có chắc chắn muốn hoàn thành và nộp toàn bộ bài thi tốt nghiệp không?")) {
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
        <div className="q-card" style={{ maxWidth: "800px", margin: "1.5rem auto", padding: "2.8rem 2.2rem", textAlign: "center" }}>
          <div style={{
            width: "68px",
            height: "68px",
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.15))",
            color: "var(--brand-primary)",
            borderRadius: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.2rem auto"
          }}>
            <Trophy size={36} />
          </div>

          <h2 style={{ fontSize: "1.75rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.4rem", letterSpacing: "-0.02em" }}>
            BÀI THI TỐT NGHIỆP PYTHON NÂNG CAO
          </h2>

          <p style={{ color: "var(--brand-primary)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "2rem" }}>
            Trung Tâm Tin Học Sao Việt — Chi Nhánh TP. Thủ Đức
          </p>

          {/* Syllabus Split Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.2rem", marginBottom: "2rem", textAlign: "left" }}>
            {/* Part 1 */}
            <div style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              border: "1px solid #bfdbfe",
              padding: "1.4rem",
              borderRadius: "var(--radius-md)",
              position: "relative"
            }}>
              <span style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--brand-primary)", fontFamily: "var(--font-heading)" }}>
                50 CÂU
              </span>
              <h4 style={{ fontWeight: 800, margin: "0.2rem 0", color: "#1e40af" }}>Phần 1: Trắc Nghiệm</h4>
              <p style={{ fontSize: "0.85rem", color: "#475569" }}>50 câu trắc nghiệm ngẫu nhiên từ kho 120 câu</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.82rem", fontWeight: 700, color: "var(--brand-primary)", marginTop: "0.6rem" }}>
                <Clock size={14} />
                <span>Thời gian: 50 Phút (5.0 điểm)</span>
              </div>
            </div>

            {/* Part 2 */}
            <div style={{
              background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
              border: "1px solid #a7f3d0",
              padding: "1.4rem",
              borderRadius: "var(--radius-md)",
              position: "relative"
            }}>
              <span style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--brand-emerald-dark)", fontFamily: "var(--font-heading)" }}>
                04 BÀI
              </span>
              <h4 style={{ fontWeight: 800, margin: "0.2rem 0", color: "#065f46" }}>Phần 2: Tự Luận Code IDE</h4>
              <p style={{ fontSize: "0.85rem", color: "#475569" }}>4 bài toán viết hàm thuật toán từ kho 10 bài</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.82rem", fontWeight: 700, color: "var(--brand-emerald-dark)", marginTop: "0.6rem" }}>
                <Clock size={14} />
                <span>Thời gian: 40 Phút (5.0 điểm)</span>
              </div>
            </div>
          </div>

          {/* Exam Regulations Notice */}
          <div style={{
            background: "var(--surface-subtle)",
            border: "1px solid var(--border-light)",
            padding: "1.2rem 1.4rem",
            borderRadius: "var(--radius-md)",
            textAlign: "left",
            marginBottom: "2rem",
            fontSize: "0.88rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, marginBottom: "0.6rem", color: "var(--text-primary)" }}>
              <ShieldAlert size={16} color="var(--brand-primary)" />
              <span>Quy Chế & Hướng Dẫn Phòng Thi Trực Tuyến:</span>
            </div>
            <ul style={{ paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.4rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              <li>Học viên làm bài độc lập; hệ thống tự động ghi nhận thời gian và lưu bài thi tự động.</li>
              <li>Học viên có thể bấm <strong>"Tạm Dừng Thi"</strong> khi cần ra ngoài (Giáo viên nhập mã PIN: <code>8888</code> để mở khóa).</li>
              <li>Tại Phần Tự Luận: Bé có thể bấm <strong>"▶️ Chạy Thử Code"</strong> và <strong>"🤖 Nhờ AI Phân Tích"</strong> trước khi nộp bài.</li>
            </ul>
          </div>

          {currentUser ? (
            <button className="btn btn-primary btn-lg btn-block" onClick={handleStartExam}>
              <Sparkles size={18} />
              <span>BẮT ĐẦU LÀM BÀI THI NGAY ({currentUser.fullName})</span>
            </button>
          ) : (
            <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", padding: "1rem", borderRadius: "var(--radius-md)" }}>
              <p style={{ color: "#e11d48", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                ⚠️ Em chưa đăng nhập tài khoản học viên!
              </p>
              <p style={{ color: "#475569", fontSize: "0.85rem" }}>
                Hãy bấm nút <strong>"Đăng Nhập"</strong> ở góc trên bên phải để bắt đầu làm bài.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Active Exam Workspace */
        <div>
          {/* Top Control Cockpit Bar */}
          <div className="exam-cockpit-bar">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <span style={{
                fontSize: "0.86rem",
                fontWeight: 700,
                background: "var(--surface-subtle)",
                padding: "0.4rem 0.9rem",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-light)"
              }}>
                Thí sinh: <strong style={{ color: "var(--brand-primary)" }}>{currentUser?.fullName}</strong> ({currentUser?.username})
              </span>

              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  className={`btn btn-sm ${currentPart === 1 ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => {
                    setCurrentPart(1);
                    setCurrentIndex(0);
                  }}
                >
                  <BookOpen size={14} />
                  <span>Phần 1: Trắc Nghiệm (50 câu)</span>
                </button>

                <button
                  className={`btn btn-sm ${currentPart === 2 ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => {
                    setCurrentPart(2);
                    setCurrentIndex(0);
                  }}
                >
                  <Terminal size={14} />
                  <span>Phần 2: Tự Luận Code (4 câu)</span>
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div className={`timer-pill ${timerSeconds <= 300 ? "danger" : ""}`}>
                <Clock size={18} />
                <span>{formatTimer(timerSeconds)}</span>
              </div>

              <button className="btn btn-warning btn-sm" onClick={handlePauseExam}>
                <Pause size={14} />
                <span>Tạm Dừng</span>
              </button>

              <button className="btn btn-success btn-sm" onClick={handleManualSubmit}>
                <Save size={14} />
                <span>Nộp Toàn Bộ Bài</span>
              </button>
            </div>
          </div>

          {/* Exam Content Workspace */}
          <div className="exam-workspace-layout">
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

                  {/* MCQ Navigation Footer */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.4rem", paddingTop: "1.2rem", borderTop: "1px solid var(--border-light)" }}>
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
                        if (currentIndex < 49) setCurrentIndex((prev) => prev + 1);
                        else {
                          setCurrentPart(2);
                          setCurrentIndex(0);
                        }
                      }}
                    >
                      <span>{currentIndex === 49 ? "Sang Phần Tự Luận" : "Câu Kế Tiếp"}</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                    <span className="q-badge" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--brand-emerald-dark)", borderColor: "rgba(16, 185, 129, 0.25)" }}>
                      <Terminal size={14} />
                      <span>BÀI TỰ LUẬN THỰC HÀNH {currentIndex + 1} / 4</span>
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--brand-emerald-dark)" }}>(Điểm: 1.25đ / bài)</span>
                  </div>

                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.4rem" }}>
                    {examPracticals[currentIndex]?.title}
                  </h3>

                  <p style={{ color: "var(--text-secondary)", marginBottom: "1.2rem", fontSize: "0.92rem", lineHeight: "1.6" }}>
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

                  {/* Practical Navigation Footer */}
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
                        if (currentIndex < 3) setCurrentIndex((prev) => prev + 1);
                        else handleManualSubmit();
                      }}
                    >
                      <span>{currentIndex === 3 ? "Hoàn Thành & Nộp Bài" : "Bài Kế Tiếp"}</span>
                      <ChevronRight size={16} />
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
