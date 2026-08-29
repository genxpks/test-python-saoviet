"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 5 — BÀI TẬP 6 (MỞ RỘNG MỚI) - VẼ HỌA TIẾT XOẮN ỐC NGHỆ THUẬT TĂNG DẦN BÁN KÍNH
"""

import turtle

but_ve = turtle.Turtle()
but_ve.pensize(2)
but_ve.speed(0)
but_ve.color("darkblue")

for i in range(1, 80):
    but_ve.forward(i * 3)
    but_ve.right(91)

turtle.done()
