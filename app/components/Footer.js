'use client';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-copy">
          © {new Date().getFullYear()} PitchPulse Sports · Client-rendered SPA demo
        </div>
        <div className="footer-links">
          <button onClick={() => onNavigate('home')}>Home</button>
          <button onClick={() => onNavigate('scores')}>Scores</button>
          <button onClick={() => onNavigate('news')}>News</button>
          <button onClick={() => onNavigate('standings')}>Standings</button>
        </div>
      </div>
    </footer>
  );
}
