import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy to ScrapeCreators Instagram API — keeps API key server-side.
 *
 * GET /api/instagram/lookup?handle=username
 *   → profile data
 *
 * GET /api/instagram/lookup?handle=username&posts=true
 *   → profile + recent posts
 */

const API_BASE = 'https://api.scrapecreators.com';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const handle = searchParams.get('handle')?.replace(/^@/, '').trim();
  const includePosts = searchParams.get('posts') === 'true';

  if (!handle) {
    return NextResponse.json({ error: 'Parametro "handle" obrigatorio' }, { status: 400 });
  }

  const apiKey = process.env.SCRAPECREATORS_API_KEY || '';

  if (!apiKey) {
    // Return demo/mock data when no API key is configured
    return NextResponse.json({
      success: true,
      demo: true,
      profile: generateDemoProfile(handle),
      posts: includePosts ? generateDemoPosts(handle) : undefined,
    });
  }

  try {
    // Fetch profile
    const profileRes = await fetch(
      `${API_BASE}/v1/instagram/profile?handle=${encodeURIComponent(handle)}`,
      {
        headers: { 'x-api-key': apiKey },
        next: { revalidate: 300 }, // cache 5 min
      }
    );

    if (!profileRes.ok) {
      const errorText = await profileRes.text();
      return NextResponse.json(
        { error: `ScrapeCreators error: ${profileRes.status}`, details: errorText },
        { status: profileRes.status }
      );
    }

    const profileData = await profileRes.json();

    let postsData = null;
    if (includePosts) {
      try {
        const postsRes = await fetch(
          `${API_BASE}/v2/instagram/user/posts?user_id=${profileData?.data?.user?.id || handle}`,
          {
            headers: { 'x-api-key': apiKey },
            next: { revalidate: 300 },
          }
        );
        if (postsRes.ok) {
          postsData = await postsRes.json();
        }
      } catch {
        // Posts fetch is optional — don't fail the whole request
      }
    }

    return NextResponse.json({
      success: true,
      demo: false,
      profile: normalizeProfile(profileData),
      posts: postsData ? normalizePosts(postsData) : undefined,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Falha na requisicao', details: message }, { status: 500 });
  }
}

// ─── Normalizers ────────────────────────────────────────────

interface NormalizedProfile {
  username: string;
  fullName: string;
  biography: string;
  profilePicUrl: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isBusinessAccount: boolean;
  isProfessionalAccount: boolean;
  isVerified: boolean;
  category: string;
  externalUrl: string;
  bioLinks: { title: string; url: string }[];
  highlightReelCount: number;
  hasClips: boolean;
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProfile(raw: any): NormalizedProfile {
  const user = raw?.data?.user || raw || {};

  return {
    username: String(user.username || ''),
    fullName: String(user.full_name || ''),
    biography: String(user.biography || ''),
    profilePicUrl: String(user.profile_pic_url_hd || user.profile_pic_url || ''),
    followerCount: Number(user.edge_followed_by?.count ?? user.follower_count ?? 0),
    followingCount: Number(user.edge_follow?.count ?? user.following_count ?? 0),
    postCount: Number(user.edge_owner_to_timeline_media?.count ?? user.media_count ?? 0),
    isBusinessAccount: Boolean(user.is_business_account),
    isProfessionalAccount: Boolean(user.is_professional_account),
    isVerified: Boolean(user.is_verified),
    category: String(user.category_enum || user.category_name || ''),
    externalUrl: String(user.external_url || ''),
    bioLinks: Array.isArray(user.bio_links) ? user.bio_links : [],
    highlightReelCount: Number(user.highlight_reel_count || 0),
    hasClips: Boolean(user.has_clips),
    id: String(user.id || user.pk || ''),
  };
}

interface NormalizedPost {
  id: string;
  shortcode: string;
  mediaType: 'image' | 'video' | 'carousel';
  imageUrl: string;
  caption: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  timestamp: string;
  engagementRate: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePosts(raw: any): NormalizedPost[] {
  const edges: any[] =
    raw?.data?.user?.edge_owner_to_timeline_media?.edges ||
    raw?.posts ||
    [];

  return edges.slice(0, 30).map((edge: any) => {
    const node = edge.node || edge;
    const likes = Number(node.edge_liked_by?.count ?? node.like_count ?? 0);
    const comments = Number(node.edge_media_to_comment?.count ?? node.comment_count ?? 0);
    const views = Number(node.video_view_count || 0);

    return {
      id: String(node.id || ''),
      shortcode: String(node.shortcode || ''),
      mediaType: node.__typename === 'GraphSidecar' ? 'carousel' : node.is_video ? 'video' : 'image',
      imageUrl: String(node.display_url || node.thumbnail_src || ''),
      caption: String(
        node.edge_media_to_caption?.edges?.[0]?.node?.text ??
        node.caption ??
        ''
      ),
      likeCount: likes,
      commentCount: comments,
      viewCount: views,
      timestamp: node.taken_at_timestamp
        ? new Date(Number(node.taken_at_timestamp) * 1000).toISOString()
        : String(node.taken_at || ''),
      engagementRate: 0, // calculated client-side with follower count
    };
  });
}

// ─── Demo Data ──────────────────────────────────────────────

function generateDemoProfile(handle: string): NormalizedProfile {
  return {
    username: handle,
    fullName: handle.charAt(0).toUpperCase() + handle.slice(1).replace(/[._]/g, ' '),
    biography: 'Perfil de demonstracao — conecte sua API key ScrapeCreators para dados reais.\n📍 Brasil | 🚀 Empreendedor Digital',
    profilePicUrl: `https://placehold.co/200x200/E1306C/fff?text=${handle.slice(0, 2).toUpperCase()}`,
    followerCount: 12500 + Math.floor(Math.random() * 90000),
    followingCount: 500 + Math.floor(Math.random() * 2000),
    postCount: 80 + Math.floor(Math.random() * 400),
    isBusinessAccount: true,
    isProfessionalAccount: true,
    isVerified: Math.random() > 0.7,
    category: 'Entrepreneur',
    externalUrl: 'https://example.com',
    bioLinks: [{ title: 'Website', url: 'https://example.com' }],
    highlightReelCount: 5 + Math.floor(Math.random() * 15),
    hasClips: true,
    id: String(Math.floor(Math.random() * 1e10)),
  };
}

function generateDemoPosts(handle: string): NormalizedPost[] {
  const captions = [
    'Novidade chegando! Fique ligado 🔥',
    'Transforme sua rotina com qualidade ✨',
    'Resultados que falam por si! 💪',
    'Lancamento exclusivo! Corre! 🚀',
    'Sabado de cuidados pessoais 💬',
    'Bastidores da producao 🏭',
    'Promocao de verao! Ate 40% OFF ☀️',
    'Dica do especialista 📋',
    'Obrigado por 10k seguidores! 🎉',
    'Novo tutorial no feed! 📌',
    'Parceria especial essa semana 🤝',
    'Conheca nossa equipe 👥',
  ];

  return Array.from({ length: 18 }, (_, i) => {
    const likes = 100 + Math.floor(Math.random() * 3000);
    const comments = 5 + Math.floor(Math.random() * 150);
    const isVideo = Math.random() > 0.65;
    const colors = ['e8d5f5', 'f5d5e8', 'd5e8f5', 'f5e8d5', 'd5f5e8', 'f5f5d5'];

    return {
      id: `demo-${i}`,
      shortcode: `demo${i}`,
      mediaType: (isVideo ? 'video' : Math.random() > 0.8 ? 'carousel' : 'image') as NormalizedPost['mediaType'],
      imageUrl: `https://placehold.co/400x400/${colors[i % colors.length]}/333?text=${handle.slice(0, 3)}+${i + 1}`,
      caption: captions[i % captions.length],
      likeCount: likes,
      commentCount: comments,
      viewCount: isVideo ? likes * 3 + Math.floor(Math.random() * 5000) : 0,
      timestamp: new Date(Date.now() - i * 2.5 * 864e5).toISOString(),
      engagementRate: 0,
    };
  });
}
