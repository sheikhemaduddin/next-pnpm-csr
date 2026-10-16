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
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 10000,
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
