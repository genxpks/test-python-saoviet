// lib/excelHelper.ts - Tiện ích xử lý Excel (.xlsx / .csv) cho Ngân hàng Câu hỏi
// Đơn vị: TRUNG TÂM TIN HỌC SAO VIỆT
import * as XLSX from "xlsx";
import { Question, QuestionType, ExcelQuestionImportRow } from "@/types";

export interface ParseResult {
  success: boolean;
  questions: Question[];
  errors: string[];
  totalRows: number;
}

export class ExcelHelper {
  /**
   * Tạo File Mẫu Excel chuẩn (.xlsx) có sẵn hướng dẫn & ví dụ cho cả 6 dạng câu hỏi
   */
  static generateTemplateWorkbook(): Uint8Array {
    const wb = XLSX.utils.book_new();

    // SHEET 1: HƯỚNG DẪN SOẠN ĐỀ
    const guideData = [
      ["TRUNG TÂM TIN HỌC SAO VIỆT — HƯỚNG DẪN ĐỊNH DẠNG FILE EXCEL SOẠN CÂU HỎI"],
      [""],
      ["CỘT", "TÊN CỘT", "BẮT BUỘC", "QUY ĐỊNH NHẬP LIỆU & VÍ DỤ"],
      ["A", "STT", "Không", "Số thứ tự câu hỏi (1, 2, 3...)"],
      ["B", "Mã Môn Học", "Không", "Mã môn học (VD: python_advanced, cpp_basic, web_frontend). Nếu trống lấy môn mặc định."],
      ["C", "Dạng Câu Hỏi", "Có", "Chọn 1 trong 6 mã dạng sau:\n1. single_choice (Trắc nghiệm ABCD 1 đáp án)\n2. true_false (Đúng / Sai)\n3. multiple_choice (Chọn nhiều đáp án đúng)\n4. fill_blank (Điền vào chỗ trống)\n5. sequence_order (Sắp xếp thứ tự dòng lệnh)\n6. matching (Nối quy trình / Ghép cặp)"],
      ["D", "Chương / Module", "Không", "Số chương (1, 2, 3, 4, 5...)"],
      ["E", "Nội Dung Câu Hỏi", "Có", "Văn bản đề bài câu hỏi. Có thể kèm đoạn code."],
      ["F", "Lựa Chọn A (hoặc Mục 1)", "Tùy dạng", "Lựa chọn A (với ABCD), hoặc dòng 1 (với Sắp xếp), hoặc Vế trái 1 (với Nối cặp)"],
      ["G", "Lựa Chọn B (hoặc Mục 2)", "Tùy dạng", "Lựa chọn B (với ABCD), hoặc dòng 2 (với Sắp xếp), hoặc Vế trái 2 (với Nối cặp)"],
      ["H", "Lựa Chọn C (hoặc Mục 3)", "Tùy dạng", "Lựa chọn C (với ABCD), hoặc dòng 3 (với Sắp xếp), hoặc Vế trái 3 (với Nối cặp)"],
      ["I", "Lựa Chọn D (hoặc Mục 4)", "Tùy dạng", "Lựa chọn D (với ABCD), hoặc dòng 4 (với Sắp xếp), hoặc Vế trái 4 (với Nối cặp)"],
      ["J", "Vế Phải Nối Cặp (Ghép)", "Nối cặp", "Dùng cho dạng 'matching': Nhập vế phải cách nhau dấu gạch đứng (|). VD: A-Định nghĩa hàm | B-Trả về giá trị"],
      ["K", "Đáp Án Đúng", "Có", "Quy ước:\n• single_choice: Nhập chữ cái A, B, C, D hoặc số 0, 1, 2, 3.\n• true_false: Nhập Đúng / Sai (hoặc True / False / T / F).\n• multiple_choice: Nhập các đáp án đúng cách nhau dấu phẩy (VD: A, C hoặc 0, 2).\n• fill_blank: Nhập từ khóa/cụm từ đúng cần điền.\n• sequence_order: Nhập thứ tự đúng các dòng cách nhau dấu phẩy (VD: 1, 3, 2, 4).\n• matching: Nhập cặp nối dạng VếTrái-VếPhải (VD: A-1, B-2, C-3)."],
      ["L", "Giải Thích Suy Luận Logic", "Khuyến nghị", "Lời giải thích cặn kẽ tại sao đáp án đó đúng, mẹo ghi nhớ cho học viên."],
      ["M", "Độ Khó", "Không", "Dễ / Trung bình / Khó"]
    ];

    const wsGuide = XLSX.utils.aoa_to_sheet(guideData);
    wsGuide["!cols"] = [
      { wch: 8 },
      { wch: 25 },
      { wch: 15 },
      { wch: 75 }
    ];
    XLSX.utils.book_append_sheet(wb, wsGuide, "1_HUONG_DAN_QUY_DINH");

    // SHEET 2: MẪU CÂU HỎI (DATA TEMPLATE)
    const templateHeaders = [
      "STT",
      "Mã Môn Học",
      "Dạng Câu Hỏi",
      "Chương",
      "Nội Dung Câu Hỏi",
      "Lựa Chọn A",
      "Lựa Chọn B",
      "Lựa Chọn C",
      "Lựa Chọn D",
      "Vế Phải Nối Cặp",
      "Đáp Án Đúng",
      "Giải Thích Suy Luận Logic",
      "Độ Khó"
    ];

    const sampleRows = [
      [
        1,
        "python_advanced",
        "single_choice",
        1,
        "Trong Python, cú pháp nào sau đây dùng để khai báo một hàm mới?",
        "function my_func():",
        "def my_func():",
        "create my_func():",
        "func my_func():",
        "",
        "B",
        "Từ khóa 'def' là từ khóa chuẩn trong Python dùng để định nghĩa một hàm mới.",
        "Dễ"
      ],
      [
        2,
        "python_advanced",
        "true_false",
        1,
        "Trong Python, chuỗi ký tự (String) là kiểu dữ liệu có thể thay đổi giá trị trực tiếp (Mutable).",
        "Đúng",
        "Sai",
        "",
        "",
        "",
        "Sai",
        "Chuỗi trong Python là kiểu bất biến (Immutable). Muốn thay đổi phải tạo chuỗi mới.",
        "Dễ"
      ],
      [
        3,
        "python_advanced",
        "multiple_choice",
        2,
        "Những phương thức nào sau đây dùng để xóa phần tử trong danh sách List của Python?",
        "remove()",
        "pop()",
        "delete_item()",
        "clear()",
        "",
        "A, B, D",
        "remove() xóa theo giá trị, pop() xóa theo chỉ số index, clear() xóa toàn bộ danh sách.",
        "Trung bình"
      ],
      [
        4,
        "python_advanced",
        "fill_blank",
        2,
        "Để chuyển đổi một chuỗi văn bản thành danh sách các từ tách biệt theo khoảng trắng, ta sử dụng phương thức .______()",
        "",
        "",
        "",
        "",
        "",
        "split",
        "Phương thức .split() mặc định tách chuỗi dựa trên khoảng trắng và trả về một List.",
        "Dễ"
      ],
      [
        5,
        "python_advanced",
        "sequence_order",
        4,
        "Hãy sắp xếp đúng thứ tự các dòng lệnh để tính và in tổng các số từ 1 đến 10:",
        "tong = 0",
        "print('Tổng =', tong)",
        "for i in range(1, 11):",
        "    tong += i",
        "",
        "1, 3, 4, 2",
        "Thứ tự đúng: Khởi tạo biến tong = 0 -> Duyệt vòng lặp for -> Cộng dồn tong += i -> In kết quả print().",
        "Trung bình"
      ],
      [
        6,
        "python_advanced",
        "matching",
        5,
        "Hãy nối từng thư viện chuẩn trong Python với công dụng tương ứng:",
        "A. math",
        "B. random",
        "C. datetime",
        "D. turtle",
        "1. Làm việc với ngày giờ | 2. Các phép toán nâng cao (căn bậc 2, sin, pi) | 3. Vẽ hình đồ họa | 4. Tạo số ngẫu nhiên",
        "A-2, B-4, C-1, D-3",
        "math: toán học; random: ngẫu nhiên; datetime: ngày giờ; turtle: đồ họa hình học.",
        "Dễ"
      ]
    ];

    const wsData = XLSX.utils.aoa_to_sheet([templateHeaders, ...sampleRows]);
    wsData["!cols"] = [
      { wch: 6 },  // STT
      { wch: 16 }, // Mã môn
      { wch: 18 }, // Dạng câu
      { wch: 8 },  // Chương
      { wch: 45 }, // Đề bài
      { wch: 25 }, // Lựa chọn A
      { wch: 25 }, // Lựa chọn B
      { wch: 25 }, // Lựa chọn C
      { wch: 25 }, // Lựa chọn D
      { wch: 35 }, // Vế phải nối cặp
      { wch: 18 }, // Đáp án đúng
      { wch: 45 }, // Giải thích
      { wch: 12 }  // Độ khó
    ];
    XLSX.utils.book_append_sheet(wb, wsData, "MAU_CAU_HOI");

    const out = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    return new Uint8Array(out);
  }

