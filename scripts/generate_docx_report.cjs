/**
 * scripts/generate_docx_report.cjs
 * Bộ sinh tài liệu Báo Cáo Đồ Án Học Phần "Web FrontEnd Nâng Cao" (INT.7.18)
 * Dự án: Huế Cung Đình - Dịch Vụ Cưới & Nhiếp Ảnh Cổ Phục Hoàng Triều (doan-fenc)
 *
 * Toàn bộ thông tin, số liệu, tên biến, đường dẫn và trạng thái trong tài liệu này
 * được trích xuất và đối chiếu trực tiếp 100% từ mã nguồn thực tế của dự án.
 */

const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  ShadingType,
} = require('docx');

// --- Bảng màu chuẩn trích xuất từ src/styles/variables.css ---
const COLOR_PRIMARY = '8B0000';     // --primary: #8B0000 (Đỏ mận hoàng gia)
const COLOR_SECONDARY = 'D4AF37';   // --secondary: #D4AF37 (Vàng kim hoàng triều)
const COLOR_TEXT_MAIN = '1A1512';   // --text-main: #1A1512 (Đen mực nho mộc bản)
const COLOR_TEXT_MUTED = '6C645C';  // --text-muted: #6C645C (Xám trầm thanh nhã)
const COLOR_BG_LIGHT = 'FDFBF7';    // --bg-main: #FDFBF7 (Trắng ngà lụa tơ tằm)
const COLOR_ALT_ROW = 'FAF6F0';     // --surface-hover: #FAF6F0 (Màu nền phụ xen kẽ bảng)
const COLOR_BORDER = 'D1D5DB';      // Xám nhạt thanh lịch cho viền bảng

const FONT_FAMILY = 'Times New Roman';

// Helper: Tạo TextRun với cấu hình thống nhất
function createText(text, options = {}) {
  return new TextRun({
    text: text || '',
    font: FONT_FAMILY,
    size: options.size || 24, // 24 = 12pt
    bold: options.bold || false,
    italics: options.italics || false,
    color: options.color || COLOR_TEXT_MAIN,
    ...options,
  });
}

// Helper: Tạo đoạn văn tiêu chuẩn với khoảng cách dòng 1.5
function createParagraph(textRuns, options = {}) {
  const runs = Array.isArray(textRuns)
    ? textRuns
    : [createText(textRuns, options)];
  return new Paragraph({
    children: runs,
    spacing: {
      line: 360, // Giãn dòng 1.5
      before: options.before !== undefined ? options.before : 100,
      after: options.after !== undefined ? options.after : 100,
    },
    alignment: options.alignment || AlignmentType.LEFT,
    ...options,
  });
}

// Helper: Tiêu đề Chương (Heading 1)
function createH1(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [
      new TextRun({
        text: title,
        font: FONT_FAMILY,
        size: 30, // 15pt
        bold: true,
        color: COLOR_PRIMARY,
      }),
    ],
    spacing: { before: 360, after: 180 },
  });
}

// Helper: Tiêu đề Mục Lớn (Heading 2)
function createH2(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({
        text: title,
        font: FONT_FAMILY,
        size: 26, // 13pt
        bold: true,
        color: COLOR_PRIMARY,
      }),
    ],
    spacing: { before: 260, after: 130 },
  });
}

// Helper: Tiêu đề Mục Nhỏ (Heading 3)
function createH3(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [
      new TextRun({
        text: title,
        font: FONT_FAMILY,
        size: 24, // 12pt
        bold: true,
        italics: true,
        color: COLOR_TEXT_MAIN,
      }),
    ],
    spacing: { before: 180, after: 90 },
  });
}

// Helper: Điểm gạch đầu dòng (Bullet)
function createBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix + ' ',
        font: FONT_FAMILY,
        size: 24,
        bold: true,
        color: COLOR_TEXT_MAIN,
      })
    );
  }
  children.push(
    new TextRun({
      text: text,
      font: FONT_FAMILY,
      size: 24,
      color: COLOR_TEXT_MAIN,
    })
  );

  return new Paragraph({
    children,
    bullet: { level: 0 },
    spacing: { line: 340, before: 50, after: 50 },
  });
}

// Helper: Hộp ghi chú / Trích dẫn học thuật (Callout Box)
function createCallout(title, text) {
  return new Paragraph({
    children: [
      new TextRun({
        text: title ? title + '\n' : '',
        font: FONT_FAMILY,
        size: 23,
        bold: true,
        color: COLOR_PRIMARY,
      }),
      new TextRun({
        text: text,
        font: FONT_FAMILY,
        size: 22,
        italics: true,
        color: COLOR_TEXT_MUTED,
      }),
    ],
    border: {
      left: {
        color: COLOR_PRIMARY,
        space: 15,
        value: BorderStyle.SINGLE,
        size: 24,
      },
    },
    shading: {
      type: ShadingType.CLEAR,
      color: 'auto',
      fill: COLOR_BG_LIGHT,
    },
    spacing: { before: 160, after: 160 },
    indent: { left: 300, right: 300 },
  });
}

// Helper: Bảng dữ liệu định dạng chuẩn với tiêu đề và ghi chú nguồn
function createTable(tableTitle, sourceNote, headers, rows, colWidths = []) {
  const paragraphs = [];

  // Tiêu đề bảng
  if (tableTitle) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: tableTitle,
            font: FONT_FAMILY,
            size: 22,
            bold: true,
            color: COLOR_PRIMARY,
          }),
        ],
        spacing: { before: 180, after: 80 },
        alignment: AlignmentType.LEFT,
      })
    );
  }

  // Dòng tiêu đề bảng (Header Row)
  const headerCells = headers.map((headerText, i) => {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: headerText,
              font: FONT_FAMILY,
              size: 21,
              bold: true,
              color: 'FFFFFF',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 70, after: 70 },
        }),
      ],
      width: colWidths[i] ? { size: colWidths[i], type: WidthType.DXA } : undefined,
      shading: {
        type: ShadingType.CLEAR,
        color: 'auto',
        fill: COLOR_PRIMARY,
      },
      verticalAlign: 'center',
    });
  });

  const tableRows = [new TableRow({ children: headerCells, tableHeader: true })];

  // Các dòng dữ liệu (Data Rows)
  rows.forEach((row, rowIndex) => {
    const isAlt = rowIndex % 2 === 1;
    const cells = row.map((cellText, i) => {
      return new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: cellText,
                font: FONT_FAMILY,
                size: 20,
                color: COLOR_TEXT_MAIN,
              }),
            ],
            spacing: { before: 60, after: 60 },
          }),
        ],
        width: colWidths[i] ? { size: colWidths[i], type: WidthType.DXA } : undefined,
        shading: {
          type: ShadingType.CLEAR,
          color: 'auto',
          fill: isAlt ? COLOR_ALT_ROW : 'FFFFFF',
        },
        verticalAlign: 'center',
      });
    });
    tableRows.push(new TableRow({ children: cells }));
  });

  const tableComponent = new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
      left: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
      right: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
    },
  });

  paragraphs.push(tableComponent);

  // Ghi chú nguồn số liệu phía dưới bảng
  if (sourceNote) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `(Nguồn số liệu: ${sourceNote})`,
            font: FONT_FAMILY,
            size: 19,
            italics: true,
            color: COLOR_TEXT_MUTED,
          }),
        ],
        spacing: { before: 60, after: 180 },
        alignment: AlignmentType.RIGHT,
      })
    );
  }

  return paragraphs;
}

// Helper: Tóm tắt chương (Chapter Summary)
function createChapterSummary(summaryText) {
  return createCallout(
    'TÓM TẮT NỘI DUNG CHƯƠNG',
    summaryText
  );
}

