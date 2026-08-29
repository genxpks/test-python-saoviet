"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: DỰ ÁN TỔNG HỢP 4 - HÀM KẾT HỢP LIST VẼ BIỂU ĐỒ CỘT TĂNG TRƯỞNG TURTLE (VE_BIEU_DO_TANG_TRUONG)
"""

import turtle

def ve_bieu_do_tang_truong(danh_sach_chieu_cao, mau_sac):
    print("Dang ve bieu do cot tang truong tren Turtle...")
    but_ve = turtle.Turtle()
    but_ve.pensize(2)
    but_ve.color(mau_sac)
    but_ve.speed(3)
    
    do_rong = 30
    for h in danh_sach_chieu_cao:
        but_ve.forward(do_rong)
        but_ve.left(90)
        but_ve.forward(h)
        but_ve.left(90)
        but_ve.forward(do_rong)
        but_ve.left(90)
        but_ve.forward(h)
        but_ve.left(90)
        
        but_ve.penup()
        but_ve.forward(do_rong + 15)
        but_ve.pendown()
        
    turtle.done()

danh_sach_chieu_cao = [50, 120, 80, 150, 95]
mau = input("Nhap mau sac cho bieu do tu ban phim: ")
ve_bieu_do_tang_truong(danh_sach_chieu_cao, mau)
