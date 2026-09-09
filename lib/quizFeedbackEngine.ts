// lib/quizFeedbackEngine.ts
// Engine phân tích lỗi sai sư phạm cho Hệ Thống Luyện Thi Tin Học Sao Việt
// Mục tiêu: Giúp học viên hiểu rõ BẢN CHẤT VÌ SAO SAI khi chọn một phương án cụ thể,
// thay vì chỉ đơn thuần thông báo đáp án đúng là gì.

import { Question } from "@/types";

// Ngân hàng giải thích lý do sai chi tiết cho từng phương án của các câu hỏi trắc nghiệm
const OPTION_WRONG_EXPLANATIONS: Record<number, Record<number, string>> = {
  // Câu 1: Khai báo hàm
  1: {
    0: "Từ khóa 'function' thuộc về cú pháp của JavaScript, PHP, C... Trong Python, từ khóa chuẩn để định nghĩa hàm bắt buộc phải là 'def' (viết tắt của define).",
    2: "'create' là lệnh thường thấy trong SQL (như CREATE TABLE) hoặc các ngôn ngữ kịch bản khác, không phải là từ khóa khai báo hàm trong Python.",
    3: "'func' là từ khóa khai báo hàm của ngôn ngữ Go (Golang) và Swift. Trình thông dịch Python không nhận diện từ khóa này và sẽ báo SyntaxError."
  },
  // Câu 2: s = 'Python'; print(s[0])
  2: {
    1: "Ký tự 'y' nằm ở chỉ số index 1. Trong Python, chỉ số đánh số bắt đầu từ 0 (Zero-based indexing), do đó s[0] lấy ký tự đầu tiên là 'P', còn s[1] mới là 'y'.",
    2: "'n' là ký tự cuối cùng của chuỗi (tương ứng với chỉ số âm s[-1] hoặc s[5]), không phải vị trí đầu tiên s[0].",
    3: "Đoạn lệnh hoàn toàn hợp lệ và không hề báo lỗi, vì chuỗi 'Python' có độ dài 6 ký tự nên chỉ số 0 luôn tồn tại."
  },
  // Câu 3: Ký tự cuối cùng của chuỗi
  3: {
    0: "Chỉ số s[1] lấy ký tự thứ hai trong chuỗi (do index bắt đầu từ 0), chứ không phải ký tự cuối cùng.",
    1: "'end' không phải là từ khóa chỉ số trong Python. Nếu chưa gán biến 'end', Python sẽ báo lỗi: NameError: name 'end' is not defined.",
    3: "Python không hỗ trợ từ khóa 'last' bên trong cặp ngoặc vuông [ ]. Để truy xuất ngược từ đuôi chuỗi về trước, Python quy ước dùng chỉ số âm s[-1]."
  },
  // Câu 4: Viết hoa chữ cái đầu từng từ
  4: {
    0: "Phương thức .upper() chuyển TOÀN BỘ các chữ cái trong chuỗi thành chữ hoa (ví dụ: 'tin hoc' -> 'TIN HOC'), không phải chỉ viết hoa chữ cái đầu của từng từ.",
    1: ".capitalize() chỉ viết hoa duy nhất chữ cái đầu tiên của CẢ CHUỖI và ép tất cả các chữ cái còn lại về chữ thường (ví dụ: 'tin hoc' -> 'Tin hoc'). Để viết hoa từng từ phải dùng .title().",
    3: "Phương thức .lower() chuyển tất cả các chữ cái thành chữ thường (ví dụ: 'PYTHON' -> 'python'), hoàn toàn trái ngược với yêu cầu đề bài."
  },
  // Câu 5: Cắt khoảng trắng 2 đầu
  5: {
    0: "Python không có phương thức chuỗi tích hợp tên là .clean(). Gọi s.clean() sẽ phát sinh lỗi AttributeError: 'str' object has no attribute 'clean'.",
    2: "Phương thức .trim() thuộc về JavaScript, Java hay PHP. Trong Python, phương thức tương đương chuẩn để loại bỏ khoảng trắng ở hai đầu là .strip().",
    3: "Python không có phương thức .cut() cho kiểu dữ liệu chuỗi str."
  },
  // Câu 6: len('Sao Viet')
  6: {
    0: "Nếu đếm được 7 là do em đã bỏ qua dấu cách ở giữa 2 từ. Hàm len() trong Python tính TẤT CẢ các ký tự, bao gồm cả khoảng trắng ' '. 'Sao' (3) + ' ' (1) + 'Viet' (4) = 8.",
    2: "Chuỗi 'Sao Viet' chỉ gồm đúng 3 chữ cái 'Sao', 1 dấu cách và 4 chữ cái 'Viet' (tổng cộng 8 ký tự), không phải 9.",
    3: "6 ký tự là không chính xác, vì chỉ riêng 7 chữ cái đã nhiều hơn 6."
  },
  // Câu 7: s.isdigit()
  7: {
    0: "Python không có phương thức .isnumber() cho kiểu chuỗi str. Gọi hàm này sẽ gây ra lỗi AttributeError.",
    2: "Trong thư viện chuẩn của Python không tồn tại hàm .isnumeric_only(). Các hàm kiểm tra số chuẩn là .isdigit(), .isnumeric(), .isdecimal().",
    3: "Python không định nghĩa phương thức .check_digit() cho chuỗi."
  },
  // Câu 8: diem = 8.666; print(f'{diem:.2f}')
  8: {
    0: "Định dạng :.2f quy định bắt buộc phải lấy đúng 2 chữ số sau dấu thập phân, do đó kết quả không thể chỉ có 1 chữ số là 8.6.",
    1: "Cú pháp f'{diem:.2f}' tự động áp dụng quy tắc làm tròn toán học (Round half to even). Do chữ số thứ 3 sau dấu phẩy là 6 (lớn hơn hoặc bằng 5), nên số 6 ở hàng phần trăm được làm tròn lên thành 7 (8.67), không bị cắt cụt thành 8.66.",
    3: "Định dạng :.2f đã yêu cầu làm tròn đến 2 chữ số thập phân, không giữ nguyên 3 chữ số 8.666."
  },
  // Câu 9: Cặp ngoặc List
  9: {
    0: "Cặp ngoặc tròn ( ) dùng để khai báo kiểu dữ liệu Tuple (bộ dữ liệu không thể thay đổi - Immutable), không phải List.",
    1: "Cặp ngoặc nhọn { } dùng để định nghĩa kiểu dữ liệu Dictionary (từ điển) hoặc Set (tập hợp), không phải List.",
    3: "Cặp ngoặc nhọn < > trong Python là các toán tử so sánh (nhỏ hơn, lớn hơn), hoàn toàn không dùng để đóng gói cấu trúc dữ liệu."
  },
  // Câu 10: Thêm phần tử vào List
  10: {
    0: ".add() là phương thức thêm phần tử của cấu trúc dữ liệu tập hợp Set. List trong Python không có phương thức .add().",
    2: "Python List không tồn tại phương thức nào tên là .insert_last().",
    3: "Phương thức .push() thuộc về mảng trong JavaScript hoặc cấu trúc Stack. Trong Python List, phương thức thêm một phần tử vào đuôi là .append()."
  },
  // Câu 11: a = [10, 20, 30]; print(a[-1])
  11: {
    0: "10 là phần tử đầu tiên của danh sách, tương ứng với chỉ số a[0], không phải a[-1].",
    1: "20 là phần tử ở vị trí giữa, tương ứng với chỉ số a[1] hoặc a[-2].",
    3: "Lệnh hoàn toàn hợp lệ vì Python cho phép lập chỉ mục âm (Negative Indexing) từ cuối danh sách về đầu, a[-1] trỏ thẳng tới 30."
  },
  // Câu 12: max(a)
  12: {
    1: "List trong Python không có phương thức nội tại a.maximum(). Hàm tìm giá trị lớn nhất là hàm built-in độc lập: max(a).",
    2: "Python không có từ khóa hoặc hàm tên là top(a).",
    3: "Python không có phương thức a.largest() trong thư viện chuẩn."
  },
  // Câu 13: a.sort()
  13: {
    0: "Python List không có phương thức a.order().",
    2: "Hàm sort(a) là cú pháp sai (Syntax/NameError). Python có phương thức a.sort() (sắp xếp tại chỗ) hoặc hàm độc lập sorted(a) (trả về danh sách mới), chứ không có hàm sort(a).",
    3: "Python List không có phương thức a.arrange()."
  },
  // Câu 14: Dictionary Key - Value
  14: {
    0: "Dictionary có thể lưu trữ mọi kiểu dữ liệu (chuỗi, số, danh sách, đối tượng...), không hề bị giới hạn chỉ chứa số.",
    2: "Mảng 2 chiều cố định là cấu trúc của mảng tĩnh trong C/C++ hoặc thư viện NumPy (ndarray), không phải Dictionary.",
    3: "Hàng đợi FIFO (First In First Out) là cấu trúc hàng đợi (Queue), không phải cấu trúc từ điển ánh xạ của Python."
  },
  // Câu 15: d.items()
  15: {
    0: "Dictionary trong Python không có phương thức .pairs().",
    2: "Không có phương thức .all() trên Dictionary. Muốn lấy khóa dùng .keys(), lấy giá trị dùng .values(), lấy cả hai dùng .items().",
    3: "Python Dictionary không có phương thức .elements()."
  },
  // Câu 16: return
  16: {
    0: "Python không có từ khóa 'stop'.",
    1: "'exit' là hàm dùng để dừng toàn bộ chương trình Python (sys.exit), không phải lệnh kết thúc một hàm cục bộ.",
    3: "'break' chỉ dùng để ngắt vòng lặp (for / while), không dùng để trả về giá trị từ một hàm."
  },
  // Câu 17: default return None
  17: {
    0: "Số 0 là một giá trị số cụ thể. Hàm không có lệnh return sẽ không tự sinh ra số 0.",
    1: "False là một giá trị luận lý (Boolean). Python không mặc định coi hàm không return là False.",
    3: "Chuỗi rỗng '' là một kiểu chuỗi. Trong Python, giá trị rỗng đại diện cho 'không có gì' là đối tượng đặc biệt 'None'."
  },
  // Câu 18: import math
  18: {
    0: "'include' là cú pháp nạp thư viện trong C/C++ (#include), Python không hỗ trợ từ khóa này.",
    2: "'using' là từ khóa nạp namespace trong C# (using System;), Python dùng 'import'.",
    3: "'require' là cú pháp nạp module trong Node.js / JavaScript / Ruby, không phải Python."
  },
  // Câu 19: random.randint(a, b)
  19: {
    0: "Thư viện random không có hàm random.rand(a, b). Để sinh số nguyên ngẫu nhiên từ a đến b ta phải dùng random.randint(a, b).",
    2: "random.choice(seq) nhận vào một danh sách/chuỗi để chọn ngẫu nhiên 1 phần tử, không nhận 2 số nguyên (a, b) làm cận.",
    3: "random không có hàm nào tên là random.integer(a, b)."
  },
  // Câu 20: random.choice(list)
  20: {
    0: "random.randint() yêu cầu 2 tham số là 2 số nguyên cận dưới và cận trên (a, b), không nhận tham số là một danh sách List.",
    1: "Thư viện random của Python không có hàm random.pick().",
    3: "Thư viện random không có hàm random.select(). Hàm chuẩn để bốc ngẫu nhiên 1 phần tử từ List là random.choice()."
  },
  // Câu 21: math.pi
  21: {
    0: "math.pi là một biến hằng số (thuộc tính dữ liệu float), không phải là một hàm nên không gọi bằng dấu ngoặc math.PI().",
    2: "Tên thuộc tính trong thư viện math được đặt theo quy ước viết thường là 'math.pi', không phải 'math.PI_VALUE'.",
    3: "Thư viện math không dùng hàm getter math.get_pi(), mà bạn truy cập trực tiếp biến hằng số math.pi."
  },
  // Câu 22: math.sqrt(25)
  22: {
    0: "Dù 25 là số chính phương nhưng hàm math.sqrt() trong Python theo chuẩn thiết kế IEEE 754 luôn luôn trả về kiểu số thực (float) là 5.0, không phải số nguyên int 5.",
    2: "math.sqrt() tính toán số học, không bao giờ trả về chuỗi ký tự '5'.",
    3: "Căn bậc hai của 25 là số thực dương, không phát sinh phần ảo số phức (5j)."
  },
  // Câu 23: math.factorial(5)
  23: {
    0: "Thư viện math không có hàm viết tắt .fact(5). Tên đầy đủ của hàm giai thừa là math.factorial(n).",
    2: "math.pow(x, y) là hàm tính lũy thừa x^y, không phải hàm tính giai thừa.",
    3: "Thư viện chuẩn Python dùng tiếng Anh quốc tế (math.factorial), không có hàm tên tiếng Việt math.giai_thua()."
  },
  // Câu 24: datetime.datetime.now()
  24: {
    0: "'datetime' vừa là tên module, vừa là tên class bên trong module đó. Nếu chỉ viết datetime.now() mà không import class datetime trước thì sẽ báo lỗi AttributeError.",
    2: "Class datetime không có phương thức tên là .get_current_time().",
    3: "Module 'time' có hàm time.time() hoặc time.ctime(), không có time.current(). Để lấy ngày giờ trực quan chuẩn đối tượng ta dùng datetime.datetime.now()."
  },
  // Câu 25: Turtle forward(100)
  25: {
    0: "Thư viện Turtle không có lệnh but_ve.move(100). Lệnh chuẩn để tiến thẳng là .forward() hoặc .fd().",
    2: "Turtle không hỗ trợ lệnh but_ve.go(100).",
    3: "Turtle không có phương thức but_ve.step(100)."
  },
  // Câu 26: Turtle right(90)
  26: {
    0: "Trong Turtle không có lệnh dài but_ve.turn_right(90). Tên lệnh chuẩn ngắn gọn là but_ve.right() hoặc but_ve.rt().",
    2: "Turtle không có lệnh but_ve.rotate_right(90).",
    3: "Turtle viết tắt rẽ phải là but_ve.rt(90), không phải but_ve.r(90)."
  },
  // Câu 27: Turtle penup()
  27: {
    0: "Turtle không có lệnh but_ve.penoff(). Lệnh nhấc bút lên là but_ve.penup() (hoặc but_ve.up()).",
    2: "Turtle không có lệnh but_ve.lift().",
    3: "but_ve.hide_pen() không tồn tại; lệnh ẩn hình dáng chú rùa là but_ve.hideturtle(), chứ không phải nhấc bút."
  },
  // Câu 28: pensize & width
  28: {
    0: "Lệnh but_ve.width(4) đúng, nhưng but_ve.pensize(4) cũng hoàn toàn đúng (chúng là bí danh - alias của nhau), nên chọn riêng A là chưa đủ!",
    1: "Lệnh but_ve.pensize(4) đúng, nhưng but_ve.width(4) cũng được Turtle hỗ trợ song song, nên chọn riêng B là chưa bao quát đáp án đúng nhất!",
    2: "Turtle không có thuộc tính but_ve.thickness(4)."
  },
  // Câu 29: turtle.done()
  29: {
    0: "Turtle không có hàm turtle.stay().",
    1: "Turtle không có hàm turtle.keep().",
    3: "turtle.stop() không tồn tại. Để giữ màn hình không tự động tắt sau khi vẽ xong, ta gọi turtle.done() hoặc turtle.mainloop()."
  },
  // Câu 30: screen.bgcolor('green')
  30: {
    1: "Lệnh đổi màu nền gắn với đối tượng màn hình (Screen) chứ không gọi trực tiếp từ module turtle.background().",
    2: "screen.color() không tồn tại, color() là lệnh của ngòi bút vẽ con rùa, không phải của màn hình.",
    3: "Không có hàm turtle.set_screen() trong Turtle."
  },
  // Câu 31: '10' + '20'
  31: {
    0: "30 là kết quả của phép cộng 2 số nguyên (10 + 20). Tuy nhiên ở đây '10' và '20' được đặt trong nháy đơn nên là KIỂU CHUỖI. Toán tử '+' giữa 2 chuỗi là phép NỐI CHUỖI, cho ra '1020'.",
    2: "Đoạn lệnh hoàn toàn hợp lệ, Python hỗ trợ toán tử nối chuỗi rất tự nhiên và không hề báo lỗi.",
    3: "Phép nối chuỗi '+' trong Python ghép dính liền các ký tự lại với nhau, không tự động chèn thêm khoảng trắng ở giữa."
  },
  // Câu 32: int('123')
  32: {
    0: "str(123) là chuyển số nguyên 123 thành chuỗi '123', hoàn toàn ngược với yêu cầu chuyển từ chuỗi sang số nguyên.",
    2: "float('123') sẽ chuyển thành số thực 123.0, không phải số nguyên 123.",
    3: "Python không có hàm built-in nào tên là number(). Hàm ép kiểu số nguyên là int()."
  },
  // Câu 33: 17 % 5
  33: {
    0: "3 là thương số nguyên của phép chia (tương ứng với toán tử chia lấy phần nguyên 17 // 5). Toán tử '%' là phép chia lấy PHẦN DƯ, 17 chia 5 được 3 dư 2.",
    2: "3.4 là kết quả của phép chia số thực thông thường (17 / 5), không phải phép chia lấy dư '%'.",
    3: "17 = 5 * 3 + 2, phần dư là 2 chứ không phải 1."
  },
  // Câu 34: range(1, 5)
  34: {
    0: "Hàm range(start, stop) trong Python quy ước chạy từ start đến stop - 1 (không bao gồm cận trên stop). Do đó range(1, 5) chỉ dừng ở 4, không bao gồm số 5.",
    2: "Dãy 0, 1, 2, 3, 4 là kết quả của range(5) hoặc range(0, 5). Đề bài bắt đầu từ start = 1 nên không chứa số 0.",
    3: "Bắt đầu từ 1 và kết thúc trước 5, dãy này không thể chứa cả số 0 lẫn số 5."
  },
  // Câu 35: break
  35: {
    0: "'continue' không thoát khỏi vòng lặp mà chỉ bỏ qua phần còn lại của lượt lặp hiện tại và nhảy ngay sang lượt lặp tiếp theo.",
    1: "'exit' là hàm dừng toàn bộ chương trình Python, không phải từ khóa ngắt vòng lặp cục bộ.",
    3: "'return' thoát khỏi cả hàm cha, chỉ dùng trong hàm và không phải là từ khóa chuyên dụng để ngắt cấu trúc lặp for/while."
  },
  // Câu 36: s[::-1]
  36: {
    0: "Lấy ký tự đầu tiên của chuỗi là s[0].",
    1: "Lấy ký tự cuối cùng của chuỗi là s[-1].",
    3: "Để xóa chuỗi hoặc biến ta dùng lệnh 'del s' hoặc gán s = '', cú pháp cắt lát slicing s[::-1] với bước nhảy âm -1 sẽ đảo ngược thứ tự các ký tự của chuỗi."
  },
  // Câu 37: s.isalnum()
  37: {
    0: "s.isalpha() chỉ kiểm tra chuỗi có TOÀN BỘ là chữ cái hay không, nếu có số thì .isalpha() sẽ trả về False.",
    1: "s.isdigit() chỉ kiểm tra chuỗi có TOÀN BỘ là chữ số hay không, nếu có chữ cái thì .isdigit() sẽ trả về False.",
    3: "s.isspace() kiểm tra chuỗi có toàn bộ là khoảng trắng (space, tab, enter) hay không."
  },
  // Câu 38: begin_fill() & end_fill()
  38: {
    1: "Turtle không có cặp lệnh start_color() và stop_color().",
    2: "Turtle không có lệnh fill_on() và fill_off(). Cặp lệnh chuẩn là begin_fill() và end_fill().",
    3: "Turtle không có lệnh paint_begin() và paint_end()."
  },
  // Câu 39: Góc ngoài ngũ giác đều
  39: {
    0: "180 độ là tổng các góc trong của một hình tam giác, không phải tổng góc ngoài của hình ngũ giác.",
    2: "540 độ là tổng các GÓC TRONG của hình ngũ giác đều ((5 - 2) * 180 = 540 độ). Tổng các GÓC NGOÀI của mọi đa giác khép kín luôn luôn bằng 360 độ.",
    3: "720 độ là tổng các góc trong của hình lục giác."
  },
  // Câu 40: a.append([4, 5])
  40: {
    0: "Nếu ra 5 là do em nhầm phương thức .append() với .extend(). Phương thức a.append([4, 5]) thêm NGUYÊN DANH SÁCH CON [4, 5] như 1 phần tử duy nhất tại đuôi, nên a trở thành [1, 2, 3, [4, 5]], độ dài len(a) là 4 chứ không phải 5!",
    2: "Danh sách ban đầu có 3 phần tử [1, 2, 3], sau khi append thêm 1 phần tử con thì số lượng tăng lên 4, không thể giữ nguyên là 3.",
    3: "Lệnh hoàn toàn hợp lệ trong Python (danh sách lồng nhau - Nested List), không có lỗi cú pháp."
  }
};

