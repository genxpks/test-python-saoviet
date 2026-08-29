"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 4 — BÀI TẬP 1 (GỐC) - MÔ PHỎNG TUNG XÚC XẮC N LẦN (DÙNG RANDOM)
"""

import random

n = int(input("Nhap so lan tung: "))
tong_diem = 0

for i in range(1, n + 1):
    diem = random.randint(1, 6)
    print(f"Lan tung thu {i} duoc diem: {diem}")
    tong_diem = tong_diem + diem

print(f"Tong diem sau {n} lan tung: {tong_diem}")
