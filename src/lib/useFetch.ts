import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { AsyncState } from "./types";
import { SupabaseService } from "./supabaseAdapter";

export function useFetch<T>(url: string, schema: z.ZodType<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setState({ status: "loading" });

      // 1. Thử tải dữ liệu từ Supabase Cloud trước
      try {
        let supabaseData: unknown = null;

        if (url === "/api/admin/thong-ke") {
          supabaseData = await SupabaseService.getAdminStats();
        } else if (url.startsWith("/api/yeu-cau")) {
          const matchFilter = url.match(/[?&]trangThai=([^&]+)/);
          const filter = matchFilter ? matchFilter[1] : undefined;
          supabaseData = await SupabaseService.getRequests(filter);
        } else if (url.startsWith("/api/dich-vu")) {
          supabaseData = await SupabaseService.getServices();
        } else if (url.startsWith("/api/goi-cuoi")) {
          supabaseData = await SupabaseService.getPackages();
        } else if (url.startsWith("/api/thiep-cuoi")) {
          supabaseData = await SupabaseService.getInvitations();
        } else if (url.startsWith("/api/admin/users")) {
          supabaseData = await SupabaseService.getUsers();
        }

        if (supabaseData) {
          const parsed = schema.safeParse(supabaseData);
          if (parsed.success) {
            setState({ status: "success", data: parsed.data });
            return;
          }
        }
      } catch {
        // Tiếp tục fallback bên dưới
      }

      // 2. Fallback sang HTTP Fetch thông thường (Khi chạy Node server cục bộ)
      try {
        const response = await fetch(url, { signal });

        // Bảo vệ chống lỗi HTML trên Vercel: Nếu Vercel rewrite về index.html thì không parse JSON
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("text/html")) {
          // Nếu nhận về HTML do Vercel SPA rewrite, lấy dữ liệu mặc định từ adapter
          if (url === "/api/admin/thong-ke") {
            const stats = await SupabaseService.getAdminStats();
            setState({ status: "success", data: stats as unknown as T });
            return;
          }
          if (url.startsWith("/api/yeu-cau")) {
            const requests = await SupabaseService.getRequests();
            setState({ status: "success", data: requests as unknown as T });
            return;
          }
          throw new Error("Không thể kết nối API máy chủ");
        }

        if (!response.ok) {
          throw new Error(`Yêu cầu thất bại với mã lỗi HTTP ${response.status}`);
        }

        const raw: unknown = await response.json();
        const parsed = schema.safeParse(raw);

        if (!parsed.success) {
          const errMsg = parsed.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; ");
          setState({
            status: "error",
            message: `Dữ liệu không khớp định dạng: ${errMsg}`,
          });
          return;
        }

        setState({ status: "success", data: parsed.data });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi không xác định khi tải dữ liệu";
        setState({ status: "error", message });
      }
    },
    [url, schema]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { state, refetch };
}
