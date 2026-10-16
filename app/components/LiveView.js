'use client';

import { useEffect, useRef, useState } from 'react';
import { getSocket, resetSocket } from '../../lib/socket';

const MAX_EVENTS = 20;

export default function LiveView() {
  const [status, setStatus] = useState('connecting');
  const [transport, setTransport] = useState('—');
  const [events, setEvents] = useState([]);
  const [hello, setHello] = useState(null);
  const [error, setError] = useState(null);
  const sinceRef = useRef('');
  const seenRef = useRef(new Set());

  useEffect(() => {
    let cancelled = false;
    let pollTimer;
    let usingHttpPoll = false;

    const pushEvents = (incoming) => {
      if (!incoming?.length) return;
      setEvents((prev) => {
        const next = [...prev];
        for (const ev of incoming) {
          if (seenRef.current.has(ev.id)) continue;
          seenRef.current.add(ev.id);
          next.unshift(ev);
          if (!sinceRef.current || ev.at > sinceRef.current) sinceRef.current = ev.at;
        }
        return next.slice(0, MAX_EVENTS);
      });
    };

    const startHttpPoll = (reason) => {
      if (usingHttpPoll || cancelled) return;
      usingHttpPoll = true;
      resetSocket();
      setStatus('connected');
      setTransport('http-poll');
      setHello({ message: 'Using HTTP poll (Cloudways-safe fallback)' });
      setError(reason ? `Socket.IO unavailable (${reason}) — switched to HTTP poll` : null);

      const tick = async () => {
        if (cancelled) return;
        try {
          const qs = sinceRef.current ? `?since=${encodeURIComponent(sinceRef.current)}` : '';
          const res = await fetch(`/api/live/poll${qs}`, { cache: 'no-store' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (!cancelled) {
            setStatus('connected');
            setTransport('http-poll');
            pushEvents(data.events || []);
          }
        } catch (err) {
          if (!cancelled) {
            setStatus('error');
            setError(err?.message || 'HTTP poll failed');
          }
        } finally {
          if (!cancelled) pollTimer = setTimeout(tick, 1000);
        }
      };

      tick();
    };

    resetSocket();
    const socket = getSocket();
    if (!socket) {
      startHttpPoll('no browser socket');
      return undefined;
    }

    const failTimer = setTimeout(() => {
      if (!socket.connected) startHttpPoll('xhr poll timeout');
    }, 4000);

    const onConnect = () => {
      clearTimeout(failTimer);
      setStatus('connected');
      setError(null);
      setTransport(socket.io.engine?.transport?.name || 'polling');
    };
    const onDisconnect = (reason) => {
      if (!usingHttpPoll) startHttpPoll(reason || 'disconnect');
    };
    const onConnectError = (err) => {
      startHttpPoll(err?.message || 'xhr poll error');
    };
    const onHello = (payload) => {
      setHello(payload);
      setTransport(payload.transport || 'polling');
    };
    const onTransport = (payload) => setTransport(payload.transport || '—');
    const onEvent = (payload) => pushEvents([payload]);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('live:hello', onHello);
    socket.on('live:transport', onTransport);
    socket.on('live:event', onEvent);

    if (socket.connected) onConnect();

    return () => {
      cancelled = true;
      clearTimeout(failTimer);
      clearTimeout(pollTimer);
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
      <p className="section-sub">Realtime updates · Socket.IO polling with HTTP poll fallback</p>

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
        </div>
      )}

      <div className="live-feed">
        {events.length === 0 && status === 'connected' && (
          <p className="leaders-status">Waiting for live match events…</p>
        )}
        {events.length === 0 && status === 'connecting' && (
          <p className="leaders-status">Connecting…</p>
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
