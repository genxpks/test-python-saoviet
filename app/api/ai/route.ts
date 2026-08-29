import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, mode, context } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, message: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: "Chưa cấu hình biến môi trường OPENROUTER_API_KEY trên máy chủ."
      }, { status: 500 });
    }

    const model = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001";

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
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
          { role: "user", content: context ? `[Thông tin ngữ cảnh / Đề bài]:\n${JSON.stringify(context, null, 2)}\n\n[Yêu cầu của học viên]:\n${prompt}` : prompt }
        ],
        temperature: 0.6,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({
        success: false,
        message: "Lỗi kết nối AI Gateway: " + errText
      }, { status: response.status });
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || "Không có phản hồi từ AI Tutor.";

    return NextResponse.json({
      success: true,
      reply: replyText
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Internal Server Error"
    }, { status: 500 });
  }
}
