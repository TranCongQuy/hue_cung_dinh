# AGENTS.md — doan-fenc (Huế Cung Đình - Dịch Vụ Cưới & Chụp Ảnh)

**Học phần:** Web FrontEnd Nâng Cao (INT.7.18)  
**Sinh viên thực hiện:** Trần Công Quý (MSSV: 2401ITA001 - Lớp CNTT K22)  
**Giảng viên hướng dẫn:** Thầy Dương Ngọc Duy  

Tài liệu này quy định toàn bộ ngăn xếp công nghệ, cấu trúc thư mục, quy ước lập trình và các điều cấm kỵ bắt buộc cho kỹ sư phần mềm và AI Agent tham gia phát triển dự án **"Huế Cung Đình – Dịch vụ Cưới & Chụp ảnh Hoàng Triều" (Mã dự án: `doan-fenc`)**.

---

## Stack
- **Core Framework:** React 19 (Function Components + Hooks + `React.lazy` Code Splitting), Vite 6.x
- **Ngôn ngữ:** TypeScript 5.x bật `strict: true` 100% (`noUncheckedIndexedAccess: true`)
- **Định tuyến (Routing):** React Router v8 (Import từ `"react-router"` và `"react-router/dom"`)
- **Quản lý Trạng thái:** Zustand v5 (`cartStore` & `wishlistStore` có `persist` `localStorage`, `toastStore`), React Context API (Theme & Auth)
- **Kiểm thực Dữ liệu:** Zod v4 (Xác thực 3 tầng: API Response, Form Inputs, URL Params)
- **Giao diện (Styling):** CSS Thuần túy 100% (CSS Variables tại `variables.css`, Flexbox, Grid, Dark/Light Mode, `@media print`)
- **Biểu tượng & Biểu đồ:** 100% Pure SVG Components tự tính toán toạ độ (63 biểu tượng SVG, Bản đồ Di sản Cố đô SVG, Phòng phối cổ phục 2D SVG, Bar/Donut/Sparkline Charts SVG — Không dùng thư viện ngoài)
- **Backend Cloud & Hosting:** Supabase (PostgreSQL 6 bảng, Storage bucket `studio-media`, RLS) + Vercel Deployment + Local Mock Server (`server/api.cjs` Node.js thuần cổng 4000)
- **Kiểm thử (Testing):** Vitest + `@testing-library/react` + jsdom (53 ca kiểm thử tự động trên 3 tệp test)

---

## Cấu trúc thư mục

Dự án áp dụng mô hình **Feature-Based Architecture** nghiêm ngặt với quy tắc phụ thuộc một chiều (`app ➔ pages ➔ features ➔ components ➔ lib`):

