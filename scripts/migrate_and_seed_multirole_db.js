// scripts/migrate_and_seed_multirole_db.js - Tái cấu trúc CSDL MongoDB Atlas đa môn, đa chi nhánh & 3 roles
// Đơn vị: TRUNG TÂM TIN HỌC SAO VIỆT
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Load .env.local if available
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ Lỗi: Chưa tìm thấy biến môi trường MONGODB_URI trong .env.local");
  process.exit(1);
}

async function migrateAndSeed() {
  console.log("🚀 Đang kết nối tới MongoDB Atlas...");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Kết nối MongoDB Atlas thành công!");

    const db = client.db("test_python_saoviet");

    // 1. SEED COLLECTION: branches
    console.log("🏢 Đang khởi tạo collection 'branches' (Danh sách Chi nhánh)...");
    const bCol = db.collection("branches");
    await bCol.deleteMany({});
    const defaultBranches = [
      {
        id: "branch_thuduc",
        name: "Chi Nhánh TP. Thủ Đức",
        code: "TD_HCM",
        address: "Khu Đô Thị ĐHQG TP.HCM / Đường số 9, P. Linh Tây, TP. Thủ Đức",
        phone: "0901.234.567",
        managerName: "Thầy Nguyễn Duy Thiên",
        defaultTeacherPin: "8888",
        createdDate: "2026-08-29"
      },
      {
        id: "branch_quan1",
        name: "Chi Nhánh Quận 1 (Trung Tâm)",
        code: "Q1_HCM",
        address: "Số 15 Lê Duẩn, Phường Bến Nghé, Quận 1, TP.HCM",
        phone: "0902.345.678",
        managerName: "Cô Trần Thị Mai",
        defaultTeacherPin: "8888",
        createdDate: "2026-08-29"
      },
      {
        id: "branch_govap",
        name: "Chi Nhánh Gò Vấp",
        code: "GV_HCM",
        address: "Số 128 Quang Trung, Phường 10, Quận Gò Vấp, TP.HCM",
        phone: "0903.456.789",
        managerName: "Thầy Lê Hoàng Nam",
        defaultTeacherPin: "8888",
        createdDate: "2026-08-29"
      },
      {
        id: "branch_binhthanh",
        name: "Chi Nhánh Bình Thạnh",
        code: "BT_HCM",
        address: "Số 475A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP.HCM",
        phone: "0904.567.890",
        managerName: "Thầy Phạm Đức Minh",
        defaultTeacherPin: "8888",
        createdDate: "2026-08-29"
      }
    ];
    await bCol.insertMany(defaultBranches);
    console.log(`✅ Đã nạp ${defaultBranches.length} chi nhánh trung tâm.`);

    // 2. SEED COLLECTION: subjects
    console.log("📚 Đang khởi tạo collection 'subjects' (Danh mục Môn học & Ngôn ngữ)...");
    const sCol = db.collection("subjects");
    await sCol.deleteMany({});
    const defaultSubjects = [
      {
        id: "python_advanced",
        name: "Lập Trình Python Nâng Cao",
        code: "PY_NC",
        icon: "FileCode2",
        runtime: "python3",
        description: "Khóa học Python nâng cao: Chuỗi, List/Dict, Hàm, Thư viện chuẩn (Random, Math, Datetime) & Đồ họa Turtle Graphics.",
        totalModules: 5,
        isActive: true,
        createdDate: "2026-08-29"
      },
      {
        id: "cpp_basic",
        name: "Lập Trình C / C++ Căn Bản",
        code: "CPP_CB",
        icon: "Terminal",
        runtime: "cpp",
        description: "Nền tảng tư duy lập trình: Biến, Kiểu dữ liệu, Vòng lặp, Mảng 1D/2D, Con trỏ & Hàm trong C++.",
        totalModules: 6,
        isActive: true,
        createdDate: "2026-08-29"
      },
      {
        id: "web_frontend",
        name: "Lập Trình Web HTML5, CSS3, JavaScript",
        code: "WEB_FE",
        icon: "Layers",
        runtime: "html_css",
        description: "Xây dựng giao diện web chuẩn responsive, hiệu ứng CSS Keyframes và tương tác JavaScript DOM.",
        totalModules: 8,
        isActive: true,
        createdDate: "2026-08-29"
      },
      {
        id: "java_core",
        name: "Lập Trình Hướng Đối Tượng Java Core",
        code: "JAVA_OOP",
        icon: "Cpu",
        runtime: "java",
        description: "Lập trình hướng đối tượng OOP với Java: Đóng gói, Kế thừa, Đa hình, Trừu tượng & Collections Framework.",
        totalModules: 6,
        isActive: true,
        createdDate: "2026-08-29"
      }
    ];
    await sCol.insertMany(defaultSubjects);
    console.log(`✅ Đã nạp ${defaultSubjects.length} môn học ngôn ngữ lập trình.`);

    // 3. SEED COLLECTION: users (3 ROLES)
    console.log("👥 Đang khởi tạo collection 'users' (Tài khoản phân quyền 3 cấp)...");
    const uCol = db.collection("users");
    await uCol.deleteMany({});
    const defaultUsers = [
      // ROLE 1: ADMIN TỔNG
      {
        id: "admin",
        username: "admin",
        password: "saoviet2026",
        fullName: "Tổng Quản Trị Viên (Super Admin)",
        role: "admin",
        phone: "0901.888.999",
        email: "admin@tinhocsaoviet.edu.vn",
        pin: "8888",
        status: "active",
        createdDate: "2026-08-29"
      },
      // ROLE 2: QUẢN LÝ CHI NHÁNH & GIÁO VIÊN
      {
        id: "mgr_thuduc",
        username: "quanly_thuduc",
        password: "saoviet2026",
        fullName: "Thầy Nguyễn Duy Thiên",
        role: "branch_manager",
        branchId: "branch_thuduc",
        branchName: "Chi Nhánh TP. Thủ Đức",
        phone: "0901.234.567",
        email: "thuduc@tinhocsaoviet.edu.vn",
        pin: "8888",
        status: "active",
        createdDate: "2026-08-29"
      },
      {
        id: "mgr_quan1",
        username: "quanly_quan1",
        password: "saoviet2026",
        fullName: "Cô Trần Thị Mai",
        role: "branch_manager",
        branchId: "branch_quan1",
        branchName: "Chi Nhánh Quận 1 (Trung Tâm)",
        phone: "0902.345.678",
        email: "quan1@tinhocsaoviet.edu.vn",
        pin: "8888",
        status: "active",
        createdDate: "2026-08-29"
      },
      {
        id: "mgr_govap",
        username: "quanly_govap",
        password: "saoviet2026",
        fullName: "Thầy Lê Hoàng Nam",
        role: "branch_manager",
        branchId: "branch_govap",
        branchName: "Chi Nhánh Gò Vấp",
        phone: "0903.456.789",
        email: "govap@tinhocsaoviet.edu.vn",
        pin: "8888",
        status: "active",
        createdDate: "2026-08-29"
      },
      // ROLE 3: HỌC VIÊN
      {
        id: "hv01",
        username: "hocvien01",
        password: "123456",
        fullName: "Nguyễn Bảo Nam",
        role: "student",
        branchId: "branch_thuduc",
        branchName: "Chi Nhánh TP. Thủ Đức",
        class: "Python Nâng Cao K26",
        phone: "0912.001.001",
        status: "active",
        createdDate: "2026-08-29"
      },
      {
        id: "hv02",
        username: "hocvien02",
        password: "123456",
        fullName: "Trần Minh Khôi",
        role: "student",
        branchId: "branch_thuduc",
        branchName: "Chi Nhánh TP. Thủ Đức",
        class: "Python Nâng Cao K26",
        phone: "0912.001.002",
        status: "active",
        createdDate: "2026-08-29"
      },
      {
        id: "hv03",
        username: "saoviet01",
        password: "123456",
        fullName: "Lê Thu Hà",
        role: "student",
        branchId: "branch_quan1",
        branchName: "Chi Nhánh Quận 1 (Trung Tâm)",
        class: "Python Nâng Cao K26",
        phone: "0912.001.003",
        status: "active",
        createdDate: "2026-08-29"
      },
      {
        id: "hv04",
        username: "saoviet02",
        password: "123456",
        fullName: "Phạm Hoàng Long",
        role: "student",
        branchId: "branch_govap",
        branchName: "Chi Nhánh Gò Vấp",
        class: "Python Nâng Cao K26",
        phone: "0912.001.004",
        status: "active",
        createdDate: "2026-08-29"
      },
      {
        id: "hv05",
        username: "saoviet03",
        password: "123456",
        fullName: "Vũ Mỹ Linh",
        role: "student",
        branchId: "branch_binhthanh",
        branchName: "Chi Nhánh Bình Thạnh",
        class: "Python Nâng Cao K26",
        phone: "0912.001.005",
        status: "active",
        createdDate: "2026-08-29"
      }
    ];
    await uCol.insertMany(defaultUsers);
    console.log(`✅ Đã nạp ${defaultUsers.length} tài khoản người dùng theo 3 Role chuẩn.`);

    // 4. SEED COLLECTION: questions
    console.log("❓ Đang nạp 120 câu hỏi trắc nghiệm vào 'questions'...");
    const dataPath = path.join(__dirname, "..", "Ngan_Hang_120_Cau_Hoi", "questions_bank_full.json");
    const rawData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    const questions = rawData.questions.map(q => ({
      ...q,
      subjectId: "python_advanced",
      branchId: "all",
      difficulty: q.difficulty || "medium",
      createdAt: new Date().toISOString()
    }));

    const qCol = db.collection("questions");
    await qCol.deleteMany({});
    await qCol.insertMany(questions);
    console.log(`✅ Đã nạp ${questions.length} câu trắc nghiệm chuẩn hóa.`);

    // 5. SEED COLLECTION: practical_problems
    console.log("💻 Đang nạp 10 bài thực hành thuật toán vào 'practical_problems'...");
    const practicals = rawData.practical_problems.map(p => ({
      ...p,
      subjectId: "python_advanced",
      createdAt: new Date().toISOString()
    }));

    const pCol = db.collection("practical_problems");
    await pCol.deleteMany({});
    await pCol.insertMany(practicals);
    console.log(`✅ Đã nạp ${practicals.length} bài toán thực hành chuẩn hóa.`);

    console.log("\n🎉 TOÀN BỘ CƠ SỞ DỮ LIỆU ĐA MÔN, ĐA CHI NHÁNH & 3 ROLES ĐÃ ĐƯỢC TÁI CẤU TRÚC THÀNH CÔNG TRÊN MONGODB ATLAS!");
  } catch (err) {
    console.error("❌ Lỗi khi thực thi migration MongoDB:", err);
  } finally {
    await client.close();
  }
}

migrateAndSeed();
