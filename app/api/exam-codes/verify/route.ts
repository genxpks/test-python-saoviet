import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// Ma hardcode fallback
const LEGACY_CODES = ["SAOVIET2026", "PYTHON2026", "SV2026", "SAOVIET", "8888", "110926"];

// Helper dinh dang ngay: dd/mm/yyyy HH:mm
function fmtDateTime(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

// POST: Xac thuc ma phong thi
// Body: { code: string, subjectId?: string, branchId?: string }
export async function POST(req: Request) {
  let parsedBody: { code?: string; subjectId?: string; branchId?: string } = {};

  try {
    parsedBody = await req.json();
  } catch {
    return NextResponse.json({ valid: false, message: "Yeu cau khong hop le." });
  }

  const { code, subjectId = "all", branchId = "all" } = parsedBody;

  try {
    if (!code) {
      return NextResponse.json({
        valid: false,
        message: "Vui long nhap ma phong thi!",
      });
    }

    const cleanCode = String(code).trim().toUpperCase();

    // 1. Kiem tra ma hardcode legacy
    if (LEGACY_CODES.includes(cleanCode)) {
      return NextResponse.json({
        valid: true,
        message: "Ma hop le",
        source: "legacy",
        examCode: {
          code: cleanCode,
          subjectId: "all",
          branchId: "all",
          label: "Mã phòng thi chuẩn",
          expiresAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
          config: { numQuestions: 50, numPracticals: 4, durationMinutes: 60 },
        },
      });
    }

    // 2. Kiem tra ma trong MongoDB
    const db = await getDatabase();
    const col = db.collection("exam_access_codes");

    const found = await col.findOne({
      code: cleanCode,
      isActive: true,
    });

    if (!found) {
      return NextResponse.json({
        valid: false,
        message: "Ma phong thi khong chinh xac! Vui long hoi Giao vien / Giam thi de nhan ma thi.",
      });
    }

    // 3. Kiem tra het han
    const now = new Date();
    const expiry = new Date(found.expiresAt);
    if (now > expiry) {
      // FIX: format dd/mm/yyyy HH:mm thay vi toLocaleString
      return NextResponse.json({
        valid: false,
        message: `Ma phong thi da het han luc ${fmtDateTime(expiry)}. Vui long lien he Giao vien cap ma moi.`,
      });
    }

    // 4. Kiem tra mon hoc
    if (found.subjectId !== "all" && subjectId !== "all" && found.subjectId !== subjectId) {
      return NextResponse.json({
        valid: false,
        message: `Ma phong thi nay chi ap dung cho mon ${String(found.subjectId).toUpperCase()}, khong ap dung cho mon dang chon.`,
      });
    }

    // 5. Kiem tra chi nhanh
    if (found.branchId !== "all" && branchId !== "all" && found.branchId !== branchId) {
      return NextResponse.json({
        valid: false,
        message: "Ma phong thi khong ap dung cho co so nay.",
      });
    }

    // 6. Tang usageCount (fire-and-forget) — BUG-03 FIX: dung _id de chac chan match
    col.updateOne({ _id: found._id }, { $inc: { usageCount: 1 } }).catch(() => {});

    const remaining = Math.round((expiry.getTime() - now.getTime()) / 60000);
    return NextResponse.json({
      valid: true,
      message: `Ma hop le - con ${remaining} phut`,
      source: "db",
      examCode: {
        code: found.code,
        subjectId: found.subjectId,
        branchId: found.branchId,
        label: found.label,
        expiresAt: found.expiresAt,
        config: found.config || { numQuestions: 50, numPracticals: 4, durationMinutes: 60 },
      },
    });
  } catch (error: any) {
    // DB loi: fallback ve legacy codes
    const cleanCode = String(code || "").trim().toUpperCase();
    if (LEGACY_CODES.includes(cleanCode)) {
      return NextResponse.json({
        valid: true,
        message: "Ma hop le (fallback)",
        source: "fallback",
        examCode: {
          code: cleanCode,
          subjectId: "all",
          branchId: "all",
          label: "Mã phòng thi fallback",
          expiresAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
          config: { numQuestions: 50, numPracticals: 4, durationMinutes: 60 },
        },
      });
    }
    return NextResponse.json({
      valid: false,
      message: "Loi he thong. Vui long thu lai sau.",
      error: error.message,
    });
  }
}
