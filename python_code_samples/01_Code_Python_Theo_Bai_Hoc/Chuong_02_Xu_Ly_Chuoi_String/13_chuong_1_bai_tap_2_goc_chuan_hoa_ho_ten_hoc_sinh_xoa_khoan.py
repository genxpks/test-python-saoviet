"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 1 — BÀI TẬP 2 (GỐC) - CHUẨN HÓA HỌ TÊN HỌC SINH (XÓA KHOẢNG TRẮNG & VIẾT HOA)
"""

ten_nguoi_dung = "         nguyen van an     "
print("Ten nguoi dung:", ten_nguoi_dung)

ten_da_xoa_khoang_trang = ten_nguoi_dung.strip()
print("Ten nguoi dung sau khi xoa dau cach thua:", ten_da_xoa_khoang_trang)

ten_chuan_hoa = ten_da_xoa_khoang_trang.title()
print("Ten nguoi dung sau khi viet hoa chu cai dau:", ten_chuan_hoa)
