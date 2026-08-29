"""
ĐỀ THI PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Bài 9: Hàm chuyển đổi nhiệt độ từ Celsius sang Fahrenheit
"""

def c_sang_f(c):
    return (c * 9 / 5) + 32

if __name__ == '__main__':
    print('37 độ C =', c_sang_f(37), 'độ F')
    print('0 độ C =', c_sang_f(0), 'độ F')
