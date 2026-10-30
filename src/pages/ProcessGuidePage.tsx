import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Icon, IconName } from "../components/common/Icon";
import { Button } from "../components/common/UI";
import "./ProcessGuidePage.css";

/* ==========================================================================
   1. TYPES & DATA STRUCTURES
   ========================================================================== */
type MainTab = "sop" | "roles" | "systems" | "rules";

interface SOPItem {
  id: string;
  code: string;
  title: string;
  category: string;
  role: string;
  duration: string;
  description: string;
  steps: Array<{
    stepNumber: number;
    title: string;
    detail: string;
    target?: string;
  }>;
  standards: string[];
}

interface RoleItem {
  id: string;
  code: string;
  name: string;
  badge: string;
  icon: IconName;
  fullTitle: string;
  description: string;
  checklist: Array<{
    id: string;
    time: string;
    task: string;
  }>;
  keyDuties: Array<{
    title: string;
    desc: string;
  }>;
}

interface SystemModule {
  id: string;
  name: string;
  path: string;
  icon: IconName;
  tag: string;
  description: string;
  inputs: string[];
  outputs: string[];
  coreActions: string[];
}

interface BusinessRule {
  id: string;
  code: string;
  category:
    | "Bảo tồn Di sản"
    | "Tài chính & Cọc"
    | "Bảo mật & Bản quyền"
    | "Phân quyền Hệ thống";
  title: string;
  rule: string;
  penalty: string;
}

/* ==========================================================================
   2. STATIC DATABASE DÀNH RIÊNG CHO DỰ ÁN HUẾ CUNG ĐÌNH
   ========================================================================== */
