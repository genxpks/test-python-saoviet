"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 2 — BÀI TẬP 3 (GỐC) - HỆ THỐNG QUẢN LÝ DANH SÁCH MUA ĐỒ CHƠI (LIST & DICT)
"""

danh_sach_do_choi = []

while True:
    print("=== MENU ===")
    print("1. Them do choi")
    print("2. Xem danh sach")
    print("3. Thoat")
    
    chon = input("Chon chuc nang (1-3): ")
    
    if chon == "1":
        ten = input("Ten mat hang: ")
        so_luong = int(input("So luong: "))
        mon_do = {"ten": ten, "so_luong": so_luong}
        danh_sach_do_choi.append(mon_do)
        print(f"Da them {ten} vao danh sach.\\n")
    elif chon == "2":
        print("--- DANH SACH DO CHOI ---")
        if len(danh_sach_do_choi) == 0:
            print("Danh sach dang trong!\\n")
        else:
            for item in danh_sach_do_choi:
                print(f"- {item['ten']}: {item['so_luong']} cai")
            print()
    elif chon == "3":
        print("Tam biet!")
        break
    else:
        print("Lua chon khong hop le! Vui long chon tu 1 den 3.\\n")
