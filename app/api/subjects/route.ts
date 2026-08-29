import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { Subject } from "@/types";
import { DEFAULT_SUBJECTS } from "@/lib/usersData";

export async function GET() {
  try {
    const db = await getDatabase();
    const sCol = db.collection("subjects");
    
    for (const sub of DEFAULT_SUBJECTS) {
      await sCol.updateOne({ id: sub.id }, { $set: sub }, { upsert: true });
    }

    const subjects = await sCol.find({}).sort({ createdDate: 1 }).toArray();
    return NextResponse.json({ success: true, subjects });
  } catch (error: any) {
    return NextResponse.json({ success: false, subjects: DEFAULT_SUBJECTS, error: error.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await getDatabase();
    const sCol = db.collection("subjects");

    const newSubject: Subject = {
      ...body,
      id: body.id || `subject_${Date.now()}`,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdDate: new Date().toISOString().split("T")[0]
    };

    await sCol.insertOne(newSubject as any);
    return NextResponse.json({ success: true, subject: newSubject });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ success: false, message: "Missing subject id" }, { status: 400 });

    const db = await getDatabase();
    const sCol = db.collection("subjects");

    await sCol.updateOne({ id }, { $set: updates });
    const updated = await sCol.findOne({ id });
    return NextResponse.json({ success: true, subject: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing subject id" }, { status: 400 });

    const db = await getDatabase();
    const sCol = db.collection("subjects");
    await sCol.deleteOne({ id });
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
