'use client';

import { useState } from 'react';
import { MATCHES } from '../data/sportsData';
import { ScoreRow } from './ScoreRow';

const LEAGUES = ['All', 'Premier League', 'NBA'];

export default function ScoresView() {
  const [league, setLeague] = useState('All');

  const filtered = league === 'All' ? MATCHES : MATCHES.filter((m) => m.league === league);
  const grouped = filtered.reduce((acc, match) => {
    if (!acc[match.league]) acc[match.league] = [];
    acc[match.league].push(match);
    return acc;
  }, {});

  const liveCount = MATCHES.filter((m) => m.status === 'live').length;

  return (
    <div className="view-enter">
      <h1 className="section-title">Live Scores</h1>
      <p className="section-sub">{liveCount} matches live right now</p>

      <div className="chips">
        {LEAGUES.map((l) => (
          <button
            key={l}
            className={`chip${league === l ? ' active' : ''}`}
            onClick={() => setLeague(l)}
          >
            {l}
          </button>
        ))}
      </div>

      {Object.entries(grouped).map(([leagueName, matches]) => (
        <section key={leagueName} style={{ marginBottom: '2rem' }}>
          <div className="league-header">
            <span className="league-name">{leagueName}</span>
            <span className="league-name">
              {matches.filter((m) => m.status === 'live').length} live
            </span>
          </div>
          <div className="scores-list">
            {matches.map((m) => (
              <ScoreRow key={m.id} match={m} />
            ))}
          </div>
        </section>
      ))}

      {filtered.length === 0 && (
        <div className="empty-state">No matches found for this league.</div>
      )}
    </div>
  );
}
