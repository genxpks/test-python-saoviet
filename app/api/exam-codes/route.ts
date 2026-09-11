import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ExamAccessCode } from "@/types";

// Helper dinh dang ngay: dd/mm/yyyy
function fmtDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// Sinh ma 6 chu so ngau nhien (khong bat dau bang 0)
function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Roles duoc phep quan ly ma phong thi
const ALLOWED_ROLES = ["admin", "internal_manager", "branch_manager", "teacher"];

// Lay role tu header X-User-Role (admin page truyen vao khi fetch)
function getRoleFromRequest(req: Request): string {
  return req.headers.get("X-User-Role") || "";
}

// GET: Lay danh sach ma phong thi
export async function GET(req: Request) {
  // Auth check: chi cho phep cac role quan tri
  const role = getRoleFromRequest(req);
  if (!ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ success: false, codes: [], error: "Khong co quyen truy cap" }, { status: 403 });
  }

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

// POST: Tao ma phong thi moi
export async function POST(req: Request) {
  // Auth check
  const role = getRoleFromRequest(req);
  if (!ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ success: false, message: "Khong co quyen tao ma" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      subjectId = "all",
      branchId = "all",
      label = "",
      createdBy = "admin",
      expiresAt,
      hoursValid = 4,
      config,
    } = body;

    const examConfig = {
      numQuestions: typeof config?.numQuestions === "number" ? Math.max(0, config.numQuestions) : 50,
      numPracticals: typeof config?.numPracticals === "number" ? Math.max(0, config.numPracticals) : 4,
      durationMinutes: typeof config?.durationMinutes === "number" ? Math.max(5, config.durationMinutes) : 60,
    };

    const now = new Date();
    let expiry: Date;

    if (expiresAt) {
      expiry = new Date(expiresAt);
      // BUG-01 FIX: Validate expiresAt khong phai Invalid Date
      if (isNaN(expiry.getTime())) {
        return NextResponse.json({ success: false, message: "Thoi gian het han khong hop le" }, { status: 400 });
      }
      if (expiry <= now) {
        return NextResponse.json({ success: false, message: "Thoi gian het han phai sau thoi diem hien tai" }, { status: 400 });
      }
    } else {
      expiry = new Date(now.getTime() + hoursValid * 60 * 60 * 1000);
    }

    const db = await getDatabase();
    const col = db.collection("exam_access_codes");

    // Sinh ma duy nhat — check toi da 10 lan
    let code = generateCode();
    for (let attempts = 0; attempts < 10; attempts++) {
      const existing = await col.findOne({ code, isActive: true });
      if (!existing) break;
      code = generateCode();
    }

    const newCode: ExamAccessCode = {
      id: `ec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      code,
      subjectId,
      branchId,
      label: label || `Ma thi ${subjectId === "all" ? "Tat ca mon" : subjectId.toUpperCase()} - ${fmtDate(now)}`,
      createdBy,
      expiresAt: expiry.toISOString(),
      isActive: true,
      usageCount: 0,
      createdAt: now.toISOString(),
      config: examConfig,
    };

    await col.insertOne(newCode);
    return NextResponse.json({ success: true, examCode: newCode });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Vo hieu hoa hoac xoa ma
export async function DELETE(req: Request) {
  // Auth check
  const role = getRoleFromRequest(req);
  if (!ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ success: false, message: "Khong co quyen xoa ma" }, { status: 403 });
  }

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
