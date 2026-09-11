export interface ExamAutoSaveData {
  examId: string;
  userId: string;
  userName: string;
  subjectId: string;
  branchId?: string;
  examAccessCode: string;
  currentPart: 1 | 2;
  currentIndex: number;
  userAnswers: Record<number, any>;
  userPracticalCode: Record<number, string>;
  practicalResults: Record<number, any>;
  examQuestions: any[];
  examPracticals: any[];
  remainingSeconds: number;
  totalDurationSeconds: number;
  savedTimestamp: number;
  savedDateTimeText: string;
}

const AUTOSAVE_PREFIX = "SAOVIET_EXAM_AUTOSAVE_";

export function getAutoSaveStorageKey(userId: string, subjectId: string): string {
  return `${AUTOSAVE_PREFIX}${userId}_${subjectId}`;
}

export function saveExamAutoSave(data: ExamAutoSaveData): boolean {
  if (typeof window === "undefined" || !data.userId) return false;
  try {
    const key = getAutoSaveStorageKey(data.userId, data.subjectId);
    const payload: ExamAutoSaveData = {
      ...data,
      savedTimestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(payload));
    return true;
  } catch (e) {
    console.warn("Auto-save to localStorage failed:", e);
    return false;
  }
}

export function getExamAutoSave(userId: string, subjectId: string): ExamAutoSaveData | null {
  if (typeof window === "undefined" || !userId) return null;
  try {
    const key = getAutoSaveStorageKey(userId, subjectId);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data: ExamAutoSaveData = JSON.parse(raw);

    if (data.savedTimestamp && data.remainingSeconds > 0) {
      const elapsedSeconds = Math.max(0, Math.floor((Date.now() - data.savedTimestamp) / 1000));
      data.remainingSeconds = Math.max(10, data.remainingSeconds - elapsedSeconds);
    }

    if (data.remainingSeconds <= 0) {
      clearExamAutoSave(userId, subjectId);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export function hasValidAutoSave(userId: string, subjectId: string): boolean {
  const data = getExamAutoSave(userId, subjectId);
  return !!(data && data.examQuestions && data.examQuestions.length > 0 && data.remainingSeconds > 0);
}

export function clearExamAutoSave(userId: string, subjectId: string): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    const key = getAutoSaveStorageKey(userId, subjectId);
    localStorage.removeItem(key);
  } catch {}
}
