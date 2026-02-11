/**
 * Mock data layer — Demo Mode.
 * Em produção, substituído por chamadas ao backend NestJS via apiClient.
 */

const USERS = [
  'joana.silva', 'marcos_fit', 'farmacia.central', 'dra.patricia',
  'saude_natural', 'lucas.med', 'paula_pf', 'rede_farma',
  'ana.estetica', 'vitor.sales', 'bio_essence', 'mari_dermato',
];

const COMMENTS_POOL = [
  { text: 'Quanto custa esse produto? Tem promoção?', cls: 'preco', sent: 0.1, intent: 0.8 },
  { text: 'Amei! Produto maravilhoso, já uso há meses', cls: 'elogio', sent: 0.9, intent: 0.2 },
  { text: 'Quero comprar! Como faço pedido?', cls: 'interesse', sent: 0.5, intent: 0.95 },
  { text: 'Vocês fazem entrega para o Rio de Janeiro?', cls: 'duvida', sent: 0.0, intent: 0.6 },
  { text: 'Esse produto serve pra pele oleosa?', cls: 'duvida', sent: 0.1, intent: 0.5 },
  { text: 'Comprei e não recebi ainda, péssimo atendimento', cls: 'reclamacao', sent: -0.8, intent: 0.0 },
  { text: 'Sigam @promoção_falsa ganhem dinheiro!!!', cls: 'spam', sent: 0.0, intent: 0.0 },
  { text: 'Parabéns pelo trabalho! Top demais', cls: 'elogio', sent: 0.85, intent: 0.15 },
  { text: 'Tem desconto pra farmácia? Quero revender', cls: 'interesse', sent: 0.3, intent: 0.9 },
  { text: 'O produto quebrou depois de 2 dias', cls: 'suporte', sent: -0.6, intent: 0.0 },
  { text: 'Aceita parceria? Tenho 50k seguidores', cls: 'parceria', sent: 0.2, intent: 0.0 },
  { text: 'Qual a diferença do normal pro premium?', cls: 'duvida', sent: 0.0, intent: 0.7 },
  { text: 'Tem tabela de preço por quantidade?', cls: 'preco', sent: 0.0, intent: 0.85 },
  { text: 'Melhor produto que já usei na vida!', cls: 'elogio', sent: 0.95, intent: 0.3 },
  { text: 'Preciso de ajuda com meu pedido #12345', cls: 'suporte', sent: -0.3, intent: 0.0 },
];

const STATUSES = ['pending', 'auto_replied', 'dm_invited', 'escalated', 'ignored', 'manually_replied'];
const SW = [15, 40, 15, 10, 10, 10];

