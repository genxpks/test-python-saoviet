"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 5 — BÀI TẬP 3 (GỐC) - VẼ HAI HÌNH VUÔNG XA NHAU (KỸ THUẬT PENUP & PENDOWN)
"""

import turtle

but_ve = turtle.Turtle()
but_ve.pensize(3)
but_ve.speed(3)

but_ve.color("blue")
for i in range(4):
    but_ve.forward(80)
    but_ve.right(90)

but_ve.penup()
but_ve.forward(200)
but_ve.pendown()

but_ve.color("orange")
for i in range(4):
    but_ve.forward(80)
    but_ve.right(90)

turtle.done()
