import { NextResponse } from "next/server";

// Danh sách các model fallback miễn phí ổn định nhất trên OpenRouter
const FALLBACK_FREE_MODELS = [
  "nex-agi/nex-n2.5-mini:free",
  "nvidia/nemotron-3.5-lightning:free",
  "liquid/lfm-2.5-2.6b:free"
];

function cleanAiOutput(text: string): string {
  if (!text) return "";
  // Xóa thinking process nếu model suy luận xuất ra
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  cleaned = cleaned.replace(/Here's a thinking process:[\s\S]*?(?:Draft:|Response:|\n\n)/i, "");
  return cleaned.trim() || text.trim();
}

async function callGoogleGemini(apiKey: string, prompt: string, systemInstruction: string, context?: any) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const userContent = context 
    ? `[Thông tin ngữ cảnh / Đề bài]:\n${JSON.stringify(context, null, 2)}\n\n[Yêu cầu của học viên]:\n${prompt}`
    : prompt;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        { role: "user", parts: [{ text: userContent }] }
      ],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 1500
      }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Gemini API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callOpenRouter(apiKey: string, model: string, prompt: string, systemInstruction: string, context?: any) {
  const userContent = context 
    ? `[Thông tin ngữ cảnh / Đề bài]:\n${JSON.stringify(context, null, 2)}\n\n[Yêu cầu của học viên]:\n${prompt}`
    : prompt;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://test-python-saoviet.vercel.app",
      "X-Title": "Tin Hoc Sao Viet AI Tutor"
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userContent }
      ],
      temperature: 0.6,
      max_tokens: 1500
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    const error: any = new Error(errText);
    error.status = res.status;
    throw error;
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, mode, context } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, message: "Prompt is required" }, { status: 400 });
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!openRouterApiKey && !geminiApiKey) {
      return NextResponse.json({
        success: false,
        message: "Chưa cấu hình biến môi trường OPENROUTER_API_KEY hoặc GEMINI_API_KEY trên máy chủ."
      }, { status: 500 });
    }

    let systemInstruction = `Bạn là Trợ Lý AI Tin Học Sao Việt — giáo viên dạy lập trình tận tâm, thông minh và thân thiện của Hệ Thống Đào Tạo Tin Học Sao Việt.
Phong cách giảng dạy:
- Xưng hô thân thiện, truyền cảm hứng.
- Giải thích cực kỳ trực quan, dễ hiểu, dùng ví dụ đời thường.
- Không chỉ đưa ra đáp án, mà chỉ ra nguyên nhân và cách tư duy logic đúng.
- Trả lời bằng tiếng Việt chuẩn mực, định dạng Markdown rõ ràng.`;

    if (mode === "fix_code") {
      systemInstruction += `\nNhiệm vụ: Bạn đang giúp học viên sửa lỗi code. Hãy phân tích đoạn code học sinh viết, phát hiện lỗi cú pháp hoặc logic, giải thích nguyên nhân và đưa ra đoạn code sửa chuẩn xác.`;
    } else if (mode === "explain_question") {
      systemInstruction += `\nNhiệm vụ: Bạn đang chữa câu hỏi trắc nghiệm hoặc bài tập lý thuyết. Hãy giải thích cặn kẽ tại sao đáp án đó là đúng, vì sao các phương án khác sai, và bí quyết ghi nhớ kiến thức.`;
    } else if (mode === "review_exam") {
      systemInstruction += `\nNhiệm vụ: Bạn đang tổng kết và nhận xét toàn bộ kết quả bài thi của học sinh, động viên và chỉ ra các chủ đề cần ôn tập thêm.`;
    } else if (mode === "grade_code") {
      systemInstruction += `\nNhiệm vụ: Bạn là Giám Khảo AI chấm bài tập lập trình Python của Hệ Thống Tin Học Sao Việt.
QUY TẮC CHẤM THI CỦA SAO VIỆT:
1. Học viên ĐƯỢC PHÉP ĐẶT TÊN HÀM BẤT KỲ (ví dụ: 'tinh_tong', 'tong_ab', 'my_sum', 'add', 'f',... đều được công nhận).
2. Học viên ĐƯỢC PHÉP viết dưới dạng hàm (def ...) có return, hoặc viết dạng script nhập/xuất (input/print), miễn là kết quả đầu ra đúng với yêu cầu đề bài.
3. Học viên ĐƯỢC PHÉP tự do chọn thuật toán (dùng vòng lặp for, while, đệ quy, hàm tích hợp sẵn của Python,...).

ĐỊNH DẠNG PHẢN HỒI (RÕ RÀNG, SƯ PHẠM):
- 🎯 **Điểm Số**: [X/10 Điểm] (Ví dụ: 10/10 Điểm nếu hoàn thành đúng yêu cầu)
- 📋 **Trạng Thái**: [HOÀN THÀNH XUẤT SẮC / ĐẠT / CẦN SỬA LỖI]
- 💡 **Nhận Xét Thuật Toán**: Phân tích logic code của học viên, công nhận tên hàm và cách tư duy của học viên.
- 🧪 **Kiểm Thử Kết Quả**: Xác nhận kết quả đầu ra với các bộ dữ liệu thử nghiệm.
- 🚀 **Lời Khuyên Tối Ưu**: Đưa ra gợi ý nâng cao hoặc mẹo viết code Python đẹp chuẩn PEP 8.`;
    }

    // 1. Ưu tiên gọi Google Gemini API trực tiếp nếu có GEMINI_API_KEY
    if (geminiApiKey) {
      try {
        const geminiText = await callGoogleGemini(geminiApiKey, prompt, systemInstruction, context);
        if (geminiText) {
          return NextResponse.json({ success: true, reply: cleanAiOutput(geminiText) });
        }
      } catch (err: any) {
        console.warn("Gemini API direct error, falling back to OpenRouter:", err.message);
      }
    }

    // 2. Gọi OpenRouter với model cấu hình và tự động fallback
    if (openRouterApiKey) {
      const primaryModel = process.env.OPENROUTER_MODEL || "nex-agi/nex-n2.5-mini:free";
      const modelList = [primaryModel, ...FALLBACK_FREE_MODELS.filter(m => m !== primaryModel)];

      let lastError: any = null;

      for (const modelToTry of modelList) {
        try {
          const reply = await callOpenRouter(openRouterApiKey, modelToTry, prompt, systemInstruction, context);
          if (reply) {
            return NextResponse.json({
              success: true,
              reply: cleanAiOutput(reply),
              modelUsed: modelToTry
            });
          }
        } catch (err: any) {
          lastError = err;
          // Nếu gặp lỗi 404 (model không tìm thấy), 402 (hết credits), hoặc 429 (rate limit), tiếp tục thử model fallback tiếp theo
          if (err.status === 404 || err.status === 402 || err.status === 429) {
            console.warn(`Model ${modelToTry} gặp mã lỗi ${err.status}, thử model tiếp theo...`);
            continue;
          }
          // Lỗi khác nghiêm trọng thì dừng
          break;
        }
      }

      return NextResponse.json({
        success: false,
        message: "Lỗi kết nối AI Gateway: " + (lastError?.message || "Không thể lấy phản hồi từ AI.")
      }, { status: lastError?.status || 500 });
    }

    return NextResponse.json({
      success: false,
      message: "Không có API Key khả dụng."
    }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Internal Server Error"
    }, { status: 500 });
  }
}