function weightedRandom(items: string[], weights: number[]): string {
  const total = weights.reduce((s, v) => s + v, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[0];
}

function randomDate(daysBack: number): string {
  return new Date(Date.now() - Math.random() * daysBack * 864e5).toISOString();
}

export interface MockComment {
  id: string;
  igUsername: string;
  text: string;
  igTimestamp: string;
  classification: string;
  classificationConfidence: number;
  sentiment: number;
  purchaseIntent: number;
  actionStatus: string;
  replyText: string | null;
  aiReply: string | null;
}

export function generateMockComments(n: number): MockComment[] {
  return Array.from({ length: n }, (_, i) => {
    const c = COMMENTS_POOL[Math.floor(Math.random() * COMMENTS_POOL.length)];
    return {
      id: `cmt-${i + 1}`,
      igUsername: USERS[Math.floor(Math.random() * USERS.length)],
      text: c.text,
      igTimestamp: randomDate(30),
      classification: c.cls,
      classificationConfidence: 0.7 + Math.random() * 0.3,
      sentiment: Math.max(-1, Math.min(1, c.sent + (Math.random() * 0.2 - 0.1))),
      purchaseIntent: Math.max(0, Math.min(1, c.intent + (Math.random() * 0.1 - 0.05))),
      actionStatus: weightedRandom(STATUSES, SW),
      replyText: Math.random() > 0.4 ? 'Obrigado pelo comentário! Veja mais detalhes no DM.' : null,
      aiReply: Math.random() > 0.3 ? 'Olá! Obrigado pelo seu interesse. Posso ajudar com mais informações sobre nossos produtos. Vou te enviar os detalhes por DM!' : null,
    };
  }).sort((a, b) => new Date(b.igTimestamp).getTime() - new Date(a.igTimestamp).getTime());
}

export interface MockSession {
  id: string;
  igUsername: string;
  status: string;
  messageCount: number;
  lastUserMessage: string;
  lastBotMessage: string;
  lastActivityAt: string;
  origin: string;
}

export function generateMockSessions(n: number): MockSession[] {
  const statuses = ['active', 'waiting_reply', 'escalated', 'human_takeover', 'completed'];
  const messages = [
    'Olá, quero saber sobre preços',
    'Vocês entregam no RJ?',
    'Quero comprar em quantidade',
    'Preciso de suporte',
    'Vi no Instagram que vocês têm promoção',
  ];
  return Array.from({ length: n }, (_, i) => ({
    id: `ses-${i + 1}`,
    igUsername: USERS[i % USERS.length],
    status: statuses[Math.floor(Math.random() * 3)],
    messageCount: 2 + Math.floor(Math.random() * 15),
    lastUserMessage: messages[i % messages.length],
    lastBotMessage: 'Claro! Vou te ajudar com isso.',
    lastActivityAt: randomDate(2),
    origin: ['organic', 'comment_invite', 'campaign'][Math.floor(Math.random() * 3)],
  }));
}

export interface MockAccount {
  id: string;
  username: string;
  igAccountId: string;
  fbPageId: string;
  status: string;
  tokenExpiresAt: string;
  features: { autoReplyComments: boolean; autoReplyDMs: boolean; aiClassification: boolean };
  totalCommentsProcessed: number;
  totalDmsProcessed: number;
  totalAutoReplies: number;
  createdAt: string;
}

export const DEMO_ACCOUNTS: MockAccount[] = [
  {
    id: 'acc-1',
    username: 'dryon_farma',
    igAccountId: '17841400012345',
    fbPageId: '123456789',
    status: 'active',
    tokenExpiresAt: new Date(Date.now() + 45 * 864e5).toISOString(),
    features: { autoReplyComments: true, autoReplyDMs: true, aiClassification: true },
    totalCommentsProcessed: 1247,
    totalDmsProcessed: 389,
    totalAutoReplies: 892,
    createdAt: '2025-11-15T10:00:00Z',
  },
  {
    id: 'acc-2',
    username: 'axl_farma_oficial',
    igAccountId: '17841400067890',
    fbPageId: '987654321',
    status: 'active',
    tokenExpiresAt: new Date(Date.now() + 20 * 864e5).toISOString(),
    features: { autoReplyComments: true, autoReplyDMs: false, aiClassification: true },
    totalCommentsProcessed: 523,
    totalDmsProcessed: 145,
    totalAutoReplies: 312,
    createdAt: '2026-01-03T10:00:00Z',
  },
];

export const DEMO_RULES = [
  { id: 'r-1', name: 'Interesse de Compra → DM', description: 'Quando IA detecta interesse, convida para DM com detalhes.', priority: 10, isActive: true, triggerType: 'classification', triggerValue: 'interesse', actionType: 'reply_both', useAiPersonalization: true, delaySeconds: 45, maxRepliesPerDay: 100, repliesToday: 37, totalMatches: 412, totalRepliesSent: 398, replyTemplates: ['Olá @{{username}}! Vi que você se interessou! Te mandei detalhes por DM'], crmTags: ['lead_quente', 'instagram'] },
  { id: 'r-2', name: 'Elogio → Agradecimento', description: 'Agradece elogios automaticamente com toque pessoal.', priority: 20, isActive: true, triggerType: 'classification', triggerValue: 'elogio', actionType: 'reply_public', useAiPersonalization: true, delaySeconds: 60, maxRepliesPerDay: 200, repliesToday: 12, totalMatches: 289, totalRepliesSent: 285, replyTemplates: ['Muito obrigado pelo carinho @{{username}}!'], crmTags: ['cliente_satisfeito'] },
  { id: 'r-3', name: 'Reclamação → Escalar', description: 'Reclamações são escaladas para atendimento humano imediatamente.', priority: 5, isActive: true, triggerType: 'sentiment', triggerValue: '-0.5', actionType: 'escalate', useAiPersonalization: false, delaySeconds: 15, maxRepliesPerDay: 50, repliesToday: 3, totalMatches: 67, totalRepliesSent: 64, replyTemplates: ['@{{username}} pedimos desculpas! Nossa equipe está verificando.'], crmTags: ['suporte_urgente'] },
  { id: 'r-4', name: 'Spam → Ocultar', description: 'Comentários de spam são ocultados automaticamente.', priority: 1, isActive: true, triggerType: 'classification', triggerValue: 'spam', actionType: 'ignore', useAiPersonalization: false, delaySeconds: 5, maxRepliesPerDay: 500, repliesToday: 8, totalMatches: 156, totalRepliesSent: 0, replyTemplates: [], crmTags: [] },
  { id: 'r-5', name: 'Dúvida → Resposta IA', description: 'IA gera resposta personalizada para dúvidas sobre produtos.', priority: 30, isActive: true, triggerType: 'classification', triggerValue: 'duvida', actionType: 'reply_public', useAiPersonalization: true, delaySeconds: 30, maxRepliesPerDay: 150, repliesToday: 22, totalMatches: 198, totalRepliesSent: 190, replyTemplates: ['Oi @{{username}}! Boa pergunta!'], crmTags: ['duvida_produto'] },
];

export const DEMO_FLOWS = [
  { id: 'f-1', name: 'Boas-vindas DM', description: 'Fluxo automático de boas-vindas quando alguém envia DM pela primeira vez.', trigger: 'new_dm', status: 'active', useAi: true, totalSessions: 245, totalCompleted: 198, totalEscalated: 32, steps: 4, triggerKeywords: null as string[] | null },
  { id: 'f-2', name: 'Consulta de Preço', description: 'Ativado quando cliente pergunta preço. Coleta informações do produto.', trigger: 'keyword', triggerKeywords: ['preço', 'quanto custa', 'valor', 'tabela'], status: 'active', useAi: true, totalSessions: 167, totalCompleted: 143, totalEscalated: 18, steps: 5 },
  { id: 'f-3', name: 'Suporte Pós-Venda', description: 'Atendimento para problemas com pedidos.', trigger: 'keyword', triggerKeywords: ['problema', 'defeito', 'reclamação', 'pedido'], status: 'active', useAi: false, totalSessions: 89, totalCompleted: 45, totalEscalated: 38, steps: 6 },
  { id: 'f-4', name: 'Parceria / Influencer', description: 'Fluxo para propostas de parceria.', trigger: 'comment_escalation', status: 'paused', useAi: false, totalSessions: 34, totalCompleted: 28, totalEscalated: 6, steps: 3, triggerKeywords: null as string[] | null },
];

// ─── Feed / Posts ──────────────────────────────────────────

export interface MockPost {
  id: string;
  mediaType: 'image' | 'carousel' | 'reel';
  imageUrl: string;
  caption: string;
  hashtags: string[];
  scheduledFor: string | null;
  publishedAt: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  order: number;
  reach: number;
  impressions: number;
  engagement: number;
  saves: number;
  commentCount: number;
}

const POST_CAPTIONS = [
  'Novidade chegando! Fique ligado nas nossas ofertas exclusivas',
  'Transforme sua rotina com nossos produtos. Qualidade que voce merece',
  'Resultados que falam por si! Confira o depoimento da @cliente_feliz',
  'Lancamento exclusivo! Disponivel por tempo limitado. Corre!',
  'Sabado de cuidados pessoais. Qual e o seu favorito? Conta pra gente!',
  'Bastidores da producao — transparencia e qualidade em cada etapa',
  'Promocao de verao! Ate 40% OFF em produtos selecionados',
  'Dica do especialista: como usar nosso produto para melhores resultados',
  'Obrigado por 10k seguidores! Voces sao incriveis',
  'Novo tutorial no feed! Passo a passo completo. Salva pra depois!',
  'Parceria especial com @influencer — conteudo exclusivo essa semana',
  'Atras das cameras: conheca nossa equipe de producao',
];

const POST_HASHTAGS = [
  ['#skincare', '#beleza', '#cuidadospessoais'],
  ['#lancamento', '#novidade', '#exclusivo'],
  ['#promocao', '#desconto', '#oferta'],
  ['#dicas', '#tutorial', '#howto'],
  ['#bastidores', '#behindthescenes', '#equipe'],
  ['#fitness', '#saude', '#bemestar'],
];

const PLACEHOLDER_COLORS = [
  'e8d5f5', 'f5d5e8', 'd5e8f5', 'f5e8d5', 'd5f5e8', 'f5f5d5',
  'e0d0f0', 'f0d0e0', 'd0e0f0', 'f0e0d0', 'd0f0e0', 'f0f0d0',
];

export function generateMockPosts(n: number): MockPost[] {
  return Array.from({ length: n }, (_, i) => {
    const statusRoll = Math.random();
    const status: MockPost['status'] = statusRoll < 0.25 ? 'draft' : statusRoll < 0.5 ? 'scheduled' : statusRoll < 0.95 ? 'published' : 'failed';
    const isPublished = status === 'published';
    const color = PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length];

    return {
      id: `post-${i + 1}`,
      mediaType: (['image', 'image', 'image', 'carousel', 'reel'] as const)[Math.floor(Math.random() * 5)],
      imageUrl: `https://placehold.co/400x400/${color}/333?text=Post+${i + 1}`,
      caption: POST_CAPTIONS[i % POST_CAPTIONS.length],
      hashtags: POST_HASHTAGS[Math.floor(Math.random() * POST_HASHTAGS.length)],
      scheduledFor: status === 'scheduled'
        ? new Date(Date.now() + (1 + Math.floor(Math.random() * 14)) * 864e5).toISOString()
        : null,
      publishedAt: isPublished ? randomDate(30) : null,
      status,
      order: i,
      reach: isPublished ? 200 + Math.floor(Math.random() * 8000) : 0,
      impressions: isPublished ? 500 + Math.floor(Math.random() * 15000) : 0,
      engagement: isPublished ? Math.random() * 0.12 : 0,
      saves: isPublished ? Math.floor(Math.random() * 200) : 0,
      commentCount: isPublished ? Math.floor(Math.random() * 80) : 0,
    };
  });
}

