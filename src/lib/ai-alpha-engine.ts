/**
 * AI Alpha Engine — Pattern-matching query processor
 * Analyzes mock data without LLM calls. Pure logic-based insights.
 */

import {
  DEMO_METRICS,
  DEMO_ACCOUNTS,
  DEMO_INFLUENCERS,
  DEMO_POSTS,
  DEMO_RULES,
  DEMO_FLOWS,
  generateMockComments,
} from './mock-data';

export type ResponseType = 'insight' | 'comparison' | 'recommendation' | 'summary' | 'metric';

export interface AIAlphaResponse {
  text: string;
  type: ResponseType;
  data?: Record<string, any>;
}

/**
 * Normalize Portuguese text for pattern matching
 */
function normalizePtQuery(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents
}

/**
 * Find best matching intent from query
 */
function detectIntent(query: string): string {
  const normalized = normalizePtQuery(query);

  const intents = {
    'influencer_comparison': [
      'compare', 'comparar', 'versus', 'vs', 'diferenca', 'melhor',
      'qual influencer', 'quem teve', 'alcance'
    ],
    'best_posting_time': [
      'melhor horario', 'melhor hora', 'quando postar', 'melhor tempo',
      'timing', 'schedule', 'horario', 'publicar'
    ],
    'campaign_recommendation': [
      'campanha', 'black friday', 'promocao', 'parceria', 'ideal',
      'quem seria', 'recomendacao', 'sugestao'
    ],
    'weekly_summary': [
      'resume', 'resumo', 'ultimos 7 dias', 'esta semana', 'performance',
      'insights', 'overview', 'sumario'
    ],
    'top_posts': [
      'qual post', 'melhor post', 'mais', 'salvamentos', 'saves',
      'alcance', 'impressoes', 'engagement', 'engajamento', 'comentarios'
    ],
    'account_metrics': [
      'contas', 'accounts', 'processados', 'estatisticas', 'total',
      'respostas', 'dms', 'comentarios'
    ],
    'automation_rules': [
      'regras', 'rules', 'automacao', 'automation', 'como funciona',
      'ativo', 'trigger', 'acao'
    ],
  };

  for (const [intent, keywords] of Object.entries(intents)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        return intent;
      }
    }
  }

  return 'general_summary';
}

/**
 * Influencer comparison: "Compare @X vs @Y"
 */
function handleInfluencerComparison(query: string): AIAlphaResponse {
  const influencers = DEMO_INFLUENCERS.sort(
    (a, b) => b.engagementRate - a.engagementRate
  );

  const topInfluencer = influencers[0];
  const secondInfluencer = influencers[1];

  const text = `📊 **Comparação de Influenciadores**\n\n` +
    `🥇 **${topInfluencer.name}** lidera em engajamento:\n` +
    `   • Followers: ${(topInfluencer.followerCount / 1000).toFixed(1)}K\n` +
    `   • Taxa de Engajamento: ${(topInfluencer.engagementRate * 100).toFixed(2)}%\n` +
    `   • Nicho: ${topInfluencer.niche}\n\n` +
    `🥈 **${secondInfluencer.name}** em segundo lugar:\n` +
    `   • Followers: ${(secondInfluencer.followerCount / 1000).toFixed(1)}K\n` +
    `   • Taxa de Engajamento: ${(secondInfluencer.engagementRate * 100).toFixed(2)}%\n` +
    `   • Nicho: ${secondInfluencer.niche}`;

  return {
    text,
    type: 'comparison',
    data: {
      influencers: [topInfluencer, secondInfluencer],
    },
  };
}

/**
 * Best posting time: analyze DEMO_POSTS publishedAt distribution
 */
function handleBestPostingTime(): AIAlphaResponse {
  const publishedPosts = DEMO_POSTS.filter((p) => p.publishedAt);

  if (publishedPosts.length === 0) {
    return {
      text: '📅 Ainda não há posts publicados. Comece a agendar conteúdo para análises futuras!',
      type: 'insight',
    };
  }

  // Simple hour distribution
  const hourMap: Record<number, number> = {};
  publishedPosts.forEach((p) => {
    const hour = new Date(p.publishedAt!).getHours();
    hourMap[hour] = (hourMap[hour] || 0) + 1;
  });

  const bestHour = Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0];
  const hour = parseInt(bestHour[0]);
  const timeStr = `${String(hour).padStart(2, '0')}:00`;

  const text = `⏰ **Melhor Horário para Postar**\n\n` +
    `📍 Baseado em ${publishedPosts.length} posts analisados:\n\n` +
    `🚀 **${timeStr}** é o melhor horário!\n` +
    `   • ${bestHour[1]} posts publicados neste horário\n` +
    `   • Análise de 30 dias de dados\n\n` +
    `💡 Dica: Posts publicados às ${timeStr} tendem a ter maior alcance inicial.`;

  return {
    text,
    type: 'insight',
    data: {
      bestHour: hour,
      postsAnalyzed: publishedPosts.length,
      hourDistribution: hourMap,
    },
  };
}

