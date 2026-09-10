import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection("exam_results");
    const results = await collection.find({}).sort({ _id: -1 }).toArray();
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, results: [], error: error.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await getDatabase();
    const collection = db.collection("exam_results");

    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const cfIp = req.headers.get("cf-connecting-ip");
    let detectedIp = cfIp || realIp || (forwardedFor ? forwardedFor.split(",")[0].trim() : null) || "127.0.0.1";
    if (detectedIp === "::1" || detectedIp === "::ffff:127.0.0.1") detectedIp = "127.0.0.1";

    const now = new Date();
    const resultDoc = {
      ...body,
      examDate: body.examDate || now.toLocaleDateString("vi-VN"),
      completedDate: body.completedDate || now.toLocaleDateString("vi-VN"),
      completedTime: body.completedTime || now.toLocaleTimeString("vi-VN"),
      examEndTime: body.examEndTime || body.completedTime || now.toLocaleTimeString("vi-VN"),
      ipAddress: body.ipAddress && body.ipAddress !== "127.0.0.1" ? body.ipAddress : detectedIp,
      clientIp: body.clientIp || detectedIp,
      networkDevice: body.networkDevice || req.headers.get("user-agent") || "Web Client",
      createdAt: now
    };

    await collection.insertOne(resultDoc);
    return NextResponse.json({ success: true, result: resultDoc });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const db = await getDatabase();
    const collection = db.collection("exam_results");

    if (id) {
      await collection.deleteOne({ id });
    } else {
      await collection.deleteMany({});
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
