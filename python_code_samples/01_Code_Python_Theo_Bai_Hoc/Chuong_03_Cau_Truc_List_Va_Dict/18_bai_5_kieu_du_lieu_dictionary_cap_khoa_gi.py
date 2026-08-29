"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: BÀI 5 - KIỂU DỮ LIỆU DICTIONARY (CẶP KHÓA — GIÁ TRỊ)
"""

hoc_sinh = {
    "ten": "Bao Nam",
    "tuoi": 10,
    "lop": "Python Nang Cao"
}

print("Ten hoc sinh:", hoc_sinh["ten"])
print("Tuoi hoc sinh:", hoc_sinh["tuoi"])

print("Duyet qua tung key:")
for k in hoc_sinh:
    print(k, "->", hoc_sinh[k])

print("Duyet qua ca key va value:")
for key, val in hoc_sinh.items():
    print(f"{key}: {val}")
