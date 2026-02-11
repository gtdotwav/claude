'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { INFLUENCER_NICHES } from '@/lib/design-tokens';
import type { MockInfluencer } from '@/lib/mock-data';
import {
  Bot,
  Users,
  TrendingUp,
  Film,
  Image as ImageIcon,
  Sparkles,
  Lock,
  Zap,
  ExternalLink,
} from 'lucide-react';

// ─── Niche Filter ───────────────────────────────────────────

interface NicheFilterProps {
  selected: string | null;
  onChange: (niche: string | null) => void;
}

export function NicheFilter({ selected, onChange }: NicheFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={cn(
          'px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border',
          !selected
            ? 'bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/20'
            : 'bg-white/[0.04] text-white/30 border-white/[0.06] hover:bg-white/[0.06]'
        )}
      >
        Todos
      </button>
      {Object.entries(INFLUENCER_NICHES).map(([key, niche]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border',
            selected === key
              ? 'border-opacity-30 bg-opacity-10'
              : 'bg-white/[0.04] text-white/30 border-white/[0.06] hover:bg-white/[0.06]'
          )}
          style={selected === key ? {
            backgroundColor: `${niche.c}15`,
            color: niche.c,
            borderColor: `${niche.c}30`,
          } : undefined}
        >
          {niche.emoji} {niche.l}
        </button>
      ))}
    </div>
  );
}

// ─── Influencer Card ────────────────────────────────────────

interface InfluencerCardProps {
  influencer: MockInfluencer;
}

export function InfluencerCard({ influencer }: InfluencerCardProps) {
  const niche = INFLUENCER_NICHES[influencer.niche];

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-white/[0.02] hover:border-white/[0.12] transition-all group">
      {/* Cover / gradient */}
      <div
        className="h-24 relative"
        style={{
          background: `linear-gradient(135deg, ${niche?.c || '#666'}20, ${niche?.c || '#666'}08)`,
        }}
      >
        {/* AI badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/20">
          <Bot size={10} className="text-violet-500" />
          <span className="text-[8px] font-bold text-violet-500 uppercase tracking-wider">IA</span>
        </div>

        {/* Sora badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
          <Sparkles size={9} className="text-amber-400" />
          <span className="text-[8px] font-bold text-white/80">Sora</span>
        </div>

        {/* Profile pic */}
        <div className="absolute -bottom-6 left-4">
          <div className="w-14 h-14 rounded-full border-3 border-white shadow-md overflow-hidden">
            <img
              src={influencer.profileImageUrl}
              alt={influencer.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-8 pb-4 px-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-white/90">{influencer.name}</h3>
            <p className="text-[10px] text-white/30 mt-0.5">{influencer.bio}</p>
          </div>
        </div>

        {/* Niche tag */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold"
            style={{
              backgroundColor: `${niche?.c || '#666'}12`,
              color: niche?.c || '#666',
            }}
          >
            {niche?.emoji} {niche?.l}
          </span>
          <span className="text-[9px] text-white/20">{influencer.style}</span>
        </div>

        {/* Stats */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-xs font-bold text-white/70">
              {influencer.followerCount >= 1000
                ? `${(influencer.followerCount / 1000).toFixed(1)}k`
                : influencer.followerCount}
            </div>
            <div className="text-[8px] text-white/20 uppercase">Seguidores</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-white/70">
              {(influencer.engagementRate * 100).toFixed(1)}%
            </div>
            <div className="text-[8px] text-white/20 uppercase">Engajamento</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-white/70">{influencer.postsCount}</div>
            <div className="text-[8px] text-white/20 uppercase">Posts</div>
          </div>
        </div>

        {/* Coming soon overlay */}
        <div className="mt-4 p-3 bg-white/[0.04] rounded-xl border border-white/[0.04] text-center">
          <Lock size={14} className="mx-auto text-white/20 mb-1" />
          <p className="text-[10px] text-white/30 font-medium">Geracao de conteudo em breve</p>
          <p className="text-[8px] text-white/20 mt-0.5">Integracao com Sora API</p>
        </div>
      </div>
    </div>
  );
}

// ─── Sora Integration Placeholder ───────────────────────────

export function SoraPlaceholder() {
  return (
    <div className="bg-violet-500/[0.06] border border-violet-500/[0.15] rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
          <Film size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-white/90">Sora API — Video IA</h3>
            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
              Em Breve
            </span>
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            Gere videos de alta qualidade para seus influencers IA usando a API do Sora.
            Crie conteudo unico por nicho, personalizado para cada perfil.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { icon: Film, label: 'Videos curtos', desc: 'Reels e Stories' },
              { icon: ImageIcon, label: 'Thumbnails', desc: 'Capas otimizadas' },
              { icon: Zap, label: 'Automacao', desc: 'Publicacao auto' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="bg-white/[0.04] rounded-xl p-3 text-center border border-white/[0.06]">
                  <Icon size={16} className="mx-auto text-violet-400 mb-1.5" />
                  <div className="text-[10px] font-bold text-white/70">{f.label}</div>
                  <div className="text-[8px] text-white/30">{f.desc}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <a
              href="https://openai.com/sora"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-violet-400 bg-violet-500/10 hover:bg-violet-500/20 transition-colors"
            >
              <ExternalLink size={10} />
              Saber mais sobre Sora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Stats Overview ──────────────────────────────────────

interface AIStatsProps {
  influencers: MockInfluencer[];
}

export function AIStats({ influencers }: AIStatsProps) {
  const totalFollowers = influencers.reduce((acc, i) => acc + i.followerCount, 0);
  const avgEngagement = influencers.reduce((acc, i) => acc + i.engagementRate, 0) / influencers.length;
  const niches = new Set(influencers.map((i) => i.niche)).size;

  const stats = [
    { label: 'Influencers IA', value: String(influencers.length), icon: Bot, color: 'text-violet-500' },
    { label: 'Alcance Total', value: `${(totalFollowers / 1000).toFixed(0)}k`, icon: Users, color: 'text-blue-500' },
    { label: 'Engaj. Medio', value: `${(avgEngagement * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Nichos', value: String(niches), icon: Sparkles, color: 'text-amber-500' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon size={13} className={s.color} />
              <span className="text-[9px] text-white/30 uppercase tracking-wider font-semibold">{s.label}</span>
            </div>
            <div className="text-xl font-bold text-white/90">{s.value}</div>
          </div>
        );
      })}
    </div>
  );
}
