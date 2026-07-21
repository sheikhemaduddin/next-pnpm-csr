'use client';

import { useCallback, useEffect, useState } from 'react';
import ClientHead from './ClientHead';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ScoresView from './components/ScoresView';
import NewsView from './components/NewsView';
import StandingsView from './components/StandingsView';
import LeadersView from './components/LeadersView';
import ArticleView from './components/ArticleView';

const VALID_VIEWS = ['home', 'scores', 'news', 'standings', 'leaders'];

function parseHash() {
  const hash = window.location.hash.slice(1);
  if (hash.startsWith('article/')) {
    const id = parseInt(hash.split('/')[1], 10);
    return { view: 'article', articleId: isNaN(id) ? null : id };
  }
  return { view: VALID_VIEWS.includes(hash) ? hash : 'home', articleId: null };
}

export default function SpaPage() {
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

  return (
    <>
      <ClientHead
        title="PitchPulse — Live Sports Scores & News"
        description="Live football and basketball scores, standings, and breaking sports news."
      />
      {!mounted ? (
        <div className="app">
          <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading PitchPulse…
          </div>
        </div>
      ) : (
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
              {currentView === 'leaders' && <LeadersView />}
              {currentView === 'article' && (
                <ArticleView articleId={articleId} onBack={goBack} />
              )}
            </div>
          </main>
          <Footer onNavigate={navigate} />
        </div>
      )}
    </>
  );
}
