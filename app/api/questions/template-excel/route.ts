// app/api/questions/template-excel/route.ts - Tải File Excel Mẫu
import { NextResponse } from "next/server";
import { ExcelHelper } from "@/lib/excelHelper";

export async function GET() {
  try {
    const fileBytes = ExcelHelper.generateTemplateWorkbook();

    return new NextResponse(fileBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="File_Mau_Soan_Cau_Hoi_SaoViet_${new Date().toISOString().split("T")[0]}.xlsx"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
