import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const db = await getDatabase();
    const collection = db.collection("paused_exams");

    const query = userId ? { userId } : {};
    const paused = await collection.findOne(query);

    return NextResponse.json({ success: true, paused });
  } catch (error: any) {
    return NextResponse.json({ success: false, paused: null, error: error.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;
    if (!userId) return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });

    const db = await getDatabase();
    const collection = db.collection("paused_exams");

    await collection.updateOne(
      { userId },
      { $set: { ...body, updatedAt: new Date() } },
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

    const db = await getDatabase();
    const collection = db.collection("paused_exams");

    if (userId) {
      await collection.deleteOne({ userId });
    } else {
      await collection.deleteMany({});
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
