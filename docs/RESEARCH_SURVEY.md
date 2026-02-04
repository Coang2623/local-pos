# Tài liệu Khảo sát Ban đầu - Hệ thống Order Cafe Nội bộ (QR POS)

## 1. Tổng quan Thị trường & Xu hướng
Hiện nay, việc tự động hóa quy trình gọi món qua mã QR đang là xu hướng tất yếu cho các quán cafe/nhà hàng vì các lợi ích:
- **Tiết kiệm nhân sự:** Giảm bớt số lượng nhân viên chạy bàn để ghi order.
- **Tốc độ:** Khách hàng không cần chờ phục vụ, chủ động chọn món ngay tại bàn.
- **Tính chính xác:** Giảm thiểu sai lệch thông tin giữa khách, nhân viên và bộ phận pha chế.

## 2. Nghiên cứu các Giải pháp Hiện có
Qua khảo sát, có hai nhóm giải pháp chính trên thị trường:

### Nhóm 1: Các phần mềm POS thương mại (SaaS)
Các phần mềm nổi bật tại Việt Nam như: **KiotViet, Sapo, PosApp, DanTriSoft, CukCuk (MISA).**
- **Ưu điểm:** Đầy đủ tính năng, tính ổn định cao, hỗ trợ nhiều phương thức thanh toán ví điện tử.
- **Nhược điểm:** Phí bản quyền hàng tháng/năm, dữ liệu nằm trên server của nhà cung cấp, khó tùy biến sâu theo nhu cầu riêng biệt của cơ sở.

### Nhóm 2: Các dự án mã nguồn mở (Open Source)
- **DMOS (Digital Menu Ordering System):** Sử dụng React/Vite/Firebase. Mạnh về tính thời gian thực.
- **Open QR Menu:** Đơn giản, dễ cài đặt, tập trung vào việc hiển thị menu điện tử.
- **QR-Code-Ordering-System:** Cung cấp cả App cho chủ quán quản lý trạng thái bàn (Browse, Ordered, Served).

## 3. Đề xuất Hướng đi cho dự án
Dựa trên yêu cầu "riêng biệt" và "nội bộ", việc xây dựng một giải pháp tự chủ (Self-hosted) là hợp lý nhất:
- **Công nghệ:** Sử dụng Next.js (theo chuẩn DEVELOPMENT_FLOW) để đảm bảo tốc độ và SEO tốt (cho menu).
- **Backend:** Cần một database thời gian thực để cập nhật order lập tức (như Supabase hoặc MongoDB + WebSockets).
- **Phần cứng:** Chỉ cần 1 máy chủ mini tại quán hoặc deploy cloud cá nhân, kết hợp máy in nhiệt (thermal printer) để in bill.

## 4. Các rủi ro & Thách thức cần giải quyết
- **Tính ổn định của mạng:** Hệ thống chạy nội bộ cần đảm bảo Wi-Fi ổn định để tránh mất order.
- **Trải nghiệm khách hàng:** Giao diện trên điện thoại phải cực kỳ mượt mà, không yêu cầu cài đặt app.
- **Bảo mật:** Tránh việc khách hàng táy máy order khống hoặc xem doanh thu của quán.
