export const CLS: Record<string, { l: string; c: string; bg: string; desc: string }> = {
  duvida: { l: 'Dúvida', c: '#3b82f6', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', desc: 'Perguntas sobre produtos, uso ou disponibilidade' },
  elogio: { l: 'Elogio', c: '#22c55e', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', desc: 'Feedbacks positivos e agradecimentos' },
  preco: { l: 'Preço', c: '#f59e0b', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', desc: 'Perguntas sobre valor, desconto ou tabela' },
  interesse: { l: 'Interesse', c: '#8b5cf6', bg: 'bg-violet-500/10 text-violet-400 border-violet-500/20', desc: 'Intenção clara de compra ou pedido' },
  reclamacao: { l: 'Reclamação', c: '#ef4444', bg: 'bg-red-500/10 text-red-400 border-red-500/20', desc: 'Feedbacks negativos ou problemas' },
  spam: { l: 'Spam', c: '#94a3b8', bg: 'bg-white/[0.04] text-white/40 border-white/[0.06]', desc: 'Conteúdo irrelevante ou promocional indesejado' },
  suporte: { l: 'Suporte', c: '#06b6d4', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', desc: 'Pedidos de ajuda com pedidos ou produtos' },
  parceria: { l: 'Parceria', c: '#ec4899', bg: 'bg-pink-500/10 text-pink-400 border-pink-500/20', desc: 'Propostas de parceria ou influenciadores' },
};

export const STAT: Record<string, { l: string; bg: string; desc: string }> = {
  pending: { l: 'Pendente', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', desc: 'Aguardando processamento' },
  auto_replied: { l: 'Auto-reply', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', desc: 'IA respondeu automaticamente' },
  dm_invited: { l: 'DM Enviada', bg: 'bg-violet-500/10 text-violet-400 border-violet-500/20', desc: 'Convite enviado para conversa DM' },
  escalated: { l: 'Escalado', bg: 'bg-red-500/10 text-red-400 border-red-500/20', desc: 'Encaminhado para atendente humano' },
  ignored: { l: 'Ignorado', bg: 'bg-white/[0.04] text-white/40 border-white/[0.06]', desc: 'Marcado como irrelevante (spam)' },
  manually_replied: { l: 'Resp. Manual', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', desc: 'Respondido manualmente por operador' },
};

export const SSTAT: Record<string, { l: string; bg: string; dot: string }> = {
  active: { l: 'Ativa', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500' },
  waiting_reply: { l: 'Aguardando', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-500' },
  escalated: { l: 'Escalada', bg: 'bg-red-500/10 text-red-400 border-red-500/20', dot: 'bg-red-500' },
  human_takeover: { l: 'Humano', bg: 'bg-violet-500/10 text-violet-400 border-violet-500/20', dot: 'bg-violet-500' },
  completed: { l: 'Concluída', bg: 'bg-white/[0.04] text-white/40 border-white/[0.06]', dot: 'bg-white/30' },
};

export const TRG: Record<string, string> = {
  classification: 'Classificação IA',
  keyword: 'Palavra-chave',
  sentiment: 'Sentimento',
  purchase_intent: 'Intenção Compra',
  all_comments: 'Todos',
};

export const ACT: Record<string, { l: string; bg: string }> = {
  reply_public: { l: 'Resp. Pública', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  reply_dm: { l: 'Enviar DM', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  reply_both: { l: 'Público + DM', bg: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  escalate: { l: 'Escalar', bg: 'bg-red-500/10 text-red-400 border-red-500/20' },
  ignore: { l: 'Ignorar', bg: 'bg-white/[0.04] text-white/40 border-white/[0.06]' },
  tag_only: { l: 'Só Classificar', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
};

export const FTRG: Record<string, string> = {
  new_dm: 'Nova DM',
  keyword: 'Palavra-chave',
  comment_escalation: 'Escalação',
  campaign_reply: 'Campanha',
  manual: 'Manual',
};

export const FST: Record<string, { l: string; bg: string }> = {
  draft: { l: 'Rascunho', bg: 'bg-white/[0.04] text-white/40 border-white/[0.06]' },
  active: { l: 'Ativo', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  paused: { l: 'Pausado', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  archived: { l: 'Arquivado', bg: 'bg-white/[0.04] text-white/30 border-white/[0.04]' },
};

// ─── Feed / Post statuses ───────────────────────────────────
export const PST: Record<string, { l: string; c: string; bg: string; darkBg: string }> = {
  draft:     { l: 'Rascunho',   c: '#94a3b8', bg: 'bg-white/[0.04] text-white/40 border-white/[0.06]',   darkBg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  scheduled: { l: 'Agendado',   c: '#3b82f6', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',     darkBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  published: { l: 'Publicado',  c: '#22c55e', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', darkBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  failed:    { l: 'Falhou',     c: '#ef4444', bg: 'bg-red-500/10 text-red-400 border-red-500/20',       darkBg: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export const POST_METRICS: Record<string, { l: string; icon: string; fmt: (v: number) => string }> = {
  reach:       { l: 'Alcance',      icon: 'eye',        fmt: (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v) },
  impressions: { l: 'Impressoes',    icon: 'bar-chart',  fmt: (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v) },
  engagement:  { l: 'Engajamento',   icon: 'heart',      fmt: (v) => `${(v * 100).toFixed(1)}%` },
  saves:       { l: 'Salvamentos',   icon: 'bookmark',   fmt: (v) => String(v) },
};

export const INFLUENCER_NICHES: Record<string, { l: string; c: string; emoji: string }> = {
  tech:       { l: 'Tecnologia',    c: '#3b82f6', emoji: '💻' },
  health:     { l: 'Saude',         c: '#22c55e', emoji: '🏥' },
  beauty:     { l: 'Beleza',        c: '#ec4899', emoji: '💄' },
  lifestyle:  { l: 'Lifestyle',     c: '#f59e0b', emoji: '✨' },
  fitness:    { l: 'Fitness',       c: '#ef4444', emoji: '💪' },
  education:  { l: 'Educacao',      c: '#8b5cf6', emoji: '📚' },
  business:   { l: 'Negocios',      c: '#06b6d4', emoji: '💼' },
};