const SOP_DATA: SOPItem[] = [
  {
    id: "sop-01",
    code: "SOP-CS-01",
    title: "Tiếp Nhận & Khởi Tạo Đơn Tư Vấn Hoàng Gia",
    category: "Chăm Sóc & Đặt Lịch",
    role: "Chuyên Viên Tư Vấn & Stylist",
    duration: "30 - 60 Phút",
    description:
      "Quy trình tiêu chuẩn tiếp nhận thông tin khách hàng từ Form Báo Giá Nhanh, AI Tư Vấn hoặc Giỏ dịch vụ, xác minh lịch chụp di sản và chuyển trạng thái trên Bảng Kanban.",
    steps: [
      {
        stepNumber: 1,
        title: "Thu thập & Đối chiếu dữ liệu yêu cầu",
        detail:
          "Hệ thống tiếp nhận thông tin (Họ tên, SĐT Zalo, ngày cưới dự kiến, địa điểm mong muốn, danh sách dịch vụ chọn lọc). Kiểm tra trùng lặp với các đơn đã có trong CSDL Supabase.",
        target:
          "Hệ thống ghi nhận đơn vào bảng 'yeu_cau' với trạng thái 'Chờ duyệt'",
      },
      {
        stepNumber: 2,
        title: "Kiểm tra quỹ ngày chụp tại Di tích Cố Đô",
        detail:
          "Đối chiếu ngày chụp của khách với lịch cấp phép của Trung tâm Bảo tồn Di tích Cố đô Huế (tránh các ngày đóng cửa trùng tu Điện Kiến Trung, Cung Diên Thọ hoặc lễ hội Festival Huế).",
        target: "Xác nhận tính khả thi của ngày bấm máy",
      },
      {
        stepNumber: 3,
        title: "Liên hệ tư vấn & Thương lượng combo",
        detail:
          "Gọi điện/Zalo chuyên nghiệp trong vòng 1 giờ làm việc. Nếu khách hàng bỏ bớt hạng mục trong combo, chuyên viên tư vấn áp dụng chính sách thương lượng giá theo nhu cầu thực tế.",
        target: "Chốt báo giá chính thức và hướng dẫn đặt cọc 20%",
      },
      {
        stepNumber: 4,
        title: "Cập nhật tiến độ trên Bảng Kanban Quản Trị",
        detail:
          "Kéo thẻ đơn từ cột 'Mới tiếp nhận' sang cột 'Đã liên hệ / Đã tư vấn'. Ghi chú kích thước trang phục, yêu cầu bối cảnh đặc biệt vào hồ sơ đơn hàng.",
        target: "Đơn sẵn sàng cho buổi thử cổ phục may đo",
      },
    ],
    standards: [
      "Thời gian phản hồi khách hàng: Tối đa 60 phút kể từ lúc gửi đơn.",
      "Thái độ giao tiếp: Trang trọng, nhã nhặn, chuẩn mực phong cách Cố Đô.",
      "Thông tin minh bạch 100%, không phát sinh phụ phí ẩn ngoài hợp đồng.",
    ],
  },
  {
    id: "sop-02",
    code: "SOP-AT-02",
    title: "Thử Đồ & May Đo Cổ Phục Triều Nguyễn",
    category: "Phục Trang Hoàng Gia",
    role: "Chuyên Viên Stylist Cổ Phục",
    duration: "2 - 3 Giờ",
    description:
      "Quy trình lấy số đo, tư vấn kiểu dáng Áo Nhật Bình ngũ thân, Áo Tấc, tuyển chọn trâm cài ngọc hoàng tộc và đóng gói niêm phong trang phục trước ngày bấm máy.",
    steps: [
      {
        stepNumber: 1,
        title: "Đón tiếp & Khảo sát phong cách cô dâu chú rể",
        detail:
          "Mời trà sen cung đình, tìm hiểu sở thích màu sắc (Đỏ son hoàng hậu, Vàng gấm long phượng, Xanh lục bảo, Lam ngọc triều đình) và vóc dáng của cặp đôi.",
        target: "Xác định 02 - 03 bộ cổ phục phù hợp nhất",
      },
      {
        stepNumber: 2,
        title: "Thử đồ & Đo ni tấc may đo chỉnh sửa",
        detail:
          "Mặc thử Áo Nhật Bình thêu tay chỉ vàng và Áo Tấc nam ngũ thân. Đo ni tấc vòng ngực, hạ eo, dài tay thụng để nghệ nhân may thêu tinh chỉnh vừa khít với cơ thể.",
        target: "Đảm bảo trang phục trang nghiêm, vừa vặn tôn dáng tuyệt đối",
      },
      {
        stepNumber: 3,
        title: "Phối trâm cài ngọc, khăn lươn & phụ kiện cổ phong",
        detail:
          "Chọn trâm phượng hoàng mạ vàng đính ngọc trai, khăn lươn gấm dệt, quạt lông vũ, hài nhung thêu chỉ vàng và chuỗi ngọc bội bội ngọc hoàng tộc.",
        target: "Trọn bộ phụ kiện đồng bộ theo chuẩn mực nghi lễ cung đình",
      },
      {
        stepNumber: 4,
        title: "Đóng gói bao tơ tằm & Niêm phong mã đơn",
        detail:
          "Ủ hương trầm nón bài thơ, là ủi bằng hơi nước chuyên dụng, treo vào bao bọc vải lụa tơ tằm chống ẩm mốc và gắn tem mã đơn chụp ảnh.",
        target: "Sẵn sàng bàn giao cho Ekip chụp ảnh trước 24 giờ",
      },
    ],
    standards: [
      "100% Cổ phục được giặt khô sinh học và là ủi phẳng phiu không tì vết.",
      "Trâm ngọc và phụ kiện được khử khuẩn bằng dung dịch bảo quản trang sức.",
      "Trang phục có tem mã vạch đối chiếu chính xác với hợp đồng chụp.",
    ],
  },
  {
    id: "sop-03",
    code: "SOP-PH-03",
    title: "Tác Nghiệp Chụp Ảnh Di Sản Cố Đô (Đại Nội & Lăng Tẩm)",
    category: "Nhiếp Ảnh Hiện Trường",
    role: "Nhiếp Ảnh Gia & Ekip Chụp",
    duration: "01 Ngày (8 Tiếng)",
    description:
      "Quy trình tác nghiệp chụp ảnh cưới tại quần thể di tích Đại Nội Huế, Cung Diên Thọ, Điện Kiến Trung và Lăng Tự Đức, đảm bảo an toàn di sản và ánh sáng nghệ thuật đỉnh cao.",
    steps: [
      {
        stepNumber: 1,
        title: "06:30 - Xuất trình giấy phép & Tập hợp Ekip",
        detail:
          "Có mặt tại Cổng Ngọ Môn. Xuất trình giấy phép chụp ảnh di tích đã được phê duyệt. Kiểm tra trang thiết bị máy ảnh Sony A7R5/Canon R5, ống kính Prime GM, flycam và đèn hắt sáng.",
        target:
          "Hoàn tất thủ tục di sản, đảm bảo đủ 3 nhân sự (1 Thợ chính, 1 Thợ phụ, 1 Stylist)",
      },
      {
        stepNumber: 2,
        title: "07:30 - 11:30: Chụp buổi sáng tại Đại Nội & Cung Diên Thọ",
        detail:
          "Chụp nghi thức kết duyên hoàng tộc tại hành lang Cung Diên Thọ, vườn ngự uyển và thềm rồng Điện Kiến Trung khi nắng sớm trong trẻo, không bị bóng gắt.",
        target:
          "Tối thiểu 300 - 400 file ảnh gốc góc rộng và chân dung chi tiết",
      },
      {
        stepNumber: 3,
        title:
          "14:00 - 17:30: Chụp buổi chiều ngoại cảnh & Hoàng hôn sông Hương",
        detail:
          "Di chuyển về Biệt Phủ Cổ hoặc Đồi Thông Thiên An / Bến Thuyền Sông Hương. Chụp khoảnh khắc hoàng hôn buông xuống cầu Trường Tiền với áo dài gấm và nón bài thơ.",
        target: "Ghi lại những khung hình lãng mạn đậm chất thi ca xứ Huế",
      },
      {
        stepNumber: 4,
        title: "18:30 - Sao lưu dự phòng dữ liệu ảnh gốc (Double Backup)",
        detail:
          "Về đến studio, nhiếp ảnh gia cắm thẻ nhớ sao lưu toàn bộ file RAW gốc vào đồng thời 2 ổ cứng SSD độc lập (Ổ cứng chính và NAS đám mây).",
        target: "Cam kết 0% rủi ro mất mát dữ liệu hình ảnh ngày trọng đại",
      },
    ],
    standards: [
      "Tuân thủ 100% nội quy bảo tồn di tích: Không ngồi lên hiện vật, không giẫm lên thềm đá cổ.",
      "Ekip luôn có Stylist đi kèm chỉnh trang tà áo, cổ áo và dặm phấn từng góc chụp.",
      "Bàn giao tối thiểu 600 - 800 file ảnh gốc chất lượng cao cho mỗi buổi chụp.",
    ],
  },
  {
    id: "sop-04",
    code: "SOP-DP-04",
    title: "Hậu Kỳ Tone Màu Cung Đình & Sản Xuất Album Sơn Mài",
    category: "Hậu Kỳ & Chế Tác",
    role: "Bộ Phận Thiết Kế & Hậu Kỳ",
    duration: "5 - 7 Ngày",
    description:
      "Quy trình xử lý màu sắc chuẩn Cung Đình Hoài Niệm (Tone Film Cố Đô), dàn trang photobook nghệ thuật và chế tác bìa sơn mài truyền thống cẩn xà cừ.",
    steps: [
      {
        stepNumber: 1,
        title: "Phát hành link chọn ảnh trực tuyến",
        detail:
          "Gửi link Google Drive bảo mật cho cô dâu chú rể trong vòng 24 giờ sau chụp. Hướng dẫn khách hàng chọn ra 50 tấm ảnh tâm đắc nhất để làm album chính.",
        target: "Nhận danh sách mã số 50 ảnh được duyệt từ phía khách hàng",
      },
      {
        stepNumber: 2,
        title: "Chỉnh sửa hậu kỳ chuyên sâu (Master Color Grading)",
        detail:
          "Xử lý da mịn màng giữ vân tự nhiên, cân bằng sắc độ đỏ son gấm Nhật Bình, ánh sáng cổ kính rêu phong và chất vàng son lộng lẫy của kinh thành Huế.",
        target: "Hoàn thiện 50 file ảnh Master độ phân giải in ấn 300 DPI",
      },
      {
        stepNumber: 3,
        title: "Dàn trang layout Photobook & Duyệt market PDF",
        detail:
          "Thiết kế dàn trang song ngữ hoặc chữ Hỷ cung đình, lồng ghép thơ ca xứ Huế. Xuất file PDF market gửi cô dâu chú rể duyệt bố cục và chỉnh sửa theo yêu cầu.",
        target: "Khách hàng xác nhận đồng ý in ấn 100%",
      },
      {
        stepNumber: 4,
        title: "Chế tác bìa sơn mài & Đóng gói hộp lụa",
        detail:
          "In trên giấy ảnh Fuji Crystal Silk chống thấm nước, bồi ruột PVC chống cong vênh. Bìa album phủ sơn mài thủ công cẩn xà cừ hoa sen vàng. Đặt trong hộp lụa gấm thêu son.",
        target: "Sản phẩm hoàn mỹ, sang trọng, lưu giữ kỷ vật trăm năm",
      },
    ],
    standards: [
      "Màu sắc in ra đạt độ chuẩn xác 98% so với file Master trên màn hình màu chuẩn.",
      "Photobook bảo hành cong vênh và phai màu trong vòng 10 năm.",
      "Bàn giao 100% file ảnh gốc và file hậu kỳ chất lượng cao qua link vĩnh viễn.",
    ],
  },
  {
    id: "sop-05",
    code: "SOP-IV-05",
    title: "Khởi Tạo & Phát Hành Mẫu Thiệp Cưới Online RSVP",
    category: "Thiệp Cưới Điện Tử",
    role: "Khách Hàng & Kỹ Thuật Hệ Thống",
    duration: "15 - 30 Phút",
    description:
      "Quy trình chọn mẫu thiệp cưới trong kho 9 giao diện (VIP, PRO, BASIC), tùy biến thứ bậc gia đình, cấu hình mã VietQR mừng cưới động và tích hợp hệ thống RSVP.",
    steps: [
      {
        stepNumber: 1,
        title: "Lựa chọn hạng thiệp và phong cách hôn lễ",
        detail:
          "Khách hàng truy cập phân hệ 'Mẫu Thiệp Cưới', chọn Hạng giao diện (VIP / PRO / BASIC) và Phong cách cưới (Cung Đình / Cổ Điển / Hiện Đại) với bảng giá niêm yết minh bạch.",
        target: "Chọn mẫu thiệp phù hợp sở thích và kinh phí",
      },
      {
        stepNumber: 2,
        title: "Nhập thông tin thứ bậc gia đình & Lời ngỏ",
        detail:
          "Điền họ tên chú rể kèm danh xưng gia đình (Trưởng Nam, Thứ Nam, Út Nam...), họ tên cô dâu (Trưởng Nữ, Thứ Nữ, Út Nữ...), thời gian hoàng đạo, ngày âm lịch và bản đồ địa điểm.",
        target: "Dữ liệu được cập nhật thời gian thực vào bản xem trước thiệp",
      },
      {
        stepNumber: 3,
        title: "Cấu hình tài khoản nhận mừng cưới Dynamic VietQR",
        detail:
          "Nhập số tài khoản ngân hàng và tên chủ tài khoản cô dâu chú rể. Hệ thống tự động sinh mã VietQR động chuẩn NAPAS247 hiển thị trực tiếp trong thiệp cưới.",
        target: "Khách mời quét mã mừng cưới chính xác 100% không sợ nhầm STK",
      },
      {
        stepNumber: 4,
        title: "Xuất bản link thiệp và quản lý xác nhận tham dự",
        detail:
          "Lưu thiệp vào hệ thống, nhận link thiệp riêng biệt chia sẻ qua Zalo/Facebook. Khách mời gửi lời chúc và nhấn 'Sẽ Tham Dự' / 'Không Thể Tham Dự' giúp gia đình chốt cỗ cưới.",
        target: "Thống kê chính xác số lượng khách mời tham dự ngày cưới",
      },
    ],
    standards: [
      "Nhạc nhã nhạc cung đình và hiệu ứng hoa sen tự động phát mượt mà trên di động.",
      "Mã VietQR hiển thị rõ ràng, quét được trên tất cả ứng dụng ngân hàng tại Việt Nam.",
      "Thời gian tải trang thiệp dưới 1.2 giây trên mạng di động 4G.",
    ],
  },
  {
    id: "sop-06",
    code: "SOP-CT-06",
    title: "Ký Kết Hợp Đồng & Quyết Toán Tài Chính Pháp Lý",
    category: "Pháp Lý & Hợp Đồng",
    role: "Khách Hàng & Quản Trị Viên (Admin)",
    duration: "10 - 15 Phút",
    description:
      "Quy trình đặt cọc 20% qua VietQR, kích hoạt hiệu lực đơn chụp ảnh, xuất và in hợp đồng chuẩn khổ A4 có giá trị pháp lý song phương giữa Studio và Khách hàng.",
    steps: [
      {
        stepNumber: 1,
        title: "Xác nhận đặt lịch từ Giỏ hàng hoặc Đơn của tôi",
        detail:
          "Khách hàng kiểm tra danh sách hạng mục, tổng chi phí dự toán và nhấn 'Đồng Ý Đặt Lịch' tại trang Giỏ Hàng hoặc trang Đơn Của Tôi.",
        target:
          "Tạo lập bản ghi hợp đồng chụp ảnh di sản có mã định danh duy nhất",
      },
      {
        stepNumber: 2,
        title: "Đặt cọc 20% giữ lịch qua Dynamic VietQR",
        detail:
          "Hệ thống sinh mã QR MB Bank kèm số tiền cọc (20% tổng giá trị) và nội dung chuyển khoản tự động. Khách quét mã hoàn tất đặt cọc trong 30 giây.",
        target:
          "Đơn được đánh dấu 'Đã cọc 20%' và khóa ngày chụp trên hệ thống",
      },
      {
        stepNumber: 3,
        title: "Phê duyệt đơn và cấp quyền In Hợp Đồng A4",
        detail:
          "Quản trị viên (Admin) kiểm tra thông tin cọc trên Bảng Kanban, chuyển trạng thái sang 'Đã duyệt'. Nút 'In Hợp Đồng A4' tự động mở khóa cho cả Khách hàng và Admin.",
        target:
          "Hợp đồng pháp lý đầy đủ điều khoản cam kết có hiệu lực chính thức",
      },
      {
        stepNumber: 4,
        title: "Xuất & In Hợp Đồng A4 Pháp Lý (window.print)",
        detail:
          "Bấm 'In Hợp Đồng A4' để xem bản hợp đồng trang trọng khổ A4 (hoa văn cung đình, danh sách dịch vụ, điều khoản bồi thường, chữ ký đại diện studio). In giấy hoặc xuất PDF.",
        target:
          "Lưu trữ văn bản pháp lý làm căn cứ nghiệm thu và thanh toán 80% còn lại",
      },
    ],
    standards: [
      "Hợp đồng tuân thủ Nghị định thương mại điện tử và pháp luật Việt Nam.",
      "Bản in A4 được căn lề chuẩn mực 20mm, không bị vỡ bảng hoặc tràn trang.",
      "Chính sách bảo lưu cọc minh bạch: Hoàn 100% nếu báo trước 7 ngày.",
    ],
  },
];

