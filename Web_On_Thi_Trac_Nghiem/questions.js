// Ngân hàng 140 Câu hỏi ôn tập và 21 Bài tập thực hành tự luận Python Nâng Cao
// Đơn vị: TIN HỌC SAO VIỆT THỦ ĐỨC
const QUIZ_DATA = {
  "title": "Ngân hàng 120 Câu Trắc Nghiệm & 10 Bài Thực Hành Python Nâng Cao",
  "center": "TIN HỌC SAO VIỆT THỦ ĐỨC",
  "total_mcq": 140,
  "total_practical": 21,
  "questions": [
    {
      "id": 1,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Trong Python, cú pháp nào sau đây dùng để khai báo một hàm mới?",
      "options": [
        "function my_func():",
        "def my_func():",
        "create my_func():",
        "func my_func():"
      ],
      "correct_answer": 1,
      "explanation": "Từ khóa 'def' là từ khóa chuẩn trong Python dùng để định nghĩa một hàm mới."
    },
    {
      "id": 2,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Kết quả của đoạn lệnh: s = 'Python'; print(s[0]) là gì?",
      "options": [
        "P",
        "y",
        "n",
        "Báo lỗi"
      ],
      "correct_answer": 0,
      "explanation": "Chỉ số index trong Python bắt đầu từ vị trí 0, do đó s[0] lấy ký tự đầu tiên là 'P'."
    },
    {
      "id": 3,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để lấy ký tự cuối cùng của chuỗi s, ta dùng chỉ số nào?",
      "options": [
        "s[1]",
        "s[end]",
        "s[-1]",
        "s[last]"
      ],
      "correct_answer": 2,
      "explanation": "Chỉ số âm -1 đại diện cho phần tử cuối cùng của chuỗi hoặc danh sách trong Python."
    },
    {
      "id": 4,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Phương thức nào dùng để viết hoa chữ cái đầu tiên của từng từ trong chuỗi?",
      "options": [
        "upper()",
        "capitalize()",
        "title()",
        "lower()"
      ],
      "correct_answer": 2,
      "explanation": "Phương thức .title() tự động viết hoa chữ cái đầu của mỗi từ trong chuỗi."
    },
    {
      "id": 5,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Phương thức nào dùng để cắt bỏ khoảng trắng dư thừa ở hai đầu chuỗi?",
      "options": [
        "clean()",
        "strip()",
        "trim()",
        "cut()"
      ],
      "correct_answer": 1,
      "explanation": "Phương thức .strip() loại bỏ toàn bộ khoảng trắng ở đầu và cuối chuỗi."
    },
    {
      "id": 6,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Kết quả của đoạn lệnh: len('Sao Viet') là bao nhiêu?",
      "options": [
        "7",
        "8",
        "9",
        "6"
      ],
      "correct_answer": 1,
      "explanation": "Chuỗi 'Sao Viet' có 8 ký tự bao gồm 7 chữ cái và 1 khoảng trắng ở giữa."
    },
    {
      "id": 7,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để kiểm tra một chuỗi có toàn bộ là chữ số hay không, ta dùng hàm nào?",
      "options": [
        "s.isnumber()",
        "s.isdigit()",
        "s.isnumeric_only()",
        "s.check_digit()"
      ],
      "correct_answer": 1,
      "explanation": "Phương thức .isdigit() trả về True nếu tất cả ký tự trong chuỗi là chữ số từ 0-9."
    },
    {
      "id": 8,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Kết quả in của f-string: diem = 8.666; print(f'{diem:.2f}') là gì?",
      "options": [
        "8.6",
        "8.66",
        "8.67",
        "8.666"
      ],
      "correct_answer": 2,
      "explanation": "Cú pháp {diem:.2f} làm tròn số thực đến 2 chữ số thập phân, 8.666 làm tròn lên thành 8.67."
    },
    {
      "id": 9,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Trong Python, danh sách List được khai báo bằng cặp ngoặc nào?",
      "options": [
        "( )",
        "{ }",
        "[ ]",
        "< >"
      ],
      "correct_answer": 2,
      "explanation": "Danh sách List trong Python được định nghĩa bằng cặp ngoặc vuông [ ]."
    },
    {
      "id": 10,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để thêm một phần tử vào cuối danh sách a, ta dùng phương thức nào?",
      "options": [
        "a.add(x)",
        "a.append(x)",
        "a.insert_last(x)",
        "a.push(x)"
      ],
      "correct_answer": 1,
      "explanation": "Phương thức .append(x) thêm phần tử x vào vị trí cuối cùng của List."
    },
    {
      "id": 11,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Kết quả của đoạn lệnh: a = [10, 20, 30]; print(a[-1]) là gì?",
      "options": [
        "10",
        "20",
        "30",
        "Báo lỗi"
      ],
      "correct_answer": 2,
      "explanation": "a[-1] truy xuất phần tử cuối cùng của danh sách a, chính là số 30."
    },
    {
      "id": 12,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để tìm giá trị lớn nhất trong danh sách số a, ta dùng hàm nào?",
      "options": [
        "max(a)",
        "a.maximum()",
        "top(a)",
        "a.largest()"
      ],
      "correct_answer": 0,
      "explanation": "Hàm built-in max(a) tự động tìm và trả về phần tử có giá trị lớn nhất."
    },
    {
      "id": 13,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để sắp xếp danh sách a tăng dần trực tiếp, ta dùng lệnh nào?",
      "options": [
        "a.order()",
        "a.sort()",
        "sort(a)",
        "a.arrange()"
      ],
      "correct_answer": 1,
      "explanation": "Phương thức a.sort() sắp xếp các phần tử của List theo thứ tự tăng dần tại chỗ."
    },
    {
      "id": 14,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Dictionary trong Python lưu trữ dữ liệu dưới dạng cấu trúc nào?",
      "options": [
        "Chỉ gồm các giá trị số",
        "Cặp Khóa — Giá trị (Key — Value)",
        "Mảng 2 chiều cố định",
        "Hàng đợi FIFO"
      ],
      "correct_answer": 1,
      "explanation": "Dictionary lưu trữ dữ liệu dưới dạng các cặp Khóa - Giá trị {key: value}."
    },
    {
      "id": 15,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để lấy tất cả các cặp (Key, Value) từ từ điển d để duyệt vòng lặp, ta dùng:",
      "options": [
        "d.pairs()",
        "d.items()",
        "d.all()",
        "d.elements()"
      ],
      "correct_answer": 1,
      "explanation": "Phương thức d.items() trả về danh sách các tuple chứa cả khóa và giá trị."
    },
    {
      "id": 16,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Lệnh nào dùng để kết thúc hàm và trả kết quả về nơi gọi?",
      "options": [
        "stop",
        "exit",
        "return",
        "break"
      ],
      "correct_answer": 2,
      "explanation": "Từ khóa return kết thúc việc thực thi hàm và trả về giá trị tính toán được."
    },
    {
      "id": 17,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Nếu một hàm không có lệnh return, giá trị trả về mặc định của hàm là gì?",
      "options": [
        "0",
        "False",
        "None",
        "'' (Chuỗi rỗng)"
      ],
      "correct_answer": 2,
      "explanation": "Trong Python, hàm không có return hoặc chỉ gọi return không giá trị sẽ trả về None."
    },
    {
      "id": 18,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để nạp thư viện toán học Math vào chương trình, cú pháp chuẩn là gì?",
      "options": [
        "include math",
        "import math",
        "using math",
        "require math"
      ],
      "correct_answer": 1,
      "explanation": "Từ khóa 'import' dùng để nạp các module/thư viện trong Python."
    },
    {
      "id": 19,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Hàm nào trong thư viện random dùng để sinh một số nguyên ngẫu nhiên từ a đến b?",
      "options": [
        "random.rand(a, b)",
        "random.randint(a, b)",
        "random.choice(a, b)",
        "random.integer(a, b)"
      ],
      "correct_answer": 1,
      "explanation": "random.randint(a, b) sinh số nguyên ngẫu nhiên trong đoạn [a, b] (bao gồm cả a và b)."
    },
    {
      "id": 20,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để bốc thăm ngẫu nhiên một phần tử từ một danh sách list, ta dùng:",
      "options": [
        "random.randint(list)",
        "random.pick(list)",
        "random.choice(list)",
        "random.select(list)"
      ],
      "correct_answer": 2,
      "explanation": "Hàm random.choice(danh_sach) chọn ngẫu nhiên 1 phần tử từ tập hợp."
    },
    {
      "id": 21,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Hằng số số Pi trong thư viện math được truy xuất bằng cú pháp nào?",
      "options": [
        "math.PI()",
        "math.pi",
        "math.PI_VALUE",
        "math.get_pi()"
      ],
      "correct_answer": 1,
      "explanation": "math.pi là biến hằng số lưu giá trị xấp xỉ 3.141592653589793."
    },
    {
      "id": 22,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Kết quả của math.sqrt(25) là kiểu dữ liệu gì và giá trị bao nhiêu?",
      "options": [
        "Số nguyên 5",
        "Số thực 5.0",
        "Chuỗi '5'",
        "Số phức 5j"
      ],
      "correct_answer": 1,
      "explanation": "Hàm math.sqrt() luôn luôn trả về kết quả dưới dạng số thực (float) là 5.0."
    },
    {
      "id": 23,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để tính giai thừa của số 5 (5! = 120), ta gọi hàm nào?",
      "options": [
        "math.fact(5)",
        "math.factorial(5)",
        "math.pow(5)",
        "math.giai_thua(5)"
      ],
      "correct_answer": 1,
      "explanation": "Hàm math.factorial(n) tính toán giai thừa của số nguyên n không âm."
    },
    {
      "id": 24,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để lấy thời gian thực hiện tại của hệ thống, ta dùng lệnh nào?",
      "options": [
        "datetime.now()",
        "datetime.datetime.now()",
        "datetime.get_current_time()",
        "time.current()"
      ],
      "correct_answer": 1,
      "explanation": "datetime.datetime.now() trả về đối tượng ngày giờ hiện tại đầy đủ."
    },
    {
      "id": 25,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Trong thư viện Turtle, lệnh nào dùng để đưa chú rùa tiến thẳng về phía trước 100 bước?",
      "options": [
        "but_ve.move(100)",
        "but_ve.forward(100)",
        "but_ve.go(100)",
        "but_ve.step(100)"
      ],
      "correct_answer": 1,
      "explanation": "Lệnh but_ve.forward(100) hoặc but_ve.fd(100) di chuyển rùa tiến thẳng."
    },
    {
      "id": 26,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Lệnh nào dùng để xoay góc chú rùa sang bên phải 90 độ?",
      "options": [
        "but_ve.turn_right(90)",
        "but_ve.right(90)",
        "but_ve.rotate_right(90)",
        "but_ve.r(90)"
      ],
      "correct_answer": 1,
      "explanation": "Lệnh but_ve.right(90) hoặc but_ve.rt(90) xoay rùa sang phải 90 độ."
    },
    {
      "id": 27,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để nhấc bút vẽ lên không để lại nét mực khi rùa di chuyển, ta dùng lệnh:",
      "options": [
        "but_ve.penoff()",
        "but_ve.penup()",
        "but_ve.lift()",
        "but_ve.hide_pen()"
      ],
      "correct_answer": 1,
      "explanation": "but_ve.penup() hoặc but_ve.up() nhấc bút lên khỏi mặt phẳng vẽ."
    },
    {
      "id": 28,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để đặt độ dày của nét vẽ Turtle là 4 điểm ảnh, ta dùng lệnh nào?",
      "options": [
        "but_ve.width(4)",
        "but_ve.pensize(4)",
        "but_ve.thickness(4)",
        "Cả A và B đều đúng"
      ],
      "correct_answer": 3,
      "explanation": "Trong Turtle, cả pensize(4) và width(4) đều dùng để thiết lập độ dày nét vẽ."
    },
    {
      "id": 29,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Lệnh nào giữ cho cửa sổ đồ họa Turtle luôn hiển thị sau khi vẽ xong?",
      "options": [
        "turtle.stay()",
        "turtle.keep()",
        "turtle.done()",
        "turtle.stop()"
      ],
      "correct_answer": 2,
      "explanation": "turtle.done() hoặc turtle.mainloop() giữ cửa sổ đồ họa mở để người dùng quan sát."
    },
    {
      "id": 30,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để đổi màu nền của cửa sổ Turtle thành màu xanh lá, ta dùng lệnh:",
      "options": [
        "screen.bgcolor('green')",
        "turtle.background('green')",
        "screen.color('green')",
        "turtle.set_screen('green')"
      ],
      "correct_answer": 0,
      "explanation": "screen.bgcolor('green') thiết lập màu nền (background color) cho màn hình vẽ."
    },
    {
      "id": 31,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Kết quả của đoạn lệnh: print('10' + '20') là gì?",
      "options": [
        "30",
        "1020",
        "Báo lỗi",
        "10 20"
      ],
      "correct_answer": 1,
      "explanation": "Dấu cộng giữa 2 chuỗi là phép ghép nối chuỗi (concatenation), ghép '10' và '20' thành '1020'."
    },
    {
      "id": 32,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Lệnh nào dùng để chuyển chuỗi '123' thành số nguyên 123?",
      "options": [
        "str(123)",
        "int('123')",
        "float('123')",
        "number('123')"
      ],
      "correct_answer": 1,
      "explanation": "Hàm int() thực hiện ép kiểu từ chuỗi ký tự sang số nguyên."
    },
    {
      "id": 33,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Kết quả của phép chia lấy dư: 17 % 5 là bao nhiêu?",
      "options": [
        "3",
        "2",
        "3.4",
        "1"
      ],
      "correct_answer": 1,
      "explanation": "17 chia 5 được 3 dư 2, toán tử % lấy phần dư nên kết quả là 2."
    },
    {
      "id": 34,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Trong vòng lặp for i in range(1, 5), biến i sẽ nhận lần lượt các giá trị nào?",
      "options": [
        "1, 2, 3, 4, 5",
        "1, 2, 3, 4",
        "0, 1, 2, 3, 4",
        "0, 1, 2, 3, 4, 5"
      ],
      "correct_answer": 1,
      "explanation": "Hàm range(start, stop) chạy từ start đến stop - 1, do đó range(1, 5) gồm 1, 2, 3, 4."
    },
    {
      "id": 35,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Lệnh nào dùng để thoát khỏi vòng lặp ngay lập tức?",
      "options": [
        "continue",
        "exit",
        "break",
        "return"
      ],
      "correct_answer": 2,
      "explanation": "Từ khóa break ngắt và thoát khỏi vòng lặp gần nhất ngay lập tức."
    },
    {
      "id": 36,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Cú pháp s[::-1] trên một chuỗi s có tác dụng gì?",
      "options": [
        "Lấy ký tự đầu",
        "Lấy ký tự cuối",
        "Đảo ngược chuỗi",
        "Xóa chuỗi"
      ],
      "correct_answer": 2,
      "explanation": "Slicing bước nhảy -1 (s[::-1]) duyệt chuỗi từ cuối lên đầu, tạo ra chuỗi đảo ngược."
    },
    {
      "id": 37,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để kiểm tra một chuỗi chỉ gồm chữ cái và số (không chứa khoảng trắng hay ký tự đặc biệt), ta dùng:",
      "options": [
        "s.isalpha()",
        "s.isdigit()",
        "s.isalnum()",
        "s.isspace()"
      ],
      "correct_answer": 2,
      "explanation": "s.isalnum() (is alpha-numeric) kiểm tra chuỗi chỉ gồm chữ cái và chữ số."
    },
    {
      "id": 38,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Để tô màu kín cho một hình vẽ khép kín trong Turtle, ta kẹp các lệnh vẽ ở giữa cặp lệnh nào?",
      "options": [
        "begin_fill() và end_fill()",
        "start_color() và stop_color()",
        "fill_on() và fill_off()",
        "paint_begin() và paint_end()"
      ],
      "correct_answer": 0,
      "explanation": "Cặp lệnh but_ve.begin_fill() và but_ve.end_fill() tự động tô màu kín hình đa giác."
    },
    {
      "id": 39,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Tổng các góc ngoài của một hình ngũ giác đều là bao nhiêu độ?",
      "options": [
        "180 độ",
        "360 độ",
        "540 độ",
        "720 độ"
      ],
      "correct_answer": 1,
      "explanation": "Tổng góc ngoài của mọi đa giác lồi luôn luôn bằng 360 độ (mỗi góc xoay là 360 / 5 = 72 độ)."
    },
    {
      "id": 40,
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD (1 đáp án)",
      "question": "Đoạn mã: a = [1, 2, 3]; a.append([4, 5]); len(a) cho kết quả là:",
      "options": [
        "5",
        "4",
        "3",
        "Báo lỗi"
      ],
      "correct_answer": 1,
      "explanation": "Phương thức .append([4, 5]) thêm cả danh sách con [4, 5] như 1 phần tử duy nhất, len(a) là 4."
    },
    {
      "id": 41,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Trong Python, chuỗi ký tự (String) là kiểu dữ liệu có thể thay đổi (Mutable) trực tiếp từng ký tự bằng phép gán s[0] = 'X'.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 1,
      "explanation": "Sai. Chuỗi trong Python là kiểu bất biến (Immutable), không thể thay đổi giá trị từng ký tự trực tiếp."
    },
    {
      "id": 42,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Hàm random.randint(1, 6) có thể sinh ra số 6.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 0,
      "explanation": "Đúng. random.randint(a, b) bao gồm cả giá trị cận trên b (1 đến 6)."
    },
    {
      "id": 43,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Từ khóa return trong hàm Python sẽ kết thúc hàm ngay lập tức khi được thực thi.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 0,
      "explanation": "Đúng. Khi gặp lệnh return, luồng chương trình thoát khỏi hàm và trả về giá trị."
    },
    {
      "id": 44,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Trong Dictionary của Python, hai khóa (Key) khác nhau có thể chứa hai giá trị (Value) giống nhau.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 0,
      "explanation": "Đúng. Các Key phải là duy nhất, nhưng các Value gắn với Key thì hoàn toàn có thể trùng nhau."
    },
    {
      "id": 45,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Góc quay ngoài của tam giác đều khi vẽ bằng thư viện Turtle là 60 độ.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 1,
      "explanation": "Sai. Góc ngoài của tam giác đều là 120 độ (360 / 3 = 120 độ). 60 độ là góc trong."
    },
    {
      "id": 46,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Phương thức s.strip() sẽ xóa toàn bộ khoảng trắng ở giữa các từ trong câu.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 1,
      "explanation": "Sai. .strip() chỉ xóa khoảng trắng thừa ở 2 đầu chuỗi, không xóa khoảng trắng ở giữa các từ."
    },
    {
      "id": 47,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Toán tử len() có thể dùng để đếm số phần tử của cả String, List và Dictionary.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 0,
      "explanation": "Đúng. Hàm len() áp dụng được cho mọi cấu trúc tuần tự và tập hợp trong Python."
    },
    {
      "id": 48,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Phương thức a.sort() trả về một danh sách mới mà không làm thay đổi danh sách ban đầu.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 1,
      "explanation": "Sai. a.sort() sắp xếp trực tiếp trên danh sách gốc và trả về None. Muốn tạo danh sách mới ta dùng hàm sorted(a)."
    },
    {
      "id": 49,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Để import hàm sqrt từ thư viện math, ta có thể viết: from math import sqrt.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 0,
      "explanation": "Đúng. Đây là cú pháp import trực tiếp hàm từ module."
    },
    {
      "id": 50,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Lệnh but_ve.penup() sẽ xóa toàn bộ các nét vẽ đã vẽ trước đó trên màn hình.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 1,
      "explanation": "Sai. but_ve.penup() chỉ nhấc bút không vẽ tiếp, muốn xóa màn hình ta dùng lệnh but_ve.clear() hoặc reset()."
    },
    {
      "id": 51,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Tên biến trong Python có thể bắt đầu bằng chữ số (ví dụ: 1ten = 'An').",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 1,
      "explanation": "Sai. Tên biến trong Python không được phép bắt đầu bằng chữ số."
    },
    {
      "id": 52,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Khối lệnh con trong hàm Python bắt buộc phải được thụt lề (Indentation) đồng nhất.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 0,
      "explanation": "Đúng. Python dùng khoảng thụt lề (thường là 4 dấu cách hoặc 1 tab) để xác định khối lệnh."
    },
    {
      "id": 53,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Hàm math.pow(2, 3) trả về kết quả là số thực 8.0.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 0,
      "explanation": "Đúng. Hàm math.pow() luôn luôn trả về kiểu số thực float."
    },
    {
      "id": 54,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Khi dùng vòng lặp for i in range(5), biến i sẽ bắt đầu từ 1 đến 5.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 1,
      "explanation": "Sai. range(5) bắt đầu từ 0 đến 4."
    },
    {
      "id": 55,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Dictionary trong Python cho phép truy xuất phần tử theo số thứ tự index [0], [1].",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 1,
      "explanation": "Sai. Dictionary truy xuất qua Khóa Key (ví dụ d['ten']), không truy xuất qua vị trí index."
    },
    {
      "id": 56,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Lệnh but_ve.circle(50) trong Turtle vẽ hình tròn có đường kính là 50.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 1,
      "explanation": "Sai. Tham số 50 là Bán kính (radius) của hình tròn, đường kính sẽ là 100."
    },
    {
      "id": 57,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Trong f-string, biểu thức bên trong dấu ngoặc nhọn {} có thể là một phép tính toán học (ví dụ: f'{2 + 3}').",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 0,
      "explanation": "Đúng. f-string cho phép tính toán trực tiếp các biểu thức nằm trong ngoặc nhọn."
    },
    {
      "id": 58,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Lệnh datetime.datetime.now().year trả về năm hiện tại dưới dạng số nguyên.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 0,
      "explanation": "Đúng. Thuộc tính .year trả về năm dạng int (ví dụ: 2026)."
    },
    {
      "id": 59,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Toán tử 'in' có thể dùng để kiểm tra xem một phần tử có nằm trong List hay không.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 0,
      "explanation": "Đúng. Cú pháp 'x in a' trả về True nếu x tồn tại trong danh sách a."
    },
    {
      "id": 60,
      "type": "true_false",
      "type_name": "Trắc nghiệm Đúng / Sai",
      "question": "Lệnh turtle.speed(0) đặt tốc độ vẽ của chú rùa là chậm nhất.",
      "options": [
        "Đúng (True)",
        "Sai (False)"
      ],
      "correct_answer": 1,
      "explanation": "Sai. speed(0) là tốc độ vẽ nhanh nhất (không có độ trễ hoạt ảnh)."
    },
    {
      "id": 61,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những phương thức nào sau đây KHÔNG làm thay đổi chuỗi gốc ban đầu mà trả về chuỗi mới?",
      "options": [
        "upper()",
        "lower()",
        "strip()",
        "title()"
      ],
      "correct_answer": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Tất cả các phương thức xử lý chuỗi trong Python đều không sửa chuỗi gốc vì String là bất biến."
    },
    {
      "id": 62,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những cú pháp nào sau đây là cách import thư viện hợp lệ trong Python?",
      "options": [
        "import math",
        "from math import pi, sqrt",
        "import datetime as dt",
        "using math"
      ],
      "correct_answer": [
        0,
        1,
        2
      ],
      "explanation": "Các đáp án A, B, C đều là cú pháp import chuẩn của Python. 'using' là cú pháp của C#/C++."
    },
    {
      "id": 63,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những lệnh nào sau đây dùng để điều khiển chuyển động di chuyển của chú rùa Turtle?",
      "options": [
        "forward(100)",
        "backward(50)",
        "right(90)",
        "circle(40)"
      ],
      "correct_answer": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Cả 4 lệnh trên đều trực tiếp điều khiển hướng đi và vị trí của con trỏ bút vẽ Turtle."
    },
    {
      "id": 64,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Các kiểu dữ liệu nào sau đây lưu trữ dữ liệu theo thứ tự (Ordered Sequence) và có thể cắt chuỗi/slicing?",
      "options": [
        "String (Chuỗi)",
        "List (Danh sách)",
        "Tuple",
        "Dictionary (trong các bản Python cũ)"
      ],
      "correct_answer": [
        0,
        1,
        2
      ],
      "explanation": "String, List và Tuple là các kiểu dữ liệu tuần tự có chỉ mục vị trí index rõ ràng."
    },
    {
      "id": 65,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những hàm nào sau đây thuộc thư viện toán học math có sẵn trong Python?",
      "options": [
        "sqrt()",
        "factorial()",
        "pow()",
        "randint()"
      ],
      "correct_answer": [
        0,
        1,
        2
      ],
      "explanation": "sqrt, factorial, pow thuộc math. Còn randint thuộc thư viện random."
    },
    {
      "id": 66,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những câu lệnh nào sau đây giúp tạo một danh sách rỗng trong Python?",
      "options": [
        "a = []",
        "a = list()",
        "a = {}",
        "a = ()"
      ],
      "correct_answer": [
        0,
        1
      ],
      "explanation": "a = [] và a = list() tạo danh sách rỗng. {} tạo dictionary rỗng, () tạo tuple rỗng."
    },
    {
      "id": 67,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những thao tác nào sau đây có thể thực hiện trên một List trong Python?",
      "options": [
        "append()",
        "remove()",
        "sort()",
        "pop()"
      ],
      "correct_answer": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Tất cả 4 phương thức trên đều là các thao tác chuẩn có sẵn trên kiểu dữ liệu List."
    },
    {
      "id": 68,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những ký tự nào sau đây là ký tự điều khiển đặc biệt (Escape sequence) trong chuỗi Python?",
      "options": [
        "\\n (xuống dòng)",
        "\\t (thụt lề tab)",
        "\\\\ (in dấu gạch chéo)",
        "\\p (in hoa)"
      ],
      "correct_answer": [
        0,
        1,
        2
      ],
      "explanation": "\\n, \\t, \\\\ là các escape sequence chuẩn trong Python."
    },
    {
      "id": 69,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Các cách nào sau đây giúp duyệt qua các phần tử của một danh sách a = [10, 20, 30]?",
      "options": [
        "for x in a:",
        "for i in range(len(a)):",
        "for x in a.items():",
        "while i < len(a):"
      ],
      "correct_answer": [
        0,
        1,
        3
      ],
      "explanation": "Có thể duyệt trực tiếp qua giá trị, qua chỉ số index với range(len(a)) hoặc dùng while loop."
    },
    {
      "id": 70,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những câu lệnh nào sau đây dùng để thiết lập màu sắc trong đồ họa Turtle?",
      "options": [
        "color('red')",
        "color('blue', 'yellow')",
        "pencolor('green')",
        "fillcolor('orange')"
      ],
      "correct_answer": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Turtle hỗ trợ đầy đủ các lệnh đặt màu viền (pencolor), màu tô (fillcolor) và đặt cùng lúc (color)."
    },
    {
      "id": 71,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Để kiểm tra một số n có phải là số chẵn dương, những điều kiện nào sau đây là đúng?",
      "options": [
        "n % 2 == 0 and n > 0",
        "n > 0 and n % 2 == 0",
        "n % 2 != 1 and n >= 2",
        "n % 2 == 1 and n > 0"
      ],
      "correct_answer": [
        0,
        1,
        2
      ],
      "explanation": "Các phương án A, B, C đều biểu diễn chính xác điều kiện số nguyên chẵn dương."
    },
    {
      "id": 72,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những thuộc tính nào sau đây có thể lấy từ đối tượng now = datetime.datetime.now()?",
      "options": [
        "now.year",
        "now.month",
        "now.hour",
        "now.minute"
      ],
      "correct_answer": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Đối tượng datetime chứa đầy đủ các thuộc tính year, month, day, hour, minute, second."
    },
    {
      "id": 73,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những cách nào sau đây dùng để xóa một phần tử khỏi danh sách a?",
      "options": [
        "a.remove(x)",
        "del a[0]",
        "a.pop()",
        "a.delete(x)"
      ],
      "correct_answer": [
        0,
        1,
        2
      ],
      "explanation": "remove(x), del và pop() là 3 cách xóa phần tử hợp lệ trong Python."
    },
    {
      "id": 74,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những nhận định nào sau đây là ĐÚNG về hàm (function) trong Python?",
      "options": [
        "Giúp tái sử dụng mã nguồn",
        "Khai báo bắt đầu bằng từ khóa def",
        "Có thể nhận tham số đầu vào",
        "Bắt buộc phải có lệnh print"
      ],
      "correct_answer": [
        0,
        1,
        2
      ],
      "explanation": "Hàm giúp tái sử dụng code, dùng def và nhận tham số. Hàm không bắt buộc phải có print."
    },
    {
      "id": 75,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những giá trị nào sau đây khi chuyển sang kiểu Boolean bool(x) sẽ cho kết quả là False?",
      "options": [
        "0",
        "'' (Chuỗi rỗng)",
        "[] (List rỗng)",
        "'0' (Chuỗi số 0)"
      ],
      "correct_answer": [
        0,
        1,
        2
      ],
      "explanation": "Số 0, chuỗi rỗng và list rỗng mang giá trị Falsy. Chuỗi '0' có độ dài 1 nên mang giá trị True."
    },
    {
      "id": 76,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những phương thức nào sau đây giúp tìm kiếm vị trí của một chuỗi con?",
      "options": [
        "find()",
        "index()",
        "search()",
        "locate()"
      ],
      "correct_answer": [
        0,
        1
      ],
      "explanation": "find() và index() là 2 phương thức tìm kiếm vị trí chuỗi con chuẩn của kiểu String."
    },
    {
      "id": 77,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những tham số nào có thể truyền vào hàm print() để tùy biến hiển thị?",
      "options": [
        "sep=' '",
        "end='\\n'",
        "file=sys.stdout",
        "style='bold'"
      ],
      "correct_answer": [
        0,
        1,
        2
      ],
      "explanation": "sep và end là 2 tham số quan trọng nhất thường dùng trong print()."
    },
    {
      "id": 78,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những hình nào sau đây có thể vẽ dễ dàng bằng vòng lặp trong Turtle?",
      "options": [
        "Hình tam giác đều",
        "Hình vuông",
        "Hình ngôi sao 5 cánh",
        "Hình xoắn ốc"
      ],
      "correct_answer": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Tất cả các hình học đối xứng đều vẽ rất đẹp mắt bằng vòng lặp for trong Turtle."
    },
    {
      "id": 79,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những hàm nào sau đây của module random trả về kết quả ngẫu nhiên?",
      "options": [
        "random.randint(1, 10)",
        "random.choice(['A', 'B'])",
        "random.random()",
        "random.shuffle(list)"
      ],
      "correct_answer": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Tất cả các hàm trên đều thuộc thư viện random dùng để thao tác ngẫu nhiên hóa."
    },
    {
      "id": 80,
      "type": "multiple_choice",
      "type_name": "Trắc nghiệm chọn nhiều đáp án đúng",
      "question": "Những phép toán nào sau đây cho kết quả là số thực (float)?",
      "options": [
        "10 / 2",
        "math.sqrt(9)",
        "2.5 * 2",
        "10 // 2"
      ],
      "correct_answer": [
        0,
        1,
        2
      ],
      "explanation": "Phép chia /, hàm sqrt() và phép tính với số thực đều trả về float. Phép chia nguyên // trả về int."
    },
    {
      "id": 81,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Từ khóa để bắt đầu định nghĩa một hàm trong Python là từ khóa: ___.",
      "correct_answer": "def",
      "explanation": "Cú pháp chuẩn: def ten_ham(tham_so):"
    },
    {
      "id": 82,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Để nhấc bút vẽ lên trong Turtle mà không vẽ nét khi di chuyển, ta dùng lệnh: but_ve.___().",
      "correct_answer": "penup",
      "explanation": "but_ve.penup() nhấc bút lên khỏi mặt vẽ."
    },
    {
      "id": 83,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Trong f-string, để định dạng số thực x làm tròn 2 chữ số thập phân ta viết: f'{x:.___}'.",
      "correct_answer": ".2f",
      "explanation": "Ký hiệu .2f có nghĩa là float được làm tròn 2 chữ số sau dấu thập phân."
    },
    {
      "id": 84,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Để sinh số nguyên ngẫu nhiên trong khoảng từ 1 đến 100, ta dùng hàm: random.___(1, 100).",
      "correct_answer": "randint",
      "explanation": "Hàm random.randint(a, b) sinh số nguyên ngẫu nhiên."
    },
    {
      "id": 85,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Để thêm phần tử mới vào cuối danh sách List a, ta gọi phương thức: a.___(gia_tri).",
      "correct_answer": "append",
      "explanation": "Phương thức .append() thêm phần tử vào đuôi danh sách."
    },
    {
      "id": 86,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Để tính căn bậc hai của số 64 trong thư viện math, ta viết: math.___(64).",
      "correct_answer": "sqrt",
      "explanation": "Hàm math.sqrt() viết tắt của Square Root (căn bậc hai)."
    },
    {
      "id": 87,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Để xoay chú rùa sang bên phải 90 độ, ta dùng lệnh: but_ve.___(90).",
      "correct_answer": "right",
      "explanation": "but_ve.right(90) điều khiển rùa quay sang phải."
    },
    {
      "id": 88,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Phương thức dùng để loại bỏ khoảng trắng thừa ở hai đầu chuỗi là: s.___().",
      "correct_answer": "strip",
      "explanation": "Phương thức .strip() cắt bỏ khoảng trắng hai đầu."
    },
    {
      "id": 89,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Để lấy tổng số ký tự của một chuỗi hoặc số phần tử của danh sách, ta dùng hàm: ___(a).",
      "correct_answer": "len",
      "explanation": "Hàm built-in len() trả về độ dài (length) của đối tượng."
    },
    {
      "id": 90,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Để kết thúc vòng lặp ngay lập tức khi thỏa mãn điều kiện, ta dùng lệnh: ___.",
      "correct_answer": "break",
      "explanation": "Từ khóa break ngắt vòng lặp ngay lập tức."
    },
    {
      "id": 91,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Để lấy thời gian hiện tại trong module datetime, ta gọi: datetime.datetime.___().",
      "correct_answer": "now",
      "explanation": "Phương thức now() lấy mốc thời gian thực hiện tại."
    },
    {
      "id": 92,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Hằng số số Pi trong thư viện math được viết là: math.___.",
      "correct_answer": "pi",
      "explanation": "Hằng số math.pi lưu giá trị 3.141592653589793."
    },
    {
      "id": 93,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Để duyệt qua tất cả các cặp khóa - giá trị của từ điển d, ta gọi: for k, v in d.___():",
      "correct_answer": "items",
      "explanation": "Phương thức d.items() trả về danh sách các cặp (key, value)."
    },
    {
      "id": 94,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Để đảo ngược toàn bộ chuỗi s bằng kỹ thuật Slicing, ta viết: s[:::___].",
      "correct_answer": "-1",
      "explanation": "Bước nhảy -1 trong cú pháp s[::-1] đảo ngược chuỗi."
    },
    {
      "id": 95,
      "type": "fill_blank",
      "type_name": "Điền vào chỗ trống",
      "question": "Để giữ cửa sổ đồ họa Turtle luôn hiển thị sau khi chạy xong, ta gọi lệnh: turtle.___().",
      "correct_answer": "done",
      "explanation": "Lệnh turtle.done() giữ cửa sổ màn hình đồ họa mở."
    },
    {
      "id": 96,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các dòng lệnh sau theo đúng thứ tự để tạo và in thông tin học sinh bằng Dictionary:",
      "items": [
        "hoc_sinh = {}",
        "hoc_sinh['ten'] = 'Minh'",
        "hoc_sinh['diem'] = 9.5",
        "print(hoc_sinh)"
      ],
      "correct_order": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Quy trình: Tạo dict rỗng -> Gán tên -> Gán điểm -> In kết quả."
    },
    {
      "id": 97,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các bước để vẽ một hình vuông 4 cạnh trong Turtle:",
      "items": [
        "import turtle",
        "but_ve = turtle.Turtle()",
        "for i in range(4):",
        "    but_ve.forward(100)",
        "    but_ve.right(90)",
        "turtle.done()"
      ],
      "correct_order": [
        0,
        1,
        2,
        3,
        4,
        5
      ],
      "explanation": "Quy trình: Import thư viện -> Tạo bút vẽ -> Lặp 4 lần -> Tiến 100 -> Quay 90 -> Giữ màn hình."
    },
    {
      "id": 98,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các dòng lệnh để tính tổng các số từ 1 đến 5 bằng vòng lặp for:",
      "items": [
        "tong = 0",
        "for i in range(1, 6):",
        "    tong = tong + i",
        "print('Tong la:', tong)"
      ],
      "correct_order": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Quy trình: Khởi tạo biến tổng = 0 -> Duyệt i từ 1 đến 5 -> Cộng dồn i vào tổng -> In tổng."
    },
    {
      "id": 99,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các bước chuẩn để định nghĩa và gọi một hàm tính diện tích hình chữ nhật:",
      "items": [
        "def tinh_dien_tich(dai, rong):",
        "    return dai * rong",
        "ket_qua = tinh_dien_tich(5, 4)",
        "print('Dien tich la:', ket_qua)"
      ],
      "correct_order": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Quy trình: Khai báo hàm def -> Viết thân hàm return -> Gọi hàm truyền đối số -> In kết quả."
    },
    {
      "id": 100,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các dòng lệnh để bốc thăm ngẫu nhiên một món quà từ danh sách:",
      "items": [
        "import random",
        "qua_tang = ['But', 'Sach', 'Cap']",
        "mon_qua = random.choice(qua_tang)",
        "print('Mon qua trung thuong la:', mon_qua)"
      ],
      "correct_order": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Quy trình: Import module random -> Tạo danh sách quà -> Gọi random.choice() -> In kết quả."
    },
    {
      "id": 101,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các bước để nhập một số nguyên và kiểm tra số chẵn lẻ:",
      "items": [
        "n = int(input('Nhap n: '))",
        "if n % 2 == 0:",
        "    print(n, 'la so chan')",
        "else:",
        "    print(n, 'la so le')"
      ],
      "correct_order": [
        0,
        1,
        2,
        3,
        4
      ],
      "explanation": "Quy trình: Nhập dữ liệu ép kiểu int -> Kiểm tra điều kiện n % 2 == 0 -> In kết quả chẵn -> In kết quả lẻ."
    },
    {
      "id": 102,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các dòng lệnh để nhập 3 số vào List và sắp xếp tăng dần:",
      "items": [
        "ds = []",
        "for i in range(3):",
        "    so = int(input('Nhap so: '))",
        "    ds.append(so)",
        "ds.sort()",
        "print(ds)"
      ],
      "correct_order": [
        0,
        1,
        2,
        3,
        4,
        5
      ],
      "explanation": "Quy trình: Tạo list rỗng -> Lặp 3 lần nhập số và append -> Sắp xếp bằng sort() -> In danh sách."
    },
    {
      "id": 103,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các bước để chuẩn hóa một chuỗi họ tên người dùng:",
      "items": [
        "s = '   nguyen van an   '",
        "s = s.strip()",
        "s = s.title()",
        "print('Ten chuan hoa:', s)"
      ],
      "correct_order": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Quy trình: Gán chuỗi thô -> Cắt khoảng trắng thừa .strip() -> Viết hoa chữ cái đầu .title() -> In kết quả."
    },
    {
      "id": 104,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các bước để vẽ tam giác đều tô màu đỏ trong Turtle:",
      "items": [
        "but_ve.color('red', 'red')",
        "but_ve.begin_fill()",
        "for i in range(3):",
        "    but_ve.forward(100)",
        "    but_ve.left(120)",
        "but_ve.end_fill()"
      ],
      "correct_order": [
        0,
        1,
        2,
        3,
        4,
        5
      ],
      "explanation": "Quy trình: Đặt màu bút và màu tô -> begin_fill() -> Lặp 3 lần vẽ tam giác -> end_fill() kết thúc tô màu."
    },
    {
      "id": 105,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các dòng lệnh để đếm số lượng ký tự số trong một chuỗi:",
      "items": [
        "s = 'Python2026'",
        "dem = 0",
        "for ch in s:",
        "    if ch.isdigit():",
        "        dem += 1",
        "print('So chu so la:', dem)"
      ],
      "correct_order": [
        0,
        1,
        2,
        3,
        4,
        5
      ],
      "explanation": "Quy trình: Khởi tạo chuỗi và biến đếm -> Duyệt từng ký tự -> Kiểm tra .isdigit() -> Tăng đếm -> In kết quả."
    },
    {
      "id": 106,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các bước để tính căn bậc hai của một số nhập từ bàn phím:",
      "items": [
        "import math",
        "x = float(input('Nhap so: '))",
        "can_bac_hai = math.sqrt(x)",
        "print(f'Can bac hai la: {can_bac_hai:.2f}')"
      ],
      "correct_order": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Quy trình: Import math -> Nhập số float -> Tính math.sqrt() -> In định dạng .2f."
    },
    {
      "id": 107,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các bước để in bảng cửu chương 5 từ 1 đến 10:",
      "items": [
        "n = 5",
        "print(f'Bang cuu chuong {n}:')",
        "for i in range(1, 11):",
        "    print(f'{n} x {i} = {n * i}')"
      ],
      "correct_order": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Quy trình: Gán n = 5 -> In tiêu đề -> Vòng lặp for 1..10 -> In từng dòng phép tính nhân."
    },
    {
      "id": 108,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các bước để lưu danh bạ điện thoại và tra cứu theo tên:",
      "items": [
        "danh_ba = {'An': '090123'}",
        "ten = input('Nhap ten can tra: ')",
        "if ten in danh_ba:",
        "    print('SDT:', danh_ba[ten])"
      ],
      "correct_order": [
        0,
        1,
        2,
        3
      ],
      "explanation": "Quy trình: Tạo từ điển danh bạ -> Nhập tên tra cứu -> Kiểm tra 'in danh_ba' -> In số điện thoại."
    },
    {
      "id": 109,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các bước để lấy ngày tháng năm hiện tại và in ra màn hình:",
      "items": [
        "import datetime",
        "now = datetime.datetime.now()",
        "ngay = now.day",
        "thang = now.month",
        "nam = now.year",
        "print(f'{ngay}/{thang}/{nam}')"
      ],
      "correct_order": [
        0,
        1,
        2,
        3,
        4,
        5
      ],
      "explanation": "Quy trình: Import datetime -> Lấy now() -> Tách ngày, tháng, năm -> In định dạng ngày/tháng/năm."
    },
    {
      "id": 110,
      "type": "sequence_order",
      "type_name": "Sắp xếp thứ tự logic / đoạn mã",
      "question": "Hãy sắp xếp các bước để nhấc bút, di chuyển sang vị trí mới và vẽ hình tiếp theo:",
      "items": [
        "but_ve.forward(100)",
        "but_ve.penup()",
        "but_ve.forward(50)",
        "but_ve.pendown()",
        "but_ve.circle(30)"
      ],
      "correct_order": [
        0,
        1,
        2,
        3,
        4
      ],
      "explanation": "Quy trình: Vẽ đoạn 1 -> Nhấc bút penup() -> Dịch chuyển khoảng cách trống -> Hạ bút pendown() -> Vẽ hình tròn."
    },
    {
      "id": 111,
      "type": "matching",
      "type_name": "Nối quy trình / Ghép cặp khái niệm",
      "question": "Hãy ghép cặp giữa Phương thức xử lý chuỗi và Chức năng hoạt động tương ứng:",
      "pairs": [
        {
          "left": "upper()",
          "right": "Chuyển thành chữ hoa toàn bộ"
        },
        {
          "left": "lower()",
          "right": "Chuyển thành chữ thường toàn bộ"
        },
        {
          "left": "strip()",
          "right": "Xóa khoảng trắng thừa ở hai đầu"
        },
        {
          "left": "title()",
          "right": "Viết hoa chữ cái đầu của mỗi từ"
        }
      ],
      "left_items": [
        "upper()",
        "lower()",
        "strip()",
        "title()"
      ],
      "right_items": [
        "Chuyển thành chữ hoa toàn bộ",
        "Chuyển thành chữ thường toàn bộ",
        "Xóa khoảng trắng thừa ở hai đầu",
        "Viết hoa chữ cái đầu của mỗi từ"
      ],
      "explanation": "Mỗi phương thức chuỗi có một công dụng định dạng chuyên biệt."
    },
    {
      "id": 112,
      "type": "matching",
      "type_name": "Nối quy trình / Ghép cặp khái niệm",
      "question": "Hãy ghép cặp giữa Tên hàm trong module math và Ý nghĩa toán học:",
      "pairs": [
        {
          "left": "sqrt(x)",
          "right": "Tính căn bậc hai của số x"
        },
        {
          "left": "pow(a, b)",
          "right": "Tính lũy thừa a mũ b"
        },
        {
          "left": "factorial(n)",
          "right": "Tính giai thừa n!"
        },
        {
          "left": "pi",
          "right": "Hằng số Pi xấp xỉ 3.14159"
        }
      ],
      "left_items": [
        "sqrt(x)",
        "pow(a, b)",
        "factorial(n)",
        "pi"
      ],
      "right_items": [
        "Tính căn bậc hai của số x",
        "Tính lũy thừa a mũ b",
        "Tính giai thừa n!",
        "Hằng số Pi xấp xỉ 3.14159"
      ],
      "explanation": "Module math cung cấp đầy đủ các phép toán khoa học chính xác cao."
    },
    {
      "id": 113,
      "type": "matching",
      "type_name": "Nối quy trình / Ghép cặp khái niệm",
      "question": "Hãy ghép cặp giữa Câu lệnh Turtle và Tác vụ đồ họa tương ứng:",
      "pairs": [
        {
          "left": "forward(d)",
          "right": "Tiến thẳng d bước"
        },
        {
          "left": "right(angle)",
          "right": "Xoay phải một góc angle độ"
        },
        {
          "left": "circle(r)",
          "right": "Vẽ hình tròn bán kính r"
        },
        {
          "left": "penup()",
          "right": "Nhấc bút không vẽ nét"
        }
      ],
      "left_items": [
        "forward(d)",
        "right(angle)",
        "circle(r)",
        "penup()"
      ],
      "right_items": [
        "Tiến thẳng d bước",
        "Xoay phải một góc angle độ",
        "Vẽ hình tròn bán kính r",
        "Nhấc bút không vẽ nét"
      ],
      "explanation": "Các câu lệnh cơ bản giúp điều khiển đường đi của bút vẽ Turtle."
    },
    {
      "id": 114,
      "type": "matching",
      "type_name": "Nối quy trình / Ghép cặp khái niệm",
      "question": "Hãy ghép cặp giữa Phương thức của List và Tác vụ trên danh sách:",
      "pairs": [
        {
          "left": "append(x)",
          "right": "Thêm phần tử vào cuối danh sách"
        },
        {
          "left": "remove(x)",
          "right": "Xóa phần tử x đầu tiên tìm thấy"
        },
        {
          "left": "sort()",
          "right": "Sắp xếp danh sách tăng dần"
        },
        {
          "left": "pop()",
          "right": "Lấy và xóa phần tử cuối cùng"
        }
      ],
      "left_items": [
        "append(x)",
        "remove(x)",
        "sort()",
        "pop()"
      ],
      "right_items": [
        "Thêm phần tử vào cuối danh sách",
        "Xóa phần tử x đầu tiên tìm thấy",
        "Sắp xếp danh sách tăng dần",
        "Lấy và xóa phần tử cuối cùng"
      ],
      "explanation": "Các phương thức giúp chỉnh sửa và quản trị danh sách linh hoạt."
    },
    {
      "id": 115,
      "type": "matching",
      "type_name": "Nối quy trình / Ghép cặp khái niệm",
      "question": "Hãy ghép cặp giữa Thư viện Python và Lĩnh vực ứng dụng chính:",
      "pairs": [
        {
          "left": "random",
          "right": "Sinh số và bốc thăm ngẫu nhiên"
        },
        {
          "left": "math",
          "right": "Các phép toán nâng cao và lượng giác"
        },
        {
          "left": "datetime",
          "right": "Xử lý ngày tháng và thời gian thực"
        },
        {
          "left": "turtle",
          "right": "Lập trình đồ họa vẽ tranh hình học"
        }
      ],
      "left_items": [
        "random",
        "math",
        "datetime",
        "turtle"
      ],
      "right_items": [
        "Sinh số và bốc thăm ngẫu nhiên",
        "Các phép toán nâng cao và lượng giác",
        "Xử lý ngày tháng và thời gian thực",
        "Lập trình đồ họa vẽ tranh hình học"
      ],
      "explanation": "Python có hệ sinh thái thư viện phong phú phục vụ đa dạng nhu cầu."
    },
    {
      "id": 116,
      "type": "matching",
      "type_name": "Nối quy trình / Ghép cặp khái niệm",
      "question": "Hãy ghép cặp giữa Ký tự điều khiển (Escape Code) và Ý nghĩa hiển thị:",
      "pairs": [
        {
          "left": "\\n",
          "right": "Xuống dòng mới"
        },
        {
          "left": "\\t",
          "right": "Thụt lề một khoảng Tab"
        },
        {
          "left": "\\\\",
          "right": "In ký tự dấu gạch chéo ngược"
        },
        {
          "left": "\\'",
          "right": "In ký tự dấu nháy đơn trong chuỗi"
        }
      ],
      "left_items": [
        "\\n",
        "\\t",
        "\\\\",
        "\\'"
      ],
      "right_items": [
        "Xuống dòng mới",
        "Thụt lề một khoảng Tab",
        "In ký tự dấu gạch chéo ngược",
        "In ký tự dấu nháy đơn trong chuỗi"
      ],
      "explanation": "Ký tự escape giúp in các định dạng văn bản đặc biệt."
    },
    {
      "id": 117,
      "type": "matching",
      "type_name": "Nối quy trình / Ghép cặp khái niệm",
      "question": "Hãy ghép cặp giữa Cú pháp Slicing và Kết quả trích xuất:",
      "pairs": [
        {
          "left": "s[0]",
          "right": "Lấy ký tự đầu tiên"
        },
        {
          "left": "s[-1]",
          "right": "Lấy ký tự cuối cùng"
        },
        {
          "left": "s[:3]",
          "right": "Lấy 3 ký tự đầu tiên"
        },
        {
          "left": "s[::-1]",
          "right": "Đảo ngược toàn bộ chuỗi"
        }
      ],
      "left_items": [
        "s[0]",
        "s[-1]",
        "s[:3]",
        "s[::-1]"
      ],
      "right_items": [
        "Lấy ký tự đầu tiên",
        "Lấy ký tự cuối cùng",
        "Lấy 3 ký tự đầu tiên",
        "Đảo ngược toàn bộ chuỗi"
      ],
      "explanation": "Kỹ thuật Slicing là công cụ cắt lọc chuỗi mạnh mẽ nhất trong Python."
    },
    {
      "id": 118,
      "type": "matching",
      "type_name": "Nối quy trình / Ghép cặp khái niệm",
      "question": "Hãy ghép cặp giữa Cấu trúc lệnh và Mục đích sử dụng trong lập trình:",
      "pairs": [
        {
          "left": "def",
          "right": "Định nghĩa một hàm tái sử dụng"
        },
        {
          "left": "return",
          "right": "Trả về giá trị từ hàm"
        },
        {
          "left": "break",
          "right": "Thoát khỏi vòng lặp ngay lập tức"
        },
        {
          "left": "continue",
          "right": "Bỏ qua lần lặp hiện tại để sang lần kế tiếp"
        }
      ],
      "left_items": [
        "def",
        "return",
        "break",
        "continue"
      ],
      "right_items": [
        "Định nghĩa một hàm tái sử dụng",
        "Trả về giá trị từ hàm",
        "Thoát khỏi vòng lặp ngay lập tức",
        "Bỏ qua lần lặp hiện tại để sang lần kế tiếp"
      ],
      "explanation": "Các từ khóa cốt lõi điều khiển luồng thực thi chương trình."
    },
    {
      "id": 119,
      "type": "matching",
      "type_name": "Nối quy trình / Ghép cặp khái niệm",
      "question": "Hãy ghép cặp giữa Phương thức kiểm tra chuỗi và Điều kiện trả về True:",
      "pairs": [
        {
          "left": "isdigit()",
          "right": "Toàn bộ chuỗi là chữ số 0-9"
        },
        {
          "left": "isalpha()",
          "right": "Toàn bộ chuỗi là chữ cái"
        },
        {
          "left": "isalnum()",
          "right": "Chuỗi gồm chữ cái và số kết hợp"
        },
        {
          "left": "isspace()",
          "right": "Toàn bộ chuỗi là khoảng trắng"
        }
      ],
      "left_items": [
        "isdigit()",
        "isalpha()",
        "isalnum()",
        "isspace()"
      ],
      "right_items": [
        "Toàn bộ chuỗi là chữ số 0-9",
        "Toàn bộ chuỗi là chữ cái",
        "Chuỗi gồm chữ cái và số kết hợp",
        "Toàn bộ chuỗi là khoảng trắng"
      ],
      "explanation": "Các hàm tiền tố 'is' giúp kiểm tra tính hợp lệ của dữ liệu người dùng nhập."
    },
    {
      "id": 120,
      "type": "matching",
      "type_name": "Nối quy trình / Ghép cặp khái niệm",
      "question": "Hãy ghép cặp giữa Câu lệnh màu sắc Turtle và Đối tượng áp dụng:",
      "pairs": [
        {
          "left": "bgcolor('color')",
          "right": "Đặt màu nền cho toàn bộ cửa sổ"
        },
        {
          "left": "pensize(size)",
          "right": "Đặt độ dày của nét bút vẽ"
        },
        {
          "left": "begin_fill()",
          "right": "Bắt đầu vùng tô màu kín"
        },
        {
          "left": "color('c1', 'c2')",
          "right": "Đặt đồng thời màu viền c1 và màu tô c2"
        }
      ],
      "left_items": [
        "bgcolor('color')",
        "pensize(size)",
        "begin_fill()",
        "color('c1', 'c2')"
      ],
      "right_items": [
        "Đặt màu nền cho toàn bộ cửa sổ",
        "Đặt độ dày của nét bút vẽ",
        "Bắt đầu vùng tô màu kín",
        "Đặt đồng thời màu viền c1 và màu tô c2"
      ],
      "explanation": "Làm chủ các lệnh màu sắc giúp tạo nên những bức tranh đồ họa sinh động."
    },
    {
      "id": 121,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Từ khóa nào dùng để định nghĩa hàm trong Python?",
      "options": [
        "define",
        "def",
        "function",
        "func"
      ],
      "correct_answer": 1,
      "explanation": "Trong Python, từ khóa chuẩn để định nghĩa một hàm là 'def' (viết tắt của define), cú pháp: def ten_ham(tham_so):",
      "option_explanations": {
        "0": "'define' là từ khóa trong một số ngôn ngữ khác (như C/C++ macro #define), không phải cú pháp định nghĩa hàm trong Python.",
        "1": "Chính xác! 'def' là từ khóa chuẩn trong Python để bắt đầu định nghĩa hàm.",
        "2": "'function' là từ khóa dùng trong JavaScript hoặc PHP, Python không sử dụng từ khóa này.",
        "3": "'func' là từ khóa trong ngôn ngữ Go hoặc Swift, không hợp lệ trong Python."
      }
    },
    {
      "id": 122,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Lệnh nào dùng để nạp (import) thư viện math trong Python?",
      "options": [
        "include math",
        "import math",
        "require math",
        "using math"
      ],
      "correct_answer": 1,
      "explanation": "Trong Python, lệnh 'import' được sử dụng để nạp các module/thư viện chuẩn hoặc bên ngoài vào chương trình.",
      "option_explanations": {
        "0": "'include' được dùng trong C/C++ (#include <math.h>), Python không có từ khóa này.",
        "1": "Chính xác! Cú pháp 'import ten_thu_vien' là chuẩn tắc trong Python.",
        "2": "'require' là cú pháp trong Node.js / Ruby / PHP, không dùng trong Python.",
        "3": "'using' là cú pháp trong C# / C++, không tồn tại trong Python."
      }
    },
    {
      "id": 123,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Hàm nào trong thư viện math dùng để tính căn bậc hai của một số?",
      "options": [
        "sqrt()",
        "root()",
        "square()",
        "pow()"
      ],
      "correct_answer": 0,
      "explanation": "Hàm math.sqrt(x) (viết tắt của Square Root) được dùng để tính căn bậc hai của số không âm x.",
      "option_explanations": {
        "0": "Chính xác! math.sqrt(x) tính căn bậc hai của x.",
        "1": "Thư viện math không có hàm tên là 'root()'.",
        "2": "'square()' không có trong thư viện math; nếu muốn tính bình phương ta dùng toán tử x ** 2 hoặc math.pow(x, 2).",
        "3": "math.pow(x, y) dùng để tính lũy thừa x^y, không phải hàm chuyên dụng tính căn bậc hai."
      }
    },
    {
      "id": 124,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Kết quả của biểu thức cắt chuỗi (slicing) \"Python\"[1:4] là gì?",
      "options": [
        "\"Pyt\"",
        "\"yth\"",
        "\"thon\"",
        "\"Python\""
      ],
      "correct_answer": 1,
      "explanation": "Cú pháp slicing s[start:stop] lấy từ chỉ số start đến stop - 1. Với \"Python\": vị trí 1 là 'y', vị trí 2 là 't', vị trí 3 là 'h' (dừng trước 4) -> 'yth'.",
      "option_explanations": {
        "0": "\"Pyt\" tương ứng với lát cắt [0:3] (lấy từ chỉ số 0 đến 2), trong khi biểu thức bắt đầu từ chỉ số 1.",
        "1": "Chính xác! Lấy ký tự tại chỉ số 1, 2, 3 tương ứng với các chữ cái 'y', 't', 'h'.",
        "2": "\"thon\" tương ứng với lát cắt [2:] hoặc [2:6], không phải [1:4].",
        "3": "\"Python\" là toàn bộ chuỗi ban đầu, trong khi slicing [1:4] chỉ lấy chuỗi con 3 ký tự."
      }
    },
    {
      "id": 125,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Phương thức nào dùng để chuyển tất cả ký tự trong chuỗi thành chữ hoa?",
      "options": [
        "upper()",
        "capitalize()",
        "toUpper()",
        "uppercase()"
      ],
      "correct_answer": 0,
      "explanation": "Phương thức s.upper() trả về bản sao của chuỗi s với toàn bộ ký tự được chuyển thành chữ in hoa.",
      "option_explanations": {
        "0": "Chính xác! s.upper() biến đổi toàn bộ các chữ cái trong chuỗi thành chữ hoa.",
        "1": "s.capitalize() chỉ viết hoa chữ cái đầu tiên của chuỗi, các ký tự còn lại chuyển thành chữ thường.",
        "2": "'toUpper()' hoặc 'toUpperCase()' là cú pháp của JavaScript / Java, không có trong Python.",
        "3": "'uppercase' không phải là phương thức của kiểu dữ liệu chuỗi (str) trong Python."
      }
    },
    {
      "id": 126,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Cách nào sau đây là chuẩn xác nhất để khởi tạo một List rỗng trong Python?",
      "options": [
        "list = {}",
        "list = []",
        "list = ()",
        "list = \"\""
      ],
      "correct_answer": 1,
      "explanation": "Dấu ngoặc vuông [] (hoặc hàm list()) được dùng để khởi tạo danh sách (List) rỗng trong Python.",
      "option_explanations": {
        "0": "Dấu ngoặc nhọn {} dùng để tạo một Dictionary rỗng (hoặc Set nếu có phần tử), không phải List.",
        "1": "Chính xác! Cặp dấu ngoặc vuông [] khởi tạo một List rỗng.",
        "2": "Cặp dấu ngoặc đơn () dùng để tạo một Tuple rỗng.",
        "3": "Cặp dấu nháy kép \"\" tạo một chuỗi rỗng (str), không phải List."
      }
    },
    {
      "id": 127,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Phương thức nào dùng để thêm một phần tử mới vào cuối danh sách (List)?",
      "options": [
        "insert()",
        "append()",
        "add()",
        "push()"
      ],
      "correct_answer": 1,
      "explanation": "Phương thức list.append(x) thêm phần tử x vào vị trí cuối cùng của danh sách.",
      "option_explanations": {
        "0": "list.insert(index, x) dùng để chèn phần tử vào một vị trí chỉ số cụ thể, cần truyền 2 đối số.",
        "1": "Chính xác! list.append(x) thêm một phần tử vào vị trí cuối cùng của list.",
        "2": "Phương thức .add() dùng cho tập hợp (Set), List không có phương thức .add().",
        "3": "'push()' là phương thức trong JavaScript / C++, List trong Python dùng .append()."
      }
    },
    {
      "id": 128,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Khối lệnh nào được sử dụng để bắt và xử lý ngoại lệ (Exception) trong Python?",
      "options": [
        "if-else",
        "try-except",
        "for-in",
        "while-do"
      ],
      "correct_answer": 1,
      "explanation": "Python sử dụng cấu trúc try...except (kèm else, finally) để xử lý ngoại lệ khi chương trình gặp sự cố lúc runtime.",
      "option_explanations": {
        "0": "if-else là cấu trúc rẽ nhánh điều kiện logic, không có cơ chế bắt ngoại lệ (Exception handler).",
        "1": "Chính xác! Khối try-except bắt và xử lý các lỗi runtime như ZeroDivisionError, ValueError...",
        "2": "for-in là cấu trúc vòng lặp duyệt phần tử tuần tự.",
        "3": "while là vòng lặp theo điều kiện, không phải cơ chế xử lý lỗi."
      }
    },
    {
      "id": 129,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Phương thức nào dùng để nối các phần tử chuỗi trong một List thành một chuỗi duy nhất?",
      "options": [
        "concat()",
        "join()",
        "merge()",
        "combine()"
      ],
      "correct_answer": 1,
      "explanation": "Cú pháp 'ky_tu_noi'.join(danh_sach) nối các phần tử chuỗi trong danh sách bằng ký tự phân cách chỉ định.",
      "option_explanations": {
        "0": "'concat()' không phải phương thức của chuỗi trong Python (thường gặp trong SQL hoặc JS).",
        "1": "Chính xác! sep.join(iterable) là phương thức chuẩn để ghép danh sách chuỗi.",
        "2": "Python không có phương thức .merge() cho kiểu chuỗi.",
        "3": "'combine()' không phải là phương thức nối chuỗi trong Python."
      }
    },
    {
      "id": 130,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Lệnh print(\"Hello\" * 3) trong Python sẽ cho kết quả xuất ra là gì?",
      "options": [
        "HelloHelloHello",
        "Hello Hello Hello",
        "Hello * 3",
        "Báo lỗi cú pháp"
      ],
      "correct_answer": 0,
      "explanation": "Toán tử nhân (*) giữa chuỗi và số nguyên n sẽ lặp lại chuỗi đó n lần liên tiếp nhau không có khoảng trắng xen giữa.",
      "option_explanations": {
        "0": "Chính xác! Nhân chuỗi với số nguyên tạo chuỗi lặp lại liên tiếp nhau.",
        "1": "Phép nhân chuỗi không tự động chèn khoảng trắng giữa các lần lặp.",
        "2": "Biểu thức được tính toán trước khi in ra, không in nguyên văn phép toán.",
        "3": "Python hỗ trợ toán tử nhân chuỗi hợp lệ, không gây lỗi cú pháp."
      }
    },
    {
      "id": 131,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Giá trị trả về mặc định của một hàm trong Python khi không có lệnh return là gì?",
      "options": [
        "0",
        "None",
        "False",
        "Chuỗi rỗng \"\""
      ],
      "correct_answer": 1,
      "explanation": "Trong Python, mọi hàm nếu kết thúc mà không gặp câu lệnh return (hoặc return không có giá trị) đều mặc định trả về đối tượng None.",
      "option_explanations": {
        "0": "Python không ngầm định trả về số 0 như hàm main() trong C.",
        "1": "Chính xác! None đại diện cho sự vắng mặt của giá trị trả về trong Python.",
        "2": "Hàm không tự động ép kiểu về Boolean False khi không có return.",
        "3": "Python không tự động trả về chuỗi rỗng."
      }
    },
    {
      "id": 132,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Phương thức nào dùng để kiểm tra xem một chuỗi có hoàn toàn chỉ chứa các ký tự chữ số hay không?",
      "options": [
        "isdigit()",
        "isnumber()",
        "isdecimal_only()",
        "isint()"
      ],
      "correct_answer": 0,
      "explanation": "Phương thức s.isdigit() trả về True nếu tất cả các ký tự trong chuỗi s là chữ số (0-9) và chuỗi có độ dài tối thiểu 1 ký tự.",
      "option_explanations": {
        "0": "Chính xác! s.isdigit() kiểm tra chuỗi có hoàn toàn chứa chữ số hay không.",
        "1": "Python không có phương thức chuỗi tên là 'isnumber()'.",
        "2": "Tên phương thức này không tồn tại trong Python (phương thức chuẩn là .isdecimal()).",
        "3": "Python không có phương thức 'isint()' cho kiểu chuỗi."
      }
    },
    {
      "id": 133,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Câu lệnh nào tạo một vòng lặp for duyệt các số nguyên từ 0 đến 4?",
      "options": [
        "for i in 5:",
        "for i in range(5):",
        "for i in (0, 5):",
        "for i from 0 to 5:"
      ],
      "correct_answer": 1,
      "explanation": "Hàm range(5) sinh dãy số nguyên tuần tự 0, 1, 2, 3, 4 (bắt đầu từ 0 và kết thúc trước 5, gồm đúng 5 phần tử).",
      "option_explanations": {
        "0": "Số nguyên 5 không phải là đối tượng Iterable nên không thể duyệt trực tiếp bằng vòng lặp for (sẽ sinh lỗi TypeError).",
        "1": "Chính xác! range(5) sinh dãy 0, 1, 2, 3, 4.",
        "2": "Cú pháp này duyệt qua một Tuple gồm 2 phần tử là số 0 và số 5, chỉ lặp 2 lần.",
        "3": "'from ... to' không phải là cú pháp vòng lặp của Python (thường gặp trong Pascal hoặc Basic)."
      }
    },
    {
      "id": 134,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Hàm tích hợp (built-in) nào dùng để tính tổng tất cả các phần tử số trong một List?",
      "options": [
        "sum()",
        "total()",
        "add()",
        "calculate()"
      ],
      "correct_answer": 0,
      "explanation": "Hàm sum(iterable) là hàm tích hợp sẵn của Python, tính tổng các giá trị số trong danh sách hoặc cấu trúc lặp.",
      "option_explanations": {
        "0": "Chính xác! Hàm sum(list) trả về tổng của tất cả các phần tử trong list.",
        "1": "Python không có hàm tích hợp sẵn tên là 'total()'.",
        "2": "'add()' không phải hàm tính tổng danh sách trong Python.",
        "3": "Python không có hàm built-in tên là 'calculate()'."
      }
    },
    {
      "id": 135,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Tên loại ngoại lệ (Exception) phát sinh khi thực hiện phép chia một số cho số 0 trong Python là gì?",
      "options": [
        "ZeroDivisionError",
        "ValueError",
        "MathError",
        "ArithmeticOverflowError"
      ],
      "correct_answer": 0,
      "explanation": "Khi thực hiện phép chia cho 0 (toán tử /, //, hoặc %), Python sẽ ném ngoại lệ chuẩn 'ZeroDivisionError'.",
      "option_explanations": {
        "0": "Chính xác! ZeroDivisionError là lớp ngoại lệ tiêu chuẩn khi chia cho 0.",
        "1": "ValueError xảy ra khi hàm nhận tham số đúng kiểu nhưng giá trị không hợp lệ (ví dụ: int(\"abc\")).",
        "2": "Không tồn tại lớp ngoại lệ tên là 'MathError' trong thư viện chuẩn Python.",
        "3": "Lỗi chia cho 0 trong Python không ném ArithmeticOverflowError mà ném ZeroDivisionError."
      }
    },
    {
      "id": 136,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Phương thức nào dùng để đảo ngược thứ tự các phần tử của List ngay tại chỗ (in-place)?",
      "options": [
        "reverse()",
        "invert()",
        "flip()",
        "backward()"
      ],
      "correct_answer": 0,
      "explanation": "Phương thức list.reverse() đảo ngược thứ tự các phần tử của chính danh sách đó tại chỗ (thay đổi trực tiếp và trả về None).",
      "option_explanations": {
        "0": "Chính xác! list.reverse() đảo ngược thứ tự tại chỗ.",
        "1": "List không có phương thức 'invert()'.",
        "2": "'flip()' không phải phương thức của List trong Python.",
        "3": "Python không có phương thức 'backward()' cho kiểu List."
      }
    },
    {
      "id": 137,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Hàm nào dùng để ép kiểu chuyển đổi một chuỗi ký tự hợp lệ thành số nguyên trong Python?",
      "options": [
        "int()",
        "float()",
        "str()",
        "number()"
      ],
      "correct_answer": 0,
      "explanation": "Hàm int(x) ép kiểu giá trị x (ví dụ chuỗi \"123\") thành số nguyên tương ứng 123.",
      "option_explanations": {
        "0": "Chính xác! int(\"123\") chuyển chuỗi thành số nguyên 123.",
        "1": "float(\"123\") chuyển đổi thành số thực 123.0 chứ không phải số nguyên.",
        "2": "str() dùng để chuyển đổi các kiểu dữ liệu khác thành chuỗi ký tự.",
        "3": "Python không có hàm kiểu dữ liệu 'number()' (khác với TypeScript/JavaScript)."
      }
    },
    {
      "id": 138,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Biểu thức \"123\".isdigit() trong Python trả về kết quả là gì?",
      "options": [
        "True",
        "False",
        "\"123\"",
        "Ném ngoại lệ TypeError"
      ],
      "correct_answer": 0,
      "explanation": "Chuỗi \"123\" chỉ chứa toàn các ký tự chữ số từ '0' đến '9' nên phương thức .isdigit() trả về giá trị Boolean True.",
      "option_explanations": {
        "0": "Chính xác! Vì toàn bộ ký tự trong \"123\" đều là chữ số hợp lệ.",
        "1": "Phương thức chỉ trả về False nếu có ít nhất 1 ký tự không phải chữ số hoặc chuỗi rỗng.",
        "2": ".isdigit() là phương thức kiểm tra điều kiện logic, luôn trả về kiểu bool (True/False).",
        "3": "Đây là phương thức hợp lệ của kiểu chuỗi str, không gây ra lỗi."
      }
    },
    {
      "id": 139,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Hàm nào sau đây dùng để tìm giá trị lớn nhất trong một List các số nguyên?",
      "options": [
        "max()",
        "maximum()",
        "largest()",
        "biggest()"
      ],
      "correct_answer": 0,
      "explanation": "Hàm max(iterable) là hàm tích hợp sẵn của Python, trả về phần tử có giá trị lớn nhất trong tập hợp hoặc danh sách.",
      "option_explanations": {
        "0": "Chính xác! max(list) trả về phần tử lớn nhất.",
        "1": "Python không có hàm tích hợp tên là 'maximum()'.",
        "2": "Python không có hàm tên là 'largest()'.",
        "3": "Python không có hàm tên là 'biggest()'."
      }
    },
    {
      "id": 140,
      "subjectId": "python",
      "category": "python_advanced",
      "type": "single_choice",
      "type_name": "Trắc nghiệm ABCD",
      "question": "Phương thức nào dùng để sắp xếp các phần tử của List ngay tại chỗ theo thứ tự tăng dần?",
      "options": [
        "sort()",
        "order()",
        "arrange()",
        "align()"
      ],
      "correct_answer": 0,
      "explanation": "Phương thức list.sort() sắp xếp danh sách tại chỗ (in-place) theo thứ tự tăng dần. Khác với sorted(list) trả về danh sách mới.",
      "option_explanations": {
        "0": "Chính xác! list.sort() sắp xếp danh sách trực tiếp tại chỗ.",
        "1": "List trong Python không có phương thức 'order()'.",
        "2": "Python không có phương thức 'arrange()' cho kiểu danh sách.",
        "3": "'align()' không phải là phương thức sắp xếp trong Python."
      }
    }
  ],
  "practical_problems": [
    {
      "id": 1,
      "title": "Hàm tính tổng 2 số có kiểm tra đầu vào",
      "description": "Viết hàm tinh_tong(a, b) nhận vào hai số a và b. Trả về tổng của hai số.",
      "starter_code": "def tinh_tong(a, b):\n    # Viết code của em ở đây\n    pass\n\n# Chạy thử kiểm tra\nprint(tinh_tong(15, 25))",
      "solution_code": "def tinh_tong(a, b):\n    return a + b\n\nprint(tinh_tong(15, 25))",
      "test_cases": [
        {
          "input": "15, 25",
          "expected_output": "40"
        },
        {
          "input": "10.5, 4.5",
          "expected_output": "15.0"
        }
      ],
      "subjectId": "python"
    },
    {
      "id": 2,
      "title": "Hàm kiểm tra số chẵn hay số lẻ",
      "description": "Viết hàm kiem_tra_chan(n) nhận vào một số nguyên n. Trả về True nếu n là số chẵn, ngược lại trả về False.",
      "starter_code": "def kiem_tra_chan(n):\n    # Viết code của em ở đây\n    pass\n\nprint(kiem_tra_chan(8))\nprint(kiem_tra_chan(7))",
      "solution_code": "def kiem_tra_chan(n):\n    return n % 2 == 0\n\nprint(kiem_tra_chan(8))\nprint(kiem_tra_chan(7))",
      "test_cases": [
        {
          "input": "8",
          "expected_output": "True"
        },
        {
          "input": "7",
          "expected_output": "False"
        }
      ],
      "subjectId": "python"
    },
    {
      "id": 3,
      "title": "Hàm in bảng cửu chương của số n",
      "description": "Viết hàm in_bang_cuu_chuong(n) in ra 10 dòng bảng cửu chương của n từ 1 đến 10 theo mẫu: n x i = ket_qua.",
      "starter_code": "def in_bang_cuu_chuong(n):\n    # Viết code của em ở đây\n    pass\n\nin_bang_cuu_chuong(5)",
      "solution_code": "def in_bang_cuu_chuong(n):\n    for i in range(1, 11):\n        print(f'{n} x {i} = {n * i}')\n\nin_bang_cuu_chuong(5)",
      "test_cases": [
        {
          "input": "5",
          "expected_output": "5 x 1 = 5 ... 5 x 10 = 50"
        }
      ],
      "subjectId": "python"
    },
    {
      "id": 4,
      "title": "Hàm tính diện tích hình tròn với math.pi",
      "description": "Viết hàm tinh_dien_tich_tron(r) sử dụng hằng số math.pi và trả về diện tích hình tròn có bán kính r.",
      "starter_code": "import math\n\ndef tinh_dien_tich_tron(r):\n    # Viết code của em ở đây\n    pass\n\nprint(round(tinh_dien_tich_tron(5), 2))",
      "solution_code": "import math\n\ndef tinh_dien_tich_tron(r):\n    return math.pi * (r ** 2)\n\nprint(round(tinh_dien_tich_tron(5), 2))",
      "test_cases": [
        {
          "input": "5",
          "expected_output": "78.54"
        }
      ],
      "subjectId": "python"
    },
    {
      "id": 5,
      "title": "Hàm đảo ngược chuỗi ký tự bằng Slicing",
      "description": "Viết hàm dao_nguoc_chuoi(s) trả về chuỗi đảo ngược của s bằng kỹ thuật Slicing.",
      "starter_code": "def dao_nguoc_chuoi(s):\n    # Viết code của em ở đây\n    pass\n\nprint(dao_nguoc_chuoi('Python'))",
      "solution_code": "def dao_nguoc_chuoi(s):\n    return s[::-1]\n\nprint(dao_nguoc_chuoi('Python'))",
      "test_cases": [
        {
          "input": "'Python'",
          "expected_output": "nohtyP"
        }
      ],
      "subjectId": "python"
    },
    {
      "id": 6,
      "title": "Hàm tính giai thừa n! của số nguyên",
      "description": "Viết hàm tinh_giai_thua(n) tính n! = 1 * 2 * ... * n. Quy ước 0! = 1.",
      "starter_code": "def tinh_giai_thua(n):\n    # Viết code của em ở đây\n    pass\n\nprint(tinh_giai_thua(5))",
      "solution_code": "def tinh_giai_thua(n):\n    if n == 0 or n == 1:\n        return 1\n    gt = 1\n    for i in range(2, n + 1):\n        gt *= i\n    return gt\n\nprint(tinh_giai_thua(5))",
      "test_cases": [
        {
          "input": "5",
          "expected_output": "120"
        },
        {
          "input": "0",
          "expected_output": "1"
        }
      ],
      "subjectId": "python"
    },
    {
      "id": 7,
      "title": "Hàm kiểm tra số nguyên tố",
      "description": "Viết hàm kiem_tra_nguyen_to(n) trả về True nếu n là số nguyên tố, ngược lại trả về False.",
      "starter_code": "def kiem_tra_nguyen_to(n):\n    # Viết code của em ở đây\n    pass\n\nprint(kiem_tra_nguyen_to(17))\nprint(kiem_tra_nguyen_to(18))",
      "solution_code": "def kiem_tra_nguyen_to(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprint(kiem_tra_nguyen_to(17))\nprint(kiem_tra_nguyen_to(18))",
      "test_cases": [
        {
          "input": "17",
          "expected_output": "True"
        },
        {
          "input": "18",
          "expected_output": "False"
        }
      ],
      "subjectId": "python"
    },
    {
      "id": 8,
      "title": "Hàm tính chu vi và diện tích hình chữ nhật",
      "description": "Viết hàm tinh_hcn(dai, rong) trả về đồng thời 2 giá trị chu vi và diện tích (chu_vi, dien_tich).",
      "starter_code": "def tinh_hcn(dai, rong):\n    # Viết code của em ở đây\n    pass\n\ncv, dt = tinh_hcn(10, 5)\nprint(f'Chu vi: {cv}, Dien tich: {dt}')",
      "solution_code": "def tinh_hcn(dai, rong):\n    return (dai + rong) * 2, dai * rong\n\ncv, dt = tinh_hcn(10, 5)\nprint(f'Chu vi: {cv}, Dien tich: {dt}')",
      "test_cases": [
        {
          "input": "10, 5",
          "expected_output": "Chu vi: 30, Dien tich: 50"
        }
      ],
      "subjectId": "python"
    },
    {
      "id": 9,
      "title": "Hàm chuyển đổi độ C sang độ F",
      "description": "Viết hàm c_sang_f(c) áp dụng công thức F = (C * 9/5) + 32 và trả về nhiệt độ độ F.",
      "starter_code": "def c_sang_f(c):\n    # Viết code của em ở đây\n    pass\n\nprint(c_sang_f(37))",
      "solution_code": "def c_sang_f(c):\n    return (c * 9 / 5) + 32\n\nprint(c_sang_f(37))",
      "test_cases": [
        {
          "input": "37",
          "expected_output": "98.6"
        },
        {
          "input": "0",
          "expected_output": "32.0"
        }
      ],
      "subjectId": "python"
    },
    {
      "id": 10,
      "title": "Hàm in danh sách các số chẵn từ 1 đến 100",
      "description": "Viết hàm in_so_chan_1_den_100() sử dụng vòng lặp range(2, 101, 2) in tất cả số chẵn từ 1 đến 100 trên một hàng ngang cách nhau dấu cách.",
      "starter_code": "def in_so_chan_1_den_100():\n    # Viết code của em ở đây\n    pass\n\nin_so_chan_1_den_100()",
      "solution_code": "def in_so_chan_1_den_100():\n    for i in range(2, 101, 2):\n        print(i, end=' ')\n    print()\n\nin_so_chan_1_den_100()",
      "test_cases": [
        {
          "input": "",
          "expected_output": "2 4 6 8 ... 98 100"
        }
      ],
      "subjectId": "python"
    },
    {
      "id": 11,
      "description": "Sử dụng thư viện turtle, viết chương trình điều khiển chú rùa vẽ hình vuông cạnh 100 bước với 4 cạnh mang 4 màu: đỏ (red), xanh lá (green), xanh dương (blue) và vàng (yellow).",
      "solution_code": "import turtle\n\nbut_ve = turtle.Turtle()\nbut_ve.pensize(4)\nbut_ve.speed(3)\n\ncac_mau = ['red', 'green', 'blue', 'yellow']\nfor mau in cac_mau:\n    but_ve.color(mau)\n    but_ve.forward(100)\n    but_ve.right(90)\n\nturtle.done()",
      "starter_code": "import turtle\n\nbut_ve = turtle.Turtle()\nbut_ve.pensize(4)\nbut_ve.speed(3)\n\n# Viết vòng lặp vẽ 4 cạnh 4 màu ở đây\n\nturtle.done()",
      "subjectId": "python",
      "test_cases": [
        {
          "input": "",
          "expected_output": "Hình vuông 4 cạnh: red, green, blue, yellow"
        }
      ],
      "title": "Vẽ hình vuông 4 cạnh 4 màu rực rỡ (Turtle Graphics)"
    },
    {
      "id": 12,
      "description": "Viết chương trình Turtle vẽ hình chữ nhật có chiều dài 150 bước, chiều rộng 80 bước, nét vẽ dày pensize = 5 và màu tím (purple).",
      "solution_code": "import turtle\n\nbut_ve = turtle.Turtle()\nbut_ve.pensize(5)\nbut_ve.color('purple')\nbut_ve.speed(3)\n\nfor i in range(2):\n    but_ve.forward(150)\n    but_ve.right(90)\n    but_ve.forward(80)\n    but_ve.right(90)\n\nturtle.done()",
      "starter_code": "import turtle\n\nbut_ve = turtle.Turtle()\nbut_ve.pensize(5)\nbut_ve.color('purple')\nbut_ve.speed(3)\n\n# Viết vòng lặp vẽ hình chữ nhật ở đây\n\nturtle.done()",
      "subjectId": "python",
      "test_cases": [
        {
          "input": "",
          "expected_output": "Hình chữ nhật 150x80 nét 5 màu purple"
        }
      ],
      "title": "Vẽ hình chữ nhật nét đậm màu tím (Turtle Graphics)"
    },
    {
      "id": 13,
      "description": "Đổi màu nền màn hình đồ họa thành 'lightblue', vẽ hình tam giác đều cạnh 120 bước, nét vẽ dày 3, viền và phần ruột tô kín màu đỏ (red).",
      "solution_code": "import turtle\n\nman_hinh = turtle.Screen()\nman_hinh.bgcolor('lightblue')\n\nbut_ve = turtle.Turtle()\nbut_ve.pensize(3)\nbut_ve.color('red', 'red')\nbut_ve.speed(3)\n\nbut_ve.begin_fill()\nfor i in range(3):\n    but_ve.forward(120)\n    but_ve.left(120)\nbut_ve.end_fill()\n\nturtle.done()",
      "starter_code": "import turtle\n\nman_hinh = turtle.Screen()\nman_hinh.bgcolor('lightblue')\n\nbut_ve = turtle.Turtle()\nbut_ve.pensize(3)\nbut_ve.color('red', 'red')\n\n# Bắt đầu tô màu và vẽ tam giác 3 cạnh\nbut_ve.begin_fill()\n\nbut_ve.end_fill()\nturtle.done()",
      "subjectId": "python",
      "test_cases": [
        {
          "input": "",
          "expected_output": "Tam giác đều đỏ trên nền lightblue"
        }
      ],
      "title": "Vẽ tam giác đều & đổi màu nền Screen (Turtle Graphics)"
    },
    {
      "id": 14,
      "description": "Viết chương trình vẽ ngôi sao 5 cánh với độ dài cạnh 150 bước, góc xoay đặc trưng 144 độ, viền màu đỏ và tô màu ruột vàng óng (yellow).",
      "solution_code": "import turtle\n\nbut_ve = turtle.Turtle()\nbut_ve.pensize(3)\nbut_ve.speed(3)\nbut_ve.color('red', 'yellow')\n\nbut_ve.begin_fill()\nfor i in range(5):\n    but_ve.forward(150)\n    but_ve.right(144)\nbut_ve.end_fill()\n\nturtle.done()",
      "starter_code": "import turtle\n\nbut_ve = turtle.Turtle()\nbut_ve.pensize(3)\nbut_ve.speed(3)\nbut_ve.color('red', 'yellow')\n\n# Viết mã nguồn vẽ ngôi sao 5 cánh tại đây\n\nturtle.done()",
      "subjectId": "python",
      "test_cases": [
        {
          "input": "",
          "expected_output": "Ngôi sao 5 cánh viền đỏ ruột vàng"
        }
      ],
      "title": "Vẽ ngôi sao 5 cánh vàng viền đỏ (Turtle Graphics)"
    },
    {
      "id": 15,
      "description": "Sử dụng vòng lặp for i in range(1, 80) điều khiển rùa tăng dần độ dài bước đi (i * 3) và xoay góc 91 độ tạo hiệu ứng xoắn ốc đối xứng tuyệt đẹp.",
      "solution_code": "import turtle\n\nbut_ve = turtle.Turtle()\nbut_ve.pensize(2)\nbut_ve.speed(0)\nbut_ve.color('darkblue')\n\nfor i in range(1, 80):\n    but_ve.forward(i * 3)\n    but_ve.right(91)\n\nturtle.done()",
      "starter_code": "import turtle\n\nbut_ve = turtle.Turtle()\nbut_ve.pensize(2)\nbut_ve.speed(0)\nbut_ve.color('darkblue')\n\n# Viết vòng lặp vẽ xoắn ốc tại đây\n\nturtle.done()",
      "subjectId": "python",
      "test_cases": [
        {
          "input": "",
          "expected_output": "Họa tiết xoắn ốc nghệ thuật darkblue"
        }
      ],
      "title": "Vẽ họa tiết xoắn ốc nghệ thuật tăng dần bước đi (Turtle Graphics)"
    },
    {
      "id": 16,
      "subjectId": "python",
      "title": "Vẽ chuỗi hình vuông kích thước tăng dần cách đều (Turtle & List)",
      "description": "Xây dựng hàm ve_chuoi_hinh_vuong(danh_sach_canh, khoang_cach) nhận vào danh sách kích thước cạnh các hình vuông (VD: [40, 60, 80]) và khoảng cách dịch chuyển (VD: 20). Duyệt vòng lặp lồng nhau: vòng ngoài lấy từng cạnh, vòng trong vẽ hình vuông 4 cạnh. Vẽ xong nhấc bút tiến tới (cạnh + khoảng cách) rồi hạ bút chuẩn bị vẽ hình kế tiếp. In thông báo: 'Đang khởi chạy giao diện Turtle để vẽ chuỗi hình vuông...'",
      "difficulty": "medium",
      "category": "turtle_loop",
      "initial_code": "import turtle\n\ndef ve_chuoi_hinh_vuong(danh_sach_canh, khoang_cach):\n    \"\"\"\n    danh_sach_canh: List các số nguyên (VD: [40, 60, 80])\n    khoang_cach: Số nguyên khoảng cách giữa các hình (VD: 20)\n    \"\"\"\n    print(\"Đang khởi chạy giao diện Turtle để vẽ chuỗi hình vuông...\")\n    t = turtle.Turtle()\n    t.speed(3)\n    # Hãy hoàn thiện vòng lặp vẽ các hình vuông tại đây\n    for canh in danh_sach_canh:\n        for _ in range(4):\n            t.forward(canh)\n            t.right(90)\n        t.penup()\n        t.forward(canh + khoang_cach)\n        t.pendown()\n\nif __name__ == '__main__':\n    ve_chuoi_hinh_vuong([40, 60, 80], 20)\n",
      "test_cases": [
        {
          "input": "[40, 60, 80], 20",
          "expected_output": "Đang khởi chạy giao diện Turtle để vẽ chuỗi hình vuông...",
          "explanation": "Hàm in thông báo và vẽ 3 hình vuông cạnh 40, 60, 80 cách nhau 20 bước."
        }
      ]
    },
    {
      "id": 17,
      "subjectId": "python",
      "title": "Vẽ hoa văn đa sắc đối xứng từ Dictionary màu sắc (Turtle & Dict)",
      "description": "Xây dựng hàm ve_da_giac_mau_sac(tu_dien_mau, so_hinh_lap) nhận vào Dictionary ánh xạ màu sắc (có thể bị lỗi khoảng trắng ở hai đầu) -> bán kính (VD: {' red ': 50, ' blue ': 80, ' green ': 110}) và số lượng hình tròn lặp lại tại mỗi tâm. Sử dụng vòng lặp for key, value in tu_dien_mau.items(), áp dụng .strip() để làm sạch chuỗi màu trước khi đổi màu nét vẽ t.color(). Sau mỗi hình tròn xoay góc 360 / so_hinh_lap tạo hoa văn đối xứng.",
      "difficulty": "hard",
      "category": "turtle_dict",
      "initial_code": "import turtle\n\ndef ve_da_giac_mau_sac(tu_dien_mau, so_hinh_lap=4):\n    \"\"\"\n    tu_dien_mau: Dict tên màu -> bán kính (VD: {' red ': 50, ' blue ': 80})\n    so_hinh_lap: Số hình tròn xoay quanh tâm\n    \"\"\"\n    print(\"Đang mở giao diện Turtle để vẽ đa giác màu sắc...\")\n    t = turtle.Turtle()\n    t.speed(5)\n    goc_xoay = 360 / so_hinh_lap\n    for mau, ban_kinh in tu_dien_mau.items():\n        mau_sach = mau.strip()\n        try:\n            t.color(mau_sach)\n        except Exception:\n            t.color('blue')\n        for _ in range(so_hinh_lap):\n            t.circle(ban_kinh)\n            t.right(goc_xoay)\n\nif __name__ == '__main__':\n    ve_da_giac_mau_sac({' red ': 50, ' blue ': 80, ' green ': 110}, 4)\n",
      "test_cases": [
        {
          "input": "{' red ': 50, ' blue ': 80, ' green ': 110}, 4",
          "expected_output": "Đang mở giao diện Turtle để vẽ đa giác màu sắc...",
          "explanation": "Làm sạch màu bằng .strip() và vẽ các cụm hoa văn 4 cánh đối xứng."
        }
      ]
    },
    {
      "id": 18,
      "subjectId": "python",
      "title": "Quản lý và phân loại học lực học sinh (List, Dict & Phân loại)",
      "description": "Xây dựng hàm lap_danh_sach_lop(ds_hoc_sinh, bang_diem_nhap=None) nhận vào danh sách họ tên học sinh. Duyệt qua từng học sinh, lưu vào Dictionary với key là tên và value là điểm số. Phân loại học lực: nếu điểm >= 8.0 in 'Học sinh: [tên] - Điểm: [điểm] - Xếp loại: Giỏi', ngược lại in 'Học sinh: [tên] - Điểm: [điểm] - Xếp loại: Đạt'. Hàm trả về Dictionary kết quả.",
      "difficulty": "medium",
      "category": "dict_processing",
      "initial_code": "def lap_danh_sach_lop(ds_hoc_sinh, bang_diem_nhap=None):\n    \"\"\"\n    ds_hoc_sinh: List họ tên học sinh\n    bang_diem_nhap: Dict điểm số có sẵn (None nếu chạy thực tế)\n    Trả về: Dict {ho_ten: diem_so}\n    \"\"\"\n    bang_diem = bang_diem_nhap if bang_diem_nhap is not None else {}\n    for ten in ds_hoc_sinh:\n        diem = bang_diem.get(ten, 8.0)\n        xep_loai = 'Giỏi' if diem >= 8.0 else 'Đạt'\n        print(f'Học sinh: {ten} - Điểm: {diem} - Xếp loại: {xep_loai}')\n    return bang_diem\n\nif __name__ == '__main__':\n    hs = ['Nguyễn Tri Dũng', 'Trần Thu Hà', 'Lê Minh Khôi']\n    diem = {'Nguyễn Tri Dũng': 8.5, 'Trần Thu Hà': 7.2, 'Lê Minh Khôi': 9.0}\n    lap_danh_sach_lop(hs, diem)\n",
      "test_cases": [
        {
          "input": "['Nguyễn Tri Dũng', 'Trần Thu Hà', 'Lê Minh Khôi'], {'Nguyễn Tri Dũng': 8.5, 'Trần Thu Hà': 7.2, 'Lê Minh Khôi': 9.0}",
          "expected_output": "Học sinh: Nguyễn Tri Dũng - Điểm: 8.5 - Xếp loại: Giỏi\nHọc sinh: Trần Thu Hà - Điểm: 7.2 - Xếp loại: Đạt\nHọc sinh: Lê Minh Khôi - Điểm: 9.0 - Xếp loại: Giỏi",
          "explanation": "Phân loại đúng theo ngưỡng điểm >= 8.0 Giỏi, còn lại Đạt."
        }
      ]
    },
    {
      "id": 19,
      "subjectId": "python",
      "title": "Vẽ biểu đồ cột tăng trưởng phân cách đều (Turtle & List)",
      "description": "Xây dựng hàm ve_bieu_do_tang_truong(danh_sach_chieu_cao, mau_sac='orange') nhận vào danh sách chiều cao các cột (VD: [50, 120, 80, 150, 95]) và màu nét vẽ. In ra dòng chữ 'Đang vẽ biểu đồ cột tăng trưởng trên Turtle...'. Điều khiển rùa vẽ các cột hình chữ nhật đứng (rộng 25 bước, cao theo danh sách). Giữa các cột liền kề nhấc bút tiến tới 15 bước rồi hạ bút để tạo khoảng cách đều đặn.",
      "difficulty": "medium",
      "category": "turtle_chart",
      "initial_code": "import turtle\n\ndef ve_bieu_do_tang_truong(danh_sach_chieu_cao, mau_sac='orange'):\n    \"\"\"\n    danh_sach_chieu_cao: List số nguyên chiều cao các cột\n    mau_sac: Tên màu nét vẽ\n    \"\"\"\n    print('Đang vẽ biểu đồ cột tăng trưởng trên Turtle...')\n    t = turtle.Turtle()\n    t.speed(4)\n    try:\n        t.color(mau_sac)\n    except Exception:\n        t.color('orange')\n    do_rong = 25\n    khoang_cach = 15\n    for h in danh_sach_chieu_cao:\n        # Vẽ hình chữ nhật đứng\n        t.left(90)\n        t.forward(h)\n        t.right(90)\n        t.forward(do_rong)\n        t.right(90)\n        t.forward(h)\n        t.left(90)\n        # Khoảng trống giữa các cột\n        t.penup()\n        t.forward(khoang_cach)\n        t.pendown()\n\nif __name__ == '__main__':\n    ve_bieu_do_tang_truong([50, 120, 80, 150, 95], 'orange')\n",
      "test_cases": [
        {
          "input": "[50, 120, 80, 150, 95], 'orange'",
          "expected_output": "Đang vẽ biểu đồ cột tăng trưởng trên Turtle...",
          "explanation": "In thông báo và vẽ 5 cột biểu đồ có khoảng cách 15 bước."
        }
      ]
    },
    {
      "id": 20,
      "subjectId": "python",
      "title": "Bộ lọc an ninh và quản lý thành viên câu lạc bộ (String .isalnum() & Dict)",
      "description": "Xây dựng hàm bo_loc_dang_ky_clb(danh_sach_ma, thong_tin_nhap=None) nhận vào danh sách các mã đăng ký. Sử dụng .strip() xóa khoảng trắng thừa ở hai đầu. Dùng phương thức .isalnum() để kiểm tra: mã hợp lệ chỉ chứa chữ cái và số (không có khoảng trắng hay ký tự đặc biệt). Nếu không hợp lệ in 'Mã [mã] không hợp lệ, đã bị loại bỏ.'. Với mã hợp lệ, lưu vào Dictionary {ma: ho_ten} và in 'Đăng ký thành công: [ma] -> [ho_ten]'. Trả về Dictionary thành viên hợp lệ.",
      "difficulty": "medium",
      "category": "string_security",
      "initial_code": "def bo_loc_dang_ky_clb(danh_sach_ma, thong_tin_nhap=None):\n    \"\"\"\n    danh_sach_ma: List mã đăng ký\n    thong_tin_nhap: Dict {ma: ho_ten}\n    Trả về: Dict {ma_hop_le: ho_ten}\n    \"\"\"\n    thanh_vien = {}\n    thong_tin = thong_tin_nhap if thong_tin_nhap is not None else {}\n    for raw_ma in danh_sach_ma:\n        ma = raw_ma.strip()\n        if ma.isalnum():\n            ten = thong_tin.get(ma, f'Thành viên {ma}')\n            thanh_vien[ma] = ten\n            print(f'Đăng ký thành công: {ma} -> {ten}')\n        else:\n            print(f'Mã {ma} không hợp lệ, đã bị loại bỏ.')\n    return thanh_vien\n\nif __name__ == '__main__':\n    ma_test = ['THPT2026', 'KHTN 123', 'CHUYEN_ANH', 'TIN2K9']\n    ten_test = {'THPT2026': 'Nguyễn Hoàng Long', 'TIN2K9': 'Phan Mỹ Linh'}\n    bo_loc_dang_ky_clb(ma_test, ten_test)\n",
      "test_cases": [
        {
          "input": "['THPT2026', 'KHTN 123', 'CHUYEN_ANH', 'TIN2K9'], {'THPT2026': 'Nguyễn Hoàng Long', 'TIN2K9': 'Phan Mỹ Linh'}",
          "expected_output": "Đăng ký thành công: THPT2026 -> Nguyễn Hoàng Long\nMã KHTN 123 không hợp lệ, đã bị loại bỏ.\nMã CHUYEN_ANH không hợp lệ, đã bị loại bỏ.\nĐăng ký thành công: TIN2K9 -> Phan Mỹ Linh",
          "explanation": "Chỉ giữ lại mã thỏa mãn .isalnum(), loại bỏ mã chứa dấu cách hoặc gạch dưới."
        }
      ]
    },
    {
      "id": 21,
      "subjectId": "python",
      "title": "Vẽ hoa văn nghệ thuật xoay vòng từ đa giác đều (Turtle Nested Loops)",
      "description": "Xây dựng hàm ve_hoa_van_xoay(so_canh=4, chieu_dai=60, do_day=2, mau='purple') nhận vào số cạnh của đa giác cánh hoa (3: tam giác, 4: hình vuông, 5: ngũ giác), chiều dài cạnh, độ dày nét vẽ và màu sắc. In ra dòng chữ 'Đang khởi tạo thuật toán xoay đa giác để tạo hoa văn nghệ thuật...'. Vòng lặp ngoài chạy 6 lần (6 cánh hoa quanh tâm). Vòng lặp trong vẽ đa giác đều (tiến tới chieu_dai, xoay phải 360 / so_canh). Vẽ xong một đa giác, xoay phải 60 độ quanh tâm để vẽ cánh tiếp theo.",
      "difficulty": "hard",
      "category": "turtle_art",
      "initial_code": "import turtle\n\ndef ve_hoa_van_xoay(so_canh=4, chieu_dai=60, do_day=2, mau='purple'):\n    \"\"\"\n    so_canh: Số cạnh của đa giác đều (3, 4, 5...)\n    chieu_dai: Độ dài một cạnh\n    do_day: Độ dày nét vẽ (1 - 5)\n    mau: Màu sắc hoa văn\n    \"\"\"\n    print('Đang khởi tạo thuật toán xoay đa giác để tạo hoa văn nghệ thuật...')\n    t = turtle.Turtle()\n    t.speed(5)\n    t.pensize(do_day)\n    try:\n        t.color(mau)\n    except Exception:\n        t.color('purple')\n    goc_da_giac = 360 / so_canh\n    for _ in range(6):\n        for _ in range(so_canh):\n            t.forward(chieu_dai)\n            t.right(goc_da_giac)\n        t.right(60)\n\nif __name__ == '__main__':\n    ve_hoa_van_xoay(4, 60, 2, 'purple')\n",
      "test_cases": [
        {
          "input": "4, 60, 2, 'purple'",
          "expected_output": "Đang khởi tạo thuật toán xoay đa giác để tạo hoa văn nghệ thuật...",
          "explanation": "In thông báo và vẽ đóa hoa đối xứng 6 cánh hình vuông xoay quanh tâm."
        }
      ]
    }
  ],
  "total_questions": 140
};
