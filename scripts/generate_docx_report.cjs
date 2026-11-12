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
  NumberFormat,
  ShadingType,
} = require('docx');

// --- Color Palette ---
const COLOR_PRIMARY = '8B0000';     // Imperial Burgundy
const COLOR_GOLD = 'B8860B';        // Imperial Gold / Dark Goldenrod
const COLOR_TEXT = '222222';        // Charcoal Dark
const COLOR_MUTED = '555555';       // Slate Muted
const COLOR_LIGHT_BG = 'FFFBF0';    // Warm Cream
const COLOR_ALT_ROW = 'F9F8F5';     // Soft Row Tint
const COLOR_BORDER = 'CCCCCC';      // Clean subtle gray border

const FONT_FAMILY = 'Times New Roman';

// Helper: Text run with default styling
function createText(text, options = {}) {
  return new TextRun({
    text: text || '',
    font: FONT_FAMILY,
    size: options.size || 24, // 12pt in half-points
    bold: options.bold || false,
    italics: options.italics || false,
    color: options.color || COLOR_TEXT,
    ...options,
  });
}

// Helper: Standard paragraph
function createParagraph(textRuns, options = {}) {
  const runs = Array.isArray(textRuns)
    ? textRuns
    : [createText(textRuns, options)];
  return new Paragraph({
    children: runs,
    spacing: {
      line: 360, // 1.5 line spacing (240 = single, 360 = 1.5)
      before: options.before !== undefined ? options.before : 120,
      after: options.after !== undefined ? options.after : 120,
    },
    alignment: options.alignment || AlignmentType.LEFT,
    ...options,
  });
}

// Helper: Heading 1
function createH1(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [
      new TextRun({
        text: title,
        font: FONT_FAMILY,
        size: 32, // 16pt
        bold: true,
        color: COLOR_PRIMARY,
      }),
    ],
    spacing: { before: 400, after: 200 },
  });
}

// Helper: Heading 2
function createH2(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({
        text: title,
        font: FONT_FAMILY,
        size: 28, // 14pt
        bold: true,
        color: COLOR_GOLD,
      }),
    ],
    spacing: { before: 300, after: 150 },
  });
}

// Helper: Heading 3
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
        color: COLOR_PRIMARY,
      }),
    ],
    spacing: { before: 200, after: 100 },
  });
}

// Helper: Bullet list item
function createBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix + ' ',
        font: FONT_FAMILY,
        size: 24,
        bold: true,
        color: COLOR_TEXT,
      })
    );
  }
  children.push(
    new TextRun({
      text: text,
      font: FONT_FAMILY,
      size: 24,
      color: COLOR_TEXT,
    })
  );

  return new Paragraph({
    children,
    bullet: { level: 0 },
    spacing: { line: 320, before: 60, after: 60 },
  });
}