```
src/
├── app/                  # Khởi tạo App, Root Providers và Tuyến đường (28 tuyến chức năng)
│   ├── App.tsx
│   ├── RootLayout.tsx
│   ├── AdminLayout.tsx
│   ├── routes.tsx
│   └── main.tsx
├── pages/                # 27 Component Trang (20 trang khách/công cộng + 7 trang quản trị)
│   ├── HomePage.tsx
│   ├── ServicesPage.tsx
│   ├── ServiceDetailPage.tsx
│   ├── PackagesPage.tsx
│   ├── PackageDetailPage.tsx
│   ├── ConsultationPage.tsx
│   ├── HeritageMapPage.tsx
│   ├── RoyalFittingRoomPage.tsx
│   ├── LookbookGalleryPage.tsx
│   ├── WeddingPlannerPage.tsx
│   ├── InvitationsPage.tsx
│   ├── InvitationDetailPage.tsx
│   ├── InvitationCustomPage.tsx
│   ├── PublicInvitationSharePage.tsx
│   ├── CartPage.tsx
│   ├── MyBookingsPage.tsx
│   ├── BookingPage.tsx
│   ├── ProcessGuidePage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   └── admin/
│       ├── AdminDashboardPage.tsx
│       ├── AdminServicesPage.tsx
│       ├── AdminPackagesPage.tsx
│       ├── AdminInvitationsPage.tsx
│       ├── AdminRequestsPage.tsx
│       ├── AdminSchedulePage.tsx
│       └── AdminUsersPage.tsx
├── features/             # Đóng gói logic nghiệp vụ theo từng Feature
│   ├── home/             # HeroSection, Marquee gói cưới, cảm nhận khách hàng
│   ├── services/         # Dịch vụ lẻ (18 dịch vụ di sản, upload ảnh & đánh giá)
│   ├── packages/         # Gói cưới combo hoàng triều (9 combo, cartStore Zustand)
│   ├── consultation/     # AI Tư vấn ngân sách 10–60 triệu & chuyển thẳng Đặt lịch
│   ├── invitations/      # Thiệp cưới online, 15 ngân hàng VietQR, đếm ngược thực & RSVP
│   ├── requests/         # Đơn yêu cầu, Kanban kéo thả 5 cột, Nhật ký CSKH & Hợp đồng A4
│   ├── admin/            # Dashboard KPI động, biểu đồ SVG Bar & Donut, ConfirmModal
│   └── auth/             # Xác thực Admin/User, AuthContext & ProtectedRoute
├── components/           # UI Components tái sử dụng toàn cục
│   ├── common/           # Button, Input, Modal, Toast, Skeleton, Icon (63 SVG), CommandPalette, WishlistDrawer, ComparePackagesWidget, RoyalDivider, ScrollProgressBar
│   └── layout/           # Header (Dropdown Khám Phá, Tìm kiếm Ctrl+K, Yêu thích), Footer
├── context/              # Context toàn cục (ThemeContext light/dark)
├── lib/                  # Tiện ích dùng chung (formatters, types, toastStore, wishlistStore, supabaseAdapter, useFetch)
└── styles/               # CSS Variables (variables.css), reset và typography hoàng triều (globals.css)
```

---

## Qui ước

1. **TypeScript Nghiêm Ngặt:**
   - Bắt buộc bật `strict: true`. **CẤM TUYỆT ĐỐI dùng kiểu `any`**.
   - Mọi kiểu dữ liệu bắt buộc suy diễn từ Zod Schema (`z.infer<typeof schema>`) hoặc định nghĩa rõ ràng với interface/type.
2. **Xuất Bản Component:**
   - Component export dưới dạng Named Export: `export function ComponentName() { ... }`.
3. **Quản Lý Trạng Thái Bất Đồng Bộ (Discriminated Union):**
   - Mọi Async State phải tuân theo mẫu chuẩn:
     ```typescript
     export type AsyncState<T> =
       | { status: 'loading' }
       | { status: 'error'; message: string }
       | { status: 'success'; data: T };
     ```
   - Khi render giao diện bắt buộc dùng `switch-case` kèm nhánh vét cạn `assertNever(state)`.
4. **Xử Lý Lỗi (Error Handling):**
   - Dữ liệu nhận từ API bên ngoài luôn là `unknown` ➔ Bắt buộc `schema.safeParse(raw)` kiểm tra tính toàn vẹn.
   - Khi phát sinh ngoại lệ nghiệp vụ, bắt buộc ném lỗi có cấu trúc `throw new AppError(message, code, status)` (được khai báo tại `src/lib/types.ts`).
   - CẤM TUYỆT ĐỐI `console.error()` trong mã nguồn chạy thực tế; toàn bộ lỗi hiển thị thân thiện qua `toastStore` hoặc hộp thông báo UI.
5. **Tiếp Cận Khuyết Tật & Form Chuẩn Mực (A11y):**
   - Mọi trường `<input>`, `<select>`, `<textarea>` bắt buộc có `id`, `name`, `aria-invalid`, `aria-describedby`.
   - Thông báo lỗi nằm trong thẻ có `role="alert"`. Nút bấm không chữ phải có `aria-label`.
