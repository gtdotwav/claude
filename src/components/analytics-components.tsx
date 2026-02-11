'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Search,
  Users,
  UserPlus,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Eye,
  Bookmark,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Film,
  Layers,
  Globe,
  Star,
  Clock,
  Award,
  Zap,
  Activity,
  Target,
  Hash,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from '@/components/icons';

// ─── Types ──────────────────────────────────────────────────

export interface ProfileData {
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

export interface PostData {
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

// ─── Search Bar ─────────────────────────────────────────────

interface SearchBarProps {
  onSearch: (handle: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] rounded-2xl opacity-0 group-hover:opacity-30 group-focus-within:opacity-50 transition-opacity blur-lg" />

        <div className="relative flex items-center bg-white/[0.04] border-2 border-white/[0.06] group-focus-within:border-[#E1306C]/40 rounded-2xl overflow-hidden transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-white/[0.02]">
          <div className="flex items-center justify-center w-14 h-14 text-white/20 group-focus-within:text-[#E1306C] transition-colors">
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Search size={20} />
            )}
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Digite o @ do perfil... ex: nike"
            className="flex-1 h-14 text-base text-white/90 placeholder:text-white/20 bg-transparent outline-none pr-4"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className={cn(
              'h-10 px-6 mr-2 rounded-xl text-sm font-bold transition-all',
              'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
              'text-white shadow-lg shadow-[#E1306C]/15 hover:shadow-[#E1306C]/30',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'hover:scale-[1.02] active:scale-[0.98]',
            )}
          >
            Analisar
          </button>
        </div>
      </div>
    </form>
  );
}

// ─── Profile Hero Card ──────────────────────────────────────

interface ProfileHeroProps {
  profile: ProfileData;
  isDemo: boolean;
}

