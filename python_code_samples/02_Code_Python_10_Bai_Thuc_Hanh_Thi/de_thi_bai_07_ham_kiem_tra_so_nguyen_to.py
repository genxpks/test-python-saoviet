"""
ĐỀ THI PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Bài 7: Hàm kiểm tra số nguyên tố
"""

import math

def kiem_tra_nguyen_to(n):
    if n < 2:
        return False
    for i in range(2, int(math.isqrt(n)) + 1):
        if n % i == 0:
            return False
    return True

if __name__ == '__main__':
    print('17 là số nguyên tố?', kiem_tra_nguyen_to(17))
    print('20 là số nguyên tố?', kiem_tra_nguyen_to(20))
