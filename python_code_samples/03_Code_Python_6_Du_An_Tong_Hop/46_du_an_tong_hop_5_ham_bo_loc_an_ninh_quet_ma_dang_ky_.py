"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: DỰ ÁN TỔNG HỢP 5 - HÀM BỘ LỌC AN NINH QUÉT MÃ ĐĂNG KÝ VÀ CẬP NHẬT THÀNH VIÊN CLB (BO_LOC_DANG_KY_CLB)
"""

def bo_loc_dang_ky_clb(danh_sach_ma):
    thanh_vien = {}
    print("=== TIEN TRINH QUET MA DANG KY CLB ===")
    for ma in danh_sach_ma:
        ma_sach = ma.strip()
        if ma_sach.isalnum():
            ten = input(f"Ma hop le [{ma_sach}] -> Nhap ho ten hoc sinh: ")
            thanh_vien[ma_sach] = ten
        else:
            print(f"Ma khong hop le [{ma_sach}] -> Da bi loai tu dong!")
            
    print("\\n=== DANH SACH THANH VIEN CLB CHINH THUC ===")
    for ma, ten in thanh_vien.items():
        print(f"- Ma: {ma} | Ho ten: {ten}")

danh_sach_ma = ["THPT2026", "KHTN 123", "CHUYEN_ANH", "TIN2K9"]
bo_loc_dang_ky_clb(danh_sach_ma)
