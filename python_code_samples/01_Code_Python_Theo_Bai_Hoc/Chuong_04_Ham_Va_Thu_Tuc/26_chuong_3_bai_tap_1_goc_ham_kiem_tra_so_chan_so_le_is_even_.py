"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 3 — BÀI TẬP 1 (GỐC) - HÀM KIỂM TRA SỐ CHẴN / SỐ LẺ (IS_EVEN_NUMBER)
"""

def is_even_number(n):
    if n % 2 == 0:
        return True
    else:
        return False

n = int(input("Nhap so nguyen duong n: "))
if is_even_number(n):
    print(n, "la so chan")
else:
    print(n, "la so le")
