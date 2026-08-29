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
    const { target } = body;
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, target, data } = body;
    const db = await getDatabase();

    if (target === "practical") {
      const pCol = db.collection("practical_problems");
      await pCol.updateOne({ id: Number(id) }, { $set: data });
      return NextResponse.json({ success: true });
    } else {
      const qCol = db.collection("questions");
      await qCol.updateOne({ id: Number(id) }, { $set: data });
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const target = searchParams.get("target");
    const db = await getDatabase();

    if (target === "practical") {
      const pCol = db.collection("practical_problems");
      await pCol.deleteOne({ id: Number(id) });
      return NextResponse.json({ success: true });
    } else {
      const qCol = db.collection("questions");
      await qCol.deleteOne({ id: Number(id) });
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
