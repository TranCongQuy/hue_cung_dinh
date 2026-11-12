import { useState, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router";
import { useFetch } from "../../lib/useFetch";
import {
  ThiepCuoi,
  ThiepCuoiLoai,
  ThiepCuoiPhongCach,
  thiepCuoiListSchema,
  taoThiepCuoiInputSchema,
  CustomShareInvitation,
  customShareInvitationListSchema,
} from "../../features/invitations/types";
import { formatCurrency } from "../../lib/formatters";
import { Modal, ConfirmModal } from "../../components/common/Modal";
import { Button, Input, Skeleton } from "../../components/common/UI";
import { Icon } from "../../components/common/Icon";
import { useToastStore } from "../../lib/toastStore";
import { SupabaseService } from "../../lib/supabaseAdapter";
import { assertNever } from "../../lib/types";
import "./AdminServicesPage.css";

export function AdminInvitationsPage() {
  const addToast = useToastStore((s) => s.addToast);
  const { state: templatesState, refetch: refetchTemplates } = useFetch(
    "/api/thiep-cuoi",
    thiepCuoiListSchema
  );
  const { state: sharedState, refetch: refetchShared } = useFetch(
    "/api/thiep-khach-tao",
    customShareInvitationListSchema
  );

  const [activeTab, setActiveTab] = useState<"templates" | "shared">(
    "templates"
  );

  // Modal Form cho Mẫu Thiệp Studio
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ThiepCuoi | null>(null);
  const [deleteTemplateTarget, setDeleteTemplateTarget] =
    useState<ThiepCuoi | null>(null);
  const [deleteSharedTarget, setDeleteSharedTarget] =
    useState<CustomShareInvitation | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formValues, setFormValues] = useState({
    ten: "",
    phongCach: "cung-dinh" as ThiepCuoiPhongCach,
    loai: "vip" as ThiepCuoiLoai,
    gia: "450000",
    giaGoc: "990000",
    moTa: "",
    hinhAnh:
      "https://images.unsplash.com/photo-1775049400316-a705eb6bacf3?auto=format&fit=crop&w=800&q=80",
    coDau: "Ngọc Hân",
    chuRe: "Quốc Bảo",
    ngayCuoi: "2026-12-28",
    diaDiem: "Đại Cung Môn - Cố Đô Huế",
    amNhac: "Nhã Nhạc Cung Đình - Lưu Thủy Kim Tiền",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const openCreateModal = () => {
    setEditingItem(null);
    setFormValues({
      ten: "",
      phongCach: "cung-dinh",
      loai: "vip",
      gia: "450000",
      giaGoc: "990000",
      moTa: "",
      hinhAnh:
        "https://images.unsplash.com/photo-1775049400316-a705eb6bacf3?auto=format&fit=crop&w=800&q=80",
      coDau: "Ngọc Hân",
      chuRe: "Quốc Bảo",
      ngayCuoi: "2026-12-28",
      diaDiem: "Đại Cung Môn - Cố Đô Huế",
      amNhac: "Nhã Nhạc Cung Đình - Lưu Thủy Kim Tiền",
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const openEditModal = (item: ThiepCuoi) => {
    setEditingItem(item);
    setFormValues({
      ten: item.ten,
      phongCach: item.phongCach,
      loai: item.loai,
      gia: String(item.gia),
      giaGoc: String(item.giaGoc),
      moTa: item.moTa,
      hinhAnh: item.hinhAnh,
      coDau: item.coDau,
      chuRe: item.chuRe,
      ngayCuoi: item.ngayCuoi,
      diaDiem: item.diaDiem,
      amNhac: item.amNhac || "Nhã Nhạc Cung Đình",
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const handleUploadCover = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      addToast("Vui lòng chọn tệp hình ảnh hợp lệ!", "error");
      return;
    }
    setIsUploading(true);
    try {
      const url = await SupabaseService.uploadImageAsset(file, "invitations");
      setFormValues((prev) => ({ ...prev, hinhAnh: url }));
      addToast("Đã tải ảnh bìa mẫu thiệp lên thành công!", "success");
    } catch {
      addToast("Không thể đọc tệp hình ảnh", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveTemplate = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = taoThiepCuoiInputSchema.safeParse({
      ...formValues,
      gia: Number(formValues.gia),
      giaGoc: Number(formValues.giaGoc),
      tinhNang: [
        "Mã QR Mừng Cưới 15 Ngân Hàng",
        "Đếm Ngược Thời Gian Thực",
        "Sổ Lưu Bút & RSVP",
      ],
    });

    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        if (iss.path[0]) errs[String(iss.path[0])] = iss.message;
      });
      setFormErrors(errs);
      return;
    }

    setIsBusy(true);
    try {
      if (editingItem) {
        await SupabaseService.updateInvitation(editingItem.id, parsed.data);
        addToast("Đã cập nhật mẫu thiệp cưới thành công!", "success");
      } else {
        await SupabaseService.createInvitation(parsed.data);
        addToast("Đã thêm mẫu thiệp cưới mới vào kho!", "success");
      }
      setFormOpen(false);
      refetchTemplates();
    } finally {
      setIsBusy(false);
    }
  };

  const handleConfirmDeleteTemplate = async () => {
    if (!deleteTemplateTarget) return;
    setIsBusy(true);
    try {
      await SupabaseService.deleteInvitation(deleteTemplateTarget.id);
      addToast(`Đã xóa mẫu thiệp "${deleteTemplateTarget.ten}"!`, "success");
      setDeleteTemplateTarget(null);
      refetchTemplates();
    } finally {
      setIsBusy(false);
    }
  };

  const handleConfirmDeleteShared = async () => {
    if (!deleteSharedTarget) return;
    setIsBusy(true);
    try {
      await SupabaseService.deleteCustomInvitation(deleteSharedTarget.slug);
      addToast("Đã gỡ đường dẫn thiệp công khai!", "success");
      setDeleteSharedTarget(null);
      refetchShared();
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="admin-services-root">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            Quản Trị Kho Thiệp Cưới &amp; Sổ Khách Mời RSVP
          </h1>
          <p className="admin-page-desc">
            Quản lý danh mục mẫu thiệp điện tử hoàng triều và theo dõi lượng khách xác nhận tham dự (RSVP)
          </p>
        </div>
        {activeTab === "templates" && (
          <Button
            variant="primary"
            size="md"
            leftIcon={<Icon name="plus" size={18} />}
            onClick={openCreateModal}
          >
            Thêm Mẫu Thiệp Mới
          </Button>
        )}
      </div>

      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
        <Button
          variant={activeTab === "templates" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveTab("templates")}
        >
          Kho Mẫu Thiệp Studio (
          {templatesState.status === "success" ? templatesState.data.length : 0})
        </Button>
        <Button
          variant={activeTab === "shared" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveTab("shared")}
        >
          Thiệp Khách Đã Phát Hành &amp; RSVP (
          {sharedState.status === "success" ? sharedState.data.length : 0})
        </Button>
      </div>

      {activeTab === "templates" ? (
        <div className="admin-card-table-wrapper">
          {(() => {
            switch (templatesState.status) {
              case "loading":
                return (
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} height="54px" />
                    ))}
                  </div>
                );
              case "error":
                return (
                  <div className="error-box" style={{ margin: "32px auto", maxWidth: "460px" }}>
                    <p>{templatesState.message}</p>
                    <Button variant="secondary" size="sm" onClick={refetchTemplates}>
                      Thử lại
                    </Button>
                  </div>
                );
              case "success":
                return (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: "80px" }}>Ảnh Bìa</th>
                        <th>Tên Mẫu Thiệp</th>
                        <th>Hạng Gói</th>
                        <th>Phong Cách</th>
                        <th>Giá Niêm Yết</th>
                        <th style={{ textAlign: "right" }}>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templatesState.data.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <img
                              src={item.hinhAnh}
                              alt={item.ten}
                              className="table-thumb-img"
                            />
                          </td>
                          <td className="fw-bold">{item.ten}</td>
                          <td>
                            <span className="table-cat-badge">
                              {item.loai.toUpperCase()}
                            </span>
                          </td>
                          <td>{item.phongCach}</td>
                          <td className="text-primary fw-bold">
                            {formatCurrency(item.gia)}
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                type="button"
                                className="icon-action-btn edit-btn"
                                onClick={() => openEditModal(item)}
                                aria-label={`Chỉnh sửa mẫu thiệp ${item.ten}`}
                              >
                                <Icon name="edit" size={16} />
                              </button>
                              <button
                                type="button"
                                className="icon-action-btn delete-btn"
                                onClick={() => setDeleteTemplateTarget(item)}
                                aria-label={`Xóa mẫu thiệp ${item.ten}`}
                              >
                                <Icon name="trash" size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              default:
                return assertNever(templatesState);
            }
          })()}
        </div>
      ) : (
        <div className="admin-card-table-wrapper">
          {(() => {
            switch (sharedState.status) {
              case "loading":
                return (
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Skeleton height="56px" />
                    <Skeleton height="56px" />
                  </div>
                );
              case "error":
                return (
                  <div className="error-box" style={{ margin: "32px auto", maxWidth: "460px" }}>
                    <p>{sharedState.message}</p>
                    <Button variant="secondary" size="sm" onClick={refetchShared}>
                      Thử lại
                    </Button>
                  </div>
                );
              case "success":
                return (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Cặp Đôi Tân Hôn</th>
                        <th>Ngày Cưới &amp; Địa Điểm</th>
                        <th>Ngân Hàng VietQR</th>
                        <th>Lượt Lời Chúc</th>
                        <th>Tổng Khách Dự &amp; Chay/Mặn</th>
                        <th style={{ textAlign: "right" }}>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sharedState.data.map((inv) => {
                        const attendingList = inv.danhSachRsvp.filter(
                          (r) => r.trangThaiThamDu === "tham-du"
                        );
                        const totalGuests = attendingList.reduce(
                          (s, r) => s + r.soLuongNguoi,
                          0
                        );
                        const vegGuests = attendingList
                          .filter((r) => r.cheDoAn === "chay")
                          .reduce((s, r) => s + r.soLuongNguoi, 0);

                        return (
                          <tr key={inv.slug}>
                            <td>
                              <strong>
                                {inv.tenChuRe} &amp; {inv.tenCoDau}
                              </strong>
                              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                /{inv.slug}
                              </div>
                            </td>
                            <td>
                              <div>
                                {inv.gioToChuc} • {inv.ngayCuoi}
                              </div>
                              <small style={{ color: "var(--text-muted)" }}>
                                {inv.diaDiem}
                              </small>
                            </td>
                            <td>
                              {inv.nganHang} • {inv.soTaiKhoan}
                            </td>
                            <td className="fw-bold">
                              {inv.danhSachRsvp.length} lời chúc
                            </td>
                            <td>
                              <strong>{totalGuests} khách</strong>
                              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                Mặn: {totalGuests - vegGuests} • Chay: {vegGuests}
                              </div>
                            </td>
                            <td>
                              <div className="table-actions">
                                <Link
                                  to={`/thiep-cuoi/moi/${inv.slug}`}
                                  className="icon-action-btn edit-btn"
                                  title="Mở trang thiệp công khai"
                                  aria-label={`Mở thiệp công khai của ${inv.tenChuRe}`}
                                >
                                  <Icon name="share" size={16} />
                                </Link>
                                <button
                                  type="button"
                                  className="icon-action-btn delete-btn"
                                  onClick={() => setDeleteSharedTarget(inv)}
                                  aria-label={`Xóa thiệp công khai ${inv.slug}`}
                                >
                                  <Icon name="trash" size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              default:
                return assertNever(sharedState);
            }
          })()}
        </div>
      )}

      {/* Modal Thêm / Sửa Mẫu Thiệp */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={
          editingItem
            ? "Cập Nhật Mẫu Thiệp Cưới"
            : "Thêm Mẫu Thiệp Cưới Điện Tử Mới"
        }
      >
        <form onSubmit={handleSaveTemplate} noValidate>
          <Input
            name="ten"
            label="Tên mẫu thiệp"
            placeholder="VD: Liên Hoa Hoàng Triều"
            value={formValues.ten}
            onChange={(e) =>
              setFormValues({ ...formValues, ten: e.target.value })
            }
            error={formErrors.ten}
            required
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="input-field-group">
              <label className="input-label" htmlFor="inv-loai">
                Hạng gói thiệp
              </label>
              <select
                id="inv-loai"
                name="loai"
                className="input-control"
                value={formValues.loai}
                aria-invalid={false}
                aria-describedby="desc-inv-loai"
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    loai: e.target.value as ThiepCuoiLoai,
                  })
                }
              >
                <option value="vip">VIP (450.000 đ)</option>
                <option value="pro">PRO (295.000 đ)</option>
                <option value="basic">BASIC (168.000 đ)</option>
              </select>
              <span id="desc-inv-loai" className="sr-only">
                Chọn phân hạng của mẫu thiệp
              </span>
            </div>

            <div className="input-field-group">
              <label className="input-label" htmlFor="inv-style">
                Phong cách thiết kế
              </label>
              <select
                id="inv-style"
                name="phongCach"
                className="input-control"
                value={formValues.phongCach}
                aria-invalid={false}
                aria-describedby="desc-inv-style"
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    phongCach: e.target.value as ThiepCuoiPhongCach,
                  })
                }
              >
                <option value="cung-dinh">Cung Đình Hoàng Triều</option>
                <option value="co-dien">Hoài Niệm Cổ Điển</option>
                <option value="hien-dai">Hiện Đại Tinh Tế</option>
              </select>
              <span id="desc-inv-style" className="sr-only">
                Chọn phong cách mỹ thuật của mẫu thiệp
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Input
              name="gia"
              label="Giá bán ưu đãi (VNĐ)"
              type="number"
              value={formValues.gia}
              onChange={(e) =>
                setFormValues({ ...formValues, gia: e.target.value })
              }
              error={formErrors.gia}
              required
            />
            <Input
              name="giaGoc"
              label="Giá gốc niêm yết (VNĐ)"
              type="number"
              value={formValues.giaGoc}
              onChange={(e) =>
                setFormValues({ ...formValues, giaGoc: e.target.value })
              }
              error={formErrors.giaGoc}
              required
            />
          </div>

          <Input
            name="hinhAnh"
            label="URL Ảnh bìa hoặc tải tệp từ máy"
            value={formValues.hinhAnh}
            onChange={(e) =>
              setFormValues({ ...formValues, hinhAnh: e.target.value })
            }
            error={formErrors.hinhAnh}
            required
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "6px",
              marginBottom: "12px",
              padding: "8px 12px",
              borderRadius: "8px",
              background: "var(--bg-alt)",
              border: "1px dashed var(--border-gold)",
            }}
          >
            <label
              htmlFor="inv-upload-file"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.84rem",
                color: "var(--primary)",
              }}
            >
              <Icon name="upload" size={15} />
              <span>
                {isUploading ? "Đang tải ảnh lên..." : "Tải ảnh bìa thiệp từ máy"}
              </span>
              <input
                id="inv-upload-file"
                name="invFile"
                type="file"
                accept="image/*"
                aria-invalid={false}
                aria-describedby="desc-inv-upload"
                onChange={handleUploadCover}
                style={{ display: "none" }}
              />
            </label>
            <span id="desc-inv-upload" className="sr-only">
              Tải ảnh bìa mẫu thiệp từ máy tính
            </span>
          </div>

          <div className="input-field-group">
            <label className="input-label" htmlFor="inv-mota">
              Mô tả mẫu thiệp
            </label>
            <textarea
              id="inv-mota"
              name="moTa"
              className="input-control"
              rows={2}
              value={formValues.moTa}
              aria-invalid={Boolean(formErrors.moTa)}
              aria-describedby={formErrors.moTa ? "err-inv-mota" : "desc-inv-mota"}
              onChange={(e) =>
                setFormValues({ ...formValues, moTa: e.target.value })
              }
              required
            />
            <span id="desc-inv-mota" className="sr-only">
              Nhập đoạn giới thiệu đặc điểm mẫu thiệp
            </span>
            {formErrors.moTa && (
              <p id="err-inv-mota" role="alert" className="input-error-msg">
                {formErrors.moTa}
              </p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "16px",
            }}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => setFormOpen(false)}
              disabled={isBusy}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" isLoading={isBusy}>
              {editingItem ? "Lưu Thay Đổi" : "Tạo Mẫu Thiệp"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deleteTemplateTarget)}
        onClose={() => setDeleteTemplateTarget(null)}
        onConfirm={handleConfirmDeleteTemplate}
        title="Xóa Mẫu Thiệp Khỏi Kho"
        message={
          deleteTemplateTarget
            ? `Bạn có chắc chắn muốn xóa mẫu thiệp "${deleteTemplateTarget.ten}" khỏi hệ thống?`
            : ""
        }
        isLoading={isBusy}
      />

      <ConfirmModal
        isOpen={Boolean(deleteSharedTarget)}
        onClose={() => setDeleteSharedTarget(null)}
        onConfirm={handleConfirmDeleteShared}
        title="Gỡ Đường Dẫn Thiệp Công Khai"
        message={
          deleteSharedTarget
            ? `Gỡ thiệp công khai của cặp đôi "${deleteSharedTarget.tenChuRe} & ${deleteSharedTarget.tenCoDau}"?`
            : ""
        }
        isLoading={isBusy}
      />
    </div>
  );
}