/**
 * Campaign recommendation: suggest influencers for campaign
 */
function handleCampaignRecommendation(query: string): AIAlphaResponse {
  const normalized = normalizePtQuery(query);

  // Try to detect campaign type or niche
  let targetNiche = 'beauty'; // default
  if (normalized.includes('black friday') || normalized.includes('promocao')) {
    targetNiche = 'fitness'; // high engagement
  } else if (normalized.includes('saude') || normalized.includes('health')) {
    targetNiche = 'health';
  } else if (normalized.includes('tech') || normalized.includes('tecnologia')) {
    targetNiche = 'tech';
  }

  const candidates = DEMO_INFLUENCERS
    .filter((inf) => inf.niche === targetNiche || inf.engagementRate > 0.05)
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 3);

  if (candidates.length === 0) {
    return {
      text: '🎯 Nenhum influenciador disponível para este nicho no momento.',
      type: 'recommendation',
    };
  }

  const topCandidate = candidates[0];
  const text = `🎯 **Recomendação de Parceria**\n\n` +
    `✨ Melhor fit para sua campanha:\n\n` +
    `👑 **${topCandidate.name}**\n` +
    `   • Followers: ${(topCandidate.followerCount / 1000).toFixed(1)}K\n` +
    `   • Engajamento: ${(topCandidate.engagementRate * 100).toFixed(2)}%\n` +
    `   • Estilo: ${topCandidate.style}\n` +
    `   • Bio: ${topCandidate.bio}\n\n` +
    `💪 Por que escolher? Alta taxa de engajamento e audiência qualificada.`;

  return {
    text,
    type: 'recommendation',
    data: {
      candidates,
      topCandidate,
    },
  };
}

/**
 * Weekly summary: summarize DEMO_METRICS
 */
function handleWeeklySummary(): AIAlphaResponse {
  const metrics = DEMO_METRICS;
  const text = `📊 **Resumo de Insights — Últimos 7 Dias**\n\n` +
    `📝 **Comentários**: ${metrics.totalComments} processados\n` +
    `💬 **DMs**: ${metrics.totalDMs} conversas\n` +
    `🤖 **Auto-respostas**: ${metrics.totalAutoReplies} enviadas\n` +
    `⚠️ **Escalados**: ${metrics.totalEscalated}\n\n` +
    `📈 **Conversion Rate**: ${(metrics.conversionRate * 100).toFixed(1)}%\n` +
    `⏱️ **Tempo Médio de Resposta**: ${metrics.responseTimeAvg}s\n\n` +
    `🏆 **Top Classifications**:\n` +
    `   • ${metrics.classifications[0].cls}: ${metrics.classifications[0].count}\n` +
    `   • ${metrics.classifications[1].cls}: ${metrics.classifications[1].count}\n` +
    `   • ${metrics.classifications[2].cls}: ${metrics.classifications[2].count}`;

  return {
    text,
    type: 'summary',
    data: metrics,
  };
}

/**
 * Top posts: find post with most saves/engagement
 */
function handleTopPosts(query: string): AIAlphaResponse {
  const normalized = normalizePtQuery(query);

  let sortBy: 'saves' | 'engagement' | 'reach' = 'engagement';
  if (normalized.includes('salvamentos') || normalized.includes('saves')) {
    sortBy = 'saves';
  } else if (normalized.includes('alcance') || normalized.includes('reach')) {
    sortBy = 'reach';
  }

  const publishedPosts = DEMO_POSTS
    .filter((p) => p.status === 'published')
    .sort((a, b) => {
      if (sortBy === 'saves') return b.saves - a.saves;
      if (sortBy === 'reach') return b.reach - a.reach;
      return b.engagement - a.engagement;
    });

  if (publishedPosts.length === 0) {
    return {
      text: '📍 Nenhum post publicado ainda.',
      type: 'insight',
    };
  }

  const topPost = publishedPosts[0];
  const metricLabel = sortBy === 'saves' ? 'Salvamentos' : sortBy === 'reach' ? 'Alcance' : 'Engajamento';
  const metricValue = sortBy === 'saves' ? topPost.saves : sortBy === 'reach' ? topPost.reach : (topPost.engagement * 100).toFixed(1);

  const text = `🔥 **Melhor Post**\n\n` +
    `"${topPost.caption.slice(0, 60)}..."\n\n` +
    `📊 Métricas:\n` +
    `   • ${metricLabel}: ${metricValue}${sortBy !== 'saves' ? (sortBy === 'reach' ? '' : '%') : ''}\n` +
    `   • Alcance: ${topPost.reach}\n` +
    `   • Impressões: ${topPost.impressions}\n` +
    `   • Comentários: ${topPost.commentCount}\n` +
    `   • Tipo: ${topPost.mediaType}\n\n` +
    `✨ Hashtags: ${topPost.hashtags.join(', ')}`;

  return {
    text,
    type: 'insight',
    data: {
      topPost,
      sortBy,
    },
  };
}

