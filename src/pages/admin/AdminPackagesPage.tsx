import { useState } from "react";
import { useFetch } from "../../lib/useFetch";
import { goiCuoiListSchema } from "../../features/packages/types";
import { dichVuListSchema } from "../../features/services/types";
import { GoiCuoi } from "../../features/packages/types";
import { formatCurrency, getStyleLabel } from "../../lib/formatters";
import { PackageFormModal } from "../../features/packages/components/PackageFormModal";
import { ConfirmModal } from "../../components/common/Modal";
import { Button } from "../../components/common/UI";
import { Icon } from "../../components/common/Icon";
import { Skeleton } from "../../components/common/UI";
import { useToastStore } from "../../lib/toastStore";
import { SupabaseService } from "../../lib/supabaseAdapter";
import { assertNever } from "../../lib/types";

export function AdminPackagesPage() {
  const addToast = useToastStore((s) => s.addToast);
  const { state: packagesState, refetch } = useFetch("/api/goi-cuoi", goiCuoiListSchema);
  const { state: servicesState } = useFetch("/api/dich-vu", dichVuListSchema);

  const [formOpen, setFormOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<GoiCuoi | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GoiCuoi | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const allServices = servicesState.status === "success" ? servicesState.data : [];

  const handleOpenCreate = () => { setEditingPkg(null); setFormOpen(true); };
  const handleOpenEdit = (pkg: GoiCuoi) => { setEditingPkg(pkg); setFormOpen(true); };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      let ok = await SupabaseService.deletePackage(deleteTarget.id);
      if (!ok) {
        const res = await fetch(`/api/goi-cuoi/${deleteTarget.id}`, { method: "DELETE" });
        if (res.ok) ok = true;
      }
      addToast(`Đã xóa gói cưới "${deleteTarget.ten}"!`, "success");
      setDeleteTarget(null);
      refetch();
    } catch {
      addToast("Lỗi khi xóa gói cưới", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-services-root">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản Lý Gói Cưới Combo</h1>
          <p className="admin-page-desc">Thiết lập các gói combo hôn lễ hoàng triều và định giá ưu đãi</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Icon name="plus" size={18} />} onClick={handleOpenCreate}>
          Tạo Gói Cưới Mới
        </Button>
      </div>

      <div className="admin-card-table-wrapper">
        {(() => {
          switch (packagesState.status) {
            case "loading":
              return (
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height="52px" />)}
                </div>
              );
            case "error":
              return (
                <div className="error-box" style={{ margin: "32px auto", maxWidth: "460px" }}>
                  <p>{packagesState.message}</p>
                  <Button variant="secondary" size="sm" onClick={refetch}>Thử lại</Button>
                </div>
              );
            case "success":
              return (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>Hình Ảnh</th>
                      <th>Tên Gói Cưới</th>
                      <th>Phong Cách</th>
                      <th>Số Dịch Vụ</th>
                      <th>Giá Trọn Gói</th>
                      <th style={{ textAlign: "right" }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packagesState.data.map((pkg) => (
                      <tr key={pkg.id}>
                        <td><img src={pkg.hinhAnh} alt={pkg.ten} className="table-thumb" /></td>
                        <td className="fw-bold">{pkg.ten}</td>
                        <td>
                          <span className={`status-pill status-${pkg.phongCach === "cung-dinh" ? "warning" : "info"}`}>
                            {getStyleLabel(pkg.phongCach)}
                          </span>
                        </td>
                        <td>{pkg.danhSachDichVuIds.length} dịch vụ</td>
                        <td className="text-primary fw-bold">{formatCurrency(pkg.giaTronGoi)}</td>
                        <td>
                          <div className="table-actions">
                            <button type="button" className="action-icon-btn edit-btn" onClick={() => handleOpenEdit(pkg)} aria-label={`Sửa gói ${pkg.ten}`} title="Chỉnh sửa">
                              <Icon name="edit" size={17} />
                            </button>
                            <button type="button" className="action-icon-btn delete-btn" onClick={() => setDeleteTarget(pkg)} aria-label={`Xóa gói ${pkg.ten}`} title="Xóa gói cưới">
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
              return assertNever(packagesState);
          }
        })()}
      </div>

      <PackageFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} pkg={editingPkg} allServices={allServices} onSuccess={refetch} />
      <ConfirmModal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} title="Xác Nhận Xóa Gói Cưới" message={`Bạn có chắc chắn muốn xóa vĩnh viễn gói cưới "${deleteTarget?.ten}" không?`} isLoading={isDeleting} />
    </div>
  );
}
