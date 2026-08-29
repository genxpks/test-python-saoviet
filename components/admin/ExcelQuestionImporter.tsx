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
  HelpCircle, 
  Layers, 
  ArrowRight,
  ClipboardPaste,
  FileCode2,
  Sparkles,
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
  const [selectedSubject, setSelectedSubject] = useState(currentSubjectId || "python_advanced");
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

  // 3. Xử lý khi dán bảng tính từ Excel (TSV / Clipboard)
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
        if (parts.length < 3) return; // Bỏ qua dòng quá ngắn

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
        alert(`🎉 Thành công! Đã nạp ${data.inserted_count} câu hỏi vào CSDL MongoDB Atlas.`);
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
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: "960px", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem", marginBottom: "1.2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ padding: "0.5rem", background: "rgba(16, 185, 129, 0.1)", borderRadius: "var(--radius-md)", color: "var(--brand-emerald)" }}>
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Nhập Câu Hỏi Hàng Loạt Từ Excel</h3>
              <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--text-muted)" }}>
                Hỗ trợ import định dạng .xlsx, .csv và dán trực tiếp từ bảng tính cho 6 dạng câu hỏi.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: "0.4rem" }}>
            <X size={18} />
          </button>
        </div>

        {/* Cấu hình Target Subject & Branch */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem", background: "var(--bg-light)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
              1. Chọn Môn Học / Ngôn Ngữ:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input"
              style={{ width: "100%", fontWeight: 600 }}
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
              2. Áp dụng cho Chi Nhánh:
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="input"
              style={{ width: "100%", fontWeight: 600 }}
            >
              <option value="all">🌐 Toàn bộ Chi nhánh (Ngân hàng chung)</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>🏢 {b.name} ({b.code})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab chuyển đổi File / Paste */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button
            onClick={() => setMode("file")}
            className={`btn ${mode === "file" ? "btn-primary" : "btn-secondary"} btn-sm`}
          >
            <Upload size={15} />
            <span>Kéo Thả / Tải File .xlsx</span>
          </button>
          <button
            onClick={() => setMode("paste")}
            className={`btn ${mode === "paste" ? "btn-primary" : "btn-secondary"} btn-sm`}
          >
            <ClipboardPaste size={15} />
            <span>Dán Trực Tiếp Bảng Tính Excel</span>
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={handleDownloadTemplate}
            className="btn btn-secondary btn-sm"
            style={{ color: "var(--brand-emerald)", borderColor: "var(--brand-emerald)" }}
          >
            <Download size={15} />
            <span>📄 Tải File Excel Mẫu Chuẩn</span>
          </button>
        </div>

        {/* Khu vực Upload File */}
        {mode === "file" ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed var(--border-medium)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
              background: file ? "rgba(16, 185, 129, 0.05)" : "var(--bg-card)",
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
            <Upload size={36} color={file ? "var(--brand-emerald)" : "var(--text-muted)"} style={{ margin: "0 auto 0.5rem" }} />
            {file ? (
              <div>
                <p style={{ fontWeight: 800, color: "var(--brand-emerald)", fontSize: "1rem", margin: "0 0 0.2rem" }}>
                  Đã nạp file: {file.name}
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                  Dung lượng: {(file.size / 1024).toFixed(1)} KB • Nhấn để chọn file khác
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", margin: "0 0 0.3rem" }}>
                  Nhấp vào đây hoặc kéo thả file Excel (.xlsx, .csv) vào khung này
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                  Hệ thống tự động đọc cấu trúc 6 dạng câu hỏi và đối chiếu đáp án.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Bôi đen các ô trong Excel -> Nhấn Ctrl+C -> Nhấn Ctrl+V dán vào đây..."
              rows={6}
              className="input"
              style={{ width: "100%", fontFamily: "monospace", fontSize: "0.85rem" }}
            />
            <button
              onClick={handleParsePaste}
              className="btn btn-primary btn-sm"
              style={{ marginTop: "0.5rem" }}
              disabled={isParsing || !pasteText.trim()}
            >
              <RefreshCw size={14} className={isParsing ? "spin" : ""} />
              <span>Phân Tích Dữ Liệu Dán</span>
            </button>
          </div>
        )}

        {/* Thông báo Lỗi nếu có */}
        {errors.length > 0 && (
          <div style={{ marginTop: "1rem", padding: "0.85rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "var(--radius-md)", color: "#b91c1c", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              <AlertTriangle size={16} />
              <span>Phát hiện {errors.length} cảnh báo / lỗi định dạng:</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
              {errors.slice(0, 5).map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
              {errors.length > 5 && <li>... và {errors.length - 5} cảnh báo khác.</li>}
            </ul>
          </div>
        )}

        {/* Bảng Preview Câu Hỏi */}
        {parsedQuestions.length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CheckCircle2 size={18} color="var(--brand-emerald)" />
                <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>
                  Xem trước: Đã đọc được {parsedQuestions.length} câu hỏi hợp lệ
                </span>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", cursor: "pointer", color: "var(--text-secondary)" }}>
                <input
                  type="checkbox"
                  checked={overwrite}
                  onChange={(e) => setOverwrite(e.target.checked)}
                />
                <span>Xóa các câu hỏi cũ của môn này trước khi nạp mới</span>
              </label>
            </div>

            <div style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
              <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-light)", borderBottom: "1px solid var(--border-light)", textAlign: "left" }}>
                    <th style={{ padding: "0.5rem 0.8rem", width: "40px" }}>STT</th>
                    <th style={{ padding: "0.5rem 0.8rem", width: "130px" }}>Dạng Câu</th>
                    <th style={{ padding: "0.5rem 0.8rem" }}>Nội Dung Đề Bài</th>
                    <th style={{ padding: "0.5rem 0.8rem", width: "90px" }}>Đáp Án</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedQuestions.map((q, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "0.5rem 0.8rem", fontWeight: 700 }}>{idx + 1}</td>
                      <td style={{ padding: "0.5rem 0.8rem" }}>
                        <span className="badge badge-primary" style={{ fontSize: "0.72rem" }}>
                          {q.type}
                        </span>
                      </td>
                      <td style={{ padding: "0.5rem 0.8rem", color: "var(--text-primary)" }}>
                        {q.question.slice(0, 85)}{q.question.length > 85 ? "..." : ""}
                      </td>
                      <td style={{ padding: "0.5rem 0.8rem", fontWeight: 700, color: "var(--brand-emerald-dark)" }}>
                        {JSON.stringify(q.correct_answer)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem", marginTop: "1.5rem", borderTop: "1px solid var(--border-light)", paddingTop: "1rem" }}>
          <button onClick={onClose} className="btn btn-secondary">
            Hủy Bỏ
          </button>
          <button
            onClick={handleSubmitToDatabase}
            disabled={parsedQuestions.length === 0 || isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-emerald))" }}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={16} className="spin" />
                <span>Đang Nạp Vào MongoDB...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Nạp {parsedQuestions.length} Câu Vào Database</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
