'use client';

import { DEMO_FLOWS } from '@/lib/mock-data';
import { FTRG, FST } from '@/lib/design-tokens';
import { Badge, Tooltip, Toggle, InfoCard } from '@/components/ui';

export default function FlowsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/90">Fluxos Conversacionais</h1>
          <p className="text-sm text-white/40">Sequencias automaticas de mensagens para DMs. A IA segue cada etapa.</p>
        </div>
        <button className="px-4 py-2.5 bg-[#E1306C] text-white rounded-xl text-sm font-medium hover:bg-[#E1306C]/80 shadow-sm">
          + Novo Fluxo
        </button>
      </div>

      <InfoCard icon="🔄" title="Como funcionam?">
        Quando uma DM chega, o sistema verifica qual fluxo ativar (por trigger). O fluxo guia a conversa passo a passo:
        envia perguntas, coleta respostas, toma decisoes. Se o caso for complexo, escala para humano automaticamente.
      </InfoCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_FLOWS.map((f) => {
          const sc = FST[f.status] || FST.draft;
          const r = f.totalSessions > 0 ? ((f.totalCompleted / f.totalSessions) * 100).toFixed(0) : '0';
          return (
            <div key={f.id} className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white/90 mb-1">{f.name}</h3>
                  <Badge className={sc.bg}>{sc.l}</Badge>
                </div>
                <Toggle enabled={f.status === 'active'} onChange={() => {}} size="sm" />
              </div>

              <p className="text-sm text-white/40 mb-4">{f.description}</p>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">{FTRG[f.trigger] || f.trigger}</Badge>
                {f.triggerKeywords && (
                  <Tooltip text={`Keywords: ${f.triggerKeywords.join(', ')}`}>
                    <Badge className="bg-white/[0.06] text-white/40 border-white/[0.06]">{f.triggerKeywords.length} keywords</Badge>
                  </Tooltip>
                )}
                {f.useAi && <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20">🤖 IA</Badge>}
                <Badge className="bg-white/[0.06] text-white/40 border-white/[0.06]">{f.steps} etapas</Badge>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/[0.06]">
                <div className="text-center">
                  <div className="text-lg font-bold text-[#E1306C]">{f.totalSessions}</div>
                  <div className="text-xs text-white/30">Sessoes</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-400">{f.totalCompleted}</div>
                  <div className="text-xs text-white/30">OK</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-400">{f.totalEscalated}</div>
                  <div className="text-xs text-white/30">Escaladas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white/90">{r}%</div>
                  <div className="text-xs text-white/30">Sucesso</div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-white/[0.06]">
                <button className="flex-1 px-3 py-2 text-xs bg-white/[0.06] text-white/70 rounded-lg hover:bg-white/[0.08] font-medium text-center">
                  Editar
                </button>
                <button className="px-3 py-2 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/15 font-medium">
                  Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
