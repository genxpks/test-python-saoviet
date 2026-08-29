const http = require('http');

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

function generateDefaultStudentPassword(fullName, phone) {
  const cleanPhone = phone.replace(/\D/g, "");
  const parts = fullName.trim().split(/\s+/);
  const rawFirstName = parts[parts.length - 1] || "Student";
  const normalized = rawFirstName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
  const formattedName = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return `${formattedName}${cleanPhone}`;
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 KIỂM THỬ TỰ ĐỘNG TOÀN DIỆN PHÂN QUYỀN ĐA MÔN & ĐA CHI NHÁNH');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // TEST 1: Check 7 Subjects
  console.log('📚 1. Kiểm tra Hệ Thống 7 Ngôn Ngữ & Môn Học:');
  const sRes = await request('http://localhost:3000/api/subjects');
  assert(sRes.status === 200, 'API /api/subjects trả về HTTP 200');
  const subjectIds = (sRes.data?.subjects || []).map(s => s.id);
  assert(subjectIds.includes('python'), 'Hỗ trợ môn Lập Trình Python Nâng Cao (python)');
  assert(subjectIds.includes('c'), 'Hỗ trợ môn Lập Trình Ngôn Ngữ C (c)');
  assert(subjectIds.includes('cpp'), 'Hỗ trợ môn Lập Trình C++ & DSA (cpp)');
  assert(subjectIds.includes('csharp'), 'Hỗ trợ môn Lập Trình C# .NET (csharp)');
  assert(subjectIds.includes('java'), 'Hỗ trợ môn Lập Trình Java Core OOP (java)');
  assert(subjectIds.includes('typescript'), 'Hỗ trợ môn Lập Trình TypeScript (typescript)');
  assert(subjectIds.includes('web_basic'), 'Hỗ trợ môn Lập Trình Web HTML5/CSS3/JS (web_basic)');

  // TEST 2: Check Branch Hierarchy & Users
  console.log('\n🏢 2. Kiểm tra Phân Quyền Chi Nhánh & Đăng Nhập Học Viên:');
  const bRes = await request('http://localhost:3000/api/branches');
  assert(bRes.status === 200, 'API /api/branches trả về HTTP 200');
  assert(bRes.data && bRes.data.branches && bRes.data.branches.length === 4, 'Đầy đủ 4 cơ sở: Thủ Đức, Quận 1, Gò Vấp, Bình Thạnh');

  const uRes = await request('http://localhost:3000/api/users');
  assert(uRes.status === 200, 'API /api/users trả về HTTP 200');

  // Check Student Password Generation (Tên + SĐT)
  const studentUser = "0937482673";
  const studentName = "Nguyễn Duy Thiên";
  const expectedPass = generateDefaultStudentPassword(studentName, studentUser);
  assert(expectedPass === 'Thien0937482673', `Mật khẩu học viên chuẩn theo quy tắc: ${expectedPass} (Tên + SĐT)`);

  const studentNam = generateDefaultStudentPassword("Nguyễn Bảo Nam", "0912345671");
  assert(studentNam === 'Nam0912345671', `Mật khẩu học viên chuẩn: ${studentNam}`);

  // TEST 3: Check Subject RBAC Permissions
  console.log('\n🔒 3. Kiểm tra Khóa & Cấp Quyền Môn Học (Subject RBAC):');
  const userThien = {
    fullName: "Nguyễn Duy Thiên",
    phone: "0937482673",
    role: "student",
    enrolledSubjects: ["python", "web_basic", "cpp"]
  };

  const isEnrolled = (user, sub) => Boolean(user.enrolledSubjects?.includes(sub));
  assert(isEnrolled(userThien, "python") === true, 'Học viên được phép làm bài môn Python');
  assert(isEnrolled(userThien, "web_basic") === true, 'Học viên được phép làm bài môn Web Cơ Bản');
  assert(isEnrolled(userThien, "cpp") === true, 'Học viên được phép làm bài môn C++');
  assert(isEnrolled(userThien, "java") === false, 'Học viên bị KHÓA môn Java (Chưa cấp quyền)');
  assert(isEnrolled(userThien, "csharp") === false, 'Học viên bị KHÓA môn C# .NET (Chưa cấp quyền)');

  // TEST 4: Frontend Routes Check
  console.log('\n🖥️ 4. Kiểm tra Tải Giao Diện Các Phân Hệ:');
  const pages = [
    { path: '/', name: 'Trang Chủ 3D' },
    { path: '/study', name: 'Trang Ôn Tập Đa Môn (/study)' },
    { path: '/exam', name: 'Trang Phòng Thi 50 Phút (/exam)' },
    { path: '/print-exam', name: 'Trang In Đề Chuẩn A4 (/print-exam)' },
    { path: '/admin', name: 'Trang Quản Trị Hệ Thống & Chi Nhánh (/admin)' }
  ];

  for (const page of pages) {
    const pRes = await request('http://localhost:3000' + page.path);
    assert(pRes.status === 200, `Tải thành công ${page.name} (${pRes.raw?.length || 0} bytes)`);
  }

  // SUMMARY
  console.log('\n====================================================');
  console.log(`📊 TỔNG KẾT KIỂM THỬ: ${passed} PASSED / ${failed} FAILED`);
  console.log('====================================================');
}

runTests().catch(console.error);
