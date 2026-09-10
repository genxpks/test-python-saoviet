import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatAssistant from "@/components/AIChatAssistant";
import WaveBackground from "@/components/WaveBackground";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hệ Thống Đào Tạo, Khảo Thí & Luyện Thi — Tin Học & Kế Toán Sao Việt",
  description: "Cổng đào tạo thực chiến Tin học văn phòng THVP-32, MOS/IC3, Kế toán doanh nghiệp & Lập trình ứng dụng. Hệ thống thi trực tuyến 120+ câu hỏi, sandbox tự động chấm điểm và in đề chuẩn A4.",
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
        <Footer />
        <AIChatAssistant />
      </body>
    </html>
  );
}
