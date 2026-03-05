const store = new Map<string, { count: number; resetAt: number }>();
const MAX_STORE_SIZE = 10_000;

function pruneExpired() {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now > entry.resetAt) store.delete(key);
  });
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  if (store.size > MAX_STORE_SIZE) pruneExpired();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}