export function ProfileHero({ profile, isDemo }: ProfileHeroProps) {
  const followRatio = profile.followingCount > 0
    ? (profile.followerCount / profile.followingCount).toFixed(1)
    : '—';

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden shadow-sm hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
      {/* Banner gradient */}
      <div className="h-28 bg-gradient-to-r from-[#833AB4]/20 via-[#E1306C]/15 to-[#F77737]/20 relative">
        {isDemo && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            <AlertCircle size={10} className="text-amber-500" />
            <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">Dados Demo</span>
          </div>
        )}
      </div>

      <div className="px-6 pb-6 -mt-12">
        <div className="flex items-end gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-[#0c0c14] shadow-lg overflow-hidden bg-white/[0.06]">
              <img
                src={profile.profilePicUrl}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            </div>
            {profile.isVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center border-2 border-[#0c0c14]">
                <CheckCircle2 size={14} className="text-white" fill="white" stroke="rgb(59 130 246)" />
              </div>
            )}
          </div>

          {/* Name & Bio */}
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white/90">@{profile.username}</h2>
              {profile.isBusinessAccount && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                  Business
                </span>
              )}
              {profile.category && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white/[0.04] text-white/30 border border-white/[0.06]">
                  {profile.category}
                </span>
              )}
            </div>
            {profile.fullName && (
              <p className="text-sm text-white/50 mt-0.5">{profile.fullName}</p>
            )}
          </div>

          {/* External link */}
          {profile.externalUrl && (
            <a
              href={profile.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-[#E1306C] hover:bg-[#E1306C]/5 transition-colors"
            >
              <Globe size={12} />
              <span className="max-w-[150px] truncate">{profile.externalUrl.replace(/^https?:\/\//, '')}</span>
              <ExternalLink size={10} />
            </a>
          )}
        </div>

        {/* Bio */}
        {profile.biography && (
          <p className="text-sm text-white/50 mt-4 leading-relaxed whitespace-pre-line max-w-2xl">
            {profile.biography}
          </p>
        )}

        {/* Quick stats inline */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/[0.04]">
          <div className="text-center">
            <div className="text-lg font-black text-white/90">{formatNumber(profile.followerCount)}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Seguidores</div>
          </div>
          <div className="w-px h-8 bg-white/[0.06]" />
          <div className="text-center">
            <div className="text-lg font-black text-white/90">{formatNumber(profile.followingCount)}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Seguindo</div>
          </div>
          <div className="w-px h-8 bg-white/[0.06]" />
          <div className="text-center">
            <div className="text-lg font-black text-white/90">{formatNumber(profile.postCount)}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Posts</div>
          </div>
          <div className="w-px h-8 bg-white/[0.06]" />
          <div className="text-center">
            <div className="text-lg font-black text-white/90">{followRatio}x</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Follow Ratio</div>
          </div>
          <div className="w-px h-8 bg-white/[0.06]" />
          <div className="text-center">
            <div className="text-lg font-black text-white/90">{profile.highlightReelCount}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Highlights</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KPI Cards ──────────────────────────────────────────────

interface KPICardsProps {
  profile: ProfileData;
  posts: PostData[];
}

export function KPICards({ profile, posts }: KPICardsProps) {
  const totalLikes = posts.reduce((acc, p) => acc + p.likeCount, 0);
  const totalComments = posts.reduce((acc, p) => acc + p.commentCount, 0);
  const avgLikes = posts.length > 0 ? Math.round(totalLikes / posts.length) : 0;
  const avgComments = posts.length > 0 ? Math.round(totalComments / posts.length) : 0;
  const avgEngagement = profile.followerCount > 0
    ? ((totalLikes + totalComments) / posts.length / profile.followerCount) * 100
    : 0;
  const totalViews = posts.filter(p => p.viewCount > 0).reduce((acc, p) => acc + p.viewCount, 0);

  const kpis = [
    {
      label: 'Taxa de Engajamento',
      value: `${avgEngagement.toFixed(2)}%`,
      subtext: avgEngagement > 3 ? 'Excelente' : avgEngagement > 1.5 ? 'Bom' : 'Abaixo da media',
      icon: Activity,
      color: avgEngagement > 3 ? 'text-emerald-500' : avgEngagement > 1.5 ? 'text-blue-500' : 'text-amber-500',
      bg: avgEngagement > 3 ? 'bg-emerald-500/10' : avgEngagement > 1.5 ? 'bg-blue-500/10' : 'bg-amber-500/10',
      trend: avgEngagement > 1.5 ? 'up' as const : 'down' as const,
    },
    {
      label: 'Media de Likes',
      value: formatNumber(avgLikes),
      subtext: `${formatNumber(totalLikes)} total em ${posts.length} posts`,
      icon: Heart,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      trend: 'up' as const,
    },
    {
      label: 'Media de Comentarios',
      value: formatNumber(avgComments),
      subtext: `${formatNumber(totalComments)} total`,
      icon: MessageCircle,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      trend: 'up' as const,
    },
    {
      label: 'Visualizacoes (Videos)',
      value: formatNumber(totalViews),
      subtext: `${posts.filter(p => p.viewCount > 0).length} videos/reels`,
      icon: Eye,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
      trend: 'up' as const,
    },
    {
      label: 'Posts por Semana',
      value: calculatePostFrequency(posts),
      subtext: 'Frequencia de publicacao',
      icon: Clock,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
      trend: 'up' as const,
    },
    {
      label: 'Score de Qualidade',
      value: calculateQualityScore(profile, posts, avgEngagement),
      subtext: 'Baseado em engajamento e consistencia',
      icon: Award,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      trend: 'up' as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.label} className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-4 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', kpi.bg)}>
                <Icon size={16} className={kpi.color} />
              </div>
              {kpi.trend === 'up' ? (
                <ArrowUpRight size={14} className="text-emerald-400" />
              ) : (
                <ArrowDownRight size={14} className="text-red-400" />
              )}
            </div>
            <div className="text-xl font-black text-white/90">{kpi.value}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mt-0.5">{kpi.label}</div>
            <div className="text-[10px] text-white/30 mt-1">{kpi.subtext}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Content Type Breakdown ─────────────────────────────────

interface ContentBreakdownProps {
  posts: PostData[];
}

export function ContentBreakdown({ posts }: ContentBreakdownProps) {
  const types = useMemo(() => {
    const images = posts.filter(p => p.mediaType === 'image');
    const videos = posts.filter(p => p.mediaType === 'video');
    const carousels = posts.filter(p => p.mediaType === 'carousel');

    const calcAvg = (arr: PostData[]) => arr.length > 0
      ? Math.round(arr.reduce((a, p) => a + p.likeCount + p.commentCount, 0) / arr.length)
      : 0;

    return [
      { type: 'Fotos', count: images.length, pct: images.length / posts.length * 100, avgEng: calcAvg(images), icon: ImageIcon, color: '#3b82f6', bg: 'bg-blue-500/10 text-blue-400' },
      { type: 'Reels/Videos', count: videos.length, pct: videos.length / posts.length * 100, avgEng: calcAvg(videos), icon: Film, color: '#ef4444', bg: 'bg-red-500/10 text-red-400' },
      { type: 'Carroseis', count: carousels.length, pct: carousels.length / posts.length * 100, avgEng: calcAvg(carousels), icon: Layers, color: '#8b5cf6', bg: 'bg-violet-500/10 text-violet-400' },
    ];
  }, [posts]);

  const maxPct = Math.max(...types.map(t => t.pct), 1);

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 size={15} className="text-[#E1306C]" />
        <h3 className="text-sm font-semibold text-white/50">Tipo de Conteudo</h3>
      </div>

      <div className="space-y-4">
        {types.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.type}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', t.bg)}>
                    <Icon size={13} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white/90">{t.type}</span>
                    <span className="text-[10px] text-white/30 ml-2">{t.count} posts</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-white/90">{t.pct.toFixed(0)}%</span>
                  <div className="text-[9px] text-white/30">~{formatNumber(t.avgEng)} eng/post</div>
                </div>
              </div>
              <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(t.pct / maxPct) * 100}%`, background: t.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Posting Activity Heatmap ───────────────────────────────

interface PostingHeatmapProps {
  posts: PostData[];
}

export function PostingHeatmap({ posts }: PostingHeatmapProps) {
  const hourData = useMemo(() => {
    const hours = Array.from({ length: 24 }, () => ({ count: 0, engagement: 0 }));
    posts.forEach((p) => {
      if (!p.timestamp) return;
      const h = new Date(p.timestamp).getHours();
      hours[h].count++;
      hours[h].engagement += p.likeCount + p.commentCount;
    });
    return hours;
  }, [posts]);

  const dayData = useMemo(() => {
    const days = Array.from({ length: 7 }, () => ({ count: 0, engagement: 0 }));
    posts.forEach((p) => {
      if (!p.timestamp) return;
      const d = new Date(p.timestamp).getDay();
      days[d].count++;
      days[d].engagement += p.likeCount + p.commentCount;
    });
    return days;
  }, [posts]);

  const maxHourCount = Math.max(...hourData.map(h => h.count), 1);
  const maxDayCount = Math.max(...dayData.map(d => d.count), 1);
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const bestHour = hourData.reduce((best, h, i) =>
    h.engagement > (hourData[best]?.engagement || 0) ? i : best, 0);
  const bestDay = dayData.reduce((best, d, i) =>
    d.engagement > (dayData[best]?.engagement || 0) ? i : best, 0);

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-[#E1306C]" />
          <h3 className="text-sm font-semibold text-white/50">Atividade de Publicacao</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Zap size={10} className="text-emerald-500" />
            <span className="text-[9px] font-bold text-emerald-400">
              Melhor hora: {bestHour}:00
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Star size={10} className="text-blue-500" />
            <span className="text-[9px] font-bold text-blue-400">
              Melhor dia: {dayNames[bestDay]}
            </span>
          </div>
        </div>
      </div>

      {/* Hour distribution */}
      <div className="mb-5">
        <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Por Hora</h4>
        <div className="flex items-end gap-0.5 h-16">
          {hourData.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div
                className={cn(
                  'w-full rounded-t transition-all',
                  i === bestHour ? 'bg-[#E1306C]' : 'bg-white/[0.08] group-hover:bg-[#E1306C]/40'
                )}
                style={{ height: `${(h.count / maxHourCount) * 100}%`, minHeight: h.count > 0 ? 4 : 1 }}
              />
              {i % 3 === 0 && (
                <span className="text-[7px] text-white/20 mt-1">{i}h</span>
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                <div className="bg-[#1a1a2e] text-white/80 text-[9px] px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
                  {i}:00 — {h.count} posts | {formatNumber(h.engagement)} eng
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day distribution */}
      <div>
        <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Por Dia</h4>
        <div className="grid grid-cols-7 gap-1.5">
          {dayData.map((d, i) => (
            <div key={i} className="text-center group relative">
              <div className="text-[9px] font-semibold text-white/50 mb-1">{dayNames[i]}</div>
              <div
                className={cn(
                  'w-full h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all',
                  i === bestDay
                    ? 'bg-[#E1306C]/15 text-[#E1306C] ring-1 ring-[#E1306C]/20'
                    : d.count > 0
                    ? 'bg-white/[0.04] text-white/40'
                    : 'bg-white/[0.02] text-white/10'
                )}
                style={{
                  opacity: d.count > 0 ? 0.3 + (d.count / maxDayCount) * 0.7 : 0.2,
                }}
              >
                {d.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Top Posts Grid ──────────────────────────────────────────

interface TopPostsProps {
  posts: PostData[];
  followerCount: number;
}

export function TopPosts({ posts, followerCount }: TopPostsProps) {
  const [sortBy, setSortBy] = useState<'likes' | 'comments' | 'engagement'>('engagement');

  const sorted = useMemo(() => {
    const withEng = posts.map((p) => ({
      ...p,
      engagementRate: followerCount > 0 ? ((p.likeCount + p.commentCount) / followerCount) * 100 : 0,
    }));

    return [...withEng].sort((a, b) => {
      if (sortBy === 'likes') return b.likeCount - a.likeCount;
      if (sortBy === 'comments') return b.commentCount - a.commentCount;
      return b.engagementRate - a.engagementRate;
    });
  }, [posts, followerCount, sortBy]);

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
      <div className="px-5 py-3.5 border-b border-white/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} className="text-[#E1306C]" />
          <h3 className="text-sm font-semibold text-white/50">Top Posts</h3>
        </div>
        <div className="flex gap-1 bg-white/[0.04] rounded-lg p-0.5">
          {([
            { key: 'engagement', label: 'Engajamento' },
            { key: 'likes', label: 'Likes' },
            { key: 'comments', label: 'Comentarios' },
          ] as const).map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={cn(
                'px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all',
                sortBy === s.key
                  ? 'bg-white/[0.08] text-white/90 shadow-lg shadow-black/20'
                  : 'text-white/30 hover:text-white/50'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 bg-white/[0.06]">
        {sorted.slice(0, 9).map((post, i) => (
          <div key={post.id} className="bg-[#0c0c14] relative group">
            {/* Rank badge */}
            {i < 3 && (
              <div className={cn(
                'absolute top-2 left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-md',
                i === 0 ? 'bg-amber-400 text-amber-900' :
                i === 1 ? 'bg-slate-500 text-white/80' :
                'bg-amber-700 text-amber-100'
              )}>
                {i + 1}
              </div>
            )}

            {/* Image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.caption.slice(0, 30)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Hover overlay with metrics */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-4 text-white text-xs font-semibold">
                <span className="flex items-center gap-1">
                  <Heart size={14} fill="white" /> {formatNumber(post.likeCount)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} fill="white" /> {formatNumber(post.commentCount)}
                </span>
              </div>
            </div>

            {/* Bottom metrics */}
            <div className="px-3 py-2 border-t border-white/[0.03]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-white/50">
                  <span className="flex items-center gap-0.5">
                    <Heart size={9} className="text-rose-400" /> {formatNumber(post.likeCount)}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MessageCircle size={9} className="text-blue-400" /> {post.commentCount}
                  </span>
                  {post.viewCount > 0 && (
                    <span className="flex items-center gap-0.5">
                      <Eye size={9} className="text-violet-400" /> {formatNumber(post.viewCount)}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-bold text-[#E1306C]">
                  {post.engagementRate.toFixed(2)}%
                </span>
              </div>
              <p className="text-[9px] text-white/30 mt-1 truncate">{post.caption}</p>
            </div>

            {/* Media type indicator */}
            <div className="absolute top-2 right-2">
              {post.mediaType === 'video' && (
                <div className="w-5 h-5 rounded-md bg-black/40 flex items-center justify-center">
                  <Film size={10} className="text-white" />
                </div>
              )}
              {post.mediaType === 'carousel' && (
                <div className="w-5 h-5 rounded-md bg-black/40 flex items-center justify-center">
                  <Layers size={10} className="text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hashtag Analysis ───────────────────────────────────────

interface HashtagAnalysisProps {
  posts: PostData[];
}

export function HashtagAnalysis({ posts }: HashtagAnalysisProps) {
  const hashtags = useMemo(() => {
    const map: Record<string, { count: number; engagement: number }> = {};
    posts.forEach((p) => {
      const tags = p.caption.match(/#\w+/g) || [];
      tags.forEach((tag) => {
        const t = tag.toLowerCase();
        if (!map[t]) map[t] = { count: 0, engagement: 0 };
        map[t].count++;
        map[t].engagement += p.likeCount + p.commentCount;
      });
    });
    return Object.entries(map)
      .map(([tag, data]) => ({ tag, ...data, avgEng: Math.round(data.engagement / data.count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [posts]);

  if (hashtags.length === 0) {
    return (
      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
        <div className="flex items-center gap-2 mb-4">
          <Hash size={15} className="text-[#E1306C]" />
          <h3 className="text-sm font-semibold text-white/50">Hashtags</h3>
        </div>
        <div className="text-center py-6">
          <Hash size={24} className="mx-auto text-white/10 mb-2" />
          <p className="text-xs text-white/20">Nenhuma hashtag encontrada nos posts analisados</p>
        </div>
      </div>
    );
  }

  const maxCount = hashtags[0].count;

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
      <div className="flex items-center gap-2 mb-4">
        <Hash size={15} className="text-[#E1306C]" />
        <h3 className="text-sm font-semibold text-white/50">Hashtags Mais Usadas</h3>
      </div>

      <div className="space-y-2">
        {hashtags.map((h, i) => (
          <div key={h.tag} className="flex items-center gap-2 group">
            <span className="w-4 text-[9px] text-white/30 font-mono text-right">{i + 1}</span>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 h-6 bg-white/[0.04] rounded-md overflow-hidden relative">
                <div
                  className="h-full rounded-md bg-gradient-to-r from-[#E1306C]/20 to-[#F77737]/20 transition-all"
                  style={{ width: `${(h.count / maxCount) * 100}%` }}
                />
                <span className="absolute inset-0 flex items-center px-2 text-[10px] font-semibold text-white/50">
                  {h.tag}
                </span>
              </div>
              <span className="text-[9px] text-white/30 w-16 text-right">{h.count}x</span>
              <span className="text-[9px] text-white/30 w-20 text-right">~{formatNumber(h.avgEng)} eng</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Engagement Distribution ────────────────────────────────

interface EngagementDistributionProps {
  posts: PostData[];
  followerCount: number;
}

export function EngagementDistribution({ posts, followerCount }: EngagementDistributionProps) {
  const buckets = useMemo(() => {
    const ranges = [
      { min: 0, max: 0.5, label: '<0.5%', color: '#ef4444' },
      { min: 0.5, max: 1, label: '0.5-1%', color: '#f59e0b' },
      { min: 1, max: 2, label: '1-2%', color: '#3b82f6' },
      { min: 2, max: 4, label: '2-4%', color: '#22c55e' },
      { min: 4, max: 8, label: '4-8%', color: '#8b5cf6' },
      { min: 8, max: 100, label: '>8%', color: '#E1306C' },
    ];

    return ranges.map((r) => {
      const count = posts.filter((p) => {
        const eng = followerCount > 0 ? ((p.likeCount + p.commentCount) / followerCount) * 100 : 0;
        return eng >= r.min && eng < r.max;
      }).length;
      return { ...r, count, pct: posts.length > 0 ? (count / posts.length) * 100 : 0 };
    });
  }, [posts, followerCount]);

  const maxCount = Math.max(...buckets.map(b => b.count), 1);

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
      <div className="flex items-center gap-2 mb-5">
        <Target size={15} className="text-[#E1306C]" />
        <h3 className="text-sm font-semibold text-white/50">Distribuicao de Engajamento</h3>
      </div>

      <div className="flex items-end gap-2 h-32">
        {buckets.map((b) => (
          <div key={b.label} className="flex-1 flex flex-col items-center group relative">
            <div className="w-full flex flex-col items-center">
              <span className="text-[9px] font-bold text-white/50 mb-1">
                {b.count}
              </span>
              <div
                className="w-full rounded-t-lg transition-all group-hover:opacity-80"
                style={{
                  height: `${Math.max((b.count / maxCount) * 80, 4)}px`,
                  background: b.color,
                }}
              />
            </div>
            <span className="text-[8px] text-white/30 mt-1.5 font-semibold">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Account Health Score ───────────────────────────────────

interface AccountHealthProps {
  profile: ProfileData;
  posts: PostData[];
}

export function AccountHealth({ profile, posts }: AccountHealthProps) {
  const metrics = useMemo(() => {
    const avgEng = profile.followerCount > 0
      ? posts.reduce((a, p) => a + ((p.likeCount + p.commentCount) / profile.followerCount) * 100, 0) / posts.length
      : 0;

    const followRatio = profile.followingCount > 0 ? profile.followerCount / profile.followingCount : 0;
    const postsPerWeek = calculatePostFrequencyNum(posts);
    const hasClips = posts.some(p => p.mediaType === 'video');
    const hasCarousels = posts.some(p => p.mediaType === 'carousel');
    const contentDiversity = [hasClips, hasCarousels, posts.some(p => p.mediaType === 'image')].filter(Boolean).length;

    const scores = [
      {
        label: 'Engajamento',
        score: Math.min(100, avgEng * 20),
        detail: `${avgEng.toFixed(2)}% media`,
        color: avgEng > 3 ? '#22c55e' : avgEng > 1.5 ? '#3b82f6' : '#f59e0b',
      },
      {
        label: 'Follow Ratio',
        score: Math.min(100, followRatio * 10),
        detail: `${followRatio.toFixed(1)}x`,
        color: followRatio > 5 ? '#22c55e' : followRatio > 2 ? '#3b82f6' : '#f59e0b',
      },
      {
        label: 'Consistencia',
        score: Math.min(100, postsPerWeek * 20),
        detail: `${postsPerWeek.toFixed(1)} posts/semana`,
        color: postsPerWeek > 3 ? '#22c55e' : postsPerWeek > 1 ? '#3b82f6' : '#f59e0b',
      },
      {
        label: 'Diversidade',
        score: contentDiversity * 33,
        detail: `${contentDiversity}/3 formatos`,
        color: contentDiversity === 3 ? '#22c55e' : contentDiversity === 2 ? '#3b82f6' : '#f59e0b',
      },
    ];

    const overall = Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length);

    return { scores, overall };
  }, [profile, posts]);

  const getOverallColor = (score: number) =>
    score >= 70 ? '#22c55e' : score >= 45 ? '#3b82f6' : '#f59e0b';

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={15} className="text-[#E1306C]" />
        <h3 className="text-sm font-semibold text-white/50">Saude da Conta</h3>
      </div>

      {/* Overall Score */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#1a1a2e" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={getOverallColor(metrics.overall)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${metrics.overall * 2.64} 264`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white/90">{metrics.overall}</span>
            <span className="text-[8px] font-semibold text-white/30 uppercase tracking-wider">Score</span>
          </div>
        </div>
      </div>

      {/* Individual scores */}
      <div className="space-y-3">
        {metrics.scores.map((s) => (
          <div key={s.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-white/70">{s.label}</span>
              <span className="text-[10px] text-white/30">{s.detail}</span>
            </div>
            <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${s.score}%`, background: s.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function calculatePostFrequency(posts: PostData[]): string {
  const freq = calculatePostFrequencyNum(posts);
  return freq.toFixed(1);
}

function calculatePostFrequencyNum(posts: PostData[]): number {
  if (posts.length < 2) return 0;
  const timestamps = posts
    .map((p) => new Date(p.timestamp).getTime())
    .filter((t) => !isNaN(t))
    .sort((a, b) => a - b);
  if (timestamps.length < 2) return 0;
  const spanDays = (timestamps[timestamps.length - 1] - timestamps[0]) / 864e5;
  if (spanDays === 0) return posts.length;
  return (posts.length / spanDays) * 7;
}

function calculateQualityScore(profile: ProfileData, posts: PostData[], avgEng: number): string {
  let score = 0;
  if (avgEng > 5) score += 30;
  else if (avgEng > 3) score += 25;
  else if (avgEng > 1.5) score += 18;
  else score += 8;

  const ratio = profile.followingCount > 0 ? profile.followerCount / profile.followingCount : 0;
  if (ratio > 10) score += 25;
  else if (ratio > 5) score += 20;
  else if (ratio > 2) score += 12;
  else score += 5;

  const freq = calculatePostFrequencyNum(posts);
  if (freq > 5) score += 20;
  else if (freq > 3) score += 18;
  else if (freq > 1) score += 12;
  else score += 4;

  const hasVariety = new Set(posts.map(p => p.mediaType)).size >= 2;
  score += hasVariety ? 15 : 5;

  score += Math.min(10, profile.highlightReelCount);

  return `${Math.min(100, score)}/100`;
}
