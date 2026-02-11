'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { PST, POST_METRICS } from '@/lib/design-tokens';
import type { MockPost } from '@/lib/mock-data';
import {
  Image as ImageIcon,
  Film,
  Layers,
  GripVertical,
  Eye,
  Heart,
  Bookmark,
  MessageCircle,
  BarChart3,
  Clock,
  CalendarDays,
  Send,
  Smartphone,
  Monitor,
  Hash,
  Sparkles,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  AlertTriangle,
} from '@/components/icons';

// ─── Media Type Icon ────────────────────────────────────────

function MediaTypeIcon({ type, size = 12 }: { type: MockPost['mediaType']; size?: number }) {
  switch (type) {
    case 'reel': return <Film size={size} />;
    case 'carousel': return <Layers size={size} />;
    default: return <ImageIcon size={size} />;
  }
}

// ─── Post Status Badge ──────────────────────────────────────

export function PostStatusBadge({ status }: { status: string }) {
  const s = PST[status] || PST.draft;
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border', s.darkBg)}>
      {status === 'scheduled' && <Clock size={9} />}
      {s.l}
    </span>
  );
}

// ─── Feed Grid (3x3 Instagram-style) ────────────────────────

interface FeedGridProps {
  posts: MockPost[];
  selectedId: string | null;
  onSelect: (post: MockPost) => void;
  onReorder?: (posts: MockPost[]) => void;
}

