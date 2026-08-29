"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: CHƯƠNG 4 — BÀI TẬP 3 (GỐC) - HIỂN THỊ THỜI GIAN THEO ĐỊNH DẠNG DỄ ĐỌC (DATETIME)
"""

import datetime

now = datetime.datetime.now()
print(f"Bay gio la {now.hour} : {now.minute} ngay {now.day} / {now.month} / {now.year}")
