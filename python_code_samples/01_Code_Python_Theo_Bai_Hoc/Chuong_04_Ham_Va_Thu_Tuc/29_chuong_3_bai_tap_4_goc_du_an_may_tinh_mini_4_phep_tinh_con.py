"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 3 — BÀI TẬP 4 (GỐC) - DỰ ÁN MÁY TÍNH MINI 4 PHÉP TÍNH (CỘNG - TRỪ - NHÂN - CHIA)
"""

def sum(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Khong the chia cho 0!"
    return a / b

while True:
    print("1 - Cong")
    print("2 - Tru")
    print("3 - Nhan")
    print("4 - Chia")
    choice = int(input("Hay chon phep tinh (1-4): "))
    if 1 <= choice <= 4:
        a = float(input("Nhap so a: "))
        b = float(input("Nhap so b: "))
        if choice == 1:
            print("Ket qua:", sum(a, b))
        elif choice == 2:
            print("Ket qua:", subtract(a, b))
        elif choice == 3:
            print("Ket qua:", multiply(a, b))
        elif choice == 4:
            print("Ket qua:", divide(a, b))
        break
    else:
        print("Khong ton tai phep tinh! Vui long nhap lai.\\n")
