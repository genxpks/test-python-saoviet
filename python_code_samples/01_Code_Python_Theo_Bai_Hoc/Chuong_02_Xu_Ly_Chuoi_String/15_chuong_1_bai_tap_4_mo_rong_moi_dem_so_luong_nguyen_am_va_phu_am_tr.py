"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 1 — BÀI TẬP 4 (MỞ RỘNG MỚI) - ĐẾM SỐ LƯỢNG NGUYÊN ÂM VÀ PHỤ ÂM TRONG CÂU
"""

cau = input("Nhap mot cau van: ").lower()

nguyen_am = "aeiou"
so_nguyen_am = 0
so_phu_am = 0

for ch in cau:
    if ch.isalpha():
        if ch in nguyen_am:
            so_nguyen_am += 1
        else:
            so_phu_am += 1

print(f"So luong nguyen am: {so_nguyen_am}")
print(f"So luong phu am: {so_phu_am}")
