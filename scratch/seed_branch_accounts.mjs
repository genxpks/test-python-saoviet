import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb+srv://genxpks_db_user:WCxt4C4P6gcbnxlD@cluster0.2w5nhw1.mongodb.net/test_python_saoviet?retryWrites=true&w=majority&appName=Cluster0";

export const BRANCHES_DATA = [
  {
    id: "branch_binhthanh",
    name: "Chi Nhánh Bình Thạnh",
    code: "BT_HCM",
    address: "Số 475A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP.HCM",
    phone: "0904.567.890",
    managerName: "Quản Lý Bình Thạnh",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_quan7",
    name: "Chi Nhánh Quận 7",
    code: "Q7_HCM",
    address: "Số 512 Huỳnh Tấn Phát, Phường Bình Thuận, Quận 7, TP.HCM",
    phone: "0905.123.456",
    managerName: "Quản Lý Quận 7",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_binhtan",
    name: "Chi Nhánh Bình Tân",
    code: "BTA_HCM",
    address: "Số 135 Kinh Dương Vương, Phường An Lạc, Quận Bình Tân, TP.HCM",
    phone: "0906.234.567",
    managerName: "Quản Lý Bình Tân",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_quan12",
    name: "Chi Nhánh Quận 12",
    code: "Q12_HCM",
    address: "Số 186 Tô Ký, Phường Tân Chánh Hiệp, Quận 12, TP.HCM",
    phone: "0907.345.678",
    managerName: "Quản Lý Quận 12",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_thuduc",
    name: "Chi Nhánh TP. Thủ Đức",
    code: "TD_HCM",
    address: "Khu Đô Thị ĐHQG TP.HCM / Đường số 9, P. Linh Tây, TP. Thủ Đức",
    phone: "0901.234.567",
    managerName: "Quản Lý Thủ Đức",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_tanbinh",
    name: "Chi Nhánh Tân Bình",
    code: "TB_HCM",
    address: "Số 268 Lý Thường Kiệt, Phường 14, Quận Tân Bình, TP.HCM",
    phone: "0908.456.789",
    managerName: "Quản Lý Tân Bình",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_thudaumot",
    name: "Chi Nhánh Thủ Dầu Một",
    code: "TDM_BD",
    address: "Số 234 Đại Lộ Bình Dương, Phường Phú Hòa, TP. Thủ Dầu Một, Bình Dương",
    phone: "0909.567.890",
    managerName: "Quản Lý Thủ Dầu Một",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_thuanan",
    name: "Chi Nhánh Thuận An",
    code: "TA_BD",
    address: "Số 88 Cách Mạng Tháng 8, Phường Lái Thiêu, TP. Thuận An, Bình Dương",
    phone: "0910.678.901",
    managerName: "Quản Lý Thuận An",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_dian",
    name: "Chi Nhánh Dĩ An",
    code: "DA_BD",
    address: "Số 168 Nguyễn An Ninh, Phường Dĩ An, TP. Dĩ An, Bình Dương",
    phone: "0911.789.012",
    managerName: "Quản Lý Dĩ An",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_tanuyen",
    name: "Chi Nhánh Tân Uyên",
    code: "TU_BD",
    address: "Đường ĐT 746, Phường Uyên Hưng, TP. Tân Uyên, Bình Dương",
    phone: "0912.890.123",
    managerName: "Quản Lý Tân Uyên",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_bienhoa",
    name: "Chi Nhánh Biên Hòa",
    code: "BH_DN",
    address: "Số 56 Đồng Khởi, Phường Tân Hiệp, TP. Biên Hòa, Đồng Nai",
    phone: "0913.901.234",
    managerName: "Quản Lý Biên Hòa",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_longthanh",
    name: "Chi Nhánh Long Thành",
    code: "LT_DN",
    address: "Số 12 Khu Phước Hải, Thị Trấn Long Thành, Huyện Long Thành, Đồng Nai",
    phone: "0914.012.345",
    managerName: "Quản Lý Long Thành",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  },
  {
    id: "branch_vungtau",
    name: "Chi Nhánh Vũng Tàu",
    code: "VT_BRVT",
    address: "Số 207 Lê Hồng Phong, Phường 8, TP. Vũng Tàu, Bà Rịa - Vũng Tàu",
    phone: "0915.123.456",
    managerName: "Quản Lý Vũng Tàu",
    defaultTeacherPin: "8888",
    createdDate: "2026-08-29"
  }
];

