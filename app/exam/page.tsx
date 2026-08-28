"use client";

import { useState, useEffect, useRef } from "react";
import { Question, PracticalProblem, User, PausedExamState } from "@/types";
import { QUESTIONS_DATA, PRACTICAL_DATA } from "@/lib/questionsData";
import { getCurrentUser, savePausedExam, getPausedExam, clearPausedExam, verifyTeacherPin, saveExamResult } from "@/lib/usersData";
import QuestionCard from "@/components/QuestionCard";
import PythonEditor from "@/components/PythonEditor";

export default function ExamPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isExamActive, setIsExamActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examPracticals, setExamPracticals] = useState<PracticalProblem[]>([]);
  const [currentPart, setCurrentPart] = useState<1 | 2>(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [userPracticalCode, setUserPracticalCode] = useState<Record<number, string>>({});
  const [practicalResults, setPracticalResults] = useState<Record<number, any>>({});

  const [timerSeconds, setTimerSeconds] = useState(50 * 60);
  const [showResultModal, setShowResultModal] = useState(false);
  const [finalScoreData, setFinalScoreData] = useState<any>(null);

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

    // Shuffle and pick 50 MCQs
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
    setPinError("");
    setPinInput("");
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

  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyTeacherPin(pinInput)) {
      setIsPaused(false);
      setShowPinModal(false);
    } else {
      setPinError("Mã PIN không chính xác! Vui lòng liên hệ Thầy/Cô.");
    }
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

    const resultData = {
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
        <div className="exam-lobby-card">
          <div className="lobby-icon">🏆</div>
          <h2>BÀI THI TỐT NGHIỆP LẬP TRÌNH PYTHON NÂNG CAO</h2>
          <p className="center-name">Trung Tâm Tin Học Sao Việt — Chi Nhánh Thủ Đức</p>

          <div className="exam-structure-grid">
            <div className="structure-card">
              <div className="card-num">50</div>
              <h4>Phần 1: Trắc Nghiệm</h4>
              <p>50 Câu ngẫu nhiên từ kho 120 câu</p>
              <span className="time-tag">⏱️ Thời gian: 50 Phút</span>
            </div>
            <div className="structure-card">
              <div className="card-num">04</div>
              <h4>Phần 2: Tự Luận Thực Hành</h4>
              <p>4 Bài toán viết hàm từ kho 10 bài</p>
              <span className="time-tag">⏱️ Thời gian: 40 Phút</span>
            </div>
          </div>

          <div className="rules-box">
            <h4>📌 Quy Chế Thi & Lưu Ý:</h4>
            <ul>
              <li>Học viên làm bài độc lập, không mở tài liệu ngoài.</li>
              <li>Có thể bấm <strong>"⏸️ Tạm Dừng Thi"</strong> khi kết thúc buổi học (Cần Giáo viên cấp mã PIN <code>8888</code> để làm tiếp).</li>
              <li>Tại Phần Tự Luận: Bé có thể bấm <strong>"▶️ Chạy Thử Code"</strong> nhiều lần để kiểm tra trước khi bấm nộp bài.</li>
            </ul>
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleStartExam}>
            🚀 BẮT ĐẦU LÀM BÀI THI NGAY
          </button>
        </div>
      ) : (
        /* Active Exam Workspace */
        <div>
          {/* Top Control Bar */}
          <div className="exam-top-bar">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span className="student-name-tag">
                Học viên: {currentUser?.fullName} ({currentUser?.username})
              </span>
              <div className="part-selector">
                <button
                  className={`part-btn ${currentPart === 1 ? "active" : ""}`}
                  onClick={() => {
                    setCurrentPart(1);
                    setCurrentIndex(0);
                  }}
                >
                  Phần 1: Trắc Nghiệm (50 câu)
                </button>
                <button
                  className={`part-btn ${currentPart === 2 ? "active" : ""}`}
                  onClick={() => {
                    setCurrentPart(2);
                    setCurrentIndex(0);
                  }}
                >
                  Phần 2: Tự Luận Code (4 câu)
                </button>
              </div>
            </div>

            <div className="exam-controls">
              <div className={`timer-box ${timerSeconds <= 300 ? "danger" : ""}`}>
                <span>⏳</span>
                <span className="timer-digits">{formatTimer(timerSeconds)}</span>
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
            {/* Main Question / Editor Area */}
            <div className="exam-content-area">
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

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
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
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#10b981" }}>(Điểm tối đa: 1.25đ / bài)</span>
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                    {examPracticals[currentIndex]?.title}
                  </h3>
                  <p style={{ color: "#475569", marginBottom: "1rem" }}>
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

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
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
            <aside className="exam-sidebar">
              <div className="sidebar-header">
                <h3>Bản Đồ Câu Hỏi</h3>
                <span className="progress-text">
                  {Object.keys(userAnswers).length + Object.keys(practicalResults).length} / 54 Câu
                </span>
              </div>

              <div className="nav-legend">
                <span className="legend-item"><span className="dot answered"></span> Đã làm</span>
                <span className="legend-item"><span className="dot unanswered"></span> Chưa</span>
                <span className="legend-item"><span className="dot current"></span> Đang xem</span>
              </div>

              <div className="sidebar-part-label">Phần 1: Trắc Nghiệm (50 câu)</div>
              <div className="question-grid">
                {examQuestions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isCurrent = currentPart === 1 && currentIndex === idx;
                  return (
                    <button
                      key={q.id}
                      className={`grid-btn ${isAnswered ? "answered" : ""} ${isCurrent ? "current" : ""}`}
                      onClick={() => {
                        setCurrentPart(1);
                        setCurrentIndex(idx);
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="sidebar-part-label" style={{ marginTop: "1.2rem" }}>
                Phần 2: Tự Luận Viết Hàm (4 câu)
              </div>
              <div className="question-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                {examPracticals.map((p, idx) => {
                  const isGraded = practicalResults[p.id] && practicalResults[p.id].passed;
                  const isCurrent = currentPart === 2 && currentIndex === idx;
                  return (
                    <button
                      key={p.id}
                      className={`grid-btn ${isGraded ? "answered" : ""} ${isCurrent ? "current" : ""}`}
                      onClick={() => {
                        setCurrentPart(2);
                        setCurrentIndex(idx);
                      }}
                    >
                      TL {idx + 1}
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* PIN Unlock Modal */}
      {showPinModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div style={{ fontSize: "2.5rem" }}>⏸️</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Bài Thi Đang Tạm Dừng</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Toàn bộ tiến trình làm bài đã được lưu an toàn.</p>
            </div>
            <form onSubmit={handleUnlockWithPin}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Mã PIN Phê Duyệt Của Giáo Viên:
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Nhập PIN (Mặc định: 8888)"
                  required
                  style={{ textAlign: "center", fontSize: "1.2rem", letterSpacing: "4px" }}
                />
              </div>
              {pinError && (
                <div style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem", background: "#fef2f2", padding: "0.5rem", borderRadius: "4px" }}>
                  {pinError}
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPinModal(false);
                    setIsExamActive(false);
                  }}
                >
                  Về Trang Chủ
                </button>
                <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
                  🔓 Mở Khóa & Tiếp Tục Thi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && finalScoreData && (
        <div className="modal-overlay">
          <div className="modal-card modal-lg">
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "3rem" }}>🎉</div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800 }}>KẾT QUẢ BÀI THI PYTHON NÂNG CAO</h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Học viên: {finalScoreData.studentName} — Lớp: {finalScoreData.studentClass}</p>
            </div>

            <div className="score-summary-grid">
              <div className="score-metric">
                <span className="metric-label">Điểm Tổng Kết</span>
                <span className="metric-value" style={{ color: "var(--primary)" }}>
                  {finalScoreData.totalScore} / 10
                </span>
              </div>
              <div className="score-metric">
                <span className="metric-label">Phần 1: Trắc Nghiệm</span>
                <span className="metric-value">
                  {finalScoreData.mcqCorrect} / 50 ({finalScoreData.mcqScore}đ)
                </span>
              </div>
              <div className="score-metric">
                <span className="metric-label">Phần 2: Tự Luận Code</span>
                <span className="metric-value">
                  {finalScoreData.practicalScore} / 5.0đ
                </span>
              </div>
              <div className="score-metric">
                <span className="metric-label">Xếp Loại</span>
                <span className="metric-value" style={{ color: "var(--success)" }}>
                  {finalScoreData.rank}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowResultModal(false);
                  setIsExamActive(false);
                }}
              >
                Đóng Bảng Điểm
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                🖨️ In Phiếu Điểm / Lưu PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
