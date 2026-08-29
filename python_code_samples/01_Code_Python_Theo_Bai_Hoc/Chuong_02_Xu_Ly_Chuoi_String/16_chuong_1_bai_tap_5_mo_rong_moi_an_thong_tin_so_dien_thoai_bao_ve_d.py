"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 1 — BÀI TẬP 5 (MỞ RỘNG MỚI) - ẨN THÔNG TIN SỐ ĐIỆN THOẠI BẢO VỆ DỮ LIỆU CÁ NHÂN
"""

sdt = input("Nhap so dien thoai (10 so): ").strip()

if len(sdt) == 10 and sdt.isdigit():
    sdt_an = sdt[:3] + "****" + sdt[7:]
    print("So dien thoai sau khi bao mat:", sdt_an)
else:
    print("So dien thoai khong hop le! Vui long nhap dung 10 chu so.")
