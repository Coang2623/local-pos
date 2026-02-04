# Quy trình Phát triển Dự án Hợp tác AI (AI-Human Orchestration Flow)

Tài liệu này định nghĩa cách con người và các AI Agents phối hợp để xây dựng sản phẩm theo triết lý: "Con người thiết kế Feedback Loop - AI thực thi logic".

---

## 🟢 Giai đoạn 1: Khởi tạo Spec "Sống" (Dynamic Spec Generation)
*Mục tiêu: Biến ý tưởng mơ hồ thành đặc tả kỹ thuật chi tiết và khả thi.*

1.  **Draft Spec (Gemini 3 Pro):** Dùng khả năng sáng tạo và multimodal để lấy input (video recording, phác thảo) tạo bản PRD thô.
2.  **Deep Interview (Claude Code):** Sử dụng công cụ `ask user question` để phỏng vấn ngược lại con người.
    - *Action:* "Read this spec, interview me in detail about anything ambiguous."
    - *Kết quả:* Spec được lấp đầy các chi tiết về UI/UX và logic biên.
3.  **Library Discovery (GPT 5.2):** Tìm kiếm các thư viện có sẵn để tránh "viết lại bánh xe".
    - *Action:* Tìm các GitHub packages ổn định, phù hợp với Next.js/Tech stack để tăng tốc phát triển.

---

## 🔵 Giai đoạn 2: Lập kế hoạch & Chống Architectural Drift (Planning)
*Mục tiêu: Đảm bảo tính nhất quán của toàn bộ hệ thống.*

- **Planning Mode:** Luôn bật chế độ planning cho các task > 15 dòng code. Cho phép Explore Sub-agents tìm kiếm các pattern cũ để kế thừa, tránh tạo ra nhiều version code khác nhau cho cùng một nhiệm vụ.
- **Breakdown Phase:** Chia nhỏ Spec thành các giai đoạn (Phases). Triển khai và test xong phase này mới chuyển sang phase sau để refine spec kịp thời.

---

## 🟡 Giai đoạn 3: Phân vai Model (Task-to-Model Mapping)

| Model | Vai trò | Tác vụ cụ thể |
| :--- | :--- | :--- |
| **Opus 4.5** | **Architect & Lead** | Tính năng lớn, Refactor hệ thống, Viết code sạch. |
| **GPT 5.2** | **Strategist & Debugger** | Quyết định kiến trúc, Fix các bug logic phức tạp mà Opus kẹt. |
| **Sonnet 4.5**| **UI/UX & Review** | Tinh chỉnh UI, viết Changelog, Review code nhỏ. |
| **Gemini 3 Pro**| **Creative Designer**| Thiết kế giao diện, tạo prompt chi tiết cho Opus. |
| **Haiku 4.5** | **Fast Assistant** | Giải thích khái niệm, sửa lỗi nhanh trong file đã biết. |

---

## 🟠 Giai đoạn 4: Thực hiện & Quản trị Feedback Loop
*Mục tiêu: Monitor agent và cải thiện môi trường làm việc.*

- **Review theo "Shape":** Không soi từng dòng code (line-by-line). Quan sát diff: nếu file bị ảnh hưởng và độ dài thay đổi "trông đúng cấu trúc", tiến hành commit. Nếu "shape" sai, mới kiểm tra sâu.
- **Internal Docs (`claude.md` / Skills):** Cập nhật liên tục các lỗi agent hay mắc hoặc các pattern mới vào `claude.md` hoặc file rule của project.
- **Sub-agents for Research:** Sử dụng sub-agents để nghiên cứu tài liệu (Stripe, Supabase...) hoặc tìm nguyên nhân bug từ nhiều góc độ trước khi thực hiện edit chính.
- **Session Forking:** Khi gặp một hướng đi mới hoặc muốn thử nghiệm, sử dụng `--fork` để không làm nhiễu luồng chính.

---

## � Giai đoạn 5: Kiểm định & Đóng gói (Packaging)

- **Verification:** Chạy test tự động sau mỗi phase.
- **Changelog Automation:** Dùng Sonnet 4.5 để tổng hợp các thay đổi thành release notes chuyên nghiệp.

---

## 💡 Vai trò của Con người (The Orchestrator)
1.  **Quyết định cấp cao:** Chọn Database, chọn Library, xác định công cụ cần thiết.
2.  **Thiết kế môi trường:** Cập nhật Prompt, Skills và Context (MCP servers) để Agent hoạt động hiệu quả nhất.
3.  **Quan sát Reasoning:** Theo dõi cách Agent suy luận để điều chỉnh kịp thời trước khi nó đi quá xa.