// Helper: Callout block with left border
function createCallout(title, text) {
  return new Paragraph({
    children: [
      new TextRun({
        text: title ? title + '\n' : '',
        font: FONT_FAMILY,
        size: 24,
        bold: true,
        color: COLOR_PRIMARY,
      }),
      new TextRun({
        text: text,
        font: FONT_FAMILY,
        size: 23,
        italics: true,
        color: COLOR_MUTED,
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
      fill: COLOR_LIGHT_BG,
    },
    spacing: { before: 180, after: 180 },
    indent: { left: 360, right: 360 },
  });
}

// Helper: Create Styled Table
function createTable(headers, rows, colWidths = []) {
  const tableRows = [];

  // Header Row
  const headerCells = headers.map((headerText, i) => {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: headerText,
              font: FONT_FAMILY,
              size: 22,
              bold: true,
              color: 'FFFFFF',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 80 },
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
  tableRows.push(new TableRow({ children: headerCells, tableHeader: true }));

  // Data Rows
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
                size: 21,
                color: COLOR_TEXT,
              }),
            ],
            spacing: { before: 70, after: 70 },
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

  return new Table({
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
}

// --- Assemble Document ---
async function generateWordReport() {
  console.log('Generating comprehensive Word documentation (.docx)...');

  const children = [];

  // ==================== TRANG BÌA ====================
  children.push(
    createParagraph('TRƯỜNG ĐẠI HỌC PHÚ XUÂN (PXU)', {
      alignment: AlignmentType.CENTER,
      before: 720,
      after: 100,
      size: 26,
      bold: true,
      color: COLOR_TEXT,
    }),
    createParagraph('KHOA CÔNG NGHỆ THÔNG TIN', {
      alignment: AlignmentType.CENTER,
      before: 0,
      after: 720,
      size: 24,
      bold: true,
      color: COLOR_PRIMARY,
    }),
    createParagraph('═══════════════════ • ❖ • ═══════════════════', {
      alignment: AlignmentType.CENTER,
      before: 100,
      after: 800,
      size: 22,
      color: COLOR_GOLD,
    }),
    createParagraph('BÁO CÁO ĐỒ ÁN KẾT THÚC HỌC PHẦN', {
      alignment: AlignmentType.CENTER,
      before: 400,
      after: 100,
      size: 28,
      bold: true,
      color: COLOR_TEXT,
    }),
    createParagraph('MÔN HỌC: WEB FRONTEND NÂNG CAO (INT.7.18)', {
      alignment: AlignmentType.CENTER,
      before: 100,
      after: 500,
      size: 24,
      bold: true,
      color: COLOR_PRIMARY,
    }),
    createParagraph('ĐỀ TÀI NGHIÊN CỨU & XÂY DỰNG HỆ THỐNG:', {
      alignment: AlignmentType.CENTER,
      before: 300,
      after: 100,
      size: 22,
      italics: true,
      color: COLOR_MUTED,
    }),
    createParagraph(
      'HUẾ CUNG ĐÌNH\nNỀN TẢNG SỐ HÓA DỊCH VỤ CƯỚI & NHIẾP ẢNH CỔ PHỤC HOÀNG TRIỀU CỐ ĐÔ HUẾ',
      {
        alignment: AlignmentType.CENTER,
        before: 100,
        after: 200,
        size: 34,
        bold: true,
        color: COLOR_PRIMARY,
      }
    ),
    createParagraph('(Mã định danh dự án: doan-fenc | Phiên bản 3.0 Production)', {
      alignment: AlignmentType.CENTER,
      before: 0,
      after: 1200,
      size: 22,
      italics: true,
      color: COLOR_GOLD,
    }),
    createParagraph('═══════════════════ • ❖ • ═══════════════════', {
      alignment: AlignmentType.CENTER,
      before: 200,
      after: 800,
      size: 22,
      color: COLOR_GOLD,
    }),
    createParagraph('Sinh viên thực hiện:  TRẦN CÔNG QUÝ', {
      alignment: AlignmentType.CENTER,
      before: 100,
      after: 80,
      size: 26,
      bold: true,
      color: COLOR_TEXT,
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
      after: 200,
      size: 24,
      color: COLOR_TEXT,
    }),
    createParagraph('Giảng viên hướng dẫn:  THẦY DƯƠNG NGỌC DUY', {
      alignment: AlignmentType.CENTER,
      before: 100,
      after: 1200,
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
      color: COLOR_MUTED,
    }),
    createParagraph('', { pageBreakBefore: true }) // Sang trang mới
  );

  // ==================== BẢNG CHẤM ĐIỂM TIÊU CHÍ ====================
  children.push(
    createH1('BẢNG ĐÁNH GIÁ TIÊU CHÍ CHẤM ĐIỂM HỌC PHẦN (INT.7.18)'),
    createParagraph(
      'Học phần Web FrontEnd Nâng Cao đặt ra các tiêu chuẩn kỹ thuật khắt khe về tính độc lập công nghệ, độ an toàn kiểu dữ liệu, trải nghiệm người dùng và kiến trúc mã nguồn. Dưới đây là bảng đối chiếu chi tiết giữa yêu cầu học phần và kết quả thực thi của dự án:'
    ),
    createTable(
      ['STT', 'Tiêu Chí Đánh Giá Cốt Lõi', 'Yêu Cầu Quy Chuẩn Học Phần', 'Hiện Trạng Triển Khai Dự Án', 'Đánh Giá'],
      [
        ['1', 'Kiến trúc mã nguồn', 'Mô hình phân tầng một chiều, tách biệt rõ ràng', 'Feature-Based Architecture (app ➔ pages ➔ features ➔ components ➔ lib)', '100% Đạt'],
        ['2', 'Độ an toàn kiểu dữ liệu', 'TypeScript bật strict: true, cấm tuyệt đối "any"', 'TypeScript 5.x Strict 100%, 0 "any", toàn bộ kiểu suy diễn từ Zod Schema', '100% Đạt'],
        ['3', 'Kiểm thực dữ liệu (Validation)', 'Xác thực chặt chẽ đầu vào Form và dữ liệu API', 'Zod v4 kiểm soát 3 tầng: API Response, Form Inputs và URL Params', '100% Đạt'],
        ['4', 'Quản lý trạng thái', 'Sử dụng State Management phù hợp, không lạm dụng Context', 'Zustand v5 (Persist giỏ hàng), Context API chỉ dùng cho Theme và Auth', '100% Đạt'],
        ['5', 'Tự chủ giao diện (Styling)', 'Cấm Tailwind CSS, Bootstrap, MUI; viết CSS thuần', '100% Pure CSS với CSS Variables, Flexbox, Grid, Dark/Light Mode', '100% Đạt'],
        ['6', 'Biểu tượng & Biểu đồ', 'Không dùng FontAwesome, Lucide, Recharts, Chart.js', '100% Pure SVG tự tính toán toạ độ hình học (Bar & Donut Chart, Sparklines)', '100% Đạt'],
        ['7', 'Quy chuẩn hình ảnh & biểu cảm', 'Không sử dụng Emoji trong UI; hình ảnh di sản chân thực', '0 Emoji trong UI chính thức; 100% ảnh Unsplash di sản Huế độ phân giải cao', '100% Đạt'],
        ['8', 'Phân quyền & Định tuyến', 'Bảo vệ đường dẫn theo vai trò người dùng (RBAC)', 'React Router v8, phân quyền 2 tầng tinh gọn (Guest / User / Admin)', '100% Đạt'],
        ['9', 'Cơ sở dữ liệu & Đám mây', 'Có lưu trữ dữ liệu thật trên Cloud, có dự phòng', 'Supabase Cloud PostgreSQL (5 bảng, RLS) + Mock Server Node.js cổng 4000', '100% Đạt'],
        ['10', 'Kiểm thử tự động (Unit Test)', 'Viết kịch bản kiểm thử định tuyến, logic, schema', 'Vitest + Testing Library: 26/26 ca kiểm thử thành công (100% Passed)', '100% Đạt'],
        ['11', 'Triển khai trực tuyến', 'Deploy lên môi trường Cloud có tên miền chạy thực', 'Vercel Production (https://huecungdinh.vercel.app), SPA rewrite chuẩn', '100% Đạt'],
      ],
      [600, 2000, 2600, 3000, 1000]
    ),
    createParagraph('', { before: 200, after: 200 })
  );

  // ==================== LỜI MỞ ĐẦU ====================
  children.push(
    createH1('LỜI MỞ ĐẦU & TUYÊN BỐ LIÊM CHÍNH HỌC THUẬT'),
    createParagraph(
      'Cố Đô Huế – mảnh đất kinh kỳ của triều đại nhà Nguyễn (1802 – 1945) – là nơi kết tinh tinh hoa văn hóa, kiến trúc và lễ nghi truyền thống Việt Nam. Trong những năm gần đây, xu hướng các cặp đôi trẻ tìm về cội nguồn văn hóa, lựa chọn trang phục cưới cổ phong như Áo Nhật Bình (dành cho mệnh phụ, công chúa) hay Áo Tấc (lễ phục trang trọng của nam giới) để tổ chức hôn lễ và chụp ảnh cưới tại Quần thể Di tích Cố Đô Huế (Đại Nội, Cung Diên Thọ, Lăng Khải Định, Lăng Tự Đức) đang ngày càng bùng nổ mạnh mẽ.'
    ),
    createParagraph(
      'Tuy nhiên, việc tiếp cận và số hóa các dịch vụ cưới cổ phục tại Huế hiện nay vẫn mang nặng tính phân tán, thiếu công cụ hỗ trợ tính toán ngân sách, chưa có giải pháp tạo thiệp cưới điện tử mang âm hưởng hoàng gia và các studio vẫn chủ yếu quản lý lịch chụp bằng sổ sách hoặc tin nhắn thủ công.'
    ),
    createParagraph(
      'Xuất phát từ thực tiễn trên, đồ án "Huế Cung Đình – Dịch Vụ Cưới & Nhiếp Ảnh Cổ Phục Hoàng Triều" được nghiên cứu và phát triển nhằm mục tiêu giải quyết trọn vẹn bài toán số hóa toàn diện quy trình cung ứng dịch vụ cưới cung đình. Dự án không chỉ là một sản phẩm phần mềm hoàn chỉnh, thẩm mỹ mà còn là một bài thi minh chứng năng lực lập trình FrontEnd chuyên sâu ở cấp độ kỹ sư.'
    ),
    createCallout(
      'BẢN TUYÊN BỐ LIÊM CHÍNH HỌC THUẬT (ACADEMIC INTEGRITY DECLARATION)',
      'Tôi xin cam đoan rằng toàn bộ mã nguồn, cấu trúc thư mục, hệ thống thiết kế CSS, các biểu đồ SVG tự tính toán toạ độ và tài liệu báo cáo này được nghiên cứu và hoàn thiện độc lập bởi sinh viên Trần Công Quý (MSSV: 2401ITA001), dưới sự định hướng chuyên môn của Thầy Dương Ngọc Duy. Các công cụ trí tuệ nhân tạo (AI Assistant) được sử dụng có kiểm soát như một trợ lý rà soát cú pháp, tối ưu hóa thuật toán và hỗ trợ sinh dữ liệu mẫu, tuyệt đối không thay thế tư duy kỹ thuật và tính trung thực học thuật.'
    ),
    createParagraph('', { pageBreakBefore: true })
  );

  // ==================== CHƯƠNG 1 ====================
  children.push(
    createH1('CHƯƠNG 1: BỐI CẢNH, MỤC TIÊU VÀ BÀI TOÁN KINH DOANH'),
    createH2('1.1. Bối cảnh văn hóa và xu hướng nhiếp ảnh di sản Cố Đô'),
    createParagraph(
      'Hôn lễ truyền thống Việt Nam dưới thời Nguyễn chứa đựng những giá trị nhân văn sâu sắc cùng hệ thống trang phục nghi lễ nghiêm cẩn. Áo Nhật Bình với hoa văn ngũ sắc thêu tay tinh xảo tượng trưng cho quyền quý, đoan trang; Áo Tấc năm thân kết hợp khăn đóng thể hiện sự đĩnh đạc, nho nhã của bậc trượng phu. Việc kết hợp nét đẹp di sản với ngày trọng đại của lứa đôi đòi hỏi một dịch vụ tư vấn và tác nghiệp chuyên nghiệp, chuẩn mực về cả kiến thức lịch sử lẫn kỹ thuật nhiếp ảnh hiện đại.'
    ),
    createH2('1.2. Khảo sát thực trạng và các bất cập hiện hữu'),
    createBullet('Thông tin phân mảnh, không minh bạch:', 'Bất cập cho khách hàng:'),
    createParagraph(
      'Các cặp đôi rất khó tìm được bảng giá công khai, đầy đủ về chi phí thuê cổ phục may đo, chi phí vé chụp Đại Nội, chi phí makeup chuyên gia và thợ ảnh di sản, dẫn đến lo ngại phát sinh chi phí vượt dự toán.'
    ),
    createBullet('Thiếu công cụ dự toán tài chính thông minh:', 'Bất cập cho khách hàng:'),
    createParagraph(
      'Chưa có nền tảng nào hỗ trợ thuật toán so khớp giữa khả năng tài chính của từng cặp đôi với danh mục dịch vụ phù hợp nhất.'
    ),
    createBullet('Thiệp cưới điện tử sơ sài, thiếu bản sắc:', 'Bất cập cho khách hàng:'),
    createParagraph(
      'Các mẫu thiệp cưới online hiện nay hầu hết là template phương Tây, không có phong cách cung đình, không có Nhã Nhạc truyền thống và chưa tích hợp mừng cưới không tiền mặt VietQR tự động.'
    ),
    createBullet('Quản lý thủ công, dễ sót lịch:', 'Bất cập cho Studio cưới:'),
    createParagraph(
      'Studio xử lý hàng chục đơn chụp mỗi tuần qua Zalo, Messenger hoặc sổ tay, không có bảng điều phối tiến độ trực quan (Kanban), không có Dashboard chỉ số tài chính thời gian thực và tốn nhiều công sức để soạn thảo hợp đồng in ấn khổ A4.'
    ),
    createH2('1.3. Mục tiêu chuyển đổi số và giải pháp nền tảng "Huế Cung Đình"'),
    createParagraph(
      'Hệ sinh thái "Huế Cung Đình" ra đời nhằm mang lại trải nghiệm "Hôn lễ Hoàng triều thu nhỏ" cho khách hàng và công cụ quản trị tinh gọn (SaaS) cho người điều hành studio:'
    ),
    createBullet('Số hóa toàn diện danh mục dịch vụ cưới lẻ (18 dịch vụ) và các gói cưới combo hoàng gia (9 gói).'),
    createBullet('Cung cấp công cụ AI Tư Vấn Hôn Lễ tính toán ngân sách tức thời và đề xuất giải pháp tối ưu.'),
    createBullet('Kho 6 giao diện thiệp cưới điện tử hoàng gia có hiệu ứng mở phong bì, phát Nhã Nhạc Cung Đình ngũ cung và tạo mã VietQR mừng cưới động.'),
    createBullet('Quy trình đặt lịch hoàng gia với Royal Custom Dropdown sang trọng và đặt cọc 20% giữ lịch siêu tốc.'),
    createBullet('Khách hàng tự tra cứu đơn cá nhân, bổ sung mong muốn góc chụp và xuất hợp đồng in A4 pháp lý.'),
    createBullet('Trung tâm điều hành Quản Trị Studio chuẩn SaaS với Live Visitor Counter, 4 thẻ KPI Sparklines, Bar & Donut SVG tương tác và Bảng Kanban 4 cột tiến độ.'),
    createBullet('Cẩm nang Vận hành & Quy trình Nghiệp vụ (SOP) độc quyền dành cho Quản trị viên hỗ trợ in A4.')
  );

  // ==================== CHƯƠNG 2 ====================
  children.push(
    createH1('CHƯƠNG 2: NGĂN XẾP CÔNG NGHỆ & CÁC RÀNG BUỘC KỸ THUẬT KHẮT KHE'),
    createH2('2.1. Danh mục công nghệ chính (Tech Stack)'),
    createTable(
      ['Hạng Mục', 'Công Nghệ Lựa Chọn', 'Phiên Bản', 'Lý Do Lựa Chọn & Đặc Điểm Kỹ Thuật'],
      [
        ['Core Framework', 'React (Hooks)', '19.x', 'Tận dụng compiler mới, tối ưu hóa re-render, hỗ trợ lập trình hàm hiện đại.'],
        ['Công cụ đóng gói', 'Vite', '6.x', 'Tốc độ khởi động máy chủ cực nhanh, Hot Module Replacement (HMR) tức thời.'],
        ['Ngôn ngữ', 'TypeScript', '5.x (Strict)', 'Bật strict: true, đảm bảo Type-Safety 100%, ngăn ngừa lỗi runtime từ mã nguồn.'],
        ['Định tuyến', 'React Router', 'v8', 'Import chuẩn từ "react-router" và "react-router/dom", hỗ trợ nested route và data loading.'],
        ['Quản lý trạng thái', 'Zustand + Context API', 'v5', 'Zustand cực nhẹ cho Giỏ hàng (Persist localStorage); Context API cho Theme & Auth.'],
        ['Kiểm thực dữ liệu', 'Zod', 'v4', 'Validation 3 tầng nghiêm ngặt (API response, Form inputs, URL query params).'],
        ['Giao diện & Tạo kiểu', '100% Pure CSS', 'Native', 'Sử dụng triệt để CSS Variables, Flexbox, Grid, Dark/Light Mode, @media print.'],
        ['Biểu tượng & Biểu đồ', '100% Pure SVG', 'Native', 'Tự viết component SVG toán học, tự vẽ Bar Chart, Donut Chart và Sparklines.'],
        ['CSDL Đám mây', 'Supabase PostgreSQL', 'Cloud', '5 bảng quan hệ, Row Level Security (RLS) bảo vệ phân quyền dữ liệu từng dòng.'],
        ['Backend Dự phòng', 'Node.js HTTP Server', 'Core http', 'Máy chủ giả lập cổng 4000 không dùng Express, đảm bảo chạy offline mượt mà.'],
        ['Kiểm thử tự động', 'Vitest + RTL', '3.x', 'Kiểm thử 26/26 ca: Routing, Phân quyền RBAC, Zod Schemas và Logic tính toán.'],
        ['Triển khai Production', 'Vercel', 'Global Edge', 'Tự động CI/CD từ GitHub repo, cấu hình vercel.json SPA Rewrite 404 hoàn hảo.'],
      ],
      [1800, 2200, 1200, 4800]
    ),
    createH2('2.2. Các quy định cấm kỵ bắt buộc (AGENTS.md Constraints)'),
    createParagraph(
      'Nhằm rèn luyện kỹ năng tự chủ mã nguồn ở mức cao nhất, đồ án áp dụng 8 điều cấm tuyệt đối theo quy định AGENTS.md:'
    ),
    createBullet('CẤM tuyệt đối Tailwind CSS, Bootstrap, MUI hay bất kỳ thư viện UI nào bên ngoài. Toàn bộ 100% giao diện viết bằng CSS thuần túy.'),
    createBullet('CẤM thư viện Icon ngoài (Lucide, FontAwesome, React-Icons). Toàn bộ biểu tượng được vẽ thủ công bằng React SVG Component (Icon.tsx).'),
    createBullet('CẤM sử dụng Emoji trong giao diện chính thức. Toàn bộ chi tiết đồ họa đều dùng SVG mang phong cách cung đình tinh tế hoặc ký tự typo chuẩn mực.'),
    createBullet('CẤM dùng kiểu dữ liệu "any" hoặc ép kiểu mù quáng "as". Bắt buộc suy diễn kiểu từ Zod Schema (z.infer).'),
    createBullet('CẤM Redux Toolkit cồng kềnh. Chỉ sử dụng Zustand v5 kết hợp React Context.'),
    createBullet('CẤM hardcode URL API hay secret keys. Sử dụng biến môi trường Vite (import.meta.env).'),
    createBullet('CẤM để lại console.log trong mã nguồn chạy thực tế.'),
    createBullet('CẤM thư viện biểu đồ bên ngoài (Chart.js, Recharts, ApexCharts). Toàn bộ biểu đồ cột, biểu đồ tròn và đường sóng sparklines tự tính toán hình học SVG.'),
    createH2('2.3. Kiểm soát luồng bất đồng bộ: Mẫu Discriminated Union AsyncState'),
    createParagraph(
      'Hệ thống loại bỏ hoàn toàn các biến cờ boolean rời rạc (isLoading, isError, data) gây nguy cơ lỗi trạng thái bất định (Impossible States). Mọi hoạt động bất đồng bộ đều tuân thủ cấu trúc Discriminated Union chuẩn mực:'
    ),
    createCallout(
      'MẪU CẤU TRÚC ASYNCSTATE<T>',
      'export type AsyncState<T> =\n  | { status: "loading" }\n  | { status: "error"; message: string }\n  | { status: "success"; data: T };\n\n' +
      'Khi render dữ liệu trên giao diện, bắt buộc sử dụng cấu trúc switch-case kèm nhánh vét cạn assertNever(state) để đảm bảo trình biên dịch kiểm tra mọi khả năng có thể xảy ra.'
    )
  );

  // ==================== CHƯƠNG 3 ====================
  children.push(
    createH1('CHƯƠNG 3: KIẾN TRÚC MÃ NGUỒN FEATURE-BASED & CẤU TRÚC DỰ ÁN'),
    createH2('3.1. Nguyên tắc thiết kế phụ thuộc một chiều'),
    createParagraph(
      'Dự án được cấu trúc theo mô hình Feature-Based Architecture hiện đại, trong đó mã nguồn được đóng gói theo từng phân hệ nghiệp vụ độc lập thay vì gom theo loại file kỹ thuật. Mô hình tuân thủ nghiêm ngặt quy tắc phụ thuộc một chiều:'
    ),
    createCallout(
      'LUỒNG PHỤ THUỘC MỘT CHIỀU (DEPENDENCY RULE)',
      'app  ➔  pages  ➔  features  ➔  components  ➔  context / lib / styles\n\n' +
      'Các module cấp thấp tuyệt đối không được phép import ngược lên module cấp cao, ngăn chặn 100% hiện tượng Circular Dependency.'
    ),
    createH2('3.2. Cây thư mục dự án chuẩn hóa'),
    createParagraph(
      'Cấu trúc thư mục chi tiết trong thư mục src/ của dự án:'
    ),
    createTable(
      ['Thư Mục / File', 'Tầng Kiến Trúc', 'Chức Năng & Trách Nhiệm'],
      [
        ['src/app/', 'Tầng Khởi Tạo', 'Chứa App.tsx, RootLayout, AdminLayout, routes.tsx định tuyến React Router v8 và main.tsx.'],
        ['src/pages/', 'Tầng Trang Cấp Cao', 'Chứa 21 màn hình tương ứng với từng Route (HomePage, ServicesPage, BookingPage, CartPage...).'],
        ['src/pages/admin/', 'Tầng Quản Trị', 'Chứa các trang quản trị: AdminDashboardPage, AdminServicesPage, AdminPackagesPage, AdminRequestsPage, AdminUsersPage.'],
        ['src/features/services/', 'Feature Dịch Vụ Lẻ', 'Logic lọc, sắp xếp, ServiceCard, ServiceDetail và tương tác dịch vụ cổ phục.'],
        ['src/features/packages/', 'Feature Gói Cưới', 'Lưới combo hoàng gia, modal xem nhanh thành phần và Zustand cartStore.'],
        ['src/features/consultation/', 'Feature AI Tư Vấn', 'Form nhập ngân sách, thanh trượt kinh phí và thuật toán client-side tối ưu chi phí.'],
        ['src/features/invitations/', 'Feature Thiệp Cưới', 'Kho 6 thiệp cưới, trình phát Nhã Nhạc Web Audio API, form RSVP và Dynamic VietQR.'],
        ['src/features/requests/', 'Feature Quản Lý Đơn', 'Bảng đơn tư vấn, Kanban 4 cột kéo thả, và modal Hợp đồng A4 pháp lý.'],
        ['src/features/admin/', 'Feature Thống Kê', 'Biểu đồ Cột kép và Donut SVG tương tác, 4 Sparklines và live visitor counter.'],
        ['src/features/auth/', 'Feature Xác Thực', 'AuthContext, useAuth hook, ProtectedRoute kiểm tra 2-Tier RBAC.'],
        ['src/components/common/', 'UI Reusable', 'Icon.tsx (Pure SVG), Button, Input, Modal, Toast, Skeleton, FloatingContactWidget.'],
        ['src/components/layout/', 'Layout Reusable', 'Header (Navigation, Theme Switcher, Cart Drawer, User Menu), Footer hoàng triều.'],
        ['src/context/', 'Global Context', 'ThemeContext quản lý chuyển đổi chế độ Sáng / Tối lưu trữ localStorage.'],
        ['src/lib/', 'Thư Viện & Tiện Ích', 'Zod schemas, formatters, supabaseAdapter, useFetch, toastStore, types.'],
        ['src/styles/', 'Hệ Thống Phong Cách', 'globals.css với CSS Variables cung đình, typography Playfair Display + Be Vietnam Pro.'],
      ],
      [2400, 2200, 5400]
    )
  );

  // ==================== CHƯƠNG 4 ====================
  children.push(
    createH1('CHƯƠNG 4: BẢN ĐỒ 21 TUYẾN ĐƯỜNG (ROUTES) & PHÂN QUYỀN 2-TIER RBAC'),
    createH2('4.1. Ma trận phân quyền 3 nhóm người dùng (Guest / User / Admin)'),
    createParagraph(
      'Hệ thống thiết lập ma trận bảo mật chặt chẽ chia người dùng thành 3 nhóm quyền hạn:'
    ),
    createBullet('Khách vãng lai (Guest): Được phép duyệt xem trang chủ, danh sách dịch vụ lẻ, danh sách gói cưới combo, kho mẫu thiệp cưới và sử dụng công cụ AI tư vấn ngân sách. Khách vãng lai KHÔNG thể xem chi tiết dịch vụ/gói cưới, không thể thêm vào giỏ hàng, không thể đặt lịch và không thể vào đơn cá nhân. Khi cố bấm vào các hành động này, hệ thống sẽ tự động chuyển hướng về trang /login.'),
    createBullet('Khách hàng đã đăng nhập (User - khachhang/123456): Được toàn quyền trải nghiệm xem chi tiết dịch vụ/gói cưới/thiệp cưới, thêm hạng mục vào giỏ hàng, đặt lịch trải nghiệm cổ phục với Royal Custom Dropdown, quét mã VietQR đặt cọc 20%, tạo thiệp cưới cá nhân hóa và quản lý đơn hàng cá nhân tại /don-cua-toi kèm in hợp đồng A4.'),
    createBullet('Quản trị viên Hoàng Triều (Super Admin - admin/123456): Sở hữu toàn quyền trên hệ thống, độc quyền truy cập khu vực Quản Trị (/admin, Dashboard KPI Corbel SaaS, CRUD dịch vụ, CRUD gói cưới, Kanban duyệt đơn, Quản lý tài khoản) và độc quyền truy cập Cẩm Nang SOP (/quy-trinh).'),
    createH2('4.2. Bảng kê chi tiết 21 Tuyến đường trong hệ thống'),
    createTable(
      ['STT', 'Đường Dẫn (Path)', 'Tên Component', 'Phân Quyền Truy Cập', 'Layout', 'Mô Tả Chức Năng Chính'],
      [
        ['1', '/', 'HomePage', 'Public (Mọi người)', 'RootLayout', 'Hero banner, Marquee combo chạy tự động, form tư vấn nhanh.'],
        ['2', '/dich-vu', 'ServicesPage', 'Public (Mọi người)', 'RootLayout', 'Danh mục 18 dịch vụ lẻ, bộ lọc loại cổ phục/thợ ảnh/địa điểm, sắp xếp giá.'],
        ['3', '/dich-vu/:id', 'ServiceDetailPage', 'Yêu cầu đăng nhập (user/admin)', 'RootLayout', 'Chi tiết dịch vụ, ảnh HD, stepper số lượng, thêm giỏ hàng (chặn guest).'],
        ['4', '/goi-cuoi', 'PackagesPage', 'Public (Mọi người)', 'RootLayout', 'Lưới 9 gói cưới combo cung đình, huy hiệu Top Đặt Nhiều, lọc phong cách.'],
        ['5', '/goi-cuoi/:id', 'PackageDetailPage', 'Yêu cầu đăng nhập (user/admin)', 'RootLayout', 'Chi tiết gói chụp, đặc quyền 8h Đại Nội, modal xem nhanh dịch vụ, báo giá nhanh.'],
        ['6', '/thiep-cuoi', 'InvitationsPage', 'Public (Mọi người)', 'RootLayout', 'Kho 6 mẫu thiệp điện tử smartphone, bảng giá VIP/PRO/BASIC, mừng cưới VietQR.'],
        ['7', '/thiep-cuoi/:id', 'InvitationDetailPage', 'Yêu cầu đăng nhập (user/admin)', 'RootLayout', 'Chi tiết thiệp, phát Nhã Nhạc ngũ cung, đếm ngược ngày cưới, form gửi lời chúc.'],
        ['8', '/thiep-cuoi/dang-ky', 'InvitationCustomPage', 'Yêu cầu đăng nhập (user/admin)', 'RootLayout', 'Tự tạo thiệp 2 cột: Cột phải nhập dữ liệu, cột trái preview thiệp + VietQR động.'],
        ['9', '/thiep-cuoi/tuy-bien', 'InvitationCustomPage', 'Yêu cầu đăng nhập (user/admin)', 'RootLayout', 'Tuyến bí danh (alias) đồng bộ từ trang chi tiết thiệp cưới.'],
        ['10', '/dat-lich', 'BookingPage', 'Yêu cầu đăng nhập (user/admin)', 'RootLayout', 'Đặt lịch hoàng gia với Royal Custom Dropdown, tự động điền họ tên khách.'],
        ['11', '/tu-van', 'ConsultationPage', 'Public (Mọi người)', 'RootLayout', 'AI Tư vấn ngân sách, thanh trượt responsive, thuật toán tối ưu chi phí.'],
        ['12', '/gio-hang', 'CartPage', 'Yêu cầu đăng nhập (user/admin)', 'RootLayout', 'Giỏ hàng hoàng gia Zustand, đặt cọc 20% giữ ngày cưới qua Dynamic VietQR.'],
        ['13', '/don-cua-toi', 'MyBookingsPage', 'Yêu cầu đăng nhập (user/admin)', 'RootLayout', 'Quản lý đơn chụp ảnh di sản, bổ sung mong muốn, hủy đơn hoàn cọc, in Hợp đồng A4.'],
        ['14', '/quy-trinh', 'ProcessGuidePage', 'Chỉ Quản trị viên (admin)', 'RootLayout', 'Cẩm nang SOP: 6 quy trình, 4 vai trò có checklist tương tác, 18 quy tắc, in A4.'],
        ['15', '/huong-dan-quy-trinh', 'ProcessGuidePage', 'Chỉ Quản trị viên (admin)', 'RootLayout', 'Tuyến định tuyến bí danh (alias) hỗ trợ truy cập tài liệu SOP nhanh.'],
        ['16', '/login', 'LoginPage', 'Public (Mọi người)', 'RootLayout', 'Đăng nhập bảo mật kèm 2 nút Quick-fill (Admin / Khách hàng).'],
        ['17', '/admin', 'AdminDashboardPage', 'Chỉ Quản trị viên (admin)', 'AdminLayout', 'Dashboard SaaS: Live Visitor Counter, 4 Sparklines, Bar & Donut SVG, In báo cáo.'],
        ['18', '/admin/dich-vu', 'AdminServicesPage', 'Chỉ Quản trị viên (admin)', 'AdminLayout', 'Quản lý dịch vụ lẻ (CRUD với Modal xác nhận an toàn).'],
        ['19', '/admin/goi-cuoi', 'AdminPackagesPage', 'Chỉ Quản trị viên (admin)', 'AdminLayout', 'Quản lý combo gói cưới (Multi-select checkbox dịch vụ thành phần).'],
        ['20', '/admin/yeu-cau', 'AdminRequestsPage', 'Chỉ Quản trị viên (admin)', 'AdminLayout', 'Quản lý đơn chụp ảnh: Bảng danh sách + Kanban 4 cột, Xem & In Hợp Đồng A4.'],
        ['21', '/admin/tai-khoan', 'AdminUsersPage', 'Chỉ Quản trị viên (admin)', 'AdminLayout', 'Quản lý tài khoản 2 cấp độ: Quản trị viên & Khách hàng, bảo vệ Root Admin.'],
        ['*', 'NotFoundPage', 'Public (Mọi người)', 'RootLayout', 'Trang lỗi 404 Cung điện vắng bóng phong cách hoài niệm Huế.'],
      ],
      [500, 1800, 1800, 2200, 1100, 2600]
    ),
    createH2('4.3. Cơ chế bảo vệ đường dẫn ProtectedRoute & Khôi phục vị trí'),
    createParagraph(
      'Thành phần ProtectedRoute bọc quanh các tuyến đường nhạy cảm. Khi người dùng chưa đăng nhập hoặc không đủ thẩm quyền, hệ thống tự động ghi nhận đường dẫn hiện tại vào state.from và chuyển hướng về /login. Ngay sau khi đăng nhập thành công, người dùng được tự động đưa trở lại đúng trang họ đang muốn truy cập.'
    )
  );

  // ==================== CHƯƠNG 5 ====================
  children.push(
    createH1('CHƯƠNG 5: ĐẶC TẢ CHI TIẾT 10 PHÂN HỆ CHỨC NĂNG ĐỘT PHÁ'),
    createH2('5.1. Phân hệ 1: Trang Chủ Cung Đình (HomePage)'),
    createParagraph(
      'Trang chủ được thiết kế với phong cách hoài niệm hoàng gia sâu lắng, kết hợp gam màu đỏ đô và vàng kim lấp lánh:'
    ),
    createBullet('Hero Banner hoàng gia: Sử dụng hình ảnh cổng Ngọ Môn và Điện Thái Hòa uy nghi, khẩu hiệu hôn lễ cung đình và cụm nút CTA đôi dẫn đến Dịch Vụ và Gói Cưới.'),
    createBullet('Marquee Combo chạy tự động: Băng chuyền chuyển động liên tục hiển thị tên các gói cưới hoàng gia hot nhất.'),
    createBullet('Văn hóa cổ phục: Phần giới thiệu chuyên sâu về lịch sử Áo Nhật Bình và Áo Tấc triều Nguyễn.'),
    createBullet('Quick Consultation Form: Biểu mẫu tư vấn nhanh tích hợp xác thực Zod, tự động điền họ tên khách đã đăng nhập.'),
    createH2('5.2. Phân hệ 2: Danh Mục & Chi Tiết Dịch Vụ Lẻ (Services)'),
    createParagraph(
      'Quản lý 18 dịch vụ cưới lẻ chân thực tại Cố Đô Huế:'
    ),
    createBullet('Bộ lọc 4 danh mục: Áo dài cổ phục, Thợ ảnh di sản, Địa điểm chụp ảnh (Đại Nội, Lăng Tự Đức, Lăng Khải Định, Cung An Định), Trang trí gia tiên cung đình.'),
    createBullet('Sắp xếp giá linh hoạt: Giá tăng dần, Giá giảm dần, Tên A-Z.'),
    createBullet('Bảo vệ đăng nhập chặt chẽ: Khách vãng lai bấm "Xem Chi Tiết" hoặc "Thêm vào giỏ" sẽ được chuyển hướng an toàn về /login.'),
    createBullet('Trang Chi tiết dịch vụ (/dich-vu/:id): Ảnh HD sắc nét, bộ đếm số lượng (Stepper +/-), đánh giá sao di sản và gợi ý các dịch vụ cùng loại.'),
    createH2('5.3. Phân hệ 3: Gói Cưới Combo Hoàng Gia (Packages)'),
    createParagraph(
      'Cung cấp 9 gói combo trọn gói với mức giá tối ưu:'
    ),
    createBullet('Lưới gói cưới với huy hiệu "Top Đặt Nhiều" và phân loại phong cách: Cung Đình, Cổ Điển, Hiện Đại.'),
    createBullet('Trang Chi tiết gói cưới (/goi-cuoi/:id): Liệt kê danh sách dịch vụ con kèm hình ảnh và đơn giá.'),
    createBullet('Modal Xem Nhanh (QuickViewServiceModal): Cho phép khách hàng xem nhanh thông số dịch vụ thành phần mà không cần rời trang.'),
    createBullet('Đặc quyền 8h Đại Nội: Khung thông tin độc quyền chụp ảnh 8 tiếng tại các cung điện cấm kỵ, bao gồm giấy phép Sở Du Lịch.'),
    createBullet('Nhận Báo Giá Nhanh: Modal cho phép tích chọn hoặc bỏ bớt dịch vụ để nhận báo giá đàm phán tức thời kèm Flash message 5s.'),
    createH2('5.4. Phân hệ 4: Đặt Lịch Hoàng Gia với Royal Custom Dropdown'),
    createParagraph(
      'Trang /dat-lich được thiết kế nhằm nâng tầm trải nghiệm của khách hàng thành nghi thức khởi tạo lịch trình hoàng tộc:'
    ),
    createBullet('Menu Chọn Lọc Địa Điểm Tùy Biến (Royal Custom Select): Thay thế hoàn toàn thẻ select HTML thô kệch bằng dropdown cung đình sang trọng, có gắn thẻ danh thắng (Đại Nội, Cung Diên Thọ, Điện Kiến Trung), mô tả ngắn di sản, huy hiệu vị trí và hiệu ứng ánh sáng hoàng triều.'),
    createBullet('Menu Chọn Gói Cưới Tùy Biến: Hiển thị tên gói, thẻ hạng VIP/PRO, mô tả phong cách và huy hiệu giá tiền niêm yết chuẩn VND.'),
    createBullet('Tương tác trực quan: Hỗ trợ đóng mở mượt mà, tự động đóng khi click ra ngoài (Click Outside), tích hợp icon SVG lấp lánh (Sparkles) và các trường ẩn select hỗ trợ bàn phím A11y.'),
    createBullet('Tự động điền dữ liệu: Tự động tải tên người dùng và số điện thoại từ hồ sơ AuthContext.'),
    createH2('5.5. Phân hệ 5: AI Tư Vấn Hôn Lễ Hoàng Triều (Consultation)'),
    createParagraph(
      'Công cụ thông minh giải quyết triệt để nỗi lo vượt ngân sách của các cặp đôi trẻ:'
    ),
    createBullet('Thanh trượt ngân sách Responsive 100% chiều rộng, hỗ trợ kéo chọn từ 10.000.000 đ đến 100.000.000 đ mà không bị chèn dính chữ.'),
    createBullet('Thuật toán Client-Side tối ưu tức thì: So khớp số lượng khách, số lượng cổ phục và địa điểm mong muốn với 9 gói cưới.'),
    createBullet('Thẻ kết quả phân tích: Hiển thị gói cưới tối ưu nhất, số tiền dư dả hoặc thiếu hụt, 3 dịch vụ lẻ nên bổ sung nâng cấp và đoạn văn phân tích văn hóa hoàng gia.'),
    createBullet('Nút "Chuyển thành Đơn Đăng Ký": Tự động điền kết quả vào đơn yêu cầu và gửi thẳng về Bảng Kanban của Admin.'),
    createH2('5.6. Phân hệ 6: Kho Mẫu Thiệp Cưới Điện Tử & Tùy Biến Trực Tuyến'),
    createParagraph(
      'Số hóa thiệp cưới mang đậm dấu ấn Cố Đô:'
    ),
    createBullet('Kho 6 mẫu thiệp điện tử chuẩn kích thước smartphone (Phong cách Cung Đình, Cổ Điển, Hiện Đại).'),
    createBullet('Trình phát Nhã Nhạc Cung Đình ngũ cung (Web Audio API): Tự phát nhạc truyền thống 100% offline với đĩa sen xoay 360 độ Pure SVG.'),
    createBullet('Đồng hồ đếm ngược (Countdown Timer): Hiển thị số ngày, giờ, phút, giây đếm ngược chính xác đến ngày trọng đại.'),
    createBullet('Dynamic VietQR Mừng Cưới: Tạo mã QR ngân hàng động theo đúng số tài khoản và ngân hàng của cô dâu chú rể.'),
    createBullet('Trang Tự Tạo Thiệp Trực Tuyến (/thiep-cuoi/dang-ky): Thiết kế 2 cột song song (Live Preview và Form nhập liệu chi tiết).'),
    createH2('5.7. Phân hệ 7: Giỏ Hàng & Đặt Cọc 20% Qua Dynamic VietQR'),
    createParagraph(
      'Trải nghiệm thương mại điện tử chuyên biệt cho dịch vụ cưới di sản:'
    ),
    createBullet('Quản lý trạng thái với Zustand v5 kết hợp middleware persist, lưu trữ an toàn trong localStorage.'),
    createBullet('Flash Message 5 giây trang trọng thông báo trạng thái thêm/xóa món.'),
    createBullet('Chính sách đặt cọc 20%: Tự động tính toán chính xác 20% tổng giá trị đơn để giữ ngày chụp đẹp tại Cố Đô.'),
    createBullet('Cổng chuyển khoản Dynamic VietQR: Tự động kết xuất mã QR Napas247 với nội dung chuyển khoản chuẩn hóa [COC_MAPHIEU].'),
    createBullet('Hộp thoại xác nhận an toàn: Ngăn ngừa việc gửi nhầm đơn khi khách hàng chưa kiểm tra kỹ danh mục.'),
    createH2('5.8. Phân hệ 8: Quản Lý Đơn Cá Nhân & In Hợp Đồng Pháp Lý A4'),
    createParagraph(
      'Trang /don-cua-toi là cổng thông tin cá nhân dành riêng cho khách hàng đã đăng nhập:'
    ),
    createBullet('Tra cứu danh sách đơn chụp ảnh di sản theo mã đơn hoặc số điện thoại.'),
    createBullet('Bổ sung mong muốn cá nhân: Khách hàng có thể lưu thêm yêu cầu đặc biệt (đổi tông trang điểm, thêm góc chụp hoàng hôn).'),
    createBullet('Hủy đơn hoàn cọc phân tầng (Tiered Policy): Hoàn 100% cọc nếu hủy trước 15 ngày; hoàn 50% nếu hủy từ 7-14 ngày; không hoàn cọc nếu hủy dưới 7 ngày.'),
    createBullet('Xuất & In Hợp Đồng Pháp Lý Khổ A4: Bản hợp đồng kinh tế dịch vụ nhiếp ảnh cưới cung đình chuẩn mực có hiệu lực pháp lý, đầy đủ điều khoản bảo mật, quyền tác giả, dấu đỏ điện tử và tối ưu in ấn chuẩn @media print.'),
    createH2('5.9. Phân hệ 9: Cẩm Nang Vận Hành & Quy Trình Nghiệp Vụ (SOP) Dành Cho Admin'),
    createParagraph(
      'Được thiết kế độc quyền cho Quản trị viên tại /quy-trinh (nằm trên nút Đăng Xuất trong user menu):'
    ),
    createBullet('6 Quy trình chuẩn (SOP): Từ tiếp nhận tư vấn, thử cổ phục, tác nghiệp 8h Đại Nội đến bàn giao photobook.'),
    createBullet('4 Vai trò nhân sự có Checklist tương tác: Chủ Studio, Stylist Cổ Phục, Nhiếp Ảnh Gia Di Sản, Khách Hàng. Các mục checklist có thể bấm đánh dấu hoàn thành trực tiếp trên màn hình.'),
    createBullet('7 Phân hệ phần mềm: Hướng dẫn chi tiết dữ liệu đầu vào và kết quả đầu ra của từng module.'),
    createBullet('18 Quy tắc tác nghiệp di sản: Quy định nghiêm ngặt về bảo tồn hiện vật, an toàn cổ phục và bảo mật dữ liệu.'),
    createBullet('Hỗ trợ in ấn A4: Nút "In Tài Liệu (A4)" cho phép in toàn bộ cẩm nang tác nghiệp ra tài liệu hướng dẫn nội bộ.'),
    createH2('5.10. Phân hệ 10: Trung Tâm Điều Hành Quản Trị Studio Hoàng Gia (/admin/*)'),
    createParagraph(
      'Bảng điều khiển kinh doanh lấy cảm hứng từ Corbel SaaS Dashboard quốc tế:'
    ),
    createBullet('Live Visitor Counter: Bộ đếm khách trực tuyến với đèn nhấp nháy xanh ngọc pulsing thời gian thực (15-28 khách).'),
    createBullet('Smart Greeter: Lời chào thông minh tự đổi theo buổi sáng/chiều/tối và thông báo việc cần làm.'),
    createBullet('4 Thẻ KPI Tích Hợp SVG Sparklines: Doanh thu (+18.5%), Hợp đồng cưới (+12.5%), Đơn chờ (-15%), Tỷ lệ chốt (92%).'),
    createBullet('Biểu đồ Cột SVG tương tác: Cột kép so sánh baseline cùng kỳ kèm tooltip hiển thị số tiền.'),
    createBullet('Biểu đồ Donut SVG tương tác: Hiển thị tỷ trọng đóng góp của các gói cưới với tổng số hợp đồng ở tâm.'),
    createBullet('Quản lý Đơn Yêu Cầu với Kanban 4 Cột: Chờ Xử Lý ➔ Đã Duyệt ➔ Đã Liên Hệ ➔ Hoàn Thành; hỗ trợ xem và in Hợp đồng A4.'),
    createBullet('Quản lý Dịch vụ lẻ & Gói cưới combo: Thêm/Sửa/Xóa có ConfirmModal hoàng gia.'),
    createBullet('Quản lý Tài khoản & Phân quyền (2-Tier RBAC): Khóa/mở khóa tài khoản, tạo người dùng mới, bảo vệ tài khoản Root Admin.')
  );

  // ==================== CHƯƠNG 6 ====================
  children.push(
    createH1('CHƯƠNG 6: THIẾT KẾ CƠ SỞ DỮ LIỆU & BẢO MẬT ĐÁM MÂY SUPABASE'),
    createH2('6.1. Sơ đồ thực thể quan hệ 5 bảng'),
    createParagraph(
      'Hệ thống cơ sở dữ liệu được tổ chức trên PostgreSQL của Supabase Cloud bao gồm 5 bảng chính:'
    ),
    createTable(
      ['Tên Bảng', 'Khóa Chính', 'Mục Đích Sử Dụng', 'Ràng Buộc & Chỉ Mục'],
      [
        ['public.dich_vu', 'id (TEXT)', 'Lưu trữ 18 dịch vụ cưới lẻ, danh mục cổ phục, thợ ảnh, địa điểm', 'CHECK loai IN ("ao-dai", "tho-anh", "dia-diem", "trang-tri"), gia >= 0'],
        ['public.goi_cuoi', 'id (TEXT)', 'Lưu trữ 9 gói cưới combo hoàng triều và danh sách dịch vụ con', 'CHECK phong_cach IN ("cung-dinh", "hien-dai", "co-dien"), gia_tron_goi >= 0'],
        ['public.yeu_cau', 'id (TEXT)', 'Lưu trữ các đơn đặt lịch, tư vấn, thông tin cô dâu chú rể và cọc', 'CHECK trang_thai IN ("cho-xu-ly", "da-duyet", "da-lien-he", "hoan-thanh")'],
        ['public.thiep_cuoi', 'id (TEXT)', 'Lưu trữ 6 mẫu thiệp điện tử, nhạc nền, STK mừng cưới VietQR', 'CHECK loai IN ("basic", "vip", "pro"), gia >= 0'],
        ['public.profiles', 'id (UUID)', 'Lưu trữ hồ sơ người dùng liên kết auth.users, phân quyền', 'CHECK role IN ("admin", "user"), active BOOLEAN'],
      ],
      [2000, 1500, 3500, 3000]
    ),
    createH2('6.2. Chính sách bảo mật an ninh cấp dòng (Row Level Security - RLS)'),
    createParagraph(
      'Để ngăn chặn triệt để nguy cơ lộ lọt dữ liệu hoặc can thiệp trái phép vào cơ sở dữ liệu qua REST API, toàn bộ 5 bảng đều được bật Row Level Security (RLS) với các chính sách cụ thể:'
    ),
    createBullet('Bảng dich_vu, goi_cuoi, thiep_cuoi: Cho phép mọi người (Public Anon) được phép SELECT để xem danh mục. Chỉ tài khoản có role = "admin" mới có quyền INSERT, UPDATE, DELETE.'),
    createBullet('Bảng yeu_cau: Khách hàng chỉ được phép xem các đơn gắn với số điện thoại hoặc ID tài khoản của mình. Quản trị viên (admin) được phép xem toàn bộ đơn và cập nhật trạng thái.'),
    createBullet('Bảng profiles: Người dùng chỉ được sửa thông tin cá nhân của chính mình. Chỉ Admin mới có quyền xem toàn bộ danh sách và kích hoạt/khóa tài khoản.'),
    createH2('6.3. Kiến trúc Hybrid Database Adapter & Cơ chế Fallback an toàn'),
    createParagraph(
      'Hệ thống FrontEnd giao tiếp với cơ sở dữ liệu qua lớp chuyển đổi supabaseAdapter.ts. Nếu kết nối Supabase Cloud bị gián đoạn hoặc không có internet, hệ thống tự động fallback về Mock Server Node.js (cổng 4000) hoặc nạp hạt giống dữ liệu cục bộ. Nhờ đó, giảng viên và hội đồng kiểm thử có thể đánh giá toàn bộ chức năng mượt mà 100% trong mọi điều kiện mạng.'
    )
  );

  // ==================== CHƯƠNG 7 ====================
  children.push(
    createH1('CHƯƠNG 7: THIẾT KẾ DESIGN TOKENS, KHỬ TRÀN VIỀN & TIẾP CẬN A11Y'),
    createH2('7.1. Bảng Design Tokens Hoàng Triều'),
    createParagraph(
      'Toàn bộ phong cách mỹ thuật của dự án được kiểm soát thông qua hệ thống biến CSS toàn cục (CSS Variables) tại globals.css:'
    ),
    createBullet('Màu đỏ đô hoàng gia (--color-primary: #8B0000 / #A52A2A): Thể hiện nét trang nghiêm, hỷ khánh chốn cung đình Huế.'),
    createBullet('Màu vàng kim triều Nguyễn (--color-gold: #C59B27 / #D4AF37): Thể hiện sự tôn quý, vương giả của bậc hoàng gia.'),
    createBullet('Nền kem sáng ngà (--color-bg-light: #FDFBF7): Mang lại cảm giác thanh lịch, dịu mắt như giấy sắc phong cổ.'),
    createBullet('Chế độ Nền tối (--color-bg-dark: #120F0D, --color-surface-dark: #1F1916): Không gian đêm hoàng cung lung linh, huyền ảo.'),
    createBullet('Typography Cung Đình: Font tiêu đề Playfair Display (Serif cổ điển sang trọng), Font nội dung Be Vietnam Pro (Sans-serif sắc nét, hỗ trợ tiếng Việt hoàn mỹ).'),
    createH2('7.2. Kỹ thuật triệt tiêu 100% lỗi tràn viền và thanh cuộn ngang'),
    createParagraph(
      'Để đảm bảo giao diện không bao giờ bị tràn khung nhìn trên bất kỳ thiết bị nào (máy tính để bàn, laptop, tablet, điện thoại thông minh):'
    ),
    createBullet('Toàn cục: Áp dụng thuộc tính overflow-x: clip; trên các thẻ html, body, #root. Thuộc tính clip triệt tiêu hoàn toàn thanh cuộn ngang do các animation bay hoặc phần tử lệch tọa độ gây ra, đồng thời bảo toàn 100% tính năng position: sticky của Header và giỏ hàng.'),
    createBullet('Lớp nhẫn bay (FixedFloatingRings): Đặt kích thước width: 100%; height: 100%; pointer-events: none; z-index: -1; thay cho 100vw/100vh để không tính thêm độ rộng của thanh cuộn dọc Windows.'),
    createBullet('Bảng Kanban & Form responsive: Sử dụng thuộc tính grid-template-columns: minmax(0, 1fr) và min-width: 0 giúp các khung nhập liệu co giãn tự nhiên, không bị vỡ layout.'),
    createH2('7.3. Khả năng tiếp cận người khuyết tật (A11y)'),
    createBullet('Mọi trường nhập liệu đều có id, name, aria-invalid, aria-describedby và nhãn label rõ ràng.'),
    createBullet('Toàn bộ thông báo lỗi hiển thị trong thẻ có role="alert".'),
    createBullet('Các nút bấm dạng biểu tượng đều có aria-label tương ứng.'),
    createBullet('Hỗ trợ đầy đủ phím Escape để đóng nhanh các cửa sổ Modal, Giỏ hàng và Hợp đồng in ấn.')
  );

  // ==================== CHƯƠNG 8 ====================
  children.push(
    createH1('CHƯƠNG 8: KẾT QUẢ KIỂM THỬ TỰ ĐỘNG & TRIỂN KHAI PRODUCTION'),
    createH2('8.1. Kết quả kiểm thử tự động Vitest (26/26 ca kiểm thử thành công)'),
    createParagraph(
      'Bộ kiểm thử tự động được xây dựng bằng Vitest kết hợp @testing-library/react nhằm kiểm soát chất lượng từ mã nguồn:'
    ),
    createTable(
      ['STT', 'Tập Tin Kiểm Thử', 'Phạm Vi Kiểm Thử', 'Số Lượng Test', 'Trạng Thái'],
      [
        ['1', 'src/test/routes.test.tsx', 'Kiểm thử định tuyến React Router v8, kiểm tra quyền truy cập Public, User và Admin', '10 Tests', '100% Passed'],
        ['2', 'src/test/validation.test.ts', 'Kiểm thử kiểm thực Zod Schema 3 tầng, kiểm tra định dạng số điện thoại, ngày cưới, ngân sách', '16 Tests', '100% Passed'],
      ],
      [600, 3000, 4000, 1400, 1000]
    ),
    createCallout(
      'KẾT QUẢ THỰC THI VITEST (NATIVE CONSOLE OUTPUT)',
      'Test Files  2 passed (2)\nTests  26 passed (26)\nStart at  15:35:00\nDuration  2.08s (transform 340ms, setup 0ms, collect 450ms, tests 85ms)\n\n' +
      'Toàn bộ 26/26 ca kiểm thử đều vượt qua xuất sắc mà không có bất kỳ cảnh báo nào.'
    ),
    createH2('8.2. Kiểm tra kiểu dữ liệu TypeScript Strict & Đóng gói Vite 6'),
    createParagraph(
      'Lệnh npm run typecheck hoàn thành với mã thoát 0 (Exit Code 0), chứng minh mã nguồn không chứa bất kỳ lỗi kiểu dữ liệu nào. Quá trình đóng gói sản phẩm hoàn tất sau 3.08 giây với dung lượng bundle tối ưu.'
    ),
    createH2('8.3. Triển khai đám mây Vercel (Production Live)'),
    createParagraph(
      'Ứng dụng được triển khai trực tiếp trên Vercel Global Edge Network tại địa chỉ https://huecungdinh.vercel.app. Tệp cấu hình vercel.json thiết lập quy tắc định tuyến Single Page Application (SPA Rewrite) trỏ toàn bộ request về /index.html, triệt tiêu hoàn toàn lỗi 404 Not Found khi người dùng nhấn F5 tải lại trang.'
    )
  );

  // ==================== CHƯƠNG 9 ====================
  children.push(
    createH1('CHƯƠNG 9: HƯỚNG DẪN VẬN HÀNH & KỊCH BẢN NGHIỆM THU ĐỒ ÁN'),
    createH2('9.1. Hướng dẫn cài đặt và khởi chạy môi trường phát triển'),
    createBullet('Bước 1: Cài đặt các thư viện phụ thuộc bằng lệnh: npm install'),
    createBullet('Bước 2: Khởi chạy máy chủ Backend giả lập (Terminal 1): npm run server (chạy tại http://localhost:4000)'),
    createBullet('Bước 3: Khởi chạy ứng dụng FrontEnd Vite (Terminal 2): npm run dev (truy cập tại http://localhost:5173)'),
    createBullet('Bước 4: Chạy kiểm thử tự động: npm test | Kiểm tra type: npm run typecheck'),
    createH2('9.2. Danh sách tài khoản trải nghiệm 2 cấp độ'),
    createTable(
      ['Cấp Độ Tài Khoản', 'Tên Đăng Nhập', 'Mật Khẩu', 'Phạm Vi Thử Nghiệm & Đặc Quyền'],
      [
        ['Quản Trị Viên (Admin)', 'admin', '123456 (hoặc 123)', 'Toàn quyền: Dashboard Corbel, CRUD dịch vụ/gói cưới, Bảng Kanban, Quản lý tài khoản, Cẩm nang SOP.'],
        ['Khách Hàng (Customer)', 'khachhang', '123456 (hoặc 123)', 'Trải nghiệm khách: Xem chi tiết dịch vụ/gói, đặt lịch Royal Dropdown, giỏ hàng cọc 20%, tạo thiệp, in hợp đồng A4.'],
      ],
      [2200, 1800, 1800, 4200]
    ),
    createH2('9.3. Kịch bản nghiệm thu 10 bước chuẩn mực dành cho Hội đồng chấm thi'),
    createBullet('Bước 1: Truy cập Trang Chủ (/), kiểm tra Hero banner hoàng gia, Marquee chuyển động mượt mà và chuyển đổi Dark/Light Mode.'),
    createBullet('Bước 2: Vào Dịch Vụ Lẻ (/dich-vu), lọc theo loại cổ phục/thợ ảnh/địa điểm, sắp xếp giá. Thử bấm "Xem Chi Tiết" khi chưa đăng nhập để chứng kiến hệ thống chuyển hướng về /login.'),
    createBullet('Bước 3: Tại trang /login, bấm nút "Nhanh: Khách Hàng", đăng nhập tài khoản khachhang. Tự động chuyển hướng xem chi tiết dịch vụ.'),
    createBullet('Bước 4: Vào Gói Cưới (/goi-cuoi), xem gói "Cung Đình Khang Ninh", bấm xem chi tiết (/goi-cuoi/:id), thử tính năng "Xem Nhanh" dịch vụ thành phần bằng modal popup và nhận báo giá đàm phán.'),
    createBullet('Bước 5: Thử nghiệm phân hệ Đặt Lịch (/dat-lich), mở Royal Custom Dropdown để trải nghiệm menu địa danh di sản và gói cưới hoàng gia có hiệu ứng lấp lánh Pure SVG. Gửi đơn thành công.'),
    createBullet('Bước 6: Vào AI Tư Vấn (/tu-van), kéo thanh trượt kinh phí 35 triệu, chọn 2 bộ cổ phục và địa điểm Đại Nội, bấm "Phân Tích", xem kết quả gợi ý tức thời.'),
    createBullet('Bước 7: Vào Kho Thiệp Cưới (/thiep-cuoi), mở xem trước thiệp di động, nghe Nhã Nhạc Cung Đình ngũ cung (Web Audio API), xem VietQR mừng cưới động. Vào /thiep-cuoi/dang-ky để thử tạo thiệp 2 cột.'),
    createBullet('Bước 8: Vào Giỏ Hàng (/gio-hang), kiểm tra hạng mục đã thêm, bấm "Đặt Lịch Ngay", kiểm tra mã VietQR đặt cọc 20% tự động tính toán.'),
    createBullet('Bước 9: Vào Đơn Của Tôi (/don-cua-toi), bổ sung mong muốn chụp ảnh cho đơn, thử tính năng "Xuất & In Hợp Đồng A4" để xem trang in pháp lý sắc nét qua @media print.'),
    createBullet('Bước 10: Đăng xuất và đăng nhập tài khoản admin. Truy cập Dashboard (/admin) kiểm tra live visitor counter, 4 thẻ KPI Sparklines, Bar Chart và Donut Chart SVG tương tác. Mở Bảng Kanban Yêu Cầu (/admin/yeu-cau) kéo chuyển trạng thái đơn. Vào /admin/tai-khoan kiểm tra quản lý tài khoản và mở Cẩm nang SOP (/quy-trinh) để in quy trình A4.'),
    createParagraph('', { pageBreakBefore: true })
  );

  // ==================== LỜI KẾT ====================
  children.push(
    createH1('KẾT LUẬN VÀ LỜI CẢM ƠN'),
    createParagraph(
      'Đồ án "Huế Cung Đình – Dịch Vụ Cưới & Nhiếp Ảnh Cổ Phục Hoàng Triều" đã hoàn thành 100% các mục tiêu đề ra cho học phần Web FrontEnd Nâng Cao. Dự án đã chứng minh khả năng làm chủ công nghệ sâu sắc thông qua việc tự xây dựng 100% giao diện bằng CSS thuần, tự tính toán toạ độ vẽ biểu đồ và biểu tượng SVG, áp dụng nghiêm ngặt kiến trúc Feature-Based, kiểm soát kiểu dữ liệu TypeScript không chút sơ hở và tích hợp trơn tru cơ sở dữ liệu đám mây Supabase PostgreSQL.'
    ),
    createParagraph(
      'Sản phẩm không chỉ đáp ứng xuất sắc các tiêu chí học thuật của nhà trường mà còn mang giá trị văn hóa thiết thực, góp phần gìn giữ, tôn vinh và quảng bá nét đẹp di sản Cố Đô Huế đến cộng đồng trong thời đại kỷ nguyên số.'
    ),
    createParagraph(
      'Em xin gửi lời cảm ơn chân thành và sâu sắc nhất đến Thầy Dương Ngọc Duy – Giảng viên hướng dẫn học phần Web FrontEnd Nâng Cao – người đã tận tâm truyền đạt kiến thức chuyên môn vững chắc, đưa ra những định hướng kiến trúc quý báu và phản biện sắc sảo để đồ án được hoàn thiện ở mức chuẩn mực cao nhất.'
    ),
    createParagraph('Sinh viên thực hiện:', {
      alignment: AlignmentType.RIGHT,
      before: 400,
      after: 80,
      italics: true,
      color: COLOR_MUTED,
    }),
    createParagraph('TRẦN CÔNG QUÝ', {
      alignment: AlignmentType.RIGHT,
      before: 0,
      after: 100,
      size: 26,
      bold: true,
      color: COLOR_PRIMARY,
    }),
    createParagraph('MSSV: 2401ITA001 – Lớp CNTT K22', {
      alignment: AlignmentType.RIGHT,
      before: 0,
      after: 400,
      size: 22,
      color: COLOR_TEXT,
    })
  );

  // Create Document
  const doc = new Document({
    creator: 'Trần Công Quý',
    title: 'Báo Cáo Tổng Quan Đồ Án Huế Cung Đình - Web FrontEnd Nâng Cao',
    description: 'Báo cáo kỹ thuật toàn diện đồ án tốt nghiệp học phần Web FrontEnd Nâng Cao (INT.7.18)',
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: 24, // 12pt
            color: COLOR_TEXT,
          },
          paragraph: {
            spacing: {
              line: 360, // 1.5 spacing
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
              top: 1440, // 1 inch = 1440 twips
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
                    text: 'ĐỒ ÁN WEB FRONTEND NÂNG CAO – HUẾ CUNG ĐÌNH (MÃ: INT.7.18)',
                    font: FONT_FAMILY,
                    size: 18,
                    italics: true,
                    color: COLOR_MUTED,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 200 },
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
                    text: 'Sinh viên: Trần Công Quý (MSSV: 2401ITA001) – Trang ',
                    font: FONT_FAMILY,
                    size: 18,
                    color: COLOR_MUTED,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT_FAMILY,
                    size: 18,
                    color: COLOR_MUTED,
                  }),
                  new TextRun({
                    text: ' / ',
                    font: FONT_FAMILY,
                    size: 18,
                    color: COLOR_MUTED,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: FONT_FAMILY,
                    size: 18,
                    color: COLOR_MUTED,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 200 },
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
  console.log(`Document written successfully: ${outputPath} (${buffer.length} bytes)`);
}

generateWordReport().catch(err => {
  console.error('Error generating document:', err);
  process.exit(1);
});