/**
 * Tạo lời giải thích sư phạm giải nghĩa TẠI SAO PHƯƠNG ÁN HỌC VIÊN CHỌN LÀ SAI
 */
export function getWhyWrongExplanation(question: Question, selectedIndex: number | string): string {
  const sel = Number(selectedIndex);

  // 1. Kiểm tra trong DB tùy biến của câu hỏi (nếu có)
  if (question.option_explanations && question.option_explanations[sel]) {
    return question.option_explanations[sel];
  }

  // 2. Kiểm tra trong kho giải thích chuyên sâu 40 câu trắc nghiệm
  if (OPTION_WRONG_EXPLANATIONS[question.id] && OPTION_WRONG_EXPLANATIONS[question.id][sel]) {
    return OPTION_WRONG_EXPLANATIONS[question.id][sel];
  }

  // 3. Xử lý đặc thù dạng True / False (Đúng / Sai)
  if (question.type === "true_false") {
    const isUserChoseTrue = sel === 0;
    const isCorrectAnswerTrue = Number(question.correct_answer) === 0;

    if (isUserChoseTrue && !isCorrectAnswerTrue) {
      // Học viên chọn Đúng, nhưng thực tế mệnh đề là Sai!
      let cleaned = question.explanation.replace(/^Sai\.\s*/i, "").trim();
      return `Mệnh đề này KHÔNG CHÍNH XÁC trong Python! Thực tế: ${cleaned}. Vì mệnh đề này sai lệch so với kiến thức chuẩn của Python, nên việc chọn 'Đúng (True)' là chưa đúng.`;
    }

    if (!isUserChoseTrue && isCorrectAnswerTrue) {
      // Học viên chọn Sai, nhưng thực tế mệnh đề là Đúng!
      let cleaned = question.explanation.replace(/^Đúng\.\s*/i, "").trim();
      return `Mệnh đề này là một QUY TẮC HOÀN TOÀN ĐÚNG trong Python! Lý do: ${cleaned}. Do đó, mệnh đề này không thể là 'Sai (False)'.`;
    }
  }

  // 4. Xử lý Single Choice thông thường: phân tích dựa trên tên lựa chọn và nội dung câu hỏi
  if (question.options && question.options[sel]) {
    const chosenOptText = question.options[sel];
    let cleanedExp = question.explanation.trim();
    // Bỏ qua các tiền tố như "Từ khóa...", "Phương thức..."
    return `Lựa chọn '${chosenOptText}' không thỏa mãn yêu cầu của câu hỏi. Kiến thức cần ghi nhớ: ${cleanedExp}`;
  }

  // 5. Fallback chung cho mọi dạng câu hỏi
  return `Lựa chọn của em chưa chính xác. Hãy xem xét kỹ các quy tắc cú pháp và cấu trúc dữ liệu của Python trong câu hỏi này.`;
}
