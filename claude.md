# Project Rules & Development Guidelines (claude.md)

Tài liệu này lưu trữ các quy tắc và phong cách phát triển đã thống nhất cho dự án **Local Order System**. Mọi AI Agent khi tham gia dự án phải tuân thủ nghiêm ngặt các quy tắc này.

---

## 1. Triết lý Phát triển (Orchestration Philosophy)
- **Con người thiết kế Feedback Loop:** AI không tự ý đưa ra các quyết định kiến trúc lớn mà không hỏi ý kiến.
- **AI thực thi logic:** AI chịu trách nhiệm viết code sạch, type-safe và tuân thủ pattern.
- **Tránh Architectural Drift:** Luôn kiểm tra các pattern hiện có trong codebase trước khi viết code mới.

## 2. Quy trình làm việc (Strict Workflow)
1. **Planning Mode:** Luôn bật planning mode cho các thay đổi > 15 dòng code.
2. **Review theo "Shape":** Tập trung vào cấu trúc file diff và luồng dữ liệu thay vì soi từng dòng đơn lẻ.
3. **Cập nhật tri thức:** Sau mỗi session quan trọng, phải cập nhật file này nếu có lỗi mới phát hiện hoặc pattern mới được thống nhất.

## 3. Tech Stack & Coding Standards
- **Framework:** Next.js 15+ (App Router).
- **Styling:** Vanilla CSS cho tính linh hoạt và thẩm mỹ cao (MacOS/Premium Aesthetic).
- **Database:** Supabase (PostgreSQL) + Realtime.
- **Type Safety:** TypeScript tuyệt đối, không sử dụng `any`.
- **Naming Convention:** 
    - Components: PascalCase.
    - Functions/Variables: camelCase.
    - Database Tables/Columns: snake_case.

## 4. Đặc thù Dự án (Local Cafe POS)
- **Offline-first Mindset:** Ưu tiên tính ổn định vì chạy trong môi trường quán cafe nội bộ.
- **Real-time:** Mọi order phải được đồng bộ tức thì giữa khách và quầy.
- **Printing:** Lệnh in bếp phải được ưu tiên xử lý ngay khi khách nhấn gửi order.

## 5. Danh mục Tài liệu (Documentation Map)
- `DEVELOPMENT_FLOW.md`: Quy trình phối hợp AI-Human.
- `docs/INITIAL_PRD.md`: Đặc tả tính năng chính thức.
- `docs/IMPLEMENTATION_PLAN.md`: Lộ trình triển khai theo Phase.
- `docs/ARCHITECTURE.md`: Cấu trúc kỹ thuật và luồng dữ liệu.
- `docs/DATABASE_SCHEMA.md`: Chi tiết các bảng và quan hệ.
