"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: DỰ ÁN TỔNG HỢP 2 - HÀM VẼ ĐA GIÁC HOA VĂN MÀU SẮC ĐỐI XỨNG (VE_DA_GIAC_MAU_SAC)
"""

import turtle

def ve_da_giac_mau_sac(tu_dien_mau, so_hinh_tron):
    print("Dang mo giao dien Turtle de ve da giac mau sac...")
    but_ve = turtle.Turtle()
    but_ve.pensize(2)
    but_ve.speed(4)
    goc_quay = 360 / so_hinh_tron
    
    for mau, ban_kinh in tu_dien_mau.items():
        mau_sach = mau.strip()
        but_ve.color(mau_sach)
        for i in range(so_hinh_tron):
            but_ve.circle(ban_kinh)
            but_ve.left(goc_quay)
    
    turtle.done()

tu_dien_mau = {" red ": 50, " blue ": 80, " green ": 110}
so_hinh_tron = int(input("Nhap so luong hinh tron muon lap lai tai moi tam: "))
ve_da_giac_mau_sac(tu_dien_mau, so_hinh_tron)
