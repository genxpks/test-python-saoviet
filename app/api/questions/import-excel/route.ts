// app/api/questions/import-excel/route.ts - API Import câu hỏi hàng loạt từ Excel
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ExcelHelper } from "@/lib/excelHelper";
import { Question } from "@/types";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let questionsToInsert: Question[] = [];
    let subjectId = "python_advanced";
    let branchId = "all";
    let overwrite = false;

    if (contentType.includes("multipart/form-data")) {
      // 1. Nhận file Excel từ FormData
      const formData = await req.formData();
      const file = formData.get("file") as File;
      subjectId = (formData.get("subjectId") as string) || "python_advanced";
      branchId = (formData.get("branchId") as string) || "all";
      overwrite = formData.get("overwrite") === "true";

      if (!file) {
        return NextResponse.json({ success: false, message: "Không tìm thấy file tải lên." }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const db = await getDatabase();
      const qCol = db.collection("questions");
      const maxDoc = await qCol.find({}).sort({ id: -1 }).limit(1).toArray();
      const startId = maxDoc.length > 0 && maxDoc[0].id ? maxDoc[0].id + 1 : 1;

      const parseRes = ExcelHelper.parseExcelToQuestions(buffer, subjectId, startId);
      if (!parseRes.success && parseRes.questions.length === 0) {
        return NextResponse.json({
          success: false,
          message: "Lỗi phân tích file Excel.",
          errors: parseRes.errors
        }, { status: 400 });
      }

      questionsToInsert = parseRes.questions.map(q => ({
        ...q,
        subjectId: q.subjectId || subjectId,
        branchId: branchId
      }));
    } else {
      // 2. Nhận mảng JSON câu hỏi đã parse từ client
      const body = await req.json();
      const { questions, subjectId: sId, branchId: bId, overwrite: ovr } = body;
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return NextResponse.json({ success: false, message: "Danh sách câu hỏi trống." }, { status: 400 });
      }
      subjectId = sId || "python_advanced";
      branchId = bId || "all";
      overwrite = !!ovr;
      questionsToInsert = questions;
    }

    const db = await getDatabase();
    const qCol = db.collection("questions");

    if (overwrite) {
      // Xóa các câu hỏi cũ của môn đó trước khi nạp mới
      await qCol.deleteMany({ subjectId: subjectId });
    }

    // Đảm bảo mỗi câu hỏi có ID hợp lệ
    const maxDoc = await qCol.find({}).sort({ id: -1 }).limit(1).toArray();
    let currentId = maxDoc.length > 0 && maxDoc[0].id ? maxDoc[0].id + 1 : 1;

    const finalQuestions = questionsToInsert.map(q => ({
      ...q,
      id: q.id || currentId++,
      subjectId: q.subjectId || subjectId,
      branchId: q.branchId || branchId,
      createdAt: q.createdAt || new Date().toISOString()
    }));

    await qCol.insertMany(finalQuestions as any);

    return NextResponse.json({
      success: true,
      inserted_count: finalQuestions.length,
      subjectId,
      branchId,
      message: `Đã nạp thành công ${finalQuestions.length} câu hỏi vào MongoDB!`
    });
  } catch (error: any) {
    console.error("Excel Import Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
