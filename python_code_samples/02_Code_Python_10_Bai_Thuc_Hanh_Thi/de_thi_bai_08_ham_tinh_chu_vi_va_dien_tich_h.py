"""
ĐỀ THI PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Bài 8: Hàm tính chu vi và diện tích hình chữ nhật
"""

def tinh_hcn(dai, rong):
    chu_vi = (dai + rong) * 2
    dien_tich = dai * rong
    return chu_vi, dien_tich

if __name__ == '__main__':
    cv, dt = tinh_hcn(10, 5)
    print(f'Hình chữ nhật 10x5 -> Chu vi: {cv}, Diện tích: {dt}')
