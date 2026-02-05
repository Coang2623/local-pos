# Kế hoạch Triển khai (Implementation Plan) - Local Cafe POS

Tài liệu này chia nhỏ quá trình xây dựng thành các giai đoạn (Phases) để đảm bảo tiến độ và tính chính xác theo đúng triết lý "Incremental Delivery".

---

## 🏗 Phase 1: Nền tảng & Quản trị Danh mục (Core Foundation) ✅ HOÀN THÀNH
*Mục tiêu: Thiết lập cơ sở dữ liệu và giao diện quản lý cơ bản.*

### 1. Database Schema (Supabase Local)
| Bảng | Mô tả |
|------|-------|
| `areas` | Lưu trữ khu vực (Tầng 1, Sân vườn...) |
| `tables` | Thông tin bàn, UUID, FK → areas |
| `categories` | Nhóm món ăn (Cafe, Trà, Bánh...) |
| `products` | Thông tin món, đơn giá, giá vốn, FK → categories |
| `orders` | Đơn hàng, trạng thái, FK → tables |
| `order_items` | Chi tiết món trong đơn, FK → orders, products |
| `store_settings` | Thông tin quán (Tên, địa chỉ, SĐT, Wifi) |

### 2. Admin Dashboard - Các Module
- ✅ **Tổng quan (Dashboard):** Thống kê tổng quát.
- ✅ **Khu vực & Bàn:** CRUD khu vực, CRUD bàn, Sinh mã QR.
- ✅ **Thực đơn:** CRUD danh mục, CRUD sản phẩm, Tìm kiếm & Lọc, **Chống trùng tên**.
- ✅ **Hóa đơn:** Hiển thị đơn hàng theo trạng thái, cập nhật trạng thái.
- ✅ **Cài đặt:**
    - Chế độ Sáng/Tối (Dark Mode Toggle).
    - Màu chủ đạo (Accent Color Picker: Blue, Green, Orange, Red, Purple, Pink).
    - Thông tin quán (Lưu vào Database).
    - Trạng thái kết nối Database.

### 3. Mã QR
- ✅ **Generate QR:** Tự động tạo mã QR cho từng bàn với URL duy nhất.
- ✅ **Download QR:** Tải về file PNG với tên bàn + khu vực.
- ✅ **Bulk Export:** Xuất tất cả QR của một khu vực thành file ZIP.

### 4. Kỹ thuật & UX
- ✅ Thiết kế Apple-style (Glassmorphism, SF Card, Animations).
- ✅ Dark Mode hoàn chỉnh với CSS Variables.
- ✅ Hydration-safe components (Next.js 15 App Router).
- ✅ Fallback UI khi không có kết nối Database.

---

## 📱 Phase 2: Luồng khách hàng gọi món (Customer Flow) ✅ HOÀN THÀNH
*Mục tiêu: Giao diện web mượt mà cho khách quét mã.*

1.  ✅ **Dynamic Route:** `/order/[tableId]` - Tự động nhận diện bàn khi quét QR.
2.  ✅ **Digital Menu UI:** Thiết kế đẹp, tối ưu mobile, có hiệu ứng tương tác (Premium Aesthetic).
3.  ✅ **Cart System:** Quản lý giỏ hàng tạm thời trên thiết bị khách.
4.  ✅ **Confirm Order:** Gửi data về Supabase Realtime.

---

## 🖥 Phase 3: Điều phối & In ấn (Staff Dashboard & Monitoring) 🔄 ĐANG TRIỂN KHAI
*Mục tiêu: Nhân viên nhận được order tức thì.*

1.  🔄 **Màn hình Tổng quan Bàn (Table Map):** Hiển thị trạng thái bàn (Đang trống, Chờ món, Đang dùng).
2.  ✅ **Real-time Notifications:** Thông báo âm thanh/hình ảnh khi có món mới hoặc yêu cầu hỗ trợ.
3.  ✅ **Call Staff Feature:** Khách gọi nhân viên, admin nhận yêu cầu tức thì.
4.  🔄 **Kitchen Printing:** Tích hợp library `escpos` để tự động in phiếu chế biến qua mạng LAN/Wi-Fi ngay khi khách gửi order.

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

## 🚦 Trạng thái hiện tại: **✅ Phase 2 HOÀN THÀNH - Sắp tới Phase 3 & 4**
*Cập nhật lần cuối:* 2026-02-04
*Action tiếp theo:* Hoàn thiện bản đồ bàn (Table Map) và tích hợp in ấn.
