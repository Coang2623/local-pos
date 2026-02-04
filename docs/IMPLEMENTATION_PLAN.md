# Kế hoạch Triển khai (Implementation Plan) - Local Cafe POS

Tài liệu này chia nhỏ quá trình xây dựng thành các giai đoạn (Phases) để đảm bảo tiến độ và tính chính xác theo đúng triết lý "Incremental Delivery".

---

## 🏗 Phase 1: Nền tảng & Quản trị Danh mục (Core Foundation)
*Mục tiêu: Thiết lập cơ sở dữ liệu và giao diện quản lý cơ bản.*

1.  **Thiết kế Database (Supabase):**
    - `areas`: Lưu trữ khu vực (Tầng 1, Sân vườn...).
    - `tables`: Lưu trữ thông tin bàn, UUID, AreaID.
    - `categories`: Nhóm món ăn (Cafe, Trà, Bánh...).
    - `products`: Thông tin món, đơn giá, giá vốn.
2.  **Giao diện Admin Dashboard:**
    - Cấu hình Khu vực & Bàn (Thêm/Sửa/Xóa).
    - Quản lý thực đơn (Menu Management).
3.  **Tạo mã QR:** Tự động generate link QR cho từng bàn.

---

## 📱 Phase 2: Luồng khách hàng gọi món (Customer Flow)
*Mục tiêu: Giao diện web mượt mà cho khách quét mã.*

1.  **Dynamic Route:** `/[tableId]` - Tự động nhận diện bàn khi quét QR.
2.  **Digital Menu UI:** Thiết kế đẹp, tối ưu mobile, có hiệu ứng tương tác (Premium Aesthetic).
3.  **Cart System:** Quản lý giỏ hàng tạm thời trên thiết bị khách.
4.  **Confirm Order:** Gửi data về Supabase Realtime.

---

## 🖥 Phase 3: Điều phối & In ấn (Staff Dashboard & Monitoring)
*Mục tiêu: Nhân viên nhận được order tức thì.*

1.  **Màn hình Tổng quan Bàn (Table Map):** Hiển thị trạng thái bàn (Đang trống, Chờ món, Đang dùng).
2.  **Real-time Notifications:** Thông báo âm thanh/hình ảnh khi có món mới.
3.  **Kitchen Printing:** Tích hợp library `escpos` để tự động in phiếu chế biến qua mạng LAN/Wi-Fi ngay khi khách gửi order.

---

## 💰 Phase 4: Thanh toán & Chiết khấu (Billing Logic)
*Mục tiêu: Chốt hóa đơn và quản lý tài chính.*

1.  **Bill Detail UI:** Xem chi tiết các món khách đã dùng của từng bàn.
2.  **Discount Logic:** Thêm tính năng áp dụng mã giảm giá hoặc trừ tiền trực tiếp.
3.  **Checkout & Reset:** Chốt bill, lưu vào lịch sử giao dịch và trả trạng thái bàn về "Trống".

---

## 📈 Phase 5: Báo cáo & Tối ưu (Analytics & Polish)
*Mục tiêu: Hoàn thiện sản phẩm.*

1.  **Dashboard Báo cáo:** Vẽ biểu đồ doanh thu, tính lợi nhuận (Doanh thu - Giá vốn).
2.  **Export Data:** Xuất báo cáo ra file Excel/CSV.
3.  **Performance Polish:** Tối ưu tốc độ load, caching dữ liệu.

---

## 🚦 Trạng thái hiện tại: **Sẵn sàng bắt đầu Phase 1**
*Action tiếp theo:* Thiết lập cấu trúc thư mục Next.js và Schema Database ban đầu.
