"use client";

import { Question, PracticalProblem } from "@/types";

interface PrintExamSheetProps {
  questions: Question[];
  practicals: PracticalProblem[];
  showAnswers?: boolean;
  title?: string;
}

export default function PrintExamSheet({
  questions,
  practicals,
  showAnswers = false,
  title = "ĐỀ THI TỐT NGHIỆP LẬP TRÌNH PYTHON NÂNG CAO"
}: PrintExamSheetProps) {
  return (
    <div className="print-exam-wrapper" style={{ background: "#ffffff", padding: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
      {/* School Header Banner */}
      <div className="print-header-banner" style={{ textAlign: "center", borderBottom: "2px solid #000000", paddingBottom: "10px", marginBottom: "16px" }}>
        <h4 style={{ fontSize: "11pt", fontWeight: 700, margin: 0, textTransform: "uppercase" }}>
          TRUNG TÂM ĐÀO TẠO TIN HỌC SAO VIỆT — CHI NHÁNH THỦ ĐỨC
        </h4>
        <h2 style={{ fontSize: "14pt", fontWeight: 800, margin: "6px 0", textTransform: "uppercase" }}>
          {title}
        </h2>
        <p style={{ fontSize: "9.5pt", fontStyle: "italic", margin: 0 }}>
          Thời gian làm bài: 90 Phút (50 Phút Trắc Nghiệm + 40 Phút Tự Luận Thực Hành)
        </p>
      </div>

      {/* Student Info Box */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", border: "1px solid #000000", padding: "8px 12px", marginBottom: "16px", fontSize: "10pt" }}>
        <div>
          <div>Họ và tên học viên: ........................................................................</div>
          <div style={{ marginTop: "4px" }}>Lớp: .................................... Ngày sinh: ..... / ..... / .........</div>
        </div>
        <div style={{ borderLeft: "1px solid #000000", paddingLeft: "12px" }}>
          <div>Điểm Trắc Nghiệm: ............ / 5.0</div>
          <div style={{ marginTop: "4px" }}>Điểm Tự Luận: ............ / 5.0</div>
          <div style={{ marginTop: "4px", fontWeight: 700 }}>TỔNG ĐIỂM: ............ / 10.0</div>
        </div>
      </div>

      {/* Part 1: Multiple Choice Questions */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #000", paddingBottom: "4px", marginBottom: "12px" }}>
          PHẦN 1: TRẮC NGHIỆM ({questions.length} CÂU — 5.0 ĐIỂM)
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {questions.map((q, idx) => (
            <div key={q.id} className="print-card" style={{ pageBreakInside: "avoid", fontSize: "9.5pt", lineHeight: "1.4" }}>
              <div style={{ fontWeight: 700 }}>
                Câu {idx + 1} [{q.type_name}]: {q.question}
              </div>

              {/* Options */}
              {q.options && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", marginTop: "4px", paddingLeft: "8px" }}>
                  {q.options.map((opt, oIdx) => {
                    const label = ["A", "B", "C", "D"][oIdx];
                    return (
                      <div key={oIdx}>
                        {label}. {opt}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Fill in blank line */}
              {q.type === "fill_blank" && (
                <div style={{ marginTop: "4px", paddingLeft: "8px" }}>
                  Trả lời: ....................................................................................................
                </div>
              )}

              {/* Sequence Order */}
              {q.type === "sequence_order" && q.items && (
                <div style={{ marginTop: "4px", paddingLeft: "8px", fontFamily: "monospace", fontSize: "8.5pt" }}>
                  {q.items.map((it, iIdx) => (
                    <div key={iIdx}>• {it}</div>
                  ))}
                  <div style={{ marginTop: "4px", fontFamily: "sans-serif" }}>
                    Thứ tự đúng: ........................................................................................
                  </div>
                </div>
              )}

              {/* Matching */}
              {q.type === "matching" && q.left_items && q.right_items && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "4px", paddingLeft: "8px", fontSize: "9pt" }}>
                  <div>
                    {q.left_items.map((l, lIdx) => (
                      <div key={lIdx}>{lIdx + 1}. {l}</div>
                    ))}
                  </div>
                  <div>
                    {q.right_items.map((r, rIdx) => (
                      <div key={rIdx}>{String.fromCharCode(65 + rIdx)}. {r}</div>
                    ))}
                  </div>
                  <div style={{ gridColumn: "span 2", marginTop: "2px" }}>
                    Ghép cặp: 1 - ....... ; 2 - ....... ; 3 - ....... ; 4 - .......
                  </div>
                </div>
              )}

              {/* Show Answer for Teacher Key */}
              {showAnswers && (
                <div style={{ marginTop: "4px", background: "#f1f5f9", padding: "4px 8px", borderRadius: "4px", fontSize: "8.5pt", color: "#166534" }}>
                  <strong>👉 Đáp án đúng:</strong> {q.type === "single_choice" ? `[${["A", "B", "C", "D"][q.correct_answer]}]` : JSON.stringify(q.correct_answer)} | <em>{q.explanation}</em>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Practical Problems */}
      {practicals.length > 0 && (
        <div style={{ pageBreakBefore: "always", paddingTop: "10px" }}>
          <h3 style={{ fontSize: "11pt", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #000", paddingBottom: "4px", marginBottom: "12px" }}>
            PHẦN 2: TỰ LUẬN THỰC HÀNH VIẾT HÀM ({practicals.length} BÀI — 5.0 ĐIỂM)
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {practicals.map((p, pIdx) => (
              <div key={p.id} className="print-card" style={{ pageBreakInside: "avoid", fontSize: "9.5pt" }}>
                <div style={{ fontWeight: 700 }}>
                  Bài {pIdx + 1}: {p.title}
                </div>
                <div style={{ margin: "4px 0" }}>• Yêu cầu: {p.description}</div>
                <div style={{ minHeight: "90px", border: "1px dashed #000", padding: "6px", fontFamily: "monospace", fontSize: "8.5pt", background: "#fafafa" }}>
                  {showAnswers ? p.solution_code : "# Viết mã nguồn Python bài làm của học sinh tại đây:\n\n\n\n"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
