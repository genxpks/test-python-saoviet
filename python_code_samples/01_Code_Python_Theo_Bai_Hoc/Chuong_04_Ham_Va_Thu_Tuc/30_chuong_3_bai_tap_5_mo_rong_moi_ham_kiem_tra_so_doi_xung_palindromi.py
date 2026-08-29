"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 3 — BÀI TẬP 5 (MỞ RỘNG MỚI) - HÀM KIỂM TRA SỐ ĐỐI XỨNG (PALINDROMIC NUMBER)
"""

def kiem_tra_doi_xung(n):
    chuoi_so = str(n)
    return chuoi_so == chuoi_so[::-1]

n = int(input("Nhap so nguyen duong can kiem tra: "))
if kiem_tra_doi_xung(n):
    print(f"So {n} la so doi xung!")
else:
    print(f"So {n} khong phai la so doi xung.")
