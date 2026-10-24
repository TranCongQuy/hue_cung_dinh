import { useState } from "react";
import { useFetch } from "../../lib/useFetch";
import { dichVuListSchema } from "../../features/services/types";
import { DichVu } from "../../features/services/types";
import { formatCurrency, getCategoryLabel } from "../../lib/formatters";
import { ServiceFormModal } from "../../features/services/components/ServiceFormModal";
import { ConfirmModal } from "../../components/common/Modal";
import { Button } from "../../components/common/UI";
import { Icon } from "../../components/common/Icon";
import { Skeleton } from "../../components/common/UI";
import { useToastStore } from "../../lib/toastStore";
import { assertNever } from "../../lib/types";
import "./AdminServicesPage.css";

export function AdminServicesPage() {
  const addToast = useToastStore((s) => s.addToast);
  const { state, refetch } = useFetch("/api/dich-vu", dichVuListSchema);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<DichVu | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DichVu | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenCreate = () => { setEditingService(null); setFormModalOpen(true); };
  const handleOpenEdit = (svc: DichVu) => { setEditingService(svc); setFormModalOpen(true); };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/dich-vu/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Xóa không thành công");
      addToast(`Đã xóa dịch vụ "${deleteTarget.ten}"!`, "success");
      setDeleteTarget(null);
      refetch();
    } catch {
      addToast("Lỗi khi xóa dịch vụ", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-services-root">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản Lý Dịch Vụ Lẻ</h1>
          <p className="admin-page-desc">Danh mục các hạng mục áo dài, thợ ảnh, địa điểm và trang trí cung đình</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Icon name="plus" size={18} />} onClick={handleOpenCreate}>
          Thêm Dịch Vụ Mới
        </Button>
      </div>

      <div className="admin-card-table-wrapper">
        {(() => {
          switch (state.status) {
            case "loading":
              return (
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height="52px" />)}
                </div>
              );
            case "error":
              return (
                <div className="error-box" style={{ margin: "32px auto", maxWidth: "460px" }}>
                  <p>{state.message}</p>
                  <Button variant="secondary" size="sm" onClick={refetch}>Thử lại</Button>
                </div>
              );
            case "success":
              return (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>Hình Ảnh</th>
                      <th>Tên Dịch Vụ</th>
                      <th>Phân Loại</th>
                      <th>Đơn Giá</th>
                      <th>Mô Tả</th>
                      <th style={{ textAlign: "right" }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.data.map((svc) => (
                      <tr key={svc.id}>
                        <td><img src={svc.hinhAnh} alt={svc.ten} className="table-thumb" /></td>
                        <td className="fw-bold">{svc.ten}</td>
                        <td><span className="service-category-tag">{getCategoryLabel(svc.loai)}</span></td>
                        <td className="text-primary fw-bold">{formatCurrency(svc.gia)}</td>
                        <td className="table-desc-cell">{svc.moTa}</td>
                        <td>
                          <div className="table-actions">
                            <button type="button" className="action-icon-btn edit-btn" onClick={() => handleOpenEdit(svc)} aria-label={`Sửa ${svc.ten}`} title="Chỉnh sửa">
                              <Icon name="edit" size={17} />
                            </button>
                            <button type="button" className="action-icon-btn delete-btn" onClick={() => setDeleteTarget(svc)} aria-label={`Xóa ${svc.ten}`} title="Xóa dịch vụ">
                              <Icon name="trash" size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            default:
              return assertNever(state);
          }
        })()}
      </div>

      <ServiceFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} service={editingService} onSuccess={refetch} />
      <ConfirmModal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} title="Xác Nhận Xóa Dịch Vụ" message={`Bạn có chắc chắn muốn xóa vĩnh viễn dịch vụ "${deleteTarget?.ten}" không?`} isLoading={isDeleting} />
    </div>
  );
}
