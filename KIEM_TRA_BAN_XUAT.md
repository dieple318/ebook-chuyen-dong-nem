# Kiểm tra bản xuất 2.0

Ngày 13/11/2026.

- npm test: đạt kiểm tra quyền giáo viên, khóa nội dung, chống nộp trùng đồng thời, từ chối gửi sau đóng, tách chủ đề, xem riêng không mở công khai, câu hỏi tùy chọn, xác nhận không lộ câu trả lời, khóa bài sau mở lại.
- npm run build: thành công.
- 17 biểu thức vật lí kiểm tra bằng KaTeX chế độ strict, không lỗi.
- Kiểm tra trình duyệt bản dev: trang ném xiên, video tải metadata và bước khung hình; mô phỏng công khai tải vào iframe đến màn hình nhập mã; bài thử nộp được và tải lại vẫn xác nhận đã khóa. Không tạo phiên học sinh trong mô phỏng công khai để kiểm tra này.
- Kiểm tra bundle: không chứa lời giải / hướng dẫn giáo viên từ server/classroom.js.

Chưa triển khai vào tài khoản Netlify của tác giả; cần chạy checklist trong HUONG_DAN_NETLIFY.md trên tên miền Netlify sau khi cấu hình biến môi trường. Dữ liệu dev là bộ nhớ tạm, không phải dữ liệu nghiên cứu. Chưa kiểm tra một phiên mô phỏng từ đầu đến cuối hay đồng bộ dữ liệu của mô phỏng từ tên miền Netlify mới.
