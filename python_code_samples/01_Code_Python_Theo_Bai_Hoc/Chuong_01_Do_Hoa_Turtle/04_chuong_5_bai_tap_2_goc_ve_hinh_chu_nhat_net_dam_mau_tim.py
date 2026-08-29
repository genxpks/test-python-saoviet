"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 5 — BÀI TẬP 2 (GỐC) - VẼ HÌNH CHỮ NHẬT NÉT ĐẬM MÀU TÍM
"""

import turtle

but_ve = turtle.Turtle()
but_ve.pensize(5)
but_ve.color("purple")
but_ve.speed(3)

for i in range(2):
    but_ve.forward(150)
    but_ve.right(90)
    but_ve.forward(80)
    but_ve.right(90)

turtle.done()