/**
 * Account metrics: show connected accounts and processing stats
 */
function handleAccountMetrics(): AIAlphaResponse {
  const accounts = DEMO_ACCOUNTS;
  const totals = accounts.reduce(
    (acc, a) => ({
      comments: acc.comments + a.totalCommentsProcessed,
      dms: acc.dms + a.totalDmsProcessed,
      replies: acc.replies + a.totalAutoReplies,
    }),
    { comments: 0, dms: 0, replies: 0 }
  );

  const text = `👥 **Contas Conectadas**\n\n` +
    `${accounts.map((a) => `✅ @${a.username}\n   • Comentários: ${a.totalCommentsProcessed}\n   • DMs: ${a.totalDmsProcessed}\n   • Auto-respostas: ${a.totalAutoReplies}`).join('\n\n')}\n\n` +
    `📈 **Totais**:\n` +
    `   • Comentários processados: ${totals.comments}\n` +
    `   • DMs processadas: ${totals.dms}\n` +
    `   • Auto-respostas enviadas: ${totals.replies}`;

  return {
    text,
    type: 'metric',
    data: {
      accounts,
      totals,
    },
  };
}

/**
 * Automation rules: overview of active rules
 */
function handleAutomationRules(): AIAlphaResponse {
  const activeRules = DEMO_RULES.filter((r) => r.isActive);
  const text = `⚙️ **Regras de Automação Ativas**\n\n` +
    `${activeRules.map((r) => `• **${r.name}**\n  Prioridade: ${r.priority} | Matches hoje: ${r.repliesToday}`).join('\n\n')}\n\n` +
    `Total: ${activeRules.length} regras ativas.`;

  return {
    text,
    type: 'insight',
    data: {
      activeRules,
      totalActive: activeRules.length,
    },
  };
}

/**
 * General summary: fallback to overall metrics
 */
function handleGeneralSummary(): AIAlphaResponse {
  const metrics = DEMO_METRICS;
  const text = `📊 **Dashboard AI Alpha**\n\n` +
    `Você pode me fazer perguntas como:\n\n` +
    `• "Qual influencer teve mais engajamento?"\n` +
    `• "Melhor horário pra postar?"\n` +
    `• "Quem seria ideal pra Black Friday?"\n` +
    `• "Resume os insights dos últimos 7 dias"\n` +
    `• "Qual post teve mais salvamentos?"\n` +
    `• "Compare dois influenciadores em alcance"\n\n` +
    `Seu plataforma está processando bem: ${metrics.totalComments} comentários analisados, ${(metrics.conversionRate * 100).toFixed(1)}% de taxa de conversão.`;

  return {
    text,
    type: 'summary',
    data: metrics,
  };
}

/**
 * Main AI Alpha Engine — Query processing
 */
export function processAIAlphaQuery(query: string): AIAlphaResponse {
  if (!query || query.trim().length === 0) {
    return {
      text: '💬 Digite uma pergunta sobre seus dados!',
      type: 'insight',
    };
  }

  const intent = detectIntent(query);

  switch (intent) {
    case 'influencer_comparison':
      return handleInfluencerComparison(query);
    case 'best_posting_time':
      return handleBestPostingTime();
    case 'campaign_recommendation':
      return handleCampaignRecommendation(query);
    case 'weekly_summary':
      return handleWeeklySummary();
    case 'top_posts':
      return handleTopPosts(query);
    case 'account_metrics':
      return handleAccountMetrics();
    case 'automation_rules':
      return handleAutomationRules();
    default:
      return handleGeneralSummary();
  }
}
