"use client";

import { useState } from "react";
import { 
  FileCode2, 
  Terminal, 
  Layers, 
  Cpu 
} from "lucide-react";

// 10 Atomic Micro-Components
import CurriculumSectionHeader from "./curriculum/CurriculumSectionHeader";
import SubjectTrackList from "./curriculum/SubjectTrackList";
import SyllabusInspectorPanel from "./curriculum/SyllabusInspectorPanel";

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
      {/* 1. Header Micro-Component */}
      <CurriculumSectionHeader />

      {/* 2. Main Grid: Left track list & Right syllabus inspector */}
      <div 
        className="hero-grid-responsive"
        style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "1.5rem", alignItems: "stretch" }}
      >
        {/* Left: 4 Subject Selector Cards */}
        <SubjectTrackList
          tracks={TRACKS}
          selectedTrackId={selectedTrack.id}
          onSelectTrack={setSelectedTrack}
        />

        {/* Right: Detailed Interactive Syllabus Inspector */}
        <SyllabusInspectorPanel selectedTrack={selectedTrack} />
      </div>
    </section>
  );
}
