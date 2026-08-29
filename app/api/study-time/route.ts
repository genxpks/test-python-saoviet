import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { StudySessionLog } from "@/types";

// GET /api/study-time?userId=... - Lấy tổng thời gian học hoặc lịch sử
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("study_logs");

    if (userId) {
      const logs = await collection.find({ userId }).sort({ lastUpdatedTime: -1 }).toArray();
      const totalSeconds = logs.reduce((acc, log) => acc + (log.durationSeconds || 0), 0);
      return NextResponse.json({ success: true, userId, totalSeconds, logs });
    }

    // Top students by study time for admin
    const allLogs = await collection.find({}).sort({ lastUpdatedTime: -1 }).limit(100).toArray();
    return NextResponse.json({ success: true, logs: allLogs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/study-time - Ghi nhận thời gian học tập mới
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, studentName, username, branchId, subjectId, durationSeconds, mode } = body;

    if (!userId || !durationSeconds) {
      return NextResponse.json({ success: false, message: "Missing userId or durationSeconds" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const logsCol = db.collection("study_logs");
    const usersCol = db.collection("users");

    const today = new Date().toISOString().split("T")[0];
    const nowIso = new Date().toISOString();

    // 1. Insert session log
    const logDoc: StudySessionLog = {
      id: "log_" + Date.now(),
      userId,
      username: username || "",
      studentName: studentName || "",
      branchId: branchId || "all",
      subjectId: subjectId || "python_advanced",
      durationSeconds: Number(durationSeconds),
      date: today,
      startTime: nowIso,
      lastUpdatedTime: nowIso,
      mode: mode || "study"
    };

    await logsCol.insertOne(logDoc);

    // 2. Increment totalStudySeconds on user document
    await usersCol.updateOne(
      { $or: [{ id: userId }, { username: userId }] },
      { 
        $inc: { totalStudySeconds: Number(durationSeconds) },
        $set: { lastStudyDate: today, lastActiveTime: nowIso }
      }
    );

    return NextResponse.json({ success: true, log: logDoc });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
