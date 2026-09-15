/**
 * 集中管理日期時間格式與時區策略。
 * 為什麼要集中：DateTimeCellRenderer、表單、任何顯示日期的地方都應該用同一套規則，
 * 不然「同一個系統裡日期格式長得不一樣」會是很常見又煩人的 bug。
 *
 * 策略：一律以瀏覽器所在時區顯示（Intl API 預設行為）。
 * 後端 API 回傳的時間字串必須是 ISO 8601（帶時區資訊，例如 UTC 的 "Z" 結尾），
 * 前端不做任何時區換算假設，直接交給 Intl.DateTimeFormat 處理。
 */
const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function formatDateTime(value: string | number | Date | null | undefined): string | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return DATE_TIME_FORMATTER.format(date);
}
