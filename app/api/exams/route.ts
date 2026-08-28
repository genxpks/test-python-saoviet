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

    const resultDoc = {
      ...body,
      createdAt: new Date()
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
