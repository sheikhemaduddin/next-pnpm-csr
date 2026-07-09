'use client';

import { TEAMS } from '../data/sportsData';

export function TeamBadge({ code, size = 28 }) {
  const team = TEAMS[code];
  if (!team) return null;
  return (
    <span
      className="team-dot"
      style={{ background: team.color, width: size, height: size, fontSize: size * 0.35 }}
      title={team.name}
    >
      {team.abbr.slice(0, 2)}
    </span>
  );
}

export function ScoreRow({ match }) {
  const home = TEAMS[match.home];
  const away = TEAMS[match.away];
  const isLive = match.status === 'live';
  const isUpcoming = match.status === 'upcoming';

  return (
    <div className={`score-row${isLive ? ' live' : ''}`}>
      <div className="score-team">
        <TeamBadge code={match.home} />
        <span>{home?.name}</span>
      </div>
      <div className="score-center">
        {isUpcoming ? (
          <span className="score-value" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>vs</span>
        ) : (
          <span className="score-value">{match.homeScore} – {match.awayScore}</span>
        )}
        <div className={`score-status ${match.status}`}>{match.minute}</div>
      </div>
      <div className="score-team away">
        <TeamBadge code={match.away} />
        <span>{away?.name}</span>
      </div>
    </div>
  );
}
