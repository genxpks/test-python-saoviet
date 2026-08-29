"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 3 — BÀI TẬP 3 (GỐC) - HÀM IN BẢNG CỬU CHƯƠNG (PRINT_MULTIPLICATION_TABLE)
"""

def print_multiplication_table(n):
    print(f"Bang cuu chuong cua {n} la:")
    for i in range(1, 11):
        print(f"{n} x {i} = {n * i}")

n = int(input("Nhap so nguyen duong n: "))
print_multiplication_table(n)
