"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: DỰ ÁN TỔNG HỢP 6 - HÀM VẼ HOA VĂN XOAY VÒNG TỪ ĐA GIÁC ĐỀU (VE_HOA_VAN_XOAY)
"""

import turtle

def ve_hoa_van_xoay(so_canh, chieu_dai_canh, do_day):
    print("Dang khoi tao thuat toan xoay da giac de tao hoa van nghe thuat...")
    but_ve = turtle.Turtle()
    but_ve.pensize(do_day)
    but_ve.color("purple")
    but_ve.speed(5)
    
    goc_da_giac = 360 / so_canh
    goc_xoay_truc = 360 / 6
    
    for i in range(6):
        for j in range(so_canh):
            but_ve.forward(chieu_dai_canh)
            but_ve.right(goc_da_giac)
        but_ve.right(goc_xoay_truc)
        
    turtle.done()

so_canh = int(input("Em muon canh hoa la hinh gi? (Nhap 3: Tam giac, 4: Hinh vuong, 5: Ngu giac): "))
chieu_dai = int(input("Nhap chieu dai mot canh cua da giac: "))
do_day = int(input("Nhap do day net ve (tu 1 den 5): "))

ve_hoa_van_xoay(so_canh, chieu_dai, do_day)
