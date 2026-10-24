# AGENTS.md — doan-fenc (Huế Cung Đình - Dịch Vụ Cưới & Chụp Ảnh)

Tài liệu này quy định toàn bộ ngăn xếp công nghệ, cấu trúc thư mục, quy ước lập trình và các điều cấm kỵ bắt buộc cho kỹ sư phần mềm và AI Agent tham gia phát triển dự án **"Huế Cung Đình – Dịch vụ Cưới & Chụp ảnh Hoàng Triều" (Mã dự án: `doan-fenc`)** thuộc học phần **Web FrontEnd Nâng Cao (INT.7.18)**.

---

## Stack
- **Core Framework:** React 19 (Function Components + Hooks), Vite 6.x
- **Ngôn ngữ:** TypeScript 5.x bật `strict: true` 100%
- **Định tuyến (Routing):** React Router v8 (Import từ `"react-router"` và `"react-router/dom"`)
- **Quản lý Trạng thái:** Zustand v5 (Persist localStorage cho giỏ hàng), React Context API (Theme & Auth)
- **Kiểm thực Dữ liệu:** Zod v4 (Xác thực 3 tầng: API Response, Form Inputs, URL Params)
- **Giao diện (Styling):** CSS Thuần túy 100% (CSS Variables, Flexbox, Grid, Dark/Light Mode, `@media print`)
- **Biểu tượng & Biểu đồ:** 100% Pure SVG Components tự tính toán toạ độ (Không dùng thư viện ngoài)
- **Backend Cloud & Hosting:** Supabase (PostgreSQL, Storage, RLS) + Vercel Deployment + Local Mock Server (`server/api.cjs` Node.js thuần cổng 4000)
- **Kiểm thử (Testing):** Vitest + `@testing-library/react` + jsdom

---

## Cấu trúc thư mục

Dự án áp dụng mô hình **Feature-Based Architecture** nghiêm ngặt với quy tắc phụ thuộc một chiều (`app ➔ pages ➔ features ➔ components ➔ lib`):

```
src/
├── app/                  # Khởi tạo App, Root Providers và Tuyến đường
│   ├── App.tsx
│   ├── RootLayout.tsx
│   ├── AdminLayout.tsx
│   ├── routes.tsx
│   └── main.tsx
├── pages/                # Các trang cấp cao (Tương ứng với từng Route)
│   ├── HomePage.tsx
│   ├── ServicesPage.tsx
│   ├── ServiceDetailPage.tsx
│   ├── PackagesPage.tsx
│   ├── PackageDetailPage.tsx
│   ├── ConsultationPage.tsx
│   ├── InvitationsPage.tsx
│   ├── InvitationCustomPage.tsx
│   ├── CartPage.tsx
│   ├── BookingPage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   └── admin/
│       ├── AdminDashboardPage.tsx
│       ├── AdminServicesPage.tsx
│       ├── AdminPackagesPage.tsx
│       ├── AdminRequestsPage.tsx
│       └── AdminUsersPage.tsx
├── features/             # Đóng gói logic nghiệp vụ theo từng Feature
│   ├── services/         # Dịch vụ lẻ (Áo Nhật Bình, Áo Tấc, Thợ ảnh, Địa điểm)
│   ├── packages/         # Gói cưới combo hoàng triều (cartStore Zustand)
│   ├── consultation/     # AI Tư vấn ngân sách & thuật toán tối ưu chi phí
│   ├── invitations/      # Thiệp cưới online, RSVP & Dynamic VietQR
│   ├── requests/         # Đơn yêu cầu tư vấn & Bảng Kanban
│   ├── admin/            # Dashboard KPI, biểu đồ SVG Bar & Donut
│   └── auth/             # Xác thực Admin/User, AuthContext & ProtectedRoute
├── components/           # UI Components tái sử dụng toàn cục
│   ├── common/           # Button, Input, Modal, Toast, Skeleton, Icon (SVG)
│   └── layout/           # Header, Footer
├── context/              # Context toàn cục (ThemeContext light/dark)
├── lib/                  # Tiện ích dùng chung (formatters, types, toastStore, supabase, useFetch)
└── styles/               # CSS Variables, reset và typography hoàng triều
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
   - Hiển thị lỗi thân thiện qua `toastStore` hoặc thông báo UI, không để ứng dụng crash.
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
8. **CẤM thư viện biểu đồ ngoài (Chart.js, Recharts, ApexCharts).** Toàn bộ biểu đồ Cột (Bar Chart), biểu đồ Tròn (Donut Chart) và đường sóng Sparklines đều vẽ bằng Pure SVG tự tính toán hình học.

---

## Backend & Cloud Deployment (Supabase + Vercel)

- **Supabase Cloud:**
  - PostgreSQL Database quản lý 5 bảng: `dich_vu`, `goi_cuoi`, `yeu_cau`, `thiep_cuoi`, `profiles`.
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
- `docs/ROUTES.md`: Đặc tả chi tiết 17 tuyến đường và ma trận bảo mật.
- `AI-DECLARATION.md`: Bản tuyên bố liêm chính học thuật về ứng dụng AI.
- `PROMPTS.md`: Nhật ký các câu lệnh kỹ thuật từng giai đoạn.
- `README.md`: Cẩm nang hướng dẫn vận hành, chạy thử và tài khoản trải nghiệm.
