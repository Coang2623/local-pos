# Project Architecture & Tech Stack

Tài liệu này mô tả cấu trúc kỹ thuật và cách các thành phần trong hệ thống Local Order System tương tác với nhau.

---

## 1. Tổng quan Hệ thống (System Overview)
Hệ thống được xây dựng theo mô hình **Client-Server-Realtime**:
- **Trình duyệt Khách (Mobile):** Giao diện quét mã QR và gửi món.
- **Máy tính bảng tại quầy (Tablet/PC):** Giao diện quản lý chung cho nhân viên.
- **Server (Next.js):** Xử lý logic nghiệp vụ và API in ấn.
- **Database (Supabase):** Lưu trữ dữ liệu và đẩy thông báo Real-time.

## 2. Layer Kiến trúc (Layers)

### 2.1. Frontend (Next.js App Router)
- **Customer Side:** `/table/[id]` - Các trang dành cho khách hàng.
- **Admin Side:** `/admin/*` - Các trang quản lý dành cho chủ quán.
- **Shared Components:** UI components dùng chung (Buttons, Modals, Menus).

### 2.2. Backend & Realtime
- **API Routes:** Xử lý các tác vụ như in bill, chốt doanh thu.
- **Supabase Listeners:** Các hook lắng nghe sự thay đổi của bảng `orders` để cập nhật UI ngay lập tức mà không cần reload trang.

### 2.3. Printer Integration
- Sử dụng thư viện `escpos` chạy trên Node.js server.
- Khi có order mới, server gửi gói tin ESC/POS qua cổng 9100 (Default Raw Print) đến IP của máy in trong mạng nội bộ.

---

## 3. Luồng dữ liệu chính (Data Flow)
1. **Khách quét QR** -> Browser lấy URL có TableID.
2. **Khách đặt món** -> `insert` vào bảng `orders` và `order_items` trong Supabase.
3. **Realtime Event** -> Màn hình quầy nhận được thông báo món mới.
4. **Auto Print** -> Server gọi API in phiếu chế biến gửi đến máy in bếp.
5. **Thanh toán** -> Nhân viên cập nhật trạng thái `is_paid = true` -> giải phóng bàn về `is_available = true`.
