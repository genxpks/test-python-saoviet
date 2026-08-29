"""
ĐỀ THI PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Bài 2: Hàm kiểm tra số chẵn lẻ
"""

def kiem_tra_chan(n):
    return n % 2 == 0

if __name__ == '__main__':
    print('10 là số chẵn?', kiem_tra_chan(10))
    print('7 là số chẵn?', kiem_tra_chan(7))
