import { NextRequest, NextResponse } from 'next/server';

/**
 * Instagram OAuth Entry Point
 *
 * Redirects to Instagram's authorization page.
 * Requires META_APP_ID in .env.local
 */
export async function GET(request: NextRequest) {
  const META_APP_ID = process.env.META_APP_ID || '';
  const REDIRECT_URI =
    process.env.INSTAGRAM_REDIRECT_URI ||
    `${request.nextUrl.origin}/api/auth/callback`;

  // No App ID configured → show setup instructions
  if (!META_APP_ID) {
    return returnSetupPage(request.nextUrl.origin);
  }

  // Generate state for CSRF protection
  const state = crypto.randomUUID();

  // Instagram OAuth authorization URL
  const authUrl = new URL('https://api.instagram.com/oauth/authorize');
  authUrl.searchParams.set('client_id', META_APP_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('scope', 'instagram_basic,instagram_manage_comments,instagram_manage_messages');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', state);

  // Store state in cookie for validation on callback
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set('ig_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });

  return response;
}

/** Returns HTML page with setup instructions when META_APP_ID is not set */
function returnSetupPage(origin: string) {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Configurar Meta App</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#050508;font-family:system-ui,-apple-system,sans-serif;color:rgba(255,255,255,0.7)}
    .c{max-width:440px;padding:2rem}
    .logo{width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#833AB4,#E1306C,#F77737);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;box-shadow:0 8px 24px rgba(225,48,108,0.25)}
    h2{font-size:1.1rem;text-align:center;margin-bottom:0.5rem;color:#fff}
    .sub{text-align:center;font-size:0.8rem;color:rgba(255,255,255,0.35);margin-bottom:2rem}
    .step{display:flex;gap:0.75rem;margin-bottom:1.25rem;align-items:flex-start}
    .num{width:28px;height:28px;border-radius:50%;background:rgba(225,48,108,0.12);border:1px solid rgba(225,48,108,0.25);color:#E1306C;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0;margin-top:2px}
    .step-text{font-size:0.82rem;line-height:1.5}
    .step-text strong{color:#fff}
    code{background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;font-size:0.75rem;font-family:monospace;color:#E1306C}
    a{color:#E1306C;text-decoration:none}
    a:hover{text-decoration:underline}
    .warn{margin-top:1.5rem;padding:0.75rem 1rem;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.15);border-radius:10px;font-size:0.75rem;color:rgba(245,158,11,0.7)}
    .btn{display:block;width:100%;margin-top:1.5rem;padding:0.75rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:rgba(255,255,255,0.4);font-size:0.8rem;font-weight:600;cursor:pointer;text-align:center}
    .btn:hover{background:rgba(255,255,255,0.1)}
  </style>
</head>
<body>
  <div class="c">
    <div class="logo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    </div>
    <h2>Meta App nao configurado</h2>
    <p class="sub">Para conectar seu Instagram, configure o Meta App primeiro</p>

    <div class="step">
      <div class="num">1</div>
      <div class="step-text">Acesse <a href="https://developers.facebook.com" target="_blank">developers.facebook.com</a> e crie um <strong>App tipo Business</strong></div>
    </div>
    <div class="step">
      <div class="num">2</div>
      <div class="step-text">Em Produtos, adicione <strong>Instagram Graph API</strong></div>
    </div>
    <div class="step">
      <div class="num">3</div>
      <div class="step-text">Em Configuracoes &gt; Basico, copie o <strong>App ID</strong> e <strong>App Secret</strong></div>
    </div>
    <div class="step">
      <div class="num">4</div>
      <div class="step-text">No Instagram &gt; Basic Display, adicione como Redirect URI:<br><code>${origin}/api/auth/callback</code></div>
    </div>
    <div class="step">
      <div class="num">5</div>
      <div class="step-text">Edite o arquivo <code>.env.local</code> na raiz do projeto:<br>
        <code>META_APP_ID=seu_app_id</code><br>
        <code>META_APP_SECRET=seu_app_secret</code>
      </div>
    </div>
    <div class="step">
      <div class="num">6</div>
      <div class="step-text">Reinicie o servidor: <code>npm run dev</code></div>
    </div>

    <div class="warn">
      Conta Instagram precisa ser <strong>Business</strong> ou <strong>Creator</strong>, vinculada a uma Pagina do Facebook.
    </div>

    <button class="btn" onclick="window.close()">Fechar e configurar</button>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
