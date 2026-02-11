'use client';

import { DEMO_RULES } from '@/lib/mock-data';
import { TRG, ACT } from '@/lib/design-tokens';
import { Badge, Tooltip, Toggle, InfoCard } from '@/components/ui';
import { Zap, Bot } from '@/components/icons';

export default function RulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/90">Regras Auto-Reply</h1>
          <p className="text-sm text-white/40">Prioridade menor = executa primeiro. A IA personaliza respostas se ativado.</p>
        </div>
        <button className="px-4 py-2.5 bg-[#E1306C] text-white rounded-xl text-sm font-medium hover:bg-[#E1306C]/80 shadow-sm">
          + Nova Regra
        </button>
      </div>

      <InfoCard icon={<Zap size={48} />} title="Pipeline de processamento">
        1) Comentario chega → 2) IA classifica → 3) Regras sao percorridas por prioridade → 4) Primeira match executa a acao →
        5) Prospect e atualizado no CRM com tags. O <strong>delay humanizado</strong> faz a resposta parecer natural.
      </InfoCard>

      <div className="space-y-3">
        {DEMO_RULES.map((r) => {
          const lp = r.maxRepliesPerDay > 0 ? (r.repliesToday / r.maxRepliesPerDay) * 100 : 0;
          return (
            <div key={r.id} className={`bg-white/[0.03] rounded-xl border border-white/[0.06] p-5 hover:shadow-lg hover:shadow-white/[0.02] transition-all ${!r.isActive ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Tooltip text="Menor = mais urgente">
                    <span className="text-xl font-bold text-white/20 w-10 text-center cursor-help">#{r.priority}</span>
                  </Tooltip>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white/90">{r.name}</h3>
                      <Badge className={r.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/[0.04] text-white/40 border-white/[0.06]'}>
                        {r.isActive ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/40">{r.description}</p>
                  </div>
                </div>
                <Toggle enabled={r.isActive} onChange={() => {}} />
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <Tooltip text={`Quando: ${TRG[r.triggerType] || r.triggerType} = ${r.triggerValue || 'qualquer'}`}>
                  <Badge className="bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/20">{TRG[r.triggerType] || r.triggerType}</Badge>
                </Tooltip>
                <Badge className={(ACT[r.actionType]?.bg || 'bg-white/[0.04] text-white/40') + ' border-white/[0.06]'}>
                  {ACT[r.actionType]?.l || r.actionType}
                </Badge>
                {r.useAiPersonalization && (
                  <Tooltip text="IA personaliza com base no contexto">
                    <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 flex items-center gap-1"><Bot size={14} /> IA</Badge>
                  </Tooltip>
                )}
                <Badge className="bg-white/[0.04] text-white/40 border-white/[0.06]">{r.delaySeconds}s delay</Badge>
              </div>

              {r.replyTemplates?.length > 0 && (
                <div className="mt-3 p-3 bg-white/[0.04] rounded-lg border border-white/[0.06]">
                  <p className="text-xs font-medium text-white/40 mb-1">Template:</p>
                  <p className="text-sm text-white/70 italic">&quot;{r.replyTemplates[0]}&quot;</p>
                  <p className="text-xs text-white/30 mt-1">{'{{username}}'} = nome do usuario. IA personaliza se ativo.</p>
                </div>
              )}

              <div className="flex items-center gap-6 mt-4 pt-3 border-t border-white/[0.06]">
                <span className="text-xs text-white/40">
                  Matches: <strong className="text-white/90">{r.totalMatches}</strong>
                </span>
                <span className="text-xs text-white/40">
                  Enviadas: <strong className="text-white/90">{r.totalRepliesSent}</strong>
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30">Hoje:</span>
                    <div className="flex-1 max-w-32 bg-white/[0.06] rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${lp > 80 ? 'bg-red-500' : lp > 50 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                        style={{ width: `${lp}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-white/70">{r.repliesToday}/{r.maxRepliesPerDay}</span>
                  </div>
                </div>
                {r.crmTags?.length > 0 && (
                  <span className="text-xs text-white/30">
                    {r.crmTags.map((t) => (
                      <Badge key={t} className="bg-white/[0.04] text-white/40 border-white/[0.06] ml-1">{t}</Badge>
                    ))}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
