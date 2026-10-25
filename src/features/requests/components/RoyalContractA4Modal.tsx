import { YeuCau } from "../types";
import { formatCurrency, formatDate } from "../../../lib/formatters";
import { Button } from "../../../components/common/UI";
import { Icon } from "../../../components/common/Icon";
import "./RoyalContractA4Modal.css";

interface RoyalContractA4ModalProps {
  request: YeuCau | null;
  onClose: () => void;
}

export function RoyalContractA4Modal({ request, onClose }: RoyalContractA4ModalProps) {
  if (!request) return null;

  const totalCost = request.nganSach || 0;
  const deposit = Math.round(totalCost * 0.2);
  const remaining = totalCost - deposit;
  const contractCode = `HD-${request.id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() || "HCD"}-2026`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="royal-contract-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="royal-contract-window" onClick={(e) => e.stopPropagation()}>
        {/* Thanh công cụ Modal (ẩn khi in) */}
        <div className="contract-toolbar no-print">
          <div className="toolbar-left">
            <span className="contract-status-badge">✓ HỢP ĐỒNG ĐÃ ĐƯỢC PHÊ DUYỆT</span>
            <span className="contract-code-txt">Mã HĐ: <strong>{contractCode}</strong></span>
          </div>
          <div className="toolbar-right">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Icon name="printer" size={16} />}
            >
              In Hợp Đồng A4
            </Button>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>

        {/* NỘI DUNG HỢP ĐỒNG PHÁP LÝ A4 CHUẨN CUNG ĐÌNH */}
        <div className="contract-a4-sheet" id="printable-contract-sheet">
          <div className="contract-national-header">
            <h4>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
            <p className="national-motto">Độc lập – Tự do – Hạnh phúc</p>
            <div className="national-divider">❖ ❖ ❖</div>
          </div>

          <div className="contract-main-title">
            <h2>HỢP ĐỒNG DỊCH VỤ NHIẾP ẢNH CƯỚI CUNG ĐÌNH</h2>
            <p className="contract-sub-code">Số: {contractCode}/HĐ-HCD</p>
          </div>

          <div className="contract-preamble">
            <p>- Căn cứ Bộ luật Dân sự số 91/2015/QH13 của Quốc hội nước CHXHCN Việt Nam;</p>
            <p>- Căn cứ Luật Thương mại số 36/2005/QH11 ngày 14/06/2005;</p>
            <p>- Căn cứ vào nhu cầu của Khách hàng và năng lực cung ứng của Studio Huế Cung Đình.</p>
            <p className="contract-date-line">
              Hôm nay, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}, tại TP. Huế, chúng tôi gồm có:
            </p>
          </div>

          {/* BÊN A */}
          <div className="contract-party-box">
            <h5 className="party-title">BÊN A (BÊN CUNG CẤP DỊCH VỤ): STUDIO HUẾ CUNG ĐÌNH</h5>
            <div className="party-details">
              <p><strong>Đại diện pháp luật:</strong> Ông TRẦN CÔNG QUÝ - Giám đốc điều hành</p>
              <p><strong>Địa chỉ trụ sở:</strong> Số 01 Lê Duẩn, Phường Thuận Thành, Thành phố Huế</p>
              <p><strong>Điện thoại liên hệ:</strong> 0905 123 456 | <strong>Mã số thuế:</strong> 3301889988</p>
              <p><strong>Tài khoản thanh toán:</strong> 0905123456 - Ngân hàng MB Bank (Chi nhánh Thừa Thiên Huế)</p>
            </div>
          </div>

          {/* BÊN B */}
          <div className="contract-party-box">
            <h5 className="party-title">BÊN B (BÊN SỬ DỤNG DỊCH VỤ - KHÁCH HÀNG):</h5>
            <div className="party-details">
              <p><strong>Họ và tên Quý khách:</strong> {request.tenKhach}</p>
              <p><strong>Số điện thoại liên hệ:</strong> {request.soDienThoai}</p>
              <p><strong>Địa điểm chụp ảnh di sản:</strong> {request.diaDiemChup || "Đại Nội Cố Đô Huế & Quần thể Lăng tẩm Hoàng Gia"}</p>
              <p><strong>Ngày chụp dự kiến:</strong> {formatDate(request.ngayCuoi)}</p>
            </div>
          </div>

          <p className="agreement-text">
            Hai bên thống nhất ký kết Hợp đồng dịch vụ thực hiện bộ ảnh cưới hoàng gia với các điều khoản sau:
          </p>

          {/* ĐIỀU 1 */}
          <div className="contract-clause">
            <h5 className="clause-title">ĐIỀU 1: HẠNG MỤC DỊCH VỤ VÀ GÓI CHỤP ẢNH</h5>
            <p>1.1. Tên gói / Dịch vụ đăng ký: <strong>{request.tenDon || `Gói Cưới Hoàng Triều #${request.goiDeXuatId || "VIP"}`}</strong>.</p>
            {request.danhSachDichVu && request.danhSachDichVu.length > 0 && (
              <div className="contract-items-table-wrap">
                <table className="contract-items-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên hạng mục dịch vụ</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {request.danhSachDichVu.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: "center" }}>{idx + 1}</td>
                        <td>{item.ten}</td>
                        <td style={{ textAlign: "center" }}>{item.soLuong}</td>
                        <td style={{ textAlign: "right" }}>{formatCurrency(item.gia)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p>1.2. Quyền lợi tiêu chuẩn: Cổ phục Nhật Bình/Áo Tấc thêu tay hoàng gia, 01 Ekip nhiếp ảnh chuyên nghiệp, trang điểm làm tóc phong cách triều đình, toàn bộ file gốc độ phân giải cao và album ảnh cao cấp.</p>
            {request.mongMuonBoSung && (
              <p className="clause-note"><strong>* Mong muốn bổ sung của Quý khách:</strong> {request.mongMuonBoSung}</p>
            )}
          </div>

          {/* ĐIỀU 2 */}
          <div className="contract-clause">
            <h5 className="clause-title">ĐIỀU 2: GIÁ TRỊ HỢP ĐỒNG VÀ PHƯƠNG THỨC THANH TOÁN</h5>
            <p>2.1. Tổng giá trị hợp đồng trọn gói: <strong className="contract-price">{formatCurrency(totalCost)}</strong> (Đã bao gồm thuế và phí bảo quản phục trang).</p>
            <p>2.2. Tiến độ thanh toán được chia làm 02 đợt:</p>
            <ul>
              <li><strong>Đợt 1 (Đặt cọc giữ lịch):</strong> Bên B thanh toán 20% tương đương <strong>{formatCurrency(deposit)}</strong> ngay sau khi duyệt hợp đồng.</li>
              <li><strong>Đợt 2 (Tất toán):</strong> Bên B thanh toán 80% còn lại tương đương <strong>{formatCurrency(remaining)}</strong> trong ngày thực hiện buổi chụp ảnh hoặc sau khi nhận bàn giao đầy đủ file ảnh hoàn thiện.</li>
            </ul>
          </div>

          {/* ĐIỀU 3 */}
          <div className="contract-clause">
            <h5 className="clause-title">ĐIỀU 3: TRÁCH NHIỆM VÀ CAM KẾT CHẤT LƯỢNG</h5>
            <p>3.1. <strong>Bên A cam kết:</strong> Cung cấp phục trang cung đình đúng phẩm cấp, sạch sẽ, không hư hỏng; nhiếp ảnh gia tận tâm hướng dẫn tạo dáng nghi lễ cung đình; giao trả toàn bộ sản phẩm ảnh đúng hẹn.</p>
            <p>3.2. <strong>Bên B cam kết:</strong> Có mặt đúng giờ theo lịch hẹn chụp tại di sản; bảo quản trang phục trong quá trình sử dụng và thanh toán đúng hạn.</p>
          </div>

          {/* CHỮ KÝ */}
          <div className="contract-signatures-box">
            <div className="signature-col">
              <span className="sign-role">ĐẠI DIỆN BÊN B (KHÁCH HÀNG)</span>
              <span className="sign-hint">(Ký, ghi rõ họ tên)</span>
              <div className="sign-space-customer">
                <span className="customer-sign-name">{request.tenKhach}</span>
              </div>
            </div>

            <div className="signature-col">
              <span className="sign-role">ĐẠI DIỆN BÊN A (STUDIO HUẾ CUNG ĐÌNH)</span>
              <span className="sign-hint">(Ký tên và đóng dấu điện tử)</span>
              <div className="sign-seal-wrap">
                <div className="studio-red-seal">
                  <span>DẤU CHỨNG NHẬN ĐIỆN TỬ</span>
                  <strong>HUẾ CUNG ĐÌNH</strong>
                  <span className="seal-reg">★ ĐÃ XÁC THỰC ★</span>
                </div>
                <span className="director-sign-name">Trần Công Quý</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
