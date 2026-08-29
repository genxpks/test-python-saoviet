"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 5 — BÀI TẬP 4 (GỐC) - VẼ TAM GIÁC ĐỀU & ĐỔI MÀU NỀN MÀN HÌNH (BGCOLOR & TÔ MÀU)
"""

import turtle

man_hinh = turtle.Screen()
man_hinh.bgcolor("lightblue")

but_ve = turtle.Turtle()
but_ve.pensize(3)
but_ve.color("red", "red")
but_ve.speed(3)

but_ve.begin_fill()
for i in range(3):
    but_ve.forward(120)
    but_ve.left(120)
but_ve.end_fill()

turtle.done()
