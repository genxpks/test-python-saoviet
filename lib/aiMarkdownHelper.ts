/**
 * lib/aiMarkdownHelper.ts
 * Bộ xử lý và làm sạch văn bản phản hồi từ AI Sư Phạm — Tin Học Sao Việt
 */

export interface LineDiffSuggestion {
  lineNum?: number;
  oldSnippet?: string;
  newSnippet?: string;
  explanation?: string;
}

export interface ParsedAiCodeResponse {
  cleanExplanation: string;
  extractedCode?: string;
  lineDiffs: LineDiffSuggestion[];
}

/**
 * Làm sạch chuỗi văn bản từ AI, loại bỏ triệt để các ký tự rác như ****, ***, thẻ suy luận thừa
 */
export function cleanAiText(rawText: string): string {
  if (!rawText) return "";

  let text = rawText;

  // 1. Loại bỏ các thẻ suy luận ngầm (thinking process) của một số LLM
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  text = text.replace(/Here's a thinking process:[\s\S]*?(?:Draft:|Response:|\n\n)/i, "");

  // 2. Chuẩn hóa và loại bỏ các chuỗi sao thừa **** hoặc ***** hoặc ******
  // Chuyển 4 dấu sao trở lên thành định dạng bold chuẩn ** hoặc loại bỏ nếu đứng riêng lẻ
  text = text.replace(/\*{4,}([^*]+?)\*{4,}/g, "**$1**");
  text = text.replace(/\*{4,}/g, "**");

  // 3. Xử lý trường hợp AI viết dạng "**1. Lỗi sai:** ****" hoặc "****Giải thích:****"
  text = text.replace(/\*\*\s*\*\*/g, ""); // xóa cặp dấu sao rỗng ****

  // 4. Xóa các ký tự markdown thừa ở đầu tiêu đề nếu bị lặp (vd: "### ****Tiêu đề****")
  text = text.replace(/^(#{1,6})\s*\*{2,4}(.*?)\*{2,4}/gm, "$1 $2");

  // 5. Chuẩn hóa khoảng trắng đầu/cuối
  return text.trim();
}

/**
 * Trích xuất đoạn code Python hoàn chỉnh từ phản hồi của AI và làm sạch các ký tự markdown rác bên trong code
 */
export function extractCodeFromAiReply(reply: string): ParsedAiCodeResponse {
  const cleaned = cleanAiText(reply);
  let extractedCode: string | undefined = undefined;

  // Bóc tách khối code ```python ... ``` hoặc ``` ... ```
  const codeBlockMatch = cleaned.match(/```(?:python)?\s*([\s\S]*?)```/i);
  if (codeBlockMatch) {
    let rawCode = codeBlockMatch[1];
    // Đảm bảo bên trong code không chứa ký tự markdown rác như ** hay **** do AI vô tình chèn vào
    rawCode = rawCode.replace(/\*{2,}/g, "");
    extractedCode = rawCode.trim();
  }

  // Phân tích các vị trí dòng cần sửa (ví dụ: "Dòng 3:", "Dòng 2:", "Line 4:", "Thay `...` bằng `...`")
  const lineDiffs: LineDiffSuggestion[] = [];
  const lines = cleaned.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    // Tìm mẫu: "Dòng X:", "Ở dòng X:", "- Dòng X:"
    const lineMatch = l.match(/(?:dòng|line|bước)\s*(\d+)[:\s-]/i);
    if (lineMatch) {
      const lineNum = parseInt(lineMatch[1], 10);
      lineDiffs.push({
        lineNum,
        explanation: l.replace(/^[*-•\s]+/, "").trim()
      });
    }
  }

  return {
    cleanExplanation: cleaned,
    extractedCode,
    lineDiffs
  };
}
