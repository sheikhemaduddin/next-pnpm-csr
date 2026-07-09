import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>PitchPulse</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
