"use client";

import { useState } from "react";
import { 
  FileCode2, Terminal, Layers, Cpu, Globe, Smartphone,
  Server, Database, Code2, Braces, Zap, Layout, GitBranch
} from "lucide-react";
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
  group: "foundation" | "web" | "mobile" | "backend";
  level: "Căn bản" | "Trung cấp" | "Nâng cao";
  jobRole: string;
}

const GROUPS = [
  { id: "all",        label: "Tất Cả",       emoji: "🎯", color: "#64748b" },
  { id: "foundation", label: "Nền Tảng",     emoji: "🧱", color: "#2563eb" },
  { id: "web",        label: "Web / UI",     emoji: "🌐", color: "#7c3aed" },
  { id: "mobile",     label: "Mobile App",  emoji: "📱", color: "#059669" },
  { id: "backend",    label: "Backend / API",emoji: "⚙️", color: "#d97706" },
];

const ALL_TRACKS: SubjectTrack[] = [
  // ─────────── NHÓM NỀN TẢNG ───────────
  {
    id: "python_advanced",
    name: "Python Nâng Cao & Automation",
    code: "PY",
    tagline: "Xử lý dữ liệu, Turtle Graphics, tự động hóa Excel & web scraping",
    icon: FileCode2,
    color: "#3b82f6",
    bgGradient: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(6,182,212,0.05))",
    runtime: "Python 3.12",
    modulesCount: 5,
    group: "foundation",
    level: "Trung cấp",
    jobRole: "Data Analyst, Automation Engineer",
    highlightTopics: [
      "Chương 1: Đồ họa hình học Turtle Graphics & thư viện math/random",
      "Chương 2: Xử lý chuỗi String, slicing & chuẩn hóa dữ liệu",
      "Chương 3: Cấu trúc mảng List, Tuple & Dictionary từ điển",
      "Chương 4: Xây dựng hàm def, đối số & giá trị return",
      "Chương 5: Tự động hóa Excel (openpyxl), web scraping & gửi email"
    ],
    sampleQuestion: "Phương thức nào trong Python dùng để tách chuỗi thành danh sách các từ?",
    sampleCode: "words = 'Tin Hoc Sao Viet'.split(' ')\nprint(f'Số từ: {len(words)}')  # -> 4"
  },
  {
    id: "c_cpp",
    name: "Lập Trình C / C++ Căn Bản",
    code: "C++",
    tagline: "Tư duy giải thuật nền tảng, quản lý bộ nhớ, con trỏ & cấu trúc dữ liệu",
    icon: Terminal,
    color: "#059669",
    bgGradient: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.05))",
    runtime: "C++17 / GCC",
    modulesCount: 6,
    group: "foundation",
    level: "Căn bản",
    jobRole: "Systems Developer, Embedded Engineer",
    highlightTopics: [
      "Module 1: Kiểu dữ liệu nguyên thủy, toán tử & nhập/xuất I/O",
      "Module 2: Cấu trúc rẽ nhánh if/else & switch/case",
      "Module 3: Vòng lặp for, while, do-while & mảng 1 chiều",
      "Module 4: Mảng 2 chiều ma trận & chuỗi ký tự C-string",
      "Module 5: Con trỏ (Pointers), cấp phát động & Struct",
      "Module 6: Hàm, truyền tham trị / tham chiếu & Đệ quy"
    ],
    sampleQuestion: "Toán tử nào trong C++ dùng để lấy địa chỉ ô nhớ của một biến?",
    sampleCode: "int x = 100;\nint* ptr = &x;\nstd::cout << *ptr; // in ra 100"
  },
  {
    id: "java_core",
    name: "Lập Trình Java Core (OOP)",
    code: "Java",
    tagline: "Hướng đối tượng chuyên sâu, 4 trụ cột OOP & Generic Collections Framework",
    icon: Cpu,
    color: "#f59e0b",
    bgGradient: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.05))",
    runtime: "Java 21 / OpenJDK",
    modulesCount: 7,
    group: "foundation",
    level: "Trung cấp",
    jobRole: "Java Developer, Enterprise Developer",
    highlightTopics: [
      "Chương 1: Cú pháp Java, JVM, JRE & Garbage Collection",
      "Chương 2: Lớp (Class), Đối tượng (Object) & Constructor",
      "Chương 3: Đóng gói (Encapsulation) & Kế thừa (Inheritance)",
      "Chương 4: Đa hình (Polymorphism) & Trừu tượng (Abstraction)",
      "Chương 5: Java Collections Framework (ArrayList, HashMap, Set)",
      "Chương 6: Xử lý ngoại lệ Exception & Đọc ghi tệp tin I/O",
      "Chương 7: Multithreading & Java Stream API (Java 8+)"
    ],
    sampleQuestion: "Từ khóa nào trong Java ngăn cản một class bị kế thừa?",
    sampleCode: "public final class SecurityConfig {\n    // Không thể kế thừa\n}"
  },
  {
    id: "csharp",
    name: "Lập Trình C# .NET",
    code: "C#",
    tagline: "Ngôn ngữ Microsoft mạnh mẽ, LINQ, Entity Framework & phát triển đa nền tảng",
    icon: Code2,
    color: "#8b5cf6",
    bgGradient: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(124,58,237,0.05))",
    runtime: ".NET 8 / C# 12",
    modulesCount: 7,
    group: "foundation",
    level: "Trung cấp",
    jobRole: "C# Developer, .NET Engineer",
    highlightTopics: [
      "Chương 1: Cú pháp C#, kiểu dữ liệu, namespace & using",
      "Chương 2: OOP nâng cao — Interface, Abstract, Generic & Delegate",
      "Chương 3: LINQ to Objects — query, filter, aggregate dữ liệu",
      "Chương 4: Async/Await, Task & xử lý lỗi Exception Handling",
      "Chương 5: Entity Framework Core — Code First & DB Migration",
      "Chương 6: Xây dựng WinForms / WPF desktop application",
      "Chương 7: Unit Testing với xUnit & Mocking pattern"
    ],
    sampleQuestion: "LINQ trong C# viết tắt của cụm từ nào và dùng để làm gì?",
    sampleCode: "var khoaHoc = courses\n    .Where(c => c.Active)\n    .OrderBy(c => c.Name)\n    .Select(c => c.Name)\n    .ToList();"
  },
  // ─────────── NHÓM WEB / UI ───────────
  {
    id: "html_css_js",
    name: "HTML5 / CSS3 / JavaScript",
    code: "JS",
    tagline: "Bộ ba nền tảng Web: cấu trúc ngữ nghĩa, bố cục responsive & DOM tương tác",
    icon: Globe,
    color: "#f97316",
    bgGradient: "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(234,88,12,0.05))",
    runtime: "Browser / V8 Engine",
    modulesCount: 8,
    group: "web",
    level: "Căn bản",
    jobRole: "Frontend Developer, Web Designer",
    highlightTopics: [
      "Module 1: Cấu trúc thẻ ngữ nghĩa HTML5 & SEO cơ bản",
      "Module 2: CSS Flexbox & CSS Grid bố cục đa thiết bị",
      "Module 3: CSS3 Keyframes Animations & 3D Transform",
      "Module 4: JavaScript DOM Manipulation & Event Handling",
      "Module 5: Fetch API, JSON & Async/Await bất đồng bộ",
      "Module 6: ES6+ — Arrow Functions, Destructuring, Spread",
      "Module 7: Module bundler (Vite) & quản lý packages npm",
      "Module 8: Dự án thực tế: Website bán hàng responsive 5 trang"
    ],
    sampleQuestion: "Thuộc tính CSS nào kích hoạt không gian 3D cho phần tử con?",
    sampleCode: ".card-3d {\n  transform-style: preserve-3d;\n  perspective: 1000px;\n}"
  },
  {
    id: "typescript",
    name: "TypeScript Chuyên Sâu",
    code: "TS",
    tagline: "Typed JavaScript — type system mạnh mẽ, generic, decorators & strict mode",
    icon: Braces,
    color: "#0ea5e9",
    bgGradient: "linear-gradient(135deg, rgba(14,165,233,0.12), rgba(2,132,199,0.05))",
    runtime: "TypeScript 5.x / tsc",
    modulesCount: 6,
    group: "web",
    level: "Trung cấp",
    jobRole: "TypeScript Developer, Senior Frontend",
    highlightTopics: [
      "Module 1: Type System cơ bản — primitive, union, intersection & literal",
      "Module 2: Interface vs Type Alias & Optional / Readonly properties",
      "Module 3: Generic Functions & Generic Classes",
      "Module 4: Decorators, Enums & Namespace module pattern",
      "Module 5: Strict Mode, Type Guards & Narrowing kỹ thuật nâng cao",
      "Module 6: Tích hợp TypeScript với React & Next.js project thực tế"
    ],
    sampleQuestion: "TypeScript dùng `keyof typeof obj` để làm gì trong type system?",
    sampleCode: "type CourseKey = keyof typeof courseMap;\n// -> 'python' | 'react' | 'nodejs'"
  },
  {
    id: "php",
    name: "Lập Trình PHP & Web Động",
    code: "PHP",
    tagline: "Xây dựng website động server-side, kết nối MySQL & triển khai dự án web truyền thống",
    icon: Layout,
    color: "#6366f1",
    bgGradient: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(79,70,229,0.05))",
    runtime: "PHP 8.3 / Apache",
    modulesCount: 6,
    group: "web",
    level: "Căn bản",
    jobRole: "PHP Developer, WordPress Developer",
    highlightTopics: [
      "Module 1: Cú pháp PHP, biến, mảng & hàm cơ bản",
      "Module 2: Form xử lý dữ liệu & validation phía server",
      "Module 3: Kết nối MySQL với PDO & truy vấn CRUD",
      "Module 4: Session, Cookie & xác thực người dùng",
      "Module 5: OOP trong PHP — Class, Inheritance & Trait",
      "Module 6: Dự án: Hệ thống quản lý học viên MVC đơn giản"
    ],
    sampleQuestion: "Trong PHP, hàm nào dùng để ngăn chặn SQL Injection khi dùng PDO?",
    sampleCode: "$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');\n$stmt->execute([$id]);"
  },
  {
    id: "react",
    name: "Lập Trình React (Component UI)",
    code: "React",
    tagline: "Thư viện UI mạnh nhất 2024 — hooks, state management & component architecture",
    icon: Zap,
    color: "#06b6d4",
    bgGradient: "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(8,145,178,0.05))",
    runtime: "React 18 / Vite",
    modulesCount: 8,
    group: "web",
    level: "Trung cấp",
    jobRole: "React Developer, UI Engineer",
    highlightTopics: [
      "Module 1: JSX, Functional Component & Props truyền dữ liệu",
      "Module 2: useState, useEffect & Lifecycle trong Hooks",
      "Module 3: useContext, useRef & Custom Hooks tự tạo",
      "Module 4: React Router DOM v6 & Single Page Application",
      "Module 5: State management với Zustand & React Query",
      "Module 6: Gọi API với Axios & xử lý Loading / Error State",
      "Module 7: Tối ưu hiệu năng — useMemo, useCallback & React.memo",
      "Module 8: Dự án thực tế: E-commerce SPA với Cart & Auth"
    ],
    sampleQuestion: "Hook nào trong React dùng để tránh tính toán lại giá trị mỗi lần re-render?",
    sampleCode: "const total = useMemo(() => {\n  return cart.reduce((sum, item) => sum + item.price, 0);\n}, [cart]);"
  },
  {
    id: "nextjs",
    name: "Lập Trình Next.js Fullstack",
    code: "Next",
    tagline: "Framework React production-ready — App Router, SSR/SSG, API Routes & Vercel deploy",
    icon: Layers,
    color: "#1e293b",
    bgGradient: "linear-gradient(135deg, rgba(30,41,59,0.12), rgba(15,23,42,0.05))",
    runtime: "Next.js 14 / App Router",
    modulesCount: 9,
    group: "web",
    level: "Nâng cao",
    jobRole: "Fullstack Developer, Next.js Engineer",
    highlightTopics: [
      "Module 1: App Router, File-based Routing & Layout nesting",
      "Module 2: Server Components vs Client Components chiến lược",
      "Module 3: Server Actions, Form xử lý & Mutations pattern",
      "Module 4: Static Site Generation (SSG) & Incremental Static Regeneration",
      "Module 5: API Routes (Route Handlers) & Middleware xác thực",
      "Module 6: Tích hợp Prisma ORM & PostgreSQL / MongoDB",
      "Module 7: NextAuth.js — Google, GitHub OAuth & JWT",
      "Module 8: Image Optimization, Font loading & SEO metadata",
      "Module 9: Deploy Vercel — CI/CD, environment variables & monitoring"
    ],
    sampleQuestion: "Sự khác biệt chính giữa Server Component và Client Component trong Next.js 14?",
    sampleCode: "// Server Component (mặc định)\nasync function CourseList() {\n  const data = await fetch('https://api.saoviet.edu.vn/courses');\n  return <div>{data.courses.map(c => <CourseCard key={c.id} {...c} />)}</div>;\n}"
  },
  // ─────────── NHÓM MOBILE ───────────
  {
    id: "android",
    name: "Lập Trình Android (Kotlin)",
    code: "Android",
    tagline: "Phát triển ứng dụng Android native với Kotlin, Jetpack Compose & Firebase",
    icon: Smartphone,
    color: "#22c55e",
    bgGradient: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(21,128,61,0.05))",
    runtime: "Kotlin / Android Studio",
    modulesCount: 8,
    group: "mobile",
    level: "Trung cấp",
    jobRole: "Android Developer, Mobile Engineer",
    highlightTopics: [
      "Module 1: Cú pháp Kotlin — null safety, data class & coroutines",
      "Module 2: Activity, Fragment & Navigation Component",
      "Module 3: Jetpack Compose — Composable UI & State management",
      "Module 4: ViewModel, LiveData & Repository pattern (MVVM)",
      "Module 5: Room Database & Hilt Dependency Injection",
      "Module 6: Retrofit API calls & JSON deserialization Gson",
      "Module 7: Firebase Authentication, Firestore & Cloud Messaging",
      "Module 8: Dự án: App quản lý khóa học hoàn chỉnh lên Play Store"
    ],
    sampleQuestion: "Trong Jetpack Compose, `remember { mutableStateOf() }` dùng để làm gì?",
    sampleCode: "@Composable\nfun Counter() {\n    var count by remember { mutableStateOf(0) }\n    Button(onClick = { count++ }) {\n        Text(\"Clicked: $count\")\n    }\n}"
  },
  // ─────────── NHÓM BACKEND / API ───────────
  {
    id: "nodejs",
    name: "Backend Node.js & Express",
    code: "Node",
    tagline: "Xây dựng RESTful API production-ready với Node.js, Express & JWT authentication",
    icon: Server,
    color: "#16a34a",
    bgGradient: "linear-gradient(135deg, rgba(22,163,74,0.12), rgba(15,118,54,0.05))",
    runtime: "Node.js 20 LTS / Express",
    modulesCount: 8,
    group: "backend",
    level: "Trung cấp",
    jobRole: "Node.js Developer, Backend Engineer",
    highlightTopics: [
      "Module 1: Node.js runtime, EventLoop & module system (CommonJS/ESM)",
      "Module 2: Express.js Router, Middleware & Error Handling",
      "Module 3: Kết nối MongoDB Atlas với Mongoose ODM",
      "Module 4: RESTful API design & JSON response chuẩn hóa",
      "Module 5: JWT Authentication, bcrypt & Refresh Token pattern",
      "Module 6: File upload Multer, email NodeMailer & Cloudinary",
      "Module 7: Input validation (Zod/Joi), Rate Limiting & CORS",
      "Module 8: Deploy trên Railway / Render & CI/CD với GitHub Actions"
    ],
    sampleQuestion: "Middleware nào trong Express dùng để parse body dạng JSON từ request?",
    sampleCode: "app.use(express.json());\n\napp.post('/api/enroll', async (req, res) => {\n  const { studentId, courseId } = req.body;\n  // ...\n});"
  },
  {
    id: "aspnet",
    name: "Backend ASP.NET Core",
    code: "ASP.NET",
    tagline: "Microsoft ecosystem — REST API, Entity Framework Core, SignalR & Clean Architecture",
    icon: Database,
    color: "#dc2626",
    bgGradient: "linear-gradient(135deg, rgba(220,38,38,0.12), rgba(185,28,28,0.05))",
    runtime: "ASP.NET Core 8 / .NET 8",
    modulesCount: 8,
    group: "backend",
    level: "Nâng cao",
    jobRole: "ASP.NET Developer, .NET Backend Engineer",
    highlightTopics: [
      "Module 1: ASP.NET Core MVC & Web API architecture",
      "Module 2: Dependency Injection & Service Container pattern",
      "Module 3: Entity Framework Core — Migration & LINQ queries",
      "Module 4: RESTful API với Controller, ActionResult & Swagger UI",
      "Module 5: JWT Bearer Authentication & Role-based Authorization",
      "Module 6: SignalR — Real-time communication & WebSocket",
      "Module 7: Clean Architecture — Domain, Application, Infrastructure layers",
      "Module 8: Docker containerize & deploy Azure App Service"
    ],
    sampleQuestion: "Decorator nào đánh dấu một class là API Controller trong ASP.NET Core?",
    sampleCode: "[ApiController]\n[Route(\"api/[controller]\")]\npublic class CoursesController : ControllerBase {\n    [HttpGet]\n    public async Task<IActionResult> GetAll() => Ok(await _svc.GetAllAsync());\n}"
  },
  {
    id: "springboot",
    name: "Java Spring Boot & REST API",
    code: "Spring",
    tagline: "Enterprise Java backend — IoC, JPA/Hibernate, Spring Security & microservices",
    icon: GitBranch,
    color: "#65a30d",
    bgGradient: "linear-gradient(135deg, rgba(101,163,13,0.12), rgba(77,124,15,0.05))",
    runtime: "Spring Boot 3 / Java 21",
    modulesCount: 9,
    group: "backend",
    level: "Nâng cao",
    jobRole: "Java Backend Developer, Spring Engineer",
    highlightTopics: [
      "Module 1: Spring Boot Auto-configuration & project structure",
      "Module 2: IoC Container, Dependency Injection & Bean lifecycle",
      "Module 3: Spring Data JPA & Hibernate ORM với MySQL/PostgreSQL",
      "Module 4: REST Controller, DTO pattern & ModelMapper",
      "Module 5: Spring Security — JWT, OAuth2 & method-level security",
      "Module 6: Spring Validation, Exception Handler & Error response",
      "Module 7: Spring Caching (Redis) & Async (@Async annotation)",
      "Module 8: Microservices với Spring Cloud & API Gateway",
      "Module 9: Deploy Docker + Kubernetes & monitoring Actuator"
    ],
    sampleQuestion: "Annotation nào trong Spring Boot khai báo một class là REST Controller kết hợp @Controller + @ResponseBody?",
    sampleCode: "@RestController\n@RequestMapping(\"/api/courses\")\npublic class CourseController {\n    @GetMapping\n    public List<Course> findAll() {\n        return courseService.findAll();\n    }\n}"
  }
];

