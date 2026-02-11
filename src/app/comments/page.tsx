'use client';

import { useState, useMemo } from 'react';
import { generateMockComments } from '@/lib/mock-data';
import { CLS, STAT } from '@/lib/design-tokens';
import { Badge, Tooltip, HelpBadge, EmptyState, SentBar, IntBar } from '@/components/ui';
import AiExplainer from '@/components/ai-explainer';
import type { MockComment } from '@/lib/mock-data';

export default function CommentsPage() {
  const [comments] = useState(() => generateMockComments(40));
  const [search, setSearch] = useState('');
  const [clsF, setClsF] = useState('all');
  const [statF, setStatF] = useState('all');
  const [selected, setSelected] = useState<MockComment | null>(null);

  const filtered = useMemo(
    () =>
      comments.filter((c) => {
        const ms = !search || c.text.toLowerCase().includes(search.toLowerCase()) || c.igUsername.toLowerCase().includes(search.toLowerCase());
        return ms && (clsF === 'all' || c.classification === clsF) && (statF === 'all' || c.actionStatus === statF);
      }),
    [comments, search, clsF, statF]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white/90">Comentarios</h1>
        <p className="text-sm text-white/40">Clique em um comentario para ver como a IA processou.</p>
      </div>

      {/* Filters */}
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1.5">Buscar</label>
            <input
              type="text"
              placeholder="Texto ou @usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-white/[0.06] rounded-lg text-sm bg-white/[0.04] text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#E1306C]/40 focus:border-[#E1306C]/40"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-white/40 mb-1.5">
              Classificacao <HelpBadge text="Tipo de comentario identificado pela IA" />
            </label>
            <select value={clsF} onChange={(e) => setClsF(e.target.value)} className="w-full px-3 py-2 border border-white/[0.06] rounded-lg text-sm bg-white/[0.04] text-white/90 focus:outline-none focus:ring-2 focus:ring-[#E1306C]/40">
              <option value="all">Todas</option>
              {Object.entries(CLS).map(([k, v]) => (
                <option key={k} value={k}>{v.l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-white/40 mb-1.5">
              Status <HelpBadge text="O que aconteceu apos classificacao" />
            </label>
            <select value={statF} onChange={(e) => setStatF(e.target.value)} className="w-full px-3 py-2 border border-white/[0.06] rounded-lg text-sm bg-white/[0.04] text-white/90 focus:outline-none focus:ring-2 focus:ring-[#E1306C]/40">
              <option value="all">Todos</option>
              {Object.entries(STAT).map(([k, v]) => (
                <option key={k} value={k}>{v.l}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <span className="text-sm text-white/40">{filtered.length}/{comments.length}</span>
          </div>
        </div>
      </div>

      {/* AI Explainer */}
      {selected && <AiExplainer comment={selected} />}

      {/* Table */}
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.04] border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-white/70">Usuario</th>
                <th className="px-4 py-3 text-left font-semibold text-white/70">Comentario</th>
                <th className="px-4 py-3 text-left font-semibold text-white/70">Classificacao</th>
                <th className="px-4 py-3 text-left font-semibold text-white/70">Sentimento</th>
                <th className="px-4 py-3 text-left font-semibold text-white/70">Intencao</th>
                <th className="px-4 py-3 text-left font-semibold text-white/70">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-white/70">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((c) => {
                const cl = CLS[c.classification];
                const st = STAT[c.actionStatus];
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(selected?.id === c.id ? null : c)}
                    className={`cursor-pointer transition-colors ${selected?.id === c.id ? 'bg-[#E1306C]/[0.06]' : 'hover:bg-white/[0.04]'}`}
                  >
                    <td className="px-4 py-3 font-medium text-white/90">@{c.igUsername}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-white/70 line-clamp-2">{c.text}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Tooltip text={cl?.desc || ''}>
                        <Badge className={cl?.bg || ''}>{cl?.l}</Badge>
                      </Tooltip>
                    </td>
                    <td className="px-4 py-3 w-32"><SentBar v={c.sentiment} /></td>
                    <td className="px-4 py-3 w-32"><IntBar v={c.purchaseIntent} /></td>
                    <td className="px-4 py-3">
                      <Tooltip text={st?.desc || ''}>
                        <Badge className={st?.bg || ''}>{st?.l}</Badge>
                      </Tooltip>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="px-2 py-1 rounded-lg bg-[#E1306C]/10 text-[#E1306C] text-xs hover:bg-[#E1306C]/15 font-medium">Responder</button>
                        <button className="px-2 py-1 rounded-lg bg-white/[0.04] text-white/40 text-xs hover:bg-white/[0.06] font-medium">Ocultar</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState icon="💬" title="Nenhum comentario" description="Ajuste os filtros." />}
      </div>
    </div>
  );
}
