import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ExamAccessCode } from "@/types";

// Sinh mã 6 chữ số ngẫu nhiên (không bắt đầu bằng 0)
function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ── GET: Lấy danh sách mã phòng thi ──────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get("branchId");
    const activeOnly = searchParams.get("activeOnly") === "true";

    const db = await getDatabase();
    const col = db.collection("exam_access_codes");

    const filter: Record<string, any> = {};
    if (branchId && branchId !== "all") {
      filter.$or = [{ branchId }, { branchId: "all" }];
    }
    if (activeOnly) {
      filter.isActive = true;
    }

    const codes = await col.find(filter).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, codes });
  } catch (error: any) {
    return NextResponse.json({ success: false, codes: [], error: error.message });
  }
}

// ── POST: Tạo mã phòng thi mới ────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      subjectId = "all",
      branchId = "all",
      label = "",
      createdBy = "admin",
      expiresAt,
      hoursValid = 4,
    } = body;

    const now = new Date();
    let expiry: Date;
    if (expiresAt) {
      expiry = new Date(expiresAt);
    } else {
      expiry = new Date(now.getTime() + hoursValid * 60 * 60 * 1000);
    }

    const db = await getDatabase();
    const col = db.collection("exam_access_codes");

    let code = generateCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await col.findOne({ code, isActive: true });
      if (!existing) break;
      code = generateCode();
      attempts++;
    }

    const newCode: ExamAccessCode = {
      id: `ec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      code,
      subjectId,
      branchId,
      label: label || `Ma thi ${subjectId === "all" ? "Tat ca mon" : subjectId.toUpperCase()} - ${now.toLocaleDateString("vi-VN")}`,
      createdBy,
      expiresAt: expiry.toISOString(),
      isActive: true,
      usageCount: 0,
      createdAt: now.toISOString(),
    };

    await col.insertOne(newCode);
    return NextResponse.json({ success: true, examCode: newCode });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ── DELETE: Vô hiệu hoá hoặc xoá mã ─────────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const hardDelete = searchParams.get("hard") === "true";

    if (!id) {
      return NextResponse.json({ success: false, message: "Thieu id ma can xoa" }, { status: 400 });
    }

    const db = await getDatabase();
    const col = db.collection("exam_access_codes");

    if (hardDelete) {
      await col.deleteOne({ id });
    } else {
      await col.updateOne({ id }, { $set: { isActive: false } });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