  /**
   * Đọc và parse dữ liệu từ file Excel Buffer hoặc ArrayBuffer thành mảng Question
   */
  static parseExcelToQuestions(
    buffer: ArrayBuffer | Uint8Array | Buffer,
    defaultSubjectId: string = "python_advanced",
    startingId: number = 1
  ): ParseResult {
    const errors: string[] = [];
    const questions: Question[] = [];

    try {
      const wb = XLSX.read(buffer, { type: "buffer" });
      
      // Tìm sheet MAU_CAU_HOI hoặc lấy sheet đầu tiên nếu không có
      let sheetName = wb.SheetNames.find(s => s.toUpperCase().includes("CAU_HOI") || s.toUpperCase().includes("QUESTION")) || wb.SheetNames[0];
      if (wb.SheetNames.length > 1 && sheetName.includes("HUONG_DAN")) {
        sheetName = wb.SheetNames[1];
      }

      const ws = wb.Sheets[sheetName];
      const rawJson = XLSX.utils.sheet_to_json<any>(ws, { header: 1 });

      if (rawJson.length <= 1) {
        return {
          success: false,
          questions: [],
          errors: ["File Excel không có dữ liệu hoặc chỉ có dòng tiêu đề."],
          totalRows: 0
        };
      }

      const rows = rawJson.slice(1); // Bỏ dòng header
      let currentId = startingId;

      rows.forEach((row: any[], idx: number) => {
        const rowNum = idx + 2; // Dòng thực tế trong Excel (1-indexed, có header)

        if (!row || row.length === 0 || !row[4]) {
          // Bỏ qua dòng trống
          return;
        }

        const rawSubject = String(row[1] || defaultSubjectId).trim();
        const rawType = String(row[2] || "single_choice").trim().toLowerCase();
        const rawModule = parseInt(row[3]) || 1;
        const questionText = String(row[4] || "").trim();
        const optA = row[5] !== undefined ? String(row[5]).trim() : "";
        const optB = row[6] !== undefined ? String(row[6]).trim() : "";
        const optC = row[7] !== undefined ? String(row[7]).trim() : "";
        const optD = row[8] !== undefined ? String(row[8]).trim() : "";
        const rightPairsStr = row[9] !== undefined ? String(row[9]).trim() : "";
        const rawAnswer = row[10] !== undefined ? String(row[10]).trim() : "";
        const explanation = row[11] !== undefined ? String(row[11]).trim() : "Đáp án chuẩn xác theo giáo trình.";
        const difficulty = (String(row[12] || "medium").trim().toLowerCase().includes("dễ") ? "easy" : 
                            String(row[12] || "").trim().toLowerCase().includes("khó") ? "hard" : "medium") as any;

        if (!questionText) {
          errors.push(`Dòng ${rowNum}: Nội dung câu hỏi trống.`);
          return;
        }

        let qType: QuestionType = "single_choice";
        let typeName = "Trắc nghiệm ABCD (1 đáp án)";

        if (rawType.includes("true") || rawType.includes("dung") || rawType.includes("tf")) {
          qType = "true_false";
          typeName = "Trắc nghiệm Đúng / Sai";
        } else if (rawType.includes("multi") || rawType.includes("nhieu")) {
          qType = "multiple_choice";
          typeName = "Trắc nghiệm Chọn nhiều đáp án";
        } else if (rawType.includes("fill") || rawType.includes("dien")) {
          qType = "fill_blank";
          typeName = "Điền vào chỗ trống";
        } else if (rawType.includes("seq") || rawType.includes("sap_xep")) {
          qType = "sequence_order";
          typeName = "Sắp xếp thứ tự dòng lệnh";
        } else if (rawType.includes("match") || rawType.includes("noi") || rawType.includes("ghep")) {
          qType = "matching";
          typeName = "Nối quy trình / Ghép cặp";
        }

        const qObj: Question = {
          id: currentId++,
          subjectId: rawSubject || defaultSubjectId,
          moduleId: rawModule,
          type: qType,
          type_name: typeName,
          question: questionText,
          explanation: explanation,
          difficulty: difficulty,
          createdAt: new Date().toISOString()
        };

        // Parse options & correct answer theo từng dạng
        if (qType === "single_choice") {
          qObj.options = [optA, optB, optC, optD].filter(x => x !== "");
          if (qObj.options.length < 2) {
            errors.push(`Dòng ${rowNum}: Câu trắc nghiệm ABCD cần ít nhất 2 lựa chọn A và B.`);
            return;
          }
          // Parse đáp án A, B, C, D -> 0, 1, 2, 3
          const upperAns = rawAnswer.toUpperCase();
          if (upperAns === "A" || upperAns === "0" || upperAns === "1") qObj.correct_answer = 0;
          else if (upperAns === "B" || upperAns === "1" || upperAns === "2") qObj.correct_answer = 1;
          else if (upperAns === "C" || upperAns === "2" || upperAns === "3") qObj.correct_answer = 2;
          else if (upperAns === "D" || upperAns === "3" || upperAns === "4") qObj.correct_answer = 3;
          else qObj.correct_answer = 0;
        } else if (qType === "true_false") {
          qObj.options = ["Đúng", "Sai"];
          const upperAns = rawAnswer.toUpperCase();
          qObj.correct_answer = (upperAns.includes("ĐÚNG") || upperAns.includes("TRUE") || upperAns === "T" || upperAns === "0") ? 0 : 1;
        } else if (qType === "multiple_choice") {
          qObj.options = [optA, optB, optC, optD].filter(x => x !== "");
          const rawParts = rawAnswer.split(/[,;\s]+/).map(p => p.trim().toUpperCase());
          const correctIdxs: number[] = [];
          rawParts.forEach(p => {
            if (p === "A" || p === "0") correctIdxs.push(0);
            else if (p === "B" || p === "1") correctIdxs.push(1);
            else if (p === "C" || p === "2") correctIdxs.push(2);
            else if (p === "D" || p === "3") correctIdxs.push(3);
          });
          qObj.correct_answer = correctIdxs.length > 0 ? correctIdxs : [0];
        } else if (qType === "fill_blank") {
          qObj.correct_answer = rawAnswer;
        } else if (qType === "sequence_order") {
          qObj.items = [optA, optB, optC, optD].filter(x => x !== "");
          const parts = rawAnswer.split(/[,;\s]+/).map(p => parseInt(p.trim()) - 1).filter(n => !isNaN(n));
          qObj.correct_order = parts.length === qObj.items.length ? parts : Array.from({ length: qObj.items.length }, (_, i) => i);
        } else if (qType === "matching") {
          const leftItems = [optA, optB, optC, optD].filter(x => x !== "");
          const rightItems = rightPairsStr.split("|").map(s => s.trim()).filter(s => s !== "");
          qObj.left_items = leftItems;
          qObj.right_items = rightItems;
          qObj.pairs = leftItems.map((l, i) => ({
            left: l,
            right: rightItems[i] || ""
          }));
        }

        questions.push(qObj);
      });

      return {
        success: errors.length === 0,
        questions,
        errors,
        totalRows: rows.length
      };
    } catch (err: any) {
      return {
        success: false,
        questions: [],
        errors: [`Lỗi phân tích file Excel: ${err.message}`],
        totalRows: 0
      };
    }
  }

