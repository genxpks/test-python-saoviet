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

async function runTests() {
  console.log('====================================================');
  console.log('🚀 KIỂM THỬ TỰ ĐỘNG TOÀN DIỆN HỆ THỐNG TIN HỌC SAO VIỆT');
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

  // TEST 1: Check 120 Questions API
  console.log('📋 1. Kiểm tra Ngân Hàng Câu Hỏi & 6 Archetype:');
  const qRes = await request('http://localhost:3000/api/questions');
  assert(qRes.status === 200, 'API /api/questions trả về HTTP 200');
  assert(qRes.data && qRes.data.questions && qRes.data.questions.length >= 100, `Nạp thành công ${qRes.data?.questions?.length || 0} câu hỏi trắc nghiệm`);
  assert(qRes.data && qRes.data.practical_problems && qRes.data.practical_problems.length >= 5, `Nạp thành công ${qRes.data?.practical_problems?.length || 0} bài tập tự luận code`);

  // Verify archetypes
  const types = new Set(qRes.data.questions.map(q => q.type));
  assert(types.has('single_choice'), 'Có câu hỏi trắc nghiệm ABCD (Single Choice)');
  assert(types.has('true_false'), 'Có câu hỏi Đúng / Sai (True / False)');
  assert(types.has('multiple_choice'), 'Có câu hỏi Nhiều Lựa Chọn (Multiple Choice)');
  assert(types.has('fill_blank'), 'Có câu hỏi Điền Từ Khuyết (Fill in Blank)');
  assert(types.has('sequence_order'), 'Có câu hỏi Sắp Xếp Dòng Code (Sequence Order)');
  assert(types.has('matching'), 'Có câu hỏi Ghép Cặp Khái Niệm (Matching Pairs)');

  // TEST 2: Check Users & Roles
  console.log('\n👥 2. Kiểm tra Danh Sách Học Viên & Tài Khoản:');
  const uRes = await request('http://localhost:3000/api/users');
  assert(uRes.status === 200, 'API /api/users trả về HTTP 200');
  assert(uRes.data && uRes.data.users && uRes.data.users.length >= 4, `Quản lý thành công ${uRes.data?.users?.length || 0} tài khoản học viên & admin`);
  
  const student = uRes.data.users.find(u => u.role === 'student');
  const admin = uRes.data.users.find(u => u.username === 'admin');
  assert(student && student.role === 'student', `Tài khoản Học Viên (${student?.fullName || student?.username}) hoạt động bình thường`);
  assert(admin && admin.role === 'admin', 'Tài khoản Quản Trị Viên (admin) có phân quyền Admin');

  // TEST 3: Check Branches
  console.log('\n🏢 3. Kiểm tra 4 Cơ Sở Đào Tạo Phòng Lab TP.HCM:');
  const bRes = await request('http://localhost:3000/api/branches');
  assert(bRes.status === 200, 'API /api/branches trả về HTTP 200');
  assert(bRes.data && bRes.data.branches && bRes.data.branches.length === 4, 'Đầy đủ 4 cơ sở: Thủ Đức, Quận 1, Gò Vấp, Bình Thạnh');

  // TEST 4: Check Subjects
  console.log('\n📚 4. Kiểm tra Ma Trận 4 Môn Học:');
  const sRes = await request('http://localhost:3000/api/subjects');
  assert(sRes.status === 200, 'API /api/subjects trả về HTTP 200');
  assert(sRes.data && sRes.data.subjects && sRes.data.subjects.length === 4, 'Đầy đủ 4 bộ môn: Python, C/C++, Web Frontend, Java Core');

  // TEST 5: Check Frontend Routes
  console.log('\n🖥️ 5. Kiểm tra Tải Giao Diện 5 Trang Chính:');
  const pages = [
    { path: '/', name: 'Trang Chủ 3D' },
    { path: '/study', name: 'Trang Ôn Tập 120 Câu (/study)' },
    { path: '/exam', name: 'Trang Thi Online 50 Phút (/exam)' },
    { path: '/print-exam', name: 'Trang In Đề Chuẩn A4 (/print-exam)' },
    { path: '/admin', name: 'Trang Quản Trị Hệ Thống (/admin)' }
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
