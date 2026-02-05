# Apple Design System Standards

Hệ thống Local Order System tuân thủ các quy tắc thiết kế của Apple (iOS/macOS) để mang lại trải nghiệm cao cấp, sạch sẽ và nhất quán.

## 1. Màu sắc (Colors)

Sử dụng hệ thống biến CSS trong `globals.css`:

| Biến | Ý nghĩa | Light Mode | Dark Mode |
| --- | --- | --- | --- |
| `--system-blue` | Màu chủ đạo (Action) | `#007aff` | `#0a84ff` |
| `--bg-color` | Nền trang chính | `#f5f5f7` | `#000000` |
| `--secondary-bg-color` | Nền Card/Module | `#ffffff` | `#1c1c1e` |
| `--label-primary` | Văn bản chính | `#1d1d1f` | `#f5f5f7` |
| `--label-secondary` | Văn bản phụ | `#86868b` | `#86868b` |

## 2. Hình khối & Bo góc (Shapes & Radius)

- **Cards (Module):** Bo góc `20px` (`.sf-card`).
- **Buttons:** Bo góc `10px` (`.btn-apple`).
- **Inputs:** Bo góc `10px`.
- **Modals/Sheets:** Bo góc `24px` cho các góc phía trên.

## 3. Hiệu ứng & Chiều sâu (Effects & Depth)

- **Glassmorphism:** Sử dụng hiệu ứng `backdrop-filter: blur(20px)` cho các thành phần nổi (Fixed Header, Bottom Bar).
- **Shadows:** Sử dụng đổ bóng mềm (`--sf-shadow`). Tránh đổ bóng quá đậm.
- **Translucency:** Sử dụng màu nền có độ trong suốt (alpha) cho các lớp phủ.

## 4. Typography

- **Font:** Ưu tiên `Inter` (Google Fonts) hoặc font hệ thống `-apple-system`.
- **Hierarchy:**
    - Titles: Bold, letter-spacing thấp (`-0.5px` to `-1px`).
    - Body: Kích thước tiêu chuẩn `17px` (iOS standard).
    - Subtitle: Kích thước `14px`, màu `--label-secondary`.

## 5. Tương tác (Interactions)

- **Feedback:** Thêm hiệu ứng `active: scale(0.96)` cho tất cả các nút bấm để tạo cảm giác "haptic".
- **Transitions:** Sử dụng `cubic-bezier(0.4, 0, 0.2, 1)` cho các hiệu ứng mượt mà.
- **Animations:** Sử dụng `animate-fade-up` khi các phần tử xuất hiện lần đầu.

## 6. Quy tắc cho Giao diện Khách hàng (Mobile-first)

Tương tự Admin, nhưng tối ưu cho cảm ứng:
- **Diện tích chạm (Touch Target):** Tối thiểu `44x44px`.
- **Gradients:** Sử dụng gradient tinh tế cho các thành phần quan trọng (Hero Header, Success Screen).
- **Floating Actions:** Các nút hành động chính (Giỏ hàng, Đặt món) nên được cố định ở phía dưới (Bottom Fixed) với hiệu ứng Glassmorphism.
