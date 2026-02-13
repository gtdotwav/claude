import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

/**
 * Instagram Webhook endpoint
 * - GET: verification handshake
 * - POST: receive message events
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  const expected = process.env.META_WEBHOOK_VERIFY_TOKEN;

  if (mode === 'subscribe' && token && expected && token === expected) {
    return new NextResponse(challenge || '', { status: 200 });
  }

  return NextResponse.json({ error: 'Webhook verify failed' }, { status: 403 });
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as any;

    // Persist raw payload for now (MVP). We’ll normalize later.
    const supabase = getSupabaseServerClient();
    if (supabase) {
      await supabase.from('ig_webhook_events').insert({
        received_at: new Date().toISOString(),
        payload,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
