import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AIChatAssistant from "@/components/AIChatAssistant";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hệ Thống Luyện Thi & In Đề Python Nâng Cao — Tin Học Sao Việt Thủ Đức",
  description: "Trang web ôn tập 120 câu hỏi, thi trực tuyến 50 câu trắc nghiệm & 4 câu tự luận, trình chạy thử Python trực tiếp, trợ lý AI chữa bài và in đề thi chuẩn A4.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <Navbar />
        <div className="app-container">
          {children}
        </div>
        <AIChatAssistant />
      </body>
    </html>
  );
}
