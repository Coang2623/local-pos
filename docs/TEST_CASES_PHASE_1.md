# Tài liệu Test Case - Phase 1: Admin Dashboard

Tài liệu này định nghĩa danh sách các kịch bản kiểm thử (Test Cases) để đảm bảo chất lượng và độ ổn định của hệ thống quản trị Local Cafe POS.

---

## 1. Module: Quản lý Khu vực (Areas)

| ID | Chức năng | Kịch bản kiểm thử | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| AR_01 | Hiển thị danh sách | Truy cập `/admin/areas` khi không có dữ liệu. | Hiển thị card "Thêm khu vực mới" với viền đứt. | ✅ Pass |
| AR_02 | Thêm khu vực | Nhấn "Tạo khu vực", nhập "Tầng 1" và lưu. | Modal đóng, card "Tầng 1" xuất hiện với hiệu ứng fadeUp. | ✅ Pass |
| AR_03 | Kiểm tra lỗi bộ trống | Nhấn "Lưu" khi chưa nhập tên khu vực. | Không thực hiện lưu (hàm handleAddArea chặn input trống). | ✅ Pass |
| AR_04 | Xóa khu vực | Nhấn icon thùng rác trên card khu vực. | Hiển thị thông báo xác nhận. Sau khi xác nhận, card biến mất. | ✅ Pass |
| AR_05 | Điều hướng chi tiết | Nhấn "Chi tiết bàn" trên card khu vực. | Chuyển hướng thành công sang `/admin/areas/[id]`. | ✅ Pass |

---

## 2. Module: Quản lý Bàn (Tables)

| ID | Chức năng | Kịch bản kiểm thử | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| TB_01 | Hiển thị danh sách | Truy cập chi tiết một khu vực mới tạo. | Hiển thị thông tin tên khu vực và nút "Thêm bàn". | ✅ Pass |
| TB_02 | Thêm bàn mới | Nhấn "Thêm bàn", nhập "Bàn 01" và lưu. | Card bàn xuất hiện với trạng thái "Đang trống" (màu xanh). | ✅ Pass |
| TB_03 | Xóa bàn | Nhấn icon thùng rác trên card bàn. | Bàn được xóa khỏi danh sách sau khi xác nhận. | ✅ Pass |
| TB_04 | Quay lại | Nhấn "Quay lại Khu vực". | Chuyển hướng về trang danh sách khu vực tổng thể. | ✅ Pass |

---

## 3. Module: Mã QR (QR Code)

| ID | Chức năng | Kịch bản kiểm thử | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| QR_01 | Hiển thị QR | Nhấn "Xem QR" trên card bàn. | Modal hiển thị mã QR với tên bàn bên dưới. | ✅ Pass |
| QR_02 | Tải QR đơn lẻ | Nhấn "Tải về" trong modal QR. | File PNG được tải với tên `QR_Code_[Tên bàn].png`. | ✅ Pass |
| QR_03 | Nội dung QR | Kiểm tra text hiển thị trên ảnh QR. | Hiển thị "[Tên bàn] - [Tên khu vực]". | ✅ Pass |
| QR_04 | Xuất hàng loạt | Nhấn "Xuất QR" trên card khu vực. | Tải về file ZIP chứa tất cả QR của khu vực đó. | ✅ Pass |
| QR_05 | Tên file Unicode | Tạo bàn có tên tiếng Việt (VD: "Bàn Sân Vườn"). | File tải về có tên chính xác, không bị lỗi ký tự. | ✅ Pass |

---

## 4. Module: Thực đơn (Menu)

| ID | Chức năng | Kịch bản kiểm thử | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| MN_01 | Thêm danh mục | Nhấn "Thêm danh mục", nhập "Cà phê" và lưu. | Tab "Cà phê" xuất hiện trên thanh lọc (Filter bar). | ✅ Pass |
| MN_02 | Thêm sản phẩm | Nhấn "Thêm món mới", chọn danh mục "Cà phê", nhập giá. | Card sản phẩm xuất hiện trong danh sách. | ✅ Pass |
| MN_03 | Lọc theo danh mục | Nhấn chọn một Tab danh mục cụ thể. | Chỉ hiển thị các món thuộc danh mục đã chọn. | ✅ Pass |
| MN_04 | Tìm kiếm sản phẩm | Nhập tên món vào thanh tìm kiếm. | Danh sách sản phẩm được lọc theo thời gian thực (Real-time). | ✅ Pass |
| MN_05 | Chống trùng danh mục | Thêm danh mục có tên đã tồn tại. | Hiển thị thông báo lỗi "Danh mục đã tồn tại". | ✅ Pass |
| MN_06 | Chống trùng sản phẩm | Thêm sản phẩm có tên đã tồn tại. | Hiển thị thông báo lỗi "Sản phẩm đã tồn tại". | ✅ Pass |

