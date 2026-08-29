"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 4 — BÀI TẬP 2 (GỐC) - TÍNH DIỆN TÍCH, CHU VI & THỂ TÍCH HÌNH HỌC (DÙNG MATH)
"""

import math

def hinh_tron(r):
    chu_vi = 2 * math.pi * r
    dien_tich = math.pi * (r ** 2)
    print(f"Hinh tron ban kinh r = {r} , chu vi = {chu_vi:.2f} , dien tich = {dien_tich:.2f}")

def hinh_cau(r):
    the_tich = (4/3) * math.pi * (r ** 3)
    print(f"Hinh cau ban kinh r = {r} , the tich = {the_tich:.2f}")

def hinh_tru(r, h):
    the_tich = math.pi * (r ** 2) * h
    print(f"Hinh tru ban kinh r = {r} , chieu cao h = {h} , the tich = {the_tich:.2f}")

hinh_tron(4)
hinh_cau(4)
hinh_tru(4, 10)
