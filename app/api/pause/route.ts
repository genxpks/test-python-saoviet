import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const subjectId = searchParams.get("subjectId");

    const db = await getDatabase();
    const collection = db.collection("paused_exams");

    if (userId) {
      // Ưu tiên tìm chính xác theo userId + subjectId
      let paused = null;
      if (subjectId && subjectId !== "all") {
        paused = await collection.findOne({ userId, subjectId });
      }
      // Nếu không thấy môn cụ thể, tìm theo userId mới nhất
      if (!paused) {
        paused = await collection.findOne({ userId }, { sort: { updatedAt: -1 } });
      }
      return NextResponse.json({ success: true, paused });
    }

    // Nếu không có userId (admin/teacher), lấy tất cả bài thi đang tạm dừng
    const allPaused = await collection.find({}).sort({ updatedAt: -1 }).toArray();
    return NextResponse.json({ success: true, pausedExams: allPaused });
  } catch (error: any) {
    return NextResponse.json({ success: false, paused: null, error: error.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, subjectId } = body;
    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection("paused_exams");

    const sid = subjectId || "python";

    await collection.updateOne(
      { userId, subjectId: sid },
      { $set: { ...body, subjectId: sid, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const subjectId = searchParams.get("subjectId");

    const db = await getDatabase();
    const collection = db.collection("paused_exams");

    if (userId && subjectId && subjectId !== "all") {
      await collection.deleteOne({ userId, subjectId });
    } else if (userId) {
      await collection.deleteMany({ userId });
    } else {
      await collection.deleteMany({});
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

