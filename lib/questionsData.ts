// lib/questionsData.ts - Quản Lý Ngân Hàng Câu Hỏi & Bài Tập Thực Hành (Dữ Liệu Động Từ Database)
// Đơn vị: HỆ THỐNG ĐÀO TẠO TIN HỌC SAO VIỆT TP. THỦ ĐỨC

import { Question, PracticalProblem } from "@/types";

export const QUESTIONS_DATA: Question[] = [];
export const PRACTICAL_DATA: PracticalProblem[] = [];

const CUSTOM_QUESTIONS_KEY = "NEXT_SAOVIET_CUSTOM_QUESTIONS";
const CUSTOM_PRACTICALS_KEY = "NEXT_SAOVIET_CUSTOM_PRACTICALS";

export function getQuestionsData(): Question[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
    if (!raw) return [];
    const parsed: Question[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(q => ({ ...q, subjectId: q.subjectId || "python" })) : [];
  } catch (e) {
    return [];
  }
}

export function saveAllQuestions(questions: Question[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(questions));
  } catch (e) {}
}

export function addQuestionData(q: Omit<Question, "id"> & { id?: number }): Question {
  const list = getQuestionsData();
  const newQ: Question = {
    ...q,
    subjectId: q.subjectId || "python",
    id: q.id || (list.length > 0 ? Math.max(...list.map(x => x.id)) + 1 : 1)
  };
  list.push(newQ);
  saveAllQuestions(list);
  return newQ;
}

export function updateQuestionData(id: number, updated: Partial<Question>): boolean {
  const list = getQuestionsData();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return false;
  list[idx] = { ...list[idx], ...updated };
  saveAllQuestions(list);
  return true;
}

export function deleteQuestionData(id: number): boolean {
  const list = getQuestionsData();
  const initialLen = list.length;
  const filtered = list.filter(x => x.id !== id);
  if (filtered.length === initialLen) return false;
  saveAllQuestions(filtered);
  return true;
}

export function getPracticalsData(): PracticalProblem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_PRACTICALS_KEY);
    if (!raw) return [];
    const parsed: PracticalProblem[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(p => ({ ...p, subjectId: p.subjectId || "python" })) : [];
  } catch (e) {
    return [];
  }
}

export function saveAllPracticals(practicals: PracticalProblem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_PRACTICALS_KEY, JSON.stringify(practicals));
  } catch (e) {}
}

export function addPracticalData(p: Omit<PracticalProblem, "id"> & { id?: number }): PracticalProblem {
  const list = getPracticalsData();
  const newP: PracticalProblem = {
    ...p,
    id: p.id || (list.length > 0 ? Math.max(...list.map(x => x.id)) + 1 : 1)
  };
  list.push(newP);
  saveAllPracticals(list);
  return newP;
}

export function updatePracticalData(id: number, updated: Partial<PracticalProblem>): boolean {
  const list = getPracticalsData();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return false;
  list[idx] = { ...list[idx], ...updated };
  saveAllPracticals(list);
  return true;
}

export function deletePracticalData(id: number): boolean {
  const list = getPracticalsData();
  const initialLen = list.length;
  const filtered = list.filter(x => x.id !== id);
  if (filtered.length === initialLen) return false;
  saveAllPracticals(filtered);
  return true;
}
