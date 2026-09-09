import { NextResponse } from "next/server";
import { POST as aiPost } from "../ai/route";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mockReq = new Request(req.url, {
      method: "POST",
      headers: req.headers,
      body: JSON.stringify({
        prompt: body.prompt || body.question || body.message,
        mode: body.mode || "general",
        context: body.context
      })
    });

    const res = await aiPost(mockReq);
    const data = await res.json();

    return NextResponse.json({
      ...data,
      answer: data.reply || data.answer || ""
    }, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Internal Server Error"
    }, { status: 500 });
  }
}
