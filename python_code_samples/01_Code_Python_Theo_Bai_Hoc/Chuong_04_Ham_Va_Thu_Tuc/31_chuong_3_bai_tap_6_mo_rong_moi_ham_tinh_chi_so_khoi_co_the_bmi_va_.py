"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 3 — BÀI TẬP 6 (MỞ RỘNG MỚI) - HÀM TÍNH CHỈ SỐ KHỐI CƠ THỂ BMI VÀ TƯ VẤN SỨC KHỎE
"""

def tinh_bmi(can_nang, chieu_cao):
    bmi = can_nang / (chieu_cao ** 2)
    return bmi

can_nang = float(input("Nhap can nang (kg): "))
chieu_cao = float(input("Nhap chieu cao (m, vi du 1.45): "))

chi_so = tinh_bmi(can_nang, chieu_cao)
print(f"Chi so BMI cua be la: {chi_so:.1f}")

if chi_so < 18.5:
    print("Danh gia: The trang hoi gay, can bo sung dinh duong!")
elif 18.5 <= chi_so < 25:
    print("Danh gia: The trang ly tuong rat can doi!")
else:
    print("Danh gia: The trang hoi thua can, hay cham tap the thao!")
