import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load bank data
const bankPath = path.resolve(__dirname, '../Ngan_Hang_120_Cau_Hoi/questions_bank_full.json');
const bankData = JSON.parse(fs.readFileSync(bankPath, 'utf8'));

console.log('================================================================');
console.log('🔍 HỆ THỐNG AUDIT TOÀN DIỆN: NGÂN HÀNG CÂU HỎI & BÀI TẬP THỰC HÀNH');
console.log('================================================================\n');

// 1. Audit Multiple-Choice Questions
console.log('📋 1. KIỂM TRA TOÀN BỘ CÂU HỎI TRẮC NGHIỆM:');
const questions = bankData.questions || [];
console.log(`- Tổng số câu hỏi: ${questions.length}`);

let qErrors = 0;
const typeCounts = {};
const seenQIds = new Set();

questions.forEach((q, idx) => {
  typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;

  if (!q.id) {
    console.error(`  ❌ Lỗi: Câu thứ ${idx + 1} không có ID!`);
    qErrors++;
  } else if (seenQIds.has(q.id)) {
    console.error(`  ❌ Lỗi: Trùng lặp ID câu hỏi: ${q.id}`);
    qErrors++;
  } else {
    seenQIds.add(q.id);
  }

  if (!q.question || typeof q.question !== 'string') {
    console.error(`  ❌ Lỗi câu ${q.id}: Nội dung câu hỏi trống hoặc không hợp lệ.`);
    qErrors++;
  }

  // Type specific validation
  if (q.type === 'single_choice' || q.type === 'true_false') {
    if (!Array.isArray(q.options) || q.options.length < 2) {
      console.error(`  ❌ Lỗi câu ${q.id} (${q.type}): Danh sách options không hợp lệ!`);
      qErrors++;
    }
    if (typeof q.correct_answer !== 'number' || q.correct_answer < 0 || q.correct_answer >= (q.options?.length || 0)) {
      console.error(`  ❌ Lỗi câu ${q.id} (${q.type}): correct_answer (${q.correct_answer}) không hợp lệ với options length (${q.options?.length})!`);
      qErrors++;
    }
  } else if (q.type === 'multiple_choice') {
    if (!Array.isArray(q.options) || q.options.length < 2) {
      console.error(`  ❌ Lỗi câu ${q.id} (${q.type}): Danh sách options không hợp lệ!`);
      qErrors++;
    }
    if (!Array.isArray(q.correct_answer) || q.correct_answer.length === 0) {
      console.error(`  ❌ Lỗi câu ${q.id} (multiple_choice): correct_answer phải là mảng chỉ số!`);
      qErrors++;
    } else {
      q.correct_answer.forEach(ans => {
        if (typeof ans !== 'number' || ans < 0 || ans >= q.options.length) {
          console.error(`  ❌ Lỗi câu ${q.id} (multiple_choice): Đáp án ${ans} nằm ngoài phạm vi options!`);
          qErrors++;
        }
      });
    }
  } else if (q.type === 'fill_blank') {
    if (q.correct_answer === undefined || q.correct_answer === null || q.correct_answer === '') {
      console.error(`  ❌ Lỗi câu ${q.id} (fill_blank): Thiếu correct_answer đáp án điền từ!`);
      qErrors++;
    }
  } else if (q.type === 'sequence_order') {
    const items = q.items || q.options;
    const order = q.correct_order || q.correct_answer;
    if (!Array.isArray(items) || items.length < 2) {
      console.error(`  ❌ Lỗi câu ${q.id} (sequence_order): Danh sách items sắp xếp không hợp lệ!`);
      qErrors++;
    }
    if (!Array.isArray(order) || order.length !== items?.length) {
      console.error(`  ❌ Lỗi câu ${q.id} (sequence_order): correct_order (${order?.length}) không khớp độ dài items (${items?.length})!`);
      qErrors++;
    }
  } else if (q.type === 'matching') {
    const pairs = q.pairs || [];
    if (!Array.isArray(pairs) || pairs.length < 2) {
      console.error(`  ❌ Lỗi câu ${q.id} (matching): Cặp ghép nối pairs không hợp lệ!`);
      qErrors++;
    }
  } else {
    console.warn(`  ⚠️ Cảnh báo câu ${q.id}: Dạng câu hỏi lạ: '${q.type}'`);
  }

  if (!q.explanation) {
    console.warn(`  ⚠️ Cảnh báo câu ${q.id}: Thiếu giải thích chi tiết (explanation).`);
  }
});

console.log('  Phân bổ dạng câu hỏi:');
for (const [t, cnt] of Object.entries(typeCounts)) {
  console.log(`    - ${t}: ${cnt} câu`);
}

if (qErrors === 0) {
  console.log(`  ✅ Tất cả ${questions.length} câu hỏi trắc nghiệm hợp lệ 100% về cấu trúc và đáp án.`);
} else {
  console.error(`  ❌ Phát hiện ${qErrors} lỗi trong ngân hàng câu hỏi!`);
}

// 2. Audit Practical Problems
console.log('\n💻 2. KIỂM TRA TOÀN BỘ BÀI TẬP THỰC HÀNH (PRACTICAL PROBLEMS):');
const practicals = bankData.practical_problems || [];
console.log(`- Tổng số bài tập thực hành: ${practicals.length}`);

let pErrors = 0;
const seenPIds = new Set();

practicals.forEach((p, idx) => {
  if (!p.id) {
    console.error(`  ❌ Lỗi: Bài thực hành thứ ${idx + 1} không có ID!`);
    pErrors++;
  } else if (seenPIds.has(p.id)) {
    console.error(`  ❌ Lỗi: Trùng lặp ID bài thực hành: ${p.id}`);
    pErrors++;
  } else {
    seenPIds.add(p.id);
  }

  if (!p.title) {
    console.error(`  ❌ Lỗi bài ${p.id}: Thiếu tiêu đề (title).`);
    pErrors++;
  }

  if (!p.description) {
    console.error(`  ❌ Lỗi bài ${p.id}: Thiếu mô tả yêu cầu (description).`);
    pErrors++;
  }

  const solution = p.solution_code || p.initial_code || '';
  if (!solution) {
    console.warn(`  ⚠️ Cảnh báo bài ${p.id}: Không có solution_code mẫu!`);
  }
});

if (pErrors === 0) {
  console.log(`  ✅ Tất cả ${practicals.length} bài tập thực hành hợp lệ về cấu trúc dữ liệu.`);
} else {
  console.error(`  ❌ Phát hiện ${pErrors} lỗi trong ngân hàng bài tập thực hành!`);
}

console.log('\n================================================================');
console.log(`📊 KẾT QUẢ TỔNG QUAN: Questions Errors = ${qErrors}, Practicals Errors = ${pErrors}`);
console.log('================================================================\n');
