"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: BÀI 11 - THƯ VIỆN DATETIME — LÀM VIỆC VỚI NGÀY VÀ GIỜ
"""

import datetime

now = datetime.datetime.now()

print("Bay gio la:", now.hour, "gio", now.minute, "phut")
print("Hom nay la ngay:", now.day, "thang", now.month, "nam", now.year)
