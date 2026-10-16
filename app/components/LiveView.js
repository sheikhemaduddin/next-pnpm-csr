'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '../../lib/socket';

const MAX_EVENTS = 20;

export default function LiveView() {
  const [status, setStatus] = useState('connecting');
  const [transport, setTransport] = useState('—');
  const [events, setEvents] = useState([]);
  const [hello, setHello] = useState(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return undefined;

    const onConnect = () => {
      setStatus('connected');
      setTransport(socket.io.engine?.transport?.name || 'polling');
    };
    const onDisconnect = () => setStatus('disconnected');
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
    socket.on('live:hello', onHello);
    socket.on('live:transport', onTransport);
    socket.on('live:event', onEvent);

    if (socket.connected) onConnect();

    // Keepalive ping over the same Socket.IO channel (works on polling).
    const pingId = setInterval(() => {
      if (!socket.connected) return;
      socket.emit('live:ping', { t: Date.now() });
    }, 15000);

    return () => {
      clearInterval(pingId);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('live:hello', onHello);
      socket.off('live:transport', onTransport);
      socket.off('live:event', onEvent);
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

      <div className="live-feed">
        {events.length === 0 && (
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
