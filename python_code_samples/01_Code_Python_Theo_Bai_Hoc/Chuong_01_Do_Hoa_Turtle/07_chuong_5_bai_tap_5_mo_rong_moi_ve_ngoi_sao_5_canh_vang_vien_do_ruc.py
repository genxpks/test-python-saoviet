"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 5 — BÀI TẬP 5 (MỞ RỘNG MỚI) - VẼ NGÔI SAO 5 CÁNH VÀNG VIỀN ĐỎ RỰC RỠ
"""

import turtle

but_ve = turtle.Turtle()
but_ve.pensize(3)
but_ve.speed(3)
but_ve.color("red", "yellow")

but_ve.begin_fill()
for i in range(5):
    but_ve.forward(150)
    but_ve.right(144)
but_ve.end_fill()

turtle.done()
