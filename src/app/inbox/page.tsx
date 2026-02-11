'use client';

import { useState } from 'react';
import { generateMockSessions } from '@/lib/mock-data';
import { SSTAT } from '@/lib/design-tokens';
import { Badge, EmptyState } from '@/components/ui';
import { Bot, Inbox } from '@/components/icons';
import type { MockSession } from '@/lib/mock-data';

export default function InboxPage() {
  const [sessions] = useState(() => generateMockSessions(12));
  const [sel, setSel] = useState<MockSession | null>(null);
  const [filter, setFilter] = useState('all');
  const filtered = sessions.filter((s) => filter === 'all' || s.status === filter);

  const msgs = sel
    ? [
        { dir: 'in' as const, text: sel.lastUserMessage, time: sel.lastActivityAt, isAi: false },
        { dir: 'out' as const, text: sel.lastBotMessage, time: new Date(new Date(sel.lastActivityAt).getTime() + 30000).toISOString(), isAi: true },
        { dir: 'in' as const, text: 'Qual o prazo de entrega?', time: new Date(new Date(sel.lastActivityAt).getTime() + 60000).toISOString(), isAi: false },
        { dir: 'out' as const, text: 'Entregamos em ate 3 dias uteis para sua regiao! Quer que eu passe as opcoes de frete?', time: new Date(new Date(sel.lastActivityAt).getTime() + 90000).toISOString(), isAi: true },
      ]
    : [];

  return (
    <div className="space-y-4" style={{ height: 'calc(100vh - 10rem)' }}>
      <div>
        <h1 className="text-2xl font-bold text-white/90">Inbox DMs</h1>
        <p className="text-sm text-white/40">
          Mensagens com <Bot className="inline text-[#E1306C]" size={16} /> foram respondidas pela IA. Clique <strong>&quot;Assumir&quot;</strong> para controle humano.
        </p>
      </div>

      <div className="flex gap-4 h-full">
        {/* Session List */}
        <div className="w-80 flex-shrink-0 bg-white/[0.03] rounded-xl border border-white/[0.06] flex flex-col">
          <div className="flex gap-1 border-b border-white/[0.06] p-2">
            {[
              { k: 'all', l: 'Todas' },
              { k: 'active', l: 'Ativas' },
              { k: 'escalated', l: 'Escaladas' },
              { k: 'human_takeover', l: 'Humano' },
            ].map((f) => (
              <button
                key={f.k}
                onClick={() => setFilter(f.k)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === f.k ? 'bg-[#E1306C] text-white' : 'text-white/40 hover:bg-white/[0.04]'
                }`}
              >
                {f.l}
                {f.k !== 'all' && ` (${sessions.filter((s) => s.status === f.k).length})`}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filtered.map((s) => {
              const sc = SSTAT[s.status] || SSTAT.active;
              return (
                <button
                  key={s.id}
                  onClick={() => setSel(s)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    sel?.id === s.id ? 'bg-[#E1306C]/[0.06] border border-[#E1306C]/20' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-white/90">@{s.igUsername}</span>
                    <Badge className={sc.bg}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {sc.l}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/40 truncate mt-1">{s.lastUserMessage}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-white/30">{s.messageCount} msgs</span>
                    <span className="text-xs text-white/30">
                      {new Date(s.lastActivityAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </button>
              );
            })}
            {!filtered.length && <div className="text-center py-12 text-sm text-white/30">Nenhuma sessao</div>}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white/[0.03] rounded-xl border border-white/[0.06] flex flex-col">
          {sel ? (
            <>
              <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.04] rounded-t-xl">
                <div>
                  <span className="font-semibold text-white/90">@{sel.igUsername}</span>
                  <Badge className={`ml-2 ${(SSTAT[sel.status] || SSTAT.active).bg}`}>
                    {(SSTAT[sel.status] || SSTAT.active).l}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {sel.status !== 'human_takeover' && (
                    <button className="px-3 py-1.5 text-xs bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/15 font-medium">
                      Assumir
                    </button>
                  )}
                  <button className="px-3 py-1.5 text-xs bg-white/[0.06] text-white/40 rounded-lg hover:bg-white/[0.08] font-medium">
                    Encerrar
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.dir === 'out' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        m.dir === 'out' ? 'bg-[#E1306C] text-white rounded-br-md' : 'bg-white/[0.06] text-white/90 rounded-bl-md'
                      }`}
                    >
                      {m.isAi && <p className="text-[10px] font-medium mb-1 opacity-60 flex items-center gap-1"><Bot size={12} /> Resposta IA</p>}
                      <p className="text-sm">{m.text}</p>
                      <p className={`text-xs mt-1 ${m.dir === 'out' ? 'text-white/50' : 'text-white/40'}`}>
                        {new Date(m.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.04] rounded-b-xl text-xs text-white/40 flex items-center gap-2">
                <span>Origem: <strong className="text-white/70">{sel.origin}</strong></span>
                <span>|</span>
                <span>Msgs: <strong className="text-white/70">{sel.messageCount}</strong></span>
                {sel.status !== 'human_takeover' && (
                  <>
                    <span>|</span>
                    <span className="text-[#E1306C] font-medium flex items-center gap-1"><Bot size={12} /> IA respondendo</span>
                  </>
                )}
              </div>
            </>
          ) : (
            <EmptyState icon={<Inbox size={48} />} title="Selecione uma conversa" description="Clique em uma sessao a esquerda. Mensagens com IA foram respondidas automaticamente." />
          )}
        </div>
      </div>
    </div>
  );
}