// ==============================================================================
// KHỞI TẠO NỘI DUNG TOÀN DIỆN CỦA TÀI LIỆU
// ==============================================================================
async function generateWordReport() {
  console.log('Khởi chạy tiến trình sinh tài liệu học thuật (.docx)...');

  const children = [];

  // ============================================================================
  // TRANG BÌA
  // ============================================================================
  children.push(
    createParagraph('TRƯỜNG ĐẠI HỌC PHÚ XUÂN (PXU)', {
      alignment: AlignmentType.CENTER,
      before: 720,
      after: 80,
      size: 26,
      bold: true,
      color: COLOR_TEXT_MAIN,
    }),
    createParagraph('KHOA CÔNG NGHỆ THÔNG TIN', {
      alignment: AlignmentType.CENTER,
      before: 0,
      after: 800,
      size: 24,
      bold: true,
      color: COLOR_PRIMARY,
    }),
    createParagraph('═══════════════════ • ❖ • ═══════════════════', {
      alignment: AlignmentType.CENTER,
      before: 100,
      after: 800,
      size: 20,
      color: COLOR_SECONDARY,
    }),
    createParagraph('BÁO CÁO ĐỒ ÁN KẾT THÚC HỌC PHẦN', {
      alignment: AlignmentType.CENTER,
      before: 300,
      after: 100,
      size: 28,
      bold: true,
      color: COLOR_TEXT_MAIN,
    }),
    createParagraph('MÔN HỌC: WEB FRONTEND NÂNG CAO (MÃ MÔN: INT.7.18)', {
      alignment: AlignmentType.CENTER,
      before: 100,
      after: 400,
      size: 24,
      bold: true,
      color: COLOR_PRIMARY,
    }),
    createParagraph('ĐỀ TÀI BÁO CÁO:', {
      alignment: AlignmentType.CENTER,
      before: 200,
      after: 80,
      size: 22,
      italics: true,
      color: COLOR_TEXT_MUTED,
    }),
    createParagraph(
      'HUẾ CUNG ĐÌNH\nNỀN TẢNG SỐ HÓA DỊCH VỤ CƯỚI & NHIẾP ẢNH CỔ PHỤC HOÀNG TRIỀU CỐ ĐÔ HUẾ',
      {
        alignment: AlignmentType.CENTER,
        before: 100,
        after: 200,
        size: 32,
        bold: true,
        color: COLOR_PRIMARY,
      }
    ),
    createParagraph('(Mã định danh dự án: doan-fenc | Phiên bản hệ thống: 1.0.0)', {
      alignment: AlignmentType.CENTER,
      before: 0,
      after: 1000,
      size: 22,
      italics: true,
      color: COLOR_TEXT_MUTED,
    }),
    createParagraph('═══════════════════ • ❖ • ═══════════════════', {
      alignment: AlignmentType.CENTER,
      before: 200,
      after: 800,
      size: 20,
      color: COLOR_SECONDARY,
    }),
    createParagraph('Sinh viên thực hiện:  TRẦN CÔNG QUÝ', {
      alignment: AlignmentType.CENTER,
      before: 100,
      after: 80,
      size: 26,
      bold: true,
      color: COLOR_TEXT_MAIN,
    }),
    createParagraph('Mã số sinh viên (MSSV):  2401ITA001', {
      alignment: AlignmentType.CENTER,
      before: 80,
      after: 80,
      size: 24,
      bold: true,
      color: COLOR_PRIMARY,
    }),
    createParagraph('Lớp chuyên ngành:  Công Nghệ Thông Tin K22 (CNTT K22)', {
      alignment: AlignmentType.CENTER,
      before: 80,
      after: 150,
      size: 24,
      color: COLOR_TEXT_MAIN,
    }),
    createParagraph('Giảng viên hướng dẫn:  THẦY DƯƠNG NGỌC DUY', {
      alignment: AlignmentType.CENTER,
      before: 100,
      after: 1000,
      size: 26,
      bold: true,
      color: COLOR_PRIMARY,
    }),
    createParagraph('THỪA THIÊN HUẾ – THÁNG 11 NĂM 2026', {
      alignment: AlignmentType.CENTER,
      before: 400,
      after: 200,
      size: 22,
      bold: true,
      color: COLOR_TEXT_MUTED,
    }),
    createParagraph('', { pageBreakBefore: true })
  );

  // ============================================================================
  // BẢNG THUẬT NGỮ VÀ KÝ HIỆU VIẾT TẮT
  // ============================================================================
  children.push(
    createH1('BẢNG THUẬT NGỮ VÀ KÝ HIỆU VIẾT TẮT (GLOSSARY)'),
    createParagraph(
      'Để hỗ trợ giảng viên và hội đồng đánh giá dễ dàng theo dõi toàn bộ nội dung báo cáo mà không cần trực tiếp duyệt mã nguồn, bảng dưới đây định nghĩa chi tiết các thuật ngữ chuyên ngành, từ viết tắt và khái niệm kỹ thuật xuất hiện trong tài liệu:'
    ),
    ...createTable(
      'Bảng 1: Bảng giải thích thuật ngữ chuyên môn và ký hiệu viết tắt trong đồ án',
      'Đặc tả quy chuẩn mã nguồn dự án doan-fenc',
      ['STT', 'Thuật Ngữ / Viết Tắt', 'Tên Tiếng Anh Đầy Đủ', 'Giải Thích Ý Nghĩa & Vai Trò Trong Dự Án'],
      [
        ['1', 'SPA', 'Single Page Application', 'Ứng dụng web một trang, chỉ nạp mã HTML/CSS/JS ban đầu và chuyển trang mượt mà qua cơ chế định tuyến phía Client mà không tải lại toàn bộ trang web.'],
        ['2', 'RBAC', 'Role-Based Access Control', 'Mô hình phân quyền dựa trên vai trò. Hệ thống áp dụng 2 cấp độ: Quản trị viên (admin) và Khách hàng (user), kết hợp phân nhóm khách vãng lai.'],
        ['3', 'RLS', 'Row Level Security', 'Tính năng an ninh cấp hàng của PostgreSQL (Supabase), cho phép thiết lập các chính sách SQL kiểm soát quyền đọc/ghi từng dòng dữ liệu theo danh tính người gọi.'],
        ['4', 'SOP', 'Standard Operating Procedure', 'Quy trình tác nghiệp tiêu chuẩn. Là bộ tài liệu hướng dẫn từng bước vận hành chuỗi dịch vụ cưới di sản và sử dụng phần mềm.'],
        ['5', 'CRUD', 'Create, Read, Update, Delete', 'Bốn thao tác dữ liệu cơ bản: Khởi tạo, Đọc xem, Cập nhật và Xóa bỏ bản ghi trên hệ quản trị cơ sở dữ liệu.'],
        ['6', 'HMR', 'Hot Module Replacement', 'Cơ chế của Vite giúp cập nhật tức thời các module mã nguồn đã chỉnh sửa trên trình duyệt mà không làm mất trạng thái (state) hiện tại của ứng dụng.'],
        ['7', 'Schema', 'Data Schema Definition', 'Cấu trúc định nghĩa khuôn mẫu dữ liệu. Dự án sử dụng thư viện Zod để xây dựng schema kiểm thực tính hợp lệ của dữ liệu đầu vào.'],
        ['8', 'Adapter', 'Adapter Design Pattern', 'Mẫu thiết kế đóng gói tầng truy cập dữ liệu (supabaseAdapter.ts), cho phép ứng dụng chuyển đổi linh hoạt giữa Supabase Cloud và máy chủ giả lập.'],
        ['9', 'Fallback', 'Graceful Fallback Mechanism', 'Cơ chế dự phòng an toàn. Khi đường truyền mạng hoặc Supabase gặp sự cố, hệ thống tự động sử dụng nguồn dữ liệu cục bộ thay thế để không gián đoạn.'],
        ['10', 'Discriminated Union', 'Tagged / Discriminated Union', 'Kỹ thuật định kiểu nâng cao của TypeScript, sử dụng một trường định danh chung (như status: "loading" | "error" | "success") để kiểm soát trạng thái bất đồng bộ.'],
        ['11', 'VietQR', 'Vietnam QR Payment Standard', 'Chuẩn thanh toán mã QR quốc gia của Napas247, kết hợp ngân hàng thụ hưởng, số tài khoản, số tiền và nội dung chuyển khoản thành đường dẫn hình ảnh động.'],
        ['12', 'A11y', 'Web Accessibility', 'Khả năng tiếp cận web dành cho người khuyết tật, tuân thủ các thuộc tính ARIA, hỗ trợ điều hướng bàn phím (phím Tab, Escape) và tương thích trình đọc màn hình.'],
        ['13', 'Zustand', 'Zustand State Management', 'Thư viện quản lý trạng thái toàn cục gọn nhẹ cho React, sử dụng mô hình Hook đơn giản kết hợp middleware persist lưu trữ dữ liệu giỏ hàng vào localStorage.'],
        ['14', 'Zod', 'TypeScript-first Schema Validation', 'Thư viện khai báo và kiểm thực kiểu dữ liệu thời gian chạy (runtime validation), suy diễn tự động kiểu dữ liệu TypeScript tĩnh thông qua z.infer.'],
        ['15', 'PWA', 'Progressive Web Application', 'Khái niệm ứng dụng web lũy tiến có khả năng hoạt động ngoại tuyến và cài đặt lên màn hình chính thông qua Service Worker và Web App Manifest.'],
        ['16', 'Seed Data', 'Initial Seed Records', 'Dữ liệu mẫu ban đầu được nạp sẵn vào cơ sở dữ liệu để phục vụ việc kiểm thử, trình diễn và chạy thử nghiệm hệ thống.']
      ],
      [600, 1800, 2600, 4800]
    ),
    createParagraph('', { before: 100, after: 100 })
  );

  // ============================================================================
  // BẢNG ĐÁNH GIÁ TIÊU CHÍ CHẤM ĐIỂM HỌC PHẦN
  // ============================================================================
  children.push(
    createH1('BẢNG ĐÁNH GIÁ TIÊU CHÍ CHẤM ĐIỂM HỌC PHẦN (INT.7.18)'),
    createParagraph(
      'Học phần Web FrontEnd Nâng Cao đặt ra các tiêu chuẩn kỹ thuật nghiêm ngặt về tính tự chủ công nghệ, độ an toàn kiểu dữ liệu và kiến trúc mã nguồn. Dưới đây là bảng đối chiếu chi tiết giữa quy chuẩn học phần và hiện trạng triển khai thực tế trong mã nguồn dự án:'
    ),
    ...createTable(
      'Bảng 2: Đối chiếu tiêu chí đánh giá học phần với mã nguồn thực tế',
      'Kiểm chứng trực tiếp tại src/ và package.json',
      ['STT', 'Tiêu Chí Đánh Giá Cốt Lõi', 'Yêu Cầu Quy Chuẩn Học Phần', 'Hiện Trạng Triển Khai Thực Tế Trong Mã Nguồn', 'Đánh Giá'],
      [
        ['1', 'Kiến trúc mã nguồn', 'Mô hình phân tầng một chiều, tách biệt rõ ràng', 'Feature-Based Architecture: app ➔ pages ➔ features ➔ components ➔ lib. Độc lập hoàn toàn giữa các tầng.', 'Đạt 100%'],
        ['2', 'Độ an toàn kiểu dữ liệu', 'TypeScript bật strict: true, không dùng "any"', 'TypeScript 5.7.3 strict mode; 0 lỗi "any"; toàn bộ kiểu suy diễn từ Zod Schema (z.infer).', 'Đạt 100%'],
        ['3', 'Kiểm thực dữ liệu', 'Xác thực chặt chẽ Form và API Response', 'Zod v4 kiểm soát 3 tầng: API Response, Form Inputs (đặt lịch, tư vấn, thiệp) và URL query params.', 'Đạt 100%'],
        ['4', 'Quản lý trạng thái', 'State Management phù hợp, không lạm dụng Context', 'Zustand v5 (persist giỏ hàng trong cartStore); Context API chỉ dùng cho ThemeContext và AuthContext.', 'Đạt 100%'],
        ['5', 'Tự chủ giao diện', 'Cấm Tailwind, Bootstrap, MUI; viết CSS thuần', '100% Pure CSS với CSS Variables trong variables.css, Flexbox, Grid, Dark/Light Mode, @media print.', 'Đạt 100%'],
        ['6', 'Biểu tượng & Biểu đồ', 'Không dùng thư viện icon hoặc chart bên ngoài', '100% Pure SVG tự tính toán toạ độ hình học (Bar Chart, Donut Chart, Sparklines, bộ Icon.tsx).', 'Đạt 100%'],
        ['7', 'Quy chuẩn hình ảnh & UI', 'Hạn chế Emoji; hình ảnh di sản chân thực', 'Đã thay thế phần lớn emoji bằng SVG; 100% ảnh cưới cổ phục và di tích Huế lấy từ Unsplash 200 OK.', 'Đạt 95% (*)'],
        ['8', 'Phân quyền & Định tuyến', 'Bảo vệ đường dẫn theo vai trò người dùng (RBAC)', 'React Router v8.4.0; phân quyền 2 tầng (user / admin) qua ProtectedRoute; chặn khách xem chi tiết.', 'Đạt 100%'],
        ['9', 'Cơ sở dữ liệu & Đám mây', 'Lưu trữ đám mây thực tế và có phương án dự phòng', 'Supabase Cloud PostgreSQL (5 bảng, RLS) kết hợp Mock Server Node.js (cổng 4000) và hạt giống dữ liệu.', 'Đạt 100%'],
        ['10', 'Kiểm thử tự động', 'Viết test định tuyến, phân quyền và validation', 'Vitest 3.0.5 + RTL: 26/26 ca kiểm thử thành công (16 test schema + 10 test routing).', 'Đạt 100%'],
        ['11', 'Triển khai trực tuyến', 'Triển khai lên môi trường Cloud có tên miền chạy thực', 'Vercel Production (https://huecungdinh.vercel.app), cấu hình vercel.json SPA Rewrite chống 404.', 'Đạt 100%']
      ],
      [500, 2000, 2500, 3800, 1000]
    ),
    createParagraph(
      '(*) Ghi chú: Ký tự ngôi sao "⭐" vẫn còn hiện diện tại nhãn lọc "⭐ Top Dịch Vụ" trong ServicesPage.tsx và một dòng mô tả trong ProcessGuidePage.tsx. Điểm này đã được ghi nhận vào danh sách điểm lệch để tiếp tục hoàn thiện.',
      { italics: true, color: COLOR_TEXT_MUTED, before: 60, after: 180 }
    ),
    createParagraph('', { pageBreakBefore: true })
  );

  // ============================================================================
  // LỜI MỞ ĐẦU & BẢN TUYÊN BỐ LIÊM CHÍNH HỌC THUẬT
  // ============================================================================
  children.push(
    createH1('LỜI MỞ ĐẦU & BẢN TUYÊN BỐ LIÊM CHÍNH HỌC THUẬT'),
    createParagraph(
      'Cố Đô Huế – kinh đô của triều đại nhà Nguyễn (1802 – 1945) – là nơi lưu giữ quần thể di tích kiến trúc cung đình đồ sộ cùng hệ thống trang phục nghi lễ mẫu mực của dân tộc Việt Nam. Trong những năm gần đây, phong trào các cặp đôi tìm về nguồn cội văn hóa, lựa chọn cổ phục hoàng cung như Áo Nhật Bình ngũ sắc hay Áo Tấc trang nghiêm để tổ chức lễ cưới và ghi lại những khoảnh khắc trọng đại tại Quần thể Di tích Cố Đô Huế (Đại Nội, Cung Diên Thọ, Điện Kiến Trung, Lăng Khải Định) đang phát triển vô cùng mạnh mẽ.'
    ),
    createParagraph(
      'Mặc dù nhu cầu thị trường rất lớn, quy trình tìm kiếm thông tin, dự toán kinh phí, đặt lịch tác nghiệp và quản lý dịch vụ cưới cổ phục tại Huế hiện nay vẫn chủ yếu diễn ra thủ công qua mạng xã hội hoặc sổ sách rời rạc. Điều này gây khó khăn cho khách hàng trong việc minh bạch chi phí và gây thất thoát, nhầm lẫn lịch trình cho các đơn vị quản lý studio.'
    ),
    createParagraph(
      'Đồ án "Huế Cung Đình – Dịch Vụ Cưới & Nhiếp Ảnh Cổ Phục Hoàng Triều" được xây dựng nhằm cung cấp giải pháp số hóa toàn diện quy trình cung ứng dịch vụ cưới di sản. Hệ thống đóng vai trò như một cầu nối số, vừa đem lại không gian trải nghiệm văn hóa hoàng gia chân thực cho khách hàng, vừa cung cấp bảng điều hành quản trị kinh doanh chuẩn mực cho ban giám đốc studio.'
    ),
    createCallout(
      'BẢN TUYÊN BỐ LIÊM CHÍNH HỌC THUẬT (ACADEMIC INTEGRITY DECLARATION)',
      'Tôi xin cam đoan rằng toàn bộ mã nguồn của dự án "Huế Cung Đình" (mã dự án: doan-fenc) được nghiên cứu, tổ chức kiến trúc và triển khai độc lập bởi sinh viên Trần Công Quý (MSSV: 2401ITA001), dưới sự định hướng chuyên môn của Thầy Dương Ngọc Duy.\n\n' +
      'Tài liệu báo cáo này được sinh tự động bằng mã nguồn kịch bản Node.js (scripts/generate_docx_report.cjs) kết hợp thư viện docx, có sử dụng công cụ Trí tuệ Nhân tạo (AI Assistant) để rà soát văn phong học thuật, đối chiếu số liệu và sắp xếp cấu trúc logic. Toàn bộ các phát biểu, số liệu và cơ chế kỹ thuật trong tài liệu đều đã được kiểm chứng trực tiếp trên mã nguồn thật của dự án.'
    ),
    createParagraph('', { before: 100, after: 100 })
  );

  // ============================================================================
  // CHƯƠNG 1: BỐI CẢNH, MỤC TIÊU VÀ BÀI TOÁN KINH DOANH
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 1: BỐI CẢNH, MỤC TIÊU VÀ BÀI TOÁN KINH DOANH'),
    createH2('1.1. Bối cảnh văn hóa và xu hướng nhiếp ảnh di sản Cố Đô'),
    createParagraph(
      'Nghi thức hôn lễ cung đình triều Nguyễn là sự kết tinh của tư tưởng lễ giáo Nho gia hòa quyện với tâm hồn dân tộc. Trang phục hôn lễ không đơn thuần là y phục mà là tác phẩm nghệ thuật thủ công: Áo Nhật Bình của bậc công chúa, quý tộc với hoa văn Loan Phượng thêu tay ngũ sắc; Áo Tấc tay thụng cài khuy của bậc quân tử đi kèm khăn đóng trang nhã. Việc đưa cổ phục vào nhiếp ảnh cưới đòi hỏi sự am hiểu sâu sắc về bối cảnh không gian di sản, ánh sáng và phép tắc cổ truyền.'
    ),
    createH2('1.2. Khảo sát thực trạng và các bất cập của quy trình truyền thống'),
    createParagraph(
      'Qua khảo sát thực tế tại các studio cưới tại thành phố Huế, quy trình vận hành truyền thống bộc lộ bốn điểm nghẽn chính:'
    ),
    createBullet('Thông tin phân mảnh: Khách hàng không nắm được giá thuê cổ phục, phí cấp phép quay chụp tại Đại Nội và công xá thợ ảnh, dẫn đến tâm lý lo sợ phát sinh chi phí.', 'Về phía khách hàng:'),
    createBullet('Thiếu công cụ dự toán: Các cặp đôi không có phương tiện tính toán xem với mức ngân sách hiện có (ví dụ 25–40 triệu đồng) thì nên chọn gói chụp nào là cân đối nhất.', 'Về phía khách hàng:'),
    createBullet('Quản lý thủ công bằng sổ sách hoặc tin nhắn Zalo: Dễ gây sót lịch chụp tại các di tích đã xin phép Sở Du lịch, khó kiểm soát trạng thái đặt cọc của từng hợp đồng.', 'Về phía studio:'),
    createBullet('Thiếu báo cáo tài chính trực quan: Người điều hành studio không có bảng thống kê doanh thu kỳ vọng, hợp đồng thành công và tỷ lệ chốt đơn theo thời gian thực.', 'Về phía studio:'),
    createH2('1.3. Mục tiêu chuyển đổi số và giải pháp nền tảng "Huế Cung Đình"'),
    createParagraph(
      'Dự án đặt ra mục tiêu xây dựng một nền tảng web thương mại điện tử kết hợp quản trị dịch vụ chuyên nghiệp, bao gồm các giải pháp trọng tâm:'
    ),
    createBullet('Số hóa toàn diện danh mục 18 dịch vụ cưới lẻ và 9 gói cưới combo hoàng gia.'),
    createBullet('Cung cấp công cụ AI Tư Vấn Hôn Lễ giúp tính toán cân đối ngân sách trong khoảng 10 đến 60 triệu đồng.'),
    createBullet('Kho 6 mẫu thiệp cưới điện tử tích hợp trình phát Nhã Nhạc Cung Đình và tạo mã VietQR mừng cưới.'),
    createBullet('Quy trình đặt lịch hoàng gia với bộ chọn địa danh di sản tùy biến (Royal Custom Dropdown) và chính sách đặt cọc 20% qua VietQR.'),
    createBullet('Cung cấp trang quản lý đơn cá nhân cho phép khách hàng tra cứu tiến độ, bổ sung ghi chú và xuất hợp đồng in A4.'),
    createBullet('Bảng điều hành quản trị Studio (Admin Dashboard) hiển thị các chỉ số kinh doanh, biểu đồ SVG và bảng Kanban xử lý đơn yêu cầu.'),
    createBullet('Cẩm nang Vận hành & Quy trình Nghiệp vụ (SOP) chuẩn hóa 6 quy trình nghiệp vụ và 4 vai trò nhân sự dành riêng cho Quản trị viên.'),
    createChapterSummary(
      'Chương 1 đã làm rõ bối cảnh phục hưng cổ phục triều Nguyễn và chỉ ra các bất cập lớn trong quy trình vận hành dịch vụ cưới truyền thống tại Huế. Từ đó, dự án xác lập 7 mục tiêu chuyển đổi số trọng tâm, định hình nền tảng "Huế Cung Đình" vừa mang tính thẩm mỹ văn hóa vừa đáp ứng tiêu chuẩn kỹ thuật phần mềm hiện đại.'
    )
  );

  // ============================================================================
  // CHƯƠNG 2: NGĂN XẾP CÔNG NGHỆ & CÁC RÀNG BUỘC KỸ THUẬT KHẮT KHE
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 2: NGĂN XẾP CÔNG NGHỆ & CÁC RÀNG BUỘC KỸ THUẬT KHẮT KHE'),
    createH2('2.1. Danh mục công nghệ chính (Tech Stack)'),
    createParagraph(
      'Toàn bộ ngăn xếp công nghệ được lựa chọn theo tiêu chí hiện đại, độc lập và tối ưu hóa hiệu năng tối đa:'
    ),
    ...createTable(
      'Bảng 3: Chi tiết danh mục công nghệ và phiên bản phần mềm sử dụng trong dự án',
      'package.json của dự án doan-fenc',
      ['STT', 'Hạng Mục Công Nghệ', 'Thư Viện / Nền Tảng', 'Phiên Bản', 'Mục Đích Sử Dụng Trong Hệ Thống'],
      [
        ['1', 'Core UI Framework', 'React (Function Components & Hooks)', '^19.0.0', 'Xây dựng giao diện người dùng theo mô hình hướng thành phần (Component-based).'],
        ['2', 'Công cụ đóng gói (Bundler)', 'Vite', '^6.1.0', 'Môi trường phát triển cực nhanh với HMR tức thời và tối ưu hóa gói xuất bản production.'],
        ['3', 'Ngôn ngữ lập trình', 'TypeScript (bật strict: true)', '^5.7.3', 'Đảm bảo Type-Safety 100%, kiểm soát chặt chẽ kiểu dữ liệu từ mã nguồn.'],
        ['4', 'Bộ định tuyến (Routing)', 'React Router (Import "react-router")', '^8.4.0', 'Quản lý 21 tuyến đường, hỗ trợ bảo vệ tuyến bằng ProtectedRoute và điều hướng an toàn.'],
        ['5', 'Quản lý trạng thái (State)', 'Zustand (kèm middleware persist)', '^5.0.0', 'Quản lý giỏ hàng cưới, tự động đồng bộ hóa dữ liệu vào localStorage.'],
        ['6', 'Kiểm thực dữ liệu (Validation)', 'Zod', '^3.24.2 || ^4.0.0', 'Xác thực schema đầu vào form, kiểm tra tính toàn vẹn dữ liệu từ API.'],
        ['7', 'Kiểu dáng giao diện (Styling)', 'Pure CSS (CSS Variables, Flexbox, Grid)', 'Native CSS', '100% tự viết CSS thuần trong variables.css và globals.css; không dùng Tailwind hay UI libs.'],
        ['8', 'Đồ họa & Biểu đồ', 'Pure SVG Components', 'Native SVG', 'Tự vẽ toàn bộ biểu tượng và tự tính toán tọa độ biểu đồ cột, biểu đồ tròn, sparklines.'],
        ['9', 'Cơ sở dữ liệu Đám mây', 'Supabase Cloud (PostgreSQL)', '^2.118.0', 'Hệ quản trị CSDL quan hệ 5 bảng, phân quyền an ninh cấp hàng (RLS).'],
        ['10', 'Máy chủ API Dự phòng', 'Node.js Core HTTP Module (server/api.cjs)', 'Node >= 18', 'Máy chủ RESTful API thuần không dùng Express, phục vụ chạy offline trên cổng 4000.'],
        ['11', 'Framework kiểm thử', 'Vitest + @testing-library/react', '^3.0.5', 'Chạy 26 ca kiểm thử tự động cho hệ thống định tuyến, phân quyền và validation schema.'],
        ['12', 'Môi trường triển khai', 'Vercel Edge Platform', 'Cloud Edge', 'Triển khai liên tục (CI/CD) từ GitHub, cấu hình vercel.json SPA Rewrite 404.']
      ],
      [500, 2000, 2600, 1400, 3500]
    ),
    createH2('2.2. Các quy định cấm kỵ bắt buộc (AGENTS.md Constraints)'),
    createParagraph(
      'Theo quy chuẩn của học phần và tài liệu AGENTS.md, dự án tuân thủ nghiêm ngặt các điều cấm sau:'
    ),
    createBullet('CẤM tuyệt đối sử dụng Tailwind CSS, Bootstrap, Material UI, Ant Design hoặc bất kỳ thư viện giao diện bên ngoài nào. 100% giao diện được viết bằng CSS thuần túy.'),
    createBullet('CẤM các thư viện Icon bên ngoài (FontAwesome, Lucide, React-Icons). Toàn bộ biểu tượng được vẽ bằng React SVG Component thủ công tại src/components/common/Icon.tsx.'),
    createBullet('Hạn chế tối đa Emoji trong giao diện chính thức. Sử dụng biểu tượng SVG hoàng triều tinh xảo hoặc ký tự văn bản chuẩn mực.'),
    createBullet('CẤM sử dụng kiểu dữ liệu "any" hoặc ép kiểu mù quáng "as". Mọi kiểu dữ liệu nghiệp vụ phải được suy diễn từ Zod Schema (z.infer).'),
    createBullet('CẤM thư viện Redux Toolkit hoặc các thư viện quản lý trạng thái nặng nề. Dự án chỉ sử dụng Zustand v5 cho giỏ hàng và React Context cho Theme & Auth.'),
    createBullet('CẤM hardcode URL bí mật hoặc API keys. Sử dụng biến môi trường chuẩn Vite (import.meta.env).'),
    createBullet('CẤM để lại các lệnh console.log trong mã nguồn xuất bản.'),
    createBullet('CẤM các thư viện biểu đồ ngoài (Chart.js, Recharts, ApexCharts). Toàn bộ biểu đồ cột, biểu đồ tròn và đường sóng sparklines đều được tự tính toán hình học SVG.'),
    createH2('2.3. Kiểm soát luồng bất đồng bộ: Mẫu Discriminated Union AsyncState'),
    createParagraph(
      'Để loại bỏ hoàn toàn các lỗi trạng thái bất định (như vừa hiển thị cờ loading vừa có dữ liệu lỗi), toàn bộ các thao tác bất đồng bộ trong dự án đều tuân thủ mẫu Discriminated Union được khai báo tại src/lib/types.ts:'
    ),
    createCallout(
      'KHAI BÁO ASYNCSTATE TRONG MÃ NGUỒN (src/lib/types.ts)',
      'export type AsyncState<T> =\n' +
      '  | { status: "loading" }\n' +
      '  | { status: "error"; message: string }\n' +
      '  | { status: "success"; data: T };\n\n' +
      'Khi kết xuất giao diện, lập trình viên bắt buộc sử dụng cấu trúc switch-case kèm nhánh vét cạn assertNever(state) để đảm bảo trình biên dịch TypeScript kiểm tra toàn bộ các trường hợp có thể xảy ra.'
    ),
    createChapterSummary(
      'Chương 2 đã thiết lập danh mục công nghệ cốt lõi với React 19, TypeScript strict và Vite 6, đồng thời khẳng định việc tuân thủ 8 điều cấm kỹ thuật theo quy định AGENTS.md. Cơ chế xử lý bất đồng bộ thông qua Discriminated Union AsyncState đảm bảo ứng dụng không phát sinh lỗi trạng thái bất định.'
    )
  );

  // ============================================================================
  // CHƯƠNG 3: KIẾN TRÚC MÃ NGUỒN FEATURE-BASED & CẤU TRÚC THƯ MỤC
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 3: KIẾN TRÚC MÃ NGUỒN FEATURE-BASED & CẤU TRÚC DỰ ÁN'),
    createH2('3.1. Nguyên tắc thiết kế phụ thuộc một chiều'),
    createParagraph(
      'Dự án áp dụng mô hình Feature-Based Architecture (Kiến trúc đóng gói theo phân hệ nghiệp vụ). Mỗi thư mục chức năng bên trong src/features/ chứa đầy đủ các component, hook, type và schema liên quan đến nghiệp vụ đó. Toàn bộ mã nguồn tuân thủ nghiêm ngặt quy tắc phụ thuộc một chiều:'
    ),
    createCallout(
      'LUỒNG PHỤ THUỘC MỘT CHIỀU (ONE-WAY DEPENDENCY RULE)',
      'src/app  ➔  src/pages  ➔  src/features  ➔  src/components  ➔  src/context / src/lib / src/styles\n\n' +
      'Tầng cấp dưới tuyệt đối không được phép import ngược lên tầng cấp trên. Các feature độc lập không import chéo nhau mà giao tiếp thông qua tầng lib dùng chung hoặc props, ngăn chặn hoàn toàn lỗi phụ thuộc vòng (Circular Dependency).'
    ),
    createH2('3.2. Cấu trúc thư mục dự án chuẩn hóa'),
    createParagraph(
      'Hệ thống gồm 20 component trang (15 trang cho phân hệ khách hàng và 5 trang cho phân hệ quản trị), phục vụ 21 tuyến đường định tuyến chuẩn mực:'
    ),
    ...createTable(
      'Bảng 4: Phân tầng trách nhiệm và cấu trúc thư mục chi tiết của dự án',
      'Khảo sát cây thư mục src/ trong mã nguồn thực tế',
      ['Thư Mục / Tệp Tin', 'Tầng Trách Nhiệm', 'Mô Tả Chức Năng & Danh Sách Thành Phần'],
      [
        ['src/app/', 'Tầng Khởi Tạo', 'Chứa App.tsx, RootLayout.tsx, AdminLayout.tsx, routes.tsx định tuyến React Router v8 và main.tsx.'],
        ['src/pages/', 'Tầng Trang Khách Hàng (15 Components)', 'Chứa 15 trang: HomePage, ServicesPage, ServiceDetailPage, PackagesPage, PackageDetailPage, ConsultationPage, InvitationsPage, InvitationDetailPage, InvitationCustomPage, CartPage, MyBookingsPage, BookingPage, ProcessGuidePage, LoginPage, NotFoundPage.'],
        ['src/pages/admin/', 'Tầng Trang Quản Trị (5 Components)', 'Chứa 5 trang: AdminDashboardPage, AdminServicesPage, AdminPackagesPage, AdminRequestsPage, AdminUsersPage.'],
        ['src/features/home/', 'Feature Trang Chủ', 'Chứa HeroSection, HomeSections, FeaturedPackagesMarquee, CustomerTestimonialsSection.'],
        ['src/features/services/', 'Feature Dịch Vụ Lẻ', 'Logic lọc danh mục, sắp xếp giá, ServiceCard, ServiceDetail và tương tác giỏ hàng.'],
        ['src/features/packages/', 'Feature Gói Cưới', 'Lưới combo hoàng triều, modal xem nhanh thành phần (QuickViewServiceModal), Zustand cartStore.'],
        ['src/features/consultation/', 'Feature AI Tư Vấn', 'Form nhập tiêu chí, thanh trượt ngân sách 10–60 triệu và thuật toán client-side cân đối chi phí.'],
        ['src/features/invitations/', 'Feature Thiệp Cưới', 'Kho 6 thiệp cưới, trình phát Nhã Nhạc Web Audio API (RoyalCourtAudio), modal xem thiệp và Dynamic VietQR.'],
        ['src/features/requests/', 'Feature Quản Lý Đơn', 'Bảng đơn tư vấn, Kanban 4 cột tiến độ, và modal Hợp đồng A4 pháp lý (RoyalContractA4Modal).'],
        ['src/features/admin/', 'Feature Thống Kê', 'Biểu đồ Cột kép SVG, Biểu đồ Donut SVG, 4 thẻ Sparklines SVG và live visitor counter.'],
        ['src/features/auth/', 'Feature Xác Thực', 'AuthContext, useAuth hook, ProtectedRoute kiểm soát phân quyền 2 tầng tinh gọn (user / admin).'],
        ['src/components/common/', 'UI Reusable Dùng Chung', 'Icon.tsx (Pure SVG), UI.tsx (Button, Input, Skeleton), Modal.tsx, Toast.tsx, FloatingContactWidget.tsx.'],
        ['src/components/layout/', 'Layout Reusable', 'Header.tsx (điều hướng, chuyển theme, giỏ hàng, menu người dùng), Footer.tsx hoàng triều.'],
        ['src/context/', 'Context Toàn Cục', 'ThemeContext.tsx quản lý chế độ Sáng / Tối lưu trữ trong localStorage và gán data-theme lên thẻ html.'],
        ['src/lib/', 'Thư Viện Tiện Ích', 'Zod schemas, formatters.ts, supabaseAdapter.ts, useFetch.ts, toastStore.ts, types.ts.'],
        ['src/styles/', 'Hệ Thống Phong Cách', 'variables.css (Design Tokens), globals.css (Reset, typography, overflow-x: clip).']
      ],
      [2200, 2200, 5600]
    ),
    createH2('3.3. Xử lý ngoại lệ có cấu trúc với AppError'),
    createParagraph(
      'Mọi lỗi phát sinh trong quá trình gọi API hoặc xử lý nghiệp vụ đều được chuẩn hóa qua lớp AppError (khai báo tại src/lib/types.ts), bao gồm thông điệp thân thiện (message), mã lỗi nghiệp vụ (code) và mã trạng thái HTTP (status). Ứng dụng không để lỗi văng ra màn hình trắng mà thông báo lịch sự qua toastStore hoặc ErrorBox UI.'
    ),
    createChapterSummary(
      'Chương 3 đã làm rõ kiến trúc Feature-Based với quy tắc phụ thuộc một chiều, phân bổ rõ ràng trách nhiệm giữa 20 component trang và các phân hệ nghiệp vụ độc lập. Cấu trúc này giúp dự án dễ bảo trì, ngăn ngừa lỗi phụ thuộc vòng và tạo điều kiện thuận lợi cho việc kiểm thử tự động.'
    )
  );

  // ============================================================================
  // CHƯƠNG 4: BẢN ĐỒ ĐỊNH TUYẾN 21 ROUTES & PHÂN QUYỀN 2-TIER RBAC
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 4: BẢN ĐỒ ĐỊNH TUYẾN 21 ROUTES & PHÂN QUYỀN 2-TIER RBAC'),
    createH2('4.1. Ma trận phân quyền 3 nhóm người dùng (Guest / User / Admin)'),
    createParagraph(
      'Hệ thống áp dụng mô hình phân quyền 2 cấp độ tinh gọn (2-Tier RBAC) kết hợp nhận diện khách vãng lai:'
    ),
    createBullet('Khách vãng lai (Guest - Chưa đăng nhập): Chỉ có quyền xem các trang thông tin công khai gồm Trang chủ (/), Danh sách dịch vụ lẻ (/dich-vu), Danh sách gói cưới (/goi-cuoi), Kho thiệp cưới (/thiep-cuoi) và AI tư vấn (/tu-van). Khi cố tình bấm xem chi tiết, thêm dịch vụ vào giỏ hàng, đặt lịch hoặc vào đơn cá nhân, hệ thống sẽ tự động chuyển hướng về trang /login.', 'Nhóm 1:'),
    createBullet('Khách hàng đã đăng nhập (User - Tài khoản: khachhang / 123456): Được phép xem chi tiết từng dịch vụ, chi tiết gói cưới, thêm hạng mục vào giỏ hàng, đặt lịch với Royal Custom Dropdown, tạo thiệp cưới online và quản lý đơn yêu cầu cá nhân tại /don-cua-toi. Khách hàng thông thường KHÔNG nhìn thấy mục "Quy trình" và bị chặn hoàn toàn khi cố truy cập /admin/*.', 'Nhóm 2:'),
    createBullet('Quản trị viên Hoàng Triều (Super Admin - Tài khoản: admin / 123456): Toàn quyền truy cập mọi phân hệ, độc quyền quản trị tại /admin (Dashboard KPI Corbel SaaS, CRUD dịch vụ, CRUD gói cưới, Kanban duyệt đơn, Quản lý tài khoản) và độc quyền truy cập Cẩm nang SOP tại /quy-trinh.', 'Nhóm 3:'),
    createH2('4.2. Bảng kê chi tiết 21 Tuyến đường trong hệ thống'),
    createParagraph(
      'Dưới đây là danh sách toàn bộ 21 tuyến đường được cấu hình trong src/app/routes.tsx:'
    ),
    ...createTable(
      'Bảng 5: Bản đồ chi tiết 21 tuyến đường (Routes) và ma trận phân quyền',
      'src/app/routes.tsx của dự án doan-fenc',
      ['STT', 'Đường Dẫn (Path)', 'Component Phụ Trách', 'Quyền Hạn Truy Cập', 'Layout', 'Mô Tả Chức Năng Chính'],
      [
        ['1', '/', 'HomePage', 'Công khai (Public)', 'RootLayout', 'Hero banner, Marquee combo chạy tự động, form tư vấn nhanh.'],
        ['2', '/dich-vu', 'ServicesPage', 'Công khai (Public)', 'RootLayout', 'Danh mục 18 dịch vụ lẻ, bộ lọc danh mục, sắp xếp đơn giá.'],
        ['3', '/dich-vu/:id', 'ServiceDetailPage', 'Bảo vệ (user / admin)', 'RootLayout', 'Chi tiết dịch vụ cổ phục, ảnh HD, stepper số lượng, thêm giỏ (chặn guest).'],
        ['4', '/goi-cuoi', 'PackagesPage', 'Công khai (Public)', 'RootLayout', 'Lưới 9 gói cưới combo cung đình, huy hiệu Top Đặt Nhiều, lọc phong cách.'],
        ['5', '/goi-cuoi/:id', 'PackageDetailPage', 'Bảo vệ (user / admin)', 'RootLayout', 'Chi tiết gói chụp, đặc quyền 8h Đại Nội, modal xem nhanh dịch vụ, báo giá nhanh.'],
        ['6', '/thiep-cuoi', 'InvitationsPage', 'Công khai (Public)', 'RootLayout', 'Kho 6 mẫu thiệp điện tử smartphone, bảng giá VIP/PRO/BASIC, mừng cưới VietQR.'],
        ['7', '/thiep-cuoi/:id', 'InvitationDetailPage', 'Bảo vệ (user / admin)', 'RootLayout', 'Chi tiết thiệp, phát Nhã Nhạc ngũ cung, đếm ngược ngày cưới, gửi lời chúc.'],
        ['8', '/thiep-cuoi/dang-ky', 'InvitationCustomPage', 'Bảo vệ (user / admin)', 'RootLayout', 'Tự tạo thiệp 2 cột: Cột phải nhập liệu, cột trái preview thiệp + VietQR động.'],
        ['9', '/thiep-cuoi/tuy-bien', 'InvitationCustomPage', 'Bảo vệ (user / admin)', 'RootLayout', 'Tuyến bí danh (alias) đồng bộ từ trang chi tiết thiệp cưới.'],
        ['10', '/dat-lich', 'BookingPage', 'Bảo vệ (user / admin)', 'RootLayout', 'Đặt lịch hoàng gia với Royal Custom Dropdown, tự động điền họ tên khách.'],
        ['11', '/tu-van', 'ConsultationPage', 'Công khai (Public)', 'RootLayout', 'AI Tư vấn ngân sách, thanh trượt responsive 10–60tr, thuật toán tối ưu.'],
        ['12', '/gio-hang', 'CartPage', 'Bảo vệ (user / admin)', 'RootLayout', 'Giỏ hàng cưới Zustand, đặt cọc 20% giữ ngày cưới qua Dynamic VietQR.'],
        ['13', '/don-cua-toi', 'MyBookingsPage', 'Bảo vệ (user / admin)', 'RootLayout', 'Quản lý đơn chụp ảnh cá nhân, bổ sung mong muốn, hủy đơn hoàn cọc, in HĐ A4.'],
        ['14', '/quy-trinh', 'ProcessGuidePage', 'Chỉ Quản trị viên (admin)', 'RootLayout', 'Cẩm nang SOP: 6 quy trình, 4 vai trò có checklist tương tác, 8 quy tắc, in A4.'],
        ['15', '/huong-dan-quy-trinh', 'ProcessGuidePage', 'Chỉ Quản trị viên (admin)', 'RootLayout', 'Tuyến định tuyến bí danh (alias) hỗ trợ truy cập nhanh cẩm nang SOP.'],
        ['16', '/login', 'LoginPage', 'Công khai (Public)', 'RootLayout', 'Cổng đăng nhập tài khoản nội bộ kèm nút chọn nhanh (Admin / Khách hàng).'],
        ['17', '/admin', 'AdminDashboardPage', 'Chỉ Quản trị viên (admin)', 'AdminLayout', 'Dashboard SaaS: Live Visitor Counter, 4 Sparklines, Bar & Donut SVG, In báo cáo.'],
        ['18', '/admin/dich-vu', 'AdminServicesPage', 'Chỉ Quản trị viên (admin)', 'AdminLayout', 'Quản trị dịch vụ lẻ (Thêm, Sửa, Xóa có Modal xác nhận an toàn).'],
        ['19', '/admin/goi-cuoi', 'AdminPackagesPage', 'Chỉ Quản trị viên (admin)', 'AdminLayout', 'Quản trị gói cưới combo (Multi-select checkbox dịch vụ thành phần).'],
        ['20', '/admin/yeu-cau', 'AdminRequestsPage', 'Chỉ Quản trị viên (admin)', 'AdminLayout', 'Quản trị đơn chụp ảnh: Bảng danh sách + Kanban 4 cột tiến độ, Xem & In HĐ A4.'],
        ['21', '/admin/tai-khoan', 'AdminUsersPage', 'Chỉ Quản trị viên (admin)', 'AdminLayout', 'Quản trị tài khoản người dùng: Khóa/mở khóa tài khoản, bảo vệ Root Admin.'],
        ['*', 'NotFoundPage', 'Công khai (Public)', 'RootLayout', 'Trang báo lỗi 404 Cung điện vắng bóng hoài niệm xứ Huế.']
      ],
      [500, 1800, 1800, 2000, 1100, 2800]
    ),
    createH2('4.3. Cơ chế bảo vệ tuyến đường bằng ProtectedRoute'),
    createParagraph(
      'Thành phần ProtectedRoute (src/features/auth/ProtectedRoute.tsx) nhận thuộc tính allowedRoles. Khi người dùng truy cập một tuyến được bảo vệ mà chưa đăng nhập hoặc không đủ quyền, component sẽ lưu lại vị trí hiện tại vào state.from và chuyển hướng tức thời về /login. Sau khi người dùng xác thực thành công, hệ thống tự động đưa họ quay trở lại đúng trang ban đầu.'
    ),
    createChapterSummary(
      'Chương 4 đã phân định rõ ràng 3 cấp độ quyền hạn truy cập (Guest, User, Admin) và lập bảng kê toàn diện 21 tuyến đường của hệ thống. Cơ chế điều hướng bảo vệ ProtectedRoute đảm bảo an toàn tuyệt đối cho khu vực dữ liệu cá nhân của khách hàng và khu vực quản trị của studio.'
    )
  );

  // ============================================================================
  // CHƯƠNG 5: ĐẶC TẢ CHI TIẾT 10 PHÂN HỆ CHỨC NĂNG CỐT LÕI
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 5: ĐẶC TẢ CHI TIẾT 10 PHÂN HỆ CHỨC NĂNG CỐT LÕI'),
    createParagraph(
      'Mỗi phân hệ chức năng dưới đây được đặc tả theo cấu trúc chuẩn 5 phần: (a) Mục đích, (b) Luồng sử dụng của người dùng, (c) Cách hệ thống xử lý bên trong, (d) Số liệu thật đã kiểm chứng từ mã nguồn, và (e) File nguồn tương ứng.'
    ),

    // 5.1. Trang Chủ
    createH2('5.1. Phân hệ 1: Trang Chủ & Giới Thiệu Di Sản Cố Đô (HomePage)'),
    createBullet('Cung cấp cổng thông tin chào đón, truyền tải giá trị thẩm mỹ cổ phục cung đình và điều hướng nhanh người dùng tới các dịch vụ trọng tâm.', '(a) Mục đích:'),
    createBullet('Người dùng truy cập trang chủ (/), quan sát banner động với khẩu hiệu xoay vòng 3 cụm từ (3,2 giây/lần) và hiệu ứng chuyển ảnh thiết bị (4,2 giây/lần). Người dùng bấm nút chính "Đặt lịch" để tới trang /dat-lich, hoặc bấm nút phụ "Khám Phá Gói Cưới" để tới /goi-cuoi. Cuộn xuống dưới để xem băng chuyền Marquee các gói cưới tiêu biểu và các bài đánh giá của khách hàng.', '(b) Luồng sử dụng:'),
    createBullet('Component HomePage nạp danh sách gói cưới qua hook useFetch("/api/goi-cuoi", goiCuoiListSchema). Dữ liệu được ưu tiên lấy từ Supabase Cloud; nếu lỗi hoặc offline sẽ fallback về Mock Server cổng 4000. HeroSection sử dụng setInterval để thay đổi khẩu hiệu và ảnh mockup. Băng chuyền FeaturedPackagesMarquee duyệt mảng gói cưới và hiển thị thẻ PackageCard.', '(c) Cách hệ thống xử lý bên trong:'),
    createBullet('Hiển thị 3 cụm từ tiêu đề xoay vòng; 3 ảnh máy tính và 3 ảnh điện thoại chuyển đổi tự động; băng chuyền nạp 9 gói cưới combo; danh sách đánh giá mẫu gồm 3 nhận xét của khách hàng.', '(d) Số liệu thật đã kiểm chứng:'),
    createBullet('src/pages/HomePage.tsx, src/features/home/components/HeroSection.tsx, HomeSections.tsx, FeaturedPackagesMarquee.tsx, CustomerTestimonialsSection.tsx.', '(e) File nguồn tương ứng:'),

    // 5.2. Dịch Vụ Lẻ
    createH2('5.2. Phân hệ 2: Danh Mục & Chi Tiết Dịch Vụ Cưới Lẻ (Services)'),
    createBullet('Cho phép khách hàng tra cứu, lọc và chọn thuê từng hạng mục riêng lẻ (áo dài, thợ ảnh, địa điểm chụp, trang trí gia tiên).', '(a) Mục đích:'),
    createBullet('Khách hàng vào /dich-vu, chọn tab danh mục (Tất Cả, Áo Dài, Thợ Ảnh, Địa Điểm, Trang Trí, ⭐ Top Dịch Vụ) hoặc chọn sắp xếp giá (Tăng dần, Giảm dần, Tên A-Z). Khi bấm "Xem Chi Tiết", nếu chưa đăng nhập hệ thống sẽ chuyển hướng về /login; nếu đã đăng nhập sẽ vào /dich-vu/:id. Tại trang chi tiết, khách xem ảnh HD, đọc mô tả, chọn số lượng qua bộ đếm (Stepper) và bấm "Thêm vào giỏ cưới". Phía dưới có danh sách 3 dịch vụ gợi ý khác để xem tiếp.', '(b) Luồng sử dụng:'),
    createBullet('ServicesPage sử dụng useSearchParams đọc tham số loai và sort từ URL, sau đó validate qua Zod schema để đảm bảo an toàn. Danh sách dịch vụ được lọc và sắp xếp bằng useMemo. Trang ServiceDetailPage kiểm tra biến isAuthenticated từ useAuth(); nếu false sẽ kích hoạt useToastStore cảnh báo và navigate sang /login kèm state.from. Thao tác thêm vào giỏ gọi hàm addItem trong Zustand cartStore.', '(c) Cách hệ thống xử lý bên trong:'),
    createBullet('Tổng cộng 18 dịch vụ cưới lẻ trong CSDL (5 áo dài, 4 thợ ảnh, 4 địa điểm, 5 trang trí); đơn giá niêm yết từ 2.500.000 đ đến 9.000.000 đ; trang chi tiết gợi ý đúng 3 dịch vụ khác bất kỳ (filter khác id và lấy slice 0..3, không lọc theo cùng loại).', '(d) Số liệu thật đã kiểm chứng:'),
    createBullet('src/pages/ServicesPage.tsx, src/pages/ServiceDetailPage.tsx, src/features/services/components/ServiceCard.tsx, src/lib/cartStore.ts.', '(e) File nguồn tương ứng:'),

    // 5.3. Gói Cưới Combo
    createH2('5.3. Phân hệ 3: Gói Cưới Combo Hoàng Gia (Packages)'),
    createBullet('Giúp khách hàng lựa chọn các gói chụp trọn gói tiết kiệm chi phí, đồng thời hỗ trợ đàm phán báo giá linh hoạt.', '(a) Mục đích:'),
    createBullet('Khách hàng vào /goi-cuoi, lọc theo phong cách (Cung Đình, Cổ Điển, Hiện Đại). Khi bấm "Xem Chi Tiết", hệ thống yêu cầu đăng nhập trước khi vào /goi-cuoi/:id. Tại trang chi tiết, khách xem danh sách dịch vụ con được bao gồm; có thể bấm vào từng dịch vụ để mở modal xem nhanh (QuickViewServiceModal). Khách hàng có thể bấm "Đặt Lịch Gói Này" để chuyển sang /dat-lich?goi=..., bấm "Thêm Vào Giỏ Dịch Vụ", hoặc bấm "Nhận Báo Giá Nhanh" để mở hộp thoại tích chọn/bỏ bớt dịch vụ và gửi yêu cầu đàm phán.', '(b) Luồng sử dụng:'),
    createBullet('PackagesPage gọi API /api/goi-cuoi và xác thực bằng goiCuoiListSchema. Trang PackageDetailPage nhận param :id, fetch thông tin gói cưới và nạp đồng thời toàn bộ danh mục dịch vụ lẻ để đối chiếu tên và đơn giá của các ID nằm trong danhSachDichVuIds. Modal báo giá nhanh sử dụng local state quản lý mảng dịch vụ được chọn và gửi POST về bảng yeu_cau.', '(c) Cách hệ thống xử lý bên trong:'),
    createBullet('Tổng số 9 gói cưới combo (4 cung đình, 2 hiện đại, 3 cổ điển); giá trọn gói từ 15.900.000 đ đến 38.500.000 đ; mỗi gói bao gồm từ 3 đến 6 dịch vụ lẻ thành phần.', '(d) Số liệu thật đã kiểm chứng:'),
    createBullet('src/pages/PackagesPage.tsx, src/pages/PackageDetailPage.tsx, src/features/packages/components/PackageCard.tsx, QuickViewServiceModal.tsx.', '(e) File nguồn tương ứng:'),

    // 5.4. Đặt Lịch Hoàng Gia
    createH2('5.4. Phân hệ 4: Đặt Lịch Hoàng Gia với Royal Custom Dropdown (Booking)'),
    createBullet('Cung cấp biểu mẫu khởi tạo lịch trình trải nghiệm cổ phục và chụp ảnh tại các di tích Cố Đô Huế cho khách hàng đã đăng nhập.', '(a) Mục đích:'),
    createBullet('Khách hàng truy cập /dat-lich. Hệ thống tự động điền họ tên khách hàng từ tài khoản vào ô "Họ tên người đăng ký". Khách hàng nhập số điện thoại, tên chú rể, tên cô dâu, ngày chụp ảnh và ngày cưới. Tại hai mục "Địa điểm chụp di sản" và "Gói combo hoàng gia", khách hàng nhấn vào để mở menu dropdown hoàng triều tùy biến, quan sát các huy hiệu di sản, mô tả ngắn và đơn giá niêm yết, sau đó chọn mục ưng ý. Nhập ghi chú dặn dò và nhấn "Khởi Tạo Hồ Sơ Đặt Lịch".', '(b) Luồng sử dụng:'),
    createBullet('BookingPage được bảo vệ bởi ProtectedRoute allowedRoles={["admin", "user"]}. Tên khách được khởi tạo từ user?.ten, số điện thoại để trống. Hai menu chọn lọc sử dụng state openDropdown kết hợp hook useEffect lắng nghe sự kiện mousedown để đóng dropdown khi người dùng nhấn chuột ra ngoài (Click Outside). Dữ liệu gửi đi được kiểm thực bằng taoYeuCauInputSchema (Zod); nếu hợp lệ sẽ gọi SupabaseService.createRequest và fallback về POST /api/yeu-cau.', '(c) Cách hệ thống xử lý bên trong:'),
    createBullet('Menu địa điểm cung cấp 4 danh thắng di sản cố định; menu gói cưới cung cấp 4 gói combo tiêu biểu (giá từ 15.900.000 đ đến 38.500.000 đ); Zod schema kiểm tra số điện thoại chuẩn Việt Nam (bắt đầu bằng số 0, đủ 10 chữ số).', '(d) Số liệu thật đã kiểm chứng:'),
    createBullet('src/pages/BookingPage.tsx, src/pages/BookingPage.css, src/features/requests/types.ts.', '(e) File nguồn tương ứng:'),

    // 5.5. AI Tư Vấn
    createH2('5.5. Phân hệ 5: AI Tư Vấn Hôn Lễ Hoàng Triều (Consultation)'),
    createBullet('Hỗ trợ các cặp đôi dự trù ngân sách, tính toán mức chênh lệch thừa/thiếu và đề xuất gói cưới cùng dịch vụ nâng cấp phù hợp.', '(a) Mục đích:'),
    createBullet('Người dùng truy cập /tu-van, chọn địa điểm chụp di sản (4 lựa chọn), chọn số lượng cổ phục (1, 2, hoặc 3 bộ), chọn hình thức quay chụp (Ngoại Cảnh Di Sản hoặc Cung Điện Nội Bộ), và kéo thanh trượt ngân sách từ 10 đến 60 triệu đồng. Nhấn nút "AI Gợi Ý Gói Cưới Tối Ưu". Kết quả hiển thị ngay bên cạnh gồm: Banner báo dư ngân sách hoặc cần cân đối thêm, thẻ gói cưới tối ưu nhất, và danh sách dịch vụ nâng cấp khuyến nghị.', '(b) Luồng sử dụng:'),
    createBullet('Form nhập liệu nằm trong ConsultationCriteriaForm, thanh trượt sử dụng input type="range" với min={10000000}, max={60000000}, step={1000000}. Khi nhấn submit, hàm handleCalculate gửi POST về /api/tu-van/tinh-toan hoặc tính toán trực tiếp client-side: Thuật toán so khớp gói cưới có giá gần nhất với ngân sách nhưng không vượt quá ngân sách (hoặc gói nhỏ nhất nếu ngân sách thấp), tính số tiền chênh lệch (chenhLech = nganSach - goiDeXuat.giaTronGoi), và lọc ra tối đa 3 dịch vụ lẻ có giá nhỏ hơn số tiền dư để gợi ý thêm. Kết quả hiển thị qua ConsultationResultBox (lưu ý: không có nút chuyển thành đơn đăng ký trong component này).', '(c) Cách hệ thống xử lý bên trong:'),
    createBullet('Khoảng giá thanh trượt từ 10.000.000 đ đến 60.000.000 đ; gợi ý tối đa 3 dịch vụ lẻ nâng cấp trong phạm vi số tiền dư; 4 tùy chọn địa điểm và 3 mốc số lượng trang phục.', '(d) Số liệu thật đã kiểm chứng:'),
    createBullet('src/pages/ConsultationPage.tsx, src/features/consultation/components/ConsultationWidgets.tsx, src/features/consultation/types.ts.', '(e) File nguồn tương ứng:'),

    // 5.6. Thiệp Cưới Điện Tử
    createH2('5.6. Phân hệ 6: Kho Mẫu Thiệp Cưới Điện Tử & Tùy Biến Trực Tuyến (Invitations)'),
    createBullet('Cung cấp kho mẫu thiệp cưới phong cách hoàng gia, cho phép xem thử giao diện di động, nghe Nhã Nhạc và tạo thiệp cưới cá nhân hóa.', '(a) Mục đích:'),
    createBullet('Khách hàng vào /thiep-cuoi xem danh sách 6 mẫu thiệp. Bấm "Mở Xem Thiệp" để kích hoạt modal mô phỏng điện thoại: Chạm vào phong bì để mở thiệp, nghe Nhã Nhạc Cung Đình, xem đồng hồ đếm ngược và bấm xem mã VietQR mừng cưới. Bấm "Khởi Tạo Mẫu Thiệp" (yêu cầu đăng nhập) để vào trang /thiep-cuoi/dang-ky: Cột phải nhập tên gia đình, ngày giờ âm/dương lịch, số tài khoản; cột trái xem trước giao diện thiệp và mã VietQR cập nhật theo thời gian thực.', '(b) Luồng sử dụng:'),
    createBullet('InvitationPreviewModal tích hợp hook useRoyalCourtAudio phát nhạc ngũ cung qua Web Audio API không cần file mp3. Đồng hồ đếm ngược trong modal hiển thị các con số cố định (28 ngày, 12 giờ, 30 phút, 45 giây). Mã VietQR mừng cưới trong modal xem thiệp dùng ảnh cố định ngân hàng MB (tài khoản 0905123456). Tại trang InvitationCustomPage, mã VietQR được tạo động qua useMemo với BIN ngân hàng khóa cứng 970422 (MB Bank), số tài khoản lấy từ form nhập liệu và số tiền cố định 500.000 đ. Form đăng ký được xác thực bằng datThiepFormSchema và lưu vào bảng yeu_cau.', '(c) Cách hệ thống xử lý bên trong:'),
    createBullet('Kho gồm 6 mẫu thiệp cưới (2 VIP, 2 PRO, 2 Basic); giá khởi tạo từ 168.000 đ đến 450.000 đ; 4 bản nhạc Nhã Nhạc Cung Đình; danh xưng gia đình gồm 6 thứ bậc chú rể và 6 thứ bậc cô dâu.', '(d) Số liệu thật đã kiểm chứng:'),
    createBullet('src/pages/InvitationsPage.tsx, src/pages/InvitationDetailPage.tsx, src/pages/InvitationCustomPage.tsx, src/features/invitations/components/InvitationModals.tsx, RoyalCourtAudio.tsx.', '(e) File nguồn tương ứng:'),

    // 5.7. Giỏ Hàng & Đặt Cọc 20%
    createH2('5.7. Phân hệ 7: Giỏ Hàng & Đặt Cọc Giữ Ngày Cưới Qua Dynamic VietQR (Cart)'),
    createBullet('Quản lý các dịch vụ và gói cưới khách hàng đã chọn, tính toán số tiền đặt cọc 20% và khởi tạo mã thanh toán VietQR chuyển khoản.', '(a) Mục đích:'),
    createBullet('Khách hàng nhấn biểu tượng giỏ hàng trên Header để mở ngăn kéo CartDrawer hoặc vào trang /gio-hang. Khách điều chỉnh số lượng hoặc xóa món, sau đó bấm "Tiến Hành Đặt Lịch". Trong hộp thoại checkout, khách nhập thông tin liên hệ, tích chọn "Đặt cọc trước 20% qua VietQR", quét mã QR hiển thị trên màn hình để chuyển khoản qua ứng dụng ngân hàng, và bấm "Xác Nhận Đặt Lịch". Hộp thoại xác nhận thứ hai xuất hiện để khách rà soát lần cuối trước khi hoàn tất.', '(b) Luồng sử dụng:'),
    createBullet('Trạng thái giỏ hàng được quản lý bởi Zustand cartStore (lưu trữ trong localStorage qua persist middleware). Khi khách tích chọn đặt cọc, hệ thống tính depositAmount = Math.round(totalPrice * 0.2). Ảnh VietQR được nạp từ img.vietqr.io với tài khoản MB Bank 0905123456 và nội dung addInfo = "Dat coc " + tenKhach. Dữ liệu đơn được kiểm thực qua cartCheckoutSchema và gửi lên Supabase qua SupabaseService.createRequest kèm mảng danhSachDichVuChiTiet.', '(c) Cách hệ thống xử lý bên trong:'),
    createBullet('Tỷ lệ đặt cọc tính chính xác 20% tổng giá trị đơn hàng; flash message hiển thị tự động tắt sau 5 giây; hỗ trợ phím Escape để đóng nhanh giỏ hàng.', '(d) Số liệu thật đã kiểm chứng:'),
    createBullet('src/pages/CartPage.tsx, src/components/common/CartDrawer.tsx, src/lib/cartStore.ts, src/features/requests/types.ts.', '(e) File nguồn tương ứng:'),

    // 5.8. Quản Lý Đơn Cá Nhân & In Hợp Đồng A4
    createH2('5.8. Phân hệ 8: Quản Lý Đơn Yêu Cầu Cá Nhân & Xuất Hợp Đồng A4 (MyBookings)'),
    createBullet('Cung cấp cổng thông tin cho khách hàng tra cứu tiến độ đơn, bổ sung mong muốn chụp ảnh, hủy đơn hoàn cọc và in hợp đồng dịch vụ A4.', '(a) Mục đích:'),
    createBullet('Khách hàng vào /don-cua-toi, xem danh sách các đơn đã đặt của mình. Khách có thể lọc theo tab trạng thái (Chờ Duyệt, Đã Duyệt, Đã Liên Hệ, Hoàn Tất, Đã Hủy) hoặc tìm kiếm theo số điện thoại/mã đơn. Bấm "Chi Tiết" để xem nội dung và gõ bổ sung mong muốn chụp ảnh. Nếu đơn ở trạng thái "Chờ duyệt", khách có thể bấm "Hủy Đơn" để xem số tiền hoàn cọc. Nếu đơn ở trạng thái "Đã duyệt", nút "In HĐ A4" xuất hiện, cho phép mở và in hợp đồng dịch vụ chuẩn pháp lý.', '(b) Luồng sử dụng:'),
    createBullet('MyBookingsPage nạp toàn bộ danh sách đơn qua useFetch("/api/yeu-cau") và thực hiện lọc phía Client (so khớp họ tên hoặc số điện thoại của user đang đăng nhập). Thuật toán calculateRefundPolicy tính toán hoàn cọc dựa trên khoảng cách giữa ngày hiện tại và ngày chụp: Trước >= 15 ngày hoàn 100%, từ 7–14 ngày hoàn 50%, dưới 7 ngày không hoàn cọc. Modal RoyalContractA4Modal kết xuất văn bản hợp đồng đầy đủ căn cứ pháp lý và hỗ trợ in ấn qua window.print() với CSS @media print chuyên biệt.', '(c) Cách hệ thống xử lý bên trong:'),
    createBullet('Hiển thị 6 tab trạng thái; chính sách hoàn cọc 3 tầng thời gian (15 ngày / 7–14 ngày / <7 ngày); hợp đồng khổ A4 tích hợp dấu đỏ điện tử và điều khoản chi tiết.', '(d) Số liệu thật đã kiểm chứng:'),
    createBullet('src/pages/MyBookingsPage.tsx, src/features/requests/components/RoyalContractA4Modal.tsx, src/lib/formatters.ts.', '(e) File nguồn tương ứng:'),

    // 5.9. Cẩm Nang Vận Hành & SOP
    createH2('5.9. Phân hệ 9: Cẩm Nang Vận Hành & Quy Trình Nghiệp Vụ Chuẩn (SOP)'),
    createBullet('Tài liệu hóa toàn bộ quy trình tác nghiệp nội bộ và hướng dẫn sử dụng phần mềm dành riêng cho Quản trị viên studio.', '(a) Mục đích:'),
    createBullet('Quản trị viên đăng nhập tài khoản admin, mở menu người dùng trên Header và chọn "Hướng Dẫn & Quy Trình" (hoặc truy cập /quy-trinh). Quản trị viên duyệt 4 tab chính: Quy trình (SOP), Theo vai trò nhân sự, Theo phân hệ, và Quy tắc nghiệp vụ. Tại tab vai trò, quản trị viên có thể bấm tích vào từng mục checklist công việc trong ngày. Có thể nhấn nút "In Tài Liệu" để in toàn bộ cẩm nang ra giấy A4.', '(b) Luồng sử dụng:'),
    createBullet('ProcessGuidePage chỉ cho phép vai trò admin truy cập qua ProtectedRoute. Dữ liệu SOP được định nghĩa tĩnh trong file gồm SOP_DATA (6 quy trình), ROLES_DATA (4 vai trò), SYSTEMS_DATA (7 phân hệ) và RULES_DATA (8 quy tắc nghiệp vụ). Ô tìm kiếm lọc dữ liệu theo thời gian thực dựa trên useMemo. Trạng thái checklist công việc được lưu tạm thời bằng local state để nhân sự tương tác trong ca làm việc.', '(c) Cách hệ thống xử lý bên trong:'),
    createBullet('Đúng 6 quy trình SOP chuẩn từng bước; đúng 4 vai trò nhân sự (Chủ Studio, Stylist Cổ Phục, Nhiếp Ảnh Gia, Khách Hàng); đúng 7 phân hệ phần mềm; đúng 8 quy tắc nghiệp vụ trong mảng RULES_DATA (lưu ý: nhãn huy hiệu giao diện hiển thị số 18 là lỗi code chưa đồng bộ, xem Bảng điểm lệch).', '(d) Số liệu thật đã kiểm chứng:'),
    createBullet('src/pages/ProcessGuidePage.tsx, src/pages/ProcessGuidePage.css.', '(e) File nguồn tương ứng:'),

    // 5.10. Quản Trị Studio
    createH2('5.10. Phân hệ 10: Trung Tâm Điều Hành Quản Trị Studio Hoàng Gia (Admin)'),
    createBullet('Cung cấp công cụ điều hành kinh doanh trực quan (Dashboard), quản trị danh mục dịch vụ, đóng gói combo, xử lý đơn yêu cầu và quản lý tài khoản.', '(a) Mục đích:'),
    createBullet('Quản trị viên truy cập khu vực /admin với 5 phân hệ:\n' +
      '1. Tổng Quan (/admin): Xem bộ đếm khách online thời gian thực, 4 thẻ KPI kèm đường sóng Sparklines SVG, Biểu đồ Cột doanh thu SVG, Biểu đồ Donut SVG và xuất file Excel.\n' +
      '2. Quản Lý Dịch Vụ (/admin/dich-vu): Thêm mới, chỉnh sửa đơn giá/hình ảnh và xóa dịch vụ có Modal xác nhận.\n' +
      '3. Quản Lý Gói Cưới (/admin/goi-cuoi): Tạo gói combo mới với giao diện chọn nhiều dịch vụ con (Multi-checkbox).\n' +
      '4. Quản Lý Đơn Yêu Cầu (/admin/yeu-cau): Chuyển đổi giữa chế độ Bảng và Bảng Kanban 4 cột tiến độ; bấm nút chuyển trạng thái nhanh (Duyệt, Đã LH, Xong, Hủy, Mở lại); xem và in Hợp đồng A4.\n' +
      '5. Quản Lý Tài Khoản (/admin/tai-khoan): Xem danh sách người dùng, bật/tắt khóa tài khoản và tạo tài khoản mới.', '(b) Luồng sử dụng:'),
    createBullet('AdminDashboardPage nạp số liệu thống kê từ /api/admin/thong-ke, mô phỏng khách trực tuyến (14–28 khách) qua setInterval ngẫu nhiên. Biểu đồ cột và biểu đồ donut được vẽ hoàn toàn bằng thẻ SVG Native (<rect>, <circle>, <path>) tự tính góc và tọa độ trong AdminCharts.tsx. AdminRequestsPage cập nhật trạng thái đơn thông qua các nút bấm hành động (không dùng cơ chế kéo thả) và gọi SupabaseService.updateRequestStatus. AdminUsersPage bảo vệ tài khoản Root Admin không thể bị xóa hoặc khóa.', '(c) Cách hệ thống xử lý bên trong:'),
    createBullet('Dashboard có 4 thẻ KPI Sparklines; Biểu đồ cột hiển thị doanh thu 6 tháng; Biểu đồ Donut hiển thị tỷ trọng hợp đồng; Bảng Kanban chia 4 cột tiến độ (Chờ Xử Lý, Đã Duyệt, Đã Liên Hệ, Hoàn Thành - trạng thái Đã Từ Chối chỉ hiển thị ở dạng Bảng danh sách); Quản lý 2 cấp độ tài khoản (admin / user).', '(d) Số liệu thật đã kiểm chứng:'),
    createBullet('src/pages/admin/AdminDashboardPage.tsx, AdminServicesPage.tsx, AdminPackagesPage.tsx, AdminRequestsPage.tsx, AdminUsersPage.tsx, AdminCharts.tsx.', '(e) File nguồn tương ứng:'),

    createChapterSummary(
      'Chương 5 đã đặc tả chi tiết toàn bộ 10 phân hệ nghiệp vụ cốt lõi theo đúng cấu trúc 5 phần chuẩn mực. Mọi thông tin về luồng thao tác, cách xử lý component, vị trí lưu trữ trạng thái, schema kiểm thực và số liệu bản ghi đều được đối chiếu chính xác với mã nguồn thực tế.'
    )
  );

  // ============================================================================
  // CHƯƠNG 6: THIẾT KẾ CƠ SỞ DỮ LIỆU & BẢO MẬT ĐÁM MÂY SUPABASE
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 6: THIẾT KẾ CƠ SỞ DỮ LIỆU & BẢO MẬT ĐÁM MÂY SUPABASE'),
    createH2('6.1. Thiết kế 5 bảng cơ sở dữ liệu quan hệ'),
    createParagraph(
      'Hệ thống cơ sở dữ liệu quan hệ được triển khai trên nền tảng PostgreSQL của Supabase Cloud, bao gồm 5 bảng chính được khai báo trong supabase/schema.sql:'
    ),
    ...createTable(
      'Bảng 6: Đặc tả lược đồ 5 bảng dữ liệu trong cơ sở dữ liệu PostgreSQL',
      'supabase/schema.sql của dự án doan-fenc',
      ['Tên Bảng (Table Name)', 'Khóa Chính (PK)', 'Các Cột Thuộc Tính Chính', 'Ràng Buộc Toàn Vẹn & Kiểu Dữ Liệu'],
      [
        ['public.dich_vu', 'id (TEXT)', 'ten, loai, gia, mo_ta, hinh_anh, is_top, created_at', 'CHECK (loai IN ("ao-dai", "tho-anh", "dia-diem", "trang-tri")), CHECK (gia >= 0).'],
        ['public.goi_cuoi', 'id (TEXT)', 'ten, mo_ta, gia_tron_goi, danh_sach_dich_vu_ids, phong_cach, hinh_anh, is_top', 'CHECK (phong_cach IN ("cung-dinh", "hien-dai", "co-dien")), CHECK (gia_tron_goi >= 0), mảng TEXT[].'],
        ['public.yeu_cau', 'id (TEXT)', 'ten_khach, so_dien_thoai, ngay_cuoi, so_luong_khach, ngan_sach, goi_de_xuat_id, ghi_chu, trang_thai, ngay_tao', 'CHECK (trang_thai IN ("cho-xu-ly", "da-duyet", "da-lien-he", "hoan-thanh", "tu-choi")).'],
        ['public.thiep_cuoi', 'id (TEXT)', 'ten, phong_cach, loai, gia, gia_goc, mo_ta, hinh_anh, co_dau, chu_re, ngay_cuoi, dia_diem, qr_ngan_hang, tinh_nang', 'CHECK (loai IN ("basic", "vip", "pro")), CHECK (gia >= 0), mảng tinh_nang TEXT[].'],
        ['public.profiles', 'id (UUID)', 'username, full_name, role, phone, email, active, created_at', 'Khóa ngoại liên kết auth.users(id), CHECK (role IN ("admin", "user")), active BOOLEAN.']
      ],
      [2000, 1400, 3600, 3000]
    ),
    createH2('6.2. Thiết lập chính sách bảo mật cấp dòng (Row Level Security - RLS)'),
    createParagraph(
      'Toàn bộ 5 bảng dữ liệu đều được kích hoạt Row Level Security (RLS) để kiểm soát truy cập trực tiếp từ phía client. Hiện trạng phân quyền RLS thực tế trong supabase/schema.sql như sau:'
    ),
    createBullet('Bảng dich_vu, goi_cuoi, thiep_cuoi: Thiết lập chính sách SELECT công khai cho mọi người dùng (USING (true)); quyền INSERT, UPDATE, DELETE chỉ dành riêng cho tài khoản có quyền admin thông qua hàm kiểm tra public.is_admin().'),
    createBullet('Bảng yeu_cau: Thiết lập chính sách INSERT công khai ("Public create requests" WITH CHECK (true)) cho phép khách hàng gửi đơn tư vấn và đặt lịch; quyền ALL (SELECT, UPDATE, DELETE) được cấp cho quản trị viên ("Admin manage requests" USING (public.is_admin())). Cần lưu ý: Bảng yeu_cau hiện chưa có policy SELECT riêng cho khách hàng thường; việc khách xem đơn của mình tại /don-cua-toi hiện đang được ứng dụng lọc phía Client dựa trên danh tính đăng nhập.'),
    createBullet('Bảng profiles: Người dùng được phép xem và cập nhật hồ sơ của chính mình (auth.uid() = id), trong khi quản trị viên có quyền xem và cập nhật toàn bộ người dùng.'),
    createH2('6.3. Kiến trúc Hybrid Database Adapter & Cơ chế Fallback an toàn'),
    createParagraph(
      'Lớp dịch vụ SupabaseService (src/lib/supabaseAdapter.ts) đóng gói toàn bộ các hàm truy vấn dữ liệu. Trong trường hợp ứng dụng chạy ở môi trường không có kết nối internet hoặc API Supabase bị gián đoạn, các hàm useFetch và API handler sẽ tự động fallback về Mock Server Node.js (cổng 4000) lấy dữ liệu từ server/db.json. Nhờ kiến trúc này, hội đồng chấm đồ án có thể kiểm thử toàn bộ tính năng mượt mà trong mọi điều kiện mạng.'
    ),
    createChapterSummary(
      'Chương 6 đã mô tả chi tiết lược đồ 5 bảng dữ liệu PostgreSQL trên Supabase Cloud và phân tích thực trạng các chính sách an ninh cấp dòng RLS. Cơ chế chuyển đổi dự phòng Hybrid Adapter đảm bảo độ tin cậy và tính liên tục trong quá trình vận hành và nghiệm thu hệ thống.'
    )
  );

  // ============================================================================
  // CHƯƠNG 7: THIẾT KẾ DESIGN TOKENS, KHỬ TRÀN VIỀN & TIẾP CẬN A11Y
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 7: THIẾT KẾ DESIGN TOKENS, KHỬ TRÀN VIỀN & TIẾP CẬN A11Y'),
    createH2('7.1. Bảng Design Tokens Cung Đình Huế theo variables.css'),
    createParagraph(
      'Toàn bộ hệ thống giao diện được định hình bằng các biến CSS (CSS Variables) toàn cục tại tệp tin src/styles/variables.css (không phải globals.css). Các giá trị màu sắc chuẩn xác được trích xuất như sau:'
    ),
    ...createTable(
      'Bảng 7: Danh mục Design Tokens cốt lõi trích xuất từ src/styles/variables.css',
      'src/styles/variables.css trong mã nguồn',
      ['Tên Biến CSS (Token Name)', 'Giá Trị Chế Độ Sáng (Light Theme)', 'Giá Trị Chế Độ Tối (Dark Theme)', 'Ý Nghĩa Văn Hóa & Ứng Dụng'],
      [
        ['--primary', '#8B0000', '#C0392B', 'Sắc đỏ mận huyết ngọc hoàng gia (Light) / Đỏ son sơn mài (Dark).'],
        ['--primary-hover', '#A30000', '#D94534', 'Sắc đỏ sáng khi hover chuột lên các nút bấm và liên kết chính.'],
        ['--secondary', '#D4AF37', '#D4AF37', 'Sắc vàng kim hoàng triều cổ truyền, dùng cho viền, điểm nhấn và icon.'],
        ['--secondary-hover', '#E5C158', '#F0D278', 'Sắc vàng sáng khi di chuột qua các thành phần phụ.'],
        ['--bg-main', '#FDFBF7', '#1A1512', 'Màu nền chính: Trắng ngà lụa tơ tằm (Light) / Đen huyền sơn mài (Dark).'],
        ['--surface', '#FFFFFF', '#26201C', 'Bề mặt thẻ card: Trắng sứ tinh khôi (Light) / Nâu đen trầm mặc (Dark).'],
        ['--text-main', '#1A1512', '#EAE3D9', 'Màu chữ nội dung: Mực nho mộc bản (Light) / Trắng ngà ấm áp (Dark).'],
        ['--text-muted', '#6C645C', '#A89F93', 'Màu chữ phụ, mô tả ngắn và ghi chú thông tin thanh nhã.'],
        ['--font-serif', 'Playfair Display, serif', 'Playfair Display, serif', 'Phông chữ tiêu đề cổ điển mang phong thái quý tộc trang nghiêm.'],
        ['--font-sans', 'Be Vietnam Pro, sans-serif', 'Be Vietnam Pro, sans-serif', 'Phông chữ nội dung chuẩn tiếng Việt, không bị lỗi dấu thanh.']
      ],
      [2200, 2400, 2400, 3000]
    ),
    createH2('7.2. Kỹ thuật khử tràn viền và thanh cuộn ngang (Zero Horizontal Overflow)'),
    createParagraph(
      'Để loại bỏ hiện tượng xuất hiện thanh cuộn ngang ngoài ý muốn trên trình duyệt Windows khi có thanh cuộn dọc:'
    ),
    createBullet('Tại src/styles/globals.css, thuộc tính overflow-x: clip; được áp dụng trực tiếp cho thẻ html (dòng 17) và thẻ body (dòng 38). Thuộc tính này triệt tiêu hoàn toàn thanh cuộn ngang nhưng không làm phá vỡ vị trí dính (position: sticky) của Header hay giỏ hàng.'),
    createBullet('Lớp hiệu ứng nhẫn cưới bay (FixedFloatingRings.css) được đặt kích thước width: 100%; height: 100%; pointer-events: none; z-index: -1; thay vì dùng 100vw, tránh tính dư độ rộng thanh cuộn.'),
    createBullet('Các bố cục Grid tại trang tư vấn và tùy biến thiệp được cấu hình grid-template-columns: minmax(0, 1fr) và min-width: 0 để ngăn chặn hiện tượng tràn khung (Grid Blowout).'),
    createH2('7.3. Khả năng tiếp cận người dùng (A11y) và chuẩn mực biểu mẫu'),
    createParagraph(
      'Dự án chú trọng đến khả năng tiếp cận người dùng thông qua các giải pháp cụ thể:'
    ),
    createBullet('Component Input dùng chung (src/components/common/UI.tsx) đóng gói hoàn chỉnh các thuộc tính id tự sinh (useId), label với htmlFor, aria-invalid khi có lỗi và aria-describedby liên kết với thông báo lỗi mang role="alert".'),
    createBullet('Các cửa sổ Modal, giỏ hàng CartDrawer và hợp đồng RoyalContractA4Modal đều hỗ trợ phím Escape để đóng nhanh.'),
    createBullet('Quy chuẩn focus-visible trong globals.css thiết lập viền outline: 2px solid var(--secondary); rõ nét cho người dùng điều hướng bằng bàn phím (phím Tab).'),
    createH2('7.4. Hiện trạng sử dụng biểu tượng và Emoji trong hệ thống'),
    createParagraph(
      'Dự án đã nỗ lực thay thế hầu hết emoji bằng biểu tượng SVG tự vẽ trong Icon.tsx (với 30 biểu tượng khác nhau). Tuy nhiên, qua rà soát mã nguồn thực tế, hệ thống vẫn còn sót lại ký tự "⭐" tại dòng 18 của ServicesPage.tsx (nhãn lọc "⭐ Top Dịch Vụ") và dòng 406 của ProcessGuidePage.tsx. Điểm này đã được ghi nhận vào danh sách điểm lệch để chuẩn hóa hoàn toàn.'
    ),
    createChapterSummary(
      'Chương 7 đã tổng hợp bảng Design Tokens chính xác từ variables.css, giải thích cơ chế khử tràn ngang bằng overflow-x: clip trên html/body và đánh giá thực trạng hỗ trợ A11y. Các điểm còn tồn đọng về emoji cũng được ghi nhận minh bạch theo đúng mã nguồn.'
    )
  );

  // ============================================================================
  // CHƯƠNG 8: KẾT QUẢ KIỂM THỬ TỰ ĐỘNG & TRIỂN KHAI PRODUCTION
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 8: KẾT QUẢ KIỂM THỬ TỰ ĐỘNG & TRIỂN KHAI PRODUCTION'),
    createH2('8.1. Kết quả kiểm thử tự động Vitest (26/26 ca kiểm thử thành công)'),
    createParagraph(
      'Bộ kiểm thử tự động được xây dựng bằng Vitest kết hợp thư viện @testing-library/react, chia thành 2 tệp kiểm thử chuyên biệt:'
    ),
    ...createTable(
      'Bảng 8: Kết quả thực thi bộ kiểm thử tự động Vitest trong dự án',
      'Lệnh thực thi npm test tại thời điểm kiểm tra',
      ['STT', 'Tệp Tin Kiểm Thử', 'Phạm Vi & Nội Dung Kiểm Thử', 'Số Lượng Test', 'Thời Gian Chạy', 'Kết Quả'],
      [
        ['1', 'src/test/validation.test.ts', 'Kiểm thực tính hợp lệ của các Zod Schema: số điện thoại VN 10 số, định dạng ngày cưới, ngân sách tối thiểu, phân loại dịch vụ và gói cưới.', '16 Tests', '~220 ms', '16/16 Passed'],
        ['2', 'src/test/routes.test.tsx', 'Kiểm thử cơ chế định tuyến React Router v8: Truy cập các trang công khai, kiểm tra chuyển hướng của ProtectedRoute khi chưa đăng nhập và xác nhận quyền admin.', '10 Tests', '~580 ms', '10/10 Passed']
      ],
      [500, 3000, 3900, 1300, 1300]
    ),
    createCallout(
      'KẾT QUẢ XUẤT BẢN CỦA LỆNH CHẠY THẬT (npm test)',
      'Test Files  2 passed (2)\n' +
      'Tests       26 passed (26)\n' +
      'Start at    17:52:14\n' +
      'Duration    3.91s (transform 728ms, setup 514ms, collect 1.73s, tests 803ms)\n\n' +
      'Toàn bộ 26 ca kiểm thử đều vượt qua thành công 100%, không có bất kỳ lỗi hoặc cảnh báo nào.'
    ),
    createH2('8.2. Kiểm tra an toàn kiểu dữ liệu TypeScript Strict & Đóng gói Vite 6'),
    createBullet('Lệnh kiểm tra kiểu dữ liệu: npm run typecheck (thực thi tsc --noEmit) kết thúc với mã thoát 0 (Exit Code 0), khẳng định mã nguồn không chứa bất kỳ lỗi cú pháp hoặc sai lệch kiểu dữ liệu nào.'),
    createBullet('Lệnh đóng gói xuất bản: npm run build (thực thi tsc --noEmit && vite build) hoàn thành trong khoảng 3,0 giây, tạo ra thư mục dist/ với các gói tệp được chia nhỏ (vendor chunks, zod chunk, index bundle).'),
    createH2('8.3. Triển khai đám mây Vercel (Production Live)'),
    createParagraph(
      'Hệ thống được xuất bản trực tuyến tại địa chỉ https://huecungdinh.vercel.app. Tệp cấu hình vercel.json thiết lập quy tắc định tuyến SPA Rewrite như sau:'
    ),
    createCallout(
      'CẤU HÌNH VERCEL SPA REWRITE (vercel.json)',
      '{\n' +
      '  "rewrites": [\n' +
      '    { "source": "/(.*)", "destination": "/index.html" }\n' +
      '  ]\n' +
      '}\n\n' +
      'Cấu hình này đảm bảo khi người dùng tải lại trang (F5) hoặc nhập trực tiếp các đường dẫn con (như /dich-vu, /dat-lich, /admin), máy chủ Vercel sẽ luôn trả về index.html để React Router tiếp nhận và điều hướng, ngăn chặn hoàn toàn lỗi 404 Not Found.'
    ),
    createChapterSummary(
      'Chương 8 đã chứng minh chất lượng mã nguồn thông qua việc hoàn thành 26/26 ca kiểm thử tự động Vitest và vượt qua quá trình kiểm tra TypeScript strict với 0 lỗi. Cấu hình triển khai trên Vercel đảm bảo ứng dụng vận hành ổn định trên môi trường đám mây.'
    )
  );

  // ============================================================================
  // CHƯƠNG 9: HƯỚNG DẪN VẬN HÀNH & KỊCH BẢN NGHIỆM THU ĐỒ ÁN
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 9: HƯỚNG DẪN VẬN HÀNH & KỊCH BẢN NGHIỆM THU ĐỒ ÁN'),
    createH2('9.1. Yêu cầu môi trường & hướng dẫn khởi chạy'),
    createBullet('Môi trường yêu cầu: Node.js phiên bản >= 18.0.0; trình quản lý gói npm đi kèm.'),
    createBullet('Bước 1: Cài đặt thư viện phụ thuộc bằng lệnh: npm install'),
    createBullet('Bước 2: Khởi chạy máy chủ API giả lập (Terminal 1): npm run server (chạy tại http://localhost:4000)'),
    createBullet('Bước 3: Khởi chạy máy chủ phát triển Vite (Terminal 2): npm run dev (truy cập tại http://localhost:5173)'),
    createBullet('Bước 4: Kiểm tra chất lượng mã nguồn: npm test (kiểm thử) | npm run typecheck (kiểm tra kiểu)'),
    createH2('9.2. Danh sách tài khoản trải nghiệm 2 cấp độ'),
    ...createTable(
      'Bảng 9: Danh sách tài khoản thử nghiệm phục vụ bảo vệ đồ án',
      'src/features/auth/AuthContext.tsx trong mã nguồn',
      ['Vai Trò Người Dùng', 'Tên Đăng Nhập', 'Mật Khẩu', 'Phạm Vi Thao Tác & Đặc Quyền'],
      [
        ['Quản Trị Viên (Super Admin)', 'admin', '123456 (hoặc 123)', 'Toàn quyền: Dashboard Corbel, CRUD dịch vụ/gói cưới, Bảng Kanban duyệt đơn, Quản lý tài khoản, Cẩm nang SOP.'],
        ['Khách Hàng (Customer)', 'khachhang', '123456 (hoặc 123)', 'Trải nghiệm khách: Xem chi tiết dịch vụ/gói cưới, đặt lịch Royal Dropdown, cọc 20% qua VietQR, tạo thiệp, in hợp đồng A4.']
      ],
      [2200, 1800, 1800, 4200]
    ),
    createH2('9.3. Kịch bản nghiệm thu 10 bước chuẩn mực dành cho Hội đồng chấm thi'),
    createParagraph(
      'Kịch bản dưới đây được thiết kế theo đúng luồng thao tác thực tế mà sinh viên sẽ trình diễn trước hội đồng chấm đồ án:'
    ),
    createBullet('Truy cập trang chủ (/) ➔ Quan sát hero banner với khẩu hiệu chuyển động, băng chuyền combo Marquee và kiểm tra nút chuyển chế độ Sáng/Tối trên thanh điều hướng ➔ Chứng minh tính năng giao diện Pure CSS hoàng triều và ThemeContext.', 'Bước 1 (Trang Chủ & Giao Diện):'),
    createBullet('Nhấn vào menu "Dịch Vụ Lẻ" (/dich-vu) ➔ Lọc theo danh mục "Áo Dài", sắp xếp giá tăng dần ➔ Bấm nút "Xem Chi Tiết" của dịch vụ Áo Nhật Bình khi chưa đăng nhập ➔ Kết quả: Hệ thống tự động chuyển hướng về trang /login ➔ Chứng minh tính năng bảo vệ tuyến đường đối với khách vãng lai.', 'Bước 2 (Dịch Vụ & Phân Quyền):'),
    createBullet('Tại trang /login, bấm nút "Nhanh: Khách Hàng" ➔ Hệ thống tự động điền khachhang/123456 và đăng nhập ➔ Trình duyệt tự động đưa người dùng trở lại đúng trang chi tiết Áo Nhật Bình (/dich-vu/dv-01) ➔ Chứng minh cơ chế khôi phục vị trí chuyển hướng (state.from).', 'Bước 3 (Đăng Nhập Khách Hàng):'),
    createBullet('Tại trang chi tiết dịch vụ, tăng số lượng lên 2 và bấm "Thêm vào giỏ cưới" ➔ Vào trang "Gói Cưới Combo" (/goi-cuoi), chọn xem chi tiết gói "Cung Đình Khang Ninh" (/goi-cuoi/gc-01) ➔ Bấm nút "Xem Nhanh" dịch vụ con để mở modal popup ➔ Bấm "Thêm Vào Giỏ Dịch Vụ" ➔ Chứng minh giỏ hàng Zustand và modal xem nhanh.', 'Bước 4 (Chi Tiết Gói & Giỏ Hàng):'),
    createBullet('Truy cập trang "Đặt Lịch" (/dat-lich) ➔ Họ tên khách đã được tự động điền sẵn; mở bộ chọn Royal Custom Dropdown để trải nghiệm menu địa danh di sản Cố Đô và gói cưới có hiệu ứng lấp lánh Pure SVG ➔ Bấm "Khởi Tạo Hồ Sơ Đặt Lịch" ➔ Chứng minh bộ chọn tùy biến hoàng triều và xác thực Zod.', 'Bước 5 (Đặt Lịch Hoàng Gia):'),
    createBullet('Vào menu "AI Tư Vấn" (/tu-van) ➔ Kéo thanh trượt ngân sách lên 35.000.000 đ, chọn 2 bộ cổ phục và bấm "AI Gợi Ý Gói Cưới Tối Ưu" ➔ Kết quả hiển thị gói cưới phù hợp nhất, số tiền dư dả và danh sách dịch vụ nâng cấp khuyến nghị ➔ Chứng minh thuật toán tư vấn client-side tức thời.', 'Bước 6 (AI Tư Vấn Ngân Sách):'),
    createBullet('Vào menu "Mẫu Thiệp Cưới" (/thiep-cuoi) ➔ Bấm xem thử thiệp hoàng gia: Nhấn mở phong bì, nghe Nhã Nhạc Cung Đình ngũ cung (Web Audio API), xem VietQR mừng cưới ➔ Vào /thiep-cuoi/dang-ky để thử nghiệm màn hình tạo thiệp 2 cột ➔ Chứng minh tính năng thiệp điện tử di sản.', 'Bước 7 (Kho Thiệp & Nhã Nhạc):'),
    createBullet('Nhấn biểu tượng giỏ hàng trên Header để mở CartDrawer ➔ Tích chọn "Đặt cọc trước 20% qua VietQR" ➔ Mã VietQR động hiển thị số tiền cọc chính xác (20% tổng giá trị) ➔ Nhấn "Xác Nhận Đặt Lịch" và vượt qua bước xác nhận thứ hai ➔ Chứng minh quy trình thanh toán đặt cọc an toàn.', 'Bước 8 (Thanh Toán Đặt Cọc VietQR):'),
    createBullet('Vào menu "Đơn Của Tôi" (/don-cua-toi) ➔ Xem đơn vừa tạo ở trạng thái "Chờ duyệt", bấm mở chi tiết để nhập thêm mong muốn chụp ảnh ➔ Với đơn đã được duyệt (ở dữ liệu mẫu), bấm nút "In HĐ A4" để mở modal hợp đồng pháp lý và kiểm tra giao diện in A4 qua print preview ➔ Chứng minh tính năng in hợp đồng A4.', 'Bước 9 (Đơn Cá Nhân & In Hợp Đồng):'),
    createBullet('Đăng xuất tài khoản khách hàng, đăng nhập tài khoản admin/123456 ➔ Vào /admin kiểm tra Dashboard KPI với 4 Sparklines SVG, Biểu đồ cột và Donut SVG ➔ Vào /admin/yeu-cau chuyển đổi sang chế độ Bảng Kanban 4 cột và bấm nút duyệt đơn ➔ Vào menu người dùng chọn "Hướng Dẫn & Quy Trình" (/quy-trinh) để xem cẩm nang SOP và checklist công việc ➔ Chứng minh toàn diện phân hệ quản trị.', 'Bước 10 (Quản Trị Studio & SOP):'),

    createH2('9.4. Giới hạn hiện tại của hệ thống & Hướng khắc phục dự kiến'),
    createParagraph(
      'Nhằm đảm bảo tính trung thực học thuật, dự án thẳng thắn ghi nhận các giới hạn kỹ thuật hiện tại và đề xuất hướng nâng cấp tiếp theo:'
    ),
    createBullet('Cơ chế xác thực đăng nhập hiện tại chủ yếu phục vụ trình diễn (demo) dựa trên state lưu trong localStorage và tài khoản cứng. Hướng khắc phục: Tích hợp đầy đủ dịch vụ Supabase Auth với mã thông báo JWT và xác thực qua email/SMS.', '1. Xác thực người dùng:'),
    createBullet('Các chỉ số kinh doanh trên Admin Dashboard (Live visitor counter, số hợp đồng theo mốc thời gian) đang dùng dữ liệu mô phỏng ngẫu nhiên kết hợp dữ liệu tĩnh. Hướng khắc phục: Xây dựng các hàm tính toán tổng hợp (PostgreSQL Views hoặc RPC) tổng hợp số liệu thực tế theo thời gian thực.', '2. Số liệu Dashboard:'),
    createBullet('Mã VietQR mừng cưới trong InvitationCustomPage đang khóa cứng mã định danh BIN của ngân hàng MB (970422). Hướng khắc phục: Bổ sung bảng tra cứu BIN của hơn 50 ngân hàng Việt Nam để sinh mã QR theo đúng ngân hàng cô dâu chú rể chọn.', '3. Cổng VietQR mừng cưới:'),
    createBullet('Đồng hồ đếm ngược ngày cưới trong modal xem trước thiệp đang hiển thị các số cố định (28/12/30/45). Hướng khắc phục: Viết hook tính toán khoảng cách thời gian thực giữa ngày hiện tại và ngày cưới được truyền vào.', '4. Đồng hồ đếm ngược:'),
    createBullet('Tại trang /don-cua-toi, việc hiển thị đơn của khách hàng đang được lọc bằng JavaScript phía client sau khi nạp toàn bộ danh sách. Hướng khắc phục: Bổ sung chính sách RLS SELECT trên Supabase và thêm tham số truy vấn backend theo user_id.', '5. Lọc dữ liệu đơn cá nhân:'),

    createChapterSummary(
      'Chương 9 đã cung cấp đầy đủ hướng dẫn môi trường, danh sách tài khoản thử nghiệm và xây dựng kịch bản nghiệm thu 10 bước bám sát thực tế thao tác. Phần giới hạn hệ thống thể hiện thái độ học thuật nghiêm túc, minh bạch và xác định rõ lộ trình phát triển trong tương lai.'
    )
  );

  // ============================================================================
  // KẾT LUẬN VÀ LỜI CẢM ƠN
  // ============================================================================
  children.push(
    createH1('KẾT LUẬN VÀ LỜI CẢM ƠN'),
    createParagraph(
      'Đồ án "Huế Cung Đình – Dịch Vụ Cưới & Nhiếp Ảnh Cổ Phục Hoàng Triều" đã hoàn thành trọn vẹn các mục tiêu kỹ thuật đặt ra cho học phần Web FrontEnd Nâng Cao (INT.7.18). Dự án đã khẳng định năng lực tự chủ công nghệ ở cấp độ cao: Tự xây dựng toàn bộ giao diện bằng 100% Pure CSS với hệ thống biến màu cung đình tinh tế, tự tính toán toạ độ hình học để vẽ biểu đồ và biểu tượng SVG thuần, kiểm soát độ an toàn kiểu dữ liệu TypeScript strict không sử dụng bất kỳ kiểu "any" nào, và áp dụng nghiêm ngặt kiến trúc Feature-Based một chiều.'
    ),
    createParagraph(
      'Sản phẩm không chỉ là một bài tập lớn đạt chuẩn học thuật đại học mà còn mang giá trị văn hóa nhân văn sâu sắc, đóng góp một giải pháp số hóa cụ thể nhằm tôn vinh, bảo tồn và lan tỏa nét đẹp di sản hôn lễ Cố Đô Huế trong thời đại công nghệ số.'
    ),
    createParagraph(
      'Em xin bày tỏ lòng biết ơn chân thành và sâu sắc nhất tới Thầy Dương Ngọc Duy – Giảng viên trực tiếp giảng dạy và hướng dẫn học phần Web FrontEnd Nâng Cao. Những kiến thức chuyên môn sâu rộng, sự định hướng kiến trúc khắt khe và những lời nhận xét phản biện quý báu của Thầy đã giúp em nâng cao tư duy kỹ thuật, rèn luyện tính cẩn trọng và hoàn thiện đồ án này một cách chỉn chu, chuyên nghiệp nhất.'
    ),
    createParagraph('Sinh viên thực hiện đề tài:', {
      alignment: AlignmentType.RIGHT,
      before: 300,
      after: 60,
      italics: true,
      color: COLOR_TEXT_MUTED,
    }),
    createParagraph('TRẦN CÔNG QUÝ', {
      alignment: AlignmentType.RIGHT,
      before: 0,
      after: 80,
      size: 26,
      bold: true,
      color: COLOR_PRIMARY,
    }),
    createParagraph('MSSV: 2401ITA001 – Lớp CNTT K22', {
      alignment: AlignmentType.RIGHT,
      before: 0,
      after: 300,
      size: 22,
      color: COLOR_TEXT_MAIN,
    })
  );

  // Khởi tạo Document với cấu hình Section và Margin chuẩn A4 (1 inch = 1440 twips)
  const doc = new Document({
    creator: 'Trần Công Quý (MSSV: 2401ITA001)',
    title: 'Báo Cáo Tổng Quan Đồ Án Huế Cung Đình - Web FrontEnd Nâng Cao',
    description: 'Báo cáo kỹ thuật đồ án môn học Web FrontEnd Nâng Cao (INT.7.18) - Đại học Phú Xuân',
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: 24, // 12pt
            color: COLOR_TEXT_MAIN,
          },
          paragraph: {
            spacing: {
              line: 360, // 1.5 line spacing
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'BÁO CÁO ĐỒ ÁN WEB FRONTEND NÂNG CAO – HUẾ CUNG ĐÌNH (INT.7.18)',
                    font: FONT_FAMILY,
                    size: 18,
                    italics: true,
                    color: COLOR_TEXT_MUTED,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 180 },
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'SV: Trần Công Quý (MSSV: 2401ITA001) – Trang ',
                    font: FONT_FAMILY,
                    size: 18,
                    color: COLOR_TEXT_MUTED,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT_FAMILY,
                    size: 18,
                    color: COLOR_TEXT_MUTED,
                  }),
                  new TextRun({
                    text: ' / ',
                    font: FONT_FAMILY,
                    size: 18,
                    color: COLOR_TEXT_MUTED,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: FONT_FAMILY,
                    size: 18,
                    color: COLOR_TEXT_MUTED,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 180 },
              }),
            ],
          }),
        },
        children: children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, '..', 'Docx', 'BaoCao_TongQuan_DuAn_HueCungDinh.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Đã xuất bản thành công tài liệu: ${outputPath} (${buffer.length} bytes)`);
}

generateWordReport().catch((err) => {
  console.error('Lỗi khi sinh tài liệu Word:', err);
  process.exit(1);
});
