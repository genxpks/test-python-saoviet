"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 2 — BÀI TẬP 4 (MỞ RỘNG MỚI) - TRA CỨU & CẬP NHẬT DANH BẠ ĐIỆN THOẠI BẰNG DICTIONARY
"""

danh_ba = {
    "Minh": "0901112233",
    "An": "0904445566",
    "Bao": "0907778899"
}

ten_tim = input("Nhap ten can tra cuu: ")

if ten_tim in danh_ba:
    print(f"So dien thoai cua {ten_tim} la: {danh_ba[ten_tim]}")
else:
    print(f"Khong tim thay {ten_tim} trong danh ba!")
    sdt_moi = input("Nhap so dien thoai de them moi: ")
    danh_ba[ten_tim] = sdt_moi
    print(f"Da them {ten_tim} vao danh ba thanh cong!")
