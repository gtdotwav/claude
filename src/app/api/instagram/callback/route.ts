import { NextResponse } from 'next/server';
import { getBaseUrlFromRequest, requireEnv } from '@/lib/meta';
import { getSupabaseServerClient } from '@/lib/supabase-server';

/**
 * Instagram Connect (official) — OAuth callback
 * GET /api/instagram/callback?code=...&state=...
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  try {
    const appId = requireEnv('META_APP_ID');
    const appSecret = requireEnv('META_APP_SECRET');
    const redirectUri = `${getBaseUrlFromRequest(req)}/api/instagram/callback`;

    // 1) Exchange code → short-lived user access token
    const tokenUrl = new URL('https://graph.facebook.com/v21.0/oauth/access_token');
    tokenUrl.searchParams.set('client_id', appId);
    tokenUrl.searchParams.set('client_secret', appSecret);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const tokenRes = await fetch(tokenUrl.toString(), { method: 'GET' });
    const tokenJson = (await tokenRes.json()) as any;
    if (!tokenRes.ok) {
      throw new Error(tokenJson?.error?.message || 'Token exchange failed');
    }

    const userAccessToken = tokenJson.access_token as string;

    // 2) Fetch pages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${encodeURIComponent(
        userAccessToken
      )}`
    );
    const pagesJson = (await pagesRes.json()) as any;
    if (!pagesRes.ok) {
      throw new Error(pagesJson?.error?.message || 'Failed to fetch pages');
    }

    // This is a simplified “first page” pick. In production we should let the user select.
    const page = pagesJson?.data?.[0];
    if (!page?.id || !page?.access_token) {
      throw new Error('No Facebook Page found for this user');
    }

    const pageId = page.id as string;
    const pageAccessToken = page.access_token as string;

    // 3) Get IG business account id from page
    const igRes = await fetch(
      `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${encodeURIComponent(
        pageAccessToken
      )}`
    );
    const igJson = (await igRes.json()) as any;
    if (!igRes.ok) {
      throw new Error(igJson?.error?.message || 'Failed to fetch IG business account');
    }

    const igBusinessAccountId = igJson?.instagram_business_account?.id as
      | string
      | undefined;

    // 4) Persist (optional)
    const supabase = getSupabaseServerClient();
    if (supabase) {
      await supabase.from('ig_accounts').upsert(
        {
          page_id: pageId,
          ig_business_account_id: igBusinessAccountId || null,
          page_access_token: pageAccessToken,
          user_access_token: userAccessToken,
          status: 'active',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'page_id' }
      );
    }

    // 5) Redirect back to app
    const appBase = getBaseUrlFromRequest(req);
    return NextResponse.redirect(`${appBase}/inbox?connected=1`);
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : 'Callback failed',
        hint:
          'Verify META_APP_ID/META_APP_SECRET and that your Meta App redirect URI matches /api/instagram/callback',
      },
      { status: 400 }
    );
  }
}
