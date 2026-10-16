'use client';

import { io } from 'socket.io-client';

let socket;

/** Shared Socket.IO client — polling only (most reliable behind Cloudways proxies). */
export function getSocket() {
  if (typeof window === 'undefined') return null;

  if (!socket) {
    socket = io(window.location.origin, {
      path: '/socket.io',
      transports: ['polling'],
      upgrade: false,
      rememberUpgrade: false,
      withCredentials: false,
      autoConnect: true,
      // Optional upgrade only — LiveView already uses HTTP poll as primary.
      reconnection: false,
      timeout: 5000,
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