export const BRANCH_USERS_DATA = [
  {
    id: "bm_binhthanh",
    username: "binhthanh@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Bình Thạnh",
    role: "branch_manager",
    branchId: "branch_binhthanh",
    branchName: "Chi Nhánh Bình Thạnh",
    phone: "0904567890",
    email: "binhthanh@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_quan7",
    username: "quan7@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Quận 7",
    role: "branch_manager",
    branchId: "branch_quan7",
    branchName: "Chi Nhánh Quận 7",
    phone: "0905123456",
    email: "quan7@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_binhtan",
    username: "binhtan@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Bình Tân",
    role: "branch_manager",
    branchId: "branch_binhtan",
    branchName: "Chi Nhánh Bình Tân",
    phone: "0906234567",
    email: "binhtan@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_quan12",
    username: "quan12@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Quận 12",
    role: "branch_manager",
    branchId: "branch_quan12",
    branchName: "Chi Nhánh Quận 12",
    phone: "0907345678",
    email: "quan12@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_thuduc",
    username: "thuduc@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Thủ Đức",
    role: "branch_manager",
    branchId: "branch_thuduc",
    branchName: "Chi Nhánh TP. Thủ Đức",
    phone: "0901234567",
    email: "thuduc@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_tanbinh",
    username: "tanbinh@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Tân Bình",
    role: "branch_manager",
    branchId: "branch_tanbinh",
    branchName: "Chi Nhánh Tân Bình",
    phone: "0908456789",
    email: "tanbinh@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_thudaumot",
    username: "thudaumot@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Thủ Dầu Một",
    role: "branch_manager",
    branchId: "branch_thudaumot",
    branchName: "Chi Nhánh Thủ Dầu Một",
    phone: "0909567890",
    email: "thudaumot@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_thuanan",
    username: "thuanan@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Thuận An",
    role: "branch_manager",
    branchId: "branch_thuanan",
    branchName: "Chi Nhánh Thuận An",
    phone: "0910678901",
    email: "thuanan@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_dian",
    username: "dian@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Dĩ An",
    role: "branch_manager",
    branchId: "branch_dian",
    branchName: "Chi Nhánh Dĩ An",
    phone: "0911789012",
    email: "dian@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_tanuyen",
    username: "tanuyen@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Tân Uyên",
    role: "branch_manager",
    branchId: "branch_tanuyen",
    branchName: "Chi Nhánh Tân Uyên",
    phone: "0912890123",
    email: "tanuyen@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_bienhoa",
    username: "bienhoa@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Biên Hòa",
    role: "branch_manager",
    branchId: "branch_bienhoa",
    branchName: "Chi Nhánh Biên Hòa",
    phone: "0913901234",
    email: "bienhoa@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_longthanh",
    username: "longthanh@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Long Thành",
    role: "branch_manager",
    branchId: "branch_longthanh",
    branchName: "Chi Nhánh Long Thành",
    phone: "0914012345",
    email: "longthanh@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  },
  {
    id: "bm_vungtau",
    username: "vungtau@saoviet",
    password: "saoviet@2026",
    fullName: "Quản Lý Chi Nhánh Vũng Tàu",
    role: "branch_manager",
    branchId: "branch_vungtau",
    branchName: "Chi Nhánh Vũng Tàu",
    phone: "0915123456",
    email: "vungtau@saoviet",
    pin: "8888",
    status: "active",
    totalStudySeconds: 0,
    enrolledSubjects: ["python", "c", "cpp", "csharp", "java", "typescript", "web_basic"],
    createdDate: "2026-08-29"
  }
];

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("test_python_saoviet");
  
  console.log("Upserting 13 branches into 'branches' collection...");
  const branchesCol = db.collection("branches");
  for (const b of BRANCHES_DATA) {
    const res = await branchesCol.updateOne(
      { id: b.id },
      { $set: b },
      { upsert: true }
    );
    console.log(`Branch [${b.code}] ${b.name}: ${res.upsertedCount > 0 ? "Created" : "Updated"}`);
  }

  console.log("\nUpserting 13 branch manager accounts into 'users' collection...");
  const usersCol = db.collection("users");
  for (const u of BRANCH_USERS_DATA) {
    const res = await usersCol.updateOne(
      { username: u.username },
      { $set: u },
      { upsert: true }
    );
    console.log(`User [${u.username}] (${u.fullName}) -> Role: ${u.role}: ${res.upsertedCount > 0 ? "Created" : "Updated"}`);
  }

  const totalBranches = await branchesCol.countDocuments();
  const totalUsers = await usersCol.countDocuments();
  console.log(`\n🎉 Seed Completed successfully!`);
  console.log(`Total branches in DB: ${totalBranches}`);
  console.log(`Total users in DB: ${totalUsers}`);

  await client.close();
}

run().catch(err => {
  console.error("❌ Seeder Error:", err);
  process.exit(1);
});
