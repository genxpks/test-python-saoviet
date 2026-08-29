"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: BÀI 4 - KIỂU DỮ LIỆU LIST (DANH SÁCH CÓ THỨ TỰ)
"""

a = [2, 5, 10, 1, 3]

print("Phan tu dau tien:", a[0])
print("Phan tu thu hai:", a[1])
print("Phan tu cuoi cung:", a[-1])

print("Duyet danh sach qua tung gia tri:")
for x in a:
    print(x)

print("Duyet danh sach qua vi tri index:")
for i in range(len(a)):
    print(f"Vi tri {i} co gia tri la: {a[i]}")
