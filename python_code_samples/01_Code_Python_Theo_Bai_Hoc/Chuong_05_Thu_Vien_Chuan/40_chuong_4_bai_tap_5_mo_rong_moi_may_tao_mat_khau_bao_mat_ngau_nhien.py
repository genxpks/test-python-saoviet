"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 4 — BÀI TẬP 5 (MỞ RỘNG MỚI) - MÁY TẠO MẬT KHẨU BẢO MẬT NGẪU NHIÊN (PASSWORD GENERATOR)
"""

import random

ky_tu = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
do_dai = int(input("Do dai mat khau mong muon (vi du 8, 12): "))

mat_khau_moi = ""
for i in range(do_dai):
    mat_khau_moi += random.choice(ky_tu)

print("Mat khau ngau nhien an toan cua ban la:", mat_khau_moi)
