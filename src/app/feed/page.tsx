'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DEMO_POSTS, type MockPost } from '@/lib/mock-data';
import {
  FeedGrid,
  MobilePreview,
  DesktopPreview,
  PostEditor,
  PostMetricsCard,
  PublishingQueue,
  CalendarView,
  PreviewToggle,
  FeedStats,
} from '@/components/feed-components';
import {
  CalendarDays,
  LayoutGrid,
  Clock,
  Plus,
  Sparkles,
} from '@/components/icons';

type Tab = 'calendar' | 'grid' | 'queue';

const TABS: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
  { id: 'calendar', label: 'Calendario', icon: CalendarDays },
  { id: 'grid', label: 'Grade Visual', icon: LayoutGrid },
  { id: 'queue', label: 'Fila de Publicacao', icon: Clock },
];

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<Tab>('grid');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [selectedPost, setSelectedPost] = useState<MockPost | null>(null);
  const [posts, setPosts] = useState<MockPost[]>(DEMO_POSTS);
  const [showEditor, setShowEditor] = useState(false);

  const handleSelectPost = (post: MockPost) => {
    setSelectedPost(post);
    setShowEditor(true);
  };

  const handleUpdatePost = (updatedPost: MockPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    setSelectedPost(updatedPost);
    setShowEditor(false);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
  };

  const handleNewPost = () => {
    const newPost: MockPost = {
      id: `post-${Date.now()}`,
      mediaType: 'image',
      imageUrl: `https://placehold.co/400x400/1a1a2e/666?text=Novo+Post`,
      caption: '',
      hashtags: [],
      scheduledFor: null,
      publishedAt: null,
      status: 'draft',
      order: posts.length,
      reach: 0,
      impressions: 0,
      engagement: 0,
      saves: 0,
      commentCount: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    setSelectedPost(newPost);
    setShowEditor(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white/90 flex items-center gap-2">
            <CalendarDays size={22} className="text-[#E1306C]" />
            Planejamento de Feed
          </h1>
          <p className="text-xs text-white/30 mt-1">
            Visualize, organize e agende seus posts do Instagram
          </p>
        </div>
        <button
          onClick={handleNewPost}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all',
            'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
            'text-white shadow-lg shadow-[#E1306C]/20 hover:shadow-[#E1306C]/35 hover:scale-[1.02] active:scale-[0.98]'
          )}
        >
          <Plus size={14} />
          Novo Post
        </button>
      </div>

      {/* Stats Bar */}
      <FeedStats posts={posts} />

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                  activeTab === tab.id
                    ? 'bg-white/[0.08] text-white/90 shadow-sm'
                    : 'text-white/30 hover:text-white/50'
                )}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'grid' && (
          <PreviewToggle mode={previewMode} onChange={setPreviewMode} />
        )}
      </div>

      {/* Main Content */}
      {activeTab === 'calendar' && (
        <CalendarView posts={posts} onSelect={handleSelectPost} />
      )}

      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PublishingQueue posts={posts} onSelect={handleSelectPost} />
          {showEditor && selectedPost ? (
            <div className="space-y-4">
              <PostEditor
                post={selectedPost}
                onUpdate={handleUpdatePost}
                onClose={handleCloseEditor}
              />
              <PostMetricsCard post={selectedPost} />
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center">
              <Clock size={32} className="mx-auto text-white/10 mb-3" />
              <p className="text-sm text-white/30">Selecione um post agendado para editar</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Preview Panel */}
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">
                    Preview do Feed
                  </h3>
                  <div className="flex items-center gap-1 text-[9px] text-white/20">
                    <Sparkles size={9} />
                    Arraste para reordenar
                  </div>
                </div>

                {previewMode === 'mobile' ? (
                  <MobilePreview
                    posts={posts}
                    username="minha_conta"
                    selectedId={selectedPost?.id || null}
                    onSelect={handleSelectPost}
                  />
                ) : (
                  <DesktopPreview
                    posts={posts}
                    username="minha_conta"
                    selectedId={selectedPost?.id || null}
                    onSelect={handleSelectPost}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Editor / Metrics Panel */}
          <div className="lg:col-span-7 space-y-4">
            {/* Full Grid */}
            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                Todos os Posts ({posts.length})
              </h3>
              <FeedGrid
                posts={posts}
                selectedId={selectedPost?.id || null}
                onSelect={handleSelectPost}
              />
            </div>

            {/* Editor */}
            {showEditor && selectedPost ? (
              <div className="space-y-4">
                <PostEditor
                  post={selectedPost}
                  onUpdate={handleUpdatePost}
                  onClose={handleCloseEditor}
                />
                <PostMetricsCard post={selectedPost} />
              </div>
            ) : (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center">
                <LayoutGrid size={32} className="mx-auto text-white/10 mb-3" />
                <p className="text-sm text-white/30">Clique em um post para editar</p>
                <p className="text-[11px] text-white/20 mt-1">
                  Edite a legenda, hashtags, tipo de midia e agende a publicacao
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
