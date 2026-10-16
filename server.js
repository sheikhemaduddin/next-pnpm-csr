// Custom Next.js server (entry file: server.js).
// Runs Next.js as a persistent Node process + Socket.IO (polling-first).
const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

const LIVE_EVENTS = [
  { type: 'goal', text: 'GOAL! Arsenal 2-1 Man City — Saka 67\'' },
  { type: 'card', text: 'Yellow card — Rodri (Man City)' },
  { type: 'sub', text: 'Substitution — Liverpool: Diaz on for Gakpo' },
  { type: 'goal', text: 'GOAL! Chelsea 1-0 Tottenham — Palmer 23\'' },
  { type: 'var', text: 'VAR check — possible handball in the box' },
  { type: 'save', text: 'Great save by Raya from Haaland' },
];

function parseRequestUrl(reqUrl) {
  const url = new URL(reqUrl, 'http://localhost');
  return {
    pathname: url.pathname,
    query: Object.fromEntries(url.searchParams),
    search: url.search,
    href: url.href,
    path: `${url.pathname}${url.search}`,
  };
}

function sendHealthz(res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      ok: true,
      mode: 'next-custom-ssr',
      socket: 'socket.io',
      transports: ['polling', 'websocket'],
      runtime: `node ${process.version}`,
    })
  );
}

app.prepare().then(() => {
  // Socket.IO registers its own 'request'/'upgrade' listeners on this server.
  // Do NOT pass /socket.io through Next — that breaks the polling handshake.
  const httpServer = createServer((req, res) => {
    if (req.url?.startsWith('/socket.io')) {
      return;
    }

    const parsedUrl = parseRequestUrl(req.url);

    if (parsedUrl.pathname === '/healthz') {
      sendHealthz(res);
      return;
    }

    handle(req, res, parsedUrl);
  });

  // Polling first (long-polling), then optional WebSocket upgrade.
  const io = new Server(httpServer, {
    path: '/socket.io',
    transports: ['polling', 'websocket'],
    allowUpgrades: true,
    cors: { origin: true, credentials: true },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  io.on('connection', (socket) => {
    const transport = socket.conn.transport.name;
    console.log(`[socket.io] client connected transport=${transport} id=${socket.id}`);

    socket.emit('live:hello', {
      message: 'Connected to PitchPulse live feed',
      transport,
      at: new Date().toISOString(),
    });

    // Send one event immediately so the UI is not stuck on "waiting".
    socket.emit('live:event', {
      type: 'goal',
      text: 'Live feed online — waiting for match events…',
      id: `hello-${socket.id}`,
      at: new Date().toISOString(),
    });

    socket.conn.on('upgrade', () => {
      socket.emit('live:transport', {
        transport: socket.conn.transport.name,
        at: new Date().toISOString(),
      });
    });

    socket.on('live:ping', (payload, ack) => {
      const response = { pong: true, echo: payload || null, at: new Date().toISOString() };
      if (typeof ack === 'function') ack(response);
      else socket.emit('live:pong', response);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[socket.io] client disconnected id=${socket.id} reason=${reason}`);
    });
  });

  // Broadcast mock live match events every 5s over the Socket.IO channel.
  setInterval(() => {
    const event = LIVE_EVENTS[Math.floor(Math.random() * LIVE_EVENTS.length)];
    io.emit('live:event', {
      ...event,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      at: new Date().toISOString(),
    });
  }, 5000);

  httpServer.listen(port, () => {
    console.log(`[next-custom-ssr] ready on ${port} (${dev ? 'dev' : 'production'})`);
    console.log(`[socket.io] path=/socket.io transports=polling,websocket`);
  });
});
