import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PythonEngine } from './pythonEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bankPath = path.resolve(__dirname, '../Ngan_Hang_120_Cau_Hoi/questions_bank_full.json');
const bankData = JSON.parse(fs.readFileSync(bankPath, 'utf8'));

const practicals = bankData.practical_problems || [];

console.log('================================================================');
console.log(`🧪 KIỂM THỬ TỰ ĐỘNG 21 BÀI TẬP THỰC HÀNH VỚI PYTHON ENGINE`);
console.log('================================================================\n');

let gradePass = 0;
let gradeFail = 0;
let runPass = 0;
let runFail = 0;

for (const p of practicals) {
  const code = p.solution_code || p.initial_code || '';
  console.log(`--- [Bài ${p.id}]: ${p.title} ---`);

  // Test 1: Grade Problem
  const grade = PythonEngine.gradeProblem(p.id, code);
  if (grade.passed && grade.score === 10) {
    console.log(`  ✅ [CHẤM ĐIỂM ĐẠT]: 10/10 điểm (${grade.passedTestCases}/${grade.totalTestCases} test cases) - ${grade.feedback}`);
    gradePass++;
  } else {
    console.error(`  ❌ [CHẤM ĐIỂM THẤT BẠI]: Điểm: ${grade.score}/10, Passed: ${grade.passed} - ${grade.feedback}`);
    gradeFail++;
  }

  // Test 2: Run Code
  try {
    const run = await PythonEngine.runCode(code);
    if (run.success) {
      const outputSnippet = (run.output || '').split('\n').slice(0, 2).join(' | ');
      console.log(`  ✅ [THỰC THI THÀNH CÔNG]: Thời gian: ${run.executionTimeMs}ms, Output: ${outputSnippet.substring(0, 60)}...`);
      runPass++;
    } else {
      console.error(`  ❌ [THỰC THI LỖI]: ${run.error}`);
      runFail++;
    }
  } catch (err) {
    console.error(`  ❌ [EXCEPTION THỰC THI]: ${err.message}`);
    runFail++;
  }
}

console.log('\n================================================================');
console.log(`📊 TỔNG KẾT BÀI THỰC HÀNH:`);
console.log(`- Chấm Điểm (Grading Engine): ${gradePass} PASSED / ${gradeFail} FAILED`);
console.log(`- Trình Thông Dịch (Runtime Engine): ${runPass} PASSED / ${runFail} FAILED`);
console.log('================================================================\n');

if (gradeFail > 0 || runFail > 0) {
  process.exit(1);
} else {
  console.log('🎉 TẤT CẢ 21 BÀI THỰC HÀNH ĐẠT CHUẨN 100%!');
}
