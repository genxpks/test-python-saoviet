"""
ĐỀ THI PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Bài 6: Hàm tính giai thừa của số nguyên dương n
"""

def tinh_giai_thua(n):
    if n <= 1:
        return 1
    kq = 1
    for i in range(2, n + 1):
        kq *= i
    return kq

if __name__ == '__main__':
    print('5! =', tinh_giai_thua(5))
