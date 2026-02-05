# Database Schema (Phase 1)

Tài liệu này mô tả cấu trúc các bảng trong cơ sở dữ liệu PostgreSQL (Supabase).

---

## 1. Tables

### 1.1. `areas` (Khu vực)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | Định danh khu vực |
| `name` | string | Tên khu vực (Tầng 1, Sân vườn...) |
| `created_at` | timestamp | Thời gian tạo |

### 1.2. `tables` (Bàn)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | Định danh bàn (dùng cho QR code) |
| `area_id` | uuid (FK) | Liên kết với bảng `areas` |
| `name` | string | Tên bàn (Bàn 01, Bàn 02...) |
| `is_available`| boolean | Trạng thái bàn (Trống/Đang dùng) |

### 1.3. `categories` (Danh mục món)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | Định danh danh mục |
| `name` | string | Tên danh mục (Cafe, Trà, Sinh tố...) |

### 1.4. `products` (Món ăn/đồ uống)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | Định danh món |
| `category_id` | uuid (FK) | Liên kết với `categories` |
| `name` | string | Tên món |
| `price` | number | Giá bán lẻ |
| `base_cost` | number | Giá vốn (để tính lợi nhuận) |
| `image_url` | string | Đường dẫn ảnh món |
| `is_active` | boolean | Còn hàng hay đã hết |

### 1.5. `orders` (Hóa đơn)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | Định danh hóa đơn |
| `table_id` | uuid (FK) | Liên kết với `tables` |
| `total_amount`| number | Tổng tiền sau chiết khấu |
| `discount_value`| number | Giá trị giảm giá |
| `status` | string | Trạng thái (Pending, Preparing, Served, Paid, Cancelled) |
| `created_at` | timestamp | Thời gian gọi món |

### 1.6. `order_items` (Chi tiết hóa đơn)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | Định danh item |
| `order_id` | uuid (FK) | Liên kết với `orders` |
| `product_id` | uuid (FK) | Liên kết với `products` |
| `quantity` | number | Số lượng |
| `note` | string | Ghi chú khách (ít đường, nhiều đá...) |
| `price_at_order`| number | Giá lúc đặt (tránh thay đổi giá sau này) |

### 1.7. `staff_calls` (Yêu cầu hỗ trợ)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | Định danh yêu cầu |
| `table_id` | uuid (FK) | Liên kết với `tables` |
| `note` | string | Nội dung yêu cầu (Lấy khăn giấy, Thêm nước...) |
| `status` | string | Trạng thái (`pending`, `completed`) |
| `created_at` | timestamp | Thời gian yêu cầu |

---

## 2. Relationships (Quan hệ)
- Một `area` có nhiều `tables`.
- Một `category` có nhiều `products`.
- Một `table` có thể có nhiều `orders` theo thời gian, nhưng tại một thời điểm chỉ có 1 `order` đang Active (`status != 'Paid'`).
- Một `order` có nhiều `order_items`.
- Một `table` có thể gửi nhiều `staff_calls`.
