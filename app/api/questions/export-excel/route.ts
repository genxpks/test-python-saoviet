// app/api/questions/export-excel/route.ts - Xuất ngân hàng câu hỏi ra Excel
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ExcelHelper } from "@/lib/excelHelper";
import { Question } from "@/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const branchId = searchParams.get("branchId");

    const db = await getDatabase();
    const qCol = db.collection("questions");

    const query: any = {};
    if (subjectId && subjectId !== "all") query.subjectId = subjectId;
    if (branchId && branchId !== "all") query.branchId = { $in: [branchId, "all"] };

    const questions = await qCol.find(query).sort({ id: 1 }).toArray();

    const fileBytes = ExcelHelper.exportQuestionsToExcel(questions as any, subjectId || "SaoViet");

    return new NextResponse(fileBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Ngan_Hang_Cau_Hoi_${subjectId || 'All'}_${new Date().toISOString().split("T")[0]}.xlsx"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
