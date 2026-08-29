"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: DỰ ÁN TỔNG HỢP 1 - HÀM VẼ CHUỖI HÌNH VUÔNG NẰM NGANG TĂNG DẦN KÍCH THƯỚC (VE_CHUOI_HINH_VUONG)
"""

import turtle

def ve_chuoi_hinh_vuong(danh_sach_canh, khoang_cach):
    print("Dang khoi chay giao dien Turtle de ve chuoi hinh vuong...")
    but_ve = turtle.Turtle()
    but_ve.pensize(2)
    but_ve.speed(3)
    
    for canh in danh_sach_canh:
        for i in range(4):
            but_ve.forward(canh)
            but_ve.right(90)
        but_ve.penup()
        but_ve.forward(canh + khoang_cach)
        but_ve.pendown()
    
    turtle.done()

n = int(input("So luong hinh vuong muon ve: "))
danh_sach_canh = []
for i in range(1, n + 1):
    canh = int(input(f"Kich thuoc canh hinh thu {i}: "))
    danh_sach_canh.append(canh)

khoang_cach = int(input("Khoang cach dich chuyen giua cac hinh: "))
ve_chuoi_hinh_vuong(danh_sach_canh, khoang_cach)
