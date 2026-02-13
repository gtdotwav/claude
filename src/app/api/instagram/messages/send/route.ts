import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

/**
 * Send a message reply via Meta Graph.
 * POST /api/instagram/messages/send
 * Body: { pageId: string; recipientId: string; text: string }
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      pageId?: string;
      recipientId?: string;
      text?: string;
    };

    const { pageId, recipientId, text } = body;

    if (!pageId || !recipientId || !text) {
      return NextResponse.json(
        { error: 'Missing pageId, recipientId or text' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        {
          error: 'Supabase not configured on server',
          hint:
            'Set SUPABASE_SERVICE_ROLE_KEY (recommended) so the server can read tokens',
        },
        { status: 501 }
      );
    }

    const { data } = await supabase
      .from('ig_accounts')
      .select('page_access_token')
      .eq('page_id', pageId)
      .maybeSingle();

    const pageAccessToken = (data as any)?.page_access_token as string | undefined;
    if (!pageAccessToken) {
      return NextResponse.json(
        { error: 'No token found for this pageId. Connect account first.' },
        { status: 400 }
      );
    }

    const endpoint = `https://graph.facebook.com/v21.0/${pageId}/messages`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        messaging_type: 'RESPONSE',
        message: { text },
        access_token: pageAccessToken,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: json?.error?.message || 'Failed to send message', details: json },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, data: json });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal error' },
      { status: 500 }
    );
  }
}