export function FeedGrid({ posts, selectedId, onSelect }: FeedGridProps) {
  const [dragId, setDragId] = useState<string | null>(null);

  const handleDragStart = (postId: string) => {
    setDragId(postId);
  };

  const handleDragEnd = () => {
    setDragId(null);
  };

  return (
    <div className="grid grid-cols-3 gap-0.5 rounded-lg overflow-hidden bg-black/20">
      {posts.map((post) => {
        const isSelected = post.id === selectedId;
        const isDragging = post.id === dragId;

        return (
          <button
            key={post.id}
            draggable
            onDragStart={() => handleDragStart(post.id)}
            onDragEnd={handleDragEnd}
            onClick={() => onSelect(post)}
            className={cn(
              'relative aspect-square overflow-hidden group cursor-pointer transition-all duration-200',
              isSelected && 'ring-2 ring-[#E1306C] ring-offset-1 ring-offset-[#0c0c14]',
              isDragging && 'opacity-50 scale-95'
            )}
          >
            {/* Image */}
            <img
              src={post.imageUrl}
              alt={post.caption.slice(0, 40)}
              className="w-full h-full object-cover"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-3 text-white text-xs font-semibold">
                {post.status === 'published' && (
                  <>
                    <span className="flex items-center gap-1">
                      <Heart size={12} fill="white" /> {post.engagement > 0 ? (post.engagement * 100).toFixed(0) + '%' : '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={12} fill="white" /> {post.commentCount}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Status indicator */}
            <div className="absolute top-1.5 right-1.5">
              <PostStatusBadge status={post.status} />
            </div>

            {/* Media type */}
            {post.mediaType !== 'image' && (
              <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-md bg-black/50 flex items-center justify-center text-white">
                <MediaTypeIcon type={post.mediaType} size={10} />
              </div>
            )}

            {/* Drag handle */}
            <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-60 transition-opacity">
              <GripVertical size={14} className="text-white" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Mobile Preview Frame ───────────────────────────────────

interface MobilePreviewProps {
  posts: MockPost[];
  username: string;
  selectedId: string | null;
  onSelect: (post: MockPost) => void;
}

export function MobilePreview({ posts, username, selectedId, onSelect }: MobilePreviewProps) {
  return (
    <div className="relative mx-auto" style={{ width: 280 }}>
      {/* Phone frame */}
      <div className="bg-[#1a1a2e] rounded-[2.5rem] p-3 shadow-2xl border border-white/[0.08]">
        {/* Notch */}
        <div className="flex justify-center mb-2">
          <div className="w-24 h-5 bg-black rounded-full" />
        </div>

        {/* Screen */}
        <div className="bg-black rounded-2xl overflow-hidden">
          {/* IG Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] flex items-center justify-center">
                <span className="text-[6px] font-black text-white">IG</span>
              </div>
              <span className="text-[11px] font-bold text-white">{username}</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <Plus size={14} />
            </div>
          </div>

          {/* Profile stats mini */}
          <div className="flex items-center justify-around py-2 px-3 text-center">
            <div>
              <div className="text-[10px] font-bold text-white">{posts.length}</div>
              <div className="text-[7px] text-white/30">posts</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-white">12.5k</div>
              <div className="text-[7px] text-white/30">seguidores</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-white">847</div>
              <div className="text-[7px] text-white/30">seguindo</div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-px">
            {posts.slice(0, 9).map((post) => (
              <button
                key={post.id}
                onClick={() => onSelect(post)}
                className={cn(
                  'aspect-square overflow-hidden transition-all',
                  post.id === selectedId && 'ring-1 ring-[#E1306C]'
                )}
              >
                <img
                  src={post.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Home bar */}
        <div className="flex justify-center mt-2">
          <div className="w-16 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Preview Frame ──────────────────────────────────

interface DesktopPreviewProps {
  posts: MockPost[];
  username: string;
  selectedId: string | null;
  onSelect: (post: MockPost) => void;
}

export function DesktopPreview({ posts, username, selectedId, onSelect }: DesktopPreviewProps) {
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-2 border border-white/[0.08] shadow-2xl max-w-lg mx-auto">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.06] mb-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white/[0.06] rounded-md px-3 py-0.5 text-[9px] text-white/30 font-mono">
            instagram.com/{username}
          </div>
        </div>
      </div>

      {/* Profile header */}
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] p-0.5">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
            <span className="text-sm font-black text-white">IG</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white mb-1">{username}</div>
          <div className="flex gap-6 text-xs">
            <span className="text-white/60"><strong className="text-white">{posts.length}</strong> posts</span>
            <span className="text-white/60"><strong className="text-white">12.5k</strong> seguidores</span>
            <span className="text-white/60"><strong className="text-white">847</strong> seguindo</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 px-1">
        {posts.slice(0, 9).map((post) => (
          <button
            key={post.id}
            onClick={() => onSelect(post)}
            className={cn(
              'aspect-square overflow-hidden rounded-sm transition-all group relative',
              post.id === selectedId && 'ring-2 ring-[#E1306C]'
            )}
          >
            <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Post Editor Panel ──────────────────────────────────────

interface PostEditorProps {
  post: MockPost | null;
  onUpdate: (post: MockPost) => void;
  onClose: () => void;
}

export function PostEditor({ post, onUpdate, onClose }: PostEditorProps) {
  const [caption, setCaption] = useState(post?.caption || '');
  const [hashtags, setHashtags] = useState(post?.hashtags?.join(' ') || '');
  const [mediaType, setMediaType] = useState<MockPost['mediaType']>(post?.mediaType || 'image');
  const [scheduleDate, setScheduleDate] = useState(post?.scheduledFor?.split('T')[0] || '');
  const [scheduleTime, setScheduleTime] = useState(
    post?.scheduledFor ? new Date(post.scheduledFor).toTimeString().slice(0, 5) : '09:00'
  );

  if (!post) return null;

  const handleSave = () => {
    const scheduledFor = scheduleDate
      ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
      : null;

    onUpdate({
      ...post,
      caption,
      hashtags: hashtags.split(/\s+/).filter(Boolean),
      mediaType,
      scheduledFor,
      status: scheduledFor ? 'scheduled' : post.status,
    });
  };

  return (
    <div className="bg-[#0c0c14] border border-white/[0.06] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-sm font-bold text-white/90">Editar Post</h3>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/50 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Preview thumbnail */}
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/[0.06]">
            <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <PostStatusBadge status={post.status} />
            <div className="flex items-center gap-2 mt-2">
              {(['image', 'carousel', 'reel'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setMediaType(t)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all border',
                    mediaType === t
                      ? 'bg-[#E1306C]/15 text-[#E1306C] border-[#E1306C]/30'
                      : 'bg-white/[0.03] text-white/30 border-white/[0.06] hover:bg-white/[0.06]'
                  )}
                >
                  <MediaTypeIcon type={t} size={10} />
                  {t === 'image' ? 'Foto' : t === 'carousel' ? 'Carousel' : 'Reel'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5 block">
            Legenda
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            maxLength={2200}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-xs text-white/80 placeholder:text-white/15 resize-none focus:outline-none focus:border-[#E1306C]/30 transition-colors"
            placeholder="Escreva a legenda do post..."
          />
          <div className="flex items-center justify-between mt-1">
            <span className="text-[9px] text-white/15">{caption.length}/2200</span>
            <button className="flex items-center gap-1 text-[9px] text-[#E1306C]/60 hover:text-[#E1306C] transition-colors">
              <Sparkles size={9} /> Sugestao IA
            </button>
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <label className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Hash size={10} /> Hashtags
          </label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-xs text-white/80 placeholder:text-white/15 focus:outline-none focus:border-[#E1306C]/30 transition-colors"
            placeholder="#hashtag1 #hashtag2 #hashtag3"
          />
        </div>

        {/* Schedule */}
        <div>
          <label className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <CalendarDays size={10} /> Agendar Publicacao
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-xs text-white/80 focus:outline-none focus:border-[#E1306C]/30 transition-colors"
            />
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-28 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-xs text-white/80 focus:outline-none focus:border-[#E1306C]/30 transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-xs font-bold transition-all',
              'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
              'text-white shadow-lg shadow-[#E1306C]/20 hover:shadow-[#E1306C]/35 hover:scale-[1.01] active:scale-[0.99]'
            )}
          >
            <span className="flex items-center justify-center gap-2">
              {scheduleDate ? <Clock size={13} /> : <Send size={13} />}
              {scheduleDate ? 'Agendar' : 'Salvar Rascunho'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Post Metrics Card ──────────────────────────────────────

interface PostMetricsCardProps {
  post: MockPost;
}

export function PostMetricsCard({ post }: PostMetricsCardProps) {
  if (post.status !== 'published') {
    return (
      <div className="bg-[#0c0c14] border border-white/[0.06] rounded-2xl p-5">
        <div className="text-center py-4">
          <BarChart3 size={24} className="mx-auto text-white/15 mb-2" />
          <p className="text-[11px] text-white/30">
            Metricas disponiveis apos publicacao
          </p>
        </div>
      </div>
    );
  }

  const metrics = [
    { key: 'reach', value: post.reach, icon: Eye },
    { key: 'impressions', value: post.impressions, icon: BarChart3 },
    { key: 'engagement', value: post.engagement, icon: Heart },
    { key: 'saves', value: post.saves, icon: Bookmark },
  ];

  return (
    <div className="bg-[#0c0c14] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
        <TrendingUp size={13} className="text-[#E1306C]" />
        <h3 className="text-xs font-bold text-white/50">Insights do Post</h3>
      </div>
      <div className="grid grid-cols-2 gap-px bg-white/[0.04]">
        {metrics.map((m) => {
          const meta = POST_METRICS[m.key];
          const Icon = m.icon;
          return (
            <div key={m.key} className="bg-[#0c0c14] p-4 text-center">
              <Icon size={14} className="mx-auto text-white/15 mb-1.5" />
              <div className="text-lg font-bold text-white/90">{meta.fmt(m.value)}</div>
              <div className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">{meta.l}</div>
            </div>
          );
        })}
      </div>
      <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[10px] text-white/30">
          {post.commentCount} comentarios
        </span>
        <span className="text-[10px] text-white/30">
          Publicado {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR') : '—'}
        </span>
      </div>
    </div>
  );
}

// ─── Publishing Queue ───────────────────────────────────────

interface PublishingQueueProps {
  posts: MockPost[];
  onSelect: (post: MockPost) => void;
}

export function PublishingQueue({ posts, onSelect }: PublishingQueueProps) {
  const scheduled = posts
    .filter((p) => p.status === 'scheduled' && p.scheduledFor)
    .sort((a, b) => new Date(a.scheduledFor!).getTime() - new Date(b.scheduledFor!).getTime());

  if (scheduled.length === 0) {
    return (
      <div className="bg-[#0c0c14] border border-white/[0.06] rounded-2xl p-6 text-center">
        <Clock size={24} className="mx-auto text-white/15 mb-2" />
        <p className="text-xs text-white/30">Nenhum post agendado</p>
        <p className="text-[10px] text-white/30 mt-1">Agende posts no editor para ve-los aqui</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0c14] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-blue-400" />
          <h3 className="text-xs font-bold text-white/50">Fila de Publicacao</h3>
        </div>
        <span className="text-[10px] text-blue-400/60 font-semibold">{scheduled.length} agendados</span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {scheduled.map((post) => {
          const schedDate = new Date(post.scheduledFor!);
          const now = new Date();
          const diffMs = schedDate.getTime() - now.getTime();
          const diffDays = Math.floor(diffMs / 864e5);
          const diffHours = Math.floor((diffMs % 864e5) / 36e5);

          return (
            <button
              key={post.id}
              onClick={() => onSelect(post)}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/[0.06]">
                <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/50 truncate">{post.caption.slice(0, 50)}...</p>
                <p className="text-[9px] text-white/30 mt-0.5">
                  {schedDate.toLocaleDateString('pt-BR')} as {schedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] font-semibold text-blue-400/80">
                  {diffDays > 0 ? `${diffDays}d ${diffHours}h` : diffHours > 0 ? `${diffHours}h` : 'Agora'}
                </div>
                <div className="text-[8px] text-white/30 uppercase">restante</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Calendar View ──────────────────────────────────────────

interface CalendarViewProps {
  posts: MockPost[];
  onSelect: (post: MockPost) => void;
}

export function CalendarView({ posts, onSelect }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  // Map posts to calendar days
  const postsByDay: Record<number, MockPost[]> = {};
  posts.forEach((post) => {
    const date = post.scheduledFor || post.publishedAt;
    if (!date) return;
    const d = new Date(date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!postsByDay[day]) postsByDay[day] = [];
      postsByDay[day].push(post);
    }
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  return (
    <div className="bg-[#0c0c14] border border-white/[0.06] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="w-7 h-7 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/50 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <h3 className="text-sm font-bold text-white/80">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="w-7 h-7 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/50 transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 border-b border-white/[0.04]">
        {dayNames.map((d) => (
          <div key={d} className="py-2 text-center text-[9px] font-semibold text-white/20 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const isToday = day && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const dayPosts = day ? postsByDay[day] || [] : [];

          return (
            <div
              key={i}
              className={cn(
                'min-h-[72px] p-1.5 border-b border-r border-white/[0.03] transition-colors',
                day ? 'hover:bg-white/[0.02]' : 'bg-white/[0.01]',
              )}
            >
              {day && (
                <>
                  <div className={cn(
                    'text-[10px] font-medium mb-1',
                    isToday ? 'text-[#E1306C] font-bold' : 'text-white/30',
                  )}>
                    {isToday ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E1306C]/15">
                        {day}
                      </span>
                    ) : day}
                  </div>
                  <div className="space-y-0.5">
                    {dayPosts.slice(0, 2).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onSelect(p)}
                        className={cn(
                          'w-full flex items-center gap-1 px-1 py-0.5 rounded text-[7px] font-medium truncate transition-colors',
                          p.status === 'published' ? 'bg-emerald-500/10 text-emerald-400/80' :
                          p.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400/80' :
                          'bg-white/[0.04] text-white/30'
                        )}
                      >
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: PST[p.status]?.c || '#666' }} />
                        <span className="truncate">{p.caption.slice(0, 20)}</span>
                      </button>
                    ))}
                    {dayPosts.length > 2 && (
                      <span className="text-[7px] text-white/15 px-1">+{dayPosts.length - 2} mais</span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Preview Toggle ─────────────────────────────────────────

interface PreviewToggleProps {
  mode: 'mobile' | 'desktop';
  onChange: (mode: 'mobile' | 'desktop') => void;
}

export function PreviewToggle({ mode, onChange }: PreviewToggleProps) {
  return (
    <div className="inline-flex rounded-xl bg-white/[0.04] border border-white/[0.06] p-0.5">
      <button
        onClick={() => onChange('mobile')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all',
          mode === 'mobile'
            ? 'bg-[#E1306C]/15 text-[#E1306C] shadow-sm'
            : 'text-white/30 hover:text-white/50'
        )}
      >
        <Smartphone size={11} /> Mobile
      </button>
      <button
        onClick={() => onChange('desktop')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all',
          mode === 'desktop'
            ? 'bg-[#E1306C]/15 text-[#E1306C] shadow-sm'
            : 'text-white/30 hover:text-white/50'
        )}
      >
        <Monitor size={11} /> Desktop
      </button>
    </div>
  );
}

// ─── Stats Bar ──────────────────────────────────────────────

interface FeedStatsProps {
  posts: MockPost[];
}

export function FeedStats({ posts }: FeedStatsProps) {
  const scheduled = posts.filter((p) => p.status === 'scheduled').length;
  const published = posts.filter((p) => p.status === 'published').length;
  const drafts = posts.filter((p) => p.status === 'draft').length;
  const avgEngagement = posts
    .filter((p) => p.status === 'published' && p.engagement > 0)
    .reduce((acc, p, _, arr) => acc + p.engagement / arr.length, 0);

  const stats = [
    { label: 'Agendados', value: String(scheduled), icon: Clock, color: 'text-blue-400' },
    { label: 'Publicados', value: String(published), icon: Send, color: 'text-emerald-400' },
    { label: 'Rascunhos', value: String(drafts), icon: ImageIcon, color: 'text-white/40' },
    { label: 'Engaj. Medio', value: `${(avgEngagement * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-[#E1306C]' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-[#0c0c14] border border-white/[0.06] rounded-2xl p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon size={13} className={s.color} />
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">{s.label}</span>
            </div>
            <div className="text-xl font-bold text-white/90">{s.value}</div>
          </div>
        );
      })}
    </div>
  );
}
