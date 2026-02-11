'use client';

const DEFAULT_API = 'http://localhost:3001/api/v1';

export function apiClient(baseUrl: string = DEFAULT_API) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  const f = async (path: string, opts: RequestInit = {}): Promise<any> => {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        ...opts,
        headers: { ...headers, ...(opts.headers as Record<string, string>) },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    } catch (e) {
      console.error(`API Error: ${path}`, e);
      return null;
    }
  };

  return {
    accounts: {
      list: () => f('/instagram/accounts'),
      get: (id: string) => f(`/instagram/accounts/${id}`),
      connect: (data: {
        companyId: string;
        fbPageId: string;
        shortLivedToken: string;
        connectedBy: string;
      }) =>
        f('/instagram/accounts/connect', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      update: (id: string, data: any) =>
        f(`/instagram/accounts/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        }),
      refreshToken: (id: string) =>
        f(`/instagram/accounts/${id}/refresh-token`, { method: 'POST' }),
      disconnect: (id: string) =>
        f(`/instagram/accounts/${id}/disconnect`, { method: 'POST' }),
    },
    comments: {
      list: (params: Record<string, string>) =>
        f(`/instagram/comments?${new URLSearchParams(params)}`),
      reply: (id: string, data: any) =>
        f(`/instagram/comments/${id}/reply`, {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      hide: (id: string) =>
        f(`/instagram/comments/${id}/hide`, { method: 'POST' }),
      stats: () => f('/instagram/comments/stats'),
    },
    rules: {
      list: () => f('/instagram/auto-reply'),
      create: (data: any) =>
        f('/instagram/auto-reply', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      update: (id: string, data: any) =>
        f(`/instagram/auto-reply/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        }),
      toggle: (id: string) =>
        f(`/instagram/auto-reply/${id}/toggle`, { method: 'PATCH' }),
      delete: (id: string) =>
        f(`/instagram/auto-reply/${id}`, { method: 'DELETE' }),
    },
    flows: {
      list: () => f('/instagram/flows'),
      create: (data: any) =>
        f('/instagram/flows', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      sessions: () => f('/instagram/flows/sessions'),
      takeover: (id: string) =>
        f(`/instagram/flows/sessions/${id}/takeover`, { method: 'POST' }),
    },
    dashboard: {
      overview: () => f('/instagram/dashboard/overview'),
      realtime: () => f('/instagram/dashboard/realtime'),
    },
  };
}

export { DEFAULT_API };
