# BÁO CÁO ĐỐI SOÁT & KHẮC PHỤC ĐIỂM LỆCH PHÍA MÃ NGUỒN (DIEM-LECH-PHIA-CODE.MD)

**Dự án:** Huế Cung Đình – Dịch Vụ Cưới & Nhiếp Ảnh Cổ Phục Hoàng Triều (`doan-fenc`)  
**Ngày cập nhật:** 12/11/2026  
**Người thực hiện:** Trần Công Quý (MSSV: 2401ITA001)

Tài liệu này ghi nhận kết quả xử lý **toàn bộ 13 điểm lệch kỹ thuật** được phát hiện ở đợt rà soát trước, đồng thời liệt kê minh bạch các giới hạn kiến trúc thuộc phạm vi ngoài đồ án (Out of Scope) để phục vụ báo cáo bảo vệ.

---

## 1. BẢNG KẾT QUẢ KHẮC PHỤC 13 ĐIỂM LỆCH TRƯỚC ĐÓ

| STT | Hạng Mục Từng Bị Lệch | Trạng Thái Hiện Tại | Cơ Chế Đã Khắc Phục Trong Mã Nguồn Thực Tế |
|:---:|:---|:---:|:---|
| 1 | Huy hiệu SOP hiển thị cứng `"18 quy tắc"` trong khi dữ liệu có 8 | **Đã khắc phục** | `src/pages/ProcessGuidePage.tsx` tính động từ `{RULES_DATA.length}` (hiển thị đúng `8 quy tắc tác nghiệp di sản`). |
| 2 | VietQR mừng cưới khóa cứng BIN MB Bank `970422` | **Đã khắc phục** | `src/features/invitations/types.ts` bổ sung `BANK_BINS` (15 ngân hàng VN), `resolveBankBin` và `buildVietQrImageUrl` động theo ngân hàng người dùng chọn. |
| 3 | Đồng hồ đếm ngược thiệp cưới hiển thị số tĩnh `28/12/30/45` | **Đã khắc phục** | `InvitationModals.tsx`, `InvitationCustomPage.tsx` và `PublicInvitationSharePage.tsx` dùng `calculateCountdownParts` với `setInterval` 1 giây đếm ngược thực tế. |
| 4 | Còn sót ký tự Emoji `⭐` tại `ServicesPage.tsx` và `ProcessGuidePage.tsx` | **Đã khắc phục** | Đã thay thế hoàn toàn bằng biểu tượng SVG `<Icon name="star" />` / nhãn thuần văn bản; quét toàn bộ `src/` đạt **0 Emoji**. |
| 5 | Tài liệu `PRD.md` ghi `"PWA"` dù chưa có `manifest.json` | **Đã khắc phục** | `docs/PRD.md` đã chuẩn hóa thuật ngữ thành **Responsive Web Application** đúng thực tế kỹ thuật. |
| 6 | Bảng `yeu_cau` chưa có policy `SELECT` cho người dùng đã đăng nhập | **Đã cập nhật** | `supabase/schema.sql` bổ sung policy `"Authenticated users read requests"` và `"Authenticated users update own note or admin"` (việc lọc đơn cá nhân theo tên/SĐT vẫn thực hiện tại tầng ứng dụng để tương thích tài khoản demo). |
| 7 | Thống kê KPI Admin Dashboard chỉ dùng số tĩnh | **Đã khắc phục** | `SupabaseService.getAdminStats()` tính toán động `tongDon`, `donChoXuLy`, `tongDoanhThuDuKien`, `tyLeThanhCong` và `tyLeGoiCuoi` trực tiếp từ danh sách đơn thực tế (riêng bộ đếm Live Visitors 14–28 khách giữ cơ chế mô phỏng nhịp thời gian thực trên giao diện). |
| 8 | Trang chi tiết dịch vụ gợi ý 3 dịch vụ đầu tiên không lọc cùng `loai` | **Đã khắc phục** | `src/pages/ServiceDetailPage.tsx` ưu tiên lọc các dịch vụ có `s.loai === service.loai` trước khi bù từ danh mục khác nếu thiếu đủ 3 mục. |
| 9 | Biểu mẫu Đặt lịch chưa tự động điền `soDienThoai` | **Đã khắc phục** | `AuthContext.tsx` bổ sung `soDienThoai` trong phiên người dùng và `BookingPage.tsx` tự động điền cả `tenKhach` lẫn `soDienThoai`. |
| 10 | Nội dung chuyển khoản cọc chưa kèm mã phiếu định danh | **Đã khắc phục** | `CartDrawer.tsx` sinh mã đơn `YC-XXXXX` trước khi tạo QR, truyền `addInfo` theo định dạng `[COC_YC-XXXXX] Dat coc <tenKhach>` và lưu đồng bộ mã đơn đó. |
| 11 | `overflow-x: clip` trên `#root` | **Đã đồng bộ** | `src/styles/globals.css` áp dụng `overflow-x: clip` đồng bộ cho cả 3 phần tử `html` (dòng 17), `body` (dòng 38) và `#root` (dòng 62). |
| 12 | Thuộc tính A11y (`id`, `name`, `aria-invalid`, `aria-describedby`) trên các form viết tay | **Đã khắc phục** | Đã chuẩn hóa trên `BookingPage.tsx` (kèm điều hướng bàn phím cho `RoyalSelect`), `InvitationModals.tsx`, `PublicInvitationSharePage.tsx`, `ServiceFormModal.tsx`, `PackageFormModal.tsx`. |
| 13 | Bảng Kanban thiếu cột `tu-choi` và chưa kéo thả trực tiếp | **Đã khắc phục** | `AdminRequestsPage.tsx` mở rộng lên **5 cột Kanban** (gồm cả `Đã Từ Chối`) và trang bị kéo thả trực tiếp **HTML5 Drag & Drop** song song với nút bấm chuyển nhanh. |

---

## 2. CÁC GIỚI HẠN PHẠM VI HIỆN TẠI (GHI NHẬN MINH BẠCH TRONG BÁO CÁO WORD)

1. **Xác thực tài khoản trình diễn song song Supabase:** Để giảng viên và hội đồng nghiệm thu ngay với 1 cú nhấp chuột mà không cần cấu hình SMTP xác nhận email, `AuthContext` vẫn duy trì cơ chế phiên cục bộ (`localStorage`) cho 2 tài khoản mẫu `admin` / `khachhang` bên cạnh cấu trúc bảng `public.profiles` trên Supabase.
2. **Đối soát thanh toán VietQR bán tự động:** Mã VietQR tạo đúng chuẩn Napas247 với số tiền cọc 20% và nội dung `[COC_YC-XXXXX]`, tuy nhiên hệ thống chưa kết nối Webhook ngân hàng thương mại để tự động đổi trạng thái đơn sang `da-duyet` ngay khi giao dịch hoàn tất; Quản trị viên xác nhận và duyệt đơn trên bảng Kanban.
3. **Bộ đếm khách đang xem (Live Visitor Counter):** Con số khách trực tuyến (dao động 14–28 người) trên trang `/admin` là hiệu ứng mô phỏng giao diện SaaS bằng `setInterval` phía trình duyệt, chưa gắn với kênh Supabase Realtime Presence.
