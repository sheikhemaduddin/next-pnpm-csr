'use client';

import { io } from 'socket.io-client';

let socket;

/** Shared Socket.IO client — polling-first, then WebSocket upgrade. */
export function getSocket() {
  if (typeof window === 'undefined') return null;

  if (!socket) {
    socket = io({
      path: '/socket.io',
      transports: ['polling', 'websocket'],
      upgrade: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
  }

  return socket;
}
