"""
ĐỀ THI PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Bài 4: Hàm tính diện tích hình tròn
"""

import math

def tinh_dien_tich_tron(r):
    return math.pi * (r ** 2)

if __name__ == '__main__':
    r = 5
    print(f'Diện tích hình tròn bán kính {r} là: {tinh_dien_tich_tron(r):.2f}')
