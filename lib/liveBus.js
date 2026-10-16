/** Shared in-memory live event bus (same Node process as custom server.js).
 * Uses globalThis so Next.js API routes and server.js share one buffer.
 * ensureTicker() keeps events flowing even if only the API route is hit.
 */

const KEY = '__pitchpulse_live_bus__';

function state() {
  if (!globalThis[KEY]) {
    globalThis[KEY] = {
      buffer: [],
      listeners: new Set(),
      ticker: null,
    };
  }
  return globalThis[KEY];
}

const MAX = 50;

const TEMPLATES = [
  { type: 'goal', text: "GOAL! Arsenal 2-1 Man City — Saka 67'" },
  { type: 'card', text: 'Yellow card — Rodri (Man City)' },
  { type: 'sub', text: 'Substitution — Liverpool: Diaz on for Gakpo' },
  { type: 'goal', text: "GOAL! Chelsea 1-0 Tottenham — Palmer 23'" },
  { type: 'var', text: 'VAR check — possible handball in the box' },
  { type: 'save', text: 'Great save by Raya from Haaland' },
];

function push(event) {
  const { buffer, listeners } = state();
  const row = {
    ...event,
    id: event.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: event.at || new Date().toISOString(),
  };
  buffer.unshift(row);
  if (buffer.length > MAX) buffer.length = MAX;
  listeners.forEach((fn) => {
    try {
      fn(row);
    } catch {
      /* ignore subscriber errors */
    }
  });
  return row;
}

function pushRandom() {
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  return push({ ...template });
}

/** Start mock match events once per process (server.js or Next API). */
function ensureTicker() {
  const s = state();
  if (s.ticker) return;
  push({
    type: 'goal',
    text: 'PitchPulse live bus started',
  });
  s.ticker = setInterval(() => {
    pushRandom();
  }, 5000);
  if (typeof s.ticker.unref === 'function') s.ticker.unref();
}

function recent(since) {
  ensureTicker();
  const { buffer } = state();
  if (!since) return buffer.slice();
  const ts = Date.parse(since);
  if (Number.isNaN(ts)) return buffer.slice();
  return buffer.filter((e) => Date.parse(e.at) > ts);
}

function onEvent(fn) {
  const { listeners } = state();
  listeners.add(fn);
  return () => listeners.delete(fn);
}

module.exports = {
  push,
  pushRandom,
  recent,
  onEvent,
  ensureTicker,
  TEMPLATES,
};