---

## 5. Module: Hóa đơn (Orders)

| ID | Chức năng | Kịch bản kiểm thử | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| OD_01 | Hiển thị danh sách | Truy cập `/admin/orders`. | Hiển thị danh sách đơn hàng đã xếp theo thời gian mới nhất. | ✅ Pass |
| OD_02 | Lọc trạng thái | Nhấn chọn các tab trạng thái (Chờ xác nhận, Đã phục vụ...). | Danh sách cập nhật đúng các hóa đơn theo trạng thái. | ✅ Pass |
| OD_03 | Cập nhật trạng thái | Nhấn "Xác nhận" trên một hóa đơn "Pending". | Nút đổi thành "Xong món", nhãn trạng thái đổi màu Blue. | ✅ Pass |
| OD_04 | Hủy hóa đơn | Nhấn "Hủy" trên một đơn hàng chưa thanh toán. | Trạng thái đổi thành "Đã hủy" (màu đỏ). | ✅ Pass |

---

## 6. Module: Cài đặt (Settings)

| ID | Chức năng | Kịch bản kiểm thử | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| ST_01 | Chế độ tối | Nhấn nút toggle Sáng/Tối. | Toàn bộ giao diện (Sidebar, Card, Nền) chuyển sang Dark Mode. | ✅ Pass |
| ST_02 | Lưu Theme | Bật Dark Mode, reload trang. | Giao diện vẫn giữ Dark Mode (lưu vào localStorage). | ✅ Pass |
| ST_03 | Màu chủ đạo | Chọn màu Orange trong Color Picker. | Các nút Primary, biểu tượng Active đổi sang màu cam. | ✅ Pass |
| ST_04 | Lưu Accent Color | Chọn màu Purple, reload trang. | Màu tím vẫn được giữ nguyên. | ✅ Pass |
| ST_05 | Chỉnh sửa thông tin | Nhấn "Chỉnh sửa", đổi tên quán, nhấn "Lưu". | Hiển thị alert thành công, ô input khóa lại. | ✅ Pass |
| ST_06 | Lưu thông tin DB | Đổi tên quán, reload trang. | Tên quán mới vẫn hiển thị (dữ liệu từ Database). | ✅ Pass |
| ST_07 | Trạng thái DB | Truy cập trang khi Supabase Local đang chạy. | Hiển thị "Connected" (màu xanh). | ✅ Pass |

---

## 7. UI/UX & Hệ thống (System)

| ID | Chức năng | Kịch bản kiểm thử | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| SYS_01 | Sidebar Navigation | Nhấn vào các mục trên Sidebar. | Mục tương ứng được highlight xanh, nội dung thay đổi đúng. | ✅ Pass |
| SYS_02 | Responsiveness | Thu nhỏ trình duyệt về kích thước Mobile. | Các Grid (Khu vực, Menu) tự động xếp chồng (stack) hợp lý. | ✅ Pass |
| SYS_03 | Hydration Fix | Kiểm tra Console Log của trình duyệt. | Không còn lỗi "Hydration Mismatch" (cảnh báo đỏ). | ✅ Pass |
| SYS_04 | Fallback DB | Chạy ứng dụng khi chưa điền Supabase Key. | Hiển thị thông báo fetch failed (toast) nhưng UI không crash. | ✅ Pass |

---

## Ghi chú:
*   Mọi Test Case được thực hiện trên môi trường phát triển (Localhost) với Supabase Local Docker.
*   Phase 1 hoàn thành: **2026-02-04**.
*   Tổng số Test Cases: **32** | Pass: **32** | Fail: **0**.