const ROLES_DATA: RoleItem[] = [
  {
    id: "role-owner",
    code: "ADMIN-01",
    name: "Chủ Studio / Tổng Quản Trị",
    badge: "Toàn quyền hệ thống",
    icon: "crown",
    fullTitle: "Chủ Studio / Tổng Giám Đốc (Owner / Studio Director)",
    description:
      "Toàn quyền điều hành trên toàn bộ hệ thống Huế Cung Đình. Là vai trò DUY NHẤT được cấu hình danh mục dịch vụ lẻ, bảng giá gói combo, quản lý tài khoản người dùng, phân quyền RBAC và phê duyệt thanh toán hợp đồng.",
    checklist: [
      {
        id: "c-own-1",
        time: "07:30",
        task: "Kiểm tra Dashboard KPI doanh thu, tỷ lệ chốt đơn và số lượng đơn mới trong ngày.",
      },
      {
        id: "c-own-2",
        time: "09:00",
        task: "Duyệt danh sách các đơn đã đặt cọc 20% trên Bảng Kanban để xuất hợp đồng A4.",
      },
      {
        id: "c-own-3",
        time: "11:30",
        task: "Kiểm tra chất lượng phục vụ và đánh giá của khách hàng tại trang chi tiết dịch vụ.",
      },
      {
        id: "c-own-4",
        time: "14:30",
        task: "Rà soát tồn kho cổ phục cao cấp và lịch cấp phép chụp ảnh tại Đại Nội Huế.",
      },
      {
        id: "c-own-5",
        time: "17:30",
        task: "Đối soát dòng tiền đặt cọc qua tài khoản VietQR MB Bank với kế toán.",
      },
      {
        id: "c-own-6",
        time: "20:00",
        task: "Xem báo cáo biểu đồ SVG doanh thu & xếp hạng Top dịch vụ được đặt nhiều nhất.",
      },
    ],
    keyDuties: [
      {
        title: "Thẩm quyền Bảng Điều Hành & Báo Cáo KPI",
        desc: "Theo dõi doanh thu thực thu, dự toán phát sinh, tỷ lệ hủy đơn và phân tích xu hướng sở thích cổ phục triều Nguyễn qua biểu đồ SVG Bar & Donut.",
      },
      {
        title: "Quản Trị Bảng Giá & Danh Mục Gói Cưới",
        desc: "Thêm mới, cập nhật hình ảnh, sửa đổi giá trọn gói combo và dịch vụ lẻ. Kích hoạt huy hiệu '⭐ Được Đặt Nhiều Nhất' cho các gói tiêu biểu.",
      },
      {
        title: "Phê Duyệt Hợp Đồng & Ký Kết Pháp Lý",
        desc: "Kiểm duyệt các điều khoản hợp đồng A4, xác nhận giải quyết khiếu nại, hoàn cọc hoặc bảo lưu lịch chụp theo chính sách di sản.",
      },
      {
        title: "Phân Quyền Người Dùng & Bảo Mật RBAC",
        desc: "Cấp quyền tài khoản Admin hoặc User, quản lý lịch sử truy cập và giám sát tính toàn vẹn của cơ sở dữ liệu Supabase.",
      },
    ],
  },
  {
    id: "role-stylist",
    code: "STYLIST-02",
    name: "Chuyên Viên Stylist & Cổ Phục",
    badge: "Tác nghiệp phục trang",
    icon: "sparkles",
    fullTitle: "Chuyên Viên Phục Trang & Stylist Cung Đình (Royal Stylist)",
    description:
      "Chịu trách nhiệm bảo tồn, may đo và phối trang phục cổ phong triều Nguyễn (Áo Nhật Bình, Áo Tấc ngũ thân, Khăn lươn, Hài thêu) cho cô dâu chú rể. Đồng hành hỗ trợ chỉnh trang tà áo trong suốt buổi chụp.",
    checklist: [
      {
        id: "c-sty-1",
        time: "07:00",
        task: "Kiểm tra và khử khuẩn bộ trang phục Nhật Bình, Áo Tấc đã niêm phong cho lịch chụp hôm nay.",
      },
      {
        id: "c-sty-2",
        time: "08:30",
        task: "Hỗ trợ cô dâu chú rể mặc cổ phục đúng quy thức cung đình, cố định trâm cài ngọc hoàng tộc.",
      },
      {
        id: "c-sty-3",
        time: "10:30",
        task: "Đi cùng ekip tại Cung Diên Thọ, liên tục căn chỉnh tà áo thụng và dặm phấn giữ lớp makeup.",
      },
      {
        id: "c-sty-4",
        time: "14:00",
        task: "Đổi trang phục set 2 (Áo dài gấm hoàng gia hoặc Cổ phục tân thời) cho buổi chụp hoàng hôn.",
      },
      {
        id: "c-sty-5",
        time: "18:00",
        task: "Thu hồi trang phục, kiểm tra độ nguyên vẹn đường chỉ thêu kim tuyến và gửi bộ phận giặt khô.",
      },
      {
        id: "c-sty-6",
        time: "19:30",
        task: "Đón tiếp cặp đôi đến thử đồ cho lịch chụp ngày kế tiếp, ghi nhận số đo ni tấc.",
      },
    ],
    keyDuties: [
      {
        title: "Nghiên Cứu Quy Thức Cổ Phục Chuẩn Xác",
        desc: "Nắm vững hoa văn loan phụng, ngũ thân lập lĩnh, tay thụng và thứ tự lớp áo lót bên trong theo quy chế trang phục triều Nguyễn.",
      },
      {
        title: "Tư Vấn Tôn Dáng & Phong Cách Cặp Đôi",
        desc: "Phối hợp hài hòa giữa màu sắc áo cô dâu và áo chú rể, tạo nên tổng thể quyền quý, trang nghiêm và ăn ảnh nhất.",
      },
      {
        title: "Bảo Quản Hiện Vật Cổ Trang Cao Cấp",
        desc: "Quản lý tủ đồ may đo thủ công, ngăn chặn ẩm mốc, xước rách vải gấm và hao hụt phụ kiện ngọc bội quý hiếm.",
      },
      {
        title: "Hỗ Trợ Diễn Xuất Cổ Phong Tại Bối Cảnh",
        desc: "Hướng dẫn cô dâu thế đứng chắp tay đoan trang, cầm quạt e ấp, hướng dẫn chú rể dáng đứng phong nhã, khí chất vương triều.",
      },
    ],
  },
  {
    id: "role-photographer",
    code: "PHOTO-03",
    name: "Nhiếp Ảnh Gia Di Sản",
    badge: "Tác nghiệp hiện trường",
    icon: "camera",
    fullTitle: "Nhiếp Ảnh Gia Di Sản Cố Đô (Lead Heritage Photographer)",
    description:
      "Chỉ huy buổi bấm máy tại Đại Nội và các lăng tẩm Cố Đô. Chịu trách nhiệm về góc máy, ánh sáng di sản, cảm xúc nhân vật và sự an toàn tuyệt đối của toàn bộ dữ liệu ảnh gốc.",
    checklist: [
      {
        id: "c-pht-1",
        time: "06:00",
        task: "Kiểm tra pin máy ảnh, thẻ nhớ định dạng tốc độ cao và giấy phép tác nghiệp di tích Ngọ Môn.",
      },
      {
        id: "c-pht-2",
        time: "07:30",
        task: "Khởi động buổi chụp tại Điện Kiến Trung với các khung hình kiến trúc hoàng gia đối xứng.",
      },
      {
        id: "c-pht-3",
        time: "10:00",
        task: "Khai thác ánh sáng tự nhiên qua song cửa gỗ chạm trổ hoa văn cổ tại Cung Diên Thọ.",
      },
      {
        id: "c-pht-4",
        time: "14:30",
        task: "Chụp góc máy flycam và toàn cảnh tại Đồi Thông Thiên An hoặc Biệt Phủ Cổ.",
      },
      {
        id: "c-pht-5",
        time: "17:00",
        task: "Bắt trọn khoảnh khắc hoàng hôn sông Hương phản chiếu ánh vàng trên tà áo dài Cố Đô.",
      },
      {
        id: "c-pht-6",
        time: "18:30",
        task: "Double Backup toàn bộ file RAW vào 2 ổ cứng độc lập, kiểm tra độ nét và thông báo khách.",
      },
    ],
    keyDuties: [
      {
        title: "Làm Chủ Ánh Sáng Kiến Trúc Cung Đình",
        desc: "Khai thác tối đa ánh sáng tự nhiên chiếu rọi qua rèm sáo, mái ngói lưu ly và thềm đá cổ để tạo chất ảnh hoài niệm sâu lắng.",
      },
      {
        title: "Khơi Gợi Cảm Xúc Tự Nhiên Của Cặp Đôi",
        desc: "Tạo không khí vui vẻ, thoải mái để cô dâu chú rể trao nhau ánh mắt yêu thương tự nhiên nhất mà không bị cứng nhắc.",
      },
      {
        title: "Tuân Thủ An Toàn & Bảo Tồn Di Tích",
        desc: "Giám sát vị trí đặt chân đèn, máy móc cách xa các hiện vật lịch sử, không gây ồn ào ảnh hưởng không gian tôn nghiêm.",
      },
      {
        title: "Kiểm Soát Chất Lượng Ảnh Gốc File RAW",
        desc: "Đảm bảo độ phơi sáng chuẩn xác, dải màu rộng (Dynamic Range) tối ưu cho công đoạn Blend màu Cung đình ở khâu hậu kỳ.",
      },
    ],
  },
  {
    id: "role-customer",
    code: "GUEST-04",
    name: "Khách Hàng (Cô Dâu & Chú Rể)",
    badge: "Trải nghiệm & Ký kết",
    icon: "user",
    fullTitle: "Khách Hàng Hoàng Triều (Cô Dâu & Chú Rể)",
    description:
      "Tài khoản người dùng đặt dịch vụ cưới hỏi. Có đầy đủ quyền hạn xem chi tiết dịch vụ, tùy biến gói combo, tự tạo thiệp cưới online, tra cứu tiến độ tại 'Đơn Của Tôi' và xuất in hợp đồng A4 pháp lý.",
    checklist: [
      {
        id: "c-cus-1",
        time: "Bất kỳ",
        task: "Đăng nhập tài khoản để xem chi tiết các gói cưới hoàng triều và dùng thử AI Tư Vấn.",
      },
      {
        id: "c-cus-2",
        time: "Bất kỳ",
        task: "Chọn gói combo, tùy chọn bỏ bớt dịch vụ không cần để nhận mức giá đàm phán tối ưu.",
      },
      {
        id: "c-cus-3",
        time: "Bất kỳ",
        task: "Xác nhận đặt lịch trong Giỏ Hàng, quét mã VietQR đặt cọc 20% giữ ngày chụp Đại Nội.",
      },
      {
        id: "c-cus-4",
        time: "Bất kỳ",
        task: "Truy cập 'Đơn Của Tôi' để theo dõi trạng thái đơn hàng (Chờ duyệt -> Đã cọc -> Đã hoàn tất).",
      },
      {
        id: "c-cus-5",
        time: "Bất kỳ",
        task: "Bấm 'In Hợp Đồng A4' để xem hoặc in hợp đồng cam kết pháp lý trực tiếp tại nhà.",
      },
      {
        id: "c-cus-6",
        time: "Bất kỳ",
        task: "Tạo thiệp cưới điện tử cung đình, nhập STK nhận tiền mừng VietQR và gửi link cho bạn bè.",
      },
    ],
    keyDuties: [
      {
        title: "Cung Cấp Thông Tin Chính Xác Khi Đặt Lịch",
        desc: "Điền đúng số điện thoại Zalo, ngày cưới dự kiến và địa điểm mong muốn để ekip studio chủ động chuẩn bị giấy phép di sản.",
      },
      {
        title: "Tương Tác Chọn Ảnh Hậu Kỳ Kịp Thời",
        desc: "Lựa chọn 50 ảnh ưng ý trong vòng 7 ngày kể từ lúc nhận link ảnh gốc để bộ phận chế tác photobook kịp tiến độ hôn lễ.",
      },
      {
        title: "Bảo Quản Trang Phục Khi Tác Nghiệp",
        desc: "Giữ gìn áo Nhật Bình và hài thêu sạch sẽ trong quá trình di chuyển ngoại cảnh, không để trang phục vướng vào gai nhọn.",
      },
      {
        title: "Nghiệm Thu Sản Phẩm & Thanh Toán",
        desc: "Kiểm tra album sơn mài và file ảnh hậu kỳ trước khi thanh toán 80% giá trị hợp đồng còn lại cho studio.",
      },
    ],
  },
];