export default function SubjectMatrixLayer() {
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedTrack, setSelectedTrack] = useState<SubjectTrack>(ALL_TRACKS[0]);

  const filteredTracks = selectedGroup === "all"
    ? ALL_TRACKS
    : ALL_TRACKS.filter(t => t.group === selectedGroup);

  // Nếu track đang chọn không nằm trong group đang lọc → tự động chọn track đầu tiên
  const currentTrack = filteredTracks.find(t => t.id === selectedTrack.id) ?? filteredTracks[0];

  const activeGroup = GROUPS.find(g => g.id === selectedGroup)!;

  return (
    <section style={{ marginBottom: "4rem" }}>
      {/* Header */}
      <CurriculumSectionHeader />

      {/* ── Group Filter Tab Bar ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.6rem",
        marginBottom: "1.8rem",
        padding: "0.8rem 1rem",
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-light)"
      }}>
        {GROUPS.map(group => {
          const isActive = selectedGroup === group.id;
          const count = group.id === "all"
            ? ALL_TRACKS.length
            : ALL_TRACKS.filter(t => t.group === group.id).length;
          return (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "var(--radius-full)",
                border: isActive ? `2px solid ${group.color}` : "1.5px solid var(--border-light)",
                background: isActive ? `${group.color}18` : "transparent",
                color: isActive ? group.color : "var(--text-muted)",
                fontWeight: isActive ? 800 : 600,
                fontSize: "0.83rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "all 0.2s ease"
              }}
            >
              <span>{group.emoji}</span>
              <span>{group.label}</span>
              <span style={{
                background: isActive ? group.color : "var(--border-medium)",
                color: "white",
                borderRadius: "999px",
                padding: "0.05rem 0.45rem",
                fontSize: "0.72rem",
                fontWeight: 900
              }}>{count}</span>
            </button>
          );
        })}

        {/* Summary tag */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
            {filteredTracks.length} khóa học •
          </span>
          <span style={{
            fontSize: "0.78rem",
            color: activeGroup.color,
            fontWeight: 800
          }}>{activeGroup.label}</span>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div
        className="hero-grid-responsive"
        style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "1.5rem", alignItems: "stretch" }}
      >
        {/* Left: Track Selector List (scrollable) */}
        <div style={{
          overflowY: "auto",
          maxHeight: "640px",
          paddingRight: "0.3rem",
          scrollbarWidth: "thin"
        }}>
          <SubjectTrackList
            tracks={filteredTracks}
            selectedTrackId={currentTrack.id}
            onSelectTrack={(track) => setSelectedTrack(track)}
          />
        </div>

        {/* Right: Syllabus Detail Panel (with extra fields) */}
        <div className="sticky-inspector-panel">
          <SyllabusInspectorPanel selectedTrack={{
            ...currentTrack,
            // Inject extra meta for display
            levelBadge: currentTrack.level,
            jobRoleBadge: currentTrack.jobRole
          }} />

          {/* Extra: Level & Job role badge bar */}
          <div style={{
            display: "flex",
            gap: "0.6rem",
            marginTop: "0.8rem",
            flexWrap: "wrap"
          }}>
            <span style={{
              padding: "0.3rem 0.85rem",
              borderRadius: "var(--radius-full)",
              background: `${currentTrack.color}18`,
              color: currentTrack.color,
              fontSize: "0.78rem",
              fontWeight: 800,
              border: `1.5px solid ${currentTrack.color}40`
            }}>📊 {currentTrack.level}</span>
            <span style={{
              padding: "0.3rem 0.85rem",
              borderRadius: "var(--radius-full)",
              background: "var(--surface-elevated)",
              color: "var(--text-secondary)",
              fontSize: "0.78rem",
              fontWeight: 700,
              border: "1.5px solid var(--border-medium)"
            }}>💼 {currentTrack.jobRole}</span>
            <span style={{
              padding: "0.3rem 0.85rem",
              borderRadius: "var(--radius-full)",
              background: "var(--surface-elevated)",
              color: "var(--text-secondary)",
              fontSize: "0.78rem",
              fontWeight: 700,
              border: "1.5px solid var(--border-medium)"
            }}>⚡ {currentTrack.runtime}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
