import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistCategory = "dich-vu" | "goi-cuoi" | "thiep-cuoi";

export interface WishlistItem {
  id: string;
  ten: string;
  gia: number;
  hinhAnh: string;
  phanLoai: WishlistCategory;
  duongDan: string;
  phuDe?: string;
}

export interface ComparePackageItem {
  id: string;
  ten: string;
  moTa: string;
  giaTronGoi: number;
  danhSachDichVuIds: string[];
  phongCach: string;
  hinhAnh: string;
  isTop?: boolean;
}

interface WishlistAndCompareStore {
  wishlist: WishlistItem[];
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlistDrawer: () => void;
  toggleWishlistItem: (item: WishlistItem) => boolean;
  removeWishlistItem: (id: string) => void;
  clearWishlist: () => void;
  isWishlisted: (id: string) => boolean;

  comparePackages: ComparePackageItem[];
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
  toggleComparePackage: (pkg: ComparePackageItem) => "added" | "removed" | "limit";
  removeComparePackage: (id: string) => void;
  clearComparePackages: () => void;

  isCommandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
}

export const MAX_COMPARE_PACKAGES = 3;

export const useWishlistStore = create<WishlistAndCompareStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      isWishlistOpen: false,

      openWishlist: () => set({ isWishlistOpen: true }),
      closeWishlist: () => set({ isWishlistOpen: false }),
      toggleWishlistDrawer: () => set((s) => ({ isWishlistOpen: !s.isWishlistOpen })),

      toggleWishlistItem: (item) => {
        const exists = get().wishlist.some((w) => w.id === item.id);
        if (exists) {
          set((s) => ({ wishlist: s.wishlist.filter((w) => w.id !== item.id) }));
          return false;
        }
        set((s) => ({ wishlist: [item, ...s.wishlist] }));
        return true;
      },

      removeWishlistItem: (id) =>
        set((s) => ({ wishlist: s.wishlist.filter((w) => w.id !== id) })),

      clearWishlist: () => set({ wishlist: [] }),

      isWishlisted: (id) => get().wishlist.some((w) => w.id === id),

      comparePackages: [],
      isCompareModalOpen: false,

      openCompareModal: () => set({ isCompareModalOpen: true }),
      closeCompareModal: () => set({ isCompareModalOpen: false }),

      toggleComparePackage: (pkg) => {
        const current = get().comparePackages;
        const exists = current.some((p) => p.id === pkg.id);
        if (exists) {
          set({ comparePackages: current.filter((p) => p.id !== pkg.id) });
          return "removed";
        }
        if (current.length >= MAX_COMPARE_PACKAGES) {
          return "limit";
        }
        set({ comparePackages: [...current, pkg] });
        return "added";
      },

      removeComparePackage: (id) =>
        set((s) => ({ comparePackages: s.comparePackages.filter((p) => p.id !== id) })),

      clearComparePackages: () => set({ comparePackages: [], isCompareModalOpen: false }),

      isCommandPaletteOpen: false,
      openCommandPalette: () => set({ isCommandPaletteOpen: true }),
      closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
      toggleCommandPalette: () =>
        set((s) => ({ isCommandPaletteOpen: !s.isCommandPaletteOpen })),
    }),
    {
      name: "hue-cung-dinh-wishlist-storage",
      partialize: (state) => ({
        wishlist: state.wishlist,
        comparePackages: state.comparePackages,
      }),
    }
  )
);
