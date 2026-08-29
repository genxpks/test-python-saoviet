"use client";

import { useState } from "react";
import Link from "next/link";
import TiltCard3D from "./TiltCard3D";
import { 
  FileCode2, 
  Terminal, 
  Layers, 
  Cpu, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  Code2
} from "lucide-react";

interface SubjectTrack {
  id: string;
  name: string;
  code: string;
  tagline: string;
  icon: any;
  color: string;
  bgGradient: string;
  runtime: string;
  modulesCount: number;
  highlightTopics: string[];
  sampleQuestion: string;
  sampleCode: string;
}

const TRACKS: SubjectTrack[] = [
  {
    id: "python_advanced",
    name: "Lập Trình Python Nâng Cao",
    code: "PY_NC",
    tagline: "Nền tảng xử lý dữ liệu, chuỗi, đồ họa Turtle Graphics & giải thuật thực tế",
    icon: FileCode2,
    color: "#2563eb",
    bgGradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(6, 182, 212, 0.05))",
    runtime: "Python 3.12 (Sandbox Engine)",
    modulesCount: 5,
    highlightTopics: [
      "Chương 1: Đồ họa hình học với thư viện Turtle Graphics",
      "Chương 2: Xử lý chuỗi String, slicing & chuẩn hóa dữ liệu",
      "Chương 3: Cấu trúc mảng List & Dictionary từ điển",
      "Chương 4: Xây dựng hàm def, đối số & giá trị return",
      "Chương 5: Thư viện chuẩn math, random, datetime & 6 Dự án thực tế"
    ],
    sampleQuestion: "Phương thức nào trong Python dùng để tách chuỗi thành danh sách các từ?",
    sampleCode: "words = 'Tin Hoc Sao Viet'.split(' ')\nprint(f'Số từ: {len(words)}') # -> 4"
  },
  {
    id: "cpp_basic",
    name: "Lập Trình C / C++ Căn Bản",
    code: "CPP_CB",
    tagline: "Tư duy giải thuật nền tảng, quản lý bộ nhớ, con trỏ & cấu trúc dữ liệu",
    icon: Terminal,
    color: "#059669",
    bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))",
    runtime: "C++ 17 / GCC",
    modulesCount: 6,
    highlightTopics: [
      "Module 1: Kiểu dữ liệu nguyên thủy, toán tử & I/O",
      "Module 2: Cấu trúc rẽ nhánh if/else & switch/case",
      "Module 3: Vòng lặp for, while, do-while & mảng 1 chiều",
      "Module 4: Mảng 2 chiều ma trận & chuỗi ký tự C-string",
      "Module 5: Con trỏ (Pointers), cấp phát động & Struct",
      "Module 6: Hàm, truyền tham trị / tham chiếu & Đệ quy"
    ],
    sampleQuestion: "Toán tử nào được dùng để lấy địa chỉ ô nhớ của một biến trong C++?",
    sampleCode: "int x = 100;\nint* ptr = &x;\nstd::cout << *ptr; // in ra 100"
  },
  {
    id: "web_frontend",
    name: "Lập Trình Web Frontend Modern",
    code: "WEB_FE",
    tagline: "Xây dựng giao diện responsive chuẩn quốc tế với HTML5, CSS3 3D & JavaScript",
    icon: Layers,
    color: "#7c3aed",
    bgGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))",
    runtime: "HTML5 / CSS3 / JavaScript (V8)",
    modulesCount: 8,
    highlightTopics: [
      "Module 1: Cấu trúc thẻ ngữ nghĩa HTML5 & SEO cơ bản",
      "Module 2: CSS Flexbox & CSS Grid bố cục đa thiết bị",
      "Module 3: CSS3 Keyframes & Hiệu ứng 3D Transform",
      "Module 4: JavaScript DOM Manipulation & Bắt sự kiện",
      "Module 5: Xử lý Bất đồng bộ Async/Await & Fetch API",
      "Module 6: Kiến trúc Component hóa Next.js & TypeScript"
    ],
    sampleQuestion: "Thuộc tính CSS nào cho phép kích hoạt không gian 3D cho các phần tử con?",
    sampleCode: ".card-3d {\n  transform: perspective(1000px) rotateY(15deg);\n  transition: transform 0.3s ease;\n}"
  },
  {
    id: "java_core",
    name: "Lập Trình Hướng Đối Tượng Java Core",
    code: "JAVA_OOP",
    tagline: "Lập trình hướng đối tượng chuyên sâu, 4 trụ cột OOP & Generic Collections",
    icon: Cpu,
    color: "#d97706",
    bgGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))",
    runtime: "Java 21 / OpenJDK",
    modulesCount: 7,
    highlightTopics: [
      "Chương 1: Cú pháp Java, JVM, JRE & Garbage Collection",
      "Chương 2: Lớp (Class), Đối tượng (Object) & Constructor",
      "Chương 3: Đóng gói (Encapsulation) & Kế thừa (Inheritance)",
      "Chương 4: Đa hình (Polymorphism) & Trừu tượng (Abstraction)",
      "Chương 5: Java Collections Framework (ArrayList, HashMap, Set)",
      "Chương 6: Xử lý ngoại lệ Exception & Đọc ghi tệp tin I/O"
    ],
    sampleQuestion: "Từ khóa nào trong Java dùng để ngăn cản một class bị kế thừa?",
    sampleCode: "public final class SecurityConfig {\n    // Không thể kế thừa\n}"
  }
];

