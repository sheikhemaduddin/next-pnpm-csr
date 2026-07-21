'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { getLeadersByCategory } from '../data/leadersSeed';

const TABS = [
  { id: 'scorer', label: 'Top Scorers', unitHint: 'Goals' },
  { id: 'bowler', label: 'Top Bowlers', unitHint: 'Wickets' },
];

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')
  );
}

export default function LeadersView() {
  const [category, setCategory] = useState('scorer');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('local');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      // Prefer Supabase when configured; otherwise use tiny local seed (no Docker).
      if (hasSupabaseConfig()) {
        try {
          const supabase = createClient();
          const { data, error: queryError } = await supabase
            .from('leaders')
            .select('id, category, player_name, team, sport, value, unit, rank, season')
            .eq('category', category)
            .order('rank', { ascending: true });

          if (!cancelled && !queryError && data?.length) {
            setRows(data);
            setSource('supabase');
            setLoading(false);
            return;
          }
        } catch {
          // fall through to local seed
        }
      }

      if (!cancelled) {
        setRows(getLeadersByCategory(category));
        setSource('local');
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [category]);

  const activeTab = TABS.find((t) => t.id === category);

  return (
    <div className="view-enter">
      <h1 className="section-title">Leaders</h1>
      <p className="section-sub">
        {source === 'supabase' ? 'Live ranking from Supabase' : 'Local seed data'} · {activeTab?.unitHint}
      </p>

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

      {loading && <p className="leaders-status">Loading leaders…</p>}

      {!loading && rows.length === 0 && (
        <div className="leaders-empty">
          <p>No {category === 'scorer' ? 'scorers' : 'bowlers'} found yet.</p>
        </div>
      )}

      {!loading && rows.length > 0 && (
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
                  <td className="stat-num" style={{ textAlign: 'left' }}>{row.team}</td>
                  <td className="stat-num stat-pts">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && rows.length > 0 && (
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Season {rows[0].season} · {source === 'supabase' ? 'Supabase leaders table' : 'local seed (no Docker)'}
        </p>
      )}
    </div>
  );
}
