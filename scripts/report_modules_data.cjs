/**
 * scripts/report_modules_data.cjs
 * Dữ liệu đặc tả chi tiết 14 phân hệ chức năng (Chương 5) theo đúng mẫu 5 phần:
 * (a) Mục đích, (b) Luồng sử dụng, (c) Cách hệ thống xử lý bên trong,
 * (d) Số liệu thật đã kiểm chứng, (e) File nguồn tương ứng.
 * Mỗi phân hệ đạt độ dài 320–450 từ, không dùng tính từ quảng cáo, đối soát trực tiếp từ mã nguồn.
 */

const CHAPTER_5_MODULES = [
  {
    heading: '5.1. Phân hệ 1: Trang Chủ, Không Gian Tương Tác Hoàng Triều & Tìm Kiếm Nhanh Ctrl + K',
    a:
      'Đóng vai trò là cổng thông tin trung tâm đón tiếp người dùng khi truy cập ứng dụng đơn trang (Single Page Application – SPA), giới thiệu bản sắc văn hóa cổ phục triều Nguyễn và cung cấp lối tắt điều hướng trực tiếp tới các công cụ tương tác số hóa cũng như hộp tìm kiếm toàn cục.',
    b:
      'Người dùng mở đường dẫn gốc (/), quan sát thanh tiến độ đọc trang mạ vàng chạy dọc mép trên trình duyệt khi cuộn trang. Tại vùng biểu ngữ đầu trang (Hero Banner), khẩu hiệu tiêu đề tự động luân chuyển qua 3 thông điệp văn hóa sau mỗi 3,2 giây, đồng thời khung mô phỏng máy tính và điện thoại chuyển đổi ảnh sau mỗi 4,2 giây. Người dùng bấm nút chính "Đặt lịch" để đi tới trang /dat-lich (nếu chưa đăng nhập sẽ được dẫn qua /login), hoặc bấm nút phụ "Khám Phá Gói Cưới" để xem danh sách /goi-cuoi. Cuộn xuống khu vực "Không Gian Tương Tác Hoàng Triều", người dùng chọn 1 trong 4 thẻ tính năng mới gồm Bản Đồ Di Sản (/ban-do-di-san), Phòng Phối Cổ Phục 2D (/phoi-co-phuc), Triển Lãm Hậu Kỳ (/trien-lam) và Sổ Tay Kế Hoạch Cưới (/ke-hoach-cuoi). Ngoài ra, ở bất kỳ vị trí nào trên trang, người dùng có thể nhấn tổ hợp phím Ctrl + K (hoặc bấm kính lúp trên Header) để mở hộp tìm kiếm nhanh, gõ từ khóa tên gói cưới, dịch vụ, thiệp hoặc địa danh và nhấn phím Enter để nhảy thẳng tới trang đích.',
    c:
      'Thành phần RootLayout (src/app/RootLayout.tsx) gắn cố định ScrollProgressBar (lắng nghe sự kiện cuộn chuột với cờ passive: true để tính tỷ lệ phần trăm chiều cao tài liệu) và RoyalCommandPalette. Hộp tìm kiếm nhanh đọc trạng thái isCommandPaletteOpen từ store toàn cục useWishlistStore (Zustand), đồng thời nạp bất đồng bộ danh sách gói cưới, dịch vụ lẻ và mẫu thiệp thông qua lớp trung gian dữ liệu SupabaseService để hợp nhất với danh sách lối tắt tĩnh, sau đó lọc từ khóa qua useMemo và xử lý điều hướng bàn phím (ArrowUp, ArrowDown, Enter, Escape). Tại HomePage, các dải phân cách họa tiết cung đình (RoyalDivider) chia tách vùng giới thiệu văn hóa, băng chuyền gói cưới (FeaturedPackagesMarquee) nạp dữ liệu qua useFetch("/api/goi-cuoi", goiCuoiListSchema) và vùng cảm nhận khách hàng (CustomerTestimonialsSection).',
    d:
      'Vùng đầu trang xoay vòng 3 khẩu hiệu (chu kỳ 3.200 ms) và 3 cặp ảnh mô phỏng thiết bị (chu kỳ 4.200 ms); khu vực trung tâm hiển thị 4 thẻ không gian tương tác; hộp tìm kiếm Ctrl + K phân nhóm 5 loại kết quả và giới hạn hiển thị tối đa 18 mục khớp nhất mỗi lần gõ; băng chuyền hiển thị 9 gói cưới combo và mục đánh giá hiển thị 3 phản hồi mẫu.',
    e:
      'src/pages/HomePage.tsx, src/pages/HomePage.css, src/features/home/components/HeroSection.tsx, FeaturedPackagesMarquee.tsx, CustomerTestimonialsSection.tsx, src/components/common/RoyalCommandPalette.tsx, ScrollProgressBar.tsx, RoyalDivider.tsx.',
  },
  {
    heading: '5.2. Phân hệ 2: Danh Mục & Chi Tiết Dịch Vụ Cưới Lẻ (Services)',
    a:
      'Phục vụ các cặp đôi có nhu cầu tìm hiểu, lọc theo ngân sách và chọn thuê riêng lẻ từng hạng mục phục vụ lễ cưới cổ truyền như lễ phục Nhật Bình, Áo Tấc, ekip nhiếp ảnh gia di sản, giấy phép địa điểm quay chụp hoặc trang trí lễ gia tiên.',
    b:
      'Khách hàng truy cập đường dẫn /dich-vu, gõ từ khóa tiếng Việt có dấu vào ô tìm kiếm, chọn nhóm danh mục (Tất Cả, Áo Dài, Thợ Ảnh, Địa Điểm, Trang Trí, Top Dịch Vụ) và chọn thứ tự sắp xếp giá (Giá tăng dần, Giá giảm dần, Tên A–Z). Trên mỗi thẻ dịch vụ, khách có thể bấm biểu tượng trái tim để lưu vào danh sách yêu thích mà không cần rời trang. Khi khách bấm "Chi tiết" hoặc "Thêm giỏ", nếu chưa xác thực tài khoản thì hệ thống hiển thị thông báo hướng dẫn và chuyển hướng về /login; nếu đã đăng nhập, khách được dẫn vào /dich-vu/:id. Tại trang chi tiết, khách xem ảnh độ phân giải lớn, điều chỉnh số lượng bằng bộ tăng giảm (Stepper), bấm thêm vào giỏ cưới, gửi nhận xét đánh giá kèm số sao (từ 1 đến 5 sao) và tham khảo 3 dịch vụ gợi ý cùng nhóm phân loại bên dưới.',
    c:
      'Trang ServicesPage đồng bộ bộ lọc với tham số truy vấn URL (useSearchParams cho loai và sort) và kiểm thực giá trị qua Zod schema nhằm phòng tránh tham số sai định dạng. Ô tìm kiếm sử dụng state cục bộ kết hợp bộ trễ (debounce) để giữ nguyên dấu thanh khi gõ bộ gõ tiếng Việt Telex/VNI, sau đó lọc và sắp xếp mảng dữ liệu bằng useMemo. Tại ServiceDetailPage, mã định danh :id được đối chiếu qua useFetch; mảng dịch vụ liên quan ưu tiên lọc các phần tử có cùng trường s.loai === service.loai (nếu nhóm đó có ít hơn 3 bản ghi khác nhau mới lấy bù từ nhóm khác để đủ 3 thẻ). Các đánh giá mới do người dùng gửi được kiểm tra độ dài chuỗi và ghi bền vững vào bộ nhớ trình duyệt localStorage theo khóa riêng của từng mã dịch vụ.',
    d:
      'Cơ sở dữ liệu khởi tạo gồm đúng 18 dịch vụ cưới lẻ chia thành 4 phân loại trong loaiDichVuEnum: 5 dịch vụ áo dài & trang điểm (ao-dai), 4 dịch vụ nhiếp ảnh & quay phim (tho-anh), 4 địa điểm di sản (dia-diem) và 5 hạng mục trang trí & nghi lễ (trang-tri). Đơn giá niêm yết nằm trong khoảng từ 2.500.000 đ (dv-11) đến 9.000.000 đ (dv-05). Khu vực gợi ý cuối trang hiển thị tối đa 3 dịch vụ cùng phân loại.',
    e:
      'src/pages/ServicesPage.tsx, src/pages/ServiceDetailPage.tsx, src/features/services/types.ts, src/features/services/components/ServiceCard.tsx.',
  },
  {
    heading: '5.3. Phân hệ 3: Gói Cưới Combo, Danh Sách Yêu Thích & So Sánh Tối Đa 3 Gói',
    a:
      'Giúp các cặp đôi lựa chọn phương án trọn gói tiết kiệm chi phí so với thuê lẻ, đồng thời cung cấp công cụ đặt nhiều gói cưới cạnh nhau trên cùng một bảng đối chiếu để so sánh minh bạch từng dịch vụ thành phần trước khi đàm phán hoặc đặt lịch.',
    b:
      'Khách hàng mở trang /goi-cuoi, lọc gói theo 3 phong cách (Cung Đình, Cổ Điển, Hiện Đại). Trên góc trên mỗi thẻ gói cưới có hai nút tròn: nút trái tim để lưu vào ngăn Yêu Thích (mở xem lại từ biểu tượng trái tim trên Header) và nút hai mũi tên ngược chiều để đưa gói vào khay So Sánh. Khi chọn từ 1 đến 3 gói, một thanh điều khiển nổi xuất hiện ở cạnh dưới màn hình hiển thị ảnh thu nhỏ của các gói đang chọn; bấm "So Sánh Chi Tiết" sẽ mở cửa sổ đối chiếu dạng cột ngang chỉ rõ mức giá trọn gói, phong cách, số lượng hạng mục và dấu tích có/không cho từng dịch vụ con. Nếu khách bấm chọn gói thứ 4, hệ thống giữ nguyên 3 gói cũ và phát thông báo giới hạn tối đa 3 gói. Khi bấm vào chi tiết gói (/goi-cuoi/:id), khách đã đăng nhập có thể xem nhanh thông tin từng dịch vụ thành phần qua hộp thoại nổi (QuickViewServiceModal), gửi phiếu "Nhận Báo Giá Nhanh" (cho phép bỏ tích bớt hạng mục không dùng để thương lượng giá) hoặc thêm gói vào giỏ cưới.',
    c:
      'Trạng thái yêu thích và so sánh được quản lý tập trung tại useWishlistStore (src/lib/wishlistStore.ts) sử dụng Zustand v5 kèm middleware persist lưu trữ dưới khóa hue-cung-dinh-wishlist-storage. Hàm toggleComparePackage kiểm tra độ dài mảng comparePackages so với hằng số MAX_COMPARE_PACKAGES = 3 và trả về một trong ba mã trạng thái ("added" | "removed" | "limit") để PackageCard hiển thị thông báo tương ứng qua useToastStore. Khi mở bảng đối chiếu trong ComparePackagesWidget, component nạp danh mục dịch vụ lẻ qua SupabaseService.getServices(), tập hợp hợp nhất (Set union) toàn bộ mã dịch vụ xuất hiện trong các gói đang chọn để dựng ma trận đối chiếu dòng–cột chính xác.',
    d:
      'Hệ thống có 9 gói cưới combo mẫu (4 gói phong cách cung-dinh, 3 gói co-dien, 2 gói hien-dai) với mức giá trọn gói từ 15.900.000 đ (gc-03) đến 38.500.000 đ (gc-09). Hằng số giới hạn so sánh khóa ở mức tối đa 3 gói cùng lúc; hộp đặc quyền tại trang chi tiết quy định thời lượng tác nghiệp tiêu chuẩn 8 giờ tại quần thể di tích.',
    e:
      'src/pages/PackagesPage.tsx, src/pages/PackageDetailPage.tsx, src/features/packages/types.ts, src/features/packages/components/PackageCard.tsx, QuickViewServiceModal.tsx, src/lib/wishlistStore.ts, src/components/common/WishlistAndCompareWidgets.tsx.',
  },
  {
    heading: '5.4. Phân hệ 4: Bản Đồ Số Hóa 9 Tọa Độ Nhiếp Ảnh Di Sản Cố Đô (/ban-do-di-san)',
    a:
      'Số hóa không gian địa lý hai bờ sông Hương thành bản đồ minh họa trực quan bằng đồ họa vector thuần túy, giúp cặp đôi từ tỉnh xa hình dung vị trí tương quan giữa Hoàng thành, các lăng tẩm và đồi thông, nắm rõ khung giờ ánh sáng đẹp cũng như chi phí vé quay chụp tại từng điểm.',
    b:
      'Người dùng mở menu "Khám Phá" trên thanh điều hướng và chọn "Bản Đồ Di Sản Cố Đô" (/ban-do-di-san — mở công khai không cần đăng nhập). Phía trên bản đồ có 4 nút lọc phân khu: Tất Cả (9 điểm), Hoàng Thành & Cung Điện, Lăng Tẩm Triều Nguyễn, và Thiên Nhiên & Phủ Đệ. Trên khung bản đồ vẽ sông Hương, Cồn Hến, cầu Trường Tiền và Kinh thành Huế, người dùng nhấp chuột (hoặc dùng phím Tab + Enter) vào từng ghim tọa độ. Cột thông tin bên phải lập tức cập nhật ảnh thực tế địa danh, khung giờ vàng ánh sáng, mức phí giấy phép quay chụp tham khảo, bộ cổ phục khuyên dùng, danh sách góc máy tiêu biểu và quy tắc bảo tồn di tích. Phía dưới bản đồ có 3 thẻ "Lộ Trình Bấm Máy 1 Ngày Gợi Ý"; khi bấm chọn một lộ trình, bản đồ vẽ đường nối đứt nét màu vàng kim nối liền các điểm theo thứ tự di chuyển trong ngày. Người dùng bấm nút "Đặt Lịch Chụp Tại Địa Điểm Này" để chuyển thẳng sang /dat-lich kèm sẵn địa điểm đã chọn.',
    c:
      'Component HeritageMapPage (src/pages/HeritageMapPage.tsx) được nạp lười qua React.lazy và tự dựng toàn bộ bản đồ bằng thẻ <svg viewBox="0 0 860 540"> mà không phụ thuộc thư viện bản đồ bên ngoài (như Leaflet hay Mapbox). Dòng chảy sông Hương được tính toán bằng đường cong Bézier bậc ba (<path>), Kinh thành Huế vẽ bằng hình đa giác chuẩn góc nghiêng thực địa, và các điểm ghim sử dụng nhóm <g role="button" tabIndex={0}> hỗ trợ đầy đủ sự kiện bàn phím onKeyDown. Đường nối lộ trình được sinh động bằng thẻ <polyline> ghép tọa độ (x, y) của mảng activeItinerarySpotIds. Mảng dữ liệu HUE_HERITAGE_SPOTS được định kiểu tuple không rỗng [HeritageSpot, ...HeritageSpot[]] để thỏa mãn cờ kiểm tra chỉ mục nghiêm ngặt noUncheckedIndexedAccess của TypeScript.',
    d:
      'Bản đồ quản lý đúng 9 tọa độ nhiếp ảnh chia làm 3 phân khu (3 điểm Hoàng thành: Ngọ Môn, Cung Diên Thọ, Cung An Định; 3 điểm Lăng tẩm: Lăng Khải Định, Lăng Minh Mạng, Lăng Tự Đức; 3 điểm Thiên nhiên & Phủ đệ: Cầu Trường Tiền & Sông Hương, Đồi Thiên An, Chùa Thiên Mụ). Mức phí giấy phép quay chụp dao động từ 0 đ (cảnh quan công cộng) đến 5.000.000 đ (khu vực Đại Nội). Tích hợp 3 lộ trình gợi ý 1 ngày (mỗi lộ trình nối 3 tọa độ).',
    e:
      'src/pages/HeritageMapPage.tsx, src/pages/HeritageMapPage.css.',
  },
  {
    heading: '5.5. Phân hệ 5: Phòng Phối Cổ Phục Cưới Trực Quan 2D (/phoi-co-phuc)',
    a:
      'Giải quyết bài toán hình dung sự hài hòa màu sắc giữa lễ phục của Tân Nương và Tân Lang trước buổi thử đồ thực tế tại xưởng may, đồng thời báo giá minh bạch theo từng cấu hình y phục và phụ kiện mà cặp đôi tự phối.',
    b:
      'Người dùng truy cập /phoi-co-phuc (công khai). Ở đầu trang có 3 nút "Bộ phối gợi ý nhanh" (Đại Triều Ngọ Môn, Tĩnh Mặc Khiêm Lăng, Hoàng Kim Diên Thọ) để áp dụng cấu hình mẫu chỉ với 1 cú nhấp. Khu vực chính chia 2 cột: cột trái là sân khấu phác thảo ma-nơ-canh đôi Cô Dâu và Chú Rể đứng dưới vòm cung đình; cột phải là bảng tùy chỉnh gồm chọn phom áo cô dâu, chọn màu gấm cô dâu, chọn phụ kiện đội đầu, chọn phom áo chú rể, chọn màu gấm chú rể và đánh dấu các phụ kiện đi kèm (khánh vàng, quạt trúc chỉ, hài thêu). Mỗi khi người dùng bấm đổi phom áo hoặc ô màu, màu sắc vạt áo, cổ chữ nhật Nhật Bình, tay áo ngũ sắc, mấn phượng và khăn xếp trên hình vẽ SVG cập nhật tức thì kèm tổng đơn giá thuê bộ đôi. Khi ưng ý, người dùng bấm "Lưu Bộ Phối Vào Giỏ Cưới" để đẩy trọn gói cấu hình này vào giỏ hàng.',
    c:
      'RoyalFittingRoomPage quản lý 6 biến trạng thái cục bộ (brideGarmentId, brideColorId, headwearId, groomGarmentId, groomColorId, selectedAccessories). Hình minh họa đôi uyên ương được vẽ bằng một cây SVG nhiều lớp (<svg viewBox="0 0 560 440">) tách bạch lớp nền kiến trúc, lớp tà áo sau, lớp quần lụa trắng, lớp thân áo chính nhận mã màu động hex, lớp viền cổ và hoa văn ngực nhận mã màu trimHex, cùng các lớp phụ kiện đội đầu và vật phẩm cầm tay ẩn/hiện theo điều kiện. Tổng giá tiền được tính cộng dồn trực tiếp từ đơn giá áo cô dâu, mấn/trâm, áo chú rể và tổng các phụ kiện đã tích chọn. Khi thêm vào giỏ, hàm handleAddCustomSetToCart kiểm tra trạng thái đăng nhập từ useAuth(); nếu hợp lệ sẽ sinh khóa định danh duy nhất cp-<cấu_hình> để lưu vào useCartStore mà không ghi đè lên các bộ phối khác màu.',
    d:
      'Cung cấp 3 phom cổ phục cô dâu (3.400.000 đ – 4.500.000 đ), 2 phom lễ phục chú rể (3.200.000 đ – 4.800.000 đ), 5 sắc gấm cô dâu, 4 sắc gấm chú rể, 3 tùy chọn phụ kiện đội đầu (250.000 đ – 850.000 đ), 3 phụ kiện cầm tay/hài thêu (200.000 đ – 350.000 đ) và 3 bộ preset phối sẵn. Tổng chi phí một bộ đôi tùy chỉnh nằm trong khoảng từ 6.850.000 đ đến 11.000.000 đ.',
    e:
      'src/pages/RoyalFittingRoomPage.tsx, src/pages/RoyalFittingRoomPage.css, src/features/packages/cartStore.ts.',
  },
  {
    heading: '5.6. Phân hệ 6: Triển Lãm Lookbook & Thanh Trượt Hậu Kỳ Trước / Sau (/trien-lam)',
    a:
      'Trình diễn năng lực nhiếp ảnh và quy trình xử lý màu phim (Color Grading) đặc trưng của studio tại bối cảnh di sản Huế, giúp khách hàng đối chiếu trực quan bức ảnh gốc từ máy ảnh và bức ảnh sau hậu kỳ.',
    b:
      'Người dùng truy cập /trien-lam. Tại khu vực đầu tiên "So Sánh Hậu Kỳ Tương Tác", người dùng chọn 1 trong 3 bối cảnh mẫu (Cổng Ngọ Môn, Cung Diên Thọ, Lăng Khải Định), sau đó kéo thanh trượt dọc sang trái hoặc phải (bằng chuột, ngón tay trên màn hình cảm ứng hoặc phím mũi tên trái/phải trên bàn phím) để quan sát sự thay đổi độ tương phản, sắc đỏ chu sa và ánh vàng kim giữa lớp "Ảnh Thô Nguyên Bản" và lớp "Hậu Kỳ Màu Phim". Cuộn xuống khu vực Triển Lãm Lookbook, người dùng lọc bộ sưu tập theo 3 chủ đề (Tất Cả, Đại Triều Cung Đình, Lăng Tẩm Hoài Cổ, Ngoại Cảnh Sông Hương) và bấm vào từng bức ảnh để mở hộp xem phóng lớn (Lightbox). Trong hộp phóng lớn, người dùng đọc thông số ống kính máy ảnh, câu chuyện buổi chụp, nhấn phím mũi tên để duyệt ảnh kế tiếp hoặc bấm nút đặt lịch theo đúng bối cảnh bức ảnh đó.',
    c:
      'LookbookGalleryPage sử dụng kỹ thuật xếp chồng hai lớp ảnh đồng kích thước kết hợp thuộc tính cắt vùng hiển thị clipPath: inset(0 <100 - sliderPercent>% 0 0) điều khiển bởi một thẻ <input type="range" min={5} max={95}> phủ trong suốt bên trên; cách làm này vừa đảm bảo thao tác kéo mượt trên cả máy tính lẫn điện thoại vừa tương thích tự nhiên với trình đọc màn hình A11y qua aria-label. Hộp xem ảnh phóng lớn đăng ký bộ lắng nghe sự kiện bàn phím trên window (Escape để đóng, ArrowRight / ArrowLeft để xoay vòng chỉ mục ảnh theo phép chia lấy dư modulo) và tự động gỡ sự kiện trong hàm dọn dẹp của useEffect.',
    d:
      'Trang bị 3 kịch bản đối chiếu hậu kỳ Trước / Sau (phạm vi kéo thanh trượt từ 5% đến 95%, khởi tạo ở mức 54%) và bộ sưu tập gồm đúng 9 tác phẩm Lookbook chia đều cho 3 nhóm chủ đề (3 tác phẩm cung-dinh, 3 tác phẩm hoai-co, 3 tác phẩm lang-man), mỗi tác phẩm đính kèm thông số tiêu cự, khẩu độ, ISO và tên địa danh chuyển tiếp sang trang đặt lịch.',
    e:
      'src/pages/LookbookGalleryPage.tsx, src/pages/LookbookGalleryPage.css.',
  },
  {
    heading: '5.7. Phân hệ 7: Đặt Lịch Chụp Ảnh, Lịch Tháng Kiểm Tra Ekip & Chọn Ca Chụp (/dat-lich)',
    a:
      'Tiếp nhận hồ sơ đăng ký ngày chụp ảnh và ngày cử hành hôn lễ của cặp đôi đã đăng nhập, đồng thời cung cấp lịch tháng trực quan báo mật độ ekip của studio và bộ chọn địa danh di sản tùy biến để tránh trùng ca bấm máy.',
    b:
      'Khách hàng đã đăng nhập truy cập /dat-lich (có thể đi thẳng từ menu chính hoặc nhận tham số chuyển tiếp từ Bản đồ Di sản, AI Tư vấn, Chi tiết Gói cưới). Biểu mẫu tự động điền sẵn họ tên và số điện thoại từ phiên đăng nhập hiện tại. Khách hàng duyệt "Lịch Tháng Kiểm Tra Ngày Trống Ekip" bên trái hoặc ngay trong form: các ô ngày hiển thị chấm màu thông báo trạng thái Trống lịch (màu xanh), Còn 1 ekip trống (màu vàng cam) hoặc Đã kín lịch (màu xám mờ không cho chọn). Khi bấm vào một ngày còn trống, ô "Ngày dự kiến chụp ảnh" tự động nhận giá trị đó. Tiếp theo, khách chọn 1 trong 3 ca chụp (Ca Bình Minh 05:30–09:30, Ca Hoàng Hôn 14:30–18:00, hoặc Trọn Ngày Di Sản 06:00–17:30), mở menu thả xuống hoàng gia (RoyalSelect) để chọn địa điểm di sản và gói combo, nhập ghi chú bổ sung rồi bấm gửi phiếu yêu cầu.',
    c:
      'BookingPage nạp đồng thời danh sách gói cưới và danh sách đơn yêu cầu hiện có qua SupabaseService. Dựa trên mảng đơn hợp lệ (khác trạng thái tu-choi), component đếm số ca chụp đã đặt trên từng ngày YYYY-MM-DD để phân loại 3 mức tải công suất ekip (0 đơn: trống; 1 đơn: còn 1 ekip; từ 2 đơn trở lên: kín lịch). Thành phần chọn tùy biến RoyalSelect hỗ trợ đầy đủ chuẩn tiếp cận bàn phím (ArrowDown, ArrowUp, Enter, Escape, aria-haspopup="listbox", aria-expanded) và tự động đóng khi nhấp chuột ra ngoài (mousedown ngoài vùng ref). Khi gửi biểu mẫu, dữ liệu được kiểm thực qua Zod (kiểm tra số điện thoại di động Việt Nam 10 chữ số, tên cô dâu chú rể, ngày chụp không rỗng), sau đó gọi SupabaseService.createRequest kèm trường caChup và điều hướng khách về trang /don-cua-toi.',
    d:
      'Hỗ trợ 3 ca chụp chuẩn định nghĩa trong kiểu CaChup ("binh-minh", "hoang-hon", "tron-ngay"); công suất tối đa 2 đoàn ekip/ngày trên lịch tháng; danh sách chọn nhanh gồm 6 cụm địa danh di sản Cố đô Huế và toàn bộ 9 gói cưới combo đồng bộ từ cơ sở dữ liệu.',
    e:
      'src/pages/BookingPage.tsx, src/pages/BookingPage.css, src/features/requests/types.ts.',
  },
  {
    heading: '5.8. Phân hệ 8: AI Tư Vấn Cân Đối Ngân Sách Hôn Lễ Hoàng Triều (/tu-van)',
    a:
      'Hỗ trợ các cặp đôi chưa rõ nên chọn gói dịch vụ nào tự tính toán phương án tối ưu dựa trên mức kinh phí dự trù, phong cách yêu thích, địa điểm mong muốn và số lượng bộ cổ phục cần mặc.',
    b:
      'Người dùng vào trang /tu-van (mở công khai), kéo thanh trượt ngân sách dự kiến, chọn phong cách chụp (Tất Cả, Cung Đình, Cổ Điển, Hiện Đại), chọn khu vực di sản ưu tiên, chọn số bộ trang phục (từ 1 đến 4 bộ) và chọn 1 trong 4 hình thức bấm máy (Ngoại cảnh Hoàng Cung, Cung Điện Nội Bộ, Studio Cổ Trang, hoặc Phóng sự Cinematic Flycam). Sau khi nhấn nút phân tích, khu vực kết quả hiển thị thẻ gói cưới phù hợp nhất, số tiền còn dư (hoặc cần bổ sung thêm), đoạn nhận xét chi tiết bằng tiếng Việt và danh sách tối đa 3 dịch vụ lẻ gợi ý mua thêm bằng phần ngân sách còn dư. Ngay dưới thẻ gói đề xuất có nút "Chuyển Thành Đơn Đặt Lịch Với Gói Này" dẫn người dùng sang trang /dat-lich với gói cưới và địa điểm đã được chọn sẵn.',
    c:
      'Biểu mẫu đầu vào được kiểm thực bằng tuVanInputSchema (src/features/consultation/types.ts). Thuật toán SupabaseService.calculateConsultation thực thi trực tiếp phía trình duyệt (Client-side) trên tập dữ liệu gói cưới và dịch vụ lẻ đã đồng bộ: trước tiên lọc các gói khớp phongCach; tiếp theo tìm các gói có giaTronGoi <= nganSach và sắp xếp giảm dần theo giá để chọn gói tận dụng tốt nhất ngân sách của khách (nếu mọi gói đều vượt ngân sách thì chọn gói có mức giá thấp nhất để giảm thiểu số tiền phát sinh). Nếu số tiền dư (chenhLech = nganSach - giaTronGoi) lớn hơn 1.000.000 đ, thuật toán lọc thêm tối đa 3 dịch vụ lẻ chưa nằm trong danhSachDichVuIds của gói đó và có đơn giá nhỏ hơn hoặc bằng khoản tiền dư.',
    d:
      'Thanh trượt ngân sách trong ConsultationWidgets.tsx cấu hình min = 10.000.000 đ, max = 60.000.000 đ, bước nhảy step = 1.000.000 đ; tuVanInputSchema yêu cầu ngân sách tối thiểu từ 10.000.000 đ; hỗ trợ 4 địa điểm và 4 hình thức chụp (bao gồm cả khóa "phim-truong" ánh xạ sang "Cung Điện Nội Bộ"); gợi ý tối đa 3 dịch vụ lẻ bổ sung.',
    e:
      'src/pages/ConsultationPage.tsx, src/features/consultation/types.ts, src/features/consultation/components/ConsultationWidgets.tsx, src/lib/supabaseAdapter.ts.',
  },
  {
    heading: '5.9. Phân hệ 9: Kho Thiệp Điện Tử, Cá Nhân Hóa 15 Ngân Hàng VietQR & Thiệp Mời Công Khai RSVP',
    a:
      'Cung cấp giải pháp thiệp báo hỷ trực tuyến trọn vòng đời: từ duyệt kho mẫu thiệp của studio, cá nhân hóa thông tin hai họ kèm tài khoản ngân hàng nhận mừng cưới, cho tới phát hành đường dẫn công khai gửi cho khách mời mở thiệp, nghe Nhã Nhạc và xác nhận tham dự (RSVP).',
    b:
      'Khách hàng duyệt 6 mẫu thiệp tại /thiep-cuoi, bấm xem trước giao diện điện thoại hoặc vào trang thiết kế 2 cột tại /thiep-cuoi/dang-ky (yêu cầu đăng nhập). Ở cột phải, cặp đôi nhập họ tên, thứ bậc gia đình (Trưởng Nam, Thứ Nữ...), ngày giờ cử hành hôn lễ, địa điểm, chọn 1 trong 15 ngân hàng Việt Nam trong danh mục thả xuống, nhập số tài khoản, chủ tài khoản và lời mời. Cột trái cập nhật tức thời bản xem trước thiệp cưới, đồng hồ đếm ngược chạy thực tế từng giây và mã ảnh VietQR sinh đúng theo mã BIN ngân hàng vừa chọn. Khi bấm "Lưu & Phát Hành Đường Dẫn Thiệp Mời", hệ thống tạo một đường dẫn duy nhất dạng /thiep-cuoi/moi/:slug kèm nút sao chép nhanh. Khách mời nhận đường dẫn này mở trực tiếp không cần đăng nhập: chạm vào ấn triện sáp vàng để mở phong bì, bật Nhã Nhạc Cung Đình, xem đồng hồ đếm ngược, quét mã VietQR mừng cưới và điền biểu mẫu xác nhận tham dự (chọn nhà trai/nhà gái, số người đi cùng 1–10, chế độ ăn Mặn hoặc Chay, lời chúc phúc) hiển thị ngay lên Sổ lưu bút cuối thiệp.',
    c:
      'Tệp src/features/invitations/types.ts định nghĩa từ điển BANK_BINS gồm 15 ngân hàng cùng hàm phân giải resolveBankBin (ưu tiên khớp chính xác mã code, mã BIN, tên ngắn trước khi tìm chuỗi con theo ranh giới từ để tránh nhầm lẫn mã "MB" bên trong "Techcombank") và hàm buildVietQrImageUrl tạo đường dẫn ảnh chuẩn Napas247. Hàm calculateCountdownParts phân tích cả định dạng YYYY-MM-DD lẫn DD/MM/YYYY và kết hợp setInterval(1000) để đếm lùi ngày–giờ–phút–giây thực tế. Trình phát âm thanh RoyalCourtAudio sử dụng Web Audio API tổng hợp giai điệu ngũ cung truyền thống ngay trên trình duyệt mà không phụ thuộc tệp MP3 bên ngoài. Dữ liệu thiệp phát hành và mảng danhSachRsvp được kiểm thực bằng customShareInvitationSchema và taoRsvpInputSchema, lưu trữ đồng thời lên bảng public.thiep_khach_tao của Supabase và bộ nhớ dự phòng localStorage.',
    d:
      'Kho mẫu Studio gồm 6 mẫu thiệp (2 VIP giá 450.000 đ, 2 PRO giá 310.000 đ, 2 Basic giá 168.000 đ); danh bạ ngân hàng hỗ trợ đúng 15 ngân hàng Việt Nam; biểu mẫu RSVP cho phép đăng ký từ 1 đến 10 khách/lượt với 2 chế độ thực đơn ("man" | "chay"); dữ liệu mẫu khởi tạo sẵn thiệp công khai /thiep-cuoi/moi/quoc-bao-ngoc-han-2026 kèm 2 lượt khách RSVP.',
    e:
      'src/pages/InvitationsPage.tsx, InvitationDetailPage.tsx, InvitationCustomPage.tsx, PublicInvitationSharePage.tsx, src/features/invitations/types.ts, InvitationModals.tsx, RoyalCourtAudio.ts.',
  },
  {
    heading: '5.10. Phân hệ 10: Sổ Tay Kế Hoạch & Dự Toán Đám Cưới Cá Nhân (/ke-hoach-cuoi)',
    a:
      'Cung cấp không gian làm việc cá nhân hóa cho từng cặp đôi đã đăng nhập để theo dõi tiến độ hàng chục đầu việc chuẩn bị cưới theo mốc thời gian và kiểm soát chênh lệch giữa ngân sách dự kiến với số tiền thực tế chi trả.',
    b:
      'Khách hàng đã đăng nhập mở mục "Sổ Tay Kế Hoạch Cưới" (/ke-hoach-cuoi) từ menu Khám Phá hoặc trang chủ. Trên đầu trang hiển thị tiêu đề gắn tên người dùng, ô chọn ngày cưới và 3 thẻ chỉ số tổng hợp: tỷ lệ phần trăm hoàn thành công việc, tổng ngân sách dự kiến và số tiền chênh lệch thực chi. Ở cột trái, khách đánh dấu hoàn thành từng đầu việc được chia theo 5 giai đoạn chuẩn bị (từ trước ngày cưới 6 tháng đến đúng ngày đại hỷ), xóa mục không cần thiết hoặc thêm đầu việc mới vào giai đoạn bất kỳ. Ở cột phải, khách điều chỉnh trực tiếp con số "Dự kiến" và "Thực chi" của từng nhóm chi phí (cổ phục & nhiếp ảnh, sính lễ gia tiên, tiệc rượu nhà hàng, thiệp cưới, nhẫn cưới, dự phòng); biểu đồ tròn khuyết tâm (Donut Chart) bên trên tự động vẽ lại tỷ trọng từng khoản. Khi cần họp gia đình hai bên, khách bấm nút "In Sổ Tay Cưới (A4)" để xuất bản in sạch gọn trên khổ giấy A4.',
    c:
      'WeddingPlannerPage gắn khóa lưu trữ riêng cho từng tài khoản theo mẫu hue_wedding_planner_v1_<tenDangNhap> trong localStorage, tự động khôi phục dữ liệu khi mở trang và tự động ghi xuống mỗi khi danh sách công việc hoặc bảng ngân sách thay đổi. Biểu đồ phân bổ ngân sách được tính toán hình học trực tiếp bằng các thẻ <circle> của SVG thuần túy thông qua chu vi hình tròn (2 * Math.PI * 64) và độ lệch nét đứt strokeDasharray / strokeDashoffset tương ứng với tỷ lệ từng khoản chi trên tổng dự toán, không sử dụng thư viện biểu đồ ngoài. Tệp CSS đi kèm định nghĩa khối @media print ẩn toàn bộ thanh điều hướng, chân trang và khung nhập liệu để chỉ in bảng kế hoạch và bảng tài chính trên nền giấy trắng.',
    d:
      'Khởi tạo sẵn 5 mốc thời gian chuẩn bị lễ cưới (Trước 6 tháng, Trước 3 tháng, Trước 1 tháng, Trước 1 tuần, Ngày Đại Hỷ), 10 đầu việc mẫu mặc định và 6 nhóm hạng mục ngân sách phổ biến; biểu đồ Donut SVG tính toán trên bán kính r = 64px.',
    e:
      'src/pages/WeddingPlannerPage.tsx, src/pages/WeddingPlannerPage.css.',
  },
  {
    heading: '5.11. Phân hệ 11: Giỏ Hàng Hoàng Gia, Đặt Cọc 20% VietQR Mã Hóa & Quản Lý Đơn Cá Nhân',
    a:
      'Quản lý tập trung toàn bộ các dịch vụ lẻ, gói cưới combo và bộ cổ phục phối riêng mà khách hàng đã chọn; hỗ trợ thanh toán đặt cọc giữ lịch 20% có mã phiếu đối soát và cho phép khách hàng theo dõi vòng đời đơn, tính phí hoàn hủy phân tầng cũng như in hợp đồng dịch vụ khổ A4.',
    b:
      'Khách hàng mở ngăn kéo giỏ hàng (CartDrawer) từ biểu tượng xe đẩy trên Header hoặc vào trang /gio-hang để tăng/giảm số lượng, xóa món và xem tổng giá trị tạm tính. Khi nhấn tiến hành đặt lịch, hộp thoại thanh toán cho phép tích chọn "Đặt cọc trước 20% giữ ngày cưới qua VietQR": hệ thống lập tức hiển thị mã QR ngân hàng với số tiền bằng đúng 20% tổng giỏ hàng và nội dung chuyển khoản đính kèm mã phiếu định danh dạng [COC_YC-XXXXX]. Sau khi qua bước xác nhận thứ hai chống bấm nhầm, giỏ hàng được làm rỗng và khách được chuyển tới /don-cua-toi. Tại /don-cua-toi, khách lọc đơn của mình theo trạng thái, mở chi tiết để ghi bổ sung mong muốn góc chụp, bấm "Hủy Đơn" (hệ thống tự tính số tiền hoàn cọc theo số ngày còn lại tới ngày chụp) hoặc bấm "Xuất Hợp Đồng A4" đối với các đơn đã được studio duyệt.',
    c:
      'Dữ liệu giỏ hàng lưu trong useCartStore (src/features/packages/cartStore.ts) với middleware persist của Zustand. Trước khi kết xuất ảnh VietQR trong CartDrawer.tsx, component khởi tạo trước mã đơn pendingOrderCode (YC-XXXXX) và truyền vào cả tham số addInfo của ảnh QR lẫn trường id của hàm SupabaseService.createRequest để đảm bảo mã đối soát ngân hàng trùng khớp hoàn toàn với mã đơn trong cơ sở dữ liệu. Tại MyBookingsPage, hàm calculateRefundPolicy (src/lib/formatters.ts) tính khoảng cách ngày giữa thời điểm hiện tại và ngayCuoi: từ 15 ngày trở lên hoàn 100% tiền cọc; từ 7 đến 14 ngày hoàn 50% tiền cọc; dưới 7 ngày không hoàn cọc (0%). Khi đơn đạt trạng thái da-duyet, thành phần RoyalContractA4Modal dựng văn bản hợp đồng dịch vụ đầy đủ thông tin Bên A, Bên B, bảng kê hạng mục, dấu xác nhận và định dạng in @media print khổ A4.',
    d:
      'Tỷ lệ đặt cọc giữ lịch cố định ở mức 20% tổng giá trị đơn; cú pháp nội dung VietQR tuân thủ định dạng "[COC_YC-XXXXX] Dat coc <tenKhach>"; chính sách hoàn cọc chia làm 3 bậc thời gian (>= 15 ngày: 100%, 7–14 ngày: 50%, < 7 ngày: 0%); trang /don-cua-toi cung cấp 6 tab lọc trạng thái.',
    e:
      'src/pages/CartPage.tsx, src/pages/MyBookingsPage.tsx, src/features/packages/cartStore.ts, src/components/common/CartDrawer.tsx, src/features/requests/components/RoyalContractA4Modal.tsx, src/lib/formatters.ts.',
  },
  {
    heading: '5.12. Phân hệ 12: Quản Trị Doanh Thu Dashboard Động, Danh Mục Dịch Vụ/Gói & Kho Thiệp RSVP',
    a:
      'Cung cấp cho Quản trị viên (vai trò admin) trung tâm theo dõi chỉ số kinh doanh tổng hợp từ dữ liệu đơn thực tế, đồng thời quản lý trọn vẹn kho dịch vụ lẻ, gói cưới combo và kho mẫu thiệp cưới kèm thống kê khách mời xác nhận tham dự (RSVP).',
    b:
      'Sau khi đăng nhập tài khoản admin và vào /admin, Quản trị viên quan sát 4 thẻ chỉ số hiệu suất (KPI) đính kèm đường sóng thu nhỏ (Sparklines), biểu đồ cột kép doanh thu 6 tháng, biểu đồ tròn cơ cấu gói cưới và nút xuất báo cáo ra tệp CSV tiếng Việt. Chuyển sang /admin/dich-vu và /admin/goi-cuoi, Quản trị viên thêm mới, chỉnh sửa hoặc xóa bản ghi (thông qua hộp thoại xác nhận ConfirmModal); trong biểu mẫu tạo/sửa có nút tải tệp ảnh trực tiếp từ máy tính lên hệ thống kèm khung xem trước ảnh thu nhỏ. Chuyển sang phân hệ mới /admin/thiep-cuoi ("Kho Thiệp & RSVP"), Quản trị viên sử dụng tab thứ nhất để thêm/sửa/xóa các mẫu thiệp điện tử của studio, và chuyển sang tab thứ hai ("Thiệp Khách Đã Phát Hành & RSVP") để theo dõi toàn bộ các đường dẫn thiệp cưới mà các cặp đôi đã tạo, xem tổng số khách xác nhận tham dự, số suất ăn Mặn, số suất ăn Chay, mở xem chi tiết sổ lời chúc hoặc gỡ bỏ đường dẫn thiệp vi phạm.',
    c:
      'Hàm SupabaseService.getAdminStats() truy vấn trực tiếp danh sách đơn từ getRequests("all") và danh sách gói cưới để tính toán động tổng số đơn (tongDon), số đơn đang chờ xử lý (donChoXuLy), tổng doanh thu dự kiến của các đơn hợp lệ (không tính đơn tu-choi), tỷ lệ xử lý thành công và thống kê cơ cấu gói cưới thực tế. Toàn bộ biểu đồ trên Dashboard được vẽ bằng các thẻ <svg>, <rect>, <circle>, <path> tự tính tọa độ trong AdminCharts.tsx. Khi Quản trị viên chọn tệp hình ảnh trong ServiceFormModal, PackageFormModal hoặc AdminInvitationsPage, hàm SupabaseService.uploadImageAsset tải tệp lên kho lưu trữ Supabase Storage (bucket studio-media); nếu môi trường chưa cấu hình khóa đám mây hoặc đang ngoại tuyến, hàm tự động chuyển sang đọc tệp qua FileReader.readAsDataURL để lưu chuỗi ảnh mã hóa Base64 hợp lệ với biểu thức kiểm thực imageUrlOrDataSchema.',
    d:
      'Dashboard hiển thị 4 thẻ KPI Sparklines, biểu đồ cột doanh thu 6 tháng (T6 đến T11) và biểu đồ Donut cơ cấu gói cưới; hỗ trợ xuất 2 loại tệp báo cáo CSV có ký tự đánh dấu UTF-8 BOM hiển thị chuẩn dấu tiếng Việt trong Microsoft Excel; phân hệ /admin/thiep-cuoi quản lý 2 tab nghiệp vụ độc lập (Kho mẫu Studio và Thiệp khách phát hành kèm bộ đếm khẩu phần Mặn/Chay).',
    e:
      'src/pages/admin/AdminDashboardPage.tsx, AdminServicesPage.tsx, AdminPackagesPage.tsx, AdminInvitationsPage.tsx, src/features/admin/components/AdminCharts.tsx, src/features/services/components/ServiceFormModal.tsx, src/features/packages/components/PackageFormModal.tsx.',
  },
  {
    heading: '5.13. Phân hệ 13: Quản Trị Đơn Yêu Cầu Kanban Kéo Thả 5 Cột & Lịch Điều Phối Ekip (/admin/yeu-cau, /admin/lich-chup)',
    a:
      'Giúp bộ phận điều hành của studio kiểm soát trực quan quy trình chăm sóc từng đơn yêu cầu từ lúc mới tiếp nhận đến khi hoàn tất bàn giao album, đồng thời phân công cụ thể Nhiếp ảnh gia và Nghệ nhân cổ phục trên lịch tháng để không xảy ra xung đột nhân sự.',
    b:
      'Tại trang /admin/yeu-cau, Quản trị viên có thể chuyển đổi qua lại giữa chế độ "Bảng Danh Sách" và chế độ "Bảng Kanban". Ở chế độ Kanban, màn hình hiển thị đầy đủ 5 cột trạng thái: Chờ Xử Lý, Đã Duyệt, Đã Liên Hệ, Hoàn Thành và Đã Từ Chối. Quản trị viên dùng chuột nắm kéo một thẻ đơn yêu cầu thả sang cột trạng thái mới (hoặc bấm các nút hành động nhanh trên thẻ) để cập nhật tiến độ tức thời. Trên mỗi dòng hoặc thẻ đơn, Quản trị viên bấm nút "Nhật ký CSKH" để mở hộp thoại xem lịch sử trao đổi và ghi thêm ghi chú chăm sóc mới (ví dụ: đã đo số đo áo Nhật Bình, đã xin giấy phép Đại Nội), bấm "In HĐ A4" cho các đơn đã duyệt, hoặc bấm xóa đơn qua hộp thoại xác nhận ConfirmModal. Tiếp đó, khi chuyển sang menu "/admin/lich-chup" ("Lịch Điều Phối Ekip"), Quản trị viên quan sát lịch bấm máy của cả tháng: mỗi ô ngày hiển thị các thẻ ca chụp kèm màu ca (Bình minh / Hoàng hôn / Trọn ngày). Nhấp vào một ca chụp sẽ mở cửa sổ phân công cho phép chọn Nhiếp ảnh gia chánh máy, chọn Stylist cổ phục, đổi ca chụp hoặc dời ngày chụp.',
    c:
      'AdminRequestsPage triển khai cơ chế kéo thả chuẩn HTML5 Drag & Drop thông qua các sự kiện onDragStart (lưu mã đơn đang kéo), onDragOver (gọi e.preventDefault() và bật viền sáng cột đích đang lướt qua) và onDrop (gọi SupabaseService.updateRequestStatus để đồng bộ trạng thái mới lên bảng public.yeu_cau và cập nhật giao diện). Mọi thao tác xóa đơn đều sử dụng ConfirmModal dùng chung thay cho hàm window.confirm nguyên bản của trình duyệt. Nhật ký chăm sóc khách hàng được lưu dưới dạng mảng đối tượng JSONB (lich_su_cham_soc) gồm thoiGian, noiDung, nguoiGhi thông qua hàm SupabaseService.appendRequestCareLog. Tại AdminSchedulePage, việc lưu phân công nhân sự gọi hàm SupabaseService.updateRequestScheduleAndCrew cập nhật cột ekip_phu_trach (nhiepAnhGia, stylist), ca_chup và ngay_cuoi của bản ghi đơn tương ứng.',
    d:
      'Bảng Kanban tại /admin/yeu-cau hiển thị trọn vẹn 5 cột khớp với 5 giá trị của trangThaiYeuCauEnum ("cho-xu-ly", "da-duyet", "da-lien-he", "hoan-thanh", "tu-choi"); Lịch điều phối tại /admin/lich-chup cung cấp danh sách lựa chọn gồm 4 Nhiếp ảnh gia di sản chuyên trách, 4 Nghệ nhân cổ phục & trang điểm và 3 khung ca chụp trong ngày.',
    e:
      'src/pages/admin/AdminRequestsPage.tsx, AdminRequestsPage.css, src/pages/admin/AdminSchedulePage.tsx, src/lib/supabaseAdapter.ts.',
  },
  {
    heading: '5.14. Phân hệ 14: Quản Trị Tài Khoản 2-Tier RBAC & Cẩm Nang Vận Hành SOP (/admin/tai-khoan, /quy-trinh)',
    a:
      'Đảm bảo an toàn phân quyền truy cập hệ thống theo đúng mô hình 2 vai trò tinh gọn và chuẩn hóa quy trình đào tạo tác nghiệp thực địa tại các khu di tích Huế cho đội ngũ nhân sự nội bộ.',
    b:
      'Tại trang /admin/tai-khoan, Quản trị viên theo dõi 4 thẻ thống kê số lượng người dùng (Tổng tài khoản, Quản trị viên, Khách hàng, Đang hoạt động), tìm kiếm người dùng theo tên đăng nhập, họ tên, số điện thoại hoặc thư điện tử, lọc theo vai trò và gạt công tắc kích hoạt/vô hiệu hóa tài khoản. Quản trị viên có thể mở biểu mẫu tạo tài khoản mới hoặc sửa thông tin; riêng tài khoản quản trị gốc (admin) được khóa bảo vệ không cho phép xóa hoặc vô hiệu hóa nhằm tránh rủi ro mất quyền điều khiển hệ thống. Khi cần tra cứu quy chuẩn nghiệp vụ, Quản trị viên bấm vào liên kết "Hướng Dẫn & Quy Trình" trong menu tài khoản hoặc chân thanh bên Admin để mở trang /quy-trinh (tuyến này bị ẩn và chặn truy cập đối với khách hàng thường). Tại /quy-trinh, Quản trị viên tìm kiếm từ khóa tức thời, chuyển đổi qua 4 tab (Quy trình SOP, Theo vai trò nhân sự có danh sách kiểm tra đánh dấu hoàn thành, Theo phân hệ phần mềm, và Quy tắc nghiệp vụ di sản) hoặc bấm in toàn bộ tài liệu ra khổ giấy A4.',
    c:
      'AdminUsersPage sử dụng userFormSchema (src/features/auth/types.ts) thuộc thư viện Zod để kiểm thực chỉ chấp nhận đúng 2 giá trị vai trò là "admin" hoặc "user" (từ chối mọi chuỗi vai trò cũ như "nhan-vien"), kiểm tra độ dài tên đăng nhập và định dạng thư điện tử trước khi gọi SupabaseService.createUser / updateUser / deleteUser trên bảng public.profiles. Tại ProcessGuidePage, toàn bộ các huy hiệu thống kê trên biểu ngữ đầu trang và nhãn tab đều được kết xuất động từ thuộc tính .length của 4 mảng hằng dữ liệu (SOP_DATA.length, ROLES_DATA.length, SYSTEMS_DATA.length, RULES_DATA.length), đảm bảo sự trùng khớp giữa dữ liệu mã nguồn và con số hiển thị trên giao diện.',
    d:
      'Mô hình phân quyền khóa chặt ở 2 vai trò ("admin" và "user"); trang /quy-trinh lưu trữ và hiển thị chính xác 6 quy trình tác nghiệp tiêu chuẩn (sop-01 đến sop-06), 4 vai trò nhân sự & khách hàng kèm checklist tương tác, 7 phân hệ phần mềm và đúng 8 quy tắc bảo tồn & nghiệp vụ di sản (rule-01 đến rule-08).',
    e:
      'src/pages/admin/AdminUsersPage.tsx, src/pages/ProcessGuidePage.tsx, src/pages/ProcessGuidePage.css, src/features/auth/types.ts, AuthContext.tsx, ProtectedRoute.tsx.',
  },
];

module.exports = { CHAPTER_5_MODULES };
