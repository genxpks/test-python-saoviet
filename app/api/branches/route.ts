import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { Branch } from "@/types";
import { DEFAULT_BRANCHES } from "@/lib/usersData";

export async function GET() {
  try {
    const db = await getDatabase();
    const bCol = db.collection("branches");
    let branches = await bCol.find({}).sort({ createdDate: 1 }).toArray();
    if (branches.length === 0) {
      await bCol.insertMany(DEFAULT_BRANCHES as any);
      branches = await bCol.find({}).toArray();
    }
    return NextResponse.json({ success: true, branches });
  } catch (error: any) {
    return NextResponse.json({ success: false, branches: DEFAULT_BRANCHES, error: error.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await getDatabase();
    const bCol = db.collection("branches");

    const newBranch: Branch = {
      ...body,
      id: body.id || `branch_${Date.now()}`,
      createdDate: new Date().toISOString().split("T")[0]
    };

    await bCol.insertOne(newBranch as any);
    return NextResponse.json({ success: true, branch: newBranch });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ success: false, message: "Missing branch id" }, { status: 400 });

    const db = await getDatabase();
    const bCol = db.collection("branches");

    await bCol.updateOne({ id }, { $set: updates });
    const updated = await bCol.findOne({ id });
    return NextResponse.json({ success: true, branch: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing branch id" }, { status: 400 });

    const db = await getDatabase();
    const bCol = db.collection("branches");
    await bCol.deleteOne({ id });
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