6. **Quy Chuẩn Commit Message:**
   - Tuân thủ Conventional Commits:
     - `feat(invitations): add dynamic vietqr transfer modal`
     - `fix(routes): protect admin routes with 2-tier rbac`
     - `docs(prd): update user stories acceptance criteria`
     - *Không bao giờ commit chung chung dạng: "fix bug", "update", "code".*

---

## Cấm

1. **CẤM Tailwind CSS, Bootstrap, MUI, Ant Design hay bất kỳ thư viện UI ngoài.** Toàn bộ giao diện viết bằng CSS thuần túy với CSS Variables và Flexbox/Grid.
2. **CẤM thư viện Icon bên ngoài (FontAwesome, Lucide, React-Icons).** Toàn bộ icon được vẽ bằng React SVG Component thuần túy (`src/components/common/Icon.tsx`).
3. **CẤM Emoji trong giao diện chính thức.** Sử dụng SVG mang phong cách cung đình tinh xảo.
4. **CẤM Redux Toolkit hay thư viện quản lý trạng thái nặng nề.** Chỉ sử dụng Zustand v5 và React Context.
5. **CẤM hardcode API URL hoặc secrets.** Khóa công khai lấy từ biến môi trường Vite (`import.meta.env.VITE_SUPABASE_URL`, `import.meta.env.VITE_SUPABASE_ANON_KEY`).
6. **CẤM để lại `console.log()`** trong mã nguồn sản phẩm cuối.
7. **CẤM import ngược (Circular Dependency)** giữa các tầng kiến trúc hoặc import từ module cấp cao xuống module cấp thấp.
8. **CẤM thư viện biểu đồ ngoài (Chart.js, Recharts, ApexCharts).** Toàn bộ biểu đồ Cột (Bar Chart), biểu đồ Tròn (Donut Chart), đường sóng Sparklines, Bản đồ Di sản và Phòng phối cổ phục 2D đều vẽ bằng Pure SVG tự tính toán hình học.

---

## Backend & Cloud Deployment (Supabase + Vercel)

- **Supabase Cloud:**
  - PostgreSQL Database quản lý 6 bảng: `dich_vu`, `goi_cuoi`, `yeu_cau`, `thiep_cuoi`, `thiep_khach_tao`, `profiles` cùng kho lưu trữ ảnh `studio-media`.
  - Phân quyền 2 cấp độ (2-Tier RBAC): `admin` (Quản trị viên toàn quyền) và `user` (Khách hàng công cộng).
  - Row Level Security (RLS) bảo vệ từng hàng dữ liệu.
- **Vercel Deployment:**
  - File `vercel.json` định tuyến SPA Rewrite `/* ➔ /index.html` chống lỗi 404 khi người dùng tải lại trang con.
  - Tự động CI/CD khi đẩy mã lên nhánh `main` của GitHub.
- **Cơ chế Fallback An toàn:**
  - Luôn sẵn sàng dữ liệu dự phòng khi mạng offline hoặc không có kết nối internet để kiểm thử Vitest và nghiệm thu đồ án luôn chạy mượt mà 100%.

---

## Danh mục tài liệu đồng bộ cần duy trì
Mọi thay đổi lớn cần được cập nhật nhất quán giữa:
- `AGENTS.md`: Hướng dẫn nguyên tắc và công nghệ.
- `docs/PRD.md`: Tài liệu yêu cầu sản phẩm chuẩn 8 phần.
- `docs/ROUTES.md`: Đặc tả chi tiết 28 tuyến đường chức năng (29 khai báo leaf route) và ma trận bảo mật.
- `AI-DECLARATION.md`: Bản tuyên bố liêm chính học thuật về ứng dụng AI.
- `PROMPTS.md`: Nhật ký các câu lệnh kỹ thuật từng giai đoạn.
- `README.md`: Cẩm nang hướng dẫn vận hành, chạy thử và tài khoản trải nghiệm.
