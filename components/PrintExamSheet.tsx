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
    <div className="print-sheet-paper" style={{ background: "#ffffff", padding: "1.8rem", maxWidth: "900px", margin: "0 auto", color: "#000000", fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Header Banner */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "2px solid #000000", paddingBottom: "10px", marginBottom: "14px", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase" }}>
            TRUNG TÂM TIN HỌC SAO VIỆT
          </div>
          <div style={{ fontSize: "9.5pt", fontWeight: 600 }}>CHI NHÁNH TP. THỦ ĐỨC</div>
          <div style={{ fontSize: "8.5pt", marginTop: "2px" }}>Mã đề: <strong>PR-2026</strong></div>
        </div>

        <div>
          <div style={{ fontSize: "10.5pt", fontWeight: 800, textTransform: "uppercase" }}>
            ĐỀ THI CHỨNG CHỈ TỐT NGHIỆP
          </div>
          <div style={{ fontSize: "9.5pt", fontWeight: 600 }}>Môn: Lập Trình Python Nâng Cao</div>
          <div style={{ fontSize: "8.5pt", fontStyle: "italic", marginTop: "2px" }}>
            Thời gian: 90 Phút (Không sử dụng tài liệu)
          </div>
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "14px" }}>
        <h2 style={{ fontSize: "13pt", fontWeight: 800, textTransform: "uppercase", margin: "4px 0" }}>
          {title}
        </h2>
      </div>

      {/* Student Info & Examiner Box */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", border: "1.5px solid #000000", padding: "8px 12px", marginBottom: "16px", fontSize: "10pt", lineHeight: "1.5" }}>
        <div>
          <div>Họ và tên học viên: ...................................................................................</div>
          <div style={{ marginTop: "4px" }}>Lớp: ........................................... Ngày sinh: ..... / ..... / .........</div>
          <div style={{ marginTop: "4px" }}>Số báo danh / ID: ................... Ngày thi: ..... / ..... / 2026</div>
        </div>

        <div style={{ borderLeft: "1.5px solid #000000", paddingLeft: "12px" }}>
          <div>Điểm Trắc Nghiệm: ............ / 5.0</div>
          <div style={{ marginTop: "3px" }}>Điểm Tự Luận Code: ............ / 5.0</div>
          <div style={{ marginTop: "3px", fontWeight: 800 }}>TỔNG ĐIỂM: ............ / 10.0</div>
          <div style={{ fontSize: "8.5pt", fontStyle: "italic", marginTop: "2px" }}>Giám khảo ký tên: ....................</div>
        </div>
      </div>

      {/* Part 1: Multiple Choice */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "11pt", fontWeight: 800, textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "3px", marginBottom: "10px" }}>
          PHẦN 1: TRẮC NGHIỆM ({questions.length} CÂU — 5.0 ĐIỂM)
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {questions.map((q, idx) => (
            <div key={q.id} style={{ pageBreakInside: "avoid", fontSize: "9.5pt", lineHeight: "1.4" }}>
              <div style={{ fontWeight: 700 }}>
                Câu {idx + 1} [{q.type_name}]: <span style={{ fontWeight: "normal" }}>{q.question}</span>
              </div>

              {/* Options */}
              {q.options && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", marginTop: "3px", paddingLeft: "12px" }}>
                  {q.options.map((opt, oIdx) => {
                    const label = ["A", "B", "C", "D"][oIdx];
                    return (
                      <div key={oIdx}>
                        <strong>{label}.</strong> {opt}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Fill Blank */}
              {q.type === "fill_blank" && (
                <div style={{ marginTop: "3px", paddingLeft: "12px", fontStyle: "italic" }}>
                  Trả lời: ........................................................................................................................
                </div>
              )}

              {/* Sequence Order */}
              {q.type === "sequence_order" && q.items && (
                <div style={{ marginTop: "3px", paddingLeft: "12px", fontSize: "8.8pt" }}>
                  {q.items.map((it, iIdx) => (
                    <div key={iIdx}>• <code style={{ fontFamily: "Courier, monospace" }}>{it}</code></div>
                  ))}
                  <div style={{ marginTop: "3px", fontStyle: "italic" }}>
                    Thứ tự đúng: ......................................................................................................
                  </div>
                </div>
              )}

              {/* Matching */}
              {q.type === "matching" && q.left_items && q.right_items && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "3px", paddingLeft: "12px", fontSize: "8.8pt" }}>
                  <div>
                    {q.left_items.map((l, lIdx) => (
                      <div key={lIdx}>{lIdx + 1}. <code style={{ fontFamily: "Courier, monospace" }}>{l}</code></div>
                    ))}
                  </div>
                  <div>
                    {q.right_items.map((r, rIdx) => (
                      <div key={rIdx}>{String.fromCharCode(65 + rIdx)}. {r}</div>
                    ))}
                  </div>
                  <div style={{ gridColumn: "span 2", marginTop: "2px", fontStyle: "italic" }}>
                    Ghép cặp: 1 - ....... ; 2 - ....... ; 3 - ....... ; 4 - .......
                  </div>
                </div>
              )}

              {/* Teacher Key */}
              {showAnswers && (
                <div style={{ marginTop: "3px", background: "#f1f5f9", padding: "3px 8px", borderRadius: "3px", fontSize: "8.5pt", color: "#166534" }}>
                  <strong>👉 Đáp án đúng:</strong> {q.type === "single_choice" ? `[${["A", "B", "C", "D"][q.correct_answer]}]` : JSON.stringify(q.correct_answer)} | <em>{q.explanation}</em>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Practicals */}
      {practicals.length > 0 && (
        <div style={{ pageBreakBefore: "always", paddingTop: "12px" }}>
          <h3 style={{ fontSize: "11pt", fontWeight: 800, textTransform: "uppercase", borderBottom: "1px solid #000000", paddingBottom: "3px", marginBottom: "10px" }}>
            PHẦN 2: TỰ LUẬN THỰC HÀNH VIẾT HÀM ({practicals.length} BÀI — 5.0 ĐIỂM)
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {practicals.map((p, pIdx) => (
              <div key={p.id} style={{ pageBreakInside: "avoid", fontSize: "9.5pt" }}>
                <div style={{ fontWeight: 800 }}>
                  Bài {pIdx + 1}: {p.title} (1.25 điểm)
                </div>
                <div style={{ margin: "3px 0" }}>• Yêu cầu: {p.description}</div>
                <div style={{ minHeight: "100px", border: "1px dashed #000000", padding: "8px", fontFamily: "Courier, monospace", fontSize: "8.8pt", background: "#fafafa", whiteSpace: "pre-wrap" }}>
                  {showAnswers ? p.solution_code : "# Viết mã nguồn Python bài làm của học viên tại đây:\n\n\n\n\n"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