  /**
   * Xuất danh sách câu hỏi ra File Excel (.xlsx)
   */
  static exportQuestionsToExcel(questions: Question[], subjectName: string = "ToanBo"): Uint8Array {
    const wb = XLSX.utils.book_new();

    const headers = [
      "STT",
      "Mã Môn Học",
      "Dạng Câu Hỏi",
      "Chương",
      "Nội Dung Câu Hỏi",
      "Lựa Chọn A",
      "Lựa Chọn B",
      "Lựa Chọn C",
      "Lựa Chọn D",
      "Vế Phải Nối Cặp",
      "Đáp Án Đúng",
      "Giải Thích Suy Luận Logic",
      "Độ Khó"
    ];

    const rows = questions.map((q, idx) => {
      let optA = q.options?.[0] || q.items?.[0] || q.left_items?.[0] || "";
      let optB = q.options?.[1] || q.items?.[1] || q.left_items?.[1] || "";
      let optC = q.options?.[2] || q.items?.[2] || q.left_items?.[2] || "";
      let optD = q.options?.[3] || q.items?.[3] || q.left_items?.[3] || "";
      let rightPairs = q.right_items ? q.right_items.join(" | ") : "";

      let answerDisplay = "";
      if (q.type === "single_choice") {
        const letters = ["A", "B", "C", "D"];
        answerDisplay = letters[q.correct_answer] || "A";
      } else if (q.type === "true_false") {
        answerDisplay = q.correct_answer === 0 ? "Đúng" : "Sai";
      } else if (q.type === "multiple_choice" && Array.isArray(q.correct_answer)) {
        const letters = ["A", "B", "C", "D"];
        answerDisplay = q.correct_answer.map((i: number) => letters[i]).join(", ");
      } else if (q.type === "sequence_order" && Array.isArray(q.correct_order)) {
        answerDisplay = q.correct_order.map(i => i + 1).join(", ");
      } else if (q.type === "fill_blank") {
        answerDisplay = String(q.correct_answer || "");
      } else if (q.type === "matching" && q.pairs) {
        answerDisplay = q.pairs.map(p => `${p.left} -> ${p.right}`).join("; ");
      }

      return [
        idx + 1,
        q.subjectId || "python_advanced",
        q.type,
        q.moduleId || 1,
        q.question,
        optA,
        optB,
        optC,
        optD,
        rightPairs,
        answerDisplay,
        q.explanation,
        q.difficulty || "medium"
      ];
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = [
      { wch: 6 },
      { wch: 16 },
      { wch: 18 },
      { wch: 8 },
      { wch: 45 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 35 },
      { wch: 18 },
      { wch: 45 },
      { wch: 12 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, `NGAN_HANG_DE_${subjectName.toUpperCase().slice(0, 15)}`);
    const out = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    return new Uint8Array(out);
  }
}