export const DEMO_POSTS = generateMockPosts(18);

// ─── AI Influencers ────────────────────────────────────────

export interface MockInfluencer {
  id: string;
  name: string;
  niche: string;
  style: string;
  profileImageUrl: string;
  followerCount: number;
  engagementRate: number;
  bio: string;
  postsCount: number;
  isAiGenerated: boolean;
}

export const DEMO_INFLUENCERS: MockInfluencer[] = [
  {
    id: 'inf-1', name: 'Luna Tech', niche: 'tech', style: 'Futurista / Minimalista',
    profileImageUrl: 'https://placehold.co/200x200/3b82f6/fff?text=LT',
    followerCount: 52400, engagementRate: 0.042, bio: 'IA especialista em tecnologia e inovacao',
    postsCount: 0, isAiGenerated: true,
  },
  {
    id: 'inf-2', name: 'Vitalis Health', niche: 'health', style: 'Clean / Profissional',
    profileImageUrl: 'https://placehold.co/200x200/22c55e/fff?text=VH',
    followerCount: 38700, engagementRate: 0.056, bio: 'Dicas de saude e bem-estar baseadas em ciencia',
    postsCount: 0, isAiGenerated: true,
  },
  {
    id: 'inf-3', name: 'Glow by AI', niche: 'beauty', style: 'Glamour / Tendencia',
    profileImageUrl: 'https://placehold.co/200x200/ec4899/fff?text=GA',
    followerCount: 91200, engagementRate: 0.038, bio: 'Beleza e skincare com inteligencia artificial',
    postsCount: 0, isAiGenerated: true,
  },
  {
    id: 'inf-4', name: 'FitBot Prime', niche: 'fitness', style: 'Motivacional / Energetico',
    profileImageUrl: 'https://placehold.co/200x200/ef4444/fff?text=FB',
    followerCount: 67300, engagementRate: 0.061, bio: 'Treinos, nutricao e motivacao diaria',
    postsCount: 0, isAiGenerated: true,
  },
  {
    id: 'inf-5', name: 'Edu Mind', niche: 'education', style: 'Didatico / Acessivel',
    profileImageUrl: 'https://placehold.co/200x200/8b5cf6/fff?text=EM',
    followerCount: 29800, engagementRate: 0.073, bio: 'Conteudo educativo de alta qualidade',
    postsCount: 0, isAiGenerated: true,
  },
  {
    id: 'inf-6', name: 'BizFlow AI', niche: 'business', style: 'Corporativo / Moderno',
    profileImageUrl: 'https://placehold.co/200x200/06b6d4/fff?text=BF',
    followerCount: 44100, engagementRate: 0.048, bio: 'Empreendedorismo e negocios digitais',
    postsCount: 0, isAiGenerated: true,
  },
];

// ────────────────────────────────────────────────────────────

export const DEMO_METRICS = {
  totalComments: 1770,
  totalDMs: 534,
  totalAutoReplies: 1204,
  totalEscalated: 105,
  conversionRate: 0.23,
  responseTimeAvg: 38,
  classifications: [
    { cls: 'duvida', count: 445 },
    { cls: 'elogio', count: 389 },
    { cls: 'preco', count: 312 },
    { cls: 'interesse', count: 267 },
    { cls: 'spam', count: 156 },
    { cls: 'reclamacao', count: 89 },
    { cls: 'suporte', count: 67 },
    { cls: 'parceria', count: 34 },
  ],
};
