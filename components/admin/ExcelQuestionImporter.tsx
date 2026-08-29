"use client";

import { useState, useRef } from "react";
import { Question, Subject, Branch } from "@/types";
import { ExcelHelper } from "@/lib/excelHelper";
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  Layers, 
  ClipboardPaste,
  FileCode2,
  Info
} from "lucide-react";

interface ExcelQuestionImporterProps {
  subjects: Subject[];
  branches: Branch[];
  currentSubjectId: string;
  onImportSuccess: (count: number) => void;
  onClose: () => void;
}

export default function ExcelQuestionImporter({
  subjects,
  branches,
  currentSubjectId,
  onImportSuccess,
  onClose
}: ExcelQuestionImporterProps) {
  const [selectedSubject, setSelectedSubject] = useState(currentSubjectId || "python");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [overwrite, setOverwrite] = useState(false);
  const [mode, setMode] = useState<"file" | "paste">("file");

  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Paste Text State
  const [pasteText, setPasteText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Tải File Mẫu Excel
  const handleDownloadTemplate = () => {
    window.open("/api/questions/template-excel", "_blank");
  };

  // 2. Xử lý khi chọn file Excel
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setIsParsing(true);
    setErrors([]);

    try {
      const buffer = await selected.arrayBuffer();
      const res = ExcelHelper.parseExcelToQuestions(buffer, selectedSubject);

      setParsedQuestions(res.questions);
      setErrors(res.errors);
    } catch (err: any) {
      setErrors([`Lỗi khi đọc file Excel: ${err.message}`]);
      setParsedQuestions([]);
    } finally {
      setIsParsing(false);
    }
  };

  // 3. Xử lý khi dán bảng tính từ Excel
  const handleParsePaste = () => {
    if (!pasteText.trim()) {
      setErrors(["Vui lòng dán dữ liệu bảng tính từ Excel trước khi bấm phân tích."]);
      return;
    }

    setIsParsing(true);
    setErrors([]);

    try {
      const lines = pasteText.trim().split("\n");
      const questions: Question[] = [];
      const parseErrors: string[] = [];

      lines.forEach((line, idx) => {
        const parts = line.split("\t");
        if (parts.length < 3) return;

        const qTypeRaw = (parts[1] || "single_choice").trim().toLowerCase();
        const qContent = (parts[2] || "").trim();
        if (!qContent) return;

        let qType: any = "single_choice";
        if (qTypeRaw.includes("true") || qTypeRaw.includes("dung")) qType = "true_false";
        else if (qTypeRaw.includes("multi") || qTypeRaw.includes("nhieu")) qType = "multiple_choice";
        else if (qTypeRaw.includes("fill") || qTypeRaw.includes("dien")) qType = "fill_blank";
        else if (qTypeRaw.includes("seq") || qTypeRaw.includes("sap_xep")) qType = "sequence_order";
        else if (qTypeRaw.includes("match") || qTypeRaw.includes("noi")) qType = "matching";

        const optA = (parts[3] || "").trim();
        const optB = (parts[4] || "").trim();
        const optC = (parts[5] || "").trim();
        const optD = (parts[6] || "").trim();
        const rawAns = (parts[7] || "A").trim();
        const exp = (parts[8] || "Đáp án chuẩn theo giáo trình.").trim();

        const qObj: Question = {
          id: Date.now() + idx,
          subjectId: selectedSubject,
          branchId: selectedBranch,
          moduleId: 1,
          type: qType,
          type_name: qType === "single_choice" ? "Trắc nghiệm ABCD" : qType,
          question: qContent,
          options: [optA, optB, optC, optD].filter(Boolean),
          explanation: exp,
          difficulty: "medium"
        };

        const upper = rawAns.toUpperCase();
        if (upper === "A" || upper === "0" || upper === "1") qObj.correct_answer = 0;
        else if (upper === "B" || upper === "1" || upper === "2") qObj.correct_answer = 1;
        else if (upper === "C" || upper === "2" || upper === "3") qObj.correct_answer = 2;
        else if (upper === "D" || upper === "3" || upper === "4") qObj.correct_answer = 3;
        else qObj.correct_answer = 0;

        questions.push(qObj);
      });

      setParsedQuestions(questions);
      setErrors(parseErrors);
    } catch (err: any) {
      setErrors([`Lỗi khi dán dữ liệu: ${err.message}`]);
    } finally {
      setIsParsing(false);
    }
  };

  // 4. Gửi dữ liệu nạp vào MongoDB
  const handleSubmitToDatabase = async () => {
    if (parsedQuestions.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/questions/import-excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: parsedQuestions.map(q => ({
            ...q,
            subjectId: selectedSubject,
            branchId: selectedBranch
          })),
          subjectId: selectedSubject,
          branchId: selectedBranch,
          overwrite: overwrite
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(`🎉 Thành công! Đã nạp ${data.inserted_count} câu hỏi vào CSDL cho môn ${selectedSubject.toUpperCase()}.`);
        onImportSuccess(data.inserted_count);
        onClose();
      } else {
        alert(`❌ Lỗi: ${data.message}`);
      }
    } catch (err: any) {
      alert(`❌ Lỗi kết nối: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.6)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div style={{
        background: "#ffffff",
        color: "#0f172a",
        maxWidth: "960px",
        width: "100%",
        maxHeight: "92vh",
        overflowY: "auto",
        padding: "2rem",
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)",
        position: "relative"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem", marginBottom: "1.2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Nạp Bộ Câu Hỏi & Đề Thi Hàng Loạt Từ Excel
              </h3>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: "#64748b" }}>
                Hỗ trợ import định dạng .xlsx, .csv và dán trực tiếp từ bảng tính cho 6 dạng câu hỏi trắc nghiệm.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748b"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Target Subject & Branch */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem", background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
              1. Chọn Môn Học Đích: *
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: "0.85rem"
              }}
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
              2. Áp Dụng Cho Chi Nhánh:
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontWeight: 600,
                fontSize: "0.85rem"
              }}
            >
              <option value="all">🌐 Toàn bộ Chi nhánh (Ngân hàng chung)</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>🏢 {b.name} ({b.code})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={() => setMode("file")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.55rem 1rem",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: mode === "file" ? "#2563eb" : "#cbd5e1",
              background: mode === "file" ? "#eff6ff" : "#ffffff",
              color: mode === "file" ? "#1d4ed8" : "#475569",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer"
            }}
          >
            <Upload size={15} />
            <span>Kéo Thả / Tải File .xlsx</span>
          </button>
          <button
            onClick={() => setMode("paste")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.55rem 1rem",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: mode === "paste" ? "#2563eb" : "#cbd5e1",
              background: mode === "paste" ? "#eff6ff" : "#ffffff",
              color: mode === "paste" ? "#1d4ed8" : "#475569",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer"
            }}
          >
            <ClipboardPaste size={15} />
            <span>Dán Trực Tiếp Từ Excel</span>
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={handleDownloadTemplate}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.55rem 1rem",
              borderRadius: "8px",
              border: "1px solid #10b981",
              background: "#ecfdf5",
              color: "#059669",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer"
            }}
          >
            <Download size={15} />
            <span>📄 Tải File Excel Mẫu Chuẩn</span>
          </button>
        </div>

        {/* Upload File Zone */}
        {mode === "file" ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed #cbd5e1",
              borderRadius: "16px",
              padding: "2.5rem 1.5rem",
              textAlign: "center",
              cursor: "pointer",
              background: file ? "#ecfdf5" : "#f8fafc",
              transition: "all 0.2s"
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx, .xls, .csv"
              style={{ display: "none" }}
            />
            <Upload size={38} color={file ? "#059669" : "#94a3b8"} style={{ margin: "0 auto 0.6rem" }} />
            {file ? (
              <div>
                <p style={{ fontWeight: 800, color: "#059669", fontSize: "1rem", margin: "0 0 0.2rem" }}>
                  Đã chọn file: {file.name}
                </p>
                <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                  Dung lượng: {(file.size / 1024).toFixed(1)} KB • Nhấp để đổi file khác
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#334155", margin: "0 0 0.25rem" }}>
                  Nhấp để tải file Excel hoặc kéo thả vào đây
                </p>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: 0 }}>
                  Hỗ trợ các định dạng .xlsx, .xls hoặc .csv
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <textarea
              rows={6}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Copy dữ liệu từ bảng tính Excel và dán (Ctrl + V) vào đây..."
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontFamily: "var(--font-mono)",
                fontSize: "0.84rem",
                background: "#ffffff",
                color: "#0f172a"
              }}
            />
            <button
              onClick={handleParsePaste}
              style={{
                marginTop: "0.5rem",
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                border: "none",
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer"
              }}
            >
              Phân Tích Dữ Liệu Dán
            </button>
          </div>
        )}

        {/* Parsing / Errors / Preview */}
        {isParsing && (
          <div style={{ textAlign: "center", padding: "1rem", color: "#2563eb", fontWeight: 700 }}>
            ⏳ Đang phân tích dữ liệu câu hỏi...
          </div>
        )}

        {errors.length > 0 && (
          <div style={{ marginTop: "1rem", padding: "0.85rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", color: "#b91c1c", fontSize: "0.82rem" }}>
            <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>⚠️ Có lỗi khi phân tích file:</div>
            {errors.map((err, i) => <div key={i}>• {err}</div>)}
          </div>
        )}

        {parsedQuestions.length > 0 && (
          <div style={{ marginTop: "1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
              <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#059669" }}>
                ✅ Đã phân tích thành công: {parsedQuestions.length} câu hỏi hợp lệ
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#475569", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={overwrite}
                  onChange={(e) => setOverwrite(e.target.checked)}
                  style={{ accentColor: "#2563eb" }}
                />
                <span>Xóa câu hỏi cũ cùng môn trước khi nạp</span>
              </label>
            </div>

            <div style={{ maxHeight: "220px", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                <thead style={{ background: "#f1f5f9", textAlign: "left", position: "sticky", top: 0 }}>
                  <tr>
                    <th style={{ padding: "0.5rem 0.75rem" }}>#</th>
                    <th style={{ padding: "0.5rem 0.75rem" }}>Dạng</th>
                    <th style={{ padding: "0.5rem 0.75rem" }}>Nội Dung Câu Hỏi</th>
                    <th style={{ padding: "0.5rem 0.75rem" }}>Đáp Án</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedQuestions.map((q, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.45rem 0.75rem", fontWeight: 700 }}>{i + 1}</td>
                      <td style={{ padding: "0.45rem 0.75rem" }}>
                        <span style={{ padding: "0.1rem 0.4rem", borderRadius: "4px", background: "#eff6ff", color: "#1d4ed8", fontSize: "0.72rem", fontWeight: 700 }}>
                          {q.type}
                        </span>
                      </td>
                      <td style={{ padding: "0.45rem 0.75rem" }}>{q.question}</td>
                      <td style={{ padding: "0.45rem 0.75rem", fontWeight: 700, color: "#059669" }}>
                        {JSON.stringify(q.correct_answer)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "0.65rem 1.25rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitToDatabase}
                style={{
                  padding: "0.65rem 1.4rem",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #059669, #047857)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <CheckCircle2 size={16} />
                <span>{isSubmitting ? "Đang nạp vào CSDL..." : `Nạp ${parsedQuestions.length} Câu Vào Môn ${selectedSubject.toUpperCase()}`}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
