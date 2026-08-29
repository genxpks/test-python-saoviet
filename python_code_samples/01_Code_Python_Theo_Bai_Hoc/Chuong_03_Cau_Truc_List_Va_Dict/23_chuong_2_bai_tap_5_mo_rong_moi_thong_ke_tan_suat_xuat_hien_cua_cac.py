"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 2 — BÀI TẬP 5 (MỞ RỘNG MỚI) - THỐNG KÊ TẦN SUẤT XUẤT HIỆN CỦA CÁC TỪ TRONG CÂU
"""

van_ban = "python rat hay va python rat de hoc"
danh_sach_tu = van_ban.split()

thong_ke = {}
for tu in danh_sach_tu:
    if tu in thong_ke:
        thong_ke[tu] += 1
    else:
        thong_ke[tu] = 1

print("=== BANG THONG KE TU VUNG ===")
for tu, so_lan in thong_ke.items():
    print(f"Tu '{tu}': xuat hien {so_lan} lan")
