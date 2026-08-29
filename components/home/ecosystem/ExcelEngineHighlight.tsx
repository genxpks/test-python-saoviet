"use client";

import { FileSpreadsheet } from "lucide-react";

export default function ExcelEngineHighlight() {
  return (
    <div style={{
      padding: "0.75rem 1rem",
      background: "rgba(5, 150, 105, 0.04)",
      border: "1px dashed rgba(5, 150, 105, 0.3)",
      borderRadius: "var(--radius-sm)",
      marginTop: "0.8rem",
      fontSize: "0.8rem",
      color: "var(--brand-emerald-dark)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
      <FileSpreadsheet size={15} />
      <span>Hỗ trợ nạp và trích xuất dữ liệu Excel tương thích Microsoft Office & Google Sheets.</span>
    </div>
  );
}
