'use client';

const VIEWS = [
  { id: 'home', label: 'Home' },
  { id: 'scores', label: 'Live Scores' },
  { id: 'news', label: 'News' },
  { id: 'standings', label: 'Standings' },
  { id: 'leaders', label: 'Leaders' },
  { id: 'live', label: 'Live Feed' },
];

export default function Header({ currentView, onNavigate, user, onLogout }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <button className="logo" onClick={() => onNavigate('home')} aria-label="PitchPulse Home">
            <span className="logo-icon">⚽</span>
            PitchPulse
          </button>
          <nav className="nav" aria-label="Main navigation">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                className={`nav-btn${currentView === v.id ? ' active' : ''}`}
                onClick={() => onNavigate(v.id)}
              >
                {v.label}
              </button>
            ))}
          </nav>
          <div className="header-actions">
            <span className="live-pill">
              <span className="live-dot" />
              Live
            </span>
            {user && (
              <span className="live-meta" title={user.email}>
                {user.name || user.email}
              </span>
            )}
            <button type="button" className="nav-btn login-link" onClick={onLogout}>
              Log out
            </button>
          </div>
        </div>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              className={`nav-btn${currentView === v.id ? ' active' : ''}`}
              onClick={() => onNavigate(v.id)}
            >
              {v.label}
            </button>
          ))}
          <button type="button" className="nav-btn login-link" onClick={onLogout}>
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
