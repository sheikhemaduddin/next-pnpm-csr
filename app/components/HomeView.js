'use client';

import { useEffect, useState } from 'react';
import { ARTICLES, FEATURED_MATCH, MATCHES, TEAMS, TRENDING } from '../data/sportsData';
import { ScoreRow, TeamBadge } from './ScoreRow';

export default function HomeView({ onNavigate, onOpenArticle }) {
  const [liveMatches, setLiveMatches] = useState(MATCHES.filter((m) => m.status === 'live'));
  const featured = FEATURED_MATCH;
  const home = TEAMS[featured.home];
  const away = TEAMS[featured.away];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMatches((prev) =>
        prev.map((m) => {
          if (m.status !== 'live') return m;
          const min = parseInt(m.minute, 10);
          if (isNaN(min) || min >= 90) return m;
          return { ...m, minute: `${min + 1}'` };
        })
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="view-enter">
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <span className="hero-badge">
            <span className="live-dot" /> Live · Premier League
          </span>
          <h1 className="hero-title">Title race heats up as Arsenal edge past City</h1>
          <p className="hero-meta">Matchday 34 · Emirates Stadium · 62,000 attendance</p>
          <div className="hero-match">
            <div className="hero-team">
              <TeamBadge code={featured.home} size={48} />
              <span>{home.name}</span>
            </div>
            <div>
              <div className="hero-score">{featured.homeScore} – {featured.awayScore}</div>
              <div className="hero-minute">{featured.minute}</div>
            </div>
            <div className="hero-team">
              <TeamBadge code={featured.away} size={48} />
              <span>{away.name}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid-2">
        <div>
          <h2 className="section-title">Latest News</h2>
          <div className="grid-3">
            {ARTICLES.slice(0, 3).map((article) => (
              <article
                key={article.id}
                className="card card-clickable"
                onClick={() => onOpenArticle(article.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpenArticle(article.id)}
              >
                <div className="card-image">
                  <span className="card-image-label">
                    {article.sport === 'basketball' ? '🏀' : '⚽'}
                  </span>
                </div>
                <div className="card-body">
                  <span className="card-tag">{article.category}</span>
                  <h3 className="card-title">{article.title}</h3>
                  <p className="card-excerpt">{article.excerpt}</p>
                  <p className="card-meta">{article.author} · {article.time}</p>
                </div>
              </article>
            ))}
          </div>
          <button className="nav-btn" style={{ marginTop: '1rem' }} onClick={() => onNavigate('news')}>
            View all news →
          </button>
        </div>

        <aside>
          <div className="widget">
            <h3 className="widget-title">Live Now</h3>
            <div className="scores-list">
              {liveMatches.slice(0, 4).map((m) => (
                <ScoreRow key={m.id} match={m} />
              ))}
            </div>
            <button className="nav-btn" style={{ marginTop: '0.75rem', width: '100%' }} onClick={() => onNavigate('scores')}>
              All scores →
            </button>
          </div>

          <div className="widget">
            <h3 className="widget-title">Trending</h3>
            {TRENDING.map((item, i) => (
              <div key={item.id} className="trend-item" onClick={() => onNavigate('news')}>
                <span className="trend-num">{i + 1}</span>
                <span className="trend-text">{item.text}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
