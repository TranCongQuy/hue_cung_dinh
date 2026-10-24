import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { AsyncState } from "./types";
import { SupabaseService } from "./supabaseAdapter";
import { isSupabaseConfigured } from "./supabase";

export function useFetch<T>(url: string, schema: z.ZodType<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setState({ status: "loading" });

      // 1. Thử tải dữ liệu từ Supabase Cloud trước nếu đã cấu hình
      if (isSupabaseConfigured) {
        try {
          let supabaseData: unknown = null;
          if (url === "/api/dich-vu" || url.startsWith("/api/dich-vu?")) {
            supabaseData = await SupabaseService.getServices();
          } else if (url === "/api/goi-cuoi" || url.startsWith("/api/goi-cuoi?")) {
            supabaseData = await SupabaseService.getPackages();
          } else if (url === "/api/thiep-cuoi" || url.startsWith("/api/thiep-cuoi?")) {
            supabaseData = await SupabaseService.getInvitations();
          } else if (url === "/api/yeu-cau") {
            supabaseData = await SupabaseService.getRequests();
          }

          if (supabaseData) {
            const parsed = schema.safeParse(supabaseData);
            if (parsed.success) {
              setState({ status: "success", data: parsed.data });
              return;
            }
          }
        } catch {
          // Bỏ qua lỗi Supabase, chuyển sang fallback fetch
        }
      }

      // 2. Fallback sang HTTP Fetch thông thường (Mock Server / Local API)
      try {
        const response = await fetch(url, { signal });
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
