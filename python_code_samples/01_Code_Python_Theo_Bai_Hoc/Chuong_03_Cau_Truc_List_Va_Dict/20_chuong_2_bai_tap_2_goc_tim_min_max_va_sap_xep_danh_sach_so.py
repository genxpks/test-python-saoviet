"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 2 — BÀI TẬP 2 (GỐC) - TÌM MIN, MAX VÀ SẮP XẾP DANH SÁCH SỐ NGUYÊN
"""

danh_sach = []

for i in range(1, 6):
    so = int(input(f"Nhap so thu {i}: "))
    danh_sach.append(so)

so_nho_nhat = min(danh_sach)
so_lon_nhat = max(danh_sach)

print(f"So nho nhat: {so_nho_nhat}")
print(f"So lon nhat: {so_lon_nhat}")

danh_sach.sort()
print("Danh sach sap xep tang dan:", danh_sach)
