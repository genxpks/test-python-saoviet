"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 5 — BÀI TẬP 1 (GỐC) - VẼ HÌNH VUÔNG NHIỀU MÀU (4 CẠNH 4 MÀU RỰC RỠ)
"""

import turtle

but_ve = turtle.Turtle()
but_ve.pensize(4)
but_ve.speed(3)

cac_mau = ["red", "green", "blue", "yellow"]

for mau in cac_mau:
    but_ve.color(mau)
    but_ve.forward(100)
    but_ve.right(90)

turtle.done()
