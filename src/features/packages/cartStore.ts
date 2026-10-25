import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useToastStore } from "../../lib/toastStore";

export interface CartItem {
  id: string;
  ten: string;
  gia: number;
  giaTronGoi?: number;
  hinhAnh: string;
  phongCach?: string;
  loai?: string;
  soLuong: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: {
    id: string;
    ten: string;
    gia?: number;
    giaTronGoi?: number;
    hinhAnh: string;
    phongCach?: string;
    loai?: string;
    soLuong?: number;
  }) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (item) =>
        set((state) => {
          const itemPrice = item.gia ?? item.giaTronGoi ?? 0;
          const existingIndex = state.items.findIndex((i) => i.id === item.id);

          if (existingIndex > -1) {
            // Tăng số lượng nếu sản phẩm đã có trong giỏ
            const updated = [...state.items];
            const current = updated[existingIndex];
            if (current) {
              updated[existingIndex] = {
                ...current,
                soLuong: (current.soLuong || 1) + (item.soLuong || 1),
              };
            }
            return { items: updated };
          }

          // Thêm sản phẩm mới vào giỏ mà không tự bung Drawer gây gián đoạn duyệt sản phẩm
          const newItem: CartItem = {
            id: item.id,
            ten: item.ten,
            gia: itemPrice,
            giaTronGoi: itemPrice,
            hinhAnh: item.hinhAnh,
            phongCach: item.phongCach,
            loai: item.loai,
            soLuong: item.soLuong || 1,
          };
          return { items: [...state.items, newItem] };
        }),

      updateQuantity: (id, delta) =>
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = (item.soLuong || 1) + delta;
                return newQty > 0 ? { ...item, soLuong: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);
          return { items: updated };
        }),

      removeItem: (id) => {
        const itemToRemove = get().items.find((i) => i.id === id);
        if (itemToRemove) {
          useToastStore.getState().addToast(
            `Đã xóa dịch vụ "${itemToRemove.ten}" khỏi giỏ dịch vụ cưới!`,
            "info",
            5000
          );
        }
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.gia * (item.soLuong || 1), 0);
      },
    }),
    {
      name: "hue-cung-dinh-cart-storage",
    }
  )
);
