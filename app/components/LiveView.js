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
    let mode = 'http'; // http | socket

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

    const stopHttpPoll = () => {
      clearTimeout(pollTimer);
      pollTimer = undefined;
    };

    const tickHttp = async () => {
      if (cancelled || mode !== 'http') return;
      try {
        const qs = sinceRef.current ? `?since=${encodeURIComponent(sinceRef.current)}` : '';
        const res = await fetch(`/api/live/poll${qs}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled && mode === 'http') {
          setStatus('connected');
          setTransport('http-poll');
          setHello({ message: 'Live via HTTP poll' });
          setError(null);
          pushEvents(data.events || []);
        }
      } catch (err) {
        if (!cancelled && mode === 'http') {
          setStatus('error');
          setError(err?.message || 'Live poll failed');
        }
      } finally {
        if (!cancelled && mode === 'http') {
          pollTimer = setTimeout(tickHttp, 1000);
        }
      }
    };

    // Primary path: HTTP long-poll (works when Cloudways blocks /socket.io).
    setTransport('http-poll');
    setHello({ message: 'Connecting via HTTP poll…' });
    tickHttp();

    // Optional upgrade: if Socket.IO connects, prefer it and stop HTTP poll.
    resetSocket();
    const socket = getSocket();
    if (!socket) {
      return () => {
        cancelled = true;
        stopHttpPoll();
      };
    }

    const onConnect = () => {
      if (cancelled) return;
      mode = 'socket';
      stopHttpPoll();
      setStatus('connected');
      setError(null);
      setTransport(socket.io.engine?.transport?.name || 'polling');
      setHello({ message: 'Connected to PitchPulse live feed' });
    };
    const onDisconnect = () => {
      if (cancelled || mode !== 'socket') return;
      mode = 'http';
      setTransport('http-poll');
      setHello({ message: 'Live via HTTP poll' });
      tickHttp();
    };
    const onHello = (payload) => {
      if (mode === 'socket') {
        setHello(payload);
        setTransport(payload.transport || 'polling');
      }
    };
    const onTransport = (payload) => {
      if (mode === 'socket') setTransport(payload.transport || '—');
    };
    const onEvent = (payload) => {
      if (mode === 'socket') pushEvents([payload]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('live:hello', onHello);
    socket.on('live:transport', onTransport);
    socket.on('live:event', onEvent);
    // Ignore connect_error — HTTP poll already covers the feed.
    socket.on('connect_error', () => {});

    if (socket.connected) onConnect();

    return () => {
      cancelled = true;
      stopHttpPoll();
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('live:hello', onHello);
      socket.off('live:transport', onTransport);
      socket.off('live:event', onEvent);
      socket.off('connect_error');
      resetSocket();
    };
  }, []);

  return (
    <div className="view-enter">
      <h1 className="section-title">Live Feed</h1>
      <p className="section-sub">Realtime updates · HTTP poll (Socket.IO when available)</p>

      <div className="live-status-row">
        <span className={`live-status-badge ${status}`}>
          <span className="live-dot" />
          {status}
        </span>
        <span className="live-meta">
          Transport: <strong>{transport}</strong>
        </span>
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
