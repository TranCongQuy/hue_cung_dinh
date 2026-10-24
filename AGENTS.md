# HƯỚNG DẪN DÀNH CHO AGENT / DEVELOPER (AGENTS.MD)

Tài liệu này quy định toàn bộ các nguyên tắc kiến trúc, quy chuẩn mã nguồn và chỉ dẫn phát triển cho các kỹ sư phần mềm và AI Agent tham gia xây dựng dự án **"Huế Cung Đình – Dịch vụ Cưới & Chụp ảnh" (Mã dự án: `doan-fenc`)** thuộc học phần **Web FrontEnd Nâng Cao (INT.7.18)**.

---

## 1. NGUYÊN TẮC CỐT LÕI & CÔNG NGHỆ BẮT BUỘC

1. **Ngôn ngữ & Runtime:**
   - **React 19:** Sử dụng Function Components + React Hooks chuẩn. Tuyệt đối không dùng Class Components.
   - **TypeScript:** Bắt buộc bật `strict: true`. **CẤM TUYỆT ĐỐI dùng kiểu `any`**. Mọi kiểu dữ liệu phải được định nghĩa rõ ràng hoặc suy diễn từ Zod Schema (`z.infer<typeof schema>`).
   - **Vite:** Công cụ đóng gói và máy chủ phát triển siêu tốc.

2. **Định tuyến (Routing):**
   - **React Router v8:**
     - Các hook, route component, navigation import từ `"react-router"`.
     - Router provider import từ `"react-router/dom"` (`RouterProvider`, `createBrowserRouter`, v.v.).
     - **KHÔNG** cài đặt hay import từ gói `react-router-dom` độc lập trái với cấu hình React Router v8.

3. **Quản lý Trạng thái (State Management):**
   - **Zustand v5:** Sử dụng cho trạng thái toàn cục ứng dụng (ví dụ: Giỏ hàng `cartStore` với middleware `persist` lưu `localStorage`, trạng thái thông báo `toastStore`).
   - **React Context API:** **CHỈ** được sử dụng cho 2 mục đích duy nhất:
     - `ThemeContext`: Chuyển đổi giao diện Sáng (Light) / Tối (Dark).
     - `AuthContext`: Quản lý phiên đăng nhập Quản trị viên (Admin token/session).

4. **Kiểm thực Dữ liệu (Validation):**
   - **Zod v4:** Kiểm thực toàn diện trên 3 tầng:
     - Dữ liệu phản hồi từ API (API Response: `unknown` -> `schema.safeParse`).
     - Dữ liệu biểu mẫu (Form input: realtime validation & touched state).
     - Tham số URL (Route params & Search query params).
   - **CẤM** ép kiểu mù quáng bằng từ khóa `as` đối với dữ liệu từ bên ngoài (API, localStorage, URL params).

5. **Giao diện & Kiểu dáng (Styling):**
   - **CSS THUẦN 100%:** Sử dụng CSS Variables, Flexbox hiện đại, CSS Grid.
   - **CẤM TUYỆT ĐỐI Tailwind CSS, Bootstrap, MUI, Ant Design hay bất kỳ thư viện UI nào.**
   - **CẤM thư viện Icon bên ngoài (FontAwesome, Lucide, React-Icons, v.v.):** Toàn bộ icon được viết dưới dạng React SVG Component thuần túy (`src/components/common/Icon.tsx`).
   - **CẤM Emoji** trong giao diện chính thức; sử dụng SVG mang phong cách cung đình tinh xảo.

6. **Backend Giả lập (Mock Server):**
   - Node.js thuần (`server/api.cjs`) kết hợp `db.json` chạy trên cổng `http://localhost:4000`.
   - **KHÔNG dùng framework Express**, chỉ dùng module gốc `http`, `fs`, `url` của Node.js.
   - Hỗ trợ đầy đủ CORS, xử lý RESTful JSON và thuật toán gợi ý gói cưới AI Mock.

---

## 2. QUY CHUẨN KIẾN TRÚC THƯ MỤC (FEATURE-BASED ARCHITECTURE)

Dự án áp dụng mô hình Feature-based nghiêm ngặt:

```
src/
├── app/                  # Khởi tạo Router, Providers và Root Component
│   ├── App.tsx
│   ├── routes.tsx
│   └── main.tsx
├── pages/                # Các trang cấp cao (định tuyến tới)
│   ├── HomePage.tsx
│   ├── ServicesPage.tsx
│   ├── PackagesPage.tsx
│   ├── PackageDetailPage.tsx
│   ├── ConsultationPage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   └── admin/
│       ├── AdminDashboardPage.tsx
│       ├── AdminServicesPage.tsx
│       ├── AdminPackagesPage.tsx
│       └── AdminRequestsPage.tsx
├── features/             # Đóng gói logic nghiệp vụ theo module
│   ├── services/         # Dịch vụ lẻ (Áo dài, Thợ ảnh, Địa điểm, Trang trí)
│   │   ├── types.ts
│   │   ├── schema.ts
│   │   ├── api.ts
│   │   ├── hooks/
│   │   └── components/
│   ├── packages/         # Gói cưới combo (Cung đình, Hiện đại, Cổ điển)
│   │   ├── types.ts
│   │   ├── schema.ts
│   │   ├── api.ts
│   │   ├── store.ts      # (cartStore / bookingStore)
│   │   ├── hooks/
│   │   └── components/
│   ├── consultation/     # Tính toán & đề xuất gói cưới thông minh (AI Mock)
│   │   ├── types.ts
│   │   ├── schema.ts
│   │   ├── api.ts
│   │   ├── hooks/
│   │   └── components/
│   ├── requests/         # Yêu cầu tư vấn của khách hàng
│   │   ├── types.ts
│   │   ├── schema.ts
│   │   ├── api.ts
│   │   └── components/
│   └── auth/             # Xác thực Admin
│       ├── types.ts
│       ├── schema.ts
│       ├── AuthContext.tsx
│       └── ProtectedRoute.tsx
├── components/           # Các UI component tái sử dụng toàn cục
│   ├── common/           # Button, Input, Modal, Toast, Skeleton, Icon
│   └── layout/           # Header, Footer, AdminLayout, MainLayout
├── context/              # Các Context cấp ứng dụng (ThemeContext)
├── lib/                  # Tiện ích dùng chung (http client, helpers, formatters)
└── styles/               # CSS Biến toàn cục, reset, typography
    ├── variables.css
    ├── reset.css
    └── globals.css
```

