'use client';

import { STANDINGS, TEAMS } from '../data/sportsData';
import { TeamBadge } from './ScoreRow';

export default function StandingsView() {
  return (
    <div className="view-enter">
      <h1 className="section-title">Premier League Standings</h1>
      <p className="section-sub">Season 2025/26 · Matchday 34</p>

      <div className="table-wrap">
        <table className="standings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {STANDINGS.map((row) => {
              const team = TEAMS[row.team];
              return (
                <tr key={row.team}>
                  <td className={`pos${row.pos <= 4 ? ' top4' : ''}`}>{row.pos}</td>
                  <td>
                    <div className="team-cell">
                      <TeamBadge code={row.team} />
                      {team?.name}
                    </div>
                  </td>
                  <td className="stat-num">{row.played}</td>
                  <td className="stat-num">{row.won}</td>
                  <td className="stat-num">{row.drawn}</td>
                  <td className="stat-num">{row.lost}</td>
                  <td className="stat-num">{row.gf}</td>
                  <td className="stat-num">{row.ga}</td>
                  <td className="stat-num stat-pts">{row.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Top 4 qualify for the UEFA Champions League
      </p>
    </div>
  );
}
