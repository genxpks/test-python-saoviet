"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: BÀI 9 - THƯ VIỆN RANDOM — LÀM VIỆC VỚI SỐ NGẪU NHIÊN
"""

import random

so_ngau_nhien = random.randint(1, 10)
print("So may man hom nay la:", so_ngau_nhien)

hoa_qua = ["Tao", "Chuoi", "Cam", "Xoai"]
mon_duoc_chon = random.choice(hoa_qua)
print("Hom nay be duoc an qua:", mon_duoc_chon)
