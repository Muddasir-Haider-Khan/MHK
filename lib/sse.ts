import { EventEmitter } from 'events';

const globalForSse = globalThis as unknown as {
  sseEmitter: EventEmitter | undefined;
};

export const sseEmitter = globalForSse.sseEmitter ?? new EventEmitter();

// Important: Next.js dev server clears memory on fast refresh.
// Using globalThis ensures the event emitter survives across HMR.
if (process.env.NODE_ENV !== 'production') globalForSse.sseEmitter = sseEmitter;

export function broadcastEvent(type: string, action: string, data: any) {
  sseEmitter.emit('broadcast', {
    event: 'content_updated',
    payload: {
      type,
      action,
      data,
    },
    timestamp: new Date().toISOString()
  });
}
