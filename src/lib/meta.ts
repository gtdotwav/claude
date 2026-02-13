export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function getBaseUrlFromRequest(req: Request): string {
  const url = new URL(req.url);
  // Prefer explicit BASE_URL (prod), otherwise infer from request
  return process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`;
}
