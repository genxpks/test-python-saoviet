import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

p = os.path.join(os.path.dirname(__file__), "..", "Ngan_Hang_120_Cau_Hoi", "questions_bank_full.json")
with open(p, "r", encoding="utf-8") as f:
    d = json.load(f)

out_path = os.path.join(os.path.dirname(__file__), "..", "lib", "questionsData.ts")
os.makedirs(os.path.dirname(out_path), exist_ok=True)

out = f"""// lib/questionsData.ts - Typed Data of 120 Questions & 10 Practical Problems
// Đơn vị: TIN HỌC SAO VIỆT THỦ ĐỨC

import {{ Question, PracticalProblem }} from "@/types";

export const QUESTIONS_DATA: Question[] = {json.dumps(d['questions'], ensure_ascii=False, indent=2)};

export const PRACTICAL_DATA: PracticalProblem[] = {json.dumps(d['practical_problems'], ensure_ascii=False, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(out)

print("Generated lib/questionsData.ts successfully!")
