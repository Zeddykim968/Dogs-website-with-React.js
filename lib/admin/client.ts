/**
 * Small JSON fetch helper for admin client components.
 * Never throws — always resolves with ok/status/data.
 */

export type ApiResult<T = Record<string, unknown>> = {
  ok: boolean;
  status: number;
  data: T & { error?: string };
};

export async function apiSend<T = Record<string, unknown>>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(path, {
      method: options.method ?? "GET",
      headers:
        options.body !== undefined
          ? { "Content-Type": "application/json" }
          : undefined,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    const data = (await response.json().catch(() => ({}))) as T & {
      error?: string;
    };

    return { ok: response.ok, status: response.status, data };
  } catch {
    return {
      ok: false,
      status: 0,
      data: { error: "Network error — try again." } as T & { error?: string },
    };
  }
}
