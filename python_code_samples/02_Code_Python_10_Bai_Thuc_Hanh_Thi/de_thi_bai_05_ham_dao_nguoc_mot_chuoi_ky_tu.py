"""
ĐỀ THI PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Bài 5: Hàm đảo ngược một chuỗi ký tự
"""

def dao_nguoc_chuoi(s):
    return s[::-1]

if __name__ == '__main__':
    s = 'Python'
    print(f'Chuỗi đảo ngược của "{s}" là: "{dao_nguoc_chuoi(s)}"')
