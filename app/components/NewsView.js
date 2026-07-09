'use client';

import { useState } from 'react';
import { ARTICLES } from '../data/sportsData';

const FILTERS = [
  { id: 'all', label: 'All Sports' },
  { id: 'football', label: 'Football' },
  { id: 'basketball', label: 'Basketball' },
];

export default function NewsView({ onOpenArticle }) {
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all' ? ARTICLES : ARTICLES.filter((a) => a.sport === filter);

  return (
    <div className="view-enter">
      <h1 className="section-title">Sports News</h1>
      <p className="section-sub">Breaking stories, analysis, and transfer updates</p>

      <div className="tabs">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`tab${filter === f.id ? ' active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid-3">
        {filtered.map((article) => (
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
    </div>
  );
}
