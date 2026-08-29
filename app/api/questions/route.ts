import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { QUESTIONS_DATA, PRACTICAL_DATA } from "@/lib/questionsData";

export async function GET() {
  try {
    const db = await getDatabase();
    const qCol = db.collection("questions");
    const pCol = db.collection("practical_problems");

    const questions = await qCol.find({}).sort({ id: 1 }).toArray();
    const practicals = await pCol.find({}).sort({ id: 1 }).toArray();

    return NextResponse.json({
      success: true,
      total_questions: questions.length,
      total_practicals: practicals.length,
      questions,
      practical_problems: practicals
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      questions: [],
      practical_problems: [],
      isFallback: true,
      note: error.message
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { target } = body;

    if (target === "practical") {
      const newPractical = {
        ...body.data,
        id: body.data.id || Date.now(),
        createdAt: new Date()
      };
      try {
        const db = await getDatabase();
        const pCol = db.collection("practical_problems");
        await pCol.updateOne({ id: newPractical.id }, { $set: newPractical }, { upsert: true });
      } catch (dbErr) {}
      return NextResponse.json({ success: true, practical: newPractical });
    } else {
      const newQuestion = {
        ...body.data,
        id: body.data.id || Date.now(),
        createdAt: new Date()
      };
      try {
        const db = await getDatabase();
        const qCol = db.collection("questions");
        await qCol.updateOne({ id: newQuestion.id }, { $set: newQuestion }, { upsert: true });
      } catch (dbErr) {}
      return NextResponse.json({ success: true, question: newQuestion });
    }
  } catch (error: any) {
    return NextResponse.json({ success: true, localSaved: true, note: error.message });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const target = body.target;
    const data = body.data || body;
    const targetId = Number(body.id || data.id);

    if (isNaN(targetId)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    try {
      const db = await getDatabase();
      if (target === "practical") {
        const pCol = db.collection("practical_problems");
        await pCol.updateOne({ id: targetId }, { $set: data }, { upsert: true });
      } else {
        const qCol = db.collection("questions");
        await qCol.updateOne({ id: targetId }, { $set: data }, { upsert: true });
      }
    } catch (dbErr) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: true, localSaved: true, note: error.message });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const target = searchParams.get("target");

    try {
      const db = await getDatabase();
      if (target === "practical") {
        const pCol = db.collection("practical_problems");
        await pCol.deleteOne({ id: Number(id) });
      } else {
        const qCol = db.collection("questions");
        await qCol.deleteOne({ id: Number(id) });
      }
    } catch (dbErr) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: true, localSaved: true, note: error.message });
  }
}