const SYSTEMS_DATA: SystemModule[] = [
  {
    id: "sys-services",
    name: "Phân Hệ Dịch Vụ Cổ Phục & Thợ Ảnh Lẻ",
    path: "/dich-vu",
    icon: "sparkles",
    tag: "Danh mục lẻ",
    description:
      "Quản lý toàn bộ danh mục dịch vụ đơn lẻ: Áo Nhật Bình thêu tay, Áo Tấc ngũ thân, Thuê thợ ảnh chuyên nghiệp theo giờ, Thuê bối cảnh di sản Đại Nội và Makeup layout cung đình.",
    inputs: [
      "Bộ lọc loại dịch vụ",
      "Thanh tìm kiếm Telex tiếng Việt",
      "Sắp xếp theo giá tăng/giảm",
    ],
    outputs: [
      "Danh sách thẻ dịch vụ kèm huy hiệu Top Đặt Nhiều",
      "Trang chi tiết dịch vụ & Đánh giá khách hàng",
    ],
    coreActions: [
      "Xem chi tiết thông số cổ phục, hình ảnh thực tế chất lượng cao.",
      "Thêm trực tiếp dịch vụ vào Giỏ hàng chụp ảnh cưới.",
      "Gửi bình luận, đánh giá trải nghiệm thực tế với số sao xếp hạng.",
    ],
  },
  {
    id: "sys-packages",
    name: "Phân Hệ Gói Cưới Combo Di Sản Hoàng Gia",
    path: "/goi-cuoi",
    icon: "package",
    tag: "Combo trọn gói",
    description:
      "Cung cấp các gói combo hoàn chỉnh (Khang Ninh, Hoàng Hậu Nam Phương, Dạ Nguyệt Cố Đô...) tích hợp đầy đủ trang phục, thợ ảnh, makeup và album sơn mài với mức giá ưu đãi lớn hơn chọn lẻ.",
    inputs: [
      "Bộ lọc phong cách (Cung Đình, Cổ Điển, Tân Thời)",
      "Tùy biến tích chọn bỏ bớt hạng mục",
    ],
    outputs: [
      "Bảng so sánh chi phí tiết kiệm",
      "Modal Nhận Báo Giá Nhanh & Đàm phán combo theo nhu cầu",
    ],
    coreActions: [
      "Xem nhanh danh sách các dịch vụ cấu thành gói ngay trên modal mà không rời trang.",
      "Tùy biến bỏ bớt hạng mục để hệ thống chuyển sang chế độ thương lượng giá.",
      "Nhận flash message cảm ơn 5 giây và gửi yêu cầu tư vấn tức thì.",
    ],
  },
  {
    id: "sys-invitations",
    name: "Phân Hệ Kho Thiệp Cưới Điện Tử & Dynamic VietQR",
    path: "/thiep-cuoi",
    icon: "mail",
    tag: "Thiệp cưới RSVP",
    description:
      "Kho 9 giao diện thiệp cưới điện tử chia theo 3 Hạng (VIP, PRO, BASIC) x 3 Phong cách (Cung Đình, Cổ Điển, Hiện Đại). Tự động sinh mã VietQR mừng cưới và đếm ngược ngày cưới.",
    inputs: [
      "Thứ bậc gia đình cô dâu chú rể",
      "STK ngân hàng nhận mừng",
      "Giờ hoàng đạo & Ngày âm lịch",
      "Bản đồ di tích",
    ],
    outputs: [
      "Trang thiệp cưới điện tử công nghệ cao",
      "Mã Dynamic VietQR NAPAS247",
      "Bảng thống kê phản hồi RSVP",
    ],
    coreActions: [
      "Khách mời nghe nhã nhạc cung đình Huế tự phát khi mở thiệp.",
      "Quét mã QR mừng cưới trực tiếp vào tài khoản ngân hàng của cô dâu chú rể.",
      "Khách mời gửi lời chúc và nhấn xác nhận số lượng người tham dự tiệc.",
    ],
  },
  {
    id: "sys-consult",
    name: "Phân Hệ AI Tư Vấn Ngân Sách Di Sản",
    path: "/tu-van",
    icon: "crown",
    tag: "Thuật toán tối ưu",
    description:
      "Hệ thống ứng dụng thuật toán Knapsack và phân tích ma trận tài chính giúp các cặp đôi tìm ra gói cưới tối ưu nhất dựa trên ngân sách hiện có, số lượng địa điểm và phong cách yêu thích.",
    inputs: [
      "Thanh trượt ngân sách cưới (10tr - 100tr)",
      "Lựa chọn phong cách hôn lễ",
      "Quy mô ngày chụp",
    ],
    outputs: [
      "Gói combo phù hợp nhất kèm phân tích số dư ngân sách",
      "Đề xuất các dịch vụ lẻ nên bổ sung",
    ],
    coreActions: [
      "Phân tích tài chính tức thì với thanh trượt ngân sách linh hoạt.",
      "Đưa ra giải pháp bù trừ thông minh nếu ngân sách thiếu hoặc thừa.",
      "Chuyển thẳng kết quả tư vấn sang đơn đặt lịch trong 1 chạm.",
    ],
  },
  {
    id: "sys-cart",
    name: "Phân Hệ Giỏ Dịch Vụ & Đặt Lịch Chụp Ảnh",
    path: "/gio-hang",
    icon: "cart",
    tag: "Giỏ hàng & Cọc",
    description:
      "Quản lý các hạng mục dịch vụ và gói cưới khách hàng đã chọn. Tích hợp thanh toán cọc 20% qua VietQR tự động và modal xác nhận đặt lịch chống nhầm lẫn.",
    inputs: [
      "Họ tên, SĐT Zalo, ngày cưới dự kiến",
      "Địa điểm di sản mong muốn",
      "Tùy chọn cọc trước 20%",
    ],
    outputs: [
      "Đơn đặt lịch chụp ảnh chính thức",
      "Flash message thông báo trạng thái 5 giây",
    ],
    coreActions: [
      "Tăng giảm số lượng hoặc xóa từng dịch vụ kèm thông báo tên món đã xóa.",
      "Bước xác nhận kiểm tra lại thông tin trước khi gửi đơn chính thức.",
      "Lưu trữ dữ liệu an toàn vào Supabase PostgreSQL.",
    ],
  },
  {
    id: "sys-my-orders",
    name: "Phân Hệ Quản Lý Đơn Của Tôi & In Hợp Đồng A4",
    path: "/don-cua-toi",
    icon: "clipboardList",
    tag: "Đơn hàng & Hợp đồng",
    description:
      "Nơi khách hàng và admin tra cứu tiến độ đơn chụp ảnh di sản, bổ sung yêu cầu chụp, hủy đơn hoàn cọc và xuất in Hợp Đồng A4 Pháp Lý.",
    inputs: ["Mã đơn chụp ảnh", "Nội dung mong muốn bổ sung"],
    outputs: [
      "Hồ sơ đơn chi tiết với huy hiệu trạng thái sắc nét",
      "Bản in Hợp Đồng A4 chuẩn pháp lý (window.print)",
    ],
    coreActions: [
      "Theo dõi trạng thái: Chờ duyệt, Đã liên hệ, Đã cọc 20%, Đã hoàn tất.",
      "Hủy đơn có xác nhận lý do và bảo lưu chính sách cọc minh bạch.",
      "Bấm 'In Hợp Đồng A4' để in hoặc xuất file PDF hợp đồng có giá trị pháp lý.",
    ],
  },
  {
    id: "sys-admin",
    name: "Phân Hệ Quản Trị Hệ Thống Admin & Kanban",
    path: "/admin",
    icon: "kanban",
    tag: "Quản trị tối cao",
    description:
      "Bảng điều hành dành riêng cho vai trò Admin: Dashboard KPI doanh thu, biểu đồ SVG Bar & Donut, Quản lý CRUD Dịch Vụ, Gói Cưới, Bảng Kanban Đơn Yêu Cầu và Quản Lý Tài Khoản.",
    inputs: [
      "Thao tác CRUD sản phẩm",
      "Kéo thả Kanban",
      "Phân quyền vai trò tài khoản",
    ],
    outputs: [
      "Biểu đồ trực quan hóa dữ liệu",
      "Bảng thống kê tỷ lệ chốt đơn và doanh thu thời gian thực",
    ],
    coreActions: [
      "Kéo thả thẻ đơn qua các trạng thái tiến độ chụp ảnh trên Kanban.",
      "Phê duyệt hợp đồng pháp lý và kiểm soát tài chính.",
      "Quản lý người dùng, ngăn chặn truy cập trái phép với 2-Tier RBAC.",
    ],
  },
];

