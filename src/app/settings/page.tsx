'use client';

import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { Badge, HelpBadge, Toggle, EmptyState, InfoCard } from '@/components/ui';
import ConnectModal from '@/components/connect-modal';
import { Smartphone, Link2, MessageCircle, Inbox, Bot } from '@/components/icons';

export default function SettingsPage() {
  const { accounts, setAccounts, isDemo, config } = useApp();
  const [expanded, setExpanded] = useState<string | null>(accounts[0]?.id || null);
  const [showConnect, setShowConnect] = useState(false);

  const toggle = (id: string, feat: 'autoReplyComments' | 'autoReplyDMs' | 'aiClassification') =>
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, features: { ...a.features, [feat]: !a.features[feat] } } : a
      )
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/90">Contas Instagram</h1>
          <p className="text-sm text-white/40">Gerencie conexoes e ative recursos por conta.</p>
        </div>
        <button
          onClick={() => setShowConnect(true)}
          className="px-4 py-2.5 text-white rounded-xl text-sm font-medium shadow-sm hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#833AB4,#E1306C,#F77737)' }}
        >
          + Conectar Conta
        </button>
      </div>

      {showConnect && (
        <ConnectModal
          onClose={() => setShowConnect(false)}
          onConnect={(a: any) => setAccounts((p) => [a, ...p])}
          config={config}
        />
      )}

      {accounts.length === 0 ? (
        <EmptyState
          icon={<Smartphone size={48} />}
          title="Nenhuma conta conectada"
          description="Conecte sua conta Instagram Business para a IA comecar a responder automaticamente."
          action="Conectar Primeira Conta"
          onAction={() => setShowConnect(true)}
        />
      ) : (
        <>
          <InfoCard icon={<Link2 size={48} />} title="Ao conectar, a IA comeca automaticamente">
            Quando voce conecta uma conta e ativa os recursos abaixo, a IA passa a: classificar comentarios em tempo real,
            responder automaticamente conforme as regras, gerenciar DMs com fluxos conversacionais, e registrar tudo no CRM.
            {isDemo && (
              <>
                <br />
                <strong className="text-amber-400">Demo:</strong> Contas simuladas. Conecte uma real para substituir.
              </>
            )}
          </InfoCard>

          <div className="space-y-4">
            {accounts.map((a) => {
              const exp = expanded === a.id;
              const days = Math.ceil((new Date(a.tokenExpiresAt).getTime() - Date.now()) / 864e5);
              const tCls =
                days < 0
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : days < 14
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
              const tTxt = days < 0 ? 'Expirado' : days < 14 ? `Expira em ${days}d` : `Valido ${days}d`;

              return (
                <div key={a.id} className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden hover:shadow-lg hover:shadow-white/[0.02] transition-all">
                  <button
                    onClick={() => setExpanded(exp ? null : a.id)}
                    className="w-full text-left p-5 flex items-center justify-between hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                        style={{ background: 'linear-gradient(135deg,#E1306C,#833AB4,#F77737)' }}
                      >
                        {a.username[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white/90">@{a.username}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">&#10003; Ativa</Badge>
                          <span className="text-xs text-white/30">
                            Conectada {new Date(a.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={tCls}>{tTxt}</Badge>
                      <span className="text-white/20 text-lg">{exp ? '▾' : '▸'}</span>
                    </div>
                  </button>

                  {exp && (
                    <>
                      <div className="border-t border-white/[0.06] p-6 bg-white/[0.02] space-y-6">
                        {/* Stats */}
                        <div>
                          <h4 className="text-sm font-semibold text-white/90 mb-3">Estatisticas</h4>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              ['Comentarios', a.totalCommentsProcessed, <MessageCircle key="mc" size={32} className="text-white/70 mx-auto" />],
                              ['DMs', a.totalDmsProcessed, <Inbox key="ib" size={32} className="text-white/70 mx-auto" />],
                              ['Auto-replies', a.totalAutoReplies, <Bot key="bt" size={32} className="text-white/70 mx-auto" />],
                            ].map(([l, v, e]) => (
                              <div key={String(l)} className="bg-white/[0.04] rounded-xl p-4 text-center border border-white/[0.06]">
                                <div className="text-2xl">{e}</div>
                                <div className="text-xl font-bold text-white/90 mt-1">
                                  {typeof v === 'number' ? v.toLocaleString() : v}
                                </div>
                                <div className="text-xs text-white/40">{l}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Features */}
                        <div>
                          <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                            Recursos <HelpBadge text="Ative/desative por conta. Ao ativar, a IA comeca a processar imediatamente." />
                          </h4>
                          <div className="bg-white/[0.03] rounded-xl p-4 space-y-3 border border-white/[0.06]">
                            {([
                              ['Auto-responder comentarios', 'autoReplyComments', 'IA classifica e responde comentarios automaticamente com base nas regras configuradas'],
                              ['Auto-responder DMs', 'autoReplyDMs', 'Fluxos conversacionais respondem DMs automaticamente. Escala para humano se necessario.'],
                              ['Classificacao com IA', 'aiClassification', 'GPT-4o-mini analisa sentimento, intencao de compra e classifica cada mensagem'],
                            ] as const).map(([label, key, desc]) => (
                              <div key={key} className="flex items-center justify-between py-1">
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-white/70">{label}</span>
                                  <p className="text-xs text-white/30">{desc}</p>
                                </div>
                                <Toggle enabled={a.features[key]} onChange={() => toggle(a.id, key)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="border-t border-white/[0.06] p-4 bg-white/[0.02] flex gap-2">
                        <button className="flex-1 px-4 py-2.5 rounded-xl bg-[#E1306C]/10 text-[#E1306C] text-sm font-medium hover:bg-[#E1306C]/15">
                          Editar
                        </button>
                        <button className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 text-sm font-medium hover:bg-amber-500/15">
                          Renovar Token
                        </button>
                        <button className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/15">
                          Desconectar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
