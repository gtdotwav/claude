import { NextResponse } from 'next/server';
import { getBaseUrlFromRequest, requireEnv } from '@/lib/meta';

/**
 * Instagram Connect (official) — Meta OAuth entry
 * GET /api/instagram/connect
 */
export async function GET(req: Request) {
  try {
    const appId = requireEnv('META_APP_ID');
    const redirectUri = `${getBaseUrlFromRequest(req)}/api/instagram/callback`;

    // Permissions required for Messaging API vary by setup.
    // Start with messaging + page metadata. Adjust after Meta review.
    const scope = [
      'pages_manage_metadata',
      'pages_read_engagement',
      'instagram_manage_messages',
      'business_management',
    ].join(',');

    const state = crypto.randomUUID();

    const authUrl = new URL('https://www.facebook.com/v21.0/dialog/oauth');
    authUrl.searchParams.set('client_id', appId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scope);

    // NOTE: In production, persist and validate state.
    return NextResponse.redirect(authUrl.toString());
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? e.message
            : 'Instagram connect not configured',
        hint:
          'Set META_APP_ID and META_APP_SECRET in env vars. Then configure the redirect URL in Meta as /api/instagram/callback',
      },
      { status: 400 }
    );
  }
}
