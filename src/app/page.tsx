'use client';

import { useMemo } from 'react';
import { useApp } from '@/context/app-context';
import { generateMockComments, generateMockSessions, DEMO_METRICS } from '@/lib/mock-data';
import { CLS, STAT, SSTAT } from '@/lib/design-tokens';
import { Badge, Tooltip, HelpBadge, KPI, InfoCard } from '@/components/ui';
import { BarChart3 } from '@/components/icons';

export default function DashboardPage() {
  const { isDemo } = useApp();
  const comments = useMemo(() => generateMockComments(8), []);
  const sessions = useMemo(() => generateMockSessions(6), []);
  const m = DEMO_METRICS;
  const activeSes = sessions.filter((s) => ['active', 'waiting_reply', 'escalated'].includes(s.status));
  const pendingCount = useMemo(() => generateMockComments(40).filter((c) => c.actionStatus === 'pending').length, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <BarChart3 size={20} className="text-[#E1306C]" />
            <h1 className="text-xl font-bold text-white/90">Dashboard</h1>
          </div>
          <p className="text-xs text-white/30 mt-1">Visao geral da automacao Instagram</p>
        </div>
        {isDemo && <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-sm px-3 py-1">Modo Demo</Badge>}
      </div>

      {isDemo && (
        <InfoCard icon="💡" title="Modo Demo Ativo">
          Dados simulados. Para conectar sua conta real, va em <strong className="text-white/70">Contas</strong> → <strong className="text-white/70">&quot;Conectar Conta&quot;</strong>.
          Apos conectar, a IA comeca a responder automaticamente.
        </InfoCard>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Pendentes" value={pendingCount} color="#f59e0b" sub="Aguardando" help="Comentarios que ainda nao foram processados pela IA" pulse />
        <KPI title="Conversas Ativas" value={activeSes.length} color="#3b82f6" sub="DMs em andamento" help="Sessoes de DM ativas neste momento" pulse />
        <KPI title="Tempo Medio" value={`${m.responseTimeAvg}s`} color="#22c55e" sub="De resposta" help="Tempo medio entre receber um comentario e responder" />
        <KPI title="Conversao" value={`${(m.conversionRate * 100).toFixed(1)}%`} color="#6366f1" sub="Prospect→Cliente" help="% de prospects que viraram clientes" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Comentarios" value={m.totalComments.toLocaleString()} color="#3b82f6" sub="30 dias" />
        <KPI title="DMs" value={m.totalDMs.toLocaleString()} color="#22c55e" sub="30 dias" />
        <KPI title="Auto-Replies" value={m.totalAutoReplies.toLocaleString()} color="#6366f1" sub="Automaticos" help="Respostas enviadas automaticamente" />
        <KPI title="Escalados" value={m.totalEscalated} color="#ef4444" sub="Para humano" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-white/50">Classificacao IA</h3>
            <HelpBadge text="A IA classifica cada comentario automaticamente" />
          </div>
          <div className="space-y-2.5">
            {m.classifications.map((item) => {
              const max = m.classifications[0].count;
              const cl = CLS[item.cls];
              return (
                <div key={item.cls}>
                  <div className="flex items-center gap-3">
                    <Tooltip text={cl?.desc || ''}>
                      <span className="text-xs w-24 text-right text-white/30 cursor-help">{cl?.l}</span>
                    </Tooltip>
                    <div className="flex-1 bg-white/[0.06] rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2 text-xs text-white font-semibold transition-all"
                        style={{ width: `${(item.count / max) * 100}%`, backgroundColor: cl?.c, minWidth: '2.5rem' }}
                      >
                        {item.count}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
          <h3 className="text-sm font-semibold text-white/50 mb-4">Comentarios Recentes</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {comments.map((c) => {
              const cl = CLS[c.classification];
              const st = STAT[c.actionStatus];
              return (
                <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.04] transition-all duration-200">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: cl?.c }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white/90">@{c.igUsername}</span>
                      <Badge className={cl?.bg || ''}>{cl?.l}</Badge>
                      <Badge className={st?.bg || ''}>{st?.l}</Badge>
                    </div>
                    <p className="text-sm text-white/50 truncate mt-0.5">{c.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold text-white/50">Sessoes DM Ativas</h3>
          <HelpBadge text="DMs em andamento. Escaladas precisam atencao humana." />
        </div>
        {activeSes.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-8">Nenhuma sessao ativa</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/30 border-b border-white/[0.06]">
                  <th className="pb-3 font-medium">Usuario</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Msgs</th>
                  <th className="pb-3 font-medium">Ultima Mensagem</th>
                  <th className="pb-3 font-medium">Origem</th>
                </tr>
              </thead>
              <tbody>
                {activeSes.map((s) => {
                  const sc = SSTAT[s.status] || SSTAT.active;
                  return (
                    <tr key={s.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.04] transition-all duration-200">
                      <td className="py-3 font-medium text-white/90">@{s.igUsername}</td>
                      <td className="py-3">
                        <Badge className={sc.bg}>
                          {s.status === 'active' && <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse`} />}
                          {sc.l}
                        </Badge>
                      </td>
                      <td className="py-3 text-white/70">{s.messageCount}</td>
                      <td className="py-3 text-white/50 max-w-[200px] truncate">{s.lastUserMessage}</td>
                      <td className="py-3">
                        <Badge className="bg-white/[0.04] text-white/30 border-white/[0.06]">{s.origin}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
