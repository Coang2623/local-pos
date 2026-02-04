# Tài liệu Đặc tả Yêu cầu Sản phẩm (Official PRD v1.0) - Local Cafe POS

## 1. Mục tiêu sản phẩm
Xây dựng hệ thống quản lý order nội bộ giúp khách hàng chủ động gọi món qua QR code, tối ưu vận hành tại quầy và báo cáo tài chính minh bạch cho chủ quán.

## 2. Đối tượng sử dụng & Luồng nghiệp vụ
- **Khách hàng:** Quét mã QR tại bàn -> Xem Menu -> Chọn món -> Xác nhận Order.
- **Nhân viên (Pha chế/Phục vụ):** Nhận thông báo order mới -> Xem phiếu in tự động -> Làm món -> Phục vụ khách.
- **Quản lý (tại quầy):** Tablet/PC dùng chung. Kiểm tra trạng thái bàn, áp dụng chiết khấu, thu tiền và chốt bill.

## 3. Các Tính năng Chi tiết

### A. Quản lý Order & Bàn (Dynamic Setup)
- **Cấu hình Khu vực:** Quản trị viên có thể tạo nhiều vùng (Tầng 1, Tầng 2, Sân thượng...).
- **Cấu hình Bàn:** Tạo số lượng bàn tương ứng cho mỗi khu vực. Mỗi bàn có UUID riêng để tạo mã QR.
- **E-Menu thời gian thực:** Đồng bộ trạng thái món (còn/hết) ngay lập tức.

### B. Luồng Thanh toán & Chiết khấu (At Counter)
- **Thanh toán sau:** Khách dùng xong mới ra quầy thanh toán. Nhân viên kiểm tra bill trên máy tính bảng dùng chung.
- **Cơ chế Chiết khấu (Flexible Discount):**
    - Chiết khấu theo **Phần trăm (%)** hoặc **Giá trị tuyệt đối (VNĐ)**.
    - Áp dụng trên **từng món** cụ thể hoặc **tổng hóa đơn**.
- **Xác nhận thanh toán:** Sau khi thu tiền, bàn được chuyển về trạng thái Trống.

### C. In ấn & Thiết bị (Automatic POS)
- **In bếp tự động:** Ngay khi khách nhấn "Gửi Order", hệ thống tự động gửi lệnh in đến máy in nhiệt để pha chế bắt đầu làm món.
- **Hỗ trợ máy in nhiệt:** Kết nối qua Network (LAN/Wi-Fi) hoặc USB (ESC/POS protocol).

### D. Báo cáo & Tài chính (Phase 1)
- Thống kê doanh thu theo thời gian (Ngày/Tháng/Năm).
- Quản lý giá vốn (Base cost) cho từng món để tính toán **Lợi nhuận ròng**.

## 4. Tech Stack Đề xuất
- **Frontend/Backend:** Next.js 15+ (App Router).
- **Database/Realtime:** Supabase (PostgreSQL + Realtime).
- **UI:** Vanilla CSS (MacOS/Premium Aesthetic).
- **Printing Interface:** `escpos` (Node.js) cho Network Printing.

## 5. Danh sách Phase Phát triển
- **Phase 1:** Core Admin & Menu (Database schema, Admin UI quản lý món/bàn).
- **Phase 2:** Customer Ordering Flow (QR Scanner, Menu UI, Cart, Realtime Notification).
- **Phase 3:** Staff Dashboard & Printer Integration (Màn hình điều phối, In bill tự động).
- **Phase 4:** Billing & Finance Reports (Chiết khấu, Báo cáo doanh thu/lợi nhuận).
