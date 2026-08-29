"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 4 — BÀI TẬP 6 (MỞ RỘNG MỚI) - ĐỒNG HỒ ĐẾM NGƯỢC THỜI GIAN ĐẾN NGÀY TẾT NGUYÊN ĐÁN
"""

import datetime

hom_nay = datetime.datetime.now()
ngay_tet = datetime.datetime(2027, 1, 1, 0, 0, 0)

khoang_cach = ngay_tet - hom_nay

print(f"Thoi diem hien tai: {hom_nay.strftime('%d/%m/%Y %H:%M:%S')}")
print(f"Con dung: {khoang_cach.days} ngay nua la den Tet!")
