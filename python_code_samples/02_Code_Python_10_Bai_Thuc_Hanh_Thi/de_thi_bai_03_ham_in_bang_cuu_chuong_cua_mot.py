"""
ĐỀ THI PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Bài 3: Hàm in bảng cửu chương của một số
"""

def in_bang_cuu_chuong(n):
    print(f'Bảng cửu chương của {n}:')
    for i in range(1, 11):
        print(f'{n} x {i} = {n * i}')

if __name__ == '__main__':
    in_bang_cuu_chuong(5)
