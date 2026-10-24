/**
 * Trạng thái bất đồng bộ Discriminated Union chuẩn mực
 * Bắt buộc render bằng switch-case có exhaustive check (never)
 */
export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

/**
 * Hàm kiểm tra vét cạn (Exhaustive Check)
 * Đảm bảo mọi nhánh của discriminated union đều được xử lý lúc compile time
 */
export function assertNever(x: never): never {
  throw new Error(`Trạng thái không xác định: ${JSON.stringify(x)}`);
}

