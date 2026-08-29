"""
ĐỀ THI PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Bài 10: Hàm in danh sách các số chẵn từ 1 đến 100
"""

def in_so_chan_1_den_100():
    for i in range(2, 101, 2):
        print(i, end=' ')
    print()

if __name__ == '__main__':
    print('Các số chẵn từ 1 đến 100:')
    in_so_chan_1_den_100()
