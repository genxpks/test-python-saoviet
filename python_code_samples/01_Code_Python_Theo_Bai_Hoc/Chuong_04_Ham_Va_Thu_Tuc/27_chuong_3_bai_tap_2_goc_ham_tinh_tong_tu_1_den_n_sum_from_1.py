"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 3 — BÀI TẬP 2 (GỐC) - HÀM TÍNH TỔNG TỪ 1 ĐẾN N (SUM_FROM_1_TO_N)
"""

def sum_from_1_to_n(n):
    if n <= 0:
        return 0
    total = 0
    for i in range(1, n + 1):
        total = total + i
    return total

n = int(input("Nhap so nguyen duong n: "))
result = sum_from_1_to_n(n)
print(f"Tong tu 1 den {n} la: {result}")
