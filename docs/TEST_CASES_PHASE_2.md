# Tài liệu Test Case - Phase 2 & 3: Customer Flow & Real-time Monitoring

Tài liệu này định nghĩa các kịch bản kiểm thử cho luồng đặt món của khách hàng và khả năng điều phối thời gian thực của nhân viên.

---

## 1. Module: Giao diện Khách hàng (Customer Menu)

| ID | Chức năng | Kịch bản kiểm thử | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| CU_01 | Nhận diện bàn | Truy cập URL `/order/[table-id]`. | Hiển thị đúng tên bàn và khu vực trong Header. | ✅ Pass |
| CU_02 | Chế độ Sáng/Tối | Nhấn nút "Sáng/Tối" trên Header. | Giao diện chuyển đổi theme lập tức, icon và nhãn văn bản cập nhật đúng. | ✅ Pass |
| CU_03 | Thêm vào giỏ | Nhấn nút (+) trên card món ăn. | Món được thêm vào giỏ, hiển thị thanh "Giỏ hàng" phía dưới với tổng tiền. | ✅ Pass |
| CU_04 | Tăng/Giảm số lượng | Nhấn (+) hoặc (-) trong popup giỏ hàng. | Số lượng và tổng tiền cập nhật chính xác. | ✅ Pass |
| CU_05 | Ghi chú món | Nhấn vào món trong giỏ, nhập ghi chú (VD: "Ít đường"). | Ghi chú được lưu lại và hiển thị trong tóm tắt đơn hàng. | ✅ Pass |
| CU_06 | Gửi đơn hàng | Nhấn "Xác nhận đặt món" trong giỏ hàng. | Đơn hàng được gửi đi, hiển thị thông báo thành công, giỏ hàng trống. | ✅ Pass |

---

## 2. Module: Gọi nhân viên (Call Staff)

| ID | Chức năng | Kịch bản kiểm thử | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| CS_01 | Mở popup | Nhấn nút "Gọi NV" trong Header. | Popup "Gọi nhân viên" hiển thị với các tùy chọn nhanh. | ✅ Pass |
| CS_02 | Tùy chọn nhanh | Nhấn "Lấy khăn giấy". | Nội dung "Lấy khăn giấy" được tự động điền vào ô nhập liệu. | ✅ Pass |
| CS_03 | Gửi yêu cầu | Nhấn "Gửi yêu cầu" sau khi nhập nội dung. | Popup đóng ngay lập tức, Toast thông báo thành công xuất hiện ở trên cùng. | ✅ Pass |
| CS_04 | Tự động ẩn Toast | Chờ sau khi Toast xuất hiện. | Thông báo tự động biến mất sau 3 giây. | ✅ Pass |

---

## 3. Module: Quản trị thời gian thực (Admin Real-time)

| ID | Chức năng | Kịch bản kiểm thử | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| AR_01 | Nhận thông báo đơn mới | Admin đang ở trang `/admin/orders`, khách gửi đơn mới. | Đơn hàng mới xuất hiện tức thì ở đầu danh sách "Hóa đơn" mà không cần reload. | ✅ Pass |
| AR_02 | Nhận yêu cầu hỗ trợ | Khách gửi yêu cầu "Gọi nhân viên". | Khối "Yêu cầu hỗ trợ" xuất hiện ở trên cùng trang Admin với nội dung chính xác. | ✅ Pass |
| AR_03 | Xử lý yêu cầu | Admin nhấn "Đã xử lý" trên card yêu cầu hỗ trợ. | Card yêu cầu biến mất lập tức khỏi màn hình Admin. | ✅ Pass |
| AR_04 | Cập nhật trạng thái | Admin đổi trạng thái đơn hàng (VD: "Xong món"). | Trạng thái cập nhật Real-time trên màn hình Admin khác (nếu đang mở). | ✅ Pass |

---

## Ghi chú:
*   Mọi Test Case được thực hiện với Supabase Realtime enabled trên các bảng `orders`, `order_items`, và `staff_calls`.
*   Cập nhật lần cuối: **2026-02-04**.
*   Tổng số Test Cases: **14** | Pass: **14** | Fail: **0**.
