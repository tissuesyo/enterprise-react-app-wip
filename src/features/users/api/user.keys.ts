/**
 * 集中管理 Query Keys，避免不同地方各自手打字串陣列導致 cache invalidation 對不上。
 * 採用 factory pattern：users.all() 是所有 user 相關 query 的共同前綴。
 */
export const userKeys = {
  all: () => ['users'] as const,
  lists: () => [...userKeys.all(), 'list'] as const,
};
