'use client';

import { useState, useCallback } from 'react';
import {
  SearchBar,
  ProfileHero,
  KPICards,
  ContentBreakdown,
  PostingHeatmap,
  TopPosts,
  HashtagAnalysis,
  EngagementDistribution,
  AccountHealth,
  type ProfileData,
  type PostData,
} from '@/components/analytics-components';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Sparkles,
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Eye,
} from '@/components/icons';

export default function AnalyticsPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (handle: string) => {
    setIsLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await fetch(`/api/instagram/lookup?handle=${encodeURIComponent(handle)}&posts=true`);
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || `Erro ${res.status}`);
        setProfile(null);
        setPosts([]);
        return;
      }

      setProfile(data.profile);
      setPosts(data.posts || []);
      setIsDemo(data.demo || false);
    } catch (err) {
      setError('Falha na conexao. Verifique sua internet.');
      setProfile(null);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="text-center pt-2 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E1306C]/5 border border-[#E1306C]/10 mb-3">
          <BarChart3 size={12} className="text-[#E1306C]" />
          <span className="text-[10px] font-bold text-[#E1306C] uppercase tracking-wider">Instagram Analytics</span>
        </div>
        <h1 className="text-2xl font-black text-white/90">
          Analise Qualquer Perfil
        </h1>
        <p className="text-sm text-white/30 mt-1.5 max-w-lg mx-auto">
          Digite o @ e veja metricas completas, engajamento, melhores horarios, hashtags e score de qualidade
        </p>
      </div>

      {/* Search */}
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {/* Error */}
      {error && (
        <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!searched && !profile && (
        <div className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: Eye,
                title: 'Visao Completa',
                desc: 'Metricas de engajamento, alcance, frequencia de posts e analise de conteudo',
              },
              {
                icon: Zap,
                title: 'Insights Instantaneos',
                desc: 'Melhores horarios, hashtags mais eficazes, distribuicao de engajamento',
              },
              {
                icon: Shield,
                title: 'Score de Qualidade',
                desc: 'Avaliacao automatica da saude da conta baseada em multiplos fatores',
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center hover:bg-white/[0.05] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#E1306C]/8 flex items-center justify-center mx-auto mb-3">
                    <Icon size={18} className="text-[#E1306C]" />
                  </div>
                  <h3 className="text-sm font-bold text-white/70 mb-1">{f.title}</h3>
                  <p className="text-[11px] text-white/30 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Quick search suggestions */}
          <div className="text-center mt-8">
            <p className="text-[10px] text-white/20 uppercase tracking-wider font-semibold mb-3">Tente pesquisar</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {['nike', 'nasa', 'natgeo', 'cristiano'].map((handle) => (
                <button
                  key={handle}
                  onClick={() => handleSearch(handle)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/30 bg-white/[0.03] hover:bg-[#E1306C]/10 hover:text-[#E1306C] border border-white/[0.06] hover:border-[#E1306C]/20 transition-all"
                >
                  @{handle}
                  <ArrowRight size={10} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Dashboard */}
      {profile && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Profile Card */}
          <ProfileHero profile={profile} isDemo={isDemo} />

          {/* KPI Cards */}
          <KPICards profile={profile} posts={posts} />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-5">
              {posts.length > 0 && (
                <TopPosts posts={posts} followerCount={profile.followerCount} />
              )}
              {posts.length > 0 && (
                <PostingHeatmap posts={posts} />
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-5">
              <AccountHealth profile={profile} posts={posts} />
              {posts.length > 0 && (
                <ContentBreakdown posts={posts} />
              )}
              {posts.length > 0 && (
                <EngagementDistribution posts={posts} followerCount={profile.followerCount} />
              )}
              {posts.length > 0 && (
                <HashtagAnalysis posts={posts} />
              )}
            </div>
          </div>

          {/* Demo notice */}
          {isDemo && (
            <div className="bg-amber-500/[0.06] border border-amber-500/15 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Sparkles size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-amber-300 mb-1">Dados de Demonstracao</h3>
                  <p className="text-xs text-amber-400/60 leading-relaxed">
                    Para dados reais, configure a variavel <code className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono">SCRAPECREATORS_API_KEY</code> no
                    seu <code className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono">.env.local</code>.
                    Crie sua chave em <a href="https://app.scrapecreators.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-amber-300">app.scrapecreators.com</a> — 100 chamadas gratis.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
