'use client';

import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ScoresView from './components/ScoresView';
import NewsView from './components/NewsView';
import StandingsView from './components/StandingsView';
import ArticleView from './components/ArticleView';

const VALID_VIEWS = ['home', 'scores', 'news', 'standings'];

function parseHash() {
  if (typeof window === 'undefined') return { view: 'home', articleId: null };
  const hash = window.location.hash.slice(1);
  if (hash.startsWith('article/')) {
    const id = parseInt(hash.split('/')[1], 10);
    return { view: 'article', articleId: isNaN(id) ? null : id };
  }
  return { view: VALID_VIEWS.includes(hash) ? hash : 'home', articleId: null };
}

export default function PitchPulseApp() {
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [articleId, setArticleId] = useState(null);

  const syncFromHash = useCallback(() => {
    const { view, articleId: id } = parseHash();
    setCurrentView(view);
    setArticleId(id);
  }, []);

  useEffect(() => {
    setMounted(true);
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [syncFromHash]);

  const navigate = useCallback((view) => {
    window.location.hash = view === 'home' ? '' : view;
  }, []);

  const openArticle = useCallback((id) => {
    window.location.hash = `article/${id}`;
  }, []);

  const goBack = useCallback(() => {
    window.location.hash = 'news';
  }, []);

  if (!mounted) {
    return (
      <div className="app">
        <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading PitchPulse…
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        currentView={currentView === 'article' ? 'news' : currentView}
        onNavigate={navigate}
      />
      <main className="main">
        <div className="container">
          {currentView === 'home' && (
            <HomeView onNavigate={navigate} onOpenArticle={openArticle} />
          )}
          {currentView === 'scores' && <ScoresView />}
          {currentView === 'news' && <NewsView onOpenArticle={openArticle} />}
          {currentView === 'standings' && <StandingsView />}
          {currentView === 'article' && (
            <ArticleView articleId={articleId} onBack={goBack} />
          )}
        </div>
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
