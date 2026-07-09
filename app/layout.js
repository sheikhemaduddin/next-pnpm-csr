import './globals.css';

export const metadata = {
  title: 'PitchPulse — Live Sports Scores & News',
  description: 'Live football and basketball scores, standings, and breaking sports news.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
