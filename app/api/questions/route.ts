import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { QUESTIONS_DATA, PRACTICAL_DATA } from "@/lib/questionsData";

export async function GET() {
  try {
    const db = await getDatabase();
    const qCol = db.collection("questions");
    const pCol = db.collection("practical_problems");

    let questions = await qCol.find({}).toArray();
    let practicals = await pCol.find({}).toArray();

    // Auto-seed if empty
    if (questions.length === 0) {
      await qCol.insertMany(QUESTIONS_DATA as any);
      questions = await qCol.find({}).toArray();
    }
    if (practicals.length === 0) {
      await pCol.insertMany(PRACTICAL_DATA as any);
      practicals = await pCol.find({}).toArray();
    }

    return NextResponse.json({
      success: true,
      total_questions: questions.length,
      total_practicals: practicals.length,
      questions,
      practical_problems: practicals
    });
  } catch (error: any) {
    console.error("MongoDB GET questions error:", error);
    return NextResponse.json({
      success: false,
      questions: QUESTIONS_DATA,
      practical_problems: PRACTICAL_DATA,
      error: error.message
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { target } = body; // 'question' or 'practical'
    const db = await getDatabase();

    if (target === "practical") {
      const pCol = db.collection("practical_problems");
      const newPractical = {
        ...body.data,
        id: body.data.id || Date.now(),
        createdAt: new Date()
      };
      await pCol.insertOne(newPractical);
      return NextResponse.json({ success: true, practical: newPractical });
    } else {
      const qCol = db.collection("questions");
      const newQuestion = {
        ...body.data,
        id: body.data.id || Date.now(),
        createdAt: new Date()
      };
      await qCol.insertOne(newQuestion);
      return NextResponse.json({ success: true, question: newQuestion });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { target, data } = body;
    if (!data || !data.id) return NextResponse.json({ success: false, message: "Missing item id" }, { status: 400 });

    const db = await getDatabase();

    if (target === "practical") {
      const pCol = db.collection("practical_problems");
      await pCol.updateOne({ id: data.id }, { $set: { ...data, updatedAt: new Date() } });
      const updated = await pCol.findOne({ id: data.id });
      return NextResponse.json({ success: true, practical: updated });
    } else {
      const qCol = db.collection("questions");
      await qCol.updateOne({ id: data.id }, { $set: { ...data, updatedAt: new Date() } });
      const updated = await qCol.findOne({ id: data.id });
      return NextResponse.json({ success: true, question: updated });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const target = searchParams.get("target") || "question";
    if (!id) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });

    const db = await getDatabase();
    const numericId = isNaN(Number(id)) ? id : Number(id);

    if (target === "practical") {
      const pCol = db.collection("practical_problems");
      await pCol.deleteOne({ id: numericId });
    } else {
      const qCol = db.collection("questions");
      await qCol.deleteOne({ id: numericId });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
