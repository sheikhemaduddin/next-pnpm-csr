'use client';

import { ARTICLES } from '../data/sportsData';

export default function ArticleView({ articleId, onBack }) {
  const article = ARTICLES.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="empty-state">
        <p>Article not found.</p>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>
    );
  }

  return (
    <article className="view-enter article-hero">
      <button className="back-btn" onClick={onBack}>← Back to news</button>
      <span className="article-category">{article.category}</span>
      <h1 className="article-headline">{article.title}</h1>
      <p className="article-byline">
        By {article.author} · {article.time}
      </p>
      <div className="article-body">
        {article.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  );
}
