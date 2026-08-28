// scripts/seed_mongodb.js - Script nạp toàn bộ 120 câu hỏi & 10 bài thực hành lên MongoDB Atlas
// Đọc connection URI từ biến môi trường MONGODB_URI
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ Lỗi: Vui lòng thiết lập biến môi trường MONGODB_URI trước khi chạy script này.");
  console.log("👉 Ví dụ: MONGODB_URI=\"mongodb+srv://...\" node scripts/seed_mongodb.js");
  process.exit(1);
}

async function seedDatabase() {
  console.log("🚀 Đang kết nối tới MongoDB Atlas...");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Kết nối MongoDB Atlas thành công!");

    const db = client.db("test_python_saoviet");

    // Đọc dữ liệu 120 câu hỏi và 10 bài tự luận
    const dataPath = path.join(__dirname, "..", "Ngan_Hang_120_Cau_Hoi", "questions_bank_full.json");
    const rawData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    const questions = rawData.questions;
    const practicals = rawData.practical_problems;

    // 1. Nạp 120 câu trắc nghiệm
    console.log(`📤 Đang nạp ${questions.length} câu trắc nghiệm lên collection 'questions'...`);
    const qCol = db.collection("questions");
    await qCol.deleteMany({});
    await qCol.insertMany(questions);
    console.log(`✅ Đã nạp thành công ${questions.length} câu trắc nghiệm (có đáp án & suy luận logic)!`);

    // 2. Nạp 10 bài thực hành tự luận
    console.log(`📤 Đang nạp ${practicals.length} bài thực hành lên collection 'practical_problems'...`);
    const pCol = db.collection("practical_problems");
    await pCol.deleteMany({});
    await pCol.insertMany(practicals);
    console.log(`✅ Đã nạp thành công ${practicals.length} bài tự luận thực hành (kèm code giải mẫu & test cases)!`);

    // 3. Nạp danh sách tài khoản học viên mẫu
    console.log("📤 Đang kiểm tra collection 'users'...");
    const uCol = db.collection("users");
    const usersCount = await uCol.countDocuments();
    if (usersCount === 0) {
      const defaultUsers = [
        {
          id: "admin",
          username: "admin",
          password: "saoviet2026",
          fullName: "Giáo Viên Quản Trị (Admin)",
          role: "teacher",
          pin: "8888",
          createdDate: "2026-08-28"
        },
        {
          id: "hv01",
          username: "hocvien01",
          password: "123456",
          fullName: "Nguyễn Bảo Nam",
          role: "student",
          class: "Python Nâng Cao K26",
          createdDate: "2026-08-28"
        },
        {
          id: "hv02",
          username: "hocvien02",
          password: "123456",
          fullName: "Trần Minh Khôi",
          role: "student",
          class: "Python Nâng Cao K26",
          createdDate: "2026-08-28"
        },
        {
          id: "hv03",
          username: "saoviet01",
          password: "123456",
          fullName: "Lê Thu Hà",
          role: "student",
          class: "Python Nâng Cao K26",
          createdDate: "2026-08-28"
        },
        {
          id: "hv04",
          username: "saoviet02",
          password: "123456",
          fullName: "Phạm Hoàng Long",
          role: "student",
          class: "Python Nâng Cao K26",
          createdDate: "2026-08-28"
        },
        {
          id: "hv05",
          username: "saoviet03",
          password: "123456",
          fullName: "Vũ Mỹ Linh",
          role: "student",
          class: "Python Nâng Cao K26",
          createdDate: "2026-08-28"
        }
      ];
      await uCol.insertMany(defaultUsers);
      console.log("✅ Đã nạp tài khoản giáo viên và học viên mẫu!");
    } else {
      console.log(`ℹ️ Collection 'users' đã có ${usersCount} tài khoản.`);
    }

    console.log("\n🎉 HOÀN TẤT ĐẨY TOÀN BỘ BỘ ĐỀ, ĐÁP ÁN & CODE LÊN MONGODB ATLAS!");
  } catch (err) {
    console.error("❌ Lỗi khi nạp dữ liệu lên MongoDB:", err);
  } finally {
    await client.close();
  }
}

seedDatabase();
