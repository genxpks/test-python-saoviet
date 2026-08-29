"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 2 — BÀI TẬP 1 (GỐC) - QUẢN LÝ THÔNG TIN HỌC SINH BẰNG DICTIONARY
"""

ten = input("Nhap ten: ")
tuoi = int(input("Nhap tuoi: "))
lop = input("Nhap lop: ")

hoc_sinh = {
    "ten": ten,
    "tuoi": tuoi,
    "lop": lop
}

print("=== THONG TIN HOC SINH ===")
print("Ten:", hoc_sinh["ten"])
print("Tuoi:", hoc_sinh["tuoi"])
print("Lop:", hoc_sinh["lop"])
