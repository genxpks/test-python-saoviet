import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AIChatAssistant from "@/components/AIChatAssistant";
import WaveBackground from "@/components/WaveBackground";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hệ Thống Luyện Thi & In Đề Python Nâng Cao — Tin Học Sao Việt Thủ Đức",
  description: "Trang web ôn tập 140 câu hỏi, thi trực tuyến 50 câu trắc nghiệm & 4 câu tự luận, 21 bài code thực hành với trình chạy thử Python trực tiếp, trợ lý AI chữa bài và in đề thi chuẩn A4.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" data-theme="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('saoviet_theme');
                  var theme = saved || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <WaveBackground />
        <Navbar />
        <div className="app-container">
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
        </div>
        <AIChatAssistant />
      </body>
    </html>
  );
}
