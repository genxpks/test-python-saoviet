"""
GIÁO TRÌNH PYTHON NÂNG CAO — TIN HỌC SAO VIỆT THỦ ĐỨC
Chủ đề: BÀI 8 - GIỚI THIỆU THƯ VIỆN VÀ CÁC CÁCH IMPORT TRONG PYTHON
"""

import math
print("Can bac hai cua 16 la:", math.sqrt(16))

from math import sqrt
print("Can bac hai cua 25 la:", sqrt(25))

import datetime as dt
now = dt.datetime.now()
print("Thoi gian hien tai:", now)