### Quy tắc Nhập khẩu Một chiều (One-Way Dependency Rule)
```
app ──> pages ──> features ──> components ──> lib
```
- Module tầng dưới **tuyệt đối không** import ngược lại module tầng trên.
- Giữa các `features/` độc lập, chỉ giao tiếp thông qua interfaces/types chuẩn, không ghép nối chặt (tight coupling).

---

## 3. QUY CHUẨN QUẢN LÝ DỮ LIỆU & ASYNC STATE

### Discriminated Union AsyncState
Mọi trạng thái bất đồng bộ bắt buộc phải tuân theo mẫu chuẩn:
```typescript
export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };
```

Khi render giao diện, bắt buộc sử dụng cấu trúc `switch-case` có nhánh kiểm tra vét cạn (`exhaustive check`) với kiểu `never`:

```typescript
function assertNever(x: never): never {
  throw new Error(`Trạng thái không xác định: ${JSON.stringify(x)}`);
}

switch (state.status) {
  case 'loading':
    return <SkeletonLoader />;
  case 'error':
    return <ErrorMessage message={state.message} />;
  case 'success':
    return <DataView data={state.data} />;
  default:
    return assertNever(state);
}
```

### Xác thực API Response
Dữ liệu nhận từ `fetch` hoặc HTTP helper luôn là kiểu `unknown`:
```typescript
const raw: unknown = await response.json();
const parsed = mySchema.safeParse(raw);
if (!parsed.success) {
  throw new Error(`Dữ liệu không hợp lệ: ${parsed.error.message}`);
}
return parsed.data; // Được suy kiểu an toàn 100%
```

---

## 4. QUY CHUẨN FORM & TIẾP CẬN KHUYẾT TẬT (A11Y)

1. **Controlled Form:** Mọi trường nhập liệu đều phải được liên kết với state (`value` và `onChange`).
2. **Quản lý trạng thái Touched:** Lỗi chỉ hiển thị khi trường dữ liệu đã bị `blur` hoặc khi người dùng bấm `submit`.
3. **Thuộc tính Form tiêu chuẩn:**
   - Thẻ `<form>` luôn có `onSubmit={handleSubmit}` và `noValidate` (để vô hiệu hóa popup mặc định của trình duyệt).
   - Gọi `e.preventDefault()` trong trình xử lý sự kiện submit.
   - Thẻ `<input>`, `<select>`, `<textarea>` bắt buộc có `id`, `name`, `aria-invalid={hasError}`, `aria-describedby={hasError ? errorId : undefined}`.
   - Thông báo lỗi bắt buộc nằm trong `<p id={errorId} role="alert" className="form-error">`.
   - Các nút bấm không có text tường minh bắt buộc có `aria-label`.

---

## 5. THIẾT KẾ GIAO DIỆN & MÃ NGUỒN SẠCH (CLEAN CODE)

1. **Kích thước Component:**
   - Mỗi Component không vượt quá 150 dòng code. Nếu dài hơn, phải bóc tách thành sub-components hoặc custom hooks.
2. **Comment Code:**
   - Viết comment bằng tiếng Việt giải thích lý do thực hiện nghiệp vụ ("Tại sao làm vậy") thay vì mô tả cú pháp ("Đang làm gì").
3. **Cấm log rác:**
   - Tuyệt đối không để lại `console.log` trong mã nguồn hoàn thiện.
4. **Kiểm tra chất lượng liên tục:**
   - Chạy `npm run typecheck` và `npm run build` thường xuyên, đảm bảo không có cảnh báo hay lỗi kiểu dữ liệu nào.

---

## 6. DANH MỤC TÀI LIỆU CẦN DUY TRÌ

Mọi thay đổi lớn về tính năng cần được đồng bộ hóa với:
- `docs/PRD.md`: Tài liệu yêu cầu sản phẩm.
- `docs/ROUTES.md`: Đặc tả 11 tuyến đường và ma trận bảo mật.
- `AI-DECLARATION.md`: Tuyên bố liêm chính học thuật về ứng dụng AI.
- `PROMPTS.md`: Nhật ký tinh chỉnh câu lệnh kỹ thuật.
- `README.md`: Hướng dẫn vận hành và cấu hình dự án.