const RULES_DATA: BusinessRule[] = [
  {
    id: "rule-01",
    code: "RULE-DS-01",
    category: "Bảo tồn Di sản",
    title: "Tuyệt đối không xâm hại hiện vật tại Di tích Đại Nội & Lăng tẩm",
    rule: "Ekip và cô dâu chú rể nghiêm cấm ngồi lên ngai vàng, tựa người vào rèm sáo cổ, dẫm lên thềm đá chạm rồng thời Nguyễn hoặc chạm tay trần vào các bức tranh tường sơn mài nguyên bản.",
    penalty:
      "Đình chỉ buổi chụp ngay lập tức và chịu phạt theo quy định của Trung tâm Bảo tồn Di tích Cố đô Huế.",
  },
  {
    id: "rule-02",
    code: "RULE-DS-02",
    category: "Bảo tồn Di sản",
    title: "Quy chuẩn trang phục Cổ Phong trang nghiêm",
    rule: "Trang phục Áo Nhật Bình và Áo Tấc bắt buộc phải cài đủ cúc kim loại, mặc quần lụa trắng hoặc lụa vàng bên trong; không được phép mặc váy ngắn hoặc trang phục phản cảm dưới lớp áo thụng.",
    penalty:
      "Stylist có trách nhiệm từ chối tiến hành buổi chụp nếu khách hàng không tuân thủ quy chuẩn.",
  },
  {
    id: "rule-03",
    code: "RULE-TC-03",
    category: "Tài chính & Cọc",
    title: "Chính sách Đặt cọc 20% giữ ngày chụp di sản",
    rule: "Mọi đơn đặt lịch chỉ có hiệu lực chính thức và được khóa ngày chụp trên hệ thống sau khi khách hàng hoàn tất thanh toán cọc 20% tổng giá trị gói dịch vụ qua mã Dynamic VietQR.",
    penalty:
      "Nếu quá 24h kể từ lúc tư vấn không phát sinh giao dịch cọc, hệ thống tự động giải phóng ngày chụp cho khách hàng khác.",
  },
  {
    id: "rule-04",
    code: "RULE-TC-04",
    category: "Tài chính & Cọc",
    title: "Chính sách Hoàn cọc & Bảo lưu lịch do thời tiết bất khả kháng",
    rule: "Nếu ngày chụp trùng với mưa bão ngập lụt tại Huế hoặc di tích đóng cửa đột xuất, khách hàng được bảo lưu 100% tiền cọc trong vòng 06 tháng hoặc đổi sang ngày chụp mới miễn phí.",
    penalty:
      "Nếu khách hủy đơn đơn phương trước ngày chụp dưới 03 ngày không vì lý do bất khả kháng, tiền cọc sẽ không được hoàn lại.",
  },
  {
    id: "rule-05",
    code: "RULE-BM-05",
    category: "Bảo mật & Bản quyền",
    title: "Cam kết bảo mật thông tin ngày cưới và tài khoản mừng cưới",
    rule: "Toàn bộ thông tin cá nhân, số điện thoại Zalo, tài khoản ngân hàng tích hợp trong thiệp cưới được bảo vệ nghiêm ngặt bằng cơ chế Row Level Security (RLS) của Supabase, không chia sẻ cho bên thứ ba.",
    penalty:
      "Vi phạm bảo mật sẽ bị xử lý trách nhiệm theo điều khoản cam kết trong Hợp Đồng A4.",
  },
  {
    id: "rule-06",
    code: "RULE-BM-06",
    category: "Bảo mật & Bản quyền",
    title: "Bản quyền công bố hình ảnh trên các kênh truyền thông",
    rule: "Studio Huế Cung Đình chỉ được phép đăng tải hình ảnh buổi chụp lên Website/Fanpage làm Portfolio sau khi có sự đồng thuận bằng văn bản hoặc tin nhắn xác nhận của cô dâu chú rể.",
    penalty:
      "Studio gỡ bỏ toàn bộ hình ảnh trong vòng 02 giờ nếu khách hàng có yêu cầu thu hồi quyền quảng bá.",
  },
  {
    id: "rule-07",
    code: "RULE-PQ-07",
    category: "Phân quyền Hệ thống",
    title: "Chế độ Khách vãng lai chỉ xem danh mục sản phẩm",
    rule: "Người dùng chưa đăng nhập tài khoản CHỈ ĐƯỢC XEM danh mục sản phẩm, bảng giá và công cụ tìm kiếm lọc. Mọi hành động xem chi tiết, thêm giỏ, đặt cọc và tra cứu đơn bắt buộc phải đăng nhập.",
    penalty:
      "Hệ thống tự động kích hoạt ProtectedRoute điều hướng an toàn về trang Đăng Nhập.",
  },
  {
    id: "rule-08",
    code: "RULE-PQ-08",
    category: "Phân quyền Hệ thống",
    title: "Thẩm quyền điều chỉnh Bảng Giá và Hợp Đồng thuộc về Admin",
    rule: "Chỉ tài khoản mang vai trò 'admin' mới có quyền chỉnh sửa giá niêm yết của dịch vụ/gói cưới, tạo mới tài khoản nhân viên và kéo thả trạng thái hoàn tất đơn trên Bảng Kanban.",
    penalty:
      "Các thao tác can thiệp trái phép vào API backend sẽ bị hệ thống chặn tự động và ghi nhật ký vi phạm.",
  },
];

