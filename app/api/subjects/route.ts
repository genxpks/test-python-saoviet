// app/api/subjects/route.ts - Quản lý Danh mục Môn học / Ngôn ngữ lập trình
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { Subject } from "@/types";

export async function GET() {
  try {
    const db = await getDatabase();
    const sCol = db.collection("subjects");
    const subjects = await sCol.find({}).sort({ createdDate: 1 }).toArray();
    return NextResponse.json({ success: true, subjects });
  } catch (error: any) {
    return NextResponse.json({ success: false, subjects: [], error: error.message });
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
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
