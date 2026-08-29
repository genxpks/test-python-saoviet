"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 1 — BÀI TẬP 1 (GỐC) - KIỂM TRA TÊN NGƯỜI DÙNG CÓ SỐ VÀ KHOẢNG TRẮNG
"""

ten = input("Nhap ho ten: ")

co_so = False
for ch in ten:
    if ch.isdigit():
        co_so = True
        break

co_khoang_trang = " " in ten

if co_so and not co_khoang_trang:
    print("Ten nguoi dung co so va khong co khoang trang")
elif not co_so and co_khoang_trang:
    print("Ten nguoi dung khong co so va co khoang trang")
elif co_so and co_khoang_trang:
    print("Ten nguoi dung co ca so va khoang trang")
else:
    print("Ten nguoi dung chi gom chu cai, khong co so va khong co khoang trang")
