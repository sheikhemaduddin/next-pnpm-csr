'use client';

import { useEffect, useState } from 'react';
import { getSocket, resetSocket } from '../../lib/socket';

const MAX_EVENTS = 20;

export default function LiveView() {
  const [status, setStatus] = useState('connecting');
  const [transport, setTransport] = useState('—');
  const [events, setEvents] = useState([]);
  const [hello, setHello] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fresh connection each time this view mounts (avoids stuck singleton).
    resetSocket();
    const socket = getSocket();
    if (!socket) return undefined;

    const onConnect = () => {
      setStatus('connected');
      setError(null);
      setTransport(socket.io.engine?.transport?.name || 'polling');
    };
    const onDisconnect = (reason) => {
      setStatus('disconnected');
      setError(`Disconnected: ${reason}`);
    };
    const onConnectError = (err) => {
      setStatus('error');
      setError(err?.message || 'Failed to connect to Socket.IO');
    };
    const onHello = (payload) => {
      setHello(payload);
      setTransport(payload.transport || 'polling');
    };
    const onTransport = (payload) => setTransport(payload.transport || '—');
    const onEvent = (payload) => {
      setEvents((prev) => [payload, ...prev].slice(0, MAX_EVENTS));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('live:hello', onHello);
    socket.on('live:transport', onTransport);
    socket.on('live:event', onEvent);

    if (socket.connected) onConnect();

    const pingId = setInterval(() => {
      if (!socket.connected) return;
      socket.emit('live:ping', { t: Date.now() });
    }, 15000);

    return () => {
      clearInterval(pingId);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('live:hello', onHello);
      socket.off('live:transport', onTransport);
      socket.off('live:event', onEvent);
      resetSocket();
    };
  }, []);

  return (
    <div className="view-enter">
      <h1 className="section-title">Live Feed</h1>
      <p className="section-sub">Socket.IO · polling-first realtime updates</p>

      <div className="live-status-row">
        <span className={`live-status-badge ${status}`}>
          <span className="live-dot" />
          {status}
        </span>
        <span className="live-meta">Transport: <strong>{transport}</strong></span>
        {hello && <span className="live-meta">{hello.message}</span>}
      </div>

      {error && (
        <div className="leaders-empty" style={{ marginBottom: '1rem' }}>
          <p role="alert">{error}</p>
          <p className="section-sub" style={{ margin: 0 }}>
            Ensure the app runs via <code>server.js</code> (not <code>next start</code>) and that
            <code> /socket.io</code> is proxied to Node on Cloudways.
          </p>
        </div>
      )}

      <div className="live-feed">
        {!error && events.length === 0 && (
          <p className="leaders-status">Waiting for live match events…</p>
        )}
        <ul className="live-event-list">
          {events.map((ev) => (
            <li key={ev.id} className={`live-event live-event--${ev.type}`}>
              <span className="live-event-type">{ev.type}</span>
              <span className="live-event-text">{ev.text}</span>
              <time className="live-event-time" dateTime={ev.at}>
                {new Date(ev.at).toLocaleTimeString()}
              </time>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
