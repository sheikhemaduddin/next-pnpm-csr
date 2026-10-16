'use client';

import { io } from 'socket.io-client';

let socket;

/** Shared Socket.IO client — polling-first, then WebSocket upgrade. */
export function getSocket() {
  if (typeof window === 'undefined') return null;

  if (!socket) {
    socket = io({
      path: '/socket.io',
      // Prefer polling (works behind most reverse proxies); allow WS upgrade.
      transports: ['polling', 'websocket'],
      upgrade: true,
      rememberUpgrade: false,
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
    });
  }

  return socket;
}

export function resetSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