export default function SubjectMatrixLayer() {
  const [selectedTrack, setSelectedTrack] = useState<SubjectTrack>(TRACKS[0]);

  return (
    <section style={{ marginBottom: "4rem" }}>
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "2.2rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(37, 99, 235, 0.08)",
          color: "var(--brand-primary)",
          padding: "0.3rem 0.85rem",
          borderRadius: "var(--radius-full)",
          fontSize: "0.8rem",
          fontWeight: 800,
          marginBottom: "0.6rem"
        }}>
          <Code2 size={14} />
          <span>DANH MỤC KHÓA HỌC CHUẨN ĐẦU RA</span>
        </div>

        <h2 style={{ fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "0.4rem" }}>
          Ma Trận Đào Tạo 4 Bộ Môn Lập Trình Trọng Điểm
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "650px", margin: "0 auto" }}>
          Chương trình biên soạn độc quyền của Tin Học Sao Việt, kết hợp bài giảng lý thuyết cô đọng và thực chiến phòng máy 100%.
        </p>
      </div>

      {/* Main Grid: Left track selector & Right curriculum inspector */}
      <div 
        className="hero-grid-responsive"
        style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "1.5rem", alignItems: "stretch" }}
      >
        {/* Left Column: 4 Subject Selector Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {TRACKS.map((track) => {
            const Icon = track.icon;
            const isSelected = selectedTrack.id === track.id;

            return (
              <TiltCard3D key={track.id} maxTilt={6} scale={1.01}>
                <div
                  onClick={() => setSelectedTrack(track)}
                  className="q-card"
                  style={{
                    cursor: "pointer",
                    padding: "1.2rem 1.4rem",
                    border: isSelected ? `2px solid ${track.color}` : "1px solid var(--border-light)",
                    background: isSelected ? track.bgGradient : "var(--surface-card)",
                    boxShadow: isSelected ? `0 10px 25px -5px rgba(0, 0, 0, 0.08)` : "var(--shadow-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "var(--radius-md)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: isSelected ? track.color : "var(--surface-subtle)",
                      color: isSelected ? "#ffffff" : track.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.25s ease"
                    }}>
                      <Icon size={22} />
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 800, color: track.color, background: "rgba(0,0,0,0.04)", padding: "1px 6px", borderRadius: "4px" }}>
                          {track.code}
                        </span>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0 }}>{track.name}</h3>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.2rem 0 0" }}>
                        {track.modulesCount} chương học • {track.runtime}
                      </p>
                    </div>
                  </div>

                  <ChevronRight size={18} color={isSelected ? track.color : "#94a3b8"} />
                </div>
              </TiltCard3D>
            );
          })}
        </div>

        {/* Right Column: Detailed Interactive Syllabus Card */}
        <TiltCard3D maxTilt={5} scale={1.01}>
          <div className="q-card" style={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderTop: `4px solid ${selectedTrack.color}`,
            background: "var(--surface-card)",
            height: "100%",
            borderRadius: "var(--radius-lg)"
          }}>
            <div>
              {/* Header info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem" }}>
                <div>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: selectedTrack.color,
                    background: `${selectedTrack.color}15`,
                    padding: "0.2rem 0.6rem",
                    borderRadius: "var(--radius-full)",
                    display: "inline-block",
                    marginBottom: "0.4rem"
                  }}>
                    CHI TIẾT CHƯƠNG TRÌNH ĐÀO TẠO
                  </span>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)" }}>
                    {selectedTrack.name}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                    {selectedTrack.tagline}
                  </p>
                </div>
              </div>

              {/* Module Topics Checklist */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.6rem", letterSpacing: "0.04em" }}>
                  Lộ Trình Các Chương Trọng Điểm:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                  {selectedTrack.highlightTopics.map((topic, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                      <CheckCircle2 size={16} color={selectedTrack.color} style={{ minWidth: "16px", marginTop: "3px" }} />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Code Preview */}
              <div style={{
                background: "#070d19",
                border: "1px solid #1e293b",
                borderRadius: "var(--radius-md)",
                padding: "0.9rem 1.1rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
                marginBottom: "1.5rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "0.72rem", marginBottom: "0.3rem" }}>
                  <span># Câu hỏi trích đoạn mẫu:</span>
                  <span style={{ color: selectedTrack.color }}>{selectedTrack.runtime}</span>
                </div>
                <div style={{ color: "#f8fafc", marginBottom: "0.4rem", fontWeight: 600 }}>
                  Q: {selectedTrack.sampleQuestion}
                </div>
                <pre style={{ margin: 0, color: "#38bdf8", overflowX: "auto" }}>
                  {selectedTrack.sampleCode}
                </pre>
              </div>
            </div>

            {/* Bottom CTA to study page */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Chứng nhận cấp bởi <strong>Tin Học Sao Việt</strong>
              </div>
              <Link href="/study" className="btn btn-primary btn-sm" style={{ gap: "0.4rem" }}>
                <span>Vào Ôn Luyện Bộ Môn Này</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </TiltCard3D>
      </div>
    </section>
  );
}
