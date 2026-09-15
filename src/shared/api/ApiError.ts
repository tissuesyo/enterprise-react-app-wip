/**
 * 統一的 API 錯誤型別。
 * 為什麼要自訂而不是直接丟 AxiosError：
 * - UI 層（React Query onError / try-catch）不應該知道底層用的是 Axios，
 *   之後若要換成其他 HTTP client，UI 程式碼不需要修改。
 * - 把「使用者看得懂的訊息」與「除錯用的細節」分開。
 */
export class ApiError extends Error {
  readonly status: number | undefined;
  readonly code: string | undefined;
  readonly details: unknown;

  constructor(params: {
    message: string;
    status?: number;
    code?: string;
    details?: unknown;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}
