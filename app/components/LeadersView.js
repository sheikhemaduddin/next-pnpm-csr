'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setRows([]);

      if (!hasSupabaseConfig()) {
        if (!cancelled) {
          setError(
            'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then rebuild.'
          );
          setLoading(false);
        }
        return;
      }

      try {
        const supabase = createClient();
        const { data, error: queryError } = await supabase
          .from('leaders')
          .select('id, category, player_name, team, sport, value, unit, rank, season')
          .eq('category', category)
          .order('rank', { ascending: true });

        if (cancelled) return;

        if (queryError) {
          setError(queryError.message);
          setRows([]);
        } else {
          setRows(data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Failed to load leaders from Supabase');
          setRows([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
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
      <p className="section-sub">Live ranking from Supabase · {activeTab?.unitHint}</p>

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

      {loading && <p className="leaders-status">Loading from Supabase…</p>}

      {!loading && error && (
        <div className="leaders-empty">
          <p role="alert">{error}</p>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="leaders-empty">
          <p>No {category === 'scorer' ? 'scorers' : 'bowlers'} in Supabase yet.</p>
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
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
                    <td className="stat-num" style={{ textAlign: 'left' }}>{row.team}</td>
                    <td className="stat-num stat-pts">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Season {rows[0].season} · Supabase <code>leaders</code> table
          </p>
        </>
      )}
    </div>
  );
}
