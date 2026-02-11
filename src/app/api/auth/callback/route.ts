import { NextRequest, NextResponse } from 'next/server';

/**
 * Instagram OAuth Callback
 *
 * Receives the authorization code from Instagram,
 * exchanges it for access tokens, fetches profile info,
 * and sends postMessage back to the opener window.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const errorParam = searchParams.get('error');
  const errorReason = searchParams.get('error_reason');
  const origin = request.nextUrl.origin;

  const META_APP_ID = process.env.META_APP_ID || '';
  const META_APP_SECRET = process.env.META_APP_SECRET || '';
  const REDIRECT_URI =
    process.env.INSTAGRAM_REDIRECT_URI ||
    `${origin}/api/auth/callback`;

  // Handle error from Instagram
  if (errorParam) {
    return returnResultPage(origin, {
      status: 'error',
      message: errorReason === 'user_denied'
        ? 'Voce negou a autorizacao. Feche e tente novamente.'
        : `Erro: ${errorParam}`,
    });
  }

  // No code received
  if (!code) {
    return returnResultPage(origin, {
      status: 'error',
      message: 'Nenhum codigo de autorizacao recebido.',
    });
  }

  // Validate state (CSRF protection)
  const storedState = request.cookies.get('ig_oauth_state')?.value;
  if (state && storedState && state !== storedState) {
    return returnResultPage(origin, {
      status: 'error',
      message: 'Token de seguranca invalido. Tente novamente.',
    });
  }

  // No App Secret → can't exchange token
  if (!META_APP_SECRET) {
    return returnResultPage(origin, {
      status: 'error',
      message: 'META_APP_SECRET nao configurado no .env.local',
    });
  }

  try {
    // Step 1: Exchange code for short-lived token
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: META_APP_ID,
        client_secret: META_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.json().catch(() => ({}));
      throw new Error(err.error_message || `Token exchange failed (${tokenRes.status})`);
    }

    const tokenData = await tokenRes.json();
    const shortToken = tokenData.access_token;
    const userId = tokenData.user_id;

    // Step 2: Exchange for long-lived token (60 days)
    const longTokenRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${META_APP_SECRET}&access_token=${shortToken}`
    );

    let longToken = shortToken;
    if (longTokenRes.ok) {
      const longData = await longTokenRes.json();
      longToken = longData.access_token || shortToken;
    }

    // Step 3: Fetch user profile
    const profileRes = await fetch(
      `https://graph.instagram.com/v19.0/${userId}?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${longToken}`
    );

    let profile = { username: `user_${userId}`, name: '', profile_picture_url: '', followers_count: 0 };
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      profile = {
        username: profileData.username || profile.username,
        name: profileData.name || profileData.username || '',
        profile_picture_url: profileData.profile_picture_url || '',
        followers_count: profileData.followers_count || 0,
      };
    }

    // Success!
    return returnResultPage(origin, {
      status: 'success',
      username: `@${profile.username}`,
      name: profile.name,
      accountId: String(userId),
      profilePic: profile.profile_picture_url,
      followers: profile.followers_count,
      // Note: In production, store longToken securely in your database
      // token: longToken  (don't send to frontend)
    });
  } catch (err: any) {
    return returnResultPage(origin, {
      status: 'error',
      message: err.message || 'Erro ao conectar com Instagram',
    });
  }
}

interface ResultData {
  status: 'success' | 'error';
  message?: string;
  username?: string;
  name?: string;
  accountId?: string;
  profilePic?: string;
  followers?: number;
}

function returnResultPage(origin: string, data: ResultData) {
  const isSuccess = data.status === 'success';

  const postMessagePayload = isSuccess
    ? `{
        type: 'instagram-auth-success',
        username: '${data.username || ''}',
        name: '${data.name || ''}',
        accountId: '${data.accountId || ''}',
        profilePic: '${data.profilePic || ''}',
        followers: ${data.followers || 0}
      }`
    : `{
        type: 'instagram-auth-error',
        message: '${(data.message || '').replace(/'/g, "\\'")}'
      }`;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isSuccess ? 'Instagram Conectado!' : 'Erro'}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#050508;font-family:system-ui,-apple-system,sans-serif;color:rgba(255,255,255,0.6)}
    .c{text-align:center;max-width:360px;padding:2rem}
    .logo{width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#833AB4,#E1306C,#F77737);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;box-shadow:0 8px 32px rgba(225,48,108,0.3)}
    .spinner{width:32px;height:32px;margin:0 auto 1rem;animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .icon{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem}
    .ok{background:rgba(34,197,94,0.1);border:2px solid rgba(34,197,94,0.3)}
    .err{background:rgba(239,68,68,0.1);border:2px solid rgba(239,68,68,0.3)}
    .msg{font-size:0.9rem;font-weight:500}
    .msg-ok{color:#22c55e}
    .msg-err{color:#ef4444}
    .sub{color:rgba(255,255,255,0.25);font-size:0.75rem;margin-top:0.75rem}
    .user{margin-top:0.5rem;font-size:0.95rem;color:#fff;font-weight:600}
    .bar{width:200px;height:3px;background:rgba(255,255,255,0.06);border-radius:2px;margin:1.5rem auto 0;overflow:hidden}
    .fill{height:100%;width:0;background:linear-gradient(90deg,#833AB4,#E1306C,#F77737);border-radius:2px;transition:width 0.3s ease}
    .step{font-size:0.7rem;color:rgba(255,255,255,0.2);margin-top:0.75rem;letter-spacing:0.05em}
    .btn{display:inline-block;margin-top:1.5rem;padding:0.6rem 1.5rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:rgba(255,255,255,0.4);font-size:0.8rem;cursor:pointer}
    .hidden{display:none}
  </style>
</head>
<body>
  <div class="c">
    <div class="logo">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    </div>

    <div id="loading">
      <svg class="spinner" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" stroke-width="3" fill="none"/>
        <path d="M4 12a8 8 0 018-8" stroke="#E1306C" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>
      <p class="msg">Conectando...</p>
      <div class="bar"><div class="fill" id="progress"></div></div>
      <p class="step" id="step">Verificando autorizacao...</p>
    </div>

    <div id="result" class="hidden"></div>
  </div>

  <script>
    (function() {
      var origin = '${origin}';
      var isSuccess = ${isSuccess};
      var loadEl = document.getElementById('loading');
      var resultEl = document.getElementById('result');
      var progressEl = document.getElementById('progress');
      var stepEl = document.getElementById('step');

      setTimeout(function() { progressEl.style.width = '40%'; stepEl.textContent = 'Obtendo dados da conta...'; }, 400);
      setTimeout(function() { progressEl.style.width = '80%'; stepEl.textContent = isSuccess ? 'Conta verificada!' : 'Verificando...'; }, 800);
      setTimeout(function() {
        progressEl.style.width = '100%';
        stepEl.textContent = 'Pronto!';
      }, 1100);

      setTimeout(function() {
        loadEl.classList.add('hidden');
        resultEl.classList.remove('hidden');

        if (isSuccess) {
          resultEl.innerHTML = '<div class="icon ok"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>'
            + '<p class="msg msg-ok">Instagram conectado!</p>'
            + '<p class="user">${data.username || ''}</p>'
            + '<p class="sub">Esta janela fechara automaticamente...</p>';
        } else {
          resultEl.innerHTML = '<div class="icon err"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>'
            + '<p class="msg msg-err">${(data.message || '').replace(/'/g, "\\'")}</p>'
            + '<button class="btn" onclick="window.close()">Fechar</button>';
        }

        // Send result to opener
        if (window.opener) {
          window.opener.postMessage(${postMessagePayload}, origin);
        }

        if (isSuccess) {
          setTimeout(function() { window.close(); }, 1500);
        }
      }, 1400);
    })();
  </script>
</body>
</html>`;

  const response = new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });

  // Clear the state cookie
  response.cookies.delete('ig_oauth_state');
  return response;
}