/* ==========================================================================
   3. PROCESS GUIDE PAGE COMPONENT CHÍNH
   ========================================================================== */
export function ProcessGuidePage() {
  const [activeTab, setActiveTab] = useState<MainTab>("roles");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("role-owner");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [completedChecklist, setCompletedChecklist] = useState<
    Record<string, boolean>
  >({});

  // Xử lý toggle checkbox hoàn thành đầu việc
  const toggleChecklist = (id: string) => {
    setCompletedChecklist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const kw = searchKeyword.toLowerCase().trim();

  const filteredSOP = useMemo(() => {
    if (!kw) return SOP_DATA;
    return SOP_DATA.filter(
      (item) =>
        item.title.toLowerCase().includes(kw) ||
        item.code.toLowerCase().includes(kw) ||
        item.description.toLowerCase().includes(kw) ||
        item.role.toLowerCase().includes(kw) ||
        item.category.toLowerCase().includes(kw),
    );
  }, [kw]);

  const filteredRoles = useMemo(() => {
    if (!kw) return ROLES_DATA;
    return ROLES_DATA.filter(
      (role) =>
        role.name.toLowerCase().includes(kw) ||
        role.fullTitle.toLowerCase().includes(kw) ||
        role.description.toLowerCase().includes(kw) ||
        role.checklist.some((c) => c.task.toLowerCase().includes(kw)),
    );
  }, [kw]);

  const filteredSystems = useMemo(() => {
    if (!kw) return SYSTEMS_DATA;
    return SYSTEMS_DATA.filter(
      (sys) =>
        sys.name.toLowerCase().includes(kw) ||
        sys.description.toLowerCase().includes(kw) ||
        sys.tag.toLowerCase().includes(kw),
    );
  }, [kw]);

  const filteredRules = useMemo(() => {
    if (!kw) return RULES_DATA;
    return RULES_DATA.filter(
      (rule) =>
        rule.title.toLowerCase().includes(kw) ||
        rule.rule.toLowerCase().includes(kw) ||
        rule.code.toLowerCase().includes(kw) ||
        rule.category.toLowerCase().includes(kw),
    );
  }, [kw]);

  const currentRole =
    ROLES_DATA.find((r) => r.id === selectedRoleId) || ROLES_DATA[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="process-guide-root">
      {/* 1. HERO BANNER HOÀNG GIA ĐẲNG CẤP */}
      <section
        className="process-hero-banner"
        aria-label="Cẩm nang SOP Huế Cung Đình"
      >
        <div className="container hero-container-inner">
          <div className="hero-content-left">
            <div className="hero-crest-badge">
              <Icon name="crown" size={16} color="var(--secondary)" />
              <span>Cẩm Nang Vận Hành & Bản Vẽ Quy Trình (SOP)</span>
            </div>
            <h1 className="hero-title">
              Hướng Dẫn Sử Dụng & Quy Trình Nghiệp Vụ Hoàng Triều
            </h1>
            <p className="hero-subtitle">
              Tài liệu tác nghiệp chuẩn hóa cho từng chức danh (Khách Hàng,
              Stylist Cổ Phục, Nhiếp Ảnh Gia, Quản Trị Studio): quy trình từng
              bước, hướng dẫn 7 phân hệ và 18 quy tắc tác nghiệp di sản Đại Nội
              Cố Đô Huế. Dữ liệu đối chiếu chuẩn xác với quyền thực tế của hệ
              thống.
            </p>

            {/* KPI STATS BAR (Y HỆT ẢNH THẦY) */}
            <div className="hero-stats-row">
              <div className="stat-pill-item">
                <Icon name="clipboardList" size={16} color="var(--secondary)" />
                <span>
                  <strong>6</strong> quy trình tiêu chuẩn (SOP)
                </span>
              </div>
              <div className="stat-pill-item">
                <Icon name="user" size={16} color="var(--secondary)" />
                <span>
                  <strong>4</strong> vai trò nhân sự & khách
                </span>
              </div>
              <div className="stat-pill-item">
                <Icon name="layers" size={16} color="var(--secondary)" />
                <span>
                  <strong>7</strong> phân hệ nghiệp vụ
                </span>
              </div>
              <div className="stat-pill-item">
                <Icon name="shield" size={16} color="var(--secondary)" />
                <span>
                  <strong>18</strong> quy tắc tác nghiệp di sản
                </span>
              </div>
            </div>
          </div>

          <div className="hero-action-right">
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrint}
              leftIcon={<Icon name="printer" size={18} />}
              className="btn-print-sop"
              title="In cẩm nang hoặc xuất file PDF chuẩn khổ A4"
            >
              In Tài Liệu (A4)
            </Button>
          </div>
        </div>
      </section>

      {/* 2. KHU VỰC TÌM KIẾM & BỘ LỌC TỨC THỜI */}
      <section className="process-search-bar-section">
        <div className="container">
          <div className="search-bar-inner">
            <div className="search-input-wrap">
              <Icon
                name="search"
                size={20}
                color="var(--text-muted)"
                className="search-icon-inside"
              />
              <input
                type="text"
                className="search-sop-input"
                placeholder="Tìm quy trình, thao tác, quy tắc (cọc 20%, thử Nhật Bình, Đại Nội, hủy đơn, in hợp đồng, export VietQR, Kanban...)"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                aria-label="Tìm kiếm quy trình nghiệp vụ"
              />
              {searchKeyword && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchKeyword("")}
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
          </div>

          {/* 3. BỐN TAB ĐIỀU HƯỚNG CHÍNH (GIỐNG HỆT ẢNH THẦY) */}
          <div className="process-main-tabs-row" role="tablist">
            <button
              type="button"
              className={`main-tab-btn ${activeTab === "sop" ? "active" : ""}`}
              onClick={() => setActiveTab("sop")}
              role="tab"
              aria-selected={activeTab === "sop"}
            >
              <Icon name="clipboardList" size={18} />
              <span>Quy trình (SOP)</span>
            </button>

            <button
              type="button"
              className={`main-tab-btn ${activeTab === "roles" ? "active" : ""}`}
              onClick={() => setActiveTab("roles")}
              role="tab"
              aria-selected={activeTab === "roles"}
            >
              <Icon name="user" size={18} />
              <span>Theo vai trò nhân sự</span>
            </button>

            <button
              type="button"
              className={`main-tab-btn ${activeTab === "systems" ? "active" : ""}`}
              onClick={() => setActiveTab("systems")}
              role="tab"
              aria-selected={activeTab === "systems"}
            >
              <Icon name="layers" size={18} />
              <span>Theo phân hệ</span>
            </button>

            <button
              type="button"
              className={`main-tab-btn ${activeTab === "rules" ? "active" : ""}`}
              onClick={() => setActiveTab("rules")}
              role="tab"
              aria-selected={activeTab === "rules"}
            >
              <Icon name="shield" size={18} />
              <span>Quy tắc nghiệp vụ</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. NỘI DUNG TỪNG PHÂN HỆ TAB */}
      <main className="container process-content-main">
        {/* ====================================================================
            TAB 1: QUY TRÌNH TIÊU CHUẨN (SOP)
            ==================================================================== */}
        {activeTab === "sop" && (
          <div className="tab-pane-content pane-sop-list">
            <div className="pane-header-intro">
              <span className="pane-tag">QUY TRÌNH VẬN HÀNH CHUẨN</span>
              <h2 className="pane-title">
                Sơ Đồ 6 Quy Trình Tác Nghiệp Hoàng Triều
              </h2>
              <p className="pane-desc">
                Quy trình khép kín từ tiếp nhận nhu cầu, thử trang phục may đo,
                tác nghiệp Đại Nội Cố Đô đến đóng gói album sơn mài và xuất hóa
                đơn hợp đồng pháp lý.
              </p>
            </div>

            <div className="sop-cards-grid">
              {filteredSOP.map((sop) => (
                <article key={sop.id} className="sop-card-item">
                  <div className="sop-card-header">
                    <div className="sop-code-badge">{sop.code}</div>
                    <span className="sop-category-tag">{sop.category}</span>
                  </div>

                  <h3 className="sop-card-title">{sop.title}</h3>
                  <p className="sop-card-desc">{sop.description}</p>

                  <div className="sop-meta-row">
                    <span className="meta-pill">
                      <Icon name="user" size={14} /> {sop.role}
                    </span>
                    <span className="meta-pill">
                      <Icon name="clock" size={14} /> {sop.duration}
                    </span>
                  </div>

                  {/* CÁC BƯỚC TỪNG BƯỚC */}
                  <div className="sop-steps-wrapper">
                    <h4 className="steps-heading">Các bước thực hiện chuẩn:</h4>
                    <div className="steps-timeline">
                      {sop.steps.map((st) => (
                        <div key={st.stepNumber} className="step-timeline-node">
                          <div className="step-number-circle">
                            {st.stepNumber}
                          </div>
                          <div className="step-node-body">
                            <strong className="step-title">{st.title}</strong>
                            <p className="step-detail">{st.detail}</p>
                            {st.target && (
                              <div className="step-target-box">
                                <Icon
                                  name="check"
                                  size={12}
                                  color="var(--success)"
                                />
                                <span>
                                  <strong>Mục tiêu bước:</strong> {st.target}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TIÊU CHUẨN CHẤT LƯỢNG */}
                  <div className="sop-standards-box">
                    <div className="standards-title">
                      <Icon name="shield" size={14} color="var(--secondary)" />
                      <span>Tiêu chuẩn nghiệm thu chất lượng:</span>
                    </div>
                    <ul className="standards-list">
                      {sop.standards.map((std, idx) => (
                        <li key={idx}>{std}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 2: THEO VAI TRÒ NHÂN SỰ (Y HỆT GIAO DIỆN ẢNH THẦY)
            ==================================================================== */}
        {activeTab === "roles" && (
          <div className="tab-pane-content pane-roles-layout">
            {/* HÀNG ROLE SELECTOR CARDS */}
            <div className="role-selector-cards-row">
              {filteredRoles.map((r) => {
                const isSelected = r.id === selectedRoleId;
                return (
                  <button
                    key={r.id}
                    type="button"
                    className={`role-select-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedRoleId(r.id)}
                  >
                    <div className="role-card-top-icon">
                      <Icon
                        name={r.icon}
                        size={24}
                        color={
                          isSelected ? "var(--primary)" : "var(--text-muted)"
                        }
                      />
                      {isSelected && (
                        <span className="role-check-mark">
                          <Icon name="check" size={14} />
                        </span>
                      )}
                    </div>
                    <strong className="role-card-name">{r.name}</strong>
                    <span className="role-card-badge">{r.badge}</span>
                  </button>
                );
              })}
            </div>

            {/* KHỐI NỘI DUNG CHI TIẾT CỦA VAI TRÒ ĐANG CHỌN */}
            {currentRole && (
              <div className="role-detail-panel">
                <div className="role-panel-header">
                  <span className="role-permission-tag">
                    {currentRole.badge}
                  </span>
                  <h3 className="role-panel-title">{currentRole.fullTitle}</h3>
                  <p className="role-panel-desc">{currentRole.description}</p>
                </div>

                <div className="role-sections-grid">
                  {/* CỘT A: LỊCH TRÌNH TÁC NGHIỆP TRONG NGÀY (CHECKLIST CÓ TƯƠNG TÁC) */}
                  <div className="role-section-box checklist-box">
                    <div className="role-box-header">
                      <div className="box-header-title">
                        <Icon
                          name="clipboardList"
                          size={18}
                          color="var(--primary)"
                        />
                        <h4>LỊCH TRÌNH TÁC NGHIỆP TRONG NGÀY (CHECKLIST)</h4>
                      </div>
                      <span className="box-header-hint">
                        Bấm để đánh dấu hoàn thành
                      </span>
                    </div>

                    <div className="checklist-items-scroll">
                      {currentRole.checklist.map((item) => {
                        const isDone = !!completedChecklist[item.id];
                        return (
                          <div
                            key={item.id}
                            className={`checklist-row-item ${isDone ? "is-completed" : ""}`}
                            onClick={() => toggleChecklist(item.id)}
                            role="checkbox"
                            aria-checked={isDone}
                            tabIndex={0}
                          >
                            <div className="check-box-visual">
                              {isDone ? (
                                <Icon name="check" size={14} color="#FFFFFF" />
                              ) : (
                                <span className="check-box-dot" />
                              )}
                            </div>
                            <span className="checklist-time-tag">
                              {item.time}
                            </span>
                            <span className="checklist-task-text">
                              {item.task}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CỘT B: NHIỆM VỤ & TRÁCH NHIỆM CHỦ CHỐT */}
                  <div className="role-section-box duties-box">
                    <div className="role-box-header">
                      <div className="box-header-title">
                        <Icon name="shield" size={18} color="var(--primary)" />
                        <h4>NHIỆM VỤ & TRÁCH NHIỆM CHỦ CHỐT</h4>
                      </div>
                    </div>

                    <div className="duties-cards-stack">
                      {currentRole.keyDuties.map((d, index) => (
                        <div key={index} className="duty-card-item">
                          <div className="duty-card-icon-num">{index + 1}</div>
                          <div className="duty-card-body">
                            <strong className="duty-card-title">
                              {d.title}
                            </strong>
                            <p className="duty-card-desc">{d.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            TAB 3: THEO PHÂN HỆ HỆ THỐNG
            ==================================================================== */}
        {activeTab === "systems" && (
          <div className="tab-pane-content pane-systems-list">
            <div className="pane-header-intro">
              <span className="pane-tag">CẤU TRÚC PHẦN MỀM</span>
              <h2 className="pane-title">
                7 Phân Hệ Nghiệp Vụ Cưới & Chụp Ảnh Hoàng Triều
              </h2>
              <p className="pane-desc">
                Kiến trúc module hóa Feature-Based kết nối đồng bộ giữa giao
                diện Web Client (React Router v8) và cơ sở dữ liệu Supabase
                Cloud.
              </p>
            </div>

            <div className="systems-grid-layout">
              {filteredSystems.map((sys) => (
                <div key={sys.id} className="system-module-card">
                  <div className="module-top-row">
                    <div className="module-icon-wrap">
                      <Icon name={sys.icon} size={22} color="var(--primary)" />
                    </div>
                    <span className="module-tag">{sys.tag}</span>
                  </div>

                  <h3 className="module-name">{sys.name}</h3>
                  <p className="module-desc">{sys.description}</p>

                  <div className="module-specs-box">
                    <div className="spec-col">
                      <span className="spec-label">Dữ liệu đầu vào:</span>
                      <ul className="spec-list">
                        {sys.inputs.map((inp, idx) => (
                          <li key={idx}>{inp}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="spec-col">
                      <span className="spec-label">Kết quả đầu ra:</span>
                      <ul className="spec-list">
                        {sys.outputs.map((out, idx) => (
                          <li key={idx}>{out}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="module-card-footer">
                    <Link to={sys.path} className="btn-visit-module">
                      <span>
                        Truy cập phân hệ: <code>{sys.path}</code>
                      </span>
                      <Icon name="arrowRight" size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 4: QUY TẮC NGHIỆP VỤ & BẢO TỒN DI SẢN
            ==================================================================== */}
        {activeTab === "rules" && (
          <div className="tab-pane-content pane-rules-list">
            <div className="pane-header-intro">
              <span className="pane-tag">ĐIỀU LỆ & KỶ CƯƠNG HOÀNG GIA</span>
              <h2 className="pane-title">
                18 Quy Tắc Nghiệp Vụ & Bảo Tồn Di Sản Cố Đô
              </h2>
              <p className="pane-desc">
                Quy định pháp lý bắt buộc áp dụng cho toàn thể nhân sự studio và
                khách hàng tham gia tác nghiệp tại di tích Đại Nội Huế.
              </p>
            </div>

            <div className="rules-cards-grid">
              {filteredRules.map((r) => (
                <div key={r.id} className="rule-card-item">
                  <div className="rule-card-header">
                    <span className="rule-code-badge">{r.code}</span>
                    <span
                      className={`rule-category-pill cat-${r.category.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`}
                    >
                      {r.category}
                    </span>
                  </div>

                  <h3 className="rule-title">{r.title}</h3>
                  <p className="rule-content">{r.rule}</p>

                  <div className="rule-penalty-box">
                    <Icon name="alert" size={16} color="var(--danger)" />
                    <span>
                      <strong>Chế tài thực hiện:</strong> {r.penalty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 5. KHU VỰC IN BẢN CỨNG A4 CHUẨN MỰC (ẨN TRÊN MÀN HÌNH, CHỈ HIỆN KHI IN) */}
      <section className="print-sop-document" aria-hidden="true">
        <div className="print-sop-header">
          <div className="print-crest-title">
            STUDIO HUẾ CUNG ĐÌNH • TỔNG QUY CHẾ VẬN HÀNH
          </div>
          <h1 className="print-main-title">
            CẨM NANG QUY TRÌNH TÁC NGHIỆP DI SẢN HOÀNG TRIỀU
          </h1>
          <p className="print-doc-meta">
            Học phần: Web FrontEnd Nâng Cao (INT.7.18) • SV: Trần Công Quý
            (MSSV: 2401ITA001) • GVHD: Thầy Dương Ngọc Duy
          </p>
        </div>

        <div className="print-body-content">
          <h3>I. DANH SÁCH QUY TRÌNH TIÊU CHUẨN (SOP)</h3>
          {SOP_DATA.map((sop) => (
            <div key={sop.id} className="print-sop-item">
              <h4>
                {sop.code} - {sop.title} ({sop.role})
              </h4>
              <p>{sop.description}</p>
              <ol>
                {sop.steps.map((st) => (
                  <li key={st.stepNumber}>
                    <strong>{st.title}:</strong> {st.detail}
                  </li>
                ))}
              </ol>
            </div>
          ))}

          <h3>II. CAM KẾT BẢO TỒN DI SẢN CỐ ĐÔ HUẾ</h3>
          <p>
            Mọi hoạt động quay phim, chụp ảnh cưới tại Quần thể Di tích Cố đô
            Huế tuân thủ nghiêm ngặt Luật Di sản Văn hóa Việt Nam và Công ước
            Bảo tồn Di sản Thế giới UNESCO.
          </p>

          <div className="print-signature-row">
            <div className="sig-col">
              <strong>ĐẠI DIỆN HỘI ĐỒNG CHUYÊN MÔN</strong>
              <div className="sig-space" />
              <span>Thầy Dương Ngọc Duy (GVHD)</span>
            </div>
            <div className="sig-col">
              <strong>SINH VIÊN THỰC HIỆN ĐỀ TÀI</strong>
              <div className="sig-space" />
              <span>Trần Công Quý (MSSV: 2401ITA001)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
