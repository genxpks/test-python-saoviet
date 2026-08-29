"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: DỰ ÁN TỔNG HỢP 3 - HÀM QUẢN LÝ VÀ XẾP LOẠI ĐIỂM HỌC SINH (LAP_DANH_SACH_LOP)
"""

def lap_danh_sach_lop(danh_sach_ten):
    bang_diem = {}
    for ten in danh_sach_ten:
        diem = float(input(f"Nhap diem cho {ten}: "))
        bang_diem[ten] = diem
    
    print("\\n=== KET QUA XEP LOAI HOC LUC ===")
    for ten, diem in bang_diem.items():
        if diem >= 8.0:
            xep_loai = "Gioi"
        else:
            xep_loai = "Dat"
        print(f"Hoc sinh {ten} - Diem: {diem} - Xep loai: {xep_loai}")

danh_sach_hoc_sinh = ["Nguyen Tri Dung", "Tran Thu Ha", "Le Minh Khoi"]
lap_danh_sach_lop(danh_sach_hoc_sinh)
