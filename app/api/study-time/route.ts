import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const db = await getDatabase();
    const collection = db.collection("study_logs");

    if (userId) {
      const logs = await collection.find({ userId }).sort({ lastUpdatedTime: -1 }).toArray();
      const totalSeconds = logs.reduce((acc: number, log: any) => acc + (log.durationSeconds || 0), 0);
      return NextResponse.json({ success: true, userId, totalSeconds, logs });
    }

    const allLogs = await collection.find({}).sort({ lastUpdatedTime: -1 }).limit(100).toArray();
    return NextResponse.json({ success: true, logs: allLogs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, studentName, username, branchId, subjectId, durationSeconds, mode } = body;

    if (!userId || !durationSeconds) {
      return NextResponse.json({ success: false, message: "Missing userId or durationSeconds" }, { status: 400 });
    }

    const db = await getDatabase();
    const logsCol = db.collection("study_logs");
    const usersCol = db.collection("users");

    const today = new Date().toISOString().split("T")[0];
    const nowIso = new Date().toISOString();

    const logDoc = {
      id: "log_" + Date.now(),
      userId,
      username: username || "",
      studentName: studentName || "",
      branchId: branchId || "all",
      subjectId: subjectId || "python",
      durationSeconds: Number(durationSeconds),
      date: today,
      startTime: nowIso,
      lastUpdatedTime: nowIso,
      mode: mode || "study"
    };

    await logsCol.insertOne(logDoc);

    await usersCol.updateOne(
      { id: userId },
      {
        $inc: { totalStudySeconds: Number(durationSeconds) },
        $set: { lastStudyDate: nowIso }
      }
    );

    return NextResponse.json({ success: true, log: logDoc });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
