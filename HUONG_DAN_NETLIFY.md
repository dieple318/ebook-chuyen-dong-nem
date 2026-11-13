# E-book Chuyển động ném · bản thiết kế lại 2.0

Bộ mã React + Vite + CSS dành cho Netlify, có Netlify Functions và Netlify Blobs. Không có dữ liệu học sinh thực hay mật khẩu triển khai trong gói này.

## 1. Cách chạy trên Netlify

Khuyến nghị dùng kho Git PRIVATE để giữ mã nguồn. Học sinh và giáo viên chỉ nhận URL website sau triển khai, không nhận ZIP hoặc quyền truy cập kho mã.

1. Giải nén. Đưa toàn bộ nội dung thư mục ebook-netlify-v2 vào một kho Git riêng tư. Giữ các thư mục src, server, netlify, public và tệp netlify.toml ở gốc dự án.
2. Trên Netlify, tạo project bằng Import an existing project và kết nối kho đó.
3. Build command: `npm run build`. Publish directory: `dist`. Functions directory: `netlify/functions`. Các mục này đã có trong netlify.toml. Dùng Node 22.
4. Trong cấu hình Environment variables của Netlify, thêm hai biến áp dụng cho Functions (hoặc mọi scope):
   - ADMIN_PASSWORD: tự đặt mật khẩu riêng, ít nhất 16 kí tự.
   - SESSION_SECRET: chuỗi ngẫu nhiên riêng, ít nhất 32 kí tự. Có thể tạo trên máy bằng `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
5. Triển khai / redeploy sau khi thêm biến. Không viết hai giá trị này vào mã nguồn hoặc biến VITE_*. Không gửi chúng cho học sinh.
6. Mở URL website do Netlify cấp để học thử. Vào cùng tên miền với đường dẫn `/admin`, đăng nhập bằng ADMIN_PASSWORD để quản lý.

Không chỉ kéo thả thư mục dist bằng Netlify Drop: cách đó không triển khai đủ Functions và nơi lưu bài. Thư mục dist đi kèm là kết quả build tham khảo; để đủ chức năng, Netlify phải build từ toàn bộ dự án như hướng dẫn trên. Có thể dùng Netlify CLI để deploy toàn bộ project nếu quen CLI.

Netlify Blobs được Function sử dụng trong ngữ cảnh triển khai Netlify. Không cần đưa token Netlify xuống trình duyệt. Tên kho mặc định: ebook-projectile-v2; tùy chọn EBOOK_STORE_NAME cho phép tách một đợt thử mới. Đổi tên kho không chuyển dữ liệu cũ sang kho mới. Hạn mức và chi phí dịch vụ phụ thuộc tài khoản Netlify.

## 2. Thao tác của giáo viên

- Mỗi chủ đề có ba trạng thái: nhận bài trước giờ học, đóng nhận bài, mở trên lớp đồng thời đóng nhận bài.
- Điều khiển áp dụng cho TẤT CẢ lớp của chủ đề đó, chưa có lịch mở riêng từng lớp.
- Bài chính thức duy nhất theo cặp mã người học + mã lớp + chủ đề. Mở lại nhận bài không cho sửa hoặc nộp lại bài đã có. Bản này không có nút xóa dữ liệu hoặc mở lại từng học sinh.
- Xem bài, lọc theo lớp, xuất CSV; xem hướng dẫn riêng và in hai phiếu nhóm cùng một phiếu cá nhân cuối giờ.
- Xem riêng nội dung trên lớp không mở nội dung cho học sinh. Mật khẩu giáo viên chung là mô hình thử nghiệm, không phải hệ thống phân quyền nhiều giáo viên.
- Người học đang mở trang nhận cập nhật trạng thái trong khoảng 15 giây. Máy chủ từ chối bài nộp muộn ngay khi trạng thái đóng được ghi nhận.
- Khi mở nội dung trên lớp, học sinh có thể đọc và sao chép nội dung đã tải. Đóng lại không thu hồi được bản người học đã lưu.

## 3. Vị trí mô phỏng và thay link

`src/config.js` chứa SIMULATIONS. Chủ đề 2 đã có URL học sinh của mô phỏng ném xiên. Không dùng URL /admin để nhúng.

Mô phỏng xuất hiện sau phần quan sát video và nhận xét ban đầu, trước ghi nhận ngắn cuối hoạt động. Nút mở cửa sổ nhúng rộng; có liên kết mở tab riêng và nút trở về e-book. Đóng cửa sổ vẫn giữ iframe khi còn ở cùng chủ đề; đổi chủ đề hoặc tải lại có thể tải lại mô phỏng. Khả năng khôi phục phiên do website mô phỏng quyết định.

Chủ đề 1 và 3 hiện không hiển thị khối mô phỏng. Khi có link, thay null bằng {url:'LINK_HOC_SINH',title:'Tên mô phỏng'} và sửa tên nút trong src/Simulation.jsx cho phù hợp nếu dùng cho chủ đề mới. Không có thông báo dự án chưa hoàn thiện trên giao diện người học.

Mô phỏng tự lưu dữ liệu tại hệ thống riêng. E-book không nhận nhật ký, tự xác nhận hoàn thành, hay gộp dữ liệu mô phỏng vào CSV. Thống nhất mã người học và lớp ở hai nơi; giáo viên kiểm tra admin mô phỏng độc lập. Khóa e-book không khóa website mô phỏng, tab riêng hoặc phiên đang mở. Muốn hạn chế mô phỏng theo hạn, sử dụng điều khiển truy cập của chính mô phỏng.

## 4. Cấu trúc mã

- src/main.jsx, style.css: khung sách, bìa, mục lục và giao diện thích ứng màn hình.
- src/config.js: thông tin chủ đề, video và link mô phỏng.
- src/VideoPlayer.jsx: video thật, tốc độ chậm, di chuyển khung hình.
- src/LearnerLesson.jsx: tự học, nháp trên thiết bị, nộp chính thức.
- src/Simulation.jsx: cửa sổ iframe và hỗ trợ thao tác.
- src/Classroom.jsx: hiển thị nội dung được máy chủ cho phép tải, công thức KaTeX.
- src/Teacher.jsx: bảng quản lý, CSV, phiếu giấy, hướng dẫn riêng.
- server/classroom.js: kiến thức trên lớp và hướng dẫn giáo viên, KHÔNG import vào src.
- server/netlify-api.js: kiểm tra quyền, khóa thời điểm, lưu bài và chống nộp trùng bằng ghi có điều kiện.
- netlify/functions/api.mjs: kết nối Netlify Blobs.
- public/videos: video quay thật và ảnh trích video; xem NGUON_HOC_LIEU.md.

## 5. Chạy thử trên máy

Cài Node 22, chạy `npm ci`, `npm test`, `npm run build`.

Muốn xem giao diện cùng API thử: chép .env.example thành .env, tự điền mật khẩu và khóa rồi chạy `npm run dev`. API trong Vite dùng bộ nhớ tạm, mất dữ liệu khi khởi động lại, KHÔNG dùng thu dữ liệu nghiên cứu. `npm run preview` chỉ xem bản build tĩnh, không chạy API. Muốn kiểm thử môi trường Netlify đầy đủ, dùng Netlify Dev / deploy preview với biến môi trường riêng.

## 6. Kiểm tra trước khi giao lớp

1. Thử cả ba video, xem chậm và bước khung hình trên điện thoại thực.
2. Mở mô phỏng ném xiên trong iframe và tab riêng; thử một phiên bằng mã thử, kiểm tra dữ liệu tại admin mô phỏng.
3. Nộp bài thử, tải lại trang, kiểm tra khóa nộp lại và CSV ở /admin.
4. Khi đang đóng, thử gửi từ trang cũ: máy chủ phải từ chối.
5. Trước khi giáo viên mở, nội dung trên lớp phải bị từ chối; sau mở, nút trên lớp hoạt động.
6. In phiếu giấy và kiểm tra các công thức / thời điểm mở nội dung phù hợp kế hoạch thực tế.
7. Tách mã thử với mã học sinh. Xuất CSV lưu an toàn trước khi thay cấu hình hoặc sửa mã.

Giới hạn bản thử: tối đa 500 bài/chủ đề, lưu một đối tượng có ghi điều kiện để tuần tự hóa khóa / nộp. Chưa có tài khoản học sinh, mã chỉ là định danh và có thể bị người khác sử dụng nếu biết; cần mã khó đoán và quản lý riêng. Chưa có lịch hạn nộp tự động, nhiều đợt khảo sát hoặc đồng bộ offline tới máy chủ. Nháp chỉ trên thiết bị, không phải bài đã nộp. Không dùng cho khảo thí bảo mật cao.

Mã React gửi đến trình duyệt có thể được xem ở dạng đã build; không có giải pháp frontend bảo đảm tuyệt đối không sao chép bố cục. Kho Git riêng tư bảo vệ quyền sửa nguồn; nội dung trên lớp và hướng dẫn riêng được máy chủ bảo vệ trước khi cho phép truy cập.
