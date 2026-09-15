import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { env } from '@/app/config/env';
import { ApiError } from '@/shared/api/ApiError';

/**
 * 共用 Axios instance。
 * 規則：整個專案只有這個檔案可以直接 import axios / 呼叫 axios.create。
 * React 元件與 Feature API 一律透過這裡導出的 `apiClient` 發送請求，
 * 這樣「加 Authorization header」「統一錯誤格式」只需要維護一個地方。
 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Token 取得方式由 AuthProvider 在啟動時注入，
 * apiClient 本身不知道、也不需要知道目前是 mock auth 還是 Keycloak，
 * 這樣可以避免 shared/api 與 shared/auth 互相 import 造成循環依賴。
 */
let getAccessToken: () => string | undefined = () => undefined;

export function setAccessTokenGetter(getter: () => string | undefined): void {
  getAccessToken = getter;
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    return Promise.reject(toApiError(error));
  },
);

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const status = axiosError.response?.status;
    const serverMessage = axiosError.response?.data?.message;

    if (axiosError.code === 'ERR_CANCELED') {
      return new ApiError({ message: '請求已取消', code: 'CANCELED', status });
    }

    if (!axiosError.response) {
      return new ApiError({
        message: '無法連線到伺服器，請確認網路連線後再試一次。',
        code: 'NETWORK_ERROR',
      });
    }

    return new ApiError({
      message: serverMessage ?? `伺服器回應錯誤（HTTP ${status ?? 'unknown'}）`,
      status,
      code: axiosError.response.data?.code,
      details: axiosError.response.data,
    });
  }

  return new ApiError({
    message: error instanceof Error ? error.message : '發生未知錯誤',
  });
}

/** Request 沒有內容（例如 204 No Content）時，統一回傳 undefined 而不是丟例外。 */
export function unwrapNoContent<T>(data: T | '' | null | undefined): T | undefined {
  if (data === '' || data === null || data === undefined) return undefined;
  return data;
}

export type { AxiosRequestConfig };
