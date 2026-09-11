"use client";

import { useState, useEffect, useRef } from "react";
import { Question, PracticalProblem, User, PausedExamState, ExamResult, ExamConfig } from "@/types";
import { getQuestionsData, getPracticalsData } from "@/lib/questionsData";
import { getCurrentUser, getUserSession, DEFAULT_SUBJECTS, getExamSettings, setUserStatus, toggleUserSubject } from "@/lib/usersData";
import { fetchClientNetworkInfo, getCurrentVNDateTime, formatTimeSpent } from "@/lib/networkHelper";
import QuestionCard from "@/components/QuestionCard";
import PythonEditor from "@/components/PythonEditor";
import { PythonEngine } from "@/lib/pythonEngine";
import ExamNavigator from "@/components/ExamNavigator";
import ExamPauseModal from "@/components/exam/ExamPauseModal";
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
  Code2,
  Globe,
  Wifi,
  KeyRound,
  Trash2,
  RotateCcw,
  ShieldCheck,
  Award,
  CheckCircle2,
  WifiOff
} from "lucide-react";
import { 
  saveExamAutoSave, 
  getExamAutoSave, 
  clearExamAutoSave, 
  ExamAutoSaveData 
} from "@/lib/examAutoSaveHelper";

export default function ExamPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("python");
  const [isExamActive, setIsExamActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pausedExam, setPausedExam] = useState<PausedExamState | null>(null);
  const [resumeCodeInput, setResumeCodeInput] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [isResuming, setIsResuming] = useState(false);
  const [examAccessCode, setExamAccessCode] = useState("");
  const [accessError, setAccessError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false); // FLOW-01: loading state khi verify ma
  const [verifiedConfig, setVerifiedConfig] = useState<ExamConfig | null>(null);

  const [examStartTime, setExamStartTime] = useState<string>("");
  const [examStartDate, setExamStartDate] = useState<string>("");
  const [clientNetworkIp, setClientNetworkIp] = useState<string>("");

  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examPracticals, setExamPracticals] = useState<PracticalProblem[]>([]);
  const [currentPart, setCurrentPart] = useState<1 | 2>(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [userPracticalCode, setUserPracticalCode] = useState<Record<number, string>>({});
  const [practicalResults, setPracticalResults] = useState<Record<number, any>>({});

  const [timerSeconds, setTimerSeconds] = useState(50 * 60);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [finalScoreData, setFinalScoreData] = useState<ExamResult | null>(null);

  // Tính năng Ngoại Tuyến, Auto-Save & Bảo Mật Phòng Thi
  const [isNetworkOnline, setIsNetworkOnline] = useState(true);
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState<string>("");
  const [detectedAutoSave, setDetectedAutoSave] = useState<ExamAutoSaveData | null>(null);
  const [securityWarning, setSecurityWarning] = useState<string>("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateUser = () => {
      setCurrentUser(getCurrentUser());
    };
    updateUser();

    fetchClientNetworkInfo().then(net => {
      if (net && net.ip) setClientNetworkIp(net.ip);
    }).catch(() => null);

    window.addEventListener("saoviet-auth-change", updateUser);
    window.addEventListener("storage", updateUser);
    return () => {
      window.removeEventListener("saoviet-auth-change", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const checkPausedExam = async (userId?: string, subjectId?: string) => {
    const uid = userId || currentUser?.id;
    const sid = subjectId || selectedSubjectId;
    if (!uid) return;

    let foundPaused: PausedExamState | null = null;
    try {
      const res = await fetch(`/api/pause?userId=${encodeURIComponent(uid)}&subjectId=${encodeURIComponent(sid)}`);
      const data = await res.json();
      if (data && data.success && data.paused) {
        foundPaused = data.paused;
      }
    } catch {}

    if (!foundPaused && typeof window !== "undefined") {
      try {
        const localData = localStorage.getItem(`SAOVIET_PAUSED_EXAM_${uid}_${sid}`);
        if (localData) foundPaused = JSON.parse(localData);
      } catch {}
    }

    setPausedExam(foundPaused);
  };

  useEffect(() => {
    if (currentUser?.id) {
      checkPausedExam(currentUser.id, selectedSubjectId);
    }
  }, [currentUser?.id, selectedSubjectId]);

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

  // 1. Lắng nghe trạng thái mạng Online / Offline
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsNetworkOnline(navigator.onLine);
      const handleOnline = () => setIsNetworkOnline(true);
      const handleOffline = () => setIsNetworkOnline(false);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  // 2. Chế độ bảo vệ phòng thi: Chống mở F12, Inspect, Chuột phải và BeforeUnload snapshot
  useEffect(() => {
    if (!isExamActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Chặn F12
      if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        setSecurityWarning("⚠️ Chế độ thi bảo mật: Đã vô hiệu hóa phím F12.");
        setTimeout(() => setSecurityWarning(""), 3500);
        return false;
      }
      // Chặn Ctrl+Shift+I / J / C
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) {
        e.preventDefault();
        e.stopPropagation();
        setSecurityWarning("⚠️ Chế độ thi bảo mật: Đã khóa tổ hợp phím Inspect Element.");
        setTimeout(() => setSecurityWarning(""), 3500);
        return false;
      }
      // Chặn Ctrl+U
      if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        e.stopPropagation();
        setSecurityWarning("⚠️ Chế độ thi bảo mật: Đã khóa tính năng xem mã nguồn trang.");
        setTimeout(() => setSecurityWarning(""), 3500);
        return false;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setSecurityWarning("⚠️ Chế độ thi bảo mật: Đã khóa menu chuột phải.");
      setTimeout(() => setSecurityWarning(""), 3500);
      return false;
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentUser?.id && examQuestions.length > 0) {
        const nowDT = getCurrentVNDateTime();
        saveExamAutoSave({
          examId: `exam_${currentUser.id}`,
          userId: currentUser.id,
          userName: currentUser.fullName,
          subjectId: selectedSubjectId,
          branchId: currentUser.branchId,
          examAccessCode,
          currentPart,
          currentIndex,
          userAnswers,
          userPracticalCode,
          practicalResults,
          examQuestions,
          examPracticals,
          remainingSeconds: timerSeconds,
          totalDurationSeconds: 60 * 60,
          savedTimestamp: Date.now(),
          savedDateTimeText: `${nowDT.date} ${nowDT.time}`
        });
      }
      e.preventDefault();
      e.returnValue = "Bài thi đang diễn ra. Bạn có chắc chắn muốn rời đi?";
      return e.returnValue;
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isExamActive, currentUser, selectedSubjectId, examAccessCode, currentPart, currentIndex, userAnswers, userPracticalCode, practicalResults, examQuestions, examPracticals, timerSeconds]);

  // 3. Tự động lưu tiến độ thi liên tục (Offline Safe & Sync Server)
  useEffect(() => {
    if (!isExamActive || isPaused || !currentUser?.id || examQuestions.length === 0) return;

    const nowDT = getCurrentVNDateTime();
    const saveSnapshot = () => {
      const payload: ExamAutoSaveData = {
        examId: `exam_${currentUser.id}`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        subjectId: selectedSubjectId,
        branchId: currentUser.branchId,
        examAccessCode,
        currentPart,
        currentIndex,
        userAnswers,
        userPracticalCode,
        practicalResults,
        examQuestions,
        examPracticals,
        remainingSeconds: timerSeconds,
        totalDurationSeconds: 60 * 60,
        savedTimestamp: Date.now(),
        savedDateTimeText: `${nowDT.date} ${nowDT.time}`
      };

      saveExamAutoSave(payload);
      setLastAutoSavedTime(nowDT.time);

      if (navigator.onLine) {
        fetch("/api/pause", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            pausedAt: `${nowDT.date} ${nowDT.time}`,
            pausedDate: nowDT.date,
            pausedBy: "autosave",
            reason: "Hệ thống tự động lưu bài thi định kỳ",
            isUnlocked: true
          })
        }).catch(() => null);
      }
    };

    saveSnapshot();
    const interval = setInterval(saveSnapshot, 5000);
    return () => clearInterval(interval);
  }, [isExamActive, isPaused, userAnswers, userPracticalCode, practicalResults, currentPart, currentIndex, timerSeconds]);

  // 4. Phát hiện bài thi chưa hoàn thành do đơ máy / mất mạng khi tải trang
  useEffect(() => {
    if (!isExamActive && currentUser?.id) {
      const autoSave = getExamAutoSave(currentUser.id, selectedSubjectId);
      if (autoSave && autoSave.examQuestions && autoSave.examQuestions.length > 0 && autoSave.remainingSeconds > 0) {
        setDetectedAutoSave(autoSave);
      }
    }
  }, [currentUser?.id, selectedSubjectId, isExamActive]);

  const handleRestoreFromAutoSave = () => {
    if (!detectedAutoSave) return;
    setExamQuestions(detectedAutoSave.examQuestions || []);
    setExamPracticals(detectedAutoSave.examPracticals || []);
    setUserAnswers(detectedAutoSave.userAnswers || {});
    setUserPracticalCode(detectedAutoSave.userPracticalCode || {});
    setPracticalResults(detectedAutoSave.practicalResults || {});
    setTimerSeconds(detectedAutoSave.remainingSeconds || 60 * 60);
    setCurrentPart(detectedAutoSave.currentPart || 1);
    setCurrentIndex(detectedAutoSave.currentIndex || 0);
    if (detectedAutoSave.examAccessCode) setExamAccessCode(detectedAutoSave.examAccessCode);

    setIsExamActive(true);
    setIsPaused(false);
    setDetectedAutoSave(null);
  };

  const handleDiscardAutoSave = () => {
    if (!currentUser) return;
    clearExamAutoSave(currentUser.id, selectedSubjectId);
    setDetectedAutoSave(null);
  };

  const handleStartExam = async () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập tài khoản học viên trước khi bắt đầu thi!");
      return;
    }

    const cleanCode = examAccessCode.trim().toUpperCase();
    const isPrivileged = currentUser.role === "admin" || currentUser.role === "branch_manager" || currentUser.role === "teacher";
    let targetConfig: ExamConfig | null = verifiedConfig;

    if (!isPrivileged) {
      if (!cleanCode) {
        setAccessError("⚠️ Vui lòng nhập Mã Phòng Thi do Giáo viên / Giám thị cấp để mở đề thi!");
        return;
      }

      let codeValid = false;
      setIsVerifying(true);
      try {
        const verifyRes = await fetch("/api/exam-codes/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: cleanCode,
            subjectId: selectedSubjectId,
            branchId: currentUser.branchId || "all",
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.valid) {
          codeValid = true;
          if (verifyData.examCode?.config) {
            targetConfig = verifyData.examCode.config;
            setVerifiedConfig(verifyData.examCode.config);
          }
        } else {
          setAccessError("❌ " + (verifyData.message || "Mã phòng thi không chính xác hoặc đã hết hạn!"));
          return;
        }
      } catch {
        setAccessError("❌ Không thể kết nối máy chủ xác thực mã. Vui lòng kiểm tra mạng hoặc liên hệ Giám thị.");
        return;
      } finally {
        setIsVerifying(false);
      }

      if (!codeValid) return;
    }

    setAccessError("");
    const startDT = getCurrentVNDateTime();
    setExamStartTime(startDT.time);
    setExamStartDate(startDT.date);

    // Cấu hình đề thi: lấy từ mã phòng thi hoặc mặc định Option C (50 TN + 4 Code · 60 phút)
    const numQ = typeof targetConfig?.numQuestions === "number" ? targetConfig.numQuestions : 50;
    const numP = typeof targetConfig?.numPracticals === "number" ? targetConfig.numPracticals : 4;
    const durationMins = typeof targetConfig?.durationMinutes === "number" ? targetConfig.durationMinutes : 60;

    let allQ = getQuestionsData();
    let allP = getPracticalsData();

    try {
      const qRes = await fetch("/api/questions");
      const qData = await qRes.json();
      if (qData && qData.success) {
        if (Array.isArray(qData.questions) && qData.questions.length > 0) allQ = qData.questions;
        if (Array.isArray(qData.practical_problems) && qData.practical_problems.length > 0) allP = qData.practical_problems;
      }
    } catch {}

    // Lọc theo môn học đã chọn từ phần ôn luyện
    const subjectQ = allQ.filter(q => 
      selectedSubjectId === "all" || !q.subjectId || q.subjectId === "all" || q.subjectId === selectedSubjectId
    );
    const subjectP = allP.filter(p => 
      selectedSubjectId === "all" || !p.subjectId || p.subjectId === "all" || p.subjectId === selectedSubjectId
    );

    const poolQ = subjectQ.length > 0 ? subjectQ : allQ;
    const poolP = subjectP.length > 0 ? subjectP : allP;

    // Bốc ngẫu nhiên theo cấu hình số câu
    const shuffledQ = numQ > 0 ? [...poolQ].sort(() => Math.random() - 0.5).slice(0, Math.min(numQ, poolQ.length)) : [];
    const shuffledP = numP > 0 ? [...poolP].sort(() => Math.random() - 0.5).slice(0, Math.min(numP, poolP.length)) : [];

    setExamQuestions(shuffledQ);
    setExamPracticals(shuffledP);
    setCurrentPart(shuffledQ.length > 0 ? 1 : 2);
    setCurrentIndex(0);
    setUserAnswers({});
    setUserPracticalCode({});
    setPracticalResults({});
    setTimerSeconds(durationMins * 60);
    setIsExamActive(true);
    setIsPaused(false);
  };

  const handlePauseExam = async () => {
    if (!isExamActive || !currentUser) return;
    setIsPaused(true);
    setShowPauseModal(true);

    const nowDT = getCurrentVNDateTime();
    const pauseState: PausedExamState = {
      examId: `exam_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      subjectId: selectedSubjectId,
      branchId: currentUser.branchId || "branch_thuduc",
      currentPart,
      currentQuestionIndex: currentIndex,
      userAnswers,
      userPracticalCode,
      practicalResults,
      examQuestions,
      examPracticals,
      remainingSeconds: timerSeconds,
      totalDurationSeconds: 60 * 60,
      pausedAt: `${nowDT.date} ${nowDT.time}`,
      pausedDate: nowDT.date,
      pausedBy: "student",
      reason: "Học viên tạm dừng bài thi để tiếp tục sau",
      isUnlocked: false,
      originalCode: examAccessCode,
      clientIp: clientNetworkIp
    };

    // Tự động lưu lên MongoDB
    try {
      await fetch("/api/pause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pauseState)
      });
    } catch {}

    // Lưu dự phòng LocalStorage
    try {
      localStorage.setItem(`SAOVIET_PAUSED_EXAM_${currentUser.id}_${selectedSubjectId}`, JSON.stringify(pauseState));
    } catch {}

    setPausedExam(pauseState);
  };

  const handleResumeWithCode = async (code: string): Promise<{ success: boolean; message?: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: "Vui lòng nhập Mã Phòng Thi Mới (Mã v2) hoặc PIN Giám Thị!" };
    }

    // PIN của tài khoản cán bộ coi thi hoặc xác thực qua API
    const isTeacherPin = !!(currentUser?.pin && cleanCode === currentUser.pin.trim().toUpperCase());
    let valid = isTeacherPin;

    if (!valid) {
      try {
        const verifyRes = await fetch("/api/exam-codes/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: cleanCode,
            subjectId: selectedSubjectId,
            branchId: currentUser?.branchId || "all"
          })
        });
        const verifyData = await verifyRes.json();
        if (verifyData && verifyData.valid) {
          valid = true;
        } else {
          return { success: false, message: verifyData?.message || "Mã phòng thi không chính xác hoặc đã hết hạn!" };
        }
      } catch {
        return { success: false, message: "Không thể kết nối xác thực mã lúc này. Vui lòng kiểm tra mạng hoặc hỏi Giám thị." };
      }
    }

    if (valid) {
      // Khôi phục bài thi từ pausedExam
      const state = pausedExam;
      if (state) {
        if (state.examQuestions && state.examQuestions.length > 0) {
          setExamQuestions(state.examQuestions);
        }
        if (state.examPracticals && state.examPracticals.length > 0) {
          setExamPracticals(state.examPracticals);
        }
        if (state.userAnswers) setUserAnswers(state.userAnswers);
        if (state.userPracticalCode) setUserPracticalCode(state.userPracticalCode);
        if (state.practicalResults) setPracticalResults(state.practicalResults);
        if (typeof state.remainingSeconds === "number") setTimerSeconds(state.remainingSeconds);
        if (state.currentPart) setCurrentPart(state.currentPart);
        if (typeof state.currentQuestionIndex === "number") setCurrentIndex(state.currentQuestionIndex);
      }

      setIsExamActive(true);
      setIsPaused(false);
      setShowPauseModal(false);
      setShowResumeModal(false);
      return { success: true };
    }

    return { success: false, message: "Mã phòng thi không hợp lệ!" };
  };

  const handleSaveAndExit = () => {
    setIsExamActive(false);
    setIsPaused(false);
    setShowPauseModal(false);
    if (currentUser) {
      checkPausedExam(currentUser.id, selectedSubjectId);
    }
  };

  const handleCancelPausedExam = async () => {
    if (!currentUser) return;
    if (confirm("Em có chắc chắn muốn hủy bài thi đang tạm dừng không? Toàn bộ câu trả lời và code đã làm trước đó sẽ bị xóa để làm đề mới.")) {
      try {
        await fetch(`/api/pause?userId=${encodeURIComponent(currentUser.id)}&subjectId=${encodeURIComponent(selectedSubjectId)}`, {
          method: "DELETE"
        });
      } catch {}
      try {
        localStorage.removeItem(`SAOVIET_PAUSED_EXAM_${currentUser.id}_${selectedSubjectId}`);
      } catch {}
      setPausedExam(null);
    }
  };


  const handleAutoSubmit = () => {
    alert("Đã hết giờ làm bài! Hệ thống tự động chấm điểm bài thi.");
    calculateAndShowScore();
  };

  const handleManualSubmit = () => {
    setShowSubmitConfirmModal(true);
  };

  const calculateAndShowScore = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsExamActive(false);

    let mcqCorrect = 0;
    examQuestions.forEach((q) => {
      const uAns = userAnswers[q.id];
      if (uAns !== undefined && uAns !== null) {
        if (q.type === "single_choice" || q.type === "true_false" || !q.type) {
          if (String(uAns) === String(q.correct_answer)) mcqCorrect++;
        } else if (q.type === "multiple_choice") {
          if (Array.isArray(uAns) && Array.isArray(q.correct_answer)) {
            const sortedU = [...uAns].map(String).sort().join(",");
            const sortedC = [...q.correct_answer].map(String).sort().join(",");
            if (sortedU === sortedC) mcqCorrect++;
          }
        } else if (q.type === "fill_blank") {
          if (String(uAns).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase()) {
            mcqCorrect++;
          }
        } else if (q.type === "sequence_order") {
          if (Array.isArray(uAns) && Array.isArray(q.correct_order)) {
            if (uAns.map(String).join(",") === q.correct_order.map(String).join(",")) mcqCorrect++;
          }
        } else if (q.type === "matching") {
          if (uAns && typeof uAns === "object" && Array.isArray(q.pairs)) {
            const allMatched = q.pairs.every((pair: any, idx: number) => uAns[idx] === pair.right);
            if (allMatched) mcqCorrect++;
          }
        }
      }
    });

    let mcqScore = 0;
    let practicalScore = 0;

    if (examQuestions.length > 0 && examPracticals.length > 0) {
      // Đề hỗn hợp: 7 điểm trắc nghiệm + 3 điểm bài code thực hành
      mcqScore = (mcqCorrect / examQuestions.length) * 7.0;
      let pCount = 0;
      examPracticals.forEach((p) => {
        let pRes = practicalResults[p.id];
        if (!pRes) {
          const uCode = userPracticalCode[p.id];
          if (uCode && uCode.trim().length > 10 && !uCode.startsWith("# Viết mã nguồn")) {
            pRes = PythonEngine.gradeProblem(p.id, uCode);
          }
        }
        if (pRes && pRes.passed) pCount++;
      });
      practicalScore = (pCount / examPracticals.length) * 3.0;
    } else if (examQuestions.length > 0 && examPracticals.length === 0) {
      // Đề thi thuần lý thuyết: 100% trắc nghiệm (thang 10 điểm)
      mcqScore = (mcqCorrect / examQuestions.length) * 10.0;
    } else if (examPracticals.length > 0 && examQuestions.length === 0) {
      // Đề thi thuần thực hành: 100% bài code (thang 10 điểm)
      let pCount = 0;
      examPracticals.forEach((p) => {
        let pRes = practicalResults[p.id];
        if (!pRes) {
          const uCode = userPracticalCode[p.id];
          if (uCode && uCode.trim().length > 10 && !uCode.startsWith("# Viết mã nguồn")) {
            pRes = PythonEngine.gradeProblem(p.id, uCode);
          }
        }
        if (pRes && pRes.passed) pCount++;
      });
      practicalScore = (pCount / examPracticals.length) * 10.0;
    }

    const totalFinalScore = Number(Math.min(10, mcqScore + practicalScore).toFixed(2));
    const isPass = totalFinalScore >= 5.0;

    const certCode = isPass
      ? `SV-${currentUser?.branchId === "branch_thuduc" ? "TD" : currentUser?.branchId === "branch_quan1" ? "Q1" : "HCM"}-${Math.floor(100000 + Math.random() * 900000)}`
      : undefined;

    const examSettings = getExamSettings();
    let willLockSubject = false;
    let willLockAccount = false;

    // Check policies if user is student
    if (currentUser && currentUser.role === "student") {
      if (examSettings.autoLockSubjectOnPass && isPass) {
        willLockSubject = true;
        toggleUserSubject(currentUser.id, selectedSubjectId, false);
      }
      if (examSettings.autoLockAccountOnSubmit) {
        willLockAccount = true;
        setUserStatus(currentUser.id, "locked");
      }
    }

    const endDT = getCurrentVNDateTime();
    const session = getUserSession();
    const studentLoginTime = session?.loginTimeFormatted || (session?.loginTimestamp ? new Date(session.loginTimestamp).toLocaleTimeString("vi-VN") + " - " + new Date(session.loginTimestamp).toLocaleDateString("vi-VN") : endDT.full);
    const finalIp = clientNetworkIp || session?.ipAddress || "127.0.0.1 (Phòng Máy Lab)";

    const resData: ExamResult = {
      id: `exam_${Date.now()}`,
      userId: currentUser?.id || "anonymous",
      userName: currentUser?.fullName || "Học Viên",
      studentName: currentUser?.fullName || "Học Viên",
      studentClass: currentUser?.class || "Python Nâng Cao",
      branchId: currentUser?.branchId || "branch_thuduc",
      branchName: currentUser?.branchName || "Chi Nhánh Thủ Đức",
      subjectId: selectedSubjectId,
      score: totalFinalScore,
      totalScore: 10,
      totalQuestions: examQuestions.length + examPracticals.length,
      correctCount: mcqCorrect,
      mcqCorrect: mcqCorrect,
      mcqScore: mcqScore,
      practicalScore: practicalScore,
      timeSpentSeconds: 50 * 60 - timerSeconds,
      passed: isPass,
      certificateCode: certCode,
      completedDate: endDT.date,
      examDate: examStartDate || endDT.date,
      examStartTime: examStartTime || endDT.time,
      examEndTime: endDT.time,
      completedTime: endDT.time,
      loginTime: studentLoginTime,
      ipAddress: finalIp,
      clientIp: finalIp,
      networkDevice: typeof navigator !== "undefined" ? navigator.userAgent : "Web Client",
      // Chi tiết bài làm để tra cứu kiểm tra đúng/sai:
      questionsDetail: examQuestions,
      practicalsDetail: examPracticals,
      userAnswers: userAnswers,
      userPracticalCode: userPracticalCode,
      practicalResults: practicalResults,
      subjectLockedAfterExam: willLockSubject,
      accountLockedAfterExam: willLockAccount
    };

    // Save to MongoDB Atlas exam_results collection
    try {
      fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resData)
      }).catch(() => null);
    } catch {}

    // Xóa bài thi tạm dừng và bản lưu tự động khi đã nộp bài thành công
    if (currentUser) {
      try {
        fetch(`/api/pause?userId=${encodeURIComponent(currentUser.id)}&subjectId=${encodeURIComponent(selectedSubjectId)}`, {
          method: "DELETE"
        }).catch(() => null);
        localStorage.removeItem(`SAOVIET_PAUSED_EXAM_${currentUser.id}_${selectedSubjectId}`);
        clearExamAutoSave(currentUser.id, selectedSubjectId);
      } catch {}
      setPausedExam(null);
    }

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
      pageTitle="Phòng Thi Trực Tuyến Có Giám Sát"
      pageDescription="Học viên vui lòng đăng nhập bằng tài khoản được cấp để tham gia làm bài thi."
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

              <div style={{ display: "flex", gap: "0.35rem" }}>
                {DEFAULT_SUBJECTS.map((subj) => {
                  const isActive = selectedSubjectId === subj.id;
                  return (
                    <button
                      key={subj.id}
                      onClick={() => setSelectedSubjectId(subj.id)}
                      className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
                      style={{
                        borderRadius: "var(--radius-full)",
                        padding: "0.32rem 0.75rem",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        border: isActive ? "1.5px solid #1d4ed8" : "1.5px solid var(--border-medium)",
                        background: isActive ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "var(--surface-card)",
                        color: isActive ? "#ffffff" : "var(--text-primary)",
                        boxShadow: isActive ? "0 2px 8px rgba(37, 99, 235, 0.3)" : "none"
                      }}
                    >
                      <span>{subj.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <SubjectAccessGate subjectId={selectedSubjectId}>
              {/* BANNER TỰ ĐỘNG KHÔI PHỤC KHI BỊ SỰ CỐ / ĐƠ MÁY / MẤT MẠNG */}
              {detectedAutoSave && !isExamActive && (
                <div style={{
                  maxWidth: "640px",
                  margin: "0 auto 1.2rem auto",
                  background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                  border: "2px solid #2563eb",
                  borderRadius: "14px",
                  padding: "1.2rem 1.4rem",
                  textAlign: "left",
                  boxShadow: "0 8px 24px rgba(37, 99, 235, 0.18)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#1e40af", fontWeight: 800, fontSize: "0.98rem" }}>
                      <RotateCcw size={20} color="#2563eb" />
                      <span>PHÁT HIỆN BÀI THI BỊ GIÁN ĐOẠN (MẤT MẠNG HOẶC SỰ CỐ MÁY)</span>
                    </div>
                    <span style={{
                      background: "#2563eb",
                      color: "#ffffff",
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      fontSize: "0.72rem",
                      fontWeight: 800
                    }}>
                      Tự động lưu: {detectedAutoSave.savedDateTimeText || "Gần đây"}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.84rem", color: "#1e3a8a", margin: "0 0 0.85rem 0", lineHeight: "1.5" }}>
                    Hệ thống đã tự động lưu trữ an toàn toàn bộ bài làm của em:
                    <strong> {Object.keys(detectedAutoSave.userAnswers || {}).length} câu trắc nghiệm</strong>,
                    <strong> {Object.keys(detectedAutoSave.userPracticalCode || {}).filter(k => !!detectedAutoSave.userPracticalCode[Number(k)]).length} bài thực hành code</strong>.
                    Thời gian còn lại: <strong>{formatTimer(detectedAutoSave.remainingSeconds)}</strong>.
                  </p>

                  <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                    <button
                      onClick={handleRestoreFromAutoSave}
                      className="btn btn-primary"
                      style={{
                        flex: 2,
                        padding: "0.6rem 1rem",
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                        boxShadow: "0 3px 10px rgba(37, 99, 235, 0.35)",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <ShieldCheck size={16} />
                      <span>⚡ KHÔI PHỤC BÀI THI & LÀM TIẾP NGAY</span>
                    </button>

                    <button
                      onClick={handleDiscardAutoSave}
                      className="btn btn-secondary"
                      style={{
                        flex: 1,
                        padding: "0.6rem 0.8rem",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        justifyContent: "center",
                        color: "#dc2626"
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Hủy & Thi Mới</span>
                    </button>
                  </div>
                </div>
              )}

              {/* BANNER THÔNG BÁO BÀI THI ĐANG TẠM DỪNG / BẢO LƯU */}
              {pausedExam && (
                <div style={{
                  maxWidth: "640px",
                  margin: "0 auto 1.2rem auto",
                  background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                  border: "2px solid #f59e0b",
                  borderRadius: "14px",
                  padding: "1.1rem 1.3rem",
                  textAlign: "left",
                  boxShadow: "0 6px 18px rgba(245, 158, 11, 0.15)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.45rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "#b45309", fontWeight: 800, fontSize: "0.92rem" }}>
                      <Pause size={18} />
                      <span>BÀI THI ĐANG ĐƯỢC TẠM DỪNG (TIẾN TRÌNH BẢO LƯU)</span>
                    </div>
                    <span style={{
                      background: "#fef3c7",
                      color: "#92400e",
                      border: "1px solid #fde68a",
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      fontSize: "0.72rem",
                      fontWeight: 800
                    }}>
                      Lưu lúc: {pausedExam.pausedAt || pausedExam.pausedDate || "Gần đây"}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.82rem", color: "#78350f", margin: "0 0 0.8rem 0", lineHeight: "1.5" }}>
                    Hệ thống nhận diện em có một bài thi môn <strong>{currentSubject.name}</strong> đang được lưu lại. 
                    Thời gian làm bài còn lại: <strong style={{ color: "#d97706", fontFamily: "var(--font-mono, monospace)" }}>{formatTimer(pausedExam.remainingSeconds)}</strong>. 
                    Tiến độ: <strong>{Object.keys(pausedExam.userAnswers || {}).length}/{pausedExam.examQuestions?.length || 50} câu trắc nghiệm</strong> và <strong>{Object.keys(pausedExam.userPracticalCode || {}).length}/{pausedExam.examPracticals?.length || 4} bài tự luận</strong>.
                  </p>

                  <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                    <button
                      onClick={() => {
                        setResumeCodeInput("");
                        setResumeError("");
                        setShowResumeModal(true);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{
                        background: "linear-gradient(135deg, #d97706, #b45309)",
                        color: "#ffffff",
                        padding: "0.48rem 1.15rem",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                        borderRadius: "8px",
                        border: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 2px 8px rgba(217, 119, 6, 0.35)",
                        cursor: "pointer"
                      }}
                    >
                      <KeyRound size={15} />
                      <span>TIẾP TỤC BÀI THI NÀY (NHẬP MÃ V2)</span>
                    </button>

                    <button
                      onClick={handleCancelPausedExam}
                      className="btn btn-secondary btn-sm"
                      style={{
                        background: "#ffffff",
                        color: "#b91c1c",
                        border: "1.5px solid #fca5a5",
                        padding: "0.48rem 0.95rem",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                      title="Hủy kết quả cũ và bắt đầu làm đề thi mới hoàn toàn"
                    >
                      <Trash2 size={14} />
                      <span>Hủy Bài Tạm Dừng & Thi Mới</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="q-card" style={{ padding: "1.3rem 1.6rem", textAlign: "center", maxWidth: "640px", margin: "0 auto", border: "1.5px solid var(--border-light)", background: "var(--surface-card)", boxShadow: "var(--shadow-card)" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(14, 165, 233, 0.15))",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.75rem",
                  border: "1px solid rgba(37, 99, 235, 0.3)",
                  boxShadow: "0 0 16px rgba(37, 99, 235, 0.15)"
                }}>
                  <Clock size={22} />
                </div>


                <h1 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.35rem", color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
                  Kỳ Thi Đánh Giá Chuẩn Đầu Ra: {currentSubject.name}
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: "0.85rem", lineHeight: "1.5" }}>
                  Đề thi gồm <strong>50 câu trắc nghiệm</strong> (7.0 điểm) và <strong>4 bài tập thực hành code</strong> (3.0 điểm). 
                  Thời gian làm bài: <strong>50 phút</strong>. Đạt từ 5.0 điểm trở lên được cấp Chứng chỉ Sao Việt.
                </p>

                <div style={{
                  background: "var(--surface-subtle)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "10px",
                  padding: "0.65rem 0.95rem",
                  marginBottom: "0.95rem",
                  textAlign: "left",
                  fontSize: "0.78rem"
                }}>
                  <div style={{ fontWeight: 800, color: "var(--primary)", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <AlertCircle size={14} />
                    <span>Quy Định Phòng Thi Nghiêm Túc:</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", color: "var(--text-secondary)" }}>
                    <div>• Học viên cần có <strong>Mã Phòng Thi / Mã Kích Hoạt</strong> do Giám thị hoặc Giáo viên chi nhánh cấp.</div>
                    <div>• Không chuyển tab hoặc mở tài liệu ngoài phạm vi cho phép.</div>
                    <div>• Nếu gặp sự cố phòng máy, chọn <strong>Tạm Dừng Thi</strong> để Giáo viên nhập mã PIN mở khóa.</div>
                    <div>• Hết 50 phút hệ thống sẽ tự động thu bài và chấm điểm tức thời.</div>
                  </div>
                </div>

                {/* Exam Access Code Input */}
                <div style={{
                  background: "var(--surface-subtle)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  marginBottom: "1rem",
                  textAlign: "center"
                }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, color: "var(--primary)", marginBottom: "0.4rem" }}>
                    🔑 NHẬP MÃ PHÒNG THI / MÃ ĐỀ THI ĐỂ MỞ KHÓA:
                  </label>
                  <input
                    type="text"
                    value={examAccessCode}
                    onChange={(e) => { setExamAccessCode(e.target.value); setAccessError(""); }}
                    placeholder="Nhập mã thi (VD: SAOVIET2026, PYTHON2026 hoặc PIN 8888)"
                    style={{
                      width: "100%",
                      maxWidth: "380px",
                      padding: "0.55rem 0.85rem",
                      borderRadius: "8px",
                      border: "1.5px solid var(--border-medium)",
                      background: "var(--surface-card)",
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
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
                    <div style={{ color: "#ef4444", fontSize: "0.76rem", fontWeight: 700, marginTop: "0.4rem" }}>
                      {accessError}
                    </div>
                  )}
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                    (Mã chuẩn: <code>SAOVIET2026</code>, <code>PYTHON2026</code> hoặc PIN Giám thị: <code>8888</code>)
                  </div>

                  {clientNetworkIp && (
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "#2563eb",
                      background: "rgba(37, 99, 235, 0.08)",
                      border: "1px solid rgba(37, 99, 235, 0.25)",
                      padding: "0.2rem 0.65rem",
                      borderRadius: "6px",
                      marginTop: "0.6rem"
                    }}>
                      <Globe size={13} />
                      <span>IP mạng máy thi: <strong>{clientNetworkIp}</strong> (Khảo thí có giám sát)</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStartExam}
                  disabled={isVerifying}
                  className="btn btn-primary"
                  style={{
                    padding: "0.6rem 1.8rem",
                    fontSize: "0.86rem",
                    fontWeight: 800,
                    borderRadius: "9999px",
                    background: isVerifying
                      ? "#94a3b8"
                      : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#ffffff",
                    boxShadow: isVerifying ? "none" : "0 3px 14px rgba(37, 99, 235, 0.35)",
                    cursor: isVerifying ? "not-allowed" : "pointer",
                    opacity: isVerifying ? 0.8 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  <BookOpen size={16} />
                  <span>{isVerifying ? "Dang kiem tra ma..." : "XAC NHAN MA & VAO LAM BAI THI"}</span>
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
              padding: "0.55rem 1.1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              position: "sticky",
              top: "70px",
              zIndex: 30,
              boxShadow: "var(--shadow-card)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  {currentSubject.name}
                </span>
                <span style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: currentPart === 1 ? "var(--brand-primary)" : "var(--brand-emerald)",
                  background: currentPart === 1 ? "var(--brand-primary-light)" : "var(--brand-emerald-light)",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "var(--radius-full)"
                }}>
                  {currentPart === 1 ? `Phần 1: Trắc Nghiệm (${currentIndex + 1}/${examQuestions.length})` : `Phần 2: Tự Luận (${currentIndex + 1}/${examPracticals.length})`}
                </span>
                <span style={{
                  fontSize: "0.7rem",
                  color: "var(--text-secondary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "var(--surface-subtle)",
                  border: "1px solid var(--border-light)",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "5px"
                }} title="IP mạng phòng thi của thí sinh">
                  <Globe size={11} color="#2563eb" />
                  <span>IP: <strong>{clientNetworkIp || "127.0.0.1"}</strong></span>
                </span>

                {/* Badge trạng thái lưu & kết nối mạng */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "0.72rem",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "6px",
                  background: isNetworkOnline ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.18)",
                  border: isNetworkOnline ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(245, 158, 11, 0.4)"
                }}>
                  {isNetworkOnline ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#10b981", fontWeight: 700 }}>
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#10b981" }}></span>
                      <span>{lastAutoSavedTime ? `Đã tự lưu ${lastAutoSavedTime}` : "Tự động lưu an toàn"}</span>
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#d97706", fontWeight: 800 }}>
                      <WifiOff size={12} />
                      <span>Ngoại tuyến (Đã lưu vào máy)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Toast thông báo chống gian lận phòng thi */}
              {securityWarning && (
                <div style={{
                  position: "fixed",
                  top: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#b91c1c",
                  color: "#ffffff",
                  padding: "10px 22px",
                  borderRadius: "9999px",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  zIndex: 99999,
                  boxShadow: "0 8px 30px rgba(185, 28, 28, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <AlertCircle size={17} />
                  <span>{securityWarning}</span>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  color: timerSeconds < 300 ? "var(--brand-rose)" : "var(--brand-primary)"
                }}>
                  <Clock size={16} />
                  <span>{formatTimer(timerSeconds)}</span>
                </div>

                <button
                  onClick={handlePauseExam}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: "0.25rem", padding: "0.3rem 0.65rem", fontSize: "0.76rem" }}
                  title="Tạm dừng làm bài để gọi giáo viên"
                >
                  <Pause size={13} />
                  <span>Tạm Dừng</span>
                </button>

                <button
                  onClick={handleManualSubmit}
                  className="btn btn-primary btn-sm"
                  style={{ gap: "0.25rem", padding: "0.3rem 0.75rem", fontSize: "0.76rem" }}
                >
                  <span>Nộp Bài</span>
                </button>
              </div>
            </div>

            <div className="exam-layout-grid">
              <div>
                {currentPart === 1 && examQuestions[currentIndex] && (
                  <div>
                    <QuestionCard
                      key={examQuestions[currentIndex].id}
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

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.9rem" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem" }}
                        onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                      >
                        <ChevronLeft size={15} />
                        <span>Câu Trước</span>
                      </button>

                      <button
                        className="btn btn-primary btn-sm"
                        style={{ padding: "0.4rem 0.95rem", fontSize: "0.8rem" }}
                        onClick={() => {
                          if (currentIndex < examQuestions.length - 1) {
                            setCurrentIndex((prev) => prev + 1);
                          } else if (examPracticals.length > 0) {
                            setCurrentPart(2);
                            setCurrentIndex(0);
                          } else {
                            handleManualSubmit();
                          }
                        }}
                      >
                        <span>{currentIndex === examQuestions.length - 1 ? (examPracticals.length > 0 ? "Sang Phần Tự Luận Code" : "Hoàn Thành & Nộp Bài") : "Câu Tiếp Theo"}</span>
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {currentPart === 2 && examPracticals[currentIndex] && (
                  <div className="q-card" style={{ padding: "1.1rem 1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.5rem" }}>
                      <span className="q-badge" style={{ background: "rgba(5, 150, 105, 0.1)", color: "var(--brand-emerald)" }}>
                        TỰ LUẬN BÀI {currentIndex + 1} / {examPracticals.length}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Điểm tối đa: {examQuestions.length > 0 ? (3.0 / Math.max(1, examPracticals.length)).toFixed(2) : (10.0 / Math.max(1, examPracticals.length)).toFixed(2)} điểm / bài
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "0.45rem" }}>
                      {examPracticals[currentIndex]?.title}
                    </h3>

                    <p style={{ color: "var(--text-secondary)", marginBottom: "0.9rem", fontSize: "0.84rem", lineHeight: "1.5" }}>
                      {examPracticals[currentIndex]?.description}
                    </p>

                    <PythonEditor
                      key={examPracticals[currentIndex]?.id}
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

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", paddingTop: "0.9rem", borderTop: "1px solid var(--border-light)" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem" }}
                        onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                      >
                        <ChevronLeft size={15} />
                        <span>Bài Trước</span>
                      </button>

                      <button
                        className="btn btn-primary btn-sm"
                        style={{ padding: "0.4rem 0.95rem", fontSize: "0.8rem" }}
                        onClick={() => {
                          if (currentIndex < examPracticals.length - 1) setCurrentIndex((prev) => prev + 1);
                          else handleManualSubmit();
                        }}
                      >
                        <span>{currentIndex === examPracticals.length - 1 ? "Hoàn Thành & Nộp Bài" : "Bài Kế Tiếp"}</span>
                        <ChevronRight size={15} />
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

        {/* MODAL TẠM DỪNG BÀI THI & MỞ KHÓA TẠI CHỖ HOẶC THOÁT RA */}
        {showPauseModal && (
          <ExamPauseModal
            remainingSeconds={timerSeconds}
            subjectName={currentSubject.name}
            subjectId={selectedSubjectId}
            branchId={currentUser?.branchId || "branch_thuduc"}
            answeredCount={Object.keys(userAnswers).length + Object.keys(userPracticalCode).length}
            totalQuestions={examQuestions.length + examPracticals.length}
            onResumeWithCode={handleResumeWithCode}
            onSaveAndExit={handleSaveAndExit}
            onCancel={() => {
              setIsPaused(false);
              setShowPauseModal(false);
            }}
          />
        )}

        {/* MODAL TIẾP TỤC BÀI THI TẠM DỪNG BẰNG MÃ V2 KHI VÀO LẠI PHÒNG THI */}
        {showResumeModal && pausedExam && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
            padding: "1rem"
          }}>
            <div style={{
              background: "var(--surface-card, #ffffff)",
              borderRadius: "16px",
              border: "1.5px solid var(--border-medium, #cbd5e1)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
              maxWidth: "480px",
              width: "100%",
              padding: "1.5rem 1.6rem"
            }}>
              <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(14, 165, 233, 0.15))",
                  color: "#2563eb",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.75rem",
                  border: "1px solid rgba(37, 99, 235, 0.3)"
                }}>
                  <KeyRound size={24} />
                </div>

                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: 0 }}>
                  Mở Khóa Tiếp Tục Bài Thi
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748b)", margin: "0.25rem 0 0" }}>
                  Môn thi: <strong>{currentSubject.name}</strong> • Còn lại: <strong>{formatTimer(pausedExam.remainingSeconds)}</strong>
                </p>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsResuming(true);
                setResumeError("");
                const res = await handleResumeWithCode(resumeCodeInput);
                if (!res.success) {
                  setResumeError(res.message || "Mã phòng thi không chính xác hoặc đã hết hạn!");
                }
                setIsResuming(false);
              }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    🔑 Nhập Mã Phòng Thi Mới (Mã v2) do Giám Thị cấp hôm nay:
                  </label>
                  <input
                    type="text"
                    value={resumeCodeInput}
                    onChange={(e) => {
                      setResumeCodeInput(e.target.value);
                      setResumeError("");
                    }}
                    placeholder="Nhập mã v2 (VD: SAOVIET2026, PYTHON2026 hoặc 8888)"
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.85rem",
                      borderRadius: "8px",
                      border: "1.5px solid var(--border-medium, #cbd5e1)",
                      background: "var(--surface-card, #ffffff)",
                      color: "var(--text-primary, #0f172a)",
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      textAlign: "center",
                      letterSpacing: "0.05em",
                      outline: "none"
                    }}
                  />
                  <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.3rem" }}>
                    (Học viên liên hệ Giáo viên/Giám thị phòng máy để nhận Mã phòng thi mới để mở khóa thi tiếp)
                  </div>
                </div>

                {resumeError && (
                  <div style={{
                    background: "#fef2f2",
                    border: "1px solid #fecdd3",
                    color: "#b91c1c",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "7px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    marginBottom: "1rem",
                    textAlign: "center"
                  }}>
                    {resumeError}
                  </div>
                )}

                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button
                    type="button"
                    onClick={() => setShowResumeModal(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: "0.55rem", fontSize: "0.8rem", fontWeight: 700, justifyContent: "center" }}
                  >
                    Đóng
                  </button>

                  <button
                    type="submit"
                    disabled={isResuming}
                    className="btn btn-primary"
                    style={{
                      flex: 2,
                      padding: "0.55rem",
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      justifyContent: "center",
                      gap: "6px",
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      boxShadow: "0 2px 6px rgba(37, 99, 235, 0.3)"
                    }}
                  >
                    <ShieldCheck size={15} />
                    <span>{isResuming ? "Đang xác thực..." : "XÁC NHẬN & TIẾP TỤC THI"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {showSubmitConfirmModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(10, 15, 30, 0.85)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "1rem"
            }}
          >
            <div
              style={{
                background: "var(--card-bg, #111827)",
                border: "1px solid var(--border-color, #374151)",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "500px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                overflow: "hidden",
                animation: "fadeIn 0.2s ease-out"
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
                  padding: "1.25rem 1.5rem",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Award size={24} style={{ color: "#fbbf24" }} />
                  <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800 }}>Xác Nhận Nộp Toàn Bộ Bài Thi</h3>
                </div>
                <button
                  onClick={() => setShowSubmitConfirmModal(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    padding: "4px 8px",
                    fontSize: "0.9rem"
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: "1.5rem" }}>
                <p style={{ margin: "0 0 1rem 0", color: "var(--text-secondary, #9ca3af)", fontSize: "0.9rem" }}>
                  Em có chắc chắn muốn kết thúc bài thi và nộp kết quả ngay bây giờ không?
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--border-color, rgba(255, 255, 255, 0.1))",
                    borderRadius: "10px",
                    padding: "12px",
                    marginBottom: "1rem"
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary, #9ca3af)", textTransform: "uppercase", fontWeight: 700 }}>
                      Trắc nghiệm
                    </div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#38bdf8", marginTop: "2px" }}>
                      {examQuestions.filter(q => userAnswers[q.id] !== undefined && userAnswers[q.id] !== null && userAnswers[q.id] !== "").length} / {examQuestions.length}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-secondary, #6b7280)" }}>câu đã trả lời</div>
                  </div>

                  <div style={{ textAlign: "center", borderLeft: "1px solid var(--border-color, rgba(255, 255, 255, 0.1))" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary, #9ca3af)", textTransform: "uppercase", fontWeight: 700 }}>
                      Thực hành Code
                    </div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#10b981", marginTop: "2px" }}>
                      {examPracticals.filter(p => (userPracticalCode[p.id] || "").trim().length > 0).length} / {examPracticals.length}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-secondary, #6b7280)" }}>bài đã viết code</div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    marginBottom: "1.25rem",
                    color: "#f59e0b",
                    fontSize: "0.82rem"
                  }}
                >
                  <Clock size={16} style={{ flexShrink: 0 }} />
                  <span>Thời gian còn lại: <strong>{formatTimer(timerSeconds)}</strong>. Sau khi nộp bài, em sẽ không thể thay đổi câu trả lời.</span>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setShowSubmitConfirmModal(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: "0.65rem", fontSize: "0.85rem", fontWeight: 700, justifyContent: "center" }}
                  >
                    Quay Lại Làm Tiếp
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmitConfirmModal(false);
                      calculateAndShowScore();
                    }}
                    className="btn btn-primary"
                    style={{
                      flex: 1.2,
                      padding: "0.65rem",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      justifyContent: "center",
                      gap: "6px",
                      background: "linear-gradient(135deg, #059669, #047857)",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(5, 150, 105, 0.35)"
                    }}
                  >
                    <Award size={16} />
                    <span>XÁC NHẬN NỘP BÀI</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
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
