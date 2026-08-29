"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 4 — BÀI TẬP 4 (GỐC) - TRÒ CHƠI ĐOÁN SỐ BÍ MẬT TỪ 1 ĐẾN 100 (RANDOM MINI GAME)
"""

import random

so_bi_mat = random.randint(1, 100)

print("====================================")
print("Toi da nghi ra mot so tu 1 den 100.")
print("Ban hay doan xem do la so gi!")
print("====================================")

while True:
    doan = int(input("Nhap so cua ban: "))
    
    if doan == so_bi_mat:
        print("Chuc mung! Ban da doan dung.")
        break
    elif doan < so_bi_mat:
        print("So cua ban thap hon so bi mat. Hay thu so cao hon!")
    else:
        print("So cua ban cao hon so bi mat. Hay thu so thap hon!")
