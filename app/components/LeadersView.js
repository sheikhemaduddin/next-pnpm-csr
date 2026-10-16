'use client';

import { useMemo, useState } from 'react';
import { LEADERS } from '../data/sportsData';

const TABS = [
  { id: 'scorer', label: 'Top Scorers', unitHint: 'Goals' },
  { id: 'bowler', label: 'Top Bowlers', unitHint: 'Wickets' },
];

export default function LeadersView() {
  const [category, setCategory] = useState('scorer');

  const rows = useMemo(
    () => LEADERS.filter((r) => r.category === category).sort((a, b) => a.rank - b.rank),
    [category]
  );

  const activeTab = TABS.find((t) => t.id === category);

  return (
    <div className="view-enter">
      <h1 className="section-title">Leaders</h1>
      <p className="section-sub">Local rankings · {activeTab?.unitHint}</p>

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab${category === tab.id ? ' active' : ''}`}
            onClick={() => setCategory(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="leaders-empty">
          <p>No {category === 'scorer' ? 'scorers' : 'bowlers'} yet.</p>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="standings-table leaders-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>{rows[0]?.unit || activeTab?.unitHint}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className={`pos${row.rank <= 3 ? ' top4' : ''}`}>{row.rank}</td>
                    <td>
                      <div className="team-cell">
                        <span className="leader-sport" aria-hidden>
                          {row.sport === 'cricket' ? '🏏' : '⚽'}
                        </span>
                        <span>{row.player_name}</span>
                      </div>
                    </td>
                    <td className="stat-num" style={{ textAlign: 'left' }}>
                      {row.team}
                    </td>
                    <td className="stat-num stat-pts">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Season {rows[0].season}
          </p>
        </>
      )}
    </div>
  );
}
