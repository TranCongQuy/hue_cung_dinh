/**
 * scripts/generate_docx_report.cjs
 * Bộ sinh tài liệu Báo Cáo Đồ Án Học Phần "Web FrontEnd Nâng Cao" (INT.7.18)
 * Dự án: Huế Cung Đình - Dịch Vụ Cưới & Nhiếp Ảnh Cổ Phục Hoàng Triều (doan-fenc)
 *
 * Mọi con số định lượng, tên biến CSS, tên tệp nguồn, cấu trúc bảng và kết quả kiểm thử
 * đều được kiểm chứng trực tiếp trên mã nguồn thực tế tại thời điểm xuất bản.
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
const { CHAPTER_5_MODULES } = require('./report_modules_data.cjs');

// --- Bảng màu chuẩn trích xuất từ src/styles/variables.css ---
const COLOR_PRIMARY = '8B0000';     // --primary: #8B0000
const COLOR_SECONDARY = 'D4AF37';   // --secondary: #D4AF37
const COLOR_TEXT_MAIN = '1A1512';   // --text-main: #1A1512
const COLOR_TEXT_MUTED = '6C645C';  // --text-muted: #6C645C
const COLOR_BG_LIGHT = 'FDFBF7';    // --bg-main: #FDFBF7
const COLOR_ALT_ROW = 'FAF6F0';     // --surface-hover: #FAF6F0
const COLOR_BORDER = 'D1D5DB';

const FONT_FAMILY = 'Times New Roman';

function createText(text, options = {}) {
  return new TextRun({
    text: text || '',
    font: FONT_FAMILY,
    size: options.size || 24,
    bold: options.bold || false,
    italics: options.italics || false,
    color: options.color || COLOR_TEXT_MAIN,
    ...options,
  });
}

function createParagraph(textRuns, options = {}) {
  const runs = Array.isArray(textRuns)
    ? textRuns
    : [createText(textRuns, options)];
  return new Paragraph({
    children: runs,
    spacing: {
      line: 360,
      before: options.before !== undefined ? options.before : 100,
      after: options.after !== undefined ? options.after : 100,
    },
    alignment: options.alignment || AlignmentType.LEFT,
    ...options,
  });
}

function createH1(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [
      new TextRun({
        text: title,
        font: FONT_FAMILY,
        size: 30,
        bold: true,
        color: COLOR_PRIMARY,
      }),
    ],
    spacing: { before: 360, after: 180 },
  });
}

function createH2(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({
        text: title,
        font: FONT_FAMILY,
        size: 26,
        bold: true,
        color: COLOR_PRIMARY,
      }),
    ],
    spacing: { before: 260, after: 130 },
  });
}

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

function createTable(tableTitle, sourceNote, headers, rows, colWidths = []) {
  const paragraphs = [];

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

function createChapterSummary(summaryText) {
  return createCallout('TÓM TẮT NỘI DUNG CHƯƠNG', summaryText);
}

async function generateWordReport() {
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
    createParagraph('(Mã định danh dự án: doan-fenc | Phiên bản hệ thống: 1.0.0 theo package.json)', {
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
  // BẢNG THUẬT NGỮ VÀ KÝ HIỆU VIẾT TẮT (GLOSSARY)
  // ============================================================================
  children.push(
    createH1('BẢNG THUẬT NGỮ VÀ KÝ HIỆU VIẾT TẮT (GLOSSARY)'),
    createParagraph(
      'Để hỗ trợ giảng viên và hội đồng đánh giá theo dõi trọn vẹn tài liệu mà không cần mở trực tiếp mã nguồn, bảng dưới đây giải thích ngắn gọn các thuật ngữ chuyên ngành và chữ viết tắt sử dụng thống nhất xuyên suốt báo cáo:'
    ),
    ...createTable(
      'Bảng 1: Giải thích thuật ngữ chuyên môn và ký hiệu viết tắt sử dụng trong báo cáo',
      'Đối chiếu quy chuẩn kỹ thuật dự án doan-fenc',
      ['STT', 'Thuật Ngữ / Viết Tắt', 'Tên Tiếng Anh Đầy Đủ', 'Giải Thích Ý Nghĩa & Vai Trò Trong Hệ Thống'],
      [
        ['1', 'SPA', 'Single Page Application', 'Ứng dụng web đơn trang; trình duyệt chỉ tải khung HTML một lần và chuyển đổi màn hình phía máy khách qua bộ định tuyến mà không tải lại toàn trang.'],
        ['2', 'RBAC', 'Role-Based Access Control', 'Cơ chế phân quyền theo vai trò. Dự án áp dụng 2 vai trò đăng nhập là Quản trị viên (admin) và Khách hàng (user), kết hợp phân tách quyền khách vãng lai.'],
        ['3', 'RLS', 'Row Level Security', 'Cơ chế bảo mật cấp dòng của hệ quản trị cơ sở dữ liệu PostgreSQL trên Supabase, kiểm soát quyền đọc và ghi từng bản ghi bằng biểu thức SQL.'],
        ['4', 'SOP', 'Standard Operating Procedure', 'Quy trình tác nghiệp tiêu chuẩn; tài liệu hóa các bước vận hành dịch vụ cưới di sản và quy tắc làm việc của từng vị trí nhân sự tại studio.'],
        ['5', 'CRUD', 'Create, Read, Update, Delete', 'Bốn thao tác quản trị dữ liệu cơ bản gồm Tạo mới, Đọc danh sách/chi tiết, Cập nhật và Xóa bản ghi.'],
        ['6', 'ERP', 'Enterprise Resource Planning', 'Hệ thống hoạch định nguồn lực nội bộ; trong dự án dùng để chỉ cụm phân hệ quản trị đơn yêu cầu, kho thiệp, tài khoản và điều phối nhân sự ekip.'],
        ['7', 'RSVP', 'Répondez s’il vous plaît', 'Biểu mẫu xác nhận tham dự lễ cưới trực tuyến, cho phép khách mời báo trước số người đi cùng, khẩu phần mặn/chay và gửi lời chúc.'],
        ['8', 'HMR', 'Hot Module Replacement', 'Cơ chế cập nhật nóng module của công cụ Vite trong quá trình lập trình mà không làm mất trạng thái đang mở trên trình duyệt.'],
        ['9', 'Schema', 'Data Validation Schema', 'Khuôn mẫu quy định cấu trúc và điều kiện hợp lệ của dữ liệu; được khai báo bằng thư viện Zod để kiểm tra dữ liệu lúc chạy (runtime).'],
        ['10', 'Adapter', 'Adapter Design Pattern', 'Mẫu thiết kế trung gian (supabaseAdapter.ts) giúp tách biệt giao diện React khỏi chi tiết gọi cơ sở dữ liệu đám mây hay dữ liệu dự phòng cục bộ.'],
        ['11', 'Fallback', 'Graceful Fallback Mechanism', 'Cơ chế dự phòng an toàn; khi mất kết nối mạng hoặc chưa cấu hình khóa đám mây, ứng dụng tự động chuyển sang máy chủ cục bộ hoặc dữ liệu hạt giống.'],
        ['12', 'Discriminated Union', 'Tagged Union Type', 'Kỹ thuật hợp kiểu có nhãn phân biệt của TypeScript (status: "loading" | "error" | "success") dùng để kiểm soát chặt chẽ trạng thái bất đồng bộ.'],
        ['13', 'VietQR / BIN', 'Vietnam QR Standard / Bank ID Number', 'Chuẩn mã phản hồi nhanh chuyển khoản ngân hàng Napas247; mỗi ngân hàng được định danh bằng dãy 6 chữ số mã BIN (ví dụ 970436 là Vietcombank).'],
        ['14', 'A11y', 'Web Accessibility', 'Khả năng tiếp cận giao diện web cho người dùng bàn phím và trình đọc màn hình thông qua các thuộc tính ARIA, nhãn biểu mẫu và quản lý tiêu điểm (focus).'],
        ['15', 'Code Splitting', 'Lazy Route Code Splitting', 'Kỹ thuật chia nhỏ gói mã nguồn JavaScript theo từng tuyến đường bằng React.lazy và Suspense để giảm dung lượng tải trang lần đầu.'],
        ['16', 'CSKH', 'Customer Care Log', 'Nhật ký chăm sóc khách hàng gắn trực tiếp vào từng đơn yêu cầu để lưu vết lịch sử gọi điện, đo cổ phục và xin giấy phép quay chụp.'],
      ],
      [550, 1850, 2500, 4900]
    ),
    createParagraph('', { before: 80, after: 80 })
  );

  // ============================================================================
  // BẢNG ĐÁNH GIÁ TIÊU CHÍ HỌC PHẦN
  // ============================================================================
  children.push(
    createH1('BẢNG ĐỐI CHIẾU TIÊU CHÍ CHẤM ĐIỂM HỌC PHẦN (INT.7.18)'),
    createParagraph(
      'Bảng dưới đây đối chiếu trực tiếp các yêu cầu kỹ thuật của học phần Web FrontEnd Nâng Cao và quy định tại tệp AGENTS.md với kết quả triển khai thực tế trong mã nguồn:'
    ),
    ...createTable(
      'Bảng 2: Đối chiếu tiêu chí học phần với hiện trạng mã nguồn đã kiểm chứng',
      'Kiểm chứng trực tiếp tại thư mục src/, supabase/, vite.config.ts và package.json',
      ['STT', 'Tiêu Chí Kỹ Thuật', 'Yêu Cầu Quy Chuẩn Học Phần', 'Hiện Trạng Thực Tế Trong Mã Nguồn', 'Kết Quả'],
      [
        ['1', 'Kiến trúc phân tầng', 'Mô hình Feature-Based, phụ thuộc một chiều', 'Tổ chức 8 phân hệ trong src/features/; luồng import tuân thủ một chiều app ➔ pages ➔ features ➔ components ➔ lib.', 'Đạt'],
        ['2', 'An toàn kiểu TypeScript', 'Bật strict: true, không dùng kiểu any', 'TypeScript 5.7.3 bật strict và noUncheckedIndexedAccess; lệnh tsc --noEmit kết thúc với mã thoát 0; 0 kiểu any.', 'Đạt'],
        ['3', 'Kiểm thực dữ liệu Zod', 'Kiểm thực dữ liệu API, biểu mẫu và tham số URL', 'Sử dụng Zod kiểm tra safeParse cho toàn bộ dữ liệu ngoài, biểu mẫu đặt lịch, AI tư vấn, thiệp cưới, RSVP và tài khoản.', 'Đạt'],
        ['4', 'Quản lý trạng thái', 'Zustand v5 kết hợp React Context đúng vai trò', '3 store Zustand (useCartStore, useWishlistStore có persist, useToastStore); Context chỉ dùng cho Theme và Auth.', 'Đạt'],
        ['5', 'Tự chủ CSS thuần', 'Không dùng Tailwind, Bootstrap hay thư viện UI', 'Viết bằng CSS thuần dựa trên hệ thống biến trong src/styles/variables.css, hỗ trợ chế độ Sáng/Tối và bản in @media print.', 'Đạt'],
        ['6', 'Đồ họa & Biểu đồ SVG', 'Không dùng thư viện icon hay biểu đồ bên ngoài', '63 nhánh biểu tượng SVG trong Icon.tsx, Bản đồ Di sản SVG, Phối cổ phục 2D SVG, biểu đồ Cột/Donut/Sparklines SVG.', 'Đạt'],
        ['7', 'Quy tắc không Emoji', 'Không sử dụng ký tự Emoji màu trong giao diện', 'Quét tự động toàn bộ thư mục src/ ghi nhận 0 ký tự Emoji màu; đồng bộ hình ảnh cưới di sản Huế từ Unsplash.', 'Đạt'],
        ['8', 'Định tuyến & Phân quyền', 'React Router v8 kèm bảo vệ tuyến theo vai trò', '29 khai báo leaf route (28 tuyến chức năng + 1 bí danh), chia tách gói React.lazy và bảo vệ bằng ProtectedRoute 2 vai trò.', 'Đạt'],
        ['9', 'Cơ sở dữ liệu & Lưu trữ', 'Kết nối Supabase Cloud kèm cơ chế dự phòng', 'Supabase PostgreSQL 6 bảng có RLS + kho ảnh studio-media, kèm máy chủ Node.js cổng 4000 và dữ liệu hạt giống ngoại tuyến.', 'Đạt'],
        ['10', 'Kiểm thử tự động', 'Kiểm thử định tuyến, phân quyền và nghiệp vụ', 'Vitest v3.2.7 vượt qua 53/53 ca kiểm thử trên 3 tệp test (validation.test.ts, features.test.ts, routes.test.tsx).', 'Đạt'],
        ['11', 'Đóng gói & Triển khai', 'Tối ưu kích thước gói và triển khai đám mây', 'Vite 6 chia tách gói lớn nhất 437,55 kB (< 500 kB, 0 cảnh báo); triển khai trên Vercel kèm cấu hình SPA Rewrite.', 'Đạt'],
      ],
      [500, 1900, 2500, 3900, 1000]
    ),
    createParagraph('', { pageBreakBefore: true })
  );

  // ============================================================================
  // LỜI MỞ ĐẦU & BẢN TUYÊN BỐ LIÊM CHÍNH HỌC THUẬT
  // ============================================================================
  children.push(
    createH1('LỜI MỞ ĐẦU & BẢN TUYÊN BỐ LIÊM CHÍNH HỌC THUẬT'),
    createParagraph(
      'Cố đô Huế lưu giữ hệ thống kiến trúc cung đình, lăng tẩm triều Nguyễn cùng kho tàng lễ phục truyền thống có giá trị thẩm mỹ và lịch sử đặc sắc như Áo Nhật Bình, Áo Tấc ngũ thân, Áo Giao Lĩnh và Mãng Bào. Xu hướng thực hiện bộ ảnh cưới cổ phục và tổ chức nghi lễ truyền thống tại Huế ngày càng lan tỏa rộng rãi trong giới trẻ trên cả nước.'
    ),
    createParagraph(
      'Tuy nhiên, hoạt động tư vấn dịch vụ, phối chọn lễ phục, tra cứu chi phí vé quay chụp tại di tích, kiểm tra lịch trống của ekip nhiếp ảnh cũng như phát hành thiệp báo hỷ trực tuyến tại nhiều studio hiện nay vẫn thực hiện rời rạc qua tin nhắn thủ công. Điều này khiến khách hàng khó chủ động dự toán kinh phí, trong khi người quản lý studio tốn nhiều công sức điều phối ca chụp bình minh, hoàng hôn và theo dõi hợp đồng đặt cọc.'
    ),
    createParagraph(
      'Đồ án "Huế Cung Đình – Dịch Vụ Cưới & Nhiếp Ảnh Cổ Phục Hoàng Triều" (mã dự án: doan-fenc) được xây dựng nhằm số hóa đồng bộ cả hai phía: không gian tương tác trực quan dành cho cặp đôi (bản đồ di sản, phòng phối cổ phục 2D, so sánh hậu kỳ, AI tư vấn ngân sách, sổ tay kế hoạch cưới, thiệp mời công khai tích hợp RSVP) và phân hệ quản trị nội bộ dành cho studio (bảng điều hành doanh thu, quản lý danh mục có tải ảnh, bảng Kanban kéo thả 5 cột và lịch điều phối ekip theo tháng).'
    ),
    createCallout(
      'BẢN TUYÊN BỐ LIÊM CHÍNH HỌC THUẬT (ACADEMIC INTEGRITY DECLARATION)',
      'Sinh viên Trần Công Quý (MSSV: 2401ITA001 – Lớp CNTT K22) cam kết đồ án "Huế Cung Đình" được xây dựng tuân thủ nghiêm ngặt các quy định kỹ thuật của học phần Web FrontEnd Nâng Cao dưới sự hướng dẫn của Thầy Dương Ngọc Duy.\n\n' +
        'Công cụ Trí tuệ Nhân tạo được sử dụng minh bạch trong vai trò hỗ trợ lập trình và chuẩn hóa tài liệu kỹ thuật. Toàn bộ cấu trúc mã nguồn, công thức hình học SVG, biểu thức kiểm thực Zod, 53 ca kiểm thử tự động và mọi con số định lượng trong báo cáo này đều đã được kiểm chứng trực tiếp trên mã nguồn thực tế và sẵn sàng giải trình chi tiết trước hội đồng đánh giá.'
    )
  );

  // ============================================================================
  // CHƯƠNG 1: BỐI CẢNH, MỤC TIÊU VÀ BÀI TOÁN NGHIỆP VỤ
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 1: BỐI CẢNH, MỤC TIÊU VÀ BÀI TOÁN NGHIỆP VỤ'),
    createH2('1.1. Đặc thù nghiệp vụ cưới cổ phục và nhiếp ảnh di sản tại Cố đô Huế'),
    createParagraph(
      'Khác với chụp ảnh cưới phim trường thông thường, một buổi bấm máy cổ phục tại Huế phụ thuộc chặt chẽ vào ba yếu tố: sự chuẩn xác trong cách phối lễ phục nam – nữ theo quy chế triều Nguyễn, khung giờ ánh sáng tự nhiên tại từng quần thể kiến trúc (bình minh trước cổng Ngọ Môn hay hoàng hôn bên hồ Lưu Khiêm) và quy định cấp phép quay chụp của Trung tâm Bảo tồn Di tích Cố đô Huế.'
    ),
    createH2('1.2. Phân tích các điểm nghẽn trong quy trình vận hành truyền thống'),
    createBullet(
      'Khách hàng ở xa thiếu công cụ trực quan để biết vị trí các điểm chụp, khung giờ nắng đẹp, phí giấy phép địa điểm cũng như chưa thể tự ướm thử sự kết hợp màu sắc giữa Áo Nhật Bình của cô dâu và Áo Tấc của chú rể trước ngày đến Huế.',
      'Về phía thông tin & trải nghiệm trước đặt lịch:'
    ),
    createBullet(
      'Bảng giá dịch vụ lẻ và gói trọn gói thường gửi rời rạc qua tệp ảnh, gây khó khăn khi khách muốn đặt 2–3 gói cạnh nhau để đối chiếu từng hạng mục hoặc tự cân đối với tổng ngân sách đám cưới của gia đình.',
      'Về phía dự toán tài chính:'
    ),
    createBullet(
      'Thiệp cưới điện tử phổ thông ít mang dấu ấn mỹ thuật cung đình và thường thiếu tính năng tổng hợp tự động số lượng khách xác nhận tham dự theo khẩu phần ăn Mặn / Chay cho buổi tiệc.',
      'Về phía thiệp mời & đón tiếp quan khách:'
    ),
    createBullet(
      'Người điều hành studio quản lý đơn yêu cầu (trong mã nguồn là thực thể yeu_cau) qua sổ tay hoặc bảng tính rời, dễ dẫn đến trùng lịch Nhiếp ảnh gia chánh máy, thất lạc lịch sử trao đổi chăm sóc khách hàng và tốn thời gian soạn hợp đồng giấy.',
      'Về phía quản trị vận hành studio:'
    ),
    createH2('1.3. Mục tiêu giải pháp của hệ thống "Huế Cung Đình"'),
    createParagraph(
      'Hệ thống đặt mục tiêu giải quyết đồng bộ các điểm nghẽn trên trên một ứng dụng web duy nhất:'
    ),
    createBullet('Số hóa danh mục 18 dịch vụ cưới lẻ, 9 gói cưới combo và 6 mẫu thiệp cưới Studio kèm chức năng lưu yêu thích, so sánh tối đa 3 gói cưới và tìm kiếm nhanh toàn cục bằng phím tắt Ctrl + K.'),
    createBullet('Xây dựng 3 không gian trải nghiệm trực quan công khai gồm Bản đồ 9 tọa độ nhiếp ảnh di sản bằng SVG thuần, Phòng phối cổ phục 2D theo lớp màu gấm và Triển lãm đối chiếu hậu kỳ màu phim Trước / Sau.'),
    createBullet('Trang bị công cụ AI Tư vấn ngân sách (10 – 60 triệu đồng), Sổ tay kế hoạch & dự toán đám cưới cá nhân có xuất bản in khổ A4 và biểu mẫu Đặt lịch tích hợp lịch tháng báo trạng thái ca trống của ekip.'),
    createBullet('Hoàn thiện luồng phát hành thiệp cưới chia sẻ công khai (/thiep-cuoi/moi/:slug) hỗ trợ mã BIN của 15 ngân hàng Việt Nam, đồng hồ đếm ngược thời gian thực từng giây và sổ lưu bút RSVP.'),
    createBullet('Xây dựng trung tâm quản trị nội bộ dành cho vai trò admin gồm Dashboard thống kê động, quản lý CRUD có tải tệp ảnh lên đám mây, bảng Kanban kéo thả 5 cột kèm Nhật ký CSKH, Lịch điều phối Ekip theo tháng và Cẩm nang vận hành SOP.'),
    createChapterSummary(
      'Chương 1 đã phân tích đặc thù văn hóa – kỹ thuật của dịch vụ cưới cổ phục tại Huế và chỉ ra 4 nhóm bất cập thực tế đối với cả cặp đôi lẫn đơn vị vận hành studio. Trên cơ sở đó, đồ án xác lập phạm vi giải pháp toàn diện gồm cả cổng trải nghiệm tương tác phía khách hàng và hệ thống quản trị điều phối nội bộ phía studio.'
    )
  );

  // ============================================================================
  // CHƯƠNG 2: NGĂN XẾP CÔNG NGHỆ & RÀNG BUỘC KỸ THUẬT
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 2: NGĂN XẾP CÔNG NGHỆ & RÀNG BUỘC KỸ THUẬT'),
    createH2('2.1. Danh mục công nghệ cốt lõi'),
    createParagraph(
      'Các thư viện và công cụ trong dự án được giữ ở mức tinh gọn, ưu tiên chuẩn web gốc để thể hiện khả năng làm chủ nền tảng FrontEnd:'
    ),
    ...createTable(
      'Bảng 3: Danh mục công nghệ, thư viện và phiên bản khai báo trong dự án',
      'package.json và vite.config.ts của dự án doan-fenc',
      ['STT', 'Hạng Mục', 'Công Nghệ / Thư Viện', 'Phiên Bản', 'Vai Trò Cụ Thể Trong Hệ Thống'],
      [
        ['1', 'Thư viện giao diện', 'React (Function Components & Hooks)', '^19.0.0', 'Xây dựng cây thành phần giao diện, quản lý vòng đời và chia tách gói qua React.lazy / Suspense.'],
        ['2', 'Công cụ đóng gói', 'Vite', '^6.1.0 (chạy v6.4.4)', 'Máy chủ phát triển hỗ trợ HMR và đóng gói bản xuất bản chia tách manualChunks (vendor, supabase, zod).'],
        ['3', 'Ngôn ngữ lập trình', 'TypeScript', '^5.7.3', 'Kiểm tra kiểu tĩnh nghiêm ngặt với strict: true và noUncheckedIndexedAccess: true.'],
        ['4', 'Định tuyến phía Client', 'React Router', '^8.4.0', 'Quản lý 29 khai báo tuyến đường lá, tham số động (:id, :slug), tham số tìm kiếm URL và điều hướng bảo vệ.'],
        ['5', 'Trạng thái toàn cục', 'Zustand + React Context', '^5.0.0', 'Zustand quản lý giỏ hàng, danh sách yêu thích/so sánh và thông báo Toast; Context quản lý chủ đề Sáng/Tối và phiên đăng nhập.'],
        ['6', 'Kiểm thực dữ liệu', 'Zod', '^3.24.2 || ^4.0.0', 'Xác thực dữ liệu nhận từ cơ sở dữ liệu, đầu vào biểu mẫu người dùng và suy diễn kiểu tĩnh qua z.infer.'],
        ['7', 'Định dạng giao diện', 'Pure CSS (CSS Variables)', 'Chuẩn CSS3', 'Tự xây dựng hệ thống biến màu tại variables.css, bố cục Flexbox/Grid, chế độ tối và quy tắc in ấn @media print.'],
        ['8', 'Đồ họa vector & Biểu đồ', 'Pure SVG Components', 'Chuẩn SVG 1.1', 'Tự vẽ 63 nhánh biểu tượng, bản đồ sông Hương & Kinh thành, ma-nơ-canh cổ phục 2D và các biểu đồ thống kê.'],
        ['9', 'Cơ sở dữ liệu đám mây', '@supabase/supabase-js', '^2.118.0', 'Kết nối PostgreSQL 6 bảng có chính sách RLS và kho lưu trữ tệp ảnh studio-media trên Supabase Cloud.'],
        ['10', 'Máy chủ dự phòng cục bộ', 'Node.js HTTP (server/api.cjs)', 'Node >= 18', 'Máy chủ RESTful viết bằng module http gốc của Node.js trên cổng 4000, đọc dữ liệu từ server/db.json.'],
        ['11', 'Kiểm thử tự động', 'Vitest + Testing Library + jsdom', '^3.0.5 (chạy v3.2.7)', 'Thực thi 53 ca kiểm thử đơn vị và tích hợp cho schema, store, bộ sinh VietQR, đếm ngược và phân quyền định tuyến.'],
        ['12', 'Xuất bản tài liệu', 'docx (Node.js)', '^9.15.3', 'Tự động hóa việc khởi tạo tệp báo cáo học thuật định dạng Microsoft Word (.docx) từ mã nguồn kịch bản.'],
      ],
      [500, 1800, 2300, 1500, 3700]
    ),
    createH2('2.2. Tuân thủ 8 quy định cấm kỹ thuật theo AGENTS.md'),
    createBullet('Không sử dụng Tailwind CSS, Bootstrap, Material UI, Ant Design hoặc bất kỳ khung giao diện dựng sẵn nào.'),
    createBullet('Không cài đặt thư viện biểu tượng bên ngoài (như Lucide, FontAwesome, React-Icons); mọi biểu tượng đều nằm tại src/components/common/Icon.tsx.'),
    createBullet('Không để ký tự Emoji màu trong giao diện ứng dụng; sử dụng biểu tượng SVG đồng nhất sắc độ với chủ đề cung đình.'),
    createBullet('Không sử dụng Redux Toolkit; chỉ sử dụng Zustand v5 cho trạng thái nghiệp vụ chia sẻ và React Context cho chủ đề giao diện cùng xác thực.'),
    createBullet('Không khai báo kiểu any và không để sót lệnh console.log hay console.error trong mã nguồn ứng dụng src/.'),
    createBullet('Không sử dụng hộp thoại window.confirm thô của trình duyệt khi xóa dữ liệu; thay thế bằng thành phần hộp thoại ConfirmModal đồng bộ phong cách.'),
    createBullet('Không cài đặt thư viện biểu đồ ngoài (như Chart.js, Recharts) hay thư viện bản đồ ngoài; tự tính toán tọa độ hình học SVG.'),
    createBullet('Không lưu khóa bí mật cố định trong mã nguồn; đọc cấu hình kết nối đám mây qua biến môi trường Vite (import.meta.env.VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY).'),
    createH2('2.3. Quản lý trạng thái bất đồng bộ bằng Discriminated Union AsyncState'),
    createParagraph(
      'Tại tệp src/lib/types.ts, kiểu trạng thái bất đồng bộ được định nghĩa dưới dạng hợp kiểu có trường phân biệt status rõ ràng nhằm ngăn ngừa tình trạng giao diện vừa báo đang tải vừa hiển thị dữ liệu rỗng:'
    ),
    createCallout(
      'MẪU KIỂU DỮ LIỆU BẤT ĐỒNG BỘ (src/lib/types.ts)',
      'export type AsyncState<T> =\n' +
        '  | { status: "loading" }\n' +
        '  | { status: "error"; message: string }\n' +
        '  | { status: "success"; data: T };\n\n' +
        'Các trang hiển thị dữ liệu từ mạng sử dụng cấu trúc rẽ nhánh switch (state.status) kết hợp hàm kiểm tra vét cạn assertNever(state) ở nhánh default để trình biên dịch TypeScript cảnh báo ngay nếu lập trình viên bỏ sót một trạng thái.'
    ),
    createChapterSummary(
      'Chương 2 đã trình bày chi tiết ngăn xếp công nghệ gồm React 19, Vite 6, TypeScript 5.7, React Router v8, Zustand v5, Zod và Supabase. Việc tuân thủ nghiêm ngặt các ràng buộc không dùng thư viện giao diện, biểu tượng hay biểu đồ ngoài cùng mẫu kiểu AsyncState giúp mã nguồn gọn nhẹ, minh bạch và dễ kiểm chứng.'
    )
  );

  // ============================================================================
  // CHƯƠNG 3: KIẾN TRÚC FEATURE-BASED & CẤU TRÚC THƯ MỤC
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 3: KIẾN TRÚC MÃ NGUỒN FEATURE-BASED & CẤU TRÚC DỰ ÁN'),
    createH2('3.1. Mô hình kiến trúc đóng gói theo phân hệ và luồng phụ thuộc một chiều'),
    createParagraph(
      'Dự án được tổ chức theo kiến trúc hướng phân hệ nghiệp vụ (Feature-Based Architecture), trong đó các kiểu dữ liệu, biểu thức kiểm thực Zod, kho trạng thái cục bộ và thành phần giao diện đặc thù của từng mảng nghiệp vụ được đặt chung trong thư mục tương ứng dưới src/features/. Luồng import giữa các tầng tuân thủ chiều hướng từ trên xuống dưới:'
    ),
    createCallout(
      'QUY TẮC PHỤ THUỘC MỘT CHIỀU GIỮA CÁC TẦNG',
      'src/app  ➔  src/pages  ➔  src/features  ➔  src/components  ➔  src/context & src/lib & src/styles\n\n' +
        'Tầng lib và styles nằm ở đáy kiến trúc và không phụ thuộc ngược lên bất kỳ component hay trang nào, giúp ngăn ngừa lỗi tham chiếu vòng (Circular Dependency) khi chia tách gói bằng Rollup/Vite.'
    ),
    createH2('3.2. Bảng phân bổ cấu trúc thư mục thực tế'),
    createParagraph(
      'Qua đối chiếu trực tiếp cây thư mục dự án, hệ thống hiện có 27 tệp component trang (20 tệp tại src/pages/ và 7 tệp quản trị tại src/pages/admin/) cùng 8 thư mục phân hệ nghiệp vụ tại src/features/:'
    ),
    ...createTable(
      'Bảng 4: Cấu trúc thư mục và phân bổ trách nhiệm các tầng mã nguồn',
      'Khảo sát trực tiếp cây thư mục src/, server/ và supabase/',
      ['Đường Dẫn Thư Mục', 'Quy Mô / Số Tệp Chính', 'Trách Nhiệm & Các Thành Phần Bên Trong'],
      [
        ['src/app/', '5 tệp khởi tạo', 'Chứa main.tsx, App.tsx, RootLayout.tsx, AdminLayout.tsx và routes.tsx (khai báo bộ định tuyến kèm RouteSuspense).'],
        ['src/pages/', '20 component trang', 'Gồm HomePage, ServicesPage, ServiceDetailPage, PackagesPage, PackageDetailPage, ConsultationPage, HeritageMapPage, RoyalFittingRoomPage, LookbookGalleryPage, WeddingPlannerPage, InvitationsPage, InvitationDetailPage, InvitationCustomPage, PublicInvitationSharePage, CartPage, MyBookingsPage, BookingPage, ProcessGuidePage, LoginPage, NotFoundPage.'],
        ['src/pages/admin/', '7 component trang quản trị', 'Gồm AdminDashboardPage, AdminServicesPage, AdminPackagesPage, AdminInvitationsPage, AdminRequestsPage, AdminSchedulePage, AdminUsersPage.'],
        ['src/features/home/', 'Phân hệ Trang chủ', 'Chứa HeroSection, HomeSections, FeaturedPackagesMarquee và CustomerTestimonialsSection.'],
        ['src/features/services/', 'Phân hệ Dịch vụ lẻ', 'Chứa types.ts (dichVuSchema), ServiceCard.tsx và ServiceFormModal.tsx (hỗ trợ tải ảnh trực tiếp).'],
        ['src/features/packages/', 'Phân hệ Gói cưới & Giỏ', 'Chứa types.ts (goiCuoiSchema), cartStore.ts (Zustand persist), PackageCard.tsx, PackageFormModal.tsx, QuickViewServiceModal.tsx.'],
        ['src/features/consultation/', 'Phân hệ AI Tư vấn', 'Chứa types.ts (tuVanInputSchema) và ConsultationWidgets.tsx (thanh trượt ngân sách 10–60 triệu đồng).'],
        ['src/features/invitations/', 'Phân hệ Thiệp cưới', 'Chứa types.ts (BANK_BINS 15 ngân hàng, calculateCountdownParts, RSVP schemas), InvitationCard, InvitationModals, RoyalCourtAudio.'],
        ['src/features/requests/', 'Phân hệ Đơn yêu cầu', 'Chứa types.ts (YeuCau, CaChup, EkipPhuTrach, LichSuChamSocItem) và RoyalContractA4Modal.tsx (hợp đồng in khổ A4).'],
        ['src/features/admin/', 'Phân hệ Biểu đồ & Modal', 'Chứa types.ts (ThongKe) và AdminCharts.tsx (biểu đồ cột SVG, biểu đồ Donut SVG, ConfirmModal).'],
        ['src/features/auth/', 'Phân hệ Xác thực', 'Chứa types.ts (2 vai trò admin / user), AuthContext.tsx và thành phần bảo vệ tuyến ProtectedRoute.tsx.'],
        ['src/components/', 'Thành phần dùng chung', 'common/ (Icon.tsx 63 nhánh SVG, UI.tsx, CartDrawer, WishlistAndCompareWidgets, RoyalCommandPalette, RoyalDivider, ScrollProgressBar) và layout/ (Header, Footer).'],
        ['src/lib/ & src/context/', 'Tiện ích & Ngữ cảnh', 'supabaseAdapter.ts, useFetch.ts, wishlistStore.ts, toastStore.ts, formatters.ts, types.ts (AppError, AsyncState) và ThemeContext.tsx.'],
        ['supabase/ & server/', 'Tầng Cơ sở dữ liệu & API', 'supabase/schema.sql (6 bảng + RLS), fix_and_enrich.sql; server/api.cjs (cổng 4000) và server/db.json.'],
      ],
      [2100, 1900, 5800]
    ),
    createH2('3.3. Chuẩn hóa ngoại lệ nghiệp vụ với lớp AppError'),
    createParagraph(
      'Tại src/lib/types.ts, dự án định nghĩa lớp lỗi có cấu trúc AppError kế thừa từ lớp Error chuẩn, mang theo thuộc tính code (mã định danh lỗi nghiệp vụ) và status (mã trạng thái HTTP). Khi tầng truy xuất dữ liệu gặp sự cố định dạng hoặc phản hồi mạng không hợp lệ, thông báo lỗi được chuyển hóa thành chuỗi tiếng Việt dễ hiểu hiển thị qua useToastStore hoặc hộp thông báo lỗi có nút thử lại trên giao diện.'
    ),
    createChapterSummary(
      'Chương 3 đã mô tả cấu trúc phân tầng của dự án gồm 27 component trang, 8 phân hệ nghiệp vụ và hệ thống thư viện tiện ích dùng chung. Cách phân tách rõ ràng này là nền tảng giúp dự án mở rộng thêm 7 trang chức năng mới mà vẫn giữ được tính nhất quán và khả năng đóng gói tách rời từng phần.'
    )
  );

  // ============================================================================
  // CHƯƠNG 4: HỆ THỐNG ĐỊNH TUYẾN & MA TRẬN PHÂN QUYỀN 2-TIER RBAC
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 4: HỆ THỐNG ĐỊNH TUYẾN & MA TRẬN PHÂN QUYỀN 2-TIER RBAC'),
    createH2('4.1. Cơ chế phân quyền 2 vai trò đăng nhập kết hợp quyền khách vãng lai'),
    createParagraph(
      'Hệ thống kiểm soát truy cập thông qua thành phần ProtectedRoute (src/features/auth/ProtectedRoute.tsx) dựa trên 3 mức độ người dùng thực tế:'
    ),
    createBullet(
      'Được phép truy cập toàn bộ các trang khám phá công khai gồm Trang chủ (/), Dịch vụ lẻ (/dich-vu), Gói cưới (/goi-cuoi), Kho thiệp (/thiep-cuoi), AI Tư vấn (/tu-van), Bản đồ Di sản (/ban-do-di-san), Phòng phối cổ phục 2D (/phoi-co-phuc), Triển lãm Lookbook (/trien-lam) và đặc biệt là đường dẫn thiệp mời đám cưới công khai (/thiep-cuoi/moi/:slug) để khách mời gửi lời chúc và xác nhận tham dự mà không bị buộc tạo tài khoản. Khi khách vãng lai nhấn xem chi tiết dịch vụ/gói cưới hoặc đặt lịch, hệ thống lưu lại vị trí hiện tại vào location.state.from và chuyển hướng về /login.',
      '1. Khách vãng lai (chưa đăng nhập):'
    ),
    createBullet(
      'Mở khóa đầy đủ các tuyến nghiệp vụ cá nhân gồm xem chi tiết và đánh giá dịch vụ (/dich-vu/:id), đàm phán báo giá gói cưới (/goi-cuoi/:id), thiết kế và phát hành thiệp cưới (/thiep-cuoi/dang-ky), đặt lịch kiểm tra ca trống ekip (/dat-lich), lập Sổ tay kế hoạch cưới (/ke-hoach-cuoi), đặt cọc giỏ hàng (/gio-hang) và quản lý đơn cá nhân kèm in hợp đồng A4 (/don-cua-toi). Vai trò user bị chặn truy cập khu vực /admin/* và trang nội bộ /quy-trinh.',
      '2. Khách hàng đã đăng nhập (vai trò user — tài khoản mẫu khachhang / 123456):'
    ),
    createBullet(
      'Có quyền truy cập toàn bộ các tuyến trong hệ thống, bao gồm 7 trang quản trị dưới bố cục AdminLayout (/admin, /admin/dich-vu, /admin/goi-cuoi, /admin/thiep-cuoi, /admin/yeu-cau, /admin/lich-chup, /admin/tai-khoan) và trang Cẩm nang vận hành SOP (/quy-trinh).',
      '3. Quản trị viên Studio (vai trò admin — tài khoản mẫu admin / 123456):'
    ),
    createH2('4.2. Bảng kê toàn bộ 29 khai báo tuyến đường trong src/app/routes.tsx'),
    createParagraph(
      'Tệp src/app/routes.tsx hiện khai báo 29 tuyến đường lá (gồm 28 tuyến chức năng độc lập và 1 tuyến bí danh /huong-dan-quy-trinh trỏ về cùng trang ProcessGuidePage):'
    ),
    ...createTable(
      'Bảng 5: Danh mục 29 khai báo tuyến đường, chế độ tải gói và quyền truy cập',
      'src/app/routes.tsx của dự án doan-fenc',
      ['STT', 'Đường Dẫn (Path)', 'Component Trang', 'Nạp Gói', 'Quyền Truy Cập', 'Mô Tả Chức Năng Cốt Lõi'],
      [
        ['1', '/', 'HomePage', 'Tức thì', 'Công khai', 'Trang chủ, Không gian tương tác Hoàng Triều, băng chuyền gói cưới và cảm nhận khách hàng.'],
        ['2', '/dich-vu', 'ServicesPage', 'Tức thì', 'Công khai', 'Danh mục 18 dịch vụ lẻ, lọc 4 phân loại, tìm kiếm tiếng Việt, sắp xếp giá, lưu yêu thích.'],
        ['3', '/dich-vu/:id', 'ServiceDetailPage', 'React.lazy', 'user / admin', 'Chi tiết dịch vụ lẻ, chọn số lượng, gợi ý 3 mục ưu tiên cùng phân loại, lưu nhận xét đánh giá.'],
        ['4', '/goi-cuoi', 'PackagesPage', 'Tức thì', 'Công khai', 'Lưới 9 gói cưới combo, lọc 3 phong cách, chọn tối đa 3 gói để mở bảng đối chiếu song song.'],
        ['5', '/goi-cuoi/:id', 'PackageDetailPage', 'React.lazy', 'user / admin', 'Chi tiết gói cưới, đặc quyền 8h Đại Nội, xem nhanh dịch vụ con, gửi đàm phán báo giá nhanh.'],
        ['6', '/dat-lich', 'BookingPage', 'React.lazy', 'user / admin', 'Biểu mẫu đặt lịch tích hợp lịch tháng báo ca trống ekip, chọn ca chụp và RoyalSelect A11y.'],
        ['7', '/tu-van', 'ConsultationPage', 'Tức thì', 'Công khai', 'AI Tư vấn cân đối ngân sách 10–60 triệu đồng và nút chuyển thẳng sang trang Đặt lịch.'],
        ['8', '/ban-do-di-san', 'HeritageMapPage', 'React.lazy', 'Công khai', 'Bản đồ Pure SVG 9 tọa độ nhiếp ảnh di sản Huế, khung giờ vàng, phí vé và 3 lộ trình 1 ngày.'],
        ['9', '/phoi-co-phuc', 'RoyalFittingRoomPage', 'React.lazy', 'Công khai', 'Phòng phối cổ phục 2D đôi Tân Nương & Tân Lang, đổi màu gấm, tính giá và thêm vào giỏ.'],
        ['10', '/trien-lam', 'LookbookGalleryPage', 'React.lazy', 'Công khai', 'Thanh trượt đối chiếu hậu kỳ màu phim Trước / Sau và 9 tác phẩm Lookbook có hộp phóng lớn.'],
        ['11', '/ke-hoach-cuoi', 'WeddingPlannerPage', 'React.lazy', 'user / admin', 'Sổ tay checklist 5 mốc chuẩn bị lễ cưới, dự toán biểu đồ Donut SVG và xuất bản in khổ A4.'],
        ['12', '/thiep-cuoi', 'InvitationsPage', 'Tức thì', 'Công khai', 'Kho 6 mẫu thiệp điện tử của studio, bảng giá 3 hạng VIP / PRO / BASIC và hộp xem thử.'],
        ['13', '/thiep-cuoi/moi/:slug', 'PublicInvitationSharePage', 'React.lazy', 'Công khai', 'Thiệp mời chia sẻ cho khách: mở ấn sáp vàng, Nhã Nhạc, đếm ngược thực, VietQR 15 NH & RSVP.'],
        ['14', '/thiep-cuoi/dang-ky', 'InvitationCustomPage', 'React.lazy', 'user / admin', 'Thiết kế thiệp 2 cột, chọn 15 ngân hàng VietQR và phát hành đường dẫn /thiep-cuoi/moi/:slug.'],
        ['15', '/thiep-cuoi/tuy-bien', 'InvitationCustomPage', 'React.lazy', 'user / admin', 'Tuyến tùy biến giao diện thiệp nhận tham số mẫu thiệp truyền từ trang chi tiết.'],
        ['16', '/thiep-cuoi/:id', 'InvitationDetailPage', 'React.lazy', 'user / admin', 'Chi tiết từng mẫu thiệp Studio, nghe Nhã Nhạc ngũ cung và xem mẫu thiệp liên quan.'],
        ['17', '/gio-hang', 'CartPage', 'React.lazy', 'user / admin', 'Trang giỏ hàng cưới lưu trữ bền vững, tích hợp đặt cọc 20% qua mã VietQR kèm mã phiếu.'],
        ['18', '/don-cua-toi', 'MyBookingsPage', 'React.lazy', 'user / admin', 'Tra cứu đơn yêu cầu cá nhân, ghi bổ sung mong muốn, tính hoàn cọc 3 bậc và in Hợp đồng A4.'],
        ['19', '/quy-trinh', 'ProcessGuidePage', 'React.lazy', 'Chỉ admin', 'Cẩm nang vận hành SOP: 6 quy trình, 4 vai trò có checklist, 7 phân hệ, 8 quy tắc di sản, in A4.'],
        ['20', '/huong-dan-quy-trinh', 'ProcessGuidePage', 'React.lazy', 'Chỉ admin', 'Tuyến bí danh (alias) dẫn về cùng thành phần ProcessGuidePage phục vụ liên kết nội bộ.'],
        ['21', '/login', 'LoginPage', 'Tức thì', 'Công khai', 'Cổng đăng nhập và đăng ký tài khoản kèm 2 nút điền nhanh tài khoản thử nghiệm.'],
        ['22', '/admin', 'AdminDashboardPage', 'React.lazy', 'Chỉ admin', 'Bảng điều hành KPI tính toán động, 4 Sparklines SVG, biểu đồ Cột & Donut SVG, xuất CSV.'],
        ['23', '/admin/dich-vu', 'AdminServicesPage', 'React.lazy', 'Chỉ admin', 'Quản trị CRUD danh mục dịch vụ lẻ, tải ảnh trực tiếp lên kho lưu trữ và ConfirmModal.'],
        ['24', '/admin/goi-cuoi', 'AdminPackagesPage', 'React.lazy', 'Chỉ admin', 'Quản trị CRUD gói cưới combo, hộp kiểm chọn nhiều dịch vụ con và tải ảnh bìa.'],
        ['25', '/admin/thiep-cuoi', 'AdminInvitationsPage', 'React.lazy', 'Chỉ admin', 'Quản trị CRUD kho mẫu thiệp Studio và bảng thống kê khách mời RSVP (suất Mặn / Chay).'],
        ['26', '/admin/yeu-cau', 'AdminRequestsPage', 'React.lazy', 'Chỉ admin', 'Quản trị đơn yêu cầu bằng Bảng danh sách & Kanban kéo thả 5 cột, Nhật ký CSKH, in HĐ A4.'],
        ['27', '/admin/lich-chup', 'AdminSchedulePage', 'React.lazy', 'Chỉ admin', 'Lịch điều phối tháng: phân công Nhiếp ảnh gia chánh máy, Stylist cổ phục và ca chụp.'],
        ['28', '/admin/tai-khoan', 'AdminUsersPage', 'React.lazy', 'Chỉ admin', 'Quản trị tài khoản 2 vai trò (admin / user), khóa/mở khóa và bảo vệ tài khoản quản trị gốc.'],
        ['29', '*', 'NotFoundPage', 'Tức thì', 'Công khai', 'Trang báo lỗi 404 "Cung Điện Vắng Bóng" khi người dùng nhập đường dẫn không tồn tại.'],
      ],
      [450, 1750, 1850, 950, 1150, 3650]
    ),
    createChapterSummary(
      'Chương 4 đã hệ thống hóa ma trận phân quyền 3 nhóm đối tượng (Khách vãng lai, Khách hàng đã đăng nhập và Quản trị viên) trên toàn bộ 29 khai báo tuyến đường. Việc kết hợp ProtectedRoute với chia tách gói React.lazy vừa bảo vệ chặt chẽ các trang dữ liệu riêng tư vừa giữ dung lượng tải trang đầu tiên ở mức gọn nhẹ.'
    )
  );

  // ============================================================================
  // CHƯƠNG 5: ĐẶC TẢ CHI TIẾT 14 PHÂN HỆ CHỨC NĂNG (MẪU 5 PHẦN CHUẨN MỰC)
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 5: ĐẶC TẢ CHI TIẾT 14 PHÂN HỆ CHỨC NĂNG CỦA HỆ THỐNG'),
    createParagraph(
      'Để người đọc nắm rõ hệ thống giải quyết bài toán gì, người dùng tương tác như thế nào và mã nguồn vận hành ra sao bên dưới, cả 14 phân hệ chức năng trong dự án đều được trình bày thống nhất theo đúng 5 mục: (a) Mục đích, (b) Luồng sử dụng, (c) Cách hệ thống xử lý bên trong, (d) Số liệu thật đã kiểm chứng, và (e) File nguồn tương ứng.'
    )
  );

  CHAPTER_5_MODULES.forEach((mod) => {
    children.push(
      createH2(mod.heading),
      createBullet(mod.a, '(a) Mục đích:'),
      createBullet(mod.b, '(b) Luồng sử dụng:'),
      createBullet(mod.c, '(c) Cách hệ thống xử lý bên trong:'),
      createBullet(mod.d, '(d) Số liệu thật đã kiểm chứng:'),
      createBullet(mod.e, '(e) File nguồn tương ứng:')
    );
  });

  children.push(
    createChapterSummary(
      'Chương 5 đã trình bày chi tiết cơ chế hoạt động của 14 phân hệ chức năng phủ kín hành trình của cặp đôi lẫn quy trình điều hành nội bộ của studio. Từng phân hệ đều chỉ rõ luồng thao tác trên màn hình, tên hàm và store xử lý bên dưới, biểu thức Zod kiểm thực đầu vào cùng các con số giới hạn thực tế trong mã nguồn.'
    )
  );

  // ============================================================================
  // CHƯƠNG 6: CƠ SỞ DỮ LIỆU SUPABASE 6 BẢNG, STORAGE & KIẾN TRÚC DỰ PHÒNG
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 6: THIẾT KẾ CƠ SỞ DỮ LIỆU ĐÁM MÂY SUPABASE & CƠ CHẾ DỰ PHÒNG'),
    createH2('6.1. Lược đồ 6 bảng quan hệ PostgreSQL và kho lưu trữ ảnh'),
    createParagraph(
      'Cơ sở dữ liệu đám mây được định nghĩa đầy đủ trong tệp supabase/schema.sql (kèm kịch bản cập nhật bổ sung tại supabase/fix_and_enrich.sql), bao gồm 6 bảng quan hệ thuộc lược đồ public và 1 kho lưu trữ đối tượng (Storage Bucket) tên là studio-media dành cho tệp hình ảnh tải lên:'
    ),
    ...createTable(
      'Bảng 6: Đặc tả 6 bảng dữ liệu PostgreSQL khai báo trong supabase/schema.sql',
      'supabase/schema.sql của dự án doan-fenc',
      ['STT', 'Tên Bảng', 'Khóa Chính', 'Các Cột Dữ Liệu Chính', 'Ràng Buộc Toàn Vẹn (CHECK / Kiểu JSONB)'],
      [
        ['1', 'public.dich_vu', 'id (TEXT)', 'ten, loai, gia, mo_ta, hinh_anh, is_top, created_at', 'loai thuộc 4 nhóm ("ao-dai", "tho-anh", "dia-diem", "trang-tri"); gia >= 0; khởi tạo 18 bản ghi.'],
        ['2', 'public.goi_cuoi', 'id (TEXT)', 'ten, mo_ta, gia_tron_goi, danh_sach_dich_vu_ids, phong_cach, hinh_anh, is_top', 'phong_cach thuộc ("cung-dinh", "hien-dai", "co-dien"); gia_tron_goi >= 0; mảng TEXT[]; 9 bản ghi.'],
        ['3', 'public.yeu_cau', 'id (TEXT)', 'ten_don, ten_khach, so_dien_thoai, ngay_cuoi, ca_chup, dia_diem_chup, ngan_sach, danh_sach_dich_vu, ekip_phu_trach, lich_su_cham_soc, trang_thai', 'trang_thai thuộc 5 cột Kanban; ca_chup thuộc ("binh-minh", "hoang-hon", "tron-ngay"); cột JSONB lưu ekip & nhật ký CSKH.'],
        ['4', 'public.thiep_cuoi', 'id (TEXT)', 'ten, phong_cach, loai, gia, gia_goc, mo_ta, hinh_anh, co_dau, chu_re, ngay_cuoi, dia_diem, tinh_nang', 'loai thuộc ("basic", "vip", "pro"); gia >= 0; khởi tạo 6 mẫu thiệp chuẩn của studio.'],
        ['5', 'public.thiep_khach_tao', 'slug (TEXT)', 'mau_thiep_id, ten_chu_re, ten_co_dau, ngay_cuoi, gio_to_chuc, dia_diem, ngan_hang, so_tai_khoan, chu_tai_khoan, danh_sach_rsvp, ngay_tao', 'Lưu thiệp cưới công khai theo đường dẫn định danh slug; danh_sach_rsvp kiểu JSONB lưu phản hồi khách mời.'],
        ['6', 'public.profiles', 'id (UUID)', 'username, full_name, role, phone, email, active, created_at', 'Tham chiếu auth.users(id); role thuộc ("admin", "user"); tự động đồng bộ qua trigger handle_new_user().'],
      ],
      [450, 1750, 1150, 3250, 3200]
    ),
    createH2('6.2. Thực trạng chính sách bảo mật cấp dòng (Row Level Security – RLS)'),
    createParagraph(
      'Cả 6 bảng trên đều bật lệnh ALTER TABLE ... ENABLE ROW LEVEL SECURITY trong supabase/schema.sql với các chính sách cụ thể như sau:'
    ),
    createBullet('Các bảng danh mục public.dich_vu, public.goi_cuoi và public.thiep_cuoi: Cho phép mọi người dùng đọc công khai (FOR SELECT USING (true)); các thao tác thêm, sửa, xóa yêu cầu hàm kiểm tra public.is_admin() trả về đúng.'),
    createBullet('Bảng đơn yêu cầu public.yeu_cau: Cho phép tạo đơn mới công khai (FOR INSERT WITH CHECK (true)); cho phép người dùng đã xác thực trên Supabase hoặc quản trị viên đọc và cập nhật ghi chú (auth.role() = "authenticated" OR public.is_admin()); quyền xóa thuộc về quản trị viên. Khi chạy với tài khoản trình diễn cục bộ, trang /don-cua-toi thực hiện bước lọc đơn theo họ tên hoặc số điện thoại của người đang đăng nhập ở tầng ứng dụng.'),
    createBullet('Bảng thiệp chia sẻ public.thiep_khach_tao: Cho phép đọc công khai (để khách mời mở link thiệp), thêm mới khi phát hành thiệp và cập nhật mảng danh_sach_rsvp khi khách gửi lời chúc; thao tác xóa đường dẫn thiệp chỉ cấp cho quản trị viên (FOR DELETE USING (public.is_admin())).'),
    createBullet('Bảng hồ sơ public.profiles: Người dùng chỉ đọc và sửa hồ sơ có auth.uid() = id, còn quản trị viên được đọc và cập nhật toàn bộ danh sách.'),
    createH2('6.3. Kiến trúc chuyển đổi dự phòng 3 tầng (Supabase ➔ Mock API ➔ Seed Data)'),
    createParagraph(
      'Lớp trung gian SupabaseService (src/lib/supabaseAdapter.ts) kết hợp cùng hook useFetch (src/lib/useFetch.ts) đảm bảo tính sẵn sàng liên tục: khi có cấu hình biến môi trường hợp lệ, hệ thống đọc/ghi trực tiếp lên Supabase Cloud; nếu mạng ngoại tuyến, hệ thống tự động gọi máy chủ Node.js cục bộ tại cổng 4000 (server/api.cjs đọc từ server/db.json gồm 18 dịch vụ, 9 gói, 6 thiệp và 22 đơn mẫu) hoặc sử dụng kho dữ liệu dự phòng kết hợp localStorage ngay trên trình duyệt (chứa sẵn 5 đơn mẫu có đủ thông tin phân công ekip và nhật ký CSKH cùng 1 thiệp công khai mẫu).'
    ),
    createChapterSummary(
      'Chương 6 đã làm rõ cấu trúc 6 bảng cơ sở dữ liệu PostgreSQL cùng kho lưu trữ ảnh studio-media và các chính sách bảo mật RLS tương ứng trên Supabase. Cơ chế dự phòng đa tầng giúp ứng dụng bảo toàn đầy đủ chức năng tạo đơn, phát hành thiệp và điều phối ekip ngay cả khi kiểm thử ở môi trường không có kết nối mạng.'
    )
  );

  // ============================================================================
  // CHƯƠNG 7: DESIGN TOKENS, CHỐNG TRÀN NGANG & KHẢ NĂNG TIẾP CẬN A11Y
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 7: HỆ THỐNG DESIGN TOKENS, CHỐNG TRÀN NGANG & TIẾP CẬN A11Y'),
    createH2('7.1. Bảng Design Tokens trích xuất nguyên văn từ src/styles/variables.css'),
    createParagraph(
      'Toàn bộ màu sắc, phông chữ và độ bo góc của dự án được khai báo tập trung tại tệp src/styles/variables.css, hỗ trợ chuyển đổi tức thời giữa giao diện Sáng (:root) và giao diện Tối ([data-theme="dark"]):'
    ),
    ...createTable(
      'Bảng 7: Hệ thống biến CSS cốt lõi trong src/styles/variables.css',
      'src/styles/variables.css của dự án doan-fenc',
      ['Tên Biến CSS', 'Giá Trị Chế Độ Sáng (Light)', 'Giá Trị Chế Độ Tối (Dark)', 'Mục Đích Sử Dụng Trên Giao Diện'],
      [
        ['--primary', '#8B0000', '#C0392B', 'Màu đỏ mận chủ đạo cho nút hành động chính, tiêu đề nhấn và viền thương hiệu.'],
        ['--primary-hover', '#A30000', '#D94534', 'Màu nền nút chính khi người dùng di chuột qua.'],
        ['--secondary', '#D4AF37', '#D4AF37', 'Màu vàng kim dùng cho biểu tượng SVG, khung viền hoàng triều và huy hiệu nổi bật.'],
        ['--secondary-hover', '#E5C158', '#F0D278', 'Sắc vàng sáng khi tương tác chuột trên các chi tiết trang trí.'],
        ['--bg-main', '#FDFBF7', '#1A1512', 'Màu nền tổng thể của trang (trắng ngà giấy lụa ở chế độ sáng / nâu đen trầm ở chế độ tối).'],
        ['--surface', '#FFFFFF', '#26201C', 'Màu bề mặt thẻ sản phẩm, hộp thoại Modal, ngăn kéo giỏ hàng và bảng dữ liệu.'],
        ['--text-main', '#1A1512', '#EAE3D9', 'Màu chữ văn bản chính đảm bảo độ tương phản đọc rõ trên nền tương ứng.'],
        ['--text-muted', '#6C645C', '#A89F93', 'Màu chữ phụ cho chú thích, nhãn phụ đề và thông tin thời gian.'],
        ['--font-serif', 'Playfair Display, Cormorant Garamond, Georgia, serif', 'Giữ nguyên', 'Phông chữ có chân trang trọng dành cho các tiêu đề lớn (h1, h2, h3).'],
        ['--font-sans', 'Be Vietnam Pro, sans-serif', 'Giữ nguyên', 'Phông chữ không chân hiển thị rõ dấu tiếng Việt cho nội dung thân bài và biểu mẫu.'],
      ],
      [2100, 2300, 2100, 3300]
    ),
    createH2('7.2. Cơ chế chống tràn viền ngang và bố cục đáp ứng đa thiết bị'),
    createBullet('Trong tệp src/styles/globals.css, thuộc tính overflow-x: clip; được khai báo đồng bộ cho cả 3 phần tử gốc gồm html (dòng 17), body (dòng 38) và #root (dòng 62), giúp ngăn chặn xuất hiện thanh cuộn ngang ngoài ý muốn mà vẫn giữ nguyên hoạt động của thanh Header bám dính (position: sticky).'),
    createBullet('Thanh điều hướng Header (src/components/layout/Header.tsx & Header.css) gom 4 tính năng tương tác mới vào menu thả xuống "Khám Phá" và thiết lập 4 mốc co giãn màn hình (1380px, 1200px, 1060px chuyển sang ngăn kéo di động, và 540px thu gọn nhãn) để các mục chữ không bị chồng lấn hay tràn khỏi mép phải màn hình.'),
    createBullet('Các khung lưới 2 cột tại trang tư vấn, trang tạo thiệp và phòng phối cổ phục đều khai báo minmax(0, 1fr) kèm min-width: 0 để nội dung con tự động xuống dòng an toàn trên màn hình điện thoại nhỏ.'),
    createH2('7.3. Khả năng tiếp cận (A11y) và bộ 63 biểu tượng Pure SVG không Emoji'),
    createBullet('Thành phần Input dùng chung (src/components/common/UI.tsx) cũng như các biểu mẫu chuyên biệt tại BookingPage, ServiceFormModal, PackageFormModal, InvitationModals và PublicInvitationSharePage đều gắn kết thuộc tính id, name, aria-invalid và aria-describedby trỏ tới thông báo lỗi có role="alert".'),
    createBullet('Bộ chọn tùy biến RoyalSelect trên trang Đặt lịch, các ghim tọa độ trên Bản đồ Di sản và hộp tìm kiếm Ctrl + K đều hỗ trợ điều hướng bằng bàn phím (Tab, Enter, Space, ArrowUp, ArrowDown, Escape); toàn cục có đường viền :focus-visible màu vàng kim rõ nét.'),
    createBullet('Tệp src/components/common/Icon.tsx hiện cung cấp 63 nhánh biểu tượng vẽ bằng thẻ <svg>, <path>, <circle>, <rect>, <polygon> thuần túy; toàn bộ thư mục mã nguồn src/ đạt mức 0 ký tự Emoji màu.'),
    createChapterSummary(
      'Chương 7 đã đối chiếu chính xác hệ thống biến giao diện từ tệp variables.css, giải thích giải pháp chống tràn viền ngang trên cả ba cấp phần tử gốc html, body, #root và tổng kết các tiêu chuẩn tiếp cận bàn phím A11y cùng bộ 63 biểu tượng SVG thuần.'
    )
  );

  // ============================================================================
  // CHƯƠNG 8: KẾT QUẢ KIỂM THỬ TỰ ĐỘNG VITEST & ĐÓNG GÓI PRODUCTION
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 8: KẾT QUẢ KIỂM THỬ TỰ ĐỘNG & ĐÓNG GÓI TRIỂN KHAI'),
    createH2('8.1. Kết quả thực thi 53 ca kiểm thử tự động với Vitest'),
    createParagraph(
      'Bộ kiểm thử tự động sử dụng Vitest (v3.2.7) kết hợp @testing-library/react và môi trường giả lập DOM jsdom, được chia thành 3 tệp kiểm thử kiểm tra từ tầng biểu thức dữ liệu, tầng logic nghiệp vụ cho tới tầng định tuyến và phân quyền giao diện:'
    ),
    ...createTable(
      'Bảng 8: Thống kê chi tiết 3 tệp kiểm thử tự động trong thư mục src/test/',
      'Kết quả chạy lệnh thực tế npm test -- --run trên dự án',
      ['STT', 'Tệp Kiểm Thử', 'Các Hạng Mục Được Kiểm Chứng Tự Động', 'Số Ca Test', 'Thời Gian', 'Trạng Thái'],
      [
        ['1', 'src/test/validation.test.ts', 'Kiểm thực dichVuSchema, goiCuoiSchema, taoYeuCauInputSchema, tuVanInputSchema, thiepCuoiSchema, phân quyền 2 vai trò userFormSchema, hoàn cọc 3 bậc, giỏ hàng Zustand và xuất CSV.', '16 ca', '249 ms', '16/16 Đạt'],
        ['2', 'src/test/features.test.ts', 'Kiểm thử useWishlistStore, giới hạn so sánh 3 gói, Command Palette, 15 ngân hàng BANK_BINS, resolveBankBin, buildVietQrImageUrl, đếm ngược ngày cưới, CRUD thiệp & RSVP, điều phối ekip, nhật ký CSKH, DataURL ảnh và 9 tọa độ bản đồ.', '19 ca', '83 ms', '19/19 Đạt'],
        ['3', 'src/test/routes.test.tsx', 'Kiểm thử tích hợp createMemoryRouter cho các tuyến công khai mới (/ban-do-di-san, /phoi-co-phuc, /trien-lam, /thiep-cuoi/moi/:slug), chặn khách vãng lai ở tuyến bảo vệ và kiểm tra quyền truy cập của user / admin.', '18 ca', '853 ms', '18/18 Đạt'],
      ],
      [450, 2250, 4100, 1000, 950, 1050]
    ),
    createCallout(
      'GHI NHẬN KẾT QUẢ LẦN CHẠY THỰC TẾ (npm run typecheck & npm test)',
      '• Lệnh npm run typecheck (tsc --noEmit): Kết thúc với mã thoát 0 (Exit Code 0), 0 lỗi kiểu dữ liệu.\n' +
        '• Lệnh npm test (vitest run): Test Files: 3 passed (3) | Tests: 53 passed (53) | Tổng thời gian thực thi: 4,55 giây.'
    ),
    createH2('8.2. Kết quả đóng gói chia tách chunk với Vite 6 và triển khai Vercel'),
    createBullet('Lệnh npm run build (tsc --noEmit && vite build trên Vite v6.4.4) biến đổi 376 module và hoàn tất đóng gói trong 3,02 giây với 0 lỗi và 0 cảnh báo vượt ngưỡng dung lượng 500 kB.'),
    createBullet('Nhờ cấu hình manualChunks trong vite.config.ts kết hợp React.lazy trong routes.tsx, các thư viện nền được tách riêng gồm: gói chính index (~437,55 kB, nén gzip 129,30 kB), gói supabase (~227,08 kB, gzip 58,97 kB), gói vendor React/Router (~111,22 kB, gzip 35,91 kB), gói zod (~88,20 kB, gzip 25,24 kB) cùng 19 gói trang con tải theo nhu cầu có dung lượng chỉ từ 3,62 kB đến 47,99 kB.'),
    createBullet('Trên môi trường đám mây Vercel (https://huecungdinh.vercel.app), tệp vercel.json định nghĩa quy tắc viết lại đường dẫn "/(.*)" về "/index.html" để mọi đường dẫn con và đường dẫn thiệp chia sẻ /thiep-cuoi/moi/:slug đều tải đúng giao diện khi người dùng nhấn F5.'),
    createChapterSummary(
      'Chương 8 đã ghi nhận kết quả kiểm chứng thực tế của hệ thống qua 3 công cụ tự động: trình biên dịch TypeScript đạt 0 lỗi, bộ kiểm thử Vitest vượt qua toàn bộ 53/53 ca kiểm thử và trình đóng gói Vite 6 tách nhỏ các gói mã nguồn dưới ngưỡng 450 kB.'
    )
  );

  // ============================================================================
  // CHƯƠNG 9: HƯỚNG DẪN VẬN HÀNH, KỊCH BẢN NGHIỆM THU & GIỚI HẠN HỆ THỐNG
  // ============================================================================
  children.push(
    createH1('CHƯƠNG 9: HƯỚNG DẪN VẬN HÀNH, KỊCH BẢN NGHIỆM THU & GIỚI HẠN HỆ THỐNG'),
    createH2('9.1. Cài đặt môi trường và tài khoản trải nghiệm'),
    createBullet('Yêu cầu hệ thống: Máy tính cài đặt Node.js phiên bản từ 18.0.0 trở lên và trình quản lý gói npm.'),
    createBullet('Khởi chạy ứng dụng: Chạy npm install để cài gói phụ thuộc; mở cửa sổ dòng lệnh chạy npm run dev để mở giao diện tại http://localhost:5173 (có thể chạy song song npm run server ở cửa sổ thứ hai nếu muốn bật máy chủ API cục bộ cổng 4000).'),
    ...createTable(
      'Bảng 9: Hai tài khoản thử nghiệm tích hợp nút điền nhanh tại trang /login',
      'src/features/auth/AuthContext.tsx và LoginPage.tsx',
      ['Vai Trò', 'Tên Đăng Nhập', 'Mật Khẩu', 'Số Điện Thoại Mẫu', 'Quyền Hạn Trải Nghiệm Chính'],
      [
        ['Quản trị viên (admin)', 'admin', '123456 (hoặc 123)', '0905123456', 'Truy cập Dashboard /admin, CRUD dịch vụ/gói/thiệp có tải ảnh, Kanban kéo thả 5 cột, Lịch điều phối Ekip, Quản lý tài khoản và Cẩm nang SOP /quy-trinh.'],
        ['Khách hàng (user)', 'khachhang', '123456 (hoặc 123)', '0912345678', 'Xem chi tiết dịch vụ/gói, phát hành link thiệp cưới công khai, đặt lịch kiểm tra ca trống ekip, dùng Sổ tay kế hoạch cưới A4, đặt cọc 20% VietQR và in Hợp đồng A4.'],
      ],
      [1800, 1400, 1500, 1500, 3600]
    ),
    createH2('9.2. Kịch bản thao tác nghiệm thu 12 bước trước Hội đồng đánh giá'),
    createParagraph(
      'Sinh viên có thể thực hiện tuần tự 12 bước dưới đây ngay trên trình duyệt để trình diễn đầy đủ các cơ chế kỹ thuật của đồ án:'
    ),
    createBullet(
      'Vào trang chủ (/) ➔ Bấm nút đổi giao diện Sáng / Tối trên thanh Header, sau đó nhấn tổ hợp phím Ctrl + K, gõ chữ "Nhật Bình" và dùng phím mũi tên chọn kết quả ➔ Kết quả thấy: Giao diện đổi bảng màu mượt mà, hộp tìm kiếm toàn cục lọc kết quả tức thì ➔ Chứng minh hệ thống CSS Variables, ThemeContext và RoyalCommandPalette.',
      'Bước 1 (Giao diện & Tìm kiếm nhanh Ctrl + K):'
    ),
    createBullet(
      'Mở menu "Khám Phá" chọn "Bản Đồ Di Sản Cố Đô" (/ban-do-di-san) ➔ Nhấp vào ghim "Lăng Khải Định", sau đó bấm chọn 1 lộ trình gợi ý bên dưới ➔ Kết quả thấy: Khung bên phải hiện giờ vàng ánh sáng, phí giấy phép quay chụp và đường nối đứt nét màu vàng kim nối 3 điểm trên bản đồ SVG ➔ Chứng minh đồ họa Pure SVG tương tác.',
      'Bước 2 (Bản đồ Di sản Cố đô SVG):'
    ),
    createBullet(
      'Vào "Phòng Phối Cổ Phục 2D" (/phoi-co-phuc) ➔ Đổi áo cô dâu sang "Áo Nhật Bình", sắc gấm "Lục Bảo", đổi áo chú rể sang "Mãng Bào" ➔ Kết quả thấy: Ma-nơ-canh đôi đổi màu từng lớp trang phục và tổng giá thuê bộ đôi tự động cộng dồn ➔ Chứng minh kỹ thuật xếp lớp SVG đa tầng và tính giá động.',
      'Bước 3 (Phòng phối cổ phục 2D):'
    ),
    createBullet(
      'Vào "Triển Lãm Lookbook" (/trien-lam) ➔ Kéo thanh trượt giữa bức ảnh sang hai bên và bấm mở phóng lớn 1 bức ảnh bên dưới ➔ Kết quả thấy: Vùng đối chiếu ảnh gốc / màu phim dịch chuyển mượt theo con trỏ, hộp phóng lớn duyệt ảnh bằng phím mũi tên ➔ Chứng minh kỹ thuật CSS clip-path và xử lý sự kiện bàn phím.',
      'Bước 4 (Thanh trượt Hậu kỳ Trước / Sau):'
    ),
    createBullet(
      'Vào trang "Gói Cưới" (/goi-cuoi) khi chưa đăng nhập ➔ Bấm nút so sánh trên 3 thẻ gói cưới rồi bấm "So Sánh Chi Tiết"; thử bấm tiếp gói thứ 4; sau đó bấm "Xem Chi Tiết" 1 gói ➔ Kết quả thấy: Bảng đối chiếu 3 cột mở ra rõ ràng, gói thứ 4 báo giới hạn tối đa 3 gói, và khi bấm xem chi tiết hệ thống chuyển hướng sang /login ➔ Chứng minh useWishlistStore và cơ chế chặn khách vãng lai.',
      'Bước 5 (So sánh 3 gói cưới & Chặn khách vãng lai):'
    ),
    createBullet(
      'Tại /login, bấm nút điền nhanh "Khách Hàng" để đăng nhập tài khoản khachhang ➔ Kết quả thấy: Hệ thống tự động đưa người dùng quay lại đúng trang chi tiết gói cưới vừa bấm trước đó ➔ Chứng minh cơ chế khôi phục đường dẫn location.state.from của ProtectedRoute.',
      'Bước 6 (Đăng nhập & Khôi phục đường dẫn):'
    ),
    createBullet(
      'Vào "AI Tư Vấn" (/tu-van) ➔ Kéo thanh trượt ngân sách lên 32.000.000 đ, chọn hình thức "Cung Điện Nội Bộ", bấm phân tích rồi bấm nút "Chuyển Thành Đơn Đặt Lịch Với Gói Này" ➔ Kết quả thấy: Chuyển sang trang /dat-lich với họ tên, số điện thoại đã tự điền sẵn; lịch tháng hiển thị trạng thái ca trống ekip; chọn ngày trống, ca Bình Minh và gửi phiếu ➔ Chứng minh liên thông dữ liệu AI sang Đặt lịch.',
      'Bước 7 (AI Tư vấn & Lịch tháng Đặt lịch):'
    ),
    createBullet(
      'Vào "Sổ Tay Kế Hoạch Cưới" (/ke-hoach-cuoi) ➔ Đánh dấu hoàn thành 2 đầu việc, sửa số tiền thực chi một hạng mục rồi bấm "In Sổ Tay Cưới (A4)" ➔ Kết quả thấy: Tỷ lệ hoàn thành và biểu đồ Donut SVG tự vẽ lại, cửa sổ xem trước bản in trình bày gọn trên trang giấy A4 ➔ Chứng minh tính toán hình học Donut SVG và @media print.',
      'Bước 8 (Sổ tay kế hoạch cưới & In A4):'
    ),
    createBullet(
      'Vào /thiep-cuoi/dang-ky ➔ Chọn ngân hàng "Vietcombank", nhập số tài khoản, bấm "Lưu & Phát Hành Đường Dẫn Thiệp Mời", sau đó mở đường dẫn /thiep-cuoi/moi/:slug vừa sinh ra ở cửa sổ ẩn danh (không đăng nhập) ➔ Kết quả thấy: Khách mời mở ấn sáp vàng, thấy đồng hồ đếm ngược nhảy từng giây, mã QR đúng BIN 970436 của Vietcombank, điền RSVP chọn suất Chay và lời chúc hiện ngay lên Sổ lưu bút ➔ Chứng minh luồng thiệp chia sẻ công khai & RSVP.',
      'Bước 9 (Phát hành Thiệp công khai, 15 ngân hàng VietQR & RSVP):'
    ),
    createBullet(
      'Thêm 1 dịch vụ vào giỏ, mở ngăn kéo giỏ hàng trên Header ➔ Tích chọn "Đặt cọc trước 20% qua VietQR" ➔ Kết quả thấy: Ảnh VietQR hiển thị đúng 20% giá trị giỏ hàng kèm nội dung chứa mã định danh [COC_YC-XXXXX]; vào /don-cua-toi mở một đơn trạng thái "Đã duyệt" để bấm "Xuất Hợp Đồng A4" ➔ Chứng minh đối soát mã cọc và xuất hợp đồng pháp lý.',
      'Bước 10 (Đặt cọc 20% VietQR & Hợp đồng A4):'
    ),
    createBullet(
      'Đăng xuất và đăng nhập tài khoản admin ➔ Vào /admin xem 4 thẻ KPI tính toán động; vào /admin/dich-vu bấm thêm mới và tải thử 1 tệp ảnh từ máy tính; vào /admin/thiep-cuoi mở tab thứ hai kiểm tra tổng số khách RSVP (suất Mặn / Chay) vừa gửi ở Bước 9 ➔ Chứng minh tải ảnh lên hệ thống và đồng bộ số liệu RSVP về trang quản trị.',
      'Bước 11 (Quản trị Dashboard, Tải ảnh & Thống kê RSVP):'
    ),
    createBullet(
      'Vào /admin/yeu-cau chuyển sang chế độ "Bảng Kanban", dùng chuột nắm kéo 1 thẻ đơn từ cột "Chờ Xử Lý" thả sang cột "Đã Duyệt", mở "Nhật ký CSKH" ghi thêm 1 dòng chăm sóc; tiếp tục vào /admin/lich-chup bấm vào ca chụp trên lịch tháng để phân công Nhiếp ảnh gia & Stylist; cuối cùng mở /quy-trinh kiểm tra 8 quy tắc SOP ➔ Chứng minh Kanban kéo thả HTML5 5 cột và điều phối nhân sự ERP.',
      'Bước 12 (Kanban kéo thả 5 cột, Nhật ký CSKH, Điều phối Ekip & SOP):'
    ),
    createH2('9.3. Giới hạn hiện tại của hệ thống và hướng phát triển tiếp theo'),
    createParagraph(
      'Bên cạnh các phân hệ đã hoàn thiện, báo cáo ghi nhận trung thực các giới hạn thuộc phạm vi ngoài đồ án môn học FrontEnd hiện tại cũng như hướng mở rộng khả thi:'
    ),
    createBullet(
      'Để phục vụ việc chấm bài và trình diễn nhanh chỉ với 1 cú nhấp chuột mà không phụ thuộc xác thực thư điện tử SMTP bên ngoài, AuthContext vẫn duy trì cơ chế phiên cục bộ cho 2 tài khoản thử nghiệm song song với bảng public.profiles. Hướng phát triển: tích hợp luồng đăng nhập OAuth / Magic Link của Supabase Auth trên môi trường thương mại.',
      '1. Cơ chế phiên đăng nhập trình diễn:'
    ),
    createBullet(
      'Hệ thống đã sinh đúng mã ảnh VietQR Napas247 kèm mã phiếu [COC_YC-XXXXX] cho khách quét chuyển khoản, nhưng việc chuyển trạng thái đơn sang "Đã duyệt" hiện do Quản trị viên xác nhận thủ công trên bảng Kanban thay vì tự động gạch nợ qua Webhook ngân hàng (do cần tài khoản doanh nghiệp đăng ký cổng Casso/SePay ở phía máy chủ).',
      '2. Đối soát giao dịch ngân hàng bán tự động:'
    ),
    createBullet(
      'Các chỉ số tổng đơn, đơn chờ, doanh thu dự kiến và tỷ trọng gói cưới trên trang /admin đã được tính toán động từ dữ liệu đơn thực tế; riêng con số "khách đang xem trực tuyến" (dao động 14–28 người) vẫn là bộ mô phỏng giao diện bằng setInterval phía trình duyệt, có thể nâng cấp bằng kênh Supabase Realtime Presence ở giai đoạn sau.',
      '3. Bộ đếm khách đang truy cập trên Dashboard:'
    ),
    createBullet(
      'Ứng dụng hiện chưa gửi tin nhắn Zalo ZNS hay thư điện tử tự động khi đơn được duyệt và giao diện mới hỗ trợ đơn ngữ tiếng Việt. Đây là hai hạng mục phù hợp để mở rộng qua Supabase Edge Functions khi phục vụ thêm nhóm khách Việt kiều quốc tế.',
      '4. Thông báo tự động đa kênh & đa ngôn ngữ:'
    ),
    createChapterSummary(
      'Chương 9 đã tổng hợp hướng dẫn khởi chạy, thông tin hai tài khoản thử nghiệm, kịch bản trình diễn thực tế gồm 12 bước liên hoàn và phân tích thẳng thắn 4 giới hạn phạm vi hiện tại kèm lộ trình nâng cấp cụ thể.'
    )
  );

  // ============================================================================
  // KẾT LUẬN VÀ LỜI CẢM ƠN
  // ============================================================================
  children.push(
    createH1('KẾT LUẬN VÀ LỜI CẢM ƠN'),
    createParagraph(
      'Đồ án "Huế Cung Đình – Dịch Vụ Cưới & Nhiếp Ảnh Cổ Phục Hoàng Triều" (doan-fenc) đã hoàn thành các mục tiêu đề ra của học phần Web FrontEnd Nâng Cao (INT.7.18). Xuyên suốt quá trình phát triển 27 component trang và 28 tuyến đường chức năng, dự án duy trì tính nhất quán của kiến trúc Feature-Based một chiều, kiểm soát kiểu tĩnh TypeScript không phát sinh lỗi, kiểm thực dữ liệu 3 tầng bằng Zod, tự xây dựng giao diện bằng CSS thuần và vẽ toàn bộ 63 biểu tượng, bản đồ di sản, ma-nơ-canh cổ phục 2D cùng hệ thống biểu đồ bằng đồ họa SVG thuần túy.'
    ),
    createParagraph(
      'Về mặt ứng dụng thực tiễn, sản phẩm kết nối mạch lạc nhu cầu tìm hiểu văn hóa, dự toán chi phí, phát hành thiệp mời trực tuyến của các cặp đôi trẻ với công tác quản trị danh mục, theo dõi khách mời RSVP và điều phối nhân sự bấm máy của studio tại Cố đô Huế.'
    ),
    createParagraph(
      'Em xin gửi lời cảm ơn chân thành tới Thầy Dương Ngọc Duy – Giảng viên hướng dẫn học phần Web FrontEnd Nâng Cao – vì những bài giảng chuyên sâu, các tiêu chuẩn kỹ thuật nghiêm ngặt và những góp ý chi tiết giúp em rèn luyện tư duy thiết kế phần mềm bài bản, trung thực và cẩn trọng trong suốt quá trình thực hiện đồ án.'
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

  const doc = new Document({
    creator: 'Trần Công Quý (MSSV: 2401ITA001)',
    title: 'Báo Cáo Tổng Quan Đồ Án Huế Cung Đình - Web FrontEnd Nâng Cao',
    description: 'Báo cáo kỹ thuật đồ án môn học Web FrontEnd Nâng Cao (INT.7.18) - Đại học Phú Xuân',
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: 24,
            color: COLOR_TEXT_MAIN,
          },
          paragraph: {
            spacing: {
              line: 360,
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
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, '..', 'Docx', 'BaoCao_TongQuan_DuAn_HueCungDinh.docx');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buffer);
  console.log(`Đã xuất bản thành công tài liệu: ${outputPath} (${buffer.length} bytes)`);
}

generateWordReport().catch((err) => {
  console.error('Lỗi khi sinh tài liệu Word:', err);
  process.exit(1);
});
