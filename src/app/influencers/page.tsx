'use client';

import { useState, useMemo } from 'react';
import { DEMO_INFLUENCERS } from '@/lib/mock-data';
import {
  NicheFilter,
  InfluencerCard,
  SoraPlaceholder,
  AIStats,
} from '@/components/influencer-components';
import { Bot, Sparkles } from 'lucide-react';

export default function InfluencersPage() {
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!selectedNiche) return DEMO_INFLUENCERS;
    return DEMO_INFLUENCERS.filter((i) => i.niche === selectedNiche);
  }, [selectedNiche]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white/90 flex items-center gap-2">
            <Bot size={22} className="text-violet-500" />
            IA Influencers
          </h1>
          <p className="text-xs text-white/30 mt-1">
            Galeria de influencers gerados por IA — conteudo automatizado por nicho
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Sparkles size={12} className="text-amber-500" />
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
            Em Desenvolvimento
          </span>
        </div>
      </div>

      {/* Stats */}
      <AIStats influencers={DEMO_INFLUENCERS} />

      {/* Sora Integration */}
      <SoraPlaceholder />

      {/* Niche Filter */}
      <div>
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
          Filtrar por Nicho
        </h2>
        <NicheFilter selected={selectedNiche} onChange={setSelectedNiche} />
      </div>

      {/* Influencer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((influencer) => (
          <InfluencerCard key={influencer.id} influencer={influencer} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Bot size={32} className="mx-auto text-white/10 mb-3" />
          <p className="text-sm text-white/30">Nenhum influencer neste nicho</p>
        </div>
      )}
    </div>
  );
}
