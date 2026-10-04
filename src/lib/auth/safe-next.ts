export function safeNext(target: string | null | undefined, fallback = "/dashboard"): string {
  if (!target) return fallback;
  if (/^\/(?!\/)/.test(target)) {
    return target;
  }
  return fallback;
}
